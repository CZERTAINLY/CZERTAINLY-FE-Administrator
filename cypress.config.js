import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
    e2e: {
        experimentalStudio: true,
        setupNodeEvents(on) {
            on('file:preprocessor', vitePreprocessor());
        },
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },
});
