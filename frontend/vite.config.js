import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    // En desarrollo, las peticiones a /api se reenvían a Spring (evita problemas de CORS).
    // ⚠️ Cambia el puerto/URL si tu backend corre en otra dirección.
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
  build: {
    // model-viewer (Three.js) pesa ~1 MB, pero va en un chunk aparte que solo se
    // descarga cuando una sección tiene un modelo .glb. Es esperado.
    chunkSizeWarningLimit: 1100,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // <model-viewer> es un web component, no un componente de Vue:
          // le decimos a Vue que no intente resolverlo.
          isCustomElement: (tag) => tag === 'model-viewer',
        },
      },
    }),
  ],
})
