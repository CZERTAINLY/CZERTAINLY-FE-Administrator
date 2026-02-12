import { test, expect } from '../../../../../playwright/ct-test';
import TokenStatusBadge from './index';
import { TokenInstanceStatus } from 'types/openapi';

test.describe('TokenStatusBadge', () => {
    test('should render Activated badge', async ({ mount }) => {
        const component = await mount(
            <div>
                <TokenStatusBadge status={TokenInstanceStatus.Activated} />
            </div>,
        );

        await expect(component.getByText('Activated')).toBeVisible();
    });

    test('should render Deactivated badge', async ({ mount }) => {
        const component = await mount(
            <div>
                <TokenStatusBadge status={TokenInstanceStatus.Deactivated} />
            </div>,
        );

        await expect(component.getByText('Deactivated')).toBeVisible();
    });

    test('should render status as badge for unknown status', async ({ mount }) => {
        const component = await mount(
            <div>
                <TokenStatusBadge status={'Unknown' as TokenInstanceStatus} />
            </div>,
        );

        await expect(component.getByText('Unknown')).toBeVisible();
    });
});
