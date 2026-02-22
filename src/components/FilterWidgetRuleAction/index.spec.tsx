import { test, expect } from '../../../playwright/ct-test';
import { FilterWidgetRuleActionTestWrapper } from './FilterWidgetRuleActionTestWrapper';

/** Sync native select value and dispatch input+change so React state updates (Preline may not fire it on option click). */
async function syncNativeSelect(page: import('@playwright/test').Page, selectId: 'group' | 'field', value: string) {
    await page.evaluate(
        ([id, v]) => {
            const sel = document.querySelector(`#${id}`) as HTMLSelectElement | null;
            if (sel) {
                (sel as HTMLSelectElement & { value: string }).value = v;
                sel.dispatchEvent(new Event('input', { bubbles: true }));
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        [selectId, value],
    );
}

/** Open group select and choose option by label (e.g. 'Meta'). Scope to dropdown that contains this option (avoids 2 listboxes). */
async function selectFieldSource(page: import('@playwright/test').Page, optionLabel: string) {
    await page.getByTestId('select-group').click();
    const dropdown = page
        .locator('.hs-select-dropdown')
        .filter({ has: page.locator('.hs-select-option-row').filter({ hasText: optionLabel }) });
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.locator('.hs-select-option-row').filter({ hasText: optionLabel }).click();
    await syncNativeSelect(page, 'group', optionLabel.toLowerCase());
}

async function selectFieldSourceMeta(page: import('@playwright/test').Page) {
    await selectFieldSource(page, 'Meta');
}

/** Open field select and choose option by label (e.g. 'Status', 'Enabled', 'Kind'). */
async function selectFieldOption(page: import('@playwright/test').Page, optionLabel: string) {
    await page.getByTestId('select-field').click();
    const dropdown = page
        .locator('.hs-select-dropdown')
        .filter({ has: page.locator('.hs-select-option-row').filter({ hasText: optionLabel }) });
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.locator('.hs-select-option-row').filter({ hasText: optionLabel }).click();
    await syncNativeSelect(page, 'field', optionLabel.toLowerCase());
}

/** Focus then fill the filter value input (TextInput removes readonly on focus). */
async function fillFilterValue(page: import('@playwright/test').Page, text: string) {
    const input = page.getByPlaceholder('Enter filter value');
    await input.focus();
    await input.fill(text);
}

test.describe('FilterWidgetRuleAction', () => {
    test('renders Widget with title and Field Source / Field / Value controls', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper title="Rule actions" />);
        await expect(page.getByText('Rule actions')).toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('select-group')).toBeVisible();
        await expect(page.getByTestId('select-field')).toBeVisible();
        await expect(page.getByPlaceholder('Enter filter value')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('Add button is disabled when nothing selected', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    });

    test('selecting Field Source enables Field dropdown and shows options', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await expect(page.getByTestId('select-field')).toBeEnabled();
        await selectFieldOption(page, 'Status');
        await expect(page.getByPlaceholder('Enter filter value')).toBeVisible();
    });

    test('selecting Field Source and Field enables value input and Add', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'active');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();
    });

    test('Add creates a badge and calls onActionsUpdate', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'active');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('active')).toBeVisible();
        expect(lastActions).toHaveLength(1);
        expect((lastActions as any[])[0]).toMatchObject({ fieldSource: 'meta', fieldIdentifier: 'status', data: 'active' });
    });

    test('Boolean field shows True/False select', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Enabled');
        await expect(page.getByTestId('select-value')).toBeVisible();
        await page.getByTestId('select-value').click();
        const valueListbox = page.getByRole('listbox').filter({ has: page.getByText('True', { exact: true }) });
        await valueListbox.waitFor({ state: 'visible', timeout: 5000 });
        await expect(valueListbox.locator('.hs-select-option-row').filter({ hasText: 'True' })).toBeVisible();
        await expect(valueListbox.locator('.hs-select-option-row').filter({ hasText: 'False' })).toBeVisible();
    });

    test('List field shows object value selector', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Kind');
        await expect(page.getByTestId('select-value')).toBeVisible();
    });

    test('clicking badge selects filter and shows Update button', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'active');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await expect(page.getByRole('button', { name: 'Update', exact: true })).not.toBeVisible();
        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
    });

    test('editing selected badge and Update calls onActionsUpdate', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'draft');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await page.getByText("'Status'").click();
        await fillFilterValue(page, 'published');
        await page.getByRole('button', { name: 'Update', exact: true }).click();

        expect(lastActions).toHaveLength(1);
        const action = (lastActions as any[])[0];
        expect(action.data).toBe('published');
        expect(action.fieldIdentifier === 'status' || action.fieldIdentifier?.value === 'status').toBe(true);
    });

    test('remove badge via × removes action and calls onActionsUpdate', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'x');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await expect(page.getByText("'Status'")).toBeVisible();
        await page.getByText('×').click();
        await expect(page.getByText("'Status'")).not.toBeVisible();
        expect(lastActions).toHaveLength(0);
    });

    test('remove badge via keyboard Enter triggers remove', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'y');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await page.getByText('×').focus();
        await page.keyboard.press('Enter');
        await expect(page.getByText("'Status'")).not.toBeVisible();
        expect(lastActions).toHaveLength(0);
    });

    test('disableBadgeRemove hides remove control in badge', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper disableBadgeRemove onActionsUpdate={() => {}} />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'z');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('×')).not.toBeVisible();
    });

    test('busyBadges hides badge content', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper busyBadges onActionsUpdate={() => {}} />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'busy');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        const badge = page.getByTestId('badge').first();
        await expect(badge).toBeVisible();
        await expect(badge.getByText("'Status'")).not.toBeVisible();
    });

    test('ExecutionsList syncs actions into badges', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: 'meta' as const, fieldIdentifier: 'status', data: 'synced' }]}
            />,
        );
        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('synced')).toBeVisible();
    });

    test('clearing Field Source clears Field and Value', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'clear');
        await page.getByTestId('select-group-clear').click();
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    });

    test('unselectFilters click clears selection', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper onActionsUpdate={() => {}} />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'a');
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await page.locator('#unselectFilters').focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });
});
