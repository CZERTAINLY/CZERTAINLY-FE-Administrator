import { test, expect } from '../../../playwright/ct-test';
import Popover from './index';

test.describe('Popover', () => {
    test('should render popover with children', async ({ mount }) => {
        const component = await mount(
            <div>
                <Popover content="Popover content">
                    <button>Trigger</button>
                </Popover>
            </div>,
        );

        await expect(component.getByText('Trigger')).toBeVisible();
    });

    test('should render popover content', async ({ mount }) => {
        const component = await mount(
            <div>
                <Popover content="Popover content">
                    <button>Trigger</button>
                </Popover>
            </div>,
        );

        const content = component.getByText('Popover content');
        await expect(content).toBeAttached();
    });

    test('should render popover with title', async ({ mount }) => {
        const component = await mount(
            <div>
                <Popover content="Popover content" title="Popover Title">
                    <button>Trigger</button>
                </Popover>
            </div>,
        );

        const title = component.getByText('Popover Title');
        await expect(title).toBeAttached();
    });

    test('should render popover with React node content', async ({ mount }) => {
        const component = await mount(
            <div>
                <Popover content={<div>Custom Content</div>}>
                    <button>Trigger</button>
                </Popover>
            </div>,
        );

        const customContent = component.getByText('Custom Content');
        await expect(customContent).toBeAttached();
    });

    test('should render popover with React node children', async ({ mount }) => {
        const component = await mount(
            <div>
                <Popover content="Content">
                    <div>Custom Trigger</div>
                </Popover>
            </div>,
        );

        await expect(component.getByText('Custom Trigger')).toBeVisible();
    });

    test('should have correct role attribute', async ({ mount }) => {
        const component = await mount(
            <div>
                <Popover content="Popover content">
                    <button>Trigger</button>
                </Popover>
            </div>,
        );

        const tooltip = component.locator('[role="tooltip"]');
        await expect(tooltip).toBeAttached();
    });
});
