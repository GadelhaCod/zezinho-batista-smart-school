import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider }
  from "@tanstack/react-query";
import { BrowserRouter, Route, Routes }
  from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider }
  from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { AdminFaceGuard }
  from "@/components/admin/AdminFaceGuard";

const CadastroAlunos = lazy(
  () => import("@/pages/CadastroAlunos"));
const CadastroProfessores = lazy(
  () => import("@/pages/CadastroProfessores"));
const CadastroAdministradores = lazy(
  () => import("@/pages/CadastroAdministradores"));
const Relatorios = lazy(
  () => import("@/pages/Relatorios"));
const PainelAdmin = lazy(
  () => import("@/pages/PainelAdmin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="flex items-center justify-center
    min-h-[60vh]">
    <div className="flex flex-col items-center
      gap-3 text-muted-foreground">
      <div className="h-8 w-8 animate-spin
        rounded-full border-2 border-current
        border-t-transparent" />
      <span className="text-sm">
        Carregando...
      </span>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter basename=
  "/zezinho-batista-smart-school">
        <Routes>
          <Route path="/" element={
            <AppLayout><Dashboard /></AppLayout>
          } />
          <Route path="/alunos" element={
            <AppLayout>
              <Suspense fallback={<PageFallback />}>
                <CadastroAlunos />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/professores" element={
            <AppLayout>
              <Suspense fallback={<PageFallback />}>
                <CadastroProfessores />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/administradores" element={
            <AppLayout>
              <Suspense fallback={<PageFallback />}>
                <CadastroAdministradores />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/relatorios" element={
            <AppLayout>
              <Suspense fallback={<PageFallback />}>
                <Relatorios />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/painel-admin" element={
            <AdminFaceGuard>
              <AppLayout>
                <Suspense fallback={<PageFallback />}>
                  <PainelAdmin />
                </Suspense>
              </AppLayout>
            </AdminFaceGuard>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
