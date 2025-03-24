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
    const proxyConfig = await loadProxyConfig();
    return {
        server: {
            open: true,
            proxy: proxyConfig.server.proxy,
        },
        build: {
            outDir: 'build',
        },
        base: '/administrator', // In the start-nginx.sh, the value is updated accordingly, based on the passed ENV variables
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
