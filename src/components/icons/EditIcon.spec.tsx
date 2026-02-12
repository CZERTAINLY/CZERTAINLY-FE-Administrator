import { test, expect } from '../../../playwright/ct-test';
import EditIcon from './EditIcon';

test.describe('EditIcon', () => {
    test('should render with default data-testid', async ({ mount }) => {
        const component = await mount(
            <div data-testid="edit-icon-wrapper">
                <EditIcon />
            </div>,
        );

        const icon = component.getByTestId('edit-icon');
        await expect(icon).toBeVisible();
    });

    test('should support size prop', async ({ mount }) => {
        const component = await mount(
            <div>
                <EditIcon size={24} />
            </div>,
        );

        const svg = component.locator('svg[data-testid="edit-icon"]');
        await expect(svg).toBeVisible();
        await expect(svg).toHaveAttribute('width', '24');
        await expect(svg).toHaveAttribute('height', '24');
    });

    test('should support custom dataTestId', async ({ mount }) => {
        const component = await mount(
            <div>
                <EditIcon dataTestId="custom-edit-icon" />
            </div>,
        );

        const icon = component.getByTestId('custom-edit-icon');
        await expect(icon).toBeVisible();
    });

    test('should support className prop', async ({ mount }) => {
        const component = await mount(
            <div>
                <EditIcon className="custom-icon-class" />
            </div>,
        );

        const svg = component.locator('svg.custom-icon-class');
        await expect(svg).toBeVisible();
    });
});
