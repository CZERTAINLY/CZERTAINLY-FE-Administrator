import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['src/components/PagedList/PagedList.unit.spec.tsx'],
        exclude: ['node_modules', 'build', 'dist'],
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
