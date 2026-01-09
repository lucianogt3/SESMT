import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import PublicHome from "./pages/PublicHome";
import Orientacoes from "./pages/Orientacoes";
import Registro from "./pages/Registro";
import BuscarImprimir from "./pages/BuscarImprimir";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";

// ✅ Mostra erro na tela em vez de "sumir tudo"
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any) {
    console.error("UI crashed:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="glass border border-red-500/20 max-w-2xl w-full p-6 rounded-3xl">
            <h1 className="text-2xl font-extrabold text-white mb-2">
              O app quebrou ao renderizar
            </h1>
            <p className="text-slate-400 mb-4">
              Copie o erro abaixo e me envie que eu corrijo em 1 passo.
            </p>
            <pre className="text-xs text-red-300 whitespace-pre-wrap break-words bg-black/40 border border-white/10 p-4 rounded-2xl">
              {String(this.state.error?.message || this.state.error || "Erro desconhecido")}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen">
          <Navbar />

          <main className="max-w-7xl mx-auto px-4 pb-16">
            <Routes>
              <Route path="/" element={<PublicHome />} />
              <Route path="/orientacoes" element={<Orientacoes />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/buscar" element={<BuscarImprimir />} />

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/config" element={<AdminSettings />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="py-12 text-center text-slate-500 text-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-px w-full bg-white/5 mb-6" />
              <p>© 2026 SESMT Digital — SINAN & CAT</p>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </Router>
  );
}
