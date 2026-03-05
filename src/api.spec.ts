import { describe, expect, it, vi, beforeEach } from 'vitest';
import { backendClient, updateBackendUtilsClients } from './api';

describe('api', () => {
    beforeEach(() => {
        // Reset utils clients before each test
        updateBackendUtilsClients(undefined);
    });

    it('should have backendClient initialized', () => {
        expect(backendClient).toBeDefined();
        expect(backendClient.auth).toBeDefined();
        expect(backendClient.users).toBeDefined();
        expect(backendClient.roles).toBeDefined();
        expect(backendClient.certificates).toBeDefined();
        expect(backendClient.raProfiles).toBeDefined();
    });

    it('should update backend utils clients when a valid URL is provided', () => {
        const testUrl = 'http://test-utils-api.com';
        updateBackendUtilsClients(testUrl);

        expect(backendClient.utilsCertificate).toBeDefined();
        expect(backendClient.utilsOid).toBeDefined();
        expect(backendClient.utilsCertificateRequest).toBeDefined();
        expect(backendClient.utilsActuator).toBeDefined();
    });

    it('should clear backend utils clients when an empty URL is provided', () => {
        // First set them
        updateBackendUtilsClients('http://test-utils-api.com');
        expect(backendClient.utilsCertificate).toBeDefined();

        // Then clear them
        updateBackendUtilsClients('');
        expect(backendClient.utilsCertificate).toBeUndefined();
        expect(backendClient.utilsOid).toBeUndefined();
        expect(backendClient.utilsCertificateRequest).toBeUndefined();
        expect(backendClient.utilsActuator).toBeUndefined();
    });

    it('should clear backend utils clients when undefined is provided', () => {
        // First set them
        updateBackendUtilsClients('http://test-utils-api.com');
        expect(backendClient.utilsCertificate).toBeDefined();

        // Then clear them
        updateBackendUtilsClients(undefined);
        expect(backendClient.utilsCertificate).toBeUndefined();
        expect(backendClient.utilsOid).toBeUndefined();
        expect(backendClient.utilsCertificateRequest).toBeUndefined();
        expect(backendClient.utilsActuator).toBeUndefined();
    });
});
