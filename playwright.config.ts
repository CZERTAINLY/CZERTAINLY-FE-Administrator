import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './src',
    testMatch: '**/*.spec.tsx',
    timeout: 30 * 1000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { outputFolder: 'playwright-report' }], ['junit', { outputFile: 'playwright-report/junit.xml' }], ['list']],
    use: {
        trace: 'on-first-retry',
        ctPort: 3100,
        ctViteConfig: {
            resolve: {
                alias: [
                    { find: /^utils([\\/].*)/, replacement: path.resolve(__dirname, './src/utils/') + '$1' },
                    { find: /^types([\\/].*)/, replacement: path.resolve(__dirname, './src/types/') + '$1' },
                    { find: /^components([\\/].*)/, replacement: path.resolve(__dirname, './src/components/') + '$1' },
                    { find: /^ducks$/, replacement: path.resolve(__dirname, './src/ducks') },
                    { find: /^ducks([\\/].*)/, replacement: path.resolve(__dirname, './src/ducks/') + '$1' },
                ],
                dedupe: ['react', 'react-dom', 'react-hook-form'],
            },
            build: {
                commonjsOptions: {
                    include: [/react-hook-form/, /node_modules/],
                },
            },
            optimizeDeps: {
                include: ['react-hook-form'],
            },
        },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
