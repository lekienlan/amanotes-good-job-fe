import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'data': path.resolve(__dirname, './src/data'),
      'domain': path.resolve(__dirname, './src/domain'),
      'presentation': path.resolve(__dirname, './src/presentation'),
      'shared': path.resolve(__dirname, './src/shared')
    }
  }
})
