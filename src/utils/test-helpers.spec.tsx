import { test, expect } from '../../playwright/ct-test';
import { createMockStore, withProviders, waitForAsync } from './test-helpers';
import TestStoreConsumer from './TestStoreConsumer';
import TestRouteDisplay from './TestRouteDisplay';

test.describe('test-helpers', () => {
    test('createMockStore returns store with getState', () => {
        const store = createMockStore();
        expect(store.getState()).toBeDefined();
        expect(typeof store.getState()).toBe('object');
    });

    test('createMockStore with preloadedState merges state', () => {
        const store = createMockStore({
            userInterface: {
                globalModal: { isOpen: true },
            } as any,
        });
        const state = store.getState();
        expect(state).toBeDefined();
        expect(state.userInterface).toBeDefined();
        expect(state.userInterface.globalModal?.isOpen).toBe(true);
    });

    test('withProviders renders children with store', async ({ mount, page }) => {
        const store = createMockStore();
        await mount(withProviders(<TestStoreConsumer />, { store }));
        await expect(page.getByTestId('consumer')).toHaveText('has-store');
    });

    test('withProviders uses initialRoute for MemoryRouter', async ({ mount, page }) => {
        await mount(withProviders(<TestRouteDisplay />, { initialRoute: '/custom-path' }));
        await expect(page.getByTestId('route')).toHaveText('/custom-path');
    });

    test('waitForAsync resolves after timeout', async () => {
        const start = Date.now();
        await waitForAsync(50);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(40);
    });
});
