import { test, expect } from '../../../playwright/ct-test';
import WidgetLock from './index';
import { LockTypeEnum } from 'types/user-interface';

test.describe('WidgetLock', () => {
    test('should render widget lock with title and text', async ({ mount }) => {
        const component = await mount(<WidgetLock lockTitle="Test Lock" lockText="Test lock text" />);

        await expect(component.getByRole('heading', { name: 'Test Lock' })).toBeVisible();
        await expect(component.getByText('Test lock text')).toBeVisible();
    });

    test('should render with default title and text when not provided', async ({ mount }) => {
        const component = await mount(<WidgetLock />);

        await expect(component.getByText('There was some problem')).toBeVisible();
        await expect(component.getByText('There was some issue please try again later')).toBeVisible();
    });

    test('should render info icon button when lockDetails is provided', async ({ mount }) => {
        const component = await mount(<WidgetLock lockTitle="Test Lock" lockText="Test text" lockDetails="Test details" />);

        const infoButton = component.locator('button[type="button"]');
        await expect(infoButton).toBeVisible();
    });

    test('should not render info icon button when lockDetails is not provided', async ({ mount }) => {
        const component = await mount(<WidgetLock lockTitle="Test Lock" lockText="Test text" />);

        const infoButton = component.locator('button[type="button"]');
        await expect(infoButton).not.toBeVisible();
    });

    test('should render GENERIC lock type icon', async ({ mount }) => {
        const component = await mount(<WidgetLock lockType={LockTypeEnum.GENERIC} />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should render CLIENT lock type icon', async ({ mount }) => {
        const component = await mount(<WidgetLock lockType={LockTypeEnum.CLIENT} />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should render PERMISSION lock type icon', async ({ mount }) => {
        const component = await mount(<WidgetLock lockType={LockTypeEnum.PERMISSION} />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should render NETWORK lock type icon', async ({ mount }) => {
        const component = await mount(<WidgetLock lockType={LockTypeEnum.NETWORK} />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should render SERVICE_ERROR lock type icon', async ({ mount }) => {
        const component = await mount(<WidgetLock lockType={LockTypeEnum.SERVICE_ERROR} />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should render SERVER_ERROR lock type icon', async ({ mount }) => {
        const component = await mount(<WidgetLock lockType={LockTypeEnum.SERVER_ERROR} />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should support small size', async ({ mount }) => {
        const component = await mount(<WidgetLock size="small" />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should support normal size', async ({ mount }) => {
        const component = await mount(<WidgetLock size="normal" />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should support large size', async ({ mount }) => {
        const component = await mount(<WidgetLock size="large" />);
        await expect(component.getByText('There was some problem')).toBeVisible();
    });

    test('should use custom data-testid when provided', async ({ mount }) => {
        const component = await mount(<WidgetLock lockTitle="Test" dataTestId="custom-lock-id" />);

        await expect(component.getByRole('heading', { name: 'Test' })).toBeVisible();

        const customLockContainer = component.locator('[data-testid="custom-lock-id"]');
        await expect(customLockContainer).toBeVisible();

        await expect(component.locator('[data-testid="widget-lock"]')).toHaveCount(0);
    });
});
