import { test, expect } from 'playwright/ct-test';
import AlertsWithStore from 'components/Alerts/AlertsWithStore';
import { createAlertMessage } from 'components/Alerts/AlertsWithStore';
import { alertsSlice } from 'ducks/alert-slice';

test.describe('Alerts', () => {
    test('should render alerts container when no messages', async ({ mount, page }) => {
        await mount(<AlertsWithStore />);

        await expect(page.getByTestId('alerts-container')).toBeAttached();
        await expect(page.getByRole('alert')).toHaveCount(0);
    });

    test('should render success alert', async ({ mount, page }) => {
        const messages = [createAlertMessage({ id: 1, message: 'Saved successfully', color: 'success' })];
        await mount(<AlertsWithStore preloadedState={{ [alertsSlice.name]: { messages, msgId: 2 } }} />);

        const alert = page.getByTestId('alert-1');
        await expect(alert).toBeVisible();
        await expect(alert).toHaveAttribute('role', 'alert');
        await expect(alert).toContainText('Saved successfully');
    });

    test('should render danger alert', async ({ mount, page }) => {
        const messages = [createAlertMessage({ id: 2, message: 'Something failed', color: 'danger' })];
        await mount(<AlertsWithStore preloadedState={{ [alertsSlice.name]: { messages, msgId: 3 } }} />);

        await expect(page.getByTestId('alert-2')).toBeVisible();
        await expect(page.getByTestId('alert-2')).toContainText('Something failed');
    });

    test('should strip onerror attribute from img XSS payload', async ({ mount, page }) => {
        const xssMessage = '<img src=x onerror="window.__xss=true" alt="">Safe text';
        const messages = [createAlertMessage({ id: 4, message: xssMessage, color: 'danger' })];
        await mount(<AlertsWithStore preloadedState={{ [alertsSlice.name]: { messages, msgId: 5 } }} />);

        const alert = page.getByTestId('alert-4');
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('Safe text');
        await expect(alert.locator('img')).not.toHaveAttribute('onerror');
    });

    test('should remove script tags from XSS payload', async ({ mount, page }) => {
        const xssMessage = '<script>window.__xss=true</script>Visible text';
        const messages = [createAlertMessage({ id: 5, message: xssMessage, color: 'danger' })];
        await mount(<AlertsWithStore preloadedState={{ [alertsSlice.name]: { messages, msgId: 6 } }} />);

        const alert = page.getByTestId('alert-5');
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('Visible text');
        await expect(alert.locator('script')).toHaveCount(0);
    });

    test('should remove alert when dismiss button clicked', async ({ mount, page }) => {
        const messages = [createAlertMessage({ id: 3, message: 'Dismiss me', color: 'info' })];
        await mount(<AlertsWithStore preloadedState={{ [alertsSlice.name]: { messages, msgId: 4 } }} />);

        await expect(page.getByTestId('alert-3')).toBeVisible();
        await page.getByTestId('alert-3').getByRole('button').click();
        await expect(page.getByTestId('alert-3')).not.toBeAttached();
    });
});
