import { test, expect } from '../../../../../playwright/ct-test';
import KeyStatusCircle from './index';

test.describe('KeyStatusCircle', () => {
    test('should render enabled state', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatusCircle status={true} />
            </div>,
        );

        const circle = component.getByTestId('key-status-circle');
        await expect(circle).toBeAttached();
        await expect(circle).toHaveAttribute('title', 'Enabled');
    });

    test('should render disabled state', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatusCircle status={false} />
            </div>,
        );

        const circle = component.getByTestId('key-status-circle');
        await expect(circle).toBeAttached();
        await expect(circle).toHaveAttribute('title', 'Disabled');
    });

    test('should support custom dataTestId', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatusCircle status={true} dataTestId="custom-key-status" />
            </div>,
        );

        const circle = component.getByTestId('custom-key-status');
        await expect(circle).toBeAttached();
    });
});
