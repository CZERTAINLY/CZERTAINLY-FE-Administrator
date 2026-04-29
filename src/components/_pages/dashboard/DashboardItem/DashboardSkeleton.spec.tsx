import { test, expect } from '../../../../../playwright/ct-test';
import DashboardSkeleton from './DashboardSkeleton';

test.describe('DashboardSkeleton', () => {
    test('should render the correct number of count badge skeletons', async ({ mount }) => {
        const component = await mount(<DashboardSkeleton countBadges={4} charts={0} />);
        await expect(component.getByTestId('count-badge-skeleton')).toHaveCount(4);
    });

    test('should render the correct number of chart skeletons', async ({ mount }) => {
        const component = await mount(<DashboardSkeleton countBadges={0} charts={6} />);
        await expect(component.getByTestId('donut-chart-skeleton')).toHaveCount(6);
    });

    test('should render switch skeleton only on the first badge when firstBadgeWithSwitch is true', async ({ mount }) => {
        const component = await mount(<DashboardSkeleton countBadges={3} charts={0} firstBadgeWithSwitch />);
        await expect(component.getByTestId('switch-skeleton')).toHaveCount(1);
    });

    test('should not render switch skeleton when firstBadgeWithSwitch is false', async ({ mount }) => {
        const component = await mount(<DashboardSkeleton countBadges={3} charts={0} />);
        await expect(component.getByTestId('switch-skeleton')).toHaveCount(0);
    });

    test('should render both badges and charts together', async ({ mount }) => {
        const component = await mount(<DashboardSkeleton countBadges={3} charts={3} />);
        await expect(component.getByTestId('count-badge-skeleton')).toHaveCount(3);
        await expect(component.getByTestId('donut-chart-skeleton')).toHaveCount(3);
    });
});
