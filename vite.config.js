import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import istanbul from 'vite-plugin-istanbul';
import tailwindcss from '@tailwindcss/vite';

async function loadProxyConfig() {
    try {
        const { default: customProxyConfig } = await import('./src/setupProxy.js');
        return customProxyConfig.server.proxy;
    } catch (error) {
        return {};
    }
}
export default defineConfig(async () => {
    const proxyConfig = await loadProxyConfig();
    return {
        define: {
            __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        },
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
                { find: 'utils/', replacement: path.resolve(__dirname, './src/utils/') + '/' },
                { find: 'types/', replacement: path.resolve(__dirname, './src/types/') + '/' },
                { find: 'components/', replacement: path.resolve(__dirname, './src/components/') + '/' },
                { find: 'ducks/', replacement: path.resolve(__dirname, './src/ducks/') + '/' },
                { find: 'ducks', replacement: path.resolve(__dirname, './src/ducks') },
                { find: 'src/', replacement: path.resolve(__dirname, './src/') + '/' },
                { find: 'playwright/', replacement: path.resolve(__dirname, './playwright/') + '/' },
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
