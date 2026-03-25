import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ✅ CORREÇÃO 1: base path para GitHub Pages
  // Em produção usa o subdiretório do repositório
  // Em desenvolvimento usa "/" para funcionar no localhost
  base: mode === "production" ? "/zezinho-batista-smart-school/" : "/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },

  // ✅ CORREÇÃO 2: garante que o build vai para /dist
  build: {
    outDir: "dist",
    // Gera sourcemaps apenas em desenvolvimento para segurança
    sourcemap: mode === "development",
    // Divide chunks para melhor performance (code splitting)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tabs"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
