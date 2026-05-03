import { test, expect } from '../../../playwright/ct-test';
import PagedListSkeleton from './PagedListSkeleton';

test.describe('PagedListSkeleton', () => {
    test('should render 10 skeleton rows', async ({ mount }) => {
        const component = await mount(<PagedListSkeleton />);
        await expect(component.getByTestId('skeleton-row')).toHaveCount(10);
    });

    test('should render filter widget skeleton when hasFilter is true', async ({ mount }) => {
        const component = await mount(<PagedListSkeleton hasFilter />);
        await expect(component.getByTestId('filter-widget-skeleton')).toHaveCount(1);
    });

    test('should not render filter widget skeleton when hasFilter is false', async ({ mount }) => {
        const component = await mount(<PagedListSkeleton />);
        await expect(component.getByTestId('filter-widget-skeleton')).toHaveCount(0);
    });

    test('should render the correct number of button skeletons', async ({ mount }) => {
        const component = await mount(<PagedListSkeleton buttonsCount={3} />);
        const header = component.getByTestId('paged-list-skeleton').locator('section').first().locator('> div').first();
        const buttons = header.locator('> div').last().locator('> div');
        await expect(buttons).toHaveCount(3);
    });
});
