import { test, expect } from '../../../../../playwright/ct-test';
import KeyStatus from './index';
import { KeyEventHistoryDtoStatusEnum } from 'types/openapi';

test.describe('KeyStatus', () => {
    test('should render Success badge', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatus status={KeyEventHistoryDtoStatusEnum.Success} />
            </div>,
        );

        await expect(component.getByText('Success')).toBeVisible();
    });

    test('should render Failed badge', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatus status={KeyEventHistoryDtoStatusEnum.Failed} />
            </div>,
        );

        await expect(component.getByText('Failed')).toBeVisible();
    });

    test('should render Unknown when status is undefined', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatus status={undefined} />
            </div>,
        );

        await expect(component.getByText('Unknown')).toBeVisible();
    });

    test('should render icon when asIcon is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <KeyStatus status={KeyEventHistoryDtoStatusEnum.Success} asIcon={true} />
            </div>,
        );

        const icon = component.locator('svg');
        await expect(icon).toBeVisible();
        await expect(icon).toHaveAttribute('title', 'Success');
    });
});
