import { test, expect } from '@playwright/experimental-ct-react';
import { createMockStore, withProviders, waitForAsync } from 'utils/test-helpers';
import TabLayout from './index';

test.describe('TabLayout', () => {
    test('should render tabs', async ({ mount }) => {
        const tabs = [
            { title: 'Tab 1', content: <div>Content 1</div> },
            { title: 'Tab 2', content: <div>Content 2</div> },
        ];

        // Use default store state - createMockStore initializes all reducers
        const store = createMockStore();
        const component = await mount(withProviders(<TabLayout tabs={tabs} />, { store }));
        await waitForAsync(200);

        await expect(component.getByText('Tab 1')).toBeVisible();
        await expect(component.getByText('Tab 2')).toBeVisible();
    });

    test('should render active tab content when onlyActiveTabContent is true', async ({ mount }) => {
        const tabs = [
            { title: 'Tab 1', content: <div>Content 1</div> },
            { title: 'Tab 2', content: <div>Content 2</div> },
        ];

        // Use default store state - createMockStore initializes all reducers
        const store = createMockStore();
        const component = await mount(withProviders(<TabLayout tabs={tabs} onlyActiveTabContent={true} />, { store }));
        await waitForAsync(200);

        await expect(component.getByText('Content 1')).toBeVisible();

        const content2 = component.getByText('Content 2');
        await expect(content2).not.toBeVisible();
    });

    test('should render all tab content when onlyActiveTabContent is false', async ({ mount }) => {
        const tabs = [
            { title: 'Tab 1', content: <div>Content 1</div> },
            { title: 'Tab 2', content: <div>Content 2</div> },
        ];

        // Use default store state - createMockStore initializes all reducers
        const store = createMockStore();
        const component = await mount(withProviders(<TabLayout tabs={tabs} onlyActiveTabContent={false} />, { store }));
        await waitForAsync(200);

        await expect(component.getByText('Content 1')).toBeVisible();
        await expect(component.getByText('Content 2')).toBeVisible();
    });

    test('should hide hidden tabs', async ({ mount }) => {
        const tabs = [
            { title: 'Tab 1', content: <div>Content 1</div> },
            { title: 'Tab 2', content: <div>Content 2</div>, hidden: true },
            { title: 'Tab 3', content: <div>Content 3</div> },
        ];

        // Use default store state - createMockStore initializes all reducers
        const store = createMockStore();
        const component = await mount(withProviders(<TabLayout tabs={tabs} />, { store }));
        await waitForAsync(200);

        await expect(component.getByText('Tab 1')).toBeVisible();
        await expect(component.getByText('Tab 2')).not.toBeVisible();
        await expect(component.getByText('Tab 3')).toBeVisible();
    });

    test('should use selectedTab prop when provided', async ({ mount }) => {
        const tabs = [
            { title: 'Tab 1', content: <div>Content 1</div> },
            { title: 'Tab 2', content: <div>Content 2</div> },
        ];

        // Use default store state - createMockStore initializes all reducers
        const store = createMockStore();
        const component = await mount(withProviders(<TabLayout tabs={tabs} selectedTab={1} />, { store }));
        await waitForAsync(200);

        await expect(component.getByText('Content 2')).toBeVisible();
    });

    test('should render with noBorder prop', async ({ mount }) => {
        const tabs = [{ title: 'Tab 1', content: <div>Content 1</div> }];

        // Use default store state - createMockStore initializes all reducers
        const store = createMockStore();
        const component = await mount(withProviders(<TabLayout tabs={tabs} noBorder={true} />, { store }));
        await waitForAsync(200);

        await expect(component.getByText('Tab 1')).toBeVisible();
    });
});
