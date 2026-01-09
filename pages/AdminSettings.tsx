
import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Save, Check } from 'lucide-react';
import { dataService } from '../services/dataService';
import { AppSettings } from '../types';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(dataService.getSettings());
  const [saved, setSaved] = useState(false);

  const addItem = (key: keyof AppSettings) => {
    const name = window.prompt(`Novo item para ${key}:`);
    if (name && !settings[key].includes(name)) {
      setSettings({ ...settings, [key]: [...settings[key], name].sort() });
    }
  };

  const removeItem = (key: keyof AppSettings, index: number) => {
    if (window.confirm('Excluir este item? Isso pode afetar novos registros.')) {
      const newList = [...settings[key]];
      newList.splice(index, 1);
      setSettings({ ...settings, [key]: newList });
    }
  };

  const handleSave = () => {
    dataService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <Settings className="text-slate-400" /> Configurações
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Gerencie os metadados do sistema (Setores, Partes do Corpo).</p>
        </div>
        <button onClick={handleSave} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="space-y-8">
        <ConfigSection title="Setores Hospitalares" items={settings.setores} onAdd={() => addItem('setores')} onRemove={(i) => removeItem('setores', i)} />
        <ConfigSection title="Partes do Corpo (SINAN)" items={settings.partesCorpo} onAdd={() => addItem('partesCorpo')} onRemove={(i) => removeItem('partesCorpo', i)} />
        <ConfigSection title="Locais do Acidente" items={settings.locais} onAdd={() => addItem('locais')} onRemove={(i) => removeItem('locais', i)} />
      </div>
    </div>
  );
};

const ConfigSection: React.FC<{ title: string; items: string[]; onAdd: () => void; onRemove: (i: number) => void }> = ({ title, items, onAdd, onRemove }) => (
  <div className="glass p-8 rounded-[2.5rem] border-white/5">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <button onClick={onAdd} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all flex items-center gap-1 text-xs font-bold">
        <Plus size={14} /> Adicionar
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300 group hover:border-red-500/20 hover:text-white transition-all">
          {item}
          <button onClick={() => onRemove(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default AdminSettings;
