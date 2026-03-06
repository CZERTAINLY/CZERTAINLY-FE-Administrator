import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['**/*.spec.ts'],
        exclude: ['node_modules', 'build', 'dist', 'src/components/**/*'],
        coverage: {
            provider: 'v8',
            reporter: ['lcovonly', 'text-summary'],
            reportsDirectory: './coverage-vitest',
            include: ['src/*.{ts,tsx}', 'src/utils/**/*.{ts,tsx}', 'src/ducks/**/*.{ts,tsx}'],
            exclude: [
                'node_modules',
                'src/**/*.spec.{ts,tsx}',
                'src/types/**/*',
                'src/utils/ct-window-shim.ts',
                'src/utils/TestStoreConsumer.tsx',
                'src/utils/TestRouteDisplay.tsx',
            ],
        },
    },
    resolve: {
        alias: [
            { find: /^utils([\\/].*)/, replacement: path.resolve(__dirname, './src/utils/') + '$1' },
            { find: /^types([\\/].*)/, replacement: path.resolve(__dirname, './src/types/') + '$1' },
            { find: /^components([\\/].*)/, replacement: path.resolve(__dirname, './src/components/') + '$1' },
            { find: /^ducks$/, replacement: path.resolve(__dirname, './src/ducks') },
            { find: /^ducks([\\/].*)/, replacement: path.resolve(__dirname, './src/ducks/') + '$1' },
        ],
    },
    define: {
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
});
