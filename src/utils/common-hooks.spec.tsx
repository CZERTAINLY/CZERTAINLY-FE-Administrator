import './ct-window-shim';
import { test, expect } from '../../playwright/ct-test';
import { DeviceType } from './common-hooks';
import {
    UseWindowSizeHarness,
    UseDeviceTypeHarness,
    UseCopyToClipboardHarness,
    UseRunOnFinishedHarness,
    UseAreDefaultValuesSameHarness,
} from './common-hooks-harness';
import { withProviders, createMockStore } from './test-helpers';

test.describe('useWindowSize', () => {
    test('returns width and height as numbers', async ({ mount, page }) => {
        await mount(<UseWindowSizeHarness />);
        const width = page.getByTestId('width');
        const height = page.getByTestId('height');
        await expect(width).toBeVisible({ timeout: 10000 });
        await expect(height).toBeVisible({ timeout: 10000 });
        const w = await width.textContent();
        const h = await height.textContent();
        expect(Number(w)).toBeGreaterThan(0);
        expect(Number(h)).toBeGreaterThan(0);
    });
});

test.describe('useDeviceType', () => {
    test('returns one of mobile, tablet, desktop', async ({ mount, page }) => {
        await mount(<UseDeviceTypeHarness />);
        const el = page.getByTestId('device-type');
        await expect(el).toBeVisible({ timeout: 10000 });
        const value = (await el.textContent())?.trim() ?? '';
        expect([DeviceType.Mobile, DeviceType.Tablet, DeviceType.Desktop]).toContain(value);
    });
});

test.describe('useCopyToClipboard', () => {
    test('copy button is visible and clickable without error', async ({ mount, page }) => {
        const store = createMockStore();
        await mount(withProviders(<UseCopyToClipboardHarness />, { store }));
        const btn = page.getByTestId('copy-btn');
        await expect(btn).toBeVisible({ timeout: 10000 });
        await btn.click();
        await expect(btn).toBeVisible();
    });
});

test.describe('useRunOnFinished', () => {
    test('runs callback when flag goes from true to false', async ({ mount, page }) => {
        await mount(<UseRunOnFinishedHarness />);
        await expect(page.getByTestId('run-result')).toHaveText('ran', { timeout: 5000 });
    });
});

test.describe('useAreDefaultValuesSame', () => {
    test('returns true when values match defaultValues', async ({ mount, page }) => {
        await mount(<UseAreDefaultValuesSameHarness />);
        await expect(page.getByTestId('same')).toHaveText('true', { timeout: 10000 });
    });

    test('returns false when values differ from defaultValues', async ({ mount, page }) => {
        await mount(<UseAreDefaultValuesSameHarness />);
        await expect(page.getByTestId('diff')).toHaveText('false', { timeout: 10000 });
    });

    test('returns false when values have extra keys', async ({ mount, page }) => {
        await mount(<UseAreDefaultValuesSameHarness />);
        await expect(page.getByTestId('diff-keys')).toHaveText('false', { timeout: 10000 });
    });
});
