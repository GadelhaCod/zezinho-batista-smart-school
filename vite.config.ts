import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: mode === "production"
    ? "/zezinho-batista-smart-school/"
    : "/",

  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react", "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },

  build: {
    outDir: "dist",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react","react-dom","react-router-dom"],
          ui: ["@radix-ui/react-dialog",
               "@radix-ui/react-dropdown-menu",
               "@radix-ui/react-tabs"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
