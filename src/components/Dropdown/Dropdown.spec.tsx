import { test, expect } from '../../../playwright/ct-test';
import Dropdown from './index';

test.describe('Dropdown', () => {
    test('should render dropdown button', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await expect(button).toBeVisible();
    });

    test('should render dropdown items', async ({ mount }) => {
        const items = [
            { title: 'Item 1', onClick: () => {} },
            { title: 'Item 2', onClick: () => {} },
        ];

        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={items} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await button.click();

        await component.page().waitForTimeout(100);

        const item1 = component.getByText('Item 1');
        const item2 = component.getByText('Item 2');
        await expect(item1).toBeAttached();
        await expect(item2).toBeAttached();
    });

    test('should call onClick when item 1 is clicked', async ({ mount }) => {
        let item1Clicked = false;
        const items = [
            { title: 'Item 1', onClick: () => (item1Clicked = true) },
            { title: 'Item 2', onClick: () => {} },
        ];

        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={items} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await button.click();
        await component.page().waitForTimeout(100);

        const item1 = component.getByText('Item 1');
        await item1.click();
        expect(item1Clicked).toBe(true);
    });

    test('should call onClick when item 2 is clicked', async ({ mount }) => {
        let item2Clicked = false;
        const items = [
            { title: 'Item 1', onClick: () => {} },
            { title: 'Item 2', onClick: () => (item2Clicked = true) },
        ];

        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={items} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await button.click();
        await component.page().waitForTimeout(100);

        const item2 = component.getByText('Item 2');
        await item2.click();
        expect(item2Clicked).toBe(true);
    });

    test('should be disabled when disabled prop is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} disabled={true} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await expect(button).toBeDisabled();
    });

    test('should hide arrow when hideArrow is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} hideArrow={true} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });

        const arrow = button.locator('svg');
        await expect(arrow).toHaveCount(0);
    });

    test('should show arrow by default', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        const arrow = button.locator('svg');
        await expect(arrow).toBeAttached();
    });

    test('should render custom menu content', async ({ mount }) => {
        const customMenu = <div>Custom Menu Content</div>;

        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} menu={customMenu} />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await button.click();
        await component.page().waitForTimeout(100);

        const customContent = component.getByText('Custom Menu Content');
        await expect(customContent).toBeAttached();
    });

    test('should support transparent button style', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} btnStyle="transparent" />
            </div>,
        );

        const button = component.getByRole('button', { name: 'Dropdown' });
        await expect(button).toHaveClass(/bg-transparent/);
    });

    test('should support custom className', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title="Dropdown" items={[]} className="custom-dropdown" />
            </div>,
        );

        const dropdown = component.locator('.hs-dropdown');
        await expect(dropdown).toHaveClass(/custom-dropdown/);
    });

    test('should render with React node title', async ({ mount }) => {
        const component = await mount(
            <div>
                <Dropdown title={<span>Custom Title</span>} items={[]} />
            </div>,
        );

        await expect(component.getByText('Custom Title')).toBeVisible();
    });
});
