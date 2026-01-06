import { test, expect } from '@playwright/experimental-ct-react';
import StatusBadge from './index';
import { ApprovalDtoStatusEnum, ApprovalDetailDtoStatusEnum, ApprovalStepRecipientDtoStatusEnum } from 'types/openapi';

test.describe('StatusBadge', () => {
    test('should render "Enabled" badge when enabled is true', async ({ mount }) => {
        const component = await mount(<StatusBadge enabled={true} />);

        await expect(component.getByText('Enabled')).toBeVisible();
    });

    test('should render "Disabled" badge when enabled is false', async ({ mount }) => {
        const component = await mount(<StatusBadge enabled={false} />);

        await expect(component.getByText('Disabled')).toBeVisible();
    });

    test('should render "Unknown" badge when enabled is undefined', async ({ mount }) => {
        const component = await mount(<StatusBadge enabled={undefined} />);

        await expect(component.getByText('Unknown')).toBeVisible();
    });

    test('should render "Approved" badge for Approved status', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDtoStatusEnum.Approved} />);

        await expect(component.getByText('Approved')).toBeVisible();
    });

    test('should render "Rejected" badge for Rejected status', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDtoStatusEnum.Rejected} />);

        await expect(component.getByText('Rejected')).toBeVisible();
    });

    test('should render "Pending" badge for Pending status', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDtoStatusEnum.Pending} />);

        await expect(component.getByText('Pending')).toBeVisible();
    });

    test('should render "Expired" badge for Expired status', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDtoStatusEnum.Expired} />);

        await expect(component.getByText('Expired')).toBeVisible();
    });

    test('should prioritize textStatus over enabled prop', async ({ mount }) => {
        const component = await mount(<StatusBadge enabled={true} textStatus={ApprovalDtoStatusEnum.Rejected} />);

        await expect(component.getByText('Rejected')).toBeVisible();
        await expect(component.getByText('Enabled')).not.toBeVisible();
    });

    test('should support ApprovalDetailDtoStatusEnum', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDetailDtoStatusEnum.Approved} />);
        await expect(component.getByText('Approved')).toBeVisible();
    });

    test('should support ApprovalDetailDtoStatusEnum.Rejected', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDetailDtoStatusEnum.Rejected} />);
        await expect(component.getByText('Rejected')).toBeVisible();
    });

    test('should support ApprovalDetailDtoStatusEnum.Pending', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalDetailDtoStatusEnum.Pending} />);
        await expect(component.getByText('Pending')).toBeVisible();
    });

    test('should support ApprovalStepRecipientDtoStatusEnum.Approved', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalStepRecipientDtoStatusEnum.Approved} />);
        await expect(component.getByText('Approved')).toBeVisible();
    });

    test('should support ApprovalStepRecipientDtoStatusEnum.Rejected', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalStepRecipientDtoStatusEnum.Rejected} />);
        await expect(component.getByText('Rejected')).toBeVisible();
    });

    test('should support ApprovalStepRecipientDtoStatusEnum.Pending', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalStepRecipientDtoStatusEnum.Pending} />);
        await expect(component.getByText('Pending')).toBeVisible();
    });

    test('should support ApprovalStepRecipientDtoStatusEnum.Expired', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={ApprovalStepRecipientDtoStatusEnum.Expired} />);
        await expect(component.getByText('Expired')).toBeVisible();
    });

    test('should render "Unknown" for unknown textStatus', async ({ mount }) => {
        const component = await mount(<StatusBadge textStatus={'UNKNOWN_STATUS' as any} />);
        await expect(component.getByText('Unknown')).toBeVisible();
    });

    test('should use custom data-testid when provided', async ({ mount }) => {
        const component = await mount(<StatusBadge enabled={true} dataTestId="custom-status-id" />);

        const badge = component.getByText('Enabled');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveAttribute('data-testid', 'custom-status-id');

        await expect(component.locator('[data-testid="status-badge"]')).toHaveCount(0);
    });

    test('should support custom style', async ({ mount }) => {
        const component = await mount(<StatusBadge enabled={true} style={{ marginTop: '10px' }} />);

        const badge = component.getByText('Enabled');
        await expect(badge).toBeVisible();
    });
});
