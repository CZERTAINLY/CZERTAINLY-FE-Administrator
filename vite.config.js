import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';

async function loadProxyConfig() {
    try {
        const { default: customProxyConfig } = await import('./src/setupProxy.js');
        return customProxyConfig;
    } catch (error) {
        return { server: { proxy: {} } };
    }
}
export default defineConfig(async () => {
    console.log('PROCESS ENV', process.env);
    const proxyConfig = await loadProxyConfig();
    return {
        server: {
            open: true,
            proxy: proxyConfig.server.proxy,
        },
        build: {
            outDir: 'build',
        },
        base: process.env.BASE_URL || '/',
        css: {
            preprocessorOptions: {
                scss: {
                    includePaths: [path.resolve(__dirname, 'src')],
                },
            },
        },
        plugins: [
            react(),
            eslint({
                failOnWarning: true,
            }),
            tsconfigPaths(),
        ],
    };
});
