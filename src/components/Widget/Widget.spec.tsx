import { test, expect } from '../../../playwright/ct-test';
import WidgetWithStore, { createWidgetLock } from 'components/Widget/WidgetWithStore';
import { slice as userInterfaceSlice } from 'ducks/user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';

test.describe('Widget', () => {
    test('should render title and children', async ({ mount, page }) => {
        await mount(
            <WidgetWithStore title="My Widget" dataTestId="my-widget">
                <p>Child content</p>
            </WidgetWithStore>,
        );
        await expect(page.getByTestId('my-widget')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'My Widget' })).toBeVisible();
        await expect(page.getByText('Child content')).toBeVisible();
    });

    test('should render title as link when titleLink provided', async ({ mount, page }) => {
        await mount(<WidgetWithStore title="Linked Title" titleLink="/some-path" dataTestId="linked-widget" />);
        const link = page.getByRole('link', { name: 'Linked Title' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/some-path');
    });

    test('should show refresh button when refreshAction provided', async ({ mount, page }) => {
        await mount(<WidgetWithStore title="Refreshable" dataTestId="refresh-widget" refreshAction={() => {}} />);
        await expect(page.getByTestId('refresh-icon')).toBeVisible();
    });

    test('should show WidgetLock when widgetLocks match widgetLockName', async ({ mount, page }) => {
        const lock = createWidgetLock({ widgetName: LockWidgetNameEnum.ListOfCertificates });
        const preloadedState = { [userInterfaceSlice.name]: { widgetLocks: [lock] } };
        await mount(
            <WidgetWithStore
                preloadedState={preloadedState}
                title="Locked Widget"
                dataTestId="locked-widget"
                widgetLockName={LockWidgetNameEnum.ListOfCertificates}
            />,
        );
        await expect(page.getByText('Locked')).toBeVisible();
        await expect(page.getByText('Widget is locked')).toBeVisible();
    });
});
