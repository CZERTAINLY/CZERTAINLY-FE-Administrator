import { test, expect } from '../../../playwright/ct-test';
import LayoutWithStore from './LayoutWithStore';

test.describe('Layout', () => {
    test('should render header, main area and outlet content', async ({ mount }) => {
        const component = await mount(<LayoutWithStore />);
        await expect(component.getByTestId('header')).toBeVisible();
        await expect(component.getByTestId('layout-outlet')).toBeVisible();
        await expect(component.getByText('Outlet content')).toBeVisible();
    });
});
