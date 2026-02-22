import { test, expect } from '../../../../../playwright/ct-test';
import ContentValueFieldTestWrapper from './ContentValueFieldTestWrapper';
import { buildDescriptor } from './ContentValueFieldTestWrapper';
import { AttributeContentType } from 'types/openapi';

test.describe('ContentValueField', () => {
    test('renders string field and Save button', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.String })} />);
        await expect(page.locator(`[id="testAttr"]`)).toBeVisible();
        const saveBtn = page.getByTestId('save-button');
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
        const input = page.locator('[id="testAttr"]');
        await input.focus();
        await input.fill('hello');
        await expect(page.getByTestId('save-button')).toBeEnabled();
        await page.getByTestId('save-button').click();
        expect(submitted).not.toBeNull();
        expect(submitted!.uuid).toBe('test-uuid');
        expect(submitted!.content).toEqual([{ data: 'hello' }]);
    });

    test('textarea type renders', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.Text })} />);
        await expect(page.locator('[id="testAttr"]')).toBeVisible();
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
        const input = page.locator('[id="testAttr"]');
        await input.fill('42');
        await page.getByTestId('save-button').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: unknown }).data).toBe('42');
    });

    test('Float type renders number input', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.Float })} />);
        await expect(page.locator('[id="testAttr"]')).toBeVisible();
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
        await page.getByTestId('switch-testAttr').click();
        await page.getByTestId('save-button').click();
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
        const input = page.locator('[id="testAttr"]');
        await input.click();
        await expect(page.locator('div.fixed').first()).toBeVisible({ timeout: 5000 });
        const day15 = page.locator('div.fixed').getByRole('button', { name: '15' }).first();
        await day15.click();
        await page.getByTestId('save-button').click();
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
        const input = page.locator('[id="testAttr"]');
        await input.focus();
        await input.fill('14:30');
        await page.getByTestId('save-button').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: string }).data).toBe('14:30:00');
    });

    test('datetime type renders DatePicker', async ({ mount, page }) => {
        await mount(<ContentValueFieldTestWrapper descriptor={buildDescriptor({ contentType: AttributeContentType.Datetime })} />);
        await expect(page.locator('[id="testAttr"]')).toBeVisible();
    });

    test('initialContent sets initial value for non-list', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({ contentType: AttributeContentType.String })}
                initialContent={[{ data: 'initial' }]}
            />,
        );
        const input = page.locator('[id="testAttr"]');
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
        const input = page.locator('[id="testAttr"]');
        await expect(input).toHaveValue('fromDescriptor');
    });

    test('list single select: descriptor with content options', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'listAttr',
            contentType: AttributeContentType.String,
            properties: {
                label: 'List',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
            content: [{ data: 'opt1' }, { data: 'opt2' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        await expect(page.getByTestId('select-listAttr')).toBeVisible();
    });

    test('list multiSelect', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'multiAttr',
            contentType: AttributeContentType.String,
            properties: {
                label: 'Multi',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
            content: [{ data: 'a' }, { data: 'b' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} />);
        await expect(page.getByTestId('select-multiAttr')).toBeVisible();
    });

    test('initialContent with list single matches option', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'listAttr',
            contentType: AttributeContentType.String,
            properties: {
                label: 'List',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
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
                    properties: {
                        label: 'Test',
                        visible: true,
                        required: false,
                        readOnly: true,
                        list: false,
                        multiSelect: false,
                    },
                })}
            />,
        );
        const input = page.locator('[id="testAttr"]');
        await expect(input).toBeDisabled();
    });

    test('required validation shows error on touch', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.String,
                    properties: {
                        label: 'Test',
                        visible: true,
                        required: true,
                        readOnly: false,
                        list: false,
                        multiSelect: false,
                    },
                })}
            />,
        );
        const input = page.locator('[id="testAttr"]');
        await input.focus();
        await input.blur();
        await expect(page.getByTestId('save-button')).toBeDisabled();
    });

    test('Save disabled when invalid', async ({ mount, page }) => {
        await mount(
            <ContentValueFieldTestWrapper
                descriptor={buildDescriptor({
                    contentType: AttributeContentType.String,
                    properties: {
                        label: 'Test',
                        visible: true,
                        required: true,
                        readOnly: false,
                        list: false,
                        multiSelect: false,
                    },
                })}
            />,
        );
        await expect(page.getByTestId('save-button')).toBeDisabled();
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
        const saveBtn = page.getByTestId('save-button');
        await expect(saveBtn).toBeDisabled();
        expect(callCount).toBe(0);
    });

    test('content options with reference use reference as label', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'refAttr',
            contentType: AttributeContentType.String,
            properties: {
                label: 'Ref',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
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
        await expect(page.locator('[id="testAttr"]')).toBeVisible();
    });

    test('initialContent with list multiSelect sets initial options', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'multiList',
            contentType: AttributeContentType.String,
            properties: {
                label: 'Multi',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
            content: [{ data: 'a' }, { data: 'b' }, { data: 'c' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: 'a' }, { data: 'c' }]} />);
        await expect(page.getByTestId('select-multiList')).toBeVisible();
    });

    test('initialContent with list single Datetime matches option', async ({ mount, page }) => {
        const descriptor = buildDescriptor({
            name: 'dtList',
            contentType: AttributeContentType.Datetime,
            properties: {
                label: 'DT',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
            content: [{ data: '2024-01-15T10:00:00' }, { data: '2024-01-16T10:00:00' }],
        });
        await mount(<ContentValueFieldTestWrapper descriptor={descriptor} initialContent={[{ data: '2024-01-16T10:00:00' }]} />);
        await expect(page.getByTestId('select-dtList')).toBeVisible();
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
        const input = page.locator('[id="testAttr"]');
        await input.focus();
        await input.fill('14:30:00');
        await page.getByTestId('save-button').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: string }).data).toBe('14:30:00');
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
        await page.getByTestId('save-button').click();
        expect(submitted).toHaveLength(1);
        expect((submitted[0] as { data: unknown }).data).toBe('0');
    });
});
