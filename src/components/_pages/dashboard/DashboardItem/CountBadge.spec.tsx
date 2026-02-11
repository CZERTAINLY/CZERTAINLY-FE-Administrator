import { test, expect } from '../../../../../playwright/ct-test';
import CountBadgeWithStore from './CountBadgeWithStore';

test.describe('CountBadge', () => {
    test('should render title, link and data', async ({ mount }) => {
        const component = await mount(<CountBadgeWithStore title="Total certificates" link="/certificates" data={42} />);
        await expect(component.getByRole('heading', { name: 'Total certificates' })).toBeVisible();
        await expect(component.getByRole('link', { name: 'Total certificates' })).toHaveAttribute('href', '/certificates');
        await expect(component.getByText('42')).toBeVisible();
    });

    test('should render without data', async ({ mount }) => {
        const component = await mount(<CountBadgeWithStore title="Empty" link="/empty" />);
        await expect(component.getByRole('heading', { name: 'Empty' })).toBeVisible();
    });

    test('should render extra component when provided', async ({ mount }) => {
        const component = await mount(
            <CountBadgeWithStore title="With extra" link="/x" data={1} extraComponent={<span data-testid="extra">Extra</span>} />,
        );
        await expect(component.getByTestId('extra')).toBeVisible();
        await expect(component.getByTestId('extra')).toHaveText('Extra');
    });
});
