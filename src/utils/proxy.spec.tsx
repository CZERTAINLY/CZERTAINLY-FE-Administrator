import { test, expect } from '../../playwright/ct-test';
import { formatProxyStatus, getProxyStatusColor } from './proxy';
import { ProxyStatus } from 'types/openapi';

test.describe('proxy utils', () => {
    test.describe('formatProxyStatus', () => {
        test('formats Initialized status correctly', () => {
            expect(formatProxyStatus(ProxyStatus.Initialized)).toBe('Initialized');
        });

        test('formats Provisioning status correctly', () => {
            expect(formatProxyStatus(ProxyStatus.Provisioning)).toBe('Provisioning');
        });

        test('formats Failed status correctly', () => {
            expect(formatProxyStatus(ProxyStatus.Failed)).toBe('Failed');
        });

        test('formats WaitingForInstallation status correctly', () => {
            expect(formatProxyStatus(ProxyStatus.WaitingForInstallation)).toBe('Waiting for installation');
        });

        test('formats Connected status correctly', () => {
            expect(formatProxyStatus(ProxyStatus.Connected)).toBe('Connected');
        });

        test('formats Disconnected status correctly', () => {
            expect(formatProxyStatus(ProxyStatus.Disconnected)).toBe('Disconnected');
        });
    });

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
