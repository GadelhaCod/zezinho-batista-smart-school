import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const CadastroAlunos = lazy(() => import("@/pages/CadastroAlunos"));
const CadastroProfessores = lazy(() => import("@/pages/CadastroProfessores"));
const CadastroAdministradores = lazy(() => import("@/pages/CadastroAdministradores"));
const Relatorios = lazy(() => import("@/pages/Relatorios"));
const PainelAdmin = lazy(() => import("@/pages/PainelAdmin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/alunos"
            element={
              <AppLayout>
                <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando...</div>}>
                  <CadastroAlunos />
                </Suspense>
              </AppLayout>
            }
          />
          <Route
            path="/professores"
            element={
              <AppLayout>
                <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando...</div>}>
                  <CadastroProfessores />
                </Suspense>
              </AppLayout>
            }
          />
          <Route
            path="/administradores"
            element={
              <AppLayout>
                <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando...</div>}>
                  <CadastroAdministradores />
                </Suspense>
              </AppLayout>
            }
          />
          <Route
            path="/relatorios"
            element={
              <AppLayout>
                <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando...</div>}>
                  <Relatorios />
                </Suspense>
              </AppLayout>
            }
          />
          <Route
            path="/painel-admin"
            element={
              <AppLayout>
                <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando...</div>}>
                  <PainelAdmin />
                </Suspense>
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
