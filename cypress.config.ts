import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3001",
    supportFile: false, // Desativado para manter o teste mínimo e rápido
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      
    },
  },
});
