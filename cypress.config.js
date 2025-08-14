import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
import codeCoverageTask from '@cypress/code-coverage/task';
import fs from 'fs';
import path from 'path';

// Load cypress.env.json manually
let envJson = {};
try {
    envJson = JSON.parse(fs.readFileSync(path.resolve('cypress.env.json'), 'utf-8'));
} catch (err) {
    console.warn('No cypress.env.json found or failed to parse');
}

// Pull admin URL from env or fallback to cypress.env.json
const useMtls = process.env.USE_MTLS === 'true' || envJson.USE_MTLS === true;
const mtlsUrl = process.env.ADMIN_URL || envJson.MTLS_URL;
const pfxPath = process.env.MTLS_PFX_PATH || envJson.MTLS_PFX_PATH;
const passphrasePath = process.env.MTLS_PASSPHRASE_PATH || envJson.MTLS_PASSPHRASE_PATH;
const caPath = process.env.MTLS_CA_CERT_PATH || envJson.MTLS_CA_CERT_PATH;

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
        setupNodeEvents(on, config) {
            // Code coverage task for CT runs
            codeCoverageTask(on, config);
            return config;
        },
    },
    ...(useMtls
        ? {
              clientCertificates: [
                  {
                      url: mtlsUrl,
                      ca: caPath ? [caPath] : undefined,
                      certs: [
                          {
                              pfx: pfxPath,
                              passphrase: passphrasePath,
                          },
                      ],
                  },
              ],
          }
        : {}),
});
