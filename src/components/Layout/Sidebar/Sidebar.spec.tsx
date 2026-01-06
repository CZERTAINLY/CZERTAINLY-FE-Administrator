import { test, expect } from '@playwright/experimental-ct-react';
import { createMockStore, withProviders } from 'utils/test-helpers';
import Sidebar from './index';

test.describe('Sidebar', () => {
    test('should render sidebar', async ({ mount }) => {
        const store = createMockStore();

        const component = await mount(withProviders(<Sidebar />, { store, initialRoute: '/' }));

        const sidebar = component.locator('nav, aside, [role="navigation"]').first();
        await expect(sidebar).toBeAttached();
    });
});
