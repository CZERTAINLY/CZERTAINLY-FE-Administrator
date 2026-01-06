import { test, expect } from '@playwright/experimental-ct-react';
import Tabs from './index';

test.describe('Tabs', () => {
    test('should render tabs', async ({ mount }) => {
        const tabs = [{ title: 'Tab 1' }, { title: 'Tab 2' }, { title: 'Tab 3' }];

        const component = await mount(
            <div>
                <Tabs tabs={tabs} selectedTab={0} onTabChange={() => {}} />
            </div>,
        );

        const nav = component.getByRole('tablist');
        await expect(nav).toBeVisible();
    });

    test('should render all tab buttons', async ({ mount }) => {
        const tabs = [{ title: 'Tab 1' }, { title: 'Tab 2' }, { title: 'Tab 3' }];

        const component = await mount(
            <div>
                <Tabs tabs={tabs} selectedTab={0} onTabChange={() => {}} />
            </div>,
        );

        await expect(component.getByRole('tab', { name: 'Tab 1' })).toBeVisible();
        await expect(component.getByRole('tab', { name: 'Tab 2' })).toBeVisible();
        await expect(component.getByRole('tab', { name: 'Tab 3' })).toBeVisible();
    });

    test('should call onTabChange when tab is clicked', async ({ mount }) => {
        const tabs = [{ title: 'Tab 1' }, { title: 'Tab 2' }];

        let selectedTab = 0;
        const handleTabChange = (tab: number) => {
            selectedTab = tab;
        };

        const component = await mount(
            <div>
                <Tabs tabs={tabs} selectedTab={0} onTabChange={handleTabChange} />
            </div>,
        );

        const tab2 = component.getByRole('tab', { name: 'Tab 2' });
        await tab2.click();
        expect(selectedTab).toBe(1);
    });

    test('should call onClick handler when tab has onClick prop', async ({ mount }) => {
        let onClickCalled = false;
        const tabs = [{ title: 'Tab 1' }, { title: 'Tab 2', onClick: () => (onClickCalled = true) }];

        const component = await mount(
            <div>
                <Tabs tabs={tabs} selectedTab={0} onTabChange={() => {}} />
            </div>,
        );

        const tab2 = component.getByRole('tab', { name: 'Tab 2' });
        await tab2.click();
        expect(onClickCalled).toBe(true);
    });

    test('should render tabs with React node titles', async ({ mount }) => {
        const tabs = [{ title: <span>Custom Tab 1</span> }, { title: <span>Custom Tab 2</span> }];

        const component = await mount(
            <div>
                <Tabs tabs={tabs} selectedTab={0} onTabChange={() => {}} />
            </div>,
        );

        await expect(component.getByText('Custom Tab 1')).toBeVisible();
        await expect(component.getByText('Custom Tab 2')).toBeVisible();
    });

    test('should set correct aria attributes', async ({ mount }) => {
        const tabs = [{ title: 'Tab 1' }, { title: 'Tab 2' }];

        const component = await mount(
            <div>
                <Tabs tabs={tabs} selectedTab={0} onTabChange={() => {}} />
            </div>,
        );

        const tab1 = component.getByRole('tab', { name: 'Tab 1' });
        await expect(tab1).toHaveAttribute('id', 'pills-on-gray-color-item-0');
        await expect(tab1).toHaveAttribute('data-hs-tab', '#pills-on-gray-color-0');
        await expect(tab1).toHaveAttribute('aria-controls', 'pills-on-gray-color-0');
    });

    test('should handle empty tabs array', async ({ mount }) => {
        const component = await mount(
            <div>
                <Tabs tabs={[]} selectedTab={0} onTabChange={() => {}} />
            </div>,
        );

        const nav = component.getByRole('tablist');

        await expect(nav).toBeAttached();

        const tabs = component.locator('button[role="tab"]');
        await expect(tabs).toHaveCount(0);
    });
});
