import { test, expect } from '../../playwright/ct-test';
import { inventoryStatus } from './connector';

test.describe('connector utils', () => {
    test.describe('inventoryStatus', () => {
        test('returns label and color for Success', () => {
            expect(inventoryStatus('Success')).toEqual(['Success', 'var(--status-success-color)']);
        });

        test('returns label and color for registered', () => {
            expect(inventoryStatus('registered')).toEqual(['Reistered', 'var(--status-success-color)']);
        });

        test('returns label and color for connected', () => {
            expect(inventoryStatus('connected')).toEqual(['Connected', 'var(--status-success-color)']);
        });

        test('returns label and color for failed', () => {
            expect(inventoryStatus('failed')).toEqual(['Failed', 'var(--status-danger-color)']);
        });

        test('returns label and color for Failed', () => {
            expect(inventoryStatus('Failed')).toEqual(['Failed', 'var(--status-danger-color)']);
        });

        test('returns label and color for offline', () => {
            expect(inventoryStatus('offline')).toEqual(['Offline', 'var(--status-danger-color)']);
        });

        test('returns label and color for waitingForApproval', () => {
            expect(inventoryStatus('waitingForApproval')).toEqual(['Waiting for Approval', 'var(--status-warning-color)']);
        });

        test('returns status and gray color for unknown status', () => {
            expect(inventoryStatus('custom')).toEqual(['custom', 'var(--status-gray-color)']);
        });

        test('returns Unknown and gray for empty string', () => {
            expect(inventoryStatus('')).toEqual(['Unknown', 'var(--status-gray-color)']);
        });
    });
});
