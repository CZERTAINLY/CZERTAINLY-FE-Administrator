import { describe, expect, test } from 'vitest';
import { SecretState } from 'types/openapi';
import { getSecretStatusColor } from './secret';

describe('secret utils', () => {
    describe('getSecretStatusColor', () => {
        test('returns teal for Active', () => {
            expect(getSecretStatusColor(SecretState.Active)).toBe('#14B8A6');
        });

        test('returns dark gray for Inactive', () => {
            expect(getSecretStatusColor(SecretState.Inactive)).toBe('#1F2937');
        });

        test('returns gray for Revoked', () => {
            expect(getSecretStatusColor(SecretState.Revoked)).toBe('#6B7280');
        });

        test('returns light gray for Expired', () => {
            expect(getSecretStatusColor(SecretState.Expired)).toBe('#9CA3AF');
        });

        test('returns red for Failed', () => {
            expect(getSecretStatusColor(SecretState.Failed)).toBe('#EF4444');
        });

        test('returns red for Rejected', () => {
            expect(getSecretStatusColor(SecretState.Rejected)).toBe('#EF4444');
        });

        test('returns blue for PendingApproval', () => {
            expect(getSecretStatusColor(SecretState.PendingApproval)).toBe('#2798E7');
        });

        test('returns default gray for unknown status', () => {
            expect(getSecretStatusColor('unknown' as SecretState)).toBe('#6B7280');
        });
    });
});
