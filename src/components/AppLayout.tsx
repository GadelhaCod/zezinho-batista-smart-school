import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  PieChart,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Visão Geral" },
  { to: "/alunos", icon: Users, label: "Alunos" },
  { to: "/professores", icon: GraduationCap, label: "Professores" },
  { to: "/administradores", icon: ShieldCheck, label: "Administradores" },
  { to: "/relatorios", icon: PieChart, label: "Relatórios" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-school-green-light border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 rounded-md text-foreground hover:bg-muted transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <h1 className="font-bold text-lg text-school-green-deep leading-tight">
          Escola Estadual de Educação Profissional Vereador José Batista Filho –{" "}
          <span className="text-secondary">Zezinho Batista</span>
        </h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-[53px] md:top-0 left-0 z-20 h-[calc(100vh-53px)] md:h-auto
            w-64 bg-sidebar flex-shrink-0 flex flex-col pt-4 transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground
                    transition-colors duration-200
                    ${active ? "bg-sidebar-accent font-semibold" : "hover:bg-sidebar-accent"}
                  `}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-foreground/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
