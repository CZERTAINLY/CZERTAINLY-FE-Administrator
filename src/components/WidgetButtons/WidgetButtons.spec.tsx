import { test, expect } from '../../../playwright/ct-test';
import WidgetButtons, { WidgetButtonProps } from './index';

const createButton = (overrides: Partial<WidgetButtonProps> = {}): WidgetButtonProps => ({
    icon: 'plus',
    disabled: false,
    onClick: () => {},
    ...overrides,
});

async function renderWidgetButtons(
    mount: (component: React.JSX.Element) => Promise<import('@playwright/experimental-ct-react').MountResult>,
    props: React.ComponentProps<typeof WidgetButtons>,
) {
    return mount(
        <div>
            <WidgetButtons {...props} />
        </div>,
    );
}

test.describe('WidgetButtons', () => {
    test('should render buttons', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton(), createButton({ icon: 'trash' })];
        const component = await renderWidgetButtons(mount, { buttons });

        const buttonElements = component.locator('button');
        await expect(buttonElements).toHaveCount(2);
    });

    test('should call onClick when button is clicked', async ({ mount }) => {
        let clicked = false;
        const buttons: WidgetButtonProps[] = [createButton({ onClick: () => (clicked = true) })];
        const component = await renderWidgetButtons(mount, { buttons });

        const button = component.locator('button').first();
        await button.click();
        expect(clicked).toBe(true);
    });

    test('should disable button when disabled is true', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton({ disabled: true })];
        const component = await renderWidgetButtons(mount, { buttons });

        const button = component.locator('button').first();
        await expect(button).toBeDisabled();
    });

    test('should use custom data-testid when id is provided', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton({ id: 'custom-button' })];
        const component = await renderWidgetButtons(mount, { buttons });

        const button = component.locator('[data-testid="custom-button-button"]');
        await expect(button).toBeVisible();
    });

    test('should render custom button when custom prop is provided', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton({ custom: <div>Custom Button</div> })];
        const component = await renderWidgetButtons(mount, { buttons });

        await expect(component.getByText('Custom Button')).toBeVisible();
    });

    test('should support justify prop', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton()];
        const component = await renderWidgetButtons(mount, { buttons, justify: 'end' });

        const container = component.locator('div.flex');
        await expect(container).toHaveClass(/justify-end/);
    });

    test('should support custom className', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton()];
        const component = await renderWidgetButtons(mount, { buttons, className: 'custom-class' });

        const container = component.locator('div.flex');
        await expect(container).toHaveClass(/custom-class/);
    });

    test('should render different icon types', async ({ mount }) => {
        const buttons: WidgetButtonProps[] = [createButton(), createButton({ icon: 'trash' }), createButton({ icon: 'copy' })];
        const component = await renderWidgetButtons(mount, { buttons });

        const buttonElements = component.locator('button');
        await expect(buttonElements).toHaveCount(3);
    });
});
