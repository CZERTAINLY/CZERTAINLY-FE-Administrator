import { test, expect } from '../../../../playwright/ct-test';
import TabLayoutWithStore from './TabLayoutWithStore';

test.describe('TabLayout', () => {
    test('should render tabs and active tab content', async ({ mount }) => {
        const component = await mount(
            <TabLayoutWithStore
                tabs={[
                    { title: 'Tab One', content: <div data-testid="tab-one-content">Content 1</div> },
                    { title: 'Tab Two', content: <div data-testid="tab-two-content">Content 2</div> },
                ]}
            />,
        );
        await expect(component.getByText('Tab One')).toBeVisible();
        await expect(component.getByText('Tab Two')).toBeVisible();
        await expect(component.getByTestId('tab-one-content')).toBeVisible();
        await expect(component.getByTestId('tab-one-content')).toHaveText('Content 1');
    });

    test('should render with onlyActiveTabContent false', async ({ mount }) => {
        const component = await mount(
            <TabLayoutWithStore
                tabs={[
                    { title: 'A', content: <span data-testid="a">A</span> },
                    { title: 'B', content: <span data-testid="b">B</span> },
                ]}
                onlyActiveTabContent={false}
            />,
        );
        await expect(component.getByTestId('a')).toBeVisible();
        await expect(component.getByTestId('b')).toBeVisible();
    });
});
