import { test, expect } from '../../playwright/ct-test';
import { getProxyStatusColor } from './proxy';
import { ProxyStatus } from 'types/openapi';

test.describe('proxy utils', () => {
    test.describe('getProxyStatusColor', () => {
        test('returns success color for Connected status', () => {
            expect(getProxyStatusColor(ProxyStatus.Connected)).toBe('var(--status-success-color)');
        });

        test('returns dark color for Disconnected status', () => {
            expect(getProxyStatusColor(ProxyStatus.Disconnected)).toBe('var(--status-dark-color)');
        });

        test('returns danger color for Failed status', () => {
            expect(getProxyStatusColor(ProxyStatus.Failed)).toBe('var(--status-danger-color)');
        });

        test('returns warning color for WaitingForInstallation status', () => {
            expect(getProxyStatusColor(ProxyStatus.WaitingForInstallation)).toBe('var(--status-warning-color)');
        });

        test('returns gray color for Provisioning status', () => {
            expect(getProxyStatusColor(ProxyStatus.Provisioning)).toBe('var(--status-gray-color)');
        });

        test('returns gray color for Initialized status', () => {
            expect(getProxyStatusColor(ProxyStatus.Initialized)).toBe('var(--status-gray-color)');
        });
    });
});
