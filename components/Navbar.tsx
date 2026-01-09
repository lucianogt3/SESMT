import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  FileText,
  Search,
  Info,
  Settings,
  LogOut,
  Shield
} from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("sesmt_token");
    localStorage.removeItem("sesmt_user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 mb-8">
      <div className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <Link to="/" className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  SESMT
                </span>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">
                  Portal de Segurança
                </span>
              </Link>
            </div>

            {/* MENU */}
            <div className="hidden md:flex items-center gap-1">
              {isAdmin ? (
                <>
                  <NavLink
                    to="/admin"
                    active={location.pathname === "/admin"}
                    icon={<LayoutDashboard size={18} />}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/config"
                    active={location.pathname === "/admin/config"}
                    icon={<Settings size={18} />}
                  >
                    Configurações
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="ml-3 px-4 py-2 rounded-xl text-sm font-semibold
                               flex items-center gap-2 transition-all
                               bg-red-500/10 text-red-400
                               border border-red-500/20
                               hover:bg-red-500/20"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/orientacoes"
                    active={location.pathname === "/orientacoes"}
                    icon={<Info size={18} />}
                  >
                    Orientações
                  </NavLink>

                  <NavLink
                    to="/buscar"
                    active={location.pathname === "/buscar"}
                    icon={<Search size={18} />}
                  >
                    Consultar
                  </NavLink>

                  <Link
                    to="/registro"
                    className="ml-3 px-5 py-2.5 rounded-xl
                               bg-blue-600 hover:bg-blue-500
                               text-white text-sm font-bold
                               shadow-lg shadow-blue-900/30
                               transition-all flex items-center gap-2"
                  >
                    <FileText size={18} />
                    Novo Registro
                  </Link>

                  <Link
                    to="/login"
                    className="ml-2 px-4 py-2 rounded-xl
                               glass border border-white/10
                               text-white text-sm font-semibold
                               hover:bg-white/5
                               transition-all flex items-center gap-2"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, icon, children }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-xl
      text-sm font-medium transition-all
      ${
        active
          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }
    `}
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
