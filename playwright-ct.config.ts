import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    testDir: './src',
    testMatch: ['**/*.spec.tsx', '**/*.spec.ts'],
    use: {
        ctPort: 3100,
        ctViteConfig: {
            define: {
                __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
            },
            plugins: [
                react(),
                tailwindcss(),
                istanbul({
                    include: ['src/**/*.ts', 'src/**/*.tsx'],
                    exclude: ['node_modules', '**/*.spec.ts', '**/*.spec.tsx'],
                    extension: ['.ts', '.tsx'],
                }),
            ],
            resolve: {
                alias: [
                    { find: 'react-hook-form', replacement: path.resolve(__dirname, 'node_modules/react-hook-form/dist/index.esm.mjs') },
                    { find: /^utils([\\/].*)/, replacement: path.resolve(__dirname, './src/utils/') + '$1' },
                    { find: /^types([\\/].*)/, replacement: path.resolve(__dirname, './src/types/') + '$1' },
                    { find: /^components([\\/].*)/, replacement: path.resolve(__dirname, './src/components/') + '$1' },
                    { find: /^ducks$/, replacement: path.resolve(__dirname, './src/ducks') },
                    { find: /^ducks([\\/].*)/, replacement: path.resolve(__dirname, './src/ducks/') + '$1' },
                ],
                dedupe: ['react', 'react-dom', 'react-hook-form'],
            },
            optimizeDeps: {
                include: ['react-hook-form'],
            },
            build: {
                sourcemap: 'inline',
                minify: false,
                rollupOptions: {
                    output: {
                        sourcemapExcludeSources: false,
                        manualChunks: (id) => {
                            if (id.includes('node_modules/react-hook-form')) return 'vendor-react-hook-form';
                            return undefined;
                        },
                    },
                },
                commonjsOptions: {
                    include: [/react-hook-form/, /node_modules/],
                },
            },
            esbuild: {
                sourcemap: true,
            },
        },
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
    reporter: [
        ['list'],
        [
            'monocart-reporter',
            {
                name: 'CT Report',
                outputFile: './monocart-report/index.html',
                sourcePath: (filePath: string) => {
                    const fp = filePath.replaceAll('\\', '/');
                    const m = fp.match(/(^|\/)(src\/.*)$/);
                    if (m) return m[2];
                    const cwd = process.cwd().replaceAll('\\', '/');
                    if (fp.startsWith(cwd + '/')) return fp.slice(cwd.length + 1);
                    return fp;
                },
                coverage: {
                    outputDir: './coverage',
                    reports: [['lcovonly', { file: 'lcov.info' }], 'text-summary'],
                    sourceFilter: (p: string) => {
                        if (!p) return false;

                        p = p.replaceAll('\\', '/');

                        if (p.startsWith('localhost-')) return false;
                        if (p.includes('/assets/') || p.includes('assets/')) return false;
                        if (p.endsWith('.css')) return false;
                        if (p.includes('node_modules')) return false;
                        if (p.includes('/_pages/')) return false;

                        return /^src\/.*\.(ts|tsx|js|jsx)$/.test(p);
                    },
                },
            },
        ],
    ],
});
