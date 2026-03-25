import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// ✅ Guard de reconhecimento facial para o painel admin
import { AdminFaceGuard } from "@/components/admin/AdminFaceGuard";

// Lazy loading das páginas pesadas
const CadastroAlunos          = lazy(() => import("@/pages/CadastroAlunos"));
const CadastroProfessores     = lazy(() => import("@/pages/CadastroProfessores"));
const CadastroAdministradores = lazy(() => import("@/pages/CadastroAdministradores"));
const Relatorios              = lazy(() => import("@/pages/Relatorios"));
const PainelAdmin             = lazy(() => import("@/pages/PainelAdmin"));

// ─── QueryClient global ───────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Evita refetch desnecessário ao focar a janela
      refetchOnWindowFocus: false,
      // Retry apenas 1x em caso de erro (default é 3)
      retry: 1,
    },
  },
});

// ─── Fallback padronizado de carregamento ─────────────────────────────────────
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span className="text-sm">Carregando...</span>
    </div>
  </div>
);

// ─── App ─────────────────────────────────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />

      {/*
        ✅ CORREÇÃO: basename aponta para o subdiretório do GitHub Pages.
           Em localhost o Vite injeta base="/", então o router usa "/" automaticamente.
           Em produção o vite.config.ts seta base="/zezinho-batista-smart-school/",
           e o BrowserRouter precisa do mesmo valor como basename.
      */}
      <BrowserRouter basename="/zezinho-batista-smart-school">
        <Routes>

          {/* ── Dashboard (raiz) ─────────────────────────────────────────── */}
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />

          {/* ── Cadastro de Alunos ───────────────────────────────────────── */}
          <Route
            path="/alunos"
            element={
              <AppLayout>
                <Suspense fallback={<PageFallback />}>
                  <CadastroAlunos />
                </Suspense>
              </AppLayout>
            }
          />

          {/* ── Cadastro de Professores ──────────────────────────────────── */}
          <Route
            path="/professores"
            element={
              <AppLayout>
                <Suspense fallback={<PageFallback />}>
                  <CadastroProfessores />
                </Suspense>
              </AppLayout>
            }
          />

          {/* ── Cadastro de Administradores ──────────────────────────────── */}
          <Route
            path="/administradores"
            element={
              <AppLayout>
                <Suspense fallback={<PageFallback />}>
                  <CadastroAdministradores />
                </Suspense>
              </AppLayout>
            }
          />

          {/* ── Relatórios ───────────────────────────────────────────────── */}
          <Route
            path="/relatorios"
            element={
              <AppLayout>
                <Suspense fallback={<PageFallback />}>
                  <Relatorios />
                </Suspense>
              </AppLayout>
            }
          />

          {/* ── Painel Admin ─────────────────────────────────────────────── */}
          {/*
            ✅ AdminFaceGuard envolve APENAS esta rota.
               Fluxo automático:
                 1ª vez  → tela de cadastro facial
                 retorno → tela de verificação facial
                 sessão ativa na aba → acesso direto sem câmera
          */}
          <Route
            path="/painel-admin"
            element={
              <AdminFaceGuard>
                <AppLayout>
                  <Suspense fallback={<PageFallback />}>
                    <PainelAdmin />
                  </Suspense>
                </AppLayout>
              </AdminFaceGuard>
            }
          />

          {/* ── 404 ──────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
