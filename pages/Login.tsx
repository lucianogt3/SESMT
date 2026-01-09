import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { dataService } from "../services/dataService";

const Login: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if ((dataService as any).login) {
        await (dataService as any).login(email, senha);
      } else {
        // fallback: allow in mock mode
        localStorage.setItem("sesmt_user", JSON.stringify({ email, role: "admin" }));
      }
      nav("/admin");
    } catch (e: any) {
      setErr("Login inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <div className="glass p-8 rounded-3xl border-white/5 mt-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Acesso Administrativo</h1>
        <p className="text-slate-400 text-sm mb-8">Entre com seu usuário SESMT.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email</label>
            <div className="flex items-center gap-2 glass border-white/5 rounded-2xl px-4 py-3">
              <Mail size={16} className="text-slate-500" />
              <input value={email} onChange={e=>setEmail(e.target.value)} className="bg-transparent w-full outline-none text-white text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Senha</label>
            <div className="flex items-center gap-2 glass border-white/5 rounded-2xl px-4 py-3">
              <Lock size={16} className="text-slate-500" />
              <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} className="bg-transparent w-full outline-none text-white text-sm" />
            </div>
          </div>

          {err && <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm">{err}</div>}

          <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <Link to="/" className="block text-center text-sm text-slate-400 hover:text-white">Voltar</Link>
        </form>
      </div>

      <div className="mt-4 text-xs text-slate-500 text-center">
        Padrão de teste: <b>admin@sesmt.local</b> / <b>admin123</b>
      </div>
    </div>
  );
};

export default Login;
