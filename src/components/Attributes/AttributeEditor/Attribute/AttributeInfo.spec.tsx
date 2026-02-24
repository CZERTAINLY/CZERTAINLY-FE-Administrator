import { test, expect } from '../../../../../playwright/ct-test';
import { AttributeInfo } from './AttributeInfo';

test.describe('AttributeInfo', () => {
    test('renders label in heading', async ({ mount, page }) => {
        await mount(<AttributeInfo name="testInfo" label="Test Info Label" content="Simple text content" />);
        await expect(page.getByRole('heading', { name: 'Test Info Label' })).toBeVisible();
    });

    test('renders content area with server-content class', async ({ mount, page }) => {
        await mount(<AttributeInfo name="testInfo" label="Test Info Label" content="Simple text content" />);
        const content = page.locator('.server-content');
        await expect(content).toBeVisible();
    });

    test('renders container with name in id', async ({ mount, page }) => {
        await mount(<AttributeInfo name="testInfo" label="Test Info Label" content="Simple text content" />);
        await expect(page.locator('#testInfoInfo')).toBeVisible();
    });
});
