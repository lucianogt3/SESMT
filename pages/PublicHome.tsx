import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  FilePlus,
  Search,
  ClipboardCheck,
  ArrowRight,
  UserCog,
} from "lucide-react";

const PublicHome: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
          <ShieldAlert size={16} />
          Protocolo Institucional de Segurança
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Notificação de <span className="text-blue-500">Acidentes de Trabalho</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Sistema centralizado para registro rápido de SINAN e CAT. Garanta seus
          direitos e contribua para um ambiente de trabalho mais seguro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <HomeCard
          to="/orientacoes"
          title="O que fazer?"
          description="Acesse o manual de procedimentos imediatos em caso de acidentes e exposições biológicas."
          icon={<ClipboardCheck className="text-emerald-400" size={32} />}
          accent="emerald"
        />

        <HomeCard
          to="/registro"
          title="Novo Registro"
          description="Inicie o preenchimento dos formulários SINAN e CAT de forma guiada e simplificada."
          icon={<FilePlus className="text-blue-400" size={32} />}
          accent="blue"
          primary
        />

        <HomeCard
          to="/buscar"
          title="Consultar Registros"
          description="Busque notificações anteriores utilizando seu CPF e imprima as guias rascunho."
          icon={<Search className="text-purple-400" size={32} />}
          accent="purple"
        />
      </div>

      <div className="glass rounded-3xl p-8 md:p-12 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-slate-400 mb-4 text-sm font-bold uppercase tracking-widest">
              <UserCog size={18} />
              Área Administrativa
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Acesso Exclusivo SESMT
            </h2>

            <p className="text-slate-400 leading-relaxed mb-6">
              Gestão de indicadores, análise de registros e exportação de dados
              estatísticos para auditorias internas e externas.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Entrar no painel de controle <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
            <div className="glass border border-white/10 p-6 rounded-2xl text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-500 font-medium">Digital</div>
            </div>
            <div className="glass border border-white/10 p-6 rounded-2xl text-center">
              <div className="text-2xl font-bold text-white">Safe</div>
              <div className="text-xs text-slate-500 font-medium">Auditoria</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomeCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  primary?: boolean;
}

const HomeCard: React.FC<HomeCardProps> = ({
  to,
  title,
  description,
  icon,
  accent,
  primary,
}) => {
  const accentColors: Record<string, string> = {
    blue: "border-blue-500/20 hover:border-blue-500/50",
    emerald: "border-emerald-500/20 hover:border-emerald-500/50",
    purple: "border-purple-500/20 hover:border-purple-500/50",
  };

  const glow: Record<string, string> = {
    blue: "before:bg-blue-500/10",
    emerald: "before:bg-emerald-500/10",
    purple: "before:bg-purple-500/10",
  };

  return (
    <Link
      to={to}
      className={[
        "glass p-8 rounded-[2rem] transition-all group relative overflow-hidden",
        "border", // ✅ importante: garante borda base
        accentColors[accent] || "border-white/10 hover:border-white/20",
        primary ? "ring-2 ring-blue-500/20" : "",
        // glow suave
        "before:content-[''] before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300",
        "before:blur-2xl before:rounded-[2rem]",
        glow[accent] || "before:bg-white/5",
        "hover:before:opacity-100",
      ].join(" ")}
    >
      <div className="relative z-10">
        <div className="mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          {title}
          <ArrowRight
            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400"
            size={20}
          />
        </h3>

        <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
      </div>
    </Link>
  );
};

export default PublicHome;
