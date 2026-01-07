import { test, expect } from '../../../playwright/ct-test';
import WidgetButtons, { WidgetButtonProps } from './index';

test.describe('WidgetButtons', () => {
    test('should render buttons', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [
            { icon: 'plus', disabled: false, onClick: () => {} },
            { icon: 'trash', disabled: false, onClick: () => {} },
        ];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} />
            </div>,
        );

        const buttonElements = component.locator('button');
        await expect(buttonElements).toHaveCount(2);
    });

    test('should call onClick when button is clicked', async ({ mount }) => {
        let clicked = false;
        const buttons: WidgetButtonProps[] = [{ icon: 'plus', disabled: false, onClick: () => (clicked = true) }];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} />
            </div>,
        );

        const button = component.locator('button').first();
        await button.click();
        expect(clicked).toBe(true);
    });

    test('should disable button when disabled is true', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [{ icon: 'plus', disabled: true, onClick: () => {} }];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} />
            </div>,
        );

        const button = component.locator('button').first();
        await expect(button).toBeDisabled();
    });

    test('should use custom data-testid when id is provided', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [{ icon: 'plus', id: 'custom-button', disabled: false, onClick: () => {} }];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} />
            </div>,
        );

        const button = component.locator('[data-testid="custom-button-button"]');
        await expect(button).toBeVisible();
    });

    test('should render custom button when custom prop is provided', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [{ icon: 'plus', disabled: false, onClick: () => {}, custom: <div>Custom Button</div> }];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} />
            </div>,
        );

        await expect(component.getByText('Custom Button')).toBeVisible();
    });

    test('should support justify prop', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [{ icon: 'plus', disabled: false, onClick: () => {} }];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} justify="end" />
            </div>,
        );

        const container = component.locator('div.flex');
        await expect(container).toHaveClass(/justify-end/);
    });

    test('should support custom className', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [{ icon: 'plus', disabled: false, onClick: () => {} }];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} className="custom-class" />
            </div>,
        );

        const container = component.locator('div.flex');
        await expect(container).toHaveClass(/custom-class/);
    });

    test('should render different icon types', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [
            { icon: 'plus', disabled: false, onClick: () => {} },
            { icon: 'trash', disabled: false, onClick: () => {} },
            { icon: 'copy', disabled: false, onClick: () => {} },
        ];

        const component = await mount(
            <div>
                <WidgetButtons buttons={buttons} />
            </div>,
        );

        const buttonElements = component.locator('button');
        await expect(buttonElements).toHaveCount(3);
    });
});
