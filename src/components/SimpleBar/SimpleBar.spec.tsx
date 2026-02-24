import { test, expect } from '../../../playwright/ct-test';
import SimpleBar from './index';

test.describe('SimpleBar', () => {
    test('should render children', async ({ mount }) => {
        const component = await mount(
            <SimpleBar>
                <div data-testid="simplebar-content">Scrollable content</div>
            </SimpleBar>,
        );

        await expect(component.getByTestId('simplebar-content')).toBeVisible();
        await expect(component.getByText('Scrollable content')).toBeVisible();
    });

    test('should render with multiple children', async ({ mount }) => {
        const component = await mount(
            <SimpleBar>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </SimpleBar>,
        );

        await expect(component.getByText('Item 1')).toBeVisible();
        await expect(component.getByText('Item 2')).toBeVisible();
        await expect(component.getByText('Item 3')).toBeVisible();
    });
});
