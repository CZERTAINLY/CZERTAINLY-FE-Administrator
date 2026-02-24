import React from 'react';
import { test, expect } from '../../../../playwright/ct-test';
import { slice as infoSlice } from 'ducks/info';
import PlatformInfoDialogButtonWithStore from './PlatformInfoDialogButtonWithStore';

const mockPlatformInfo = {
    app: { name: 'Core', version: '2.16.4-SNAPSHOT' },
    db: { system: 'PostgreSQL', version: '15.6' },
};

const preloadedState = {
    [infoSlice.name]: { platformInfo: mockPlatformInfo, isFetching: false },
};

test.describe('PlatformInfoDialogButton', () => {
    test('should render Version Info button', async ({ mount, page }) => {
        await mount(<PlatformInfoDialogButtonWithStore preloadedState={preloadedState} />);

        const trigger = page.getByRole('button', { name: 'Version Info' });
        await expect(trigger).toBeVisible({ timeout: 10000 });
    });

    test('should open dialog when button is clicked', async ({ mount, page }) => {
        await mount(<PlatformInfoDialogButtonWithStore preloadedState={preloadedState} />);

        await page.getByRole('button', { name: 'Version Info' }).click();

        await expect(page.getByRole('heading', { name: 'Platform versions info' })).toBeVisible();
    });

    test('should show Spinner after opening dialog (getPlatformInfo clears data)', async ({ mount, page }) => {
        await mount(<PlatformInfoDialogButtonWithStore preloadedState={preloadedState} />);

        await page.getByRole('button', { name: 'Version Info' }).click();

        await expect(page.getByRole('heading', { name: 'Platform versions info' })).toBeVisible();
        await expect(page.getByRole('status', { name: 'loading' })).toBeVisible();
    });

    test('should show Close button in dialog', async ({ mount, page }) => {
        await mount(<PlatformInfoDialogButtonWithStore preloadedState={preloadedState} />);

        await page.getByRole('button', { name: 'Version Info' }).click();

        await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    });
});
