
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, FlaskRound, Info, ArrowLeft, ArrowRight } from 'lucide-react';

const Orientacoes: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-semibold">
        <ArrowLeft size={16} /> Voltar ao início
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Orientações de Emergência</h1>
        <p className="text-slate-400">Siga rigorosamente estes passos antes de realizar o registro no sistema.</p>
      </div>

      <div className="space-y-8">
        <Section icon={<AlertCircle className="text-red-400" />} title="Ação Imediata" accent="red">
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">Interrompa a atividade imediatamente. Se houve exposição a material biológico, lave o local com água e sabão (pele) ou soro fisiológico (mucosas).</p>
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm font-medium">
              Atenção: Não utilize substâncias irritantes (éter, hipoclorito) em mucosas ou feridas abertas.
            </div>
          </div>
        </Section>

        <Section icon={<Info className="text-blue-400" />} title="Comunicação" accent="blue">
          <ul className="space-y-3">
            <StepItem>Comunique sua chefia imediata ou o enfermeiro responsável pela unidade.</StepItem>
            <StepItem>Encaminhe-se ao pronto-atendimento indicado para avaliação clínica e laboratorial.</StepItem>
            <StepItem>Se possível, identifique o paciente-fonte (para casos biológicos).</StepItem>
          </ul>
        </Section>

        <Section icon={<FlaskRound className="text-purple-400" />} title="Material Biológico" accent="purple">
          <p className="text-slate-300 mb-4">Para acidentes envolvendo agulhas, lâminas ou fluidos corporais:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Avaliação</h4>
              <p className="text-xs text-slate-400">A profilaxia pós-exposição (PEP) deve ser iniciada idealmente em até 2 horas após o acidente.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Acompanhamento</h4>
              <p className="text-xs text-slate-400">O SESMT realizará o monitoramento sorológico em 30, 90 e 180 dias conforme protocolo.</p>
            </div>
          </div>
        </Section>

        <div className="glass p-8 rounded-3xl border-emerald-500/20 flex items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Tudo certo?</h3>
            <p className="text-slate-400 text-sm">Se você já recebeu o atendimento inicial, proceda para o registro.</p>
          </div>
          <Link to="/registro" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shrink-0">
            Iniciar Registro <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; accent: string }> = ({ icon, title, children, accent }) => (
  <div className={`glass p-8 rounded-3xl border-${accent}-500/10`}>
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2.5 rounded-xl bg-${accent}-500/10`}>{icon}</div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const StepItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 text-slate-300">
    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={18} />
    <span className="text-sm leading-relaxed">{children}</span>
  </li>
);

export default Orientacoes;
