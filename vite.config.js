import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import istanbul from 'vite-plugin-istanbul';
import tailwindcss from '@tailwindcss/vite';

async function loadProxyConfig() {
    try {
        const { default: customProxyConfig } = await import('./src/setupProxy.cjs');
        return customProxyConfig.server.proxy;
    } catch (error) {
        return {};
    }
}
export default defineConfig(async () => {
    const proxyConfig = await loadProxyConfig();
    return {
        server: {
            open: true,
            proxy: proxyConfig,
        },
        build: {
            outDir: 'build',
        },
        base: './',
        resolve: {
            // Aliases match the structure of import paths in tsconfig.js
            alias: [
                { find: /^utils([\\/].*)/g, replacement: path.resolve(__dirname, './src/utils/') + '$1' },
                { find: /^types([\\/].*)/g, replacement: path.resolve(__dirname, './src/types/') + '$1' },
                { find: /^components([\\/].*)/g, replacement: path.resolve(__dirname, './src/components/') + '$1' },
                { find: /^ducks$/g, replacement: path.resolve(__dirname, './src/ducks') },
                { find: /^ducks([\\/].*)/g, replacement: path.resolve(__dirname, './src/ducks/') + '$1' },
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    includePaths: [path.resolve(__dirname, 'src')],
                    quietDeps: true,
                    silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
                },
            },
        },
        plugins: [
            react(),
            eslint({
                failOnWarning: true,
            }),
            istanbul({
                requireEnv: false, // or set via env var
                include: ['src/**/*'],
                exclude: ['node_modules/**/*'],
            }),
            tailwindcss(),
        ],
    };
});
