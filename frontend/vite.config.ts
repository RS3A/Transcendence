import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    // SockJS depende de 'global', mas o Vite/Browser não tem.
    // Usar 'global: "window"' às vezes falha, o objeto vazio é mais seguro.
    'global': {}, 
  },
  resolve: {
    alias: {
      // Força o Vite a usar a versão compatível com browser do stomp
      '@stomp/stompjs': '@stomp/stompjs',
    },
  },
  optimizeDeps: {
    include: ['@stomp/stompjs', 'sockjs-client'],
  },
})