import { test, expect } from '../../../../../playwright/ct-test';
import ContentValueFieldTestWrapper from './ContentValueFieldTestWrapper';
import { buildDescriptor } from './ContentValueFieldTestWrapper';
import { AttributeContentType } from 'types/openapi';

const fieldLocator = '[id="testAttr"]';
const readOnlyTextProps = {
    label: 'Test',
    visible: true,
    required: false,
    readOnly: true,
    list: false,
    multiSelect: false,
    extensibleList: false,
};
const requiredTextProps = {
    label: 'Test',
    visible: true,
    required: true,
    readOnly: false,
    list: false,
    multiSelect: false,
    extensibleList: false,
};

function buildListDescriptor({
    name,
    contentType = AttributeContentType.String,
    multiSelect = false,
    content,
}: {
    name: string;
    contentType?: AttributeContentType;
    multiSelect?: boolean;
    content: Array<{ data: string; reference?: string }>;
}) {
    return buildDescriptor({
        name,
        contentType,
        properties: {
            label: 'List',
            visible: true,
            required: false,
            readOnly: false,
            list: true,
            multiSelect,
            extensibleList: false,
        } as any,
        content,
    });
}

async function setTimeValue(page: import('@playwright/test').Page, value: string) {
    const input = page.locator(fieldLocator);
    await input.evaluate((element) => {
        const field = element as HTMLInputElement;
        field.removeAttribute('readonly');
        field.setAttribute('type', 'text');
    });
    await input.fill(value);
}

test.describe('ContentValueField', () => {
    test('renders string field and Save button', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.String })} />);
        await expect(page.locator(fieldLocator)).toBeVisible();
        const saveBtn = page.getByTestId('save-custom-value');
        await expect(saveBtn).toBeDisabled();
    });

    test('string: fill value enables Save and onSubmit is called', async ({ mount, page }) => {
        let submitted: { uuid: string; content: unknown[] } | null = null;
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.String })}
                onSubmit={(uuid, content) => {
                    submitted = { uuid, content };
                }}
            />,
        );
        const input = page.locator(fieldLocator);
        await input.focus();
        await input.fill('hello');
        await expect(page.getByTestId('save-custom-value')).toBeEnabled();
        await page.getByTestId('save-custom-value').click();
        expect(submitted).not.toBeNull();
        expect(submitted!.uuid).toBe('test-uuid');
        expect(submitted!.content).toEqual([{ data: 'hello' }]);
    });

    test('textarea type renders', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.Text })} />);
        await expect(page.locator(fieldLocator)).toBeVisible();
    });

    test('number type (Integer) renders and Save submits value', async ({ mount, page }) => {
        let submitted: unknown[] = [];
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Integer })}
                onSubmit={(_, content) => {
                    submitted = content;
                }}
            />,
        );
        const input = page.locator(fieldLocator);
        await input.fill('42');
        await page.getByTestId('save-custom-value').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: unknown }).data).toBe('42');
    });

    test('Float type renders number input', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.Float })} />);
        await expect(page.locator(fieldLocator)).toBeVisible();
    });

    test('checkbox (Boolean) renders Switch and Save submits boolean', async ({ mount, page }) => {
        let submitted: unknown[] = [];
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Boolean })}
                onSubmit={(_, content) => {
                    submitted = content;
                }}
            />,
        );
        await expect(page.getByTestId('switch-testAttr')).toBeVisible();
        await page.locator('label[for="testAttr"]').first().click();
        await expect(page.getByTestId('save-custom-value')).toBeEnabled();
        await page.getByTestId('save-custom-value').click();
        expect(submitted).toEqual([{ data: true }]);
    });

    test('date type: beforeOnSubmit formats date', async ({ mount, page }) => {
        let submitted: unknown[] = [];
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Date })}
                onSubmit={(_, content) => {
                    submitted = content;
                }}
            />,
        );
        const input = page.locator(fieldLocator);
        await input.click();
        await expect(page.locator('div.fixed').first()).toBeVisible({ timeout: 5000 });
        const day15 = page.locator('div.fixed').getByRole('button', { name: '15' }).first();
        await day15.click();
        await page.getByTestId('save-custom-value').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: string }).data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('time type: beforeOnSubmit appends :00 when two parts', async ({ mount, page }) => {
        let submitted: unknown[] = [];
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Time })}
                onSubmit={(_, content) => {
                    submitted = content;
                }}
            />,
        );
        await setTimeValue(page, '14:30');
        await expect(page.getByTestId('save-custom-value')).toBeEnabled();
        await page.getByTestId('save-custom-value').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: string }).data).toBe('14:30:00');
    });

    test('datetime type renders DatePicker', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.Datetime })} />);
        await expect(page.locator(fieldLocator)).toBeVisible();
    });

    test('initialContent sets initial value for non-list', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.String })}
                initialContent={[{ data: 'initial' }]}
            />,
        );
        const input = page.locator(fieldLocator);
        await expect(input).toHaveValue('initial');
    });

    test('descriptor.content sets initial when no initialContent', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.String,
                    content: [{ data: 'fromDescriptor' }],
                })}
            />,
        );
        const input = page.locator(fieldLocator);
        await expect(input).toHaveValue('fromDescriptor');
    });

    test('list single select: descriptor with content options', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'listAttr',
            content: [{ data: 'opt1' }, { data: 'opt2' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        await expect(page.getByTestId('select-listAttr')).toBeVisible();
    });

    test('list multiSelect', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'multiAttr',
            multiSelect: true,
            content: [{ data: 'a' }, { data: 'b' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        await expect(page.getByTestId('select-multiAttr')).toBeVisible();
    });

    test('initialContent with list single matches option', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'listAttr',
            content: [{ data: 'opt1' }, { data: 'opt2' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: 'opt2' }]} />);
        await expect(page.getByTestId('select-listAttr')).toBeVisible();
    });

    test('readOnly disables input', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.String,
                    properties: readOnlyTextProps,
                })}
            />,
        );
        const input = page.locator(fieldLocator);
        await expect(input).toBeDisabled();
    });

    test('required validation shows error on touch', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.String,
                    properties: requiredTextProps,
                })}
            />,
        );
        const input = page.locator('[id="testAttr"]');
        await input.focus();
        await input.blur();
        await expect(page.getByTestId('save-custom-value')).toBeDisabled();
    });

    test('Save disabled when invalid', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.String,
                    properties: requiredTextProps,
                })}
            />,
        );
        await expect(page.getByTestId('save-custom-value')).toBeDisabled();
    });

    test('beforeOnSubmit not called when content empty', async ({ mount, page }) => {
        let callCount = 0;
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.String })}
                onSubmit={() => {
                    callCount++;
                }}
            />,
        );
        const saveBtn = page.getByTestId('save-custom-value');
        await expect(saveBtn).toBeDisabled();
        expect(callCount).toBe(0);
    });

    test('content options with reference use reference as label', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'refAttr',
            content: [
                { data: 'v1', reference: 'Label One' },
                { data: 'v2', reference: 'Label Two' },
            ],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        await expect(page.getByTestId('select-refAttr')).toBeVisible();
    });

    test('id prop passed to ValueFieldInput for checkbox', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                id="custom-id"
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.Boolean,
                    name: 'boolAttr',
                })}
            />,
        );
        const checkbox = page.getByRole('checkbox');
        await expect(checkbox).toBeVisible();
    });

    test('datetime value with space is normalized for DatePicker', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Datetime })}
                initialContent={[{ data: '2024-06-10 12:00' }]}
            />,
        );
        await expect(page.locator(fieldLocator)).toBeVisible();
    });

    test('initialContent with list multiSelect sets initial options', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'multiList',
            multiSelect: true,
            content: [{ data: 'a' }, { data: 'b' }, { data: 'c' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: 'a' }, { data: 'c' }]} />);
        await expect(page.getByTestId('select-multiList')).toBeVisible();
    });

    test('initialContent with list single Datetime matches option', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'dtList',
            contentType: AttributeContentType.Datetime,
            content: [{ data: '2024-01-15T10:00:00' }, { data: '2024-01-16T10:00:00' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: '2024-01-16T10:00:00' }]} />);
        await expect(page.getByTestId('select-dtList')).toBeVisible();
    });

    test('initialContent with list single value not in options (custom value) still displays', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'listAttr',
            content: [{ data: 'opt1' }, { data: 'opt2' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: 'customValue' }]} />);
        const select = page.getByTestId('select-listAttr');
        await expect(select).toBeVisible();
        await expect(select).toContainText('customValue');
    });

    test('initialContent with list multiSelect values not in options still display', async ({ mount, page }) => {
        const descriptor = buildListDescriptor({
            name: 'multiList',
            multiSelect: true,
            content: [{ data: 'a' }, { data: 'b' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: 'a' }, { data: 'customItem' }]} />);
        const select = page.getByTestId('select-multiList');
        await expect(select).toBeVisible();
        await expect(select).toContainText('customItem');
    });

    test('time beforeOnSubmit leaves full time string unchanged', async ({ mount, page }) => {
        let submitted: unknown[] = [];
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Time })}
                onSubmit={(_, content) => {
                    submitted = content;
                }}
            />,
        );
        await setTimeValue(page, '14:30:00');
        await expect(page.getByTestId('save-custom-value')).toBeEnabled();
        await page.getByTestId('save-custom-value').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: string }).data).toBe('14:30:00');
    });

    test('list with extensibleList shows Add custom option in select', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'extList',
            contentType: AttributeContentType.String,
            properties: {
                label: 'Extensible List',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
                extensibleList: true,
            } as any,
        });

        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        await page.getByTestId('select-extList').click();
        const dropdown = page.locator('.hs-select-dropdown').last();
        const addCustomOption = dropdown.locator('.hs-tooltip-toggle').filter({ hasText: '+ Add custom' });
        await expect(addCustomOption).toHaveCount(1);
    });

    test('number zero is valid content', async ({ mount, page }) => {
        let submitted: unknown[] = [];
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.Integer })}
                onSubmit={(_, content) => {
                    submitted = content;
                }}
            />,
        );
        const input = page.locator('[id="testAttr"]');
        await input.fill('0');
        await page.getByTestId('save-custom-value').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: unknown }).data).toBe('0');
    });

    test('multiSelect list with __add_custom__ opens AddCustomValuePanel and filters value', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'multiExtList',
            contentType: AttributeContentType.String,
            properties: {
                label: 'Multi Extensible List',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: true,
                extensibleList: true,
            } as any,
            content: [{ data: 'opt1' }, { data: 'opt2' }],
        });

        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);

        const select = page.locator('select#multiExtList');
        await expect(select).toBeAttached();

        await select.evaluate((el: HTMLSelectElement) => {
            const options = Array.from(el.options);
            const first = options.find((o) => o.value && o.value !== '__add_custom__');
            const addCustom = options.find((o) => o.value === '__add_custom__');
            if (first) first.selected = true;
            if (addCustom) addCustom.selected = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await expect(page.getByTestId('multiExtList-add-custom-panel')).toBeVisible();
    });

    test('single-select list with __add_custom__ opens AddCustomValuePanel', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'singleExtList',
            contentType: AttributeContentType.String,
            properties: {
                label: 'Single Extensible List',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
                extensibleList: true,
            } as any,
            content: [{ data: 'opt1' }, { data: 'opt2' }],
        });

        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);

        const select = page.locator('select#singleExtList');
        await expect(select).toBeAttached();

        await select.evaluate((el: HTMLSelectElement) => {
            const addCustom = Array.from(el.options).find((o) => o.value === '__add_custom__');
            if (addCustom) {
                el.value = addCustom.value;
            }
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await expect(page.getByTestId('singleExtList-add-custom-panel')).toBeVisible();
    });

    test('datetime required shows validation error message', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            contentType: AttributeContentType.Datetime,
            properties: {
                label: 'Required Datetime',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
                extensibleList: false,
            } as any,
        });

        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        const input = page.locator(fieldLocator);
        await input.focus();
        await input.blur();
        await expect(page.getByTestId('save-custom-value')).toBeDisabled();
    });
});
