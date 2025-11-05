import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig((config) => {
    const devMode = config.mode === "development";

    return {
        plugins: [react()],
        base: './',
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        optimizeDeps: {
            include: ['crypto-es']
        },
        build: {
            outDir: 'js',
            sourcemap: devMode,
            minify: !devMode,
            rollupOptions: {
                input: path.resolve(__dirname, 'src/main.tsx'),
                output: {
                    format: 'iife',
                    entryFileNames: 'otpmanager-main.js',
                },
            },
        }
    }
})
