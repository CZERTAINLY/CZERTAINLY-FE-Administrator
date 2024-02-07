const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        experimentalStudio: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        ADMIN_URL: 'http://localhost:3000/',
        ADMIN_USERNAME: 'czertainly-admin',
        ADMIN_PASSWORD: 'your-strong-password',
    },
    component: {
        devServer: {
            framework: 'create-react-app',
            bundler: 'webpack',
        },
    },
});
