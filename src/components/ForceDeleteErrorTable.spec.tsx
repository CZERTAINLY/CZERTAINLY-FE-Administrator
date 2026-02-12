import { test, expect } from '../../playwright/ct-test';
import { withProviders } from 'utils/test-helpers';
import ForceDeleteErrorTable, { ForceDeleteErrorItem } from './ForceDeleteErrorTable';

test.describe('ForceDeleteErrorTable', () => {
    const items: ForceDeleteErrorItem[] = [
        { uuid: '1', name: 'Item 1', message: 'Dependency A' },
        { uuid: '2', name: 'Item 2', message: 'Dependency B' },
    ];

    test('renders message with plural entity name when multiple items selected', async ({ mount }) => {
        const component = await mount(
            withProviders(
                <ForceDeleteErrorTable items={items} entityNameSingular="a SCEP Profile" entityNamePlural="SCEP Profiles" itemsCount={2} />,
            ),
        );

        await expect(component.getByText('Failed to delete SCEP Profiles. Please find the details below:', { exact: true })).toBeVisible();
        await expect(component.getByText('Item 1')).toBeVisible();
        await expect(component.getByText('Item 2')).toBeVisible();
    });

    test('renders message with singular entity name when single item selected', async ({ mount }) => {
        const component = await mount(
            withProviders(
                <ForceDeleteErrorTable items={items} entityNameSingular="a SCEP Profile" entityNamePlural="SCEP Profiles" itemsCount={1} />,
            ),
        );

        await expect(component.getByText('Failed to delete a SCEP Profile. Please find the details below:', { exact: true })).toBeVisible();
    });

    test('renders empty table when no items provided', async ({ mount }) => {
        const component = await mount(
            withProviders(
                <ForceDeleteErrorTable
                    items={undefined}
                    entityNameSingular="a SCEP Profile"
                    entityNamePlural="SCEP Profiles"
                    itemsCount={0}
                />,
            ),
        );

        const table = component.locator('table');
        await expect(table).toBeVisible();
    });
});
