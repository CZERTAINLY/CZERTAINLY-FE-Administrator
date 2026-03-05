import { test, expect } from '../../../../../playwright/ct-test';
import { withProviders } from 'utils/test-helpers';

import SupportedInterfacesV2 from './SupportedInterfacesV2';

test.describe('SupportedInterfacesV2', () => {
    test('renders interfaces with versions and features', async ({ mount, page }) => {
        const interfaces = [
            {
                code: 'authority',
                version: 'v2',
                features: ['ejbca'],
            },
            {
                code: 'discovery',
                version: 'v1',
                features: ['async'],
            },
            {
                code: 'discovery',
                version: 'v2',
                features: ['stateless'],
            },
            {
                code: 'health',
                version: 'v2',
                features: [],
            },
        ];

        await mount(withProviders(<SupportedInterfacesV2 interfaces={interfaces} isBusy={false} />));

        await expect(page.getByRole('columnheader', { name: 'Interfaces' })).toBeVisible();
        await expect(page.getByText('Supported Interfaces')).toBeVisible();
        await expect(page.getByText('Authority')).toBeVisible();
        await expect(page.getByText('Discovery').first()).toBeVisible();
        await expect(page.getByText('Health')).toBeVisible();

        await expect(page.getByText('v2').first()).toBeVisible();
        await expect(page.getByText('v1').first()).toBeVisible();

        await expect(page.getByText('Ejbca', { exact: true })).toBeVisible();
        await expect(page.getByText('Async')).toBeVisible();
        await expect(page.getByText('Stateless')).toBeVisible();
        await expect(page.getByText('—')).toBeVisible();
    });
});
