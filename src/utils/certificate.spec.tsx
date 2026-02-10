import { test, expect } from '../../playwright/ct-test';
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateSubjectType,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
} from 'types/openapi';
import { formatPEM, getCertificateStatusColor } from './certificate';

test.describe('certificate utils', () => {
    test.describe('formatPEM', () => {
        test('should format short PEM string', () => {
            const result = formatPEM('short');
            expect(result).toContain('-----BEGIN CERTIFICATE-----');
            expect(result).toContain('-----END CERTIFICATE-----');
            expect(result).toContain('short');
        });

        test('should format CSR when csr is true', () => {
            const result = formatPEM('content', true);
            expect(result).toContain('-----BEGIN CERTIFICATE REQUEST-----');
            expect(result).toContain('-----END CERTIFICATE REQUEST-----');
        });

        test('should wrap long PEM string at 64 chars', () => {
            const longString = 'a'.repeat(100);
            const result = formatPEM(longString);
            expect(result).toContain('-----BEGIN CERTIFICATE-----');
            expect(result).toContain('-----END CERTIFICATE-----');
            expect(result).toContain('a'.repeat(64));
        });
    });

    test.describe('getCertificateStatusColor', () => {
        test('should return correct colors for CertificateState', () => {
            expect(getCertificateStatusColor(CertificateState.Issued)).toBe('#14B8A6');
            expect(getCertificateStatusColor(CertificateState.Revoked)).toBe('#632828');
            expect(getCertificateStatusColor(CertificateState.Failed)).toBe('#EF4444');
            expect(getCertificateStatusColor(CertificateState.Requested)).toBe('#3754a5');
        });

        test('should return correct colors for CertificateValidationStatus', () => {
            expect(getCertificateStatusColor(CertificateValidationStatus.Valid)).toBe('#14B8A6');
            expect(getCertificateStatusColor(CertificateValidationStatus.Expired)).toBe('#EF4444');
            expect(getCertificateStatusColor(CertificateValidationStatus.Expiring)).toBe('#EAB308');
            expect(getCertificateStatusColor(CertificateValidationStatus.NotChecked)).toBe('#2798E7');
        });

        test('should return correct colors for ComplianceStatus', () => {
            expect(getCertificateStatusColor(ComplianceStatus.Ok)).toBe('#14B8A6');
            expect(getCertificateStatusColor(ComplianceStatus.Nok)).toBe('#EF4444');
            expect(getCertificateStatusColor(ComplianceStatus.Na)).toBe('#6c757d');
        });

        test('should return correct colors for CertificateEventHistoryDtoStatusEnum', () => {
            expect(getCertificateStatusColor(CertificateEventHistoryDtoStatusEnum.Success)).toBe('#14B8A6');
            expect(getCertificateStatusColor(CertificateEventHistoryDtoStatusEnum.Failed)).toBe('#EF4444');
        });

        test('should return correct colors for CertificateSubjectType', () => {
            expect(getCertificateStatusColor(CertificateSubjectType.RootCa)).toBe('#14B8A6');
            expect(getCertificateStatusColor(CertificateSubjectType.EndEntity)).toBe('#6c757d');
        });

        test('should return default gray for unknown status', () => {
            expect(getCertificateStatusColor('unknown' as any)).toBe('#6c757d');
        });
    });
});
