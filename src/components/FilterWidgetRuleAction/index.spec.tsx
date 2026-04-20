import { test, expect } from '../../../playwright/ct-test';
import { FilterWidgetRuleActionTestWrapper, type FilterWidgetRuleActionTestWrapperProps } from './FilterWidgetRuleActionTestWrapper';
import { AttributeContentType, FilterFieldSource } from 'types/openapi';

/** Sync native select value and dispatch input+change so React state updates (Preline may not fire it on option click). */
async function syncNativeSelect(page: import('@playwright/test').Page, selectId: 'group' | 'field' | 'value', value: string) {
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

async function mountWithActionCapture(
    mount: (component: any) => Promise<unknown>,
    props: Omit<FilterWidgetRuleActionTestWrapperProps, 'onActionsUpdate'> = {},
) {
    const captured = { lastActions: [] as unknown[] };
    await mount(
        <FilterWidgetRuleActionTestWrapper
            {...props}
            onActionsUpdate={(actions) => {
                captured.lastActions = actions;
            }}
        />,
    );

    return captured;
}

async function addMetaStatusAction(page: import('@playwright/test').Page, value: string) {
    await selectFieldSourceMeta(page);
    await selectFieldOption(page, 'Status');
    await fillFilterValue(page, value);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
}

async function openBadgeForEdit(page: import('@playwright/test').Page, badgeLabel: string) {
    await page.getByText(`'${badgeLabel}'`).click();
    await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
}

async function mountAndOpenSingleExecution(
    mount: (component: any) => Promise<unknown>,
    page: import('@playwright/test').Page,
    execution: any,
    badgeLabel: string,
    props: Omit<FilterWidgetRuleActionTestWrapperProps, 'ExecutionsList'> = {},
) {
    await mount(<FilterWidgetRuleActionTestWrapper {...props} ExecutionsList={[execution]} />);
    await page.getByText(`'${badgeLabel}'`).click();
}

async function expectHydratedGroupAndField(page: import('@playwright/test').Page, group: string, field: string) {
    await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
    await expect(page.locator('#group')).toHaveValue(group);
    await expect(page.locator('#field')).toHaveValue(field);
}

async function expectStatusRemovedAndCapturedCleared(page: import('@playwright/test').Page, captured: { lastActions: unknown[] }) {
    await expect(page.getByText("'Status'")).not.toBeVisible();
    expect(captured.lastActions).toHaveLength(0);
}

const executionStatusSynced = {
    fieldSource: FilterFieldSource.Meta,
    fieldIdentifier: 'status',
    data: 'synced',
};

const executionKindK2 = {
    fieldSource: FilterFieldSource.Meta,
    fieldIdentifier: 'kind',
    data: 'k2',
};

const executionKindObjectK1 = {
    fieldSource: FilterFieldSource.Meta,
    fieldIdentifier: 'kind',
    data: { uuid: 'k1', name: 'Kind One' } as any,
};

async function expectKindHydratedValue(page: import('@playwright/test').Page, expectedValue: string) {
    await expectHydratedGroupAndField(page, 'meta', 'kind');
    await expect(page.locator('#value')).toHaveValue(expectedValue);
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
        const captured = await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'active');

        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('active')).toBeVisible();
        expect(captured.lastActions).toHaveLength(1);
        expect((captured.lastActions as any[])[0]).toMatchObject({ fieldSource: 'meta', fieldIdentifier: 'status', data: 'active' });
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
        await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'active');

        await expect(page.getByRole('button', { name: 'Update', exact: true })).not.toBeVisible();
        await openBadgeForEdit(page, 'Status');
    });

    test('clicking selected badge toggles back to Add mode', async ({ mount, page }) => {
        await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'active');

        await openBadgeForEdit(page, 'Status');
        await page.getByText("'Status'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('editing selected badge and Update calls onActionsUpdate', async ({ mount, page }) => {
        const captured = await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'draft');

        await openBadgeForEdit(page, 'Status');
        await fillFilterValue(page, 'published');
        await page.getByRole('button', { name: 'Update', exact: true }).click();

        expect(captured.lastActions).toHaveLength(1);
        const action = (captured.lastActions as any[])[0];
        expect(action.data).toBe('published');
        expect(action.fieldIdentifier === 'status' || action.fieldIdentifier?.value === 'status').toBe(true);
    });

    test('remove badge via × removes action and calls onActionsUpdate', async ({ mount, page }) => {
        const captured = await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'x');

        await expect(page.getByText("'Status'")).toBeVisible();
        await page.getByText('×').click();
        await expectStatusRemovedAndCapturedCleared(page, captured);
    });

    test('remove badge via keyboard Enter triggers remove', async ({ mount, page }) => {
        const captured = await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'y');

        await page.getByText('×').focus();
        await page.keyboard.press('Enter');
        await expectStatusRemovedAndCapturedCleared(page, captured);
    });

    test('remove badge via keyboard Space triggers remove', async ({ mount, page }) => {
        const captured = await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'space');

        await page.getByText('×').focus();
        await page.keyboard.press('Space');
        await expectStatusRemovedAndCapturedCleared(page, captured);
    });

    test('remove selected badge without callback exits edit mode', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);
        await addMetaStatusAction(page, 'orphan');

        await openBadgeForEdit(page, 'Status');
        await page.getByText('×').click();

        await expect(page.getByText("'Status'")).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('disableBadgeRemove hides remove control in badge', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper disableBadgeRemove onActionsUpdate={() => {}} />);
        await addMetaStatusAction(page, 'z');

        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('×')).not.toBeVisible();
    });

    test('busyBadges hides badge content', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper busyBadges onActionsUpdate={() => {}} />);
        await addMetaStatusAction(page, 'busy');

        const badge = page.getByTestId('badge').first();
        await expect(badge).toBeVisible();
        await expect(badge.getByText("'Status'")).not.toBeVisible();
    });

    test('ExecutionsList with array on non-multi field hydrates first value in edit mode', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Meta,
                        fieldIdentifier: 'kind',
                        data: ['k1', 'k2'] as any,
                    },
                ]}
            />,
        );

        await expect(page.getByText("'Kind'")).toBeVisible();

        await openBadgeForEdit(page, 'Kind');
        await expect(page.locator('#value')).toHaveValue('k1');
    });

    test('execution item with missing fieldSource is ignored during hydration', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(
            mount,
            page,
            { fieldSource: undefined as any, fieldIdentifier: 'status', data: 'raw' } as any,
            'status',
        );

        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('');
        await expect(page.locator('#field')).toHaveValue('');
    });

    test('execution item with missing fieldIdentifier is ignored during hydration', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: undefined as any, data: 'raw' } as any]}
            />,
        );
        await page.getByTestId('badge').first().click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('');
        await expect(page.locator('#field')).toHaveValue('');
    });

    test('execution item with undefined data keeps selection without hydrating value', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(
            mount,
            page,
            { fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'status', data: undefined as any },
            'Status',
        );

        await expectHydratedGroupAndField(page, 'meta', 'status');
        await expect(page.getByPlaceholder('Enter filter value')).toHaveValue('');
    });

    test('unknown field identifier keeps fallback badge label and avoids value hydration', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'unknownField', data: 'ghost' } as any]}
            />,
        );

        await expect(page.getByText("'unknownField'")).toBeVisible();
        await page.getByText("'unknownField'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('meta');
    });

    test('array execution data maps safely when field options are not an array', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Meta,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'listNoOptions',
                                    fieldLabel: 'List No Options',
                                    type: 'list' as const,
                                    conditions: [],
                                    multiValue: false,
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'listNoOptions', data: ['x', 'y'] as any }]}
            />,
        );

        await page.getByText("'List No Options'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('meta');
        await expect(page.locator('#field')).toHaveValue('listNoOptions');
    });

    test('ExecutionsList syncs actions into badges', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper ExecutionsList={[executionStatusSynced]} />);
        await expect(page.getByText("'Status'")).toBeVisible();
        await expect(page.getByText('synced')).toBeVisible();
    });

    test('clicking existing execution item badge hydrates Field and Value inputs', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(mount, page, executionStatusSynced, 'Status');

        await expectHydratedGroupAndField(page, 'meta', 'status');
        await expect(page.getByPlaceholder('Enter filter value')).toHaveValue('synced');
    });

    test('clicking existing select execution item hydrates selected option without delayed mismatch', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(mount, page, executionKindK2, 'Kind');
        await expectKindHydratedValue(page, 'k2');
    });

    test('object execution item with unknown field source keeps fallback badge without crashing', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Custom, fieldIdentifier: 'ghost', data: { value: 'x' } as any } as any]}
            />,
        );

        await expect(page.getByText("'ghost'")).toBeVisible();
    });

    test('object execution item with unknown field identifier keeps fallback badge without crashing', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'ghost', data: { value: 'x' } as any } as any]}
            />,
        );

        await expect(page.getByText("'ghost'")).toBeVisible();
    });

    test('list option mapping with no match keeps select empty without crashing', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(
            mount,
            page,
            { fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'kind', data: ['k999'] as any },
            'Kind',
            {
                availableFilters: [
                    {
                        filterFieldSource: FilterFieldSource.Meta,
                        searchFieldData: [
                            {
                                fieldIdentifier: 'kind',
                                fieldLabel: 'Kind',
                                type: 'list' as const,
                                conditions: [],
                                value: [{ uuid: 'k1', name: 'Kind One' }],
                                multiValue: false,
                            },
                        ],
                    },
                ] as any,
            },
        );

        await expectKindHydratedValue(page, '');
    });

    test('remove one badge maps remaining object array to uuid values in callback', async ({ mount, page }) => {
        const captured = await mountWithActionCapture(mount, {
            availableFilters: [
                {
                    filterFieldSource: FilterFieldSource.Meta,
                    searchFieldData: [
                        {
                            fieldIdentifier: 'kind',
                            fieldLabel: 'Kind',
                            type: 'list' as const,
                            conditions: [],
                            multiValue: true,
                            value: [
                                { uuid: 'k1', name: 'Kind One' },
                                { uuid: 'k2', name: 'Kind Two' },
                            ],
                        },
                        {
                            fieldIdentifier: 'status',
                            fieldLabel: 'Status',
                            type: 'string' as const,
                            conditions: [],
                        },
                    ],
                },
            ] as any,
            ExecutionsList: [
                {
                    fieldSource: FilterFieldSource.Meta,
                    fieldIdentifier: 'kind',
                    data: [{ uuid: 'k1', name: 'Kind One' }] as any,
                },
                {
                    fieldSource: FilterFieldSource.Meta,
                    fieldIdentifier: 'status',
                    data: 'tmp',
                },
            ] as any,
        });

        await expect(page.getByText("'Kind'")).toBeVisible();
        await expect(page.getByText("'Status'")).toBeVisible();

        await page.getByText('×').nth(1).click();

        expect(captured.lastActions).toHaveLength(1);
        expect((captured.lastActions as any[])[0]).toMatchObject({
            fieldSource: FilterFieldSource.Meta,
            fieldIdentifier: 'kind',
        });
        expect((captured.lastActions as any[])[0].data).toEqual(['k1']);
    });

    test('remove one badge maps remaining date object value to UTC string in callback', async ({ mount, page }) => {
        const captured = await mountWithActionCapture(mount, {
            availableFilters: [
                {
                    filterFieldSource: FilterFieldSource.Meta,
                    searchFieldData: [
                        {
                            fieldIdentifier: 'expiresAt',
                            fieldLabel: 'Expires At',
                            type: 'list' as const,
                            conditions: [],
                            multiValue: true,
                            attributeContentType: AttributeContentType.Datetime,
                            value: ['2026-03-04T10:00:00Z'],
                        },
                        {
                            fieldIdentifier: 'status',
                            fieldLabel: 'Status',
                            type: 'string' as const,
                            conditions: [],
                        },
                    ],
                },
            ] as any,
            ExecutionsList: [
                {
                    fieldSource: FilterFieldSource.Meta,
                    fieldIdentifier: 'expiresAt',
                    data: [{ value: '2026-03-04T10:00:00Z', label: 'Date Value' }] as any,
                },
                {
                    fieldSource: FilterFieldSource.Meta,
                    fieldIdentifier: 'status',
                    data: 'tmp',
                },
            ] as any,
        });

        await expect(page.getByText("'Expires At'")).toBeVisible();
        await expect(page.getByText("'Status'")).toBeVisible();

        await page.getByText('×').nth(1).click();

        expect(captured.lastActions).toHaveLength(1);
        expect((captured.lastActions as any[])[0]).toMatchObject({
            fieldSource: FilterFieldSource.Meta,
            fieldIdentifier: 'expiresAt',
        });
        expect(Array.isArray((captured.lastActions as any[])[0].data)).toBe(true);
        expect(String((captured.lastActions as any[])[0].data[0])).toContain('2026-03-04T10:00:00');
    });

    test('edit mode keeps current selected option in value dropdown', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(mount, page, executionKindK2, 'Kind');
        await expectKindHydratedValue(page, 'k2');

        await page.getByTestId('select-value').click();
        const valueListbox = page.getByRole('listbox').filter({ has: page.getByText('Kind Two', { exact: true }) });
        await valueListbox.waitFor({ state: 'visible', timeout: 5000 });
        await expect(valueListbox.locator('.hs-select-option-row').filter({ hasText: 'Kind Two' })).toBeVisible();
    });

    test('clicking existing select execution item hydrates selected option from object data', async ({ mount, page }) => {
        await mountAndOpenSingleExecution(mount, page, executionKindObjectK1, 'Kind');
        await expectKindHydratedValue(page, 'k1');
    });

    test('multi value field hydrates on first click even when execution data has a single string', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Property,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'groups',
                                    fieldLabel: 'Groups',
                                    type: 'list' as const,
                                    conditions: [],
                                    value: [
                                        { uuid: 'g1', name: 'Group One' },
                                        { uuid: 'g2', name: 'Group Two' },
                                    ],
                                    multiValue: true,
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Property,
                        fieldIdentifier: 'groups',
                        data: 'g1' as any,
                    },
                ]}
            />,
        );

        await page.getByText("'Groups'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('property');
        await expect(page.locator('#field')).toHaveValue('groups');

        const selectedValues = await page
            .locator('#value')
            .evaluate((el: HTMLSelectElement) => Array.from(el.selectedOptions).map((opt) => opt.value));
        expect(selectedValues).toContain('g1');
    });

    test('custom attribute option with reference/data hydrates selected value', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Custom,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'customAttr',
                                    fieldLabel: 'Custom Attr',
                                    type: 'list' as const,
                                    conditions: [],
                                    value: [
                                        { reference: 'r1', data: 'Option One' },
                                        { reference: 'r2', data: 'Option Two' },
                                    ],
                                    multiValue: false,
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Custom,
                        fieldIdentifier: 'customAttr',
                        data: { name: 'Option One' } as any,
                    },
                ]}
            />,
        );

        await page.getByText("'Custom Attr'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('custom');
        await expect(page.locator('#field')).toHaveValue('customAttr');
        await expect(page.locator('#value')).toHaveValue('r1');
    });

    test('boolean execution item hydrates value when backend sends string', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                ExecutionsList={[{ fieldSource: FilterFieldSource.Meta, fieldIdentifier: 'enabled', data: 'FALSE' as any }]}
            />,
        );

        await page.getByText("'Enabled'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('meta');
        await expect(page.locator('#field')).toHaveValue('enabled');
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
        await page.getByTestId('select-value').click();
        const valueListbox = page.getByRole('listbox').filter({ has: page.getByText('False', { exact: true }) });
        await valueListbox.waitFor({ state: 'visible', timeout: 5000 });
        await valueListbox.locator('.hs-select-option-row').filter({ hasText: 'False' }).click();
        await page.evaluate(() => {
            const sel = document.querySelector('#value') as HTMLSelectElement | null;
            if (!sel) return;
            sel.value = 'false';
            sel.dispatchEvent(new Event('input', { bubbles: true }));
            sel.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        expect(lastActions).toHaveLength(1);
        expect((lastActions as any[])[0]).toMatchObject({ fieldSource: 'meta', fieldIdentifier: 'enabled', data: false });
    });

    test('date list execution item hydrates multi values and update maps them to UTC strings', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Meta,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'expiresAt',
                                    fieldLabel: 'Expires At',
                                    type: 'list' as const,
                                    conditions: [],
                                    multiValue: true,
                                    attributeContentType: AttributeContentType.Datetime,
                                    value: ['2026-03-01T10:00:00Z', '2026-03-02T10:00:00Z'],
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Meta,
                        fieldIdentifier: 'expiresAt',
                        data: ['2026-03-01T10:00:00Z'],
                    },
                ]}
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await page.getByText("'Expires At'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();

        const selectedValues = await page
            .locator('#value')
            .evaluate((el: HTMLSelectElement) => Array.from(el.selectedOptions).map((opt) => opt.value));
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
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Meta,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'issuedOn',
                                    fieldLabel: 'Issued On',
                                    type: 'date' as const,
                                    conditions: [],
                                    attributeContentType: AttributeContentType.Date,
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Meta,
                        fieldIdentifier: 'issuedOn',
                        data: '2026-03-03T00:00:00Z',
                    },
                ]}
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

    test('date list non-multi hydrates object value and update sends normalized data', async ({ mount, page }) => {
        let lastActions: unknown[] = [];
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Meta,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'dateChoice',
                                    fieldLabel: 'Date Choice',
                                    type: 'list' as const,
                                    conditions: [],
                                    multiValue: false,
                                    attributeContentType: AttributeContentType.Datetime,
                                    value: [{ label: 'Choice 1', value: '2026-03-04T10:00:00Z' }],
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Meta,
                        fieldIdentifier: 'dateChoice',
                        data: '2026-03-04T10:00:00Z',
                    },
                ]}
                onActionsUpdate={(actions) => {
                    lastActions = actions;
                }}
            />,
        );

        await page.getByText("'Date Choice'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Update', exact: true }).click();

        expect(lastActions).toHaveLength(1);
        expect(Array.isArray((lastActions as any[])[0].data)).toBe(true);
    });

    test('string options list keeps selected primitive value in edit mode', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Meta,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'mode',
                                    fieldLabel: 'Mode',
                                    type: 'list' as const,
                                    conditions: [],
                                    value: ['alpha', 'beta'],
                                    multiValue: false,
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Meta,
                        fieldIdentifier: 'mode',
                        data: 'beta',
                    },
                ]}
            />,
        );

        await page.getByText("'Mode'").click();
        await expect(page.locator('#value')).toHaveValue('beta');
    });

    test('object execution data with nested value.data.uuid hydrates single select value', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Custom,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'complexAttr',
                                    fieldLabel: 'Complex Attr',
                                    type: 'list' as const,
                                    conditions: [],
                                    value: [{ data: { uuid: 'cx1', name: 'Complex One' } }, { data: { uuid: 'cx2', name: 'Complex Two' } }],
                                    multiValue: false,
                                },
                            ],
                        },
                    ] as any
                }
                ExecutionsList={[
                    {
                        fieldSource: FilterFieldSource.Custom,
                        fieldIdentifier: 'complexAttr',
                        data: { value: { data: { uuid: 'cx2', name: 'Complex Two' } } } as any,
                    },
                ]}
            />,
        );

        await page.getByText("'Complex Attr'").click();
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
        await expect(page.locator('#group')).toHaveValue('custom');
        await expect(page.locator('#field')).toHaveValue('complexAttr');
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

    test('unsupported form type falls back to text input', async ({ mount, page }) => {
        await mount(
            <FilterWidgetRuleActionTestWrapper
                availableFilters={
                    [
                        {
                            filterFieldSource: FilterFieldSource.Meta,
                            searchFieldData: [
                                {
                                    fieldIdentifier: 'dateTimeField',
                                    fieldLabel: 'Date Time Field',
                                    type: 'date' as const,
                                    conditions: [],
                                    attributeContentType: AttributeContentType.Datetime,
                                },
                            ],
                        },
                    ] as any
                }
            />,
        );

        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Date Time Field');
        await expect(page.locator('#valueSelect')).toHaveAttribute('type', 'text');
    });

    test('boolean value reset to empty disables Add button', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);

        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Enabled');
        await syncNativeSelect(page, 'value', 'true');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();

        await syncNativeSelect(page, 'value', '');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    });

    test('object select empty value clears filter value', async ({ mount, page }) => {
        await mount(<FilterWidgetRuleActionTestWrapper />);

        await selectFieldSourceMeta(page);
        await selectFieldOption(page, 'Kind');
        await syncNativeSelect(page, 'value', 'k1');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled();

        await syncNativeSelect(page, 'value', '');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    });

    test('unselectFilters click clears selection', async ({ mount, page }) => {
        await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'a');
        await openBadgeForEdit(page, 'Status');
        await page.locator('#unselectFilters').focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    });

    test('unselectFilters ignores non activation keys', async ({ mount, page }) => {
        await mountWithActionCapture(mount);
        await addMetaStatusAction(page, 'keep-selected');
        await openBadgeForEdit(page, 'Status');

        await page.locator('#unselectFilters').focus();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('button', { name: 'Update', exact: true })).toBeVisible();
    });
});
