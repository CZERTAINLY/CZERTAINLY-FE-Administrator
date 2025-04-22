import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
    e2e: {
        experimentalStudio: true,
        setupNodeEvents(on) {
            on('file:preprocessor', vitePreprocessor());
        },
    },
    env: {
        ADMIN_URL: 'http://localhost:5173/',
        ADMIN_USERNAME: 'czertainly-admin',
        ADMIN_PASSWORD: 'your-strong-password',
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },
});
