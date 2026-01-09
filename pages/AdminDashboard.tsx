
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, AlertCircle, FileText, Download, ShieldCheck, X, ChevronRight, MapPin, Truck, History } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Notificacao } from '../types';
import { formatDate } from '../lib/utils';

const AdminDashboard: React.FC = () => {
  const notifs = useMemo(() => dataService.getNotificacoes(), []);
  const daysWithout = useMemo(() => dataService.getDaysWithoutAccidents(), [notifs]);
  const [selectedList, setSelectedList] = useState<{ title: string; items: Notificacao[] } | null>(null);

  const stats = useMemo(() => {
    const monthly = notifs.filter(n => {
      const d = new Date(n.dataRegistro);
      return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    });
    const open = notifs.filter(n => n.status !== 'encerrado');
    const trajeto = notifs.filter(n => n.tipoAcidente === 'Trajeto' || n.tipoAcidente === 'Retorno');
    const tipico = notifs.filter(n => n.tipoAcidente === 'Típico');
    
    return {
      monthly,
      open,
      trajeto,
      tipico,
      total: notifs.length
    };
  }, [notifs]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const typeData = useMemo(() => {
    const types = ['Típico', 'Trajeto', 'Retorno', 'Doença'];
    return types.map(t => ({
      name: t,
      value: notifs.filter(n => n.tipoAcidente === t).length
    })).filter(d => d.value > 0);
  }, [notifs]);

  const sectorData = useMemo(() => {
    const sectors: Record<string, number> = {};
    notifs.forEach(n => {
      const s = n.tipoAcidente === 'Típico' ? n.setorAcidente : 'Trajeto/Retorno';
      sectors[s] = (sectors[s] || 0) + 1;
    });
    return Object.entries(sectors).map(([name, value]) => ({ name, value }));
  }, [notifs]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Safety Scoreboard */}
      <div className="glass mb-12 p-8 rounded-[3rem] border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left shadow-2xl">
        <div className="p-6 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/30">
          <ShieldCheck size={64} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Segurança Hospitalar</h2>
          <div className="flex items-baseline gap-3">
            <span className="text-7xl font-black text-white">{daysWithout}</span>
            <span className="text-2xl font-bold text-slate-400">Dias</span>
          </div>
          <p className="text-slate-400 font-medium mt-1 italic">Estamos trabalhando sem acidentes com afastamento.</p>
        </div>
      </div>

      {/* Interactive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard 
          title="Casos em Aberto" 
          value={stats.open.length.toString()} 
          icon={<AlertCircle className="text-amber-400" />}
          onClick={() => setSelectedList({ title: 'Casos em Aberto', items: stats.open })}
        />
        <StatCard 
          title="Registros no Mês" 
          value={stats.monthly.length.toString()} 
          icon={<FileText className="text-blue-400" />}
          onClick={() => setSelectedList({ title: 'Registros no Mês', items: stats.monthly })}
        />
        <StatCard 
          title="Acidentes de Percurso" 
          value={stats.trajeto.length.toString()} 
          icon={<Truck className="text-purple-400" />}
          description="Trajeto e Retorno"
          onClick={() => setSelectedList({ title: 'Trajeto e Retorno', items: stats.trajeto })}
        />
        <StatCard 
          title="Acidentes Típicos" 
          value={stats.tipico.length.toString()} 
          icon={<History className="text-emerald-400" />}
          onClick={() => setSelectedList({ title: 'Acidentes Típicos', items: stats.tipico })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Indicators: Accident Type */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5">
          <h3 className="text-xl font-bold text-white mb-8">Tipos de Ocorrência</h3>
          <div className="h-[300px] flex items-center">
            {typeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {typeData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0b1020', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {typeData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full text-center text-slate-500 italic">Sem dados para exibir.</div>
            )}
          </div>
        </div>

        {/* Indicators: Sector Breakdown */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5">
          <h3 className="text-xl font-bold text-white mb-8">Registros por Setor</h3>
          <div className="h-[300px]">
            {sectorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0b1020', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-500 italic">Sem dados para exibir.</div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer for Clicked Card Data */}
      {selectedList && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedList(null)} />
          <div className="relative w-full max-w-xl bg-[#0b1020] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedList.title}</h2>
                <span className="text-xs text-slate-500 font-medium">{selectedList.items.length} registro(s)</span>
              </div>
              <button onClick={() => setSelectedList(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedList.items.length > 0 ? selectedList.items.map(n => (
                <div key={n.id} className="glass p-4 rounded-2xl hover:border-blue-500/30 transition-all cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">ID #{n.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${n.status === 'encerrado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {n.status}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{n.colaborador?.nome || 'Colaborador não identificado'}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <History size={12} /> {formatDate(n.dataAcidente)}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={12} /> {n.tipoAcidente === 'Típico' ? n.setorAcidente : n.setorAcidente || 'Percurso'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium italic">
                      Tipo: {n.tipoAcidente}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-slate-500">Nenhum registro encontrado nesta categoria.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; onClick: () => void; description?: string }> = ({ title, value, icon, onClick, description }) => (
  <button onClick={onClick} className="glass p-6 rounded-3xl border-white/5 text-left group hover:border-blue-500/20 transition-all shadow-lg active:scale-95">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">{icon}</div>
      <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
    </div>
    <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</div>
    {description && <div className="text-[9px] text-slate-600 font-medium mt-1">{description}</div>}
  </button>
);

export default AdminDashboard;
