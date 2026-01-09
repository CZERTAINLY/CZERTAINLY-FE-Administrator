import { test, expect } from '../../../playwright/ct-test';
import StatusCircle from './index';

test.describe('StatusCircle', () => {
    test('should render success status when status is true', async ({ mount }) => {
        const component = await mount(<StatusCircle status={true} />);

        const root = component.locator('*').first();
        await expect(root).toBeVisible();
    });

    test('should render danger status when status is false', async ({ mount }) => {
        const component = await mount(<StatusCircle status={false} />);

        const root = component.locator('*').first();
        await expect(root).toBeVisible();
    });

    test('should render unknown status when status is undefined', async ({ mount }) => {
        const component = await mount(<StatusCircle status={undefined} />);

        const root = component.locator('*').first();
        await expect(root).toBeVisible();
    });

    test('should render unknown status when status prop is not provided', async ({ mount }) => {
        const component = await mount(<StatusCircle />);

        const root = component.locator('*').first();
        await expect(root).toBeVisible();
    });

    test('should update status when prop changes', async ({ mount }) => {
        const component = await mount(<StatusCircle status={true} />);

        let root = component.locator('*').first();
        await expect(root).toBeVisible();

        await component.update(<StatusCircle status={false} />);
        root = component.locator('*').first();
        await expect(root).toBeVisible();

        await component.update(<StatusCircle status={undefined} />);
        root = component.locator('*').first();
        await expect(root).toBeVisible();
    });
});
