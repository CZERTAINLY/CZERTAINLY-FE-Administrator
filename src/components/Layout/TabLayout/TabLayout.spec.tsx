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

    test('should switch content when second tab is clicked', async ({ mount }) => {
        const component = await mount(
            <TabLayoutWithStore
                tabs={[
                    { title: 'Tab One', content: <div data-testid="tab-one">One</div> },
                    { title: 'Tab Two', content: <div data-testid="tab-two">Two</div> },
                ]}
            />,
        );
        await expect(component.getByTestId('tab-one')).toBeVisible();
        await component.getByText('Tab Two').click();
        await expect(component.getByTestId('tab-two')).toBeVisible();
        await expect(component.getByTestId('tab-one')).not.toBeVisible();
    });

    test('should filter hidden tabs', async ({ mount }) => {
        const component = await mount(
            <TabLayoutWithStore
                tabs={[
                    { title: 'Visible', content: <span data-testid="visible">Visible</span> },
                    { title: 'Hidden', content: <span data-testid="hidden">Hidden</span>, hidden: true },
                ]}
            />,
        );
        await expect(component.getByRole('tab', { name: 'Visible' })).toBeVisible();
        await expect(component.getByText('Hidden')).not.toBeVisible();
        await expect(component.getByTestId('visible')).toBeVisible();
    });

    test('should support noBorder', async ({ mount, page }) => {
        await mount(<TabLayoutWithStore tabs={[{ title: 'Tab', content: <div>Content</div> }]} noBorder={true} />);
        await expect(page.getByTestId('tab-layout')).toBeVisible();
        await expect(page.getByText('Content')).toBeVisible();
    });
});
