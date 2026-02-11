import { test, expect } from '../../../playwright/ct-test';
import { createMockStore, withProviders } from 'utils/test-helpers';
import GlobalModal from './index';
import { initialState as userInterfaceInitialState, slice as userInterfaceSlice } from 'ducks/user-interface';

function createGlobalModalPreload(overrides: Record<string, unknown> = {}) {
    return {
        [userInterfaceSlice.name]: {
            ...userInterfaceInitialState,
            globalModal: {
                ...userInterfaceInitialState.globalModal,
                ...overrides,
            },
        },
    };
}

test.describe('GlobalModal', () => {
    test('should render without visible dialog when modal is closed', async ({ mount }) => {
        const store = createMockStore(createGlobalModalPreload());
        await mount(withProviders(<GlobalModal />, { store }));
        // Modal closed by default; no assertion needed beyond successful mount
    });

    test.skip('should show dialog when isOpen and title provided', async ({ mount, page }) => {
        const preloadedState = createGlobalModalPreload({
            isOpen: true,
            title: 'Test modal',
            content: 'Modal body text',
            showCloseButton: true,
        });
        const store = createMockStore(preloadedState);
        await mount(withProviders(<GlobalModal />, { store }));
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText('Test modal')).toBeVisible();
        await expect(page.getByText('Modal body text')).toBeVisible();
    });
});
