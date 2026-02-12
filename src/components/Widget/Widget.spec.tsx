import { test, expect } from '../../../playwright/ct-test';
import { createMockStore, withProviders } from 'utils/test-helpers';
import { testInitialState } from 'ducks/test-reducers';
import Widget from './index';
import { LockWidgetNameEnum, LockTypeEnum } from 'types/user-interface';

test.describe('Widget', () => {
    test('should render title and children', async ({ mount, page }) => {
        const store = createMockStore();
        await mount(
            withProviders(
                <Widget title="My Widget" dataTestId="my-widget">
                    <p>Child content</p>
                </Widget>,
                { store },
            ),
        );
        // await page.pause();
        await expect(page.getByTestId('my-widget')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'My Widget' })).toBeVisible();
        await expect(page.getByText('Child content')).toBeVisible();
    });

    test('should render title as link when titleLink provided', async ({ mount, page }) => {
        const store = createMockStore();
        await mount(withProviders(<Widget title="Linked Title" titleLink="/some-path" dataTestId="linked-widget" />, { store }));
        const link = page.getByRole('link', { name: 'Linked Title' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/some-path');
    });

    test('should show refresh button when refreshAction provided', async ({ mount, page }) => {
        const store = createMockStore();
        await mount(withProviders(<Widget title="Refreshable" dataTestId="refresh-widget" refreshAction={() => {}} />, { store }));
        await expect(page.getByTestId('refresh-icon')).toBeVisible();
    });

    test('should show WidgetLock when widgetLocks match widgetLockName', async ({ mount, page }) => {
        const lock = {
            widgetName: LockWidgetNameEnum.ListOfCertificates,
            lockTitle: 'Locked',
            lockText: 'Widget is locked',
            lockType: LockTypeEnum.GENERIC,
        };
        const preloadedState = {
            userInterface: {
                ...testInitialState.userInterface,
                widgetLocks: [lock],
            },
        };
        const store = createMockStore(preloadedState);
        await mount(
            withProviders(
                <Widget title="Locked Widget" dataTestId="locked-widget" widgetLockName={LockWidgetNameEnum.ListOfCertificates} />,
                { store },
            ),
        );
        await expect(page.getByTestId('locked-widget')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Locked Widget' })).toBeVisible();
    });
});
