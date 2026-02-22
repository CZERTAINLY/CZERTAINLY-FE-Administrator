import { expect, test } from '../../../playwright/ct-test';
import CertificateAssociationsFormWidgetTestWrapper from './CertificateAssociationsFormWidgetTestWrapper';

test.describe('CertificateAssociationsFormWidget', () => {
    test('renders widget labels and custom attributes block', async ({ mount, page }) => {
        await mount(<CertificateAssociationsFormWidgetTestWrapper />);

        await expect(page.getByText('Default Certificate associations')).toBeVisible();
        await expect(page.getByText('Owner')).toBeVisible();
        await expect(page.getByText('Groups')).toBeVisible();
        await expect(page.getByText('Certificate Custom Attributes')).toBeVisible();
        await expect(page.getByTestId('custom-attributes-content')).toBeVisible();
    });

    test('maps users and groups from redux state into select options', async ({ mount, page }) => {
        await mount(
            <CertificateAssociationsFormWidgetTestWrapper
                users={[
                    {
                        uuid: 'user-1',
                        username: 'jsmith',
                        firstName: 'John',
                        lastName: 'Smith',
                    },
                ]}
                groups={[
                    {
                        uuid: 'group-1',
                        name: 'Admins',
                    },
                ]}
            />,
        );

        await expect(page.locator('select#owner option[value="user-1"]')).toHaveCount(1);
        await expect(page.locator('select#groups option[value="group-1"]')).toHaveCount(1);
    });

    test('does not add dynamic options when users and groups are empty', async ({ mount, page }) => {
        await mount(<CertificateAssociationsFormWidgetTestWrapper />);

        await expect(page.locator('select#owner option')).toHaveCount(1);
        await expect(page.locator('select#groups option')).toHaveCount(1);
        await expect(page.locator('select#owner option[value="user-1"]')).toHaveCount(0);
        await expect(page.locator('select#groups option[value="group-1"]')).toHaveCount(0);
    });

    test('updates owner and groups form values on select change', async ({ mount, page }) => {
        await mount(
            <CertificateAssociationsFormWidgetTestWrapper
                initialUserOptions={[
                    {
                        value: 'user-1',
                        label: 'John Smith (jsmith)',
                    },
                ]}
                initialGroupOptions={[
                    {
                        value: 'group-1',
                        label: 'Admins',
                    },
                    {
                        value: 'group-2',
                        label: 'Operators',
                    },
                ]}
            />,
        );

        await page.locator('select#owner').evaluate((element) => {
            const select = element as HTMLSelectElement;
            select.value = 'user-1';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await expect(page.getByTestId('owner-value')).toHaveText('user-1');

        await page.locator('select#groups').evaluate((element) => {
            const select = element as HTMLSelectElement;
            Array.from(select.options).forEach((opt) => {
                opt.selected = opt.value === 'group-1' || opt.value === 'group-2';
            });
            select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await expect(page.getByTestId('groups-value')).toContainText('"group-1"');
        await expect(page.getByTestId('groups-value')).toContainText('"group-2"');
    });
});
