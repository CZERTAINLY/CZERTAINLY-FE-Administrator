import { test, expect } from 'playwright/ct-test';
import { FilterWidgetRuleActionTestWrapper } from './FilterWidgetRuleActionTestWrapper';
import {
    complexAttrFieldDef,
    countFieldDef,
    createdAtDatetimeFieldDef,
    customAttrFieldDef,
    defaultMockAvailableFilters,
    expiresAtFieldDef,
    groupsFieldDef,
    issuedOnDateFieldDef,
    issuedOnStringFieldDef,
    makeSearchFieldList,
    modeFieldDef,
    priorityEnumsHighOnly,
    priorityEnumsOverride,
    priorityListFieldDef,
    priorityStringFieldDef,
    tagsFieldDef,
    tagsFieldTwoValuesDef,
    updatedAtFieldDef,
} from './FilterWidgetRuleActionTestData';
import { FilterFieldSource } from 'types/openapi';

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

/** Open group select and choose option by label (e.g. 'Meta'). */
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

/** Open field select and choose option by label. */
async function selectFieldOption(page: import('@playwright/test').Page, optionLabel: string) {
    await page.getByTestId('select-field').click();
    const dropdown = page
        .locator('.hs-select-dropdown')
        .filter({ has: page.locator('.hs-select-option-row').filter({ hasText: optionLabel }) });
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.locator('.hs-select-option-row').filter({ hasText: optionLabel }).click();
    await syncNativeSelect(page, 'field', optionLabel.toLowerCase());
}

/** Focus then fill the filter value input. */
async function fillFilterValue(page: import('@playwright/test').Page, text: string) {
    const input = page.getByPlaceholder('Enter filter value');
    await input.focus();
    await input.fill(text);
}

/** Sync native #value select and dispatch events. */
async function syncNativeValueSelect(page: import('@playwright/test').Page, value: string) {
    await page.evaluate((v) => {
        const sel = document.querySelector('#value') as HTMLSelectElement | null;
        if (!sel) return;
        sel.value = v;
        sel.dispatchEvent(new Event('input', { bubbles: true }));
        sel.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
}

/** Open value select dropdown, pick an option by label, and sync the native select. */
async function selectValueOption(page: import('@playwright/test').Page, optionLabel: string, nativeValue?: string) {
    await page.getByTestId('select-value').click();
    const valueListbox = page.getByRole('listbox').filter({ has: page.getByText(optionLabel, { exact: true }) });
    await valueListbox.waitFor({ state: 'visible', timeout: 5000 });
    await valueListbox.locator('.hs-select-option-row').filter({ hasText: optionLabel }).click();
    if (nativeValue !== undefined) {
        await syncNativeValueSelect(page, nativeValue);
    }
}

/** Click a badge by its label text, then assert Update mode and expected select values. */
async function clickBadgeAndVerifyEditMode(
    page: import('@playwright/test').Page,
    badgeLabel: string,
    expectedGroup: string,
    expectedField: string,
) {
    await page.getByText(`'${badgeLabel}'`).click();
    await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
    await expect(page.locator('#group')).toHaveValue(expectedGroup);
    await expect(page.locator('#field')).toHaveValue(expectedField);
}

/** Get selected option values from the native #value select element. */
async function getSelectedNativeValues(page: import('@playwright/test').Page): Promise<string[]> {
    return page.locator('#value').evaluate((el: HTMLSelectElement) => Array.from(el.selectedOptions).map((opt) => opt.value));
}

/** Add a string action via UI: select Meta source, pick field, fill value, click Add. */
async function addStringAction(page: import('@playwright/test').Page, fieldLabel: string, value: string) {
    await selectFieldSourceMeta(page);
    await selectFieldOption(page, fieldLabel);
    await fillFilterValue(page, value);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
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
        await addStringAction(page, 'Status', 'active');

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
        await mount(<FilterWidgetRuleActionTestWrapper onActionsUpdate={() => {}} />);
        await addStringAction(page, 'Status', 'active');

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
        await addStringAction(page, 'Status', 'draft');

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
        await addStringAction(page, 'Status', 'x');

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
        await addStringAction(page, 'Status', 'y');

        await page.getByText('×').focus();
        await page.keyboard.press('Enter');
        await expect(page.getByText("'Status'")).not.toBeVisible();
        expect(lastActions).toHaveLength(0);
    });

    test('remove badge via keyboard Space triggers remove', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );
        await addStringAction(page, 'Status', 'sp');

        await page.getByText('×').focus();
        await page.keyboard.press('Space');
        await expect(page.getByText("'Status'")).not.toBeVisible();
        expect(lastActions).toHaveLength(0);
    });

    test('disableBadgeRemove hides remove control in badge', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper disableBadgeRemove onActionsUpdate={() => {}} />);
        await addStringAction(page, 'Status', 'z');

        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('×')).not.toBeVisible();
    });

    test('busyBadges hides badge content', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper busyBadges onActionsUpdate={() => {}} />);
        await addStringAction(page, 'Status', 'busy');

        const badge = page.getByTestId('badge').first();
        await expect(badge).toBeVisible();
        await expect(badge.getByText("'Status'")).not.toBeVisible();
    });

    test('ExecutionsList syncs actions into badges', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'status', data: 'synced' }]}
            />,
        );
        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('synced')).toBeVisible();
    });

    test('clicking existing execution item badge hydrates Field and Value inputs', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'status', data: 'synced' }]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Status', 'meta', 'status');
        await expect(page.getByPlaceholder('Enter filter value')).toHaveValue('synced');
    });

    test('clicking existing select execution item hydrates selected option', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: 'k2' }]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Kind', 'meta', 'kind');
        await expect(page.locator('#value')).toHaveValue('k2');
    });

    test('edit mode keeps current selected option in value dropdown', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: 'k2' }]}
            />,
        );
        await page.getByText("'Kind'").click();
        await expect(page.locator('#value')).toHaveValue('k2');

        await page.getByTestId('select-value').click();
        const valueListbox = page.getByRole('listbox').filter({ has: page.getByText('Kind Two', { exact: true }) });
        await valueListbox.waitFor({ state: 'visible', timeout: 5000 });
        await expect(valueListbox.locator('.hs-select-option-row').filter({ hasText: 'Kind Two' })).toBeVisible();
    });

    test('clicking existing select execution item hydrates from object data', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[
                    { fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: { uuid: 'k1', name: 'Kind One' } as any },
                ]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Kind', 'meta', 'kind');
        await expect(page.locator('#value')).toHaveValue('k1');
    });

    test('multi value field hydrates on first click even when execution data has a single string', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Property, [groupsFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Property, fieldIdentifier: 'groups', data: 'g1' as any }]}
            />,
        );

        await page.getByText("'Groups'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('property');
        await expect(page.locator('#field')).toHaveValue('groups');

        const selectedValues = await getSelectedNativeValues(page);
        expect(selectedValues).toContain('g1');
    });

    test('custom attribute option with reference/data hydrates selected value', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Custom, [customAttrFieldDef])}
                ExecutionsList={[
                    { fieldSource: FilterFieldSource.Custom, fieldIdentifier: 'customAttr', data: { name: 'Option One' } as any },
                ]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Custom Attr', 'custom', 'customAttr');
        await expect(page.locator('#value')).toHaveValue('r1');
    });

    test('boolean execution item hydrates value when backend sends string', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'enabled', data: 'FALSE' as any }]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Enabled', 'meta', 'enabled');
        await expect(page.locator('#value')).toHaveValue('false');
    });

    test('boolean selector allows selecting false and persists boolean false on Add', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Enabled');
        await selectValueOption(page, 'False', 'false');

        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        expect(lastActions).toHaveLength(1);
        expect((lastActions as any[])[0]).toMatchObject({ fieldSource: 'meta', fieldIdentifier: 'enabled', data: false });
    });

    test('date list execution item hydrates multi values and update maps them to UTC strings', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [expiresAtFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'expiresAt', data: ['2026-03-01T10:00:00Z'] }]}
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await page.getByText("'Expires At'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();

        const selectedValues = await getSelectedNativeValues(page);
        expect(selectedValues).toContain('2026-03-01T10:00:00Z');

        await page.getByRole('button', { name: 'Update', exact: true }).click();
        expect(lastActions).toHaveLength(1);
        expect(Array.isArray((lastActions as any[])[0].data)).toBe(true);
        expect((lastActions as any[])[0].data[0]).toContain('2026-03-01T10:00:00');
    });

    test('date scalar execution item hydrates formatted date input and keeps update enabled', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [issuedOnDateFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'issuedOn', data: '2026-03-03T00:00:00Z' }]}
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await page.getByText("'Issued On'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#valueSelect')).toHaveValue(/2026/);

        await page.getByRole('button', { name: 'Update', exact: true }).click();
        expect(lastActions).toHaveLength(1);
        expect(Array.isArray((lastActions as any[])[0].data)).toBe(true);
    });

    test('string options list keeps selected primitive value in edit mode', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [modeFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'mode', data: 'beta' }]}
            />,
        );
        await page.getByText("'Mode'").click();
        await expect(page.locator('#value')).toHaveValue('beta');
    });

    test('object execution data with nested value.data.uuid hydrates single select value', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Custom, [complexAttrFieldDef])}
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Custom,
                        fieldIdentifier: 'complexAttr',
                        data: { value: { data: { uuid: 'cx2', name: 'Complex Two' } } } as any,
                    },
                ]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Complex Attr', 'custom', 'complexAttr');
        await expect(page.locator('#value')).toHaveValue('cx2');
    });

    test('clearing Field Source clears Field and Value', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'clear');
        await page.getByTestId('select-group-clear').click();
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    });

    test('single non-array datetime in list-type field hydrates label/value pair', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [createdAtDatetimeFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'createdAt', data: '2026-04-01T08:00:00Z' }]}
            />,
        );
        await page.getByText("'Created At'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
    });

    test('selecting a value from single-select list and adding it calls onActionsUpdate', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Kind');
        await selectValueOption(page, 'Kind One', 'k1');

        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        expect(lastActions).toHaveLength(1);
        expect((lastActions as any[])[0]).toMatchObject({ fieldSource: 'meta', fieldIdentifier: 'kind' });
    });

    test('selecting values in multi-select list and adding calls onActionsUpdate', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Property, [groupsFieldDef])}
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await selectFieldSource(page, 'Property');
        await selectFieldOption(page, 'Groups');
        await selectValueOption(page, 'Group One', 'g1');

        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        expect(lastActions).toHaveLength(1);
        expect((lastActions as any[])[0].fieldIdentifier).toBe('groups');
    });

    test('toggling selected badge deselects it and resets to Add', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'status', data: 'val' }]}
            />,
        );
        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();

        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('ExecutionsList with non-multiValue array data unwraps to single value', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [
                    { ...defaultMockAvailableFilters[0].searchFieldData![2], multiValue: false },
                ])}
                ExecutionsList={[
                    { fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: [{ uuid: 'k1', name: 'Kind One' }] as any },
                ]}
            />,
        );
        await page.getByText("'Kind'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#value')).toHaveValue('k1');
    });

    test('badge displays platformEnum label when field has platformEnum', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [priorityListFieldDef])}
                platformEnumsOverride={priorityEnumsOverride}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'priority', data: 'high' }]}
            />,
        );
        await expect(page.getByText('High Priority')).toBeVisible();
    });

    test('number field execution item hydrates value and renders number input', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [countFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'count', data: 42 }]}
            />,
        );
        await page.getByText("'Count'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#valueSelect')).toHaveValue('42');
    });

    test('updating an existing list field execution item via Update button', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: 'k1' }]}
            />,
        );
        await page.getByText("'Kind'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#value')).toHaveValue('k1');

        await selectValueOption(page, 'Kind Two', 'k2');
        await page.getByRole('button', { name: 'Update', exact: true }).click();
        expect(lastActions).toHaveLength(1);
    });

    test('multi-value list execution item with array of objects hydrates as array', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Property, [tagsFieldDef])}
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Property,
                        fieldIdentifier: 'tags',
                        data: [
                            { uuid: 't1', name: 'Tag One' },
                            { uuid: 't2', name: 'Tag Two' },
                        ] as any,
                    },
                ]}
            />,
        );
        await page.getByText("'Tags'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();

        const selectedValues = await getSelectedNativeValues(page);
        expect(selectedValues.length).toBeGreaterThanOrEqual(1);
    });

    test('badge with platformEnum falls back to string when enum entry missing', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [priorityStringFieldDef])}
                platformEnumsOverride={priorityEnumsHighOnly}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'priority', data: 'unknown_value' }]}
            />,
        );
        await expect(page.getByText('unknown_value')).toBeVisible();
    });

    test('badge with datetime scalar data formats the date', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [updatedAtFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'updatedAt', data: '2026-05-15T14:30:00Z' }]}
            />,
        );
        await expect(page.getByText("'Updated At'")).toBeVisible();
        await expect(page.getByText(/2026/)).toBeVisible();
    });

    test('badge with date scalar data formats as date', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={makeSearchFieldList(FilterFieldSource.Meta, [issuedOnStringFieldDef])}
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'issuedOn', data: '2026-06-01' }]}
            />,
        );
        await expect(page.getByText("'Issued On'")).toBeVisible();
        await expect(page.getByText(/2026/)).toBeVisible();
    });

    test('changing field clears value and disables Add', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Status');
        await fillFilterValue(page, 'test');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();

        await selectFieldOption(page, 'Enabled');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    });

    test('unselectFilters click clears selection', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper onActionsUpdate={() => {}} />);
        await addStringAction(page, 'Status', 'a');
        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await page.locator('#unselectFilters').focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('unselectFilters via keyboard Space clears selection', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper onActionsUpdate={() => {}} />);
        await addStringAction(page, 'Status', 'b');
        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await page.locator('#unselectFilters').focus();
        await page.keyboard.press('Space');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('boolean execution item hydrates true when backend sends string true', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'enabled', data: 'true' as any }]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Enabled', 'meta', 'enabled');
        await expect(page.locator('#value')).toHaveValue('true');
    });

    test('boolean execution item hydrates true when backend sends boolean true', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'enabled', data: true as any }]}
            />,
        );
        await clickBadgeAndVerifyEditMode(page, 'Enabled', 'meta', 'enabled');
        await expect(page.locator('#value')).toHaveValue('true');
    });

    test('remove badge triggers uuid extraction for multi-value object array data', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={[
                    ...defaultMockAvailableFilters,
                    ...makeSearchFieldList(FilterFieldSource.Property, [tagsFieldTwoValuesDef]),
                ]}
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
                ExecutionsList={[
                    { fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'status', data: 'val' },
                    { fieldSource: FilterFieldSource.Property, fieldIdentifier: 'tags', data: [{ uuid: 't1', name: 'Tag One' }] as any },
                ]}
            />,
        );

        const statusBadge = page.getByTestId('badge').filter({ hasText: 'Status' });
        await statusBadge.getByRole('button').click();
        expect(lastActions).toHaveLength(1);
        expect((lastActions as any[])[0].fieldIdentifier).toBe('tags');
        expect((lastActions as any[])[0].data[0]).toBe('t1');
    });

    test('badge with object data shows name property', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: { name: 'Kind One' } as any }]}
            />,
        );
        await expect(page.getByText('Kind One')).toBeVisible();
    });
});
