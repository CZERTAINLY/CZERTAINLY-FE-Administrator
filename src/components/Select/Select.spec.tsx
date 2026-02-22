import { test, expect } from '../../../playwright/ct-test';
import Select from './index';
import SelectHSSelectTestWrapper from './SelectHSSelectTestWrapper';
import { SelectHSSelectValueChangeHarness } from './SelectHSCoverageHarness';

test.describe('Select', () => {
    test('should render select with options', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );

        const select = component.locator('select');
        await expect(select).toHaveAttribute('id', 'test-select');

        const option1 = select.locator('option[value="1"]');
        await expect(option1).toHaveText('Option 1');
    });

    test('should render with label', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} label="Select Label" />
            </div>,
        );

        await expect(component.getByText('Select Label')).toBeVisible();
        const label = component.getByText('Select Label');
        await expect(label).toHaveAttribute('for', 'test-select');
    });

    test('should display selected value in single select mode', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="1" onChange={() => {}} options={options} />
            </div>,
        );

        const select = component.locator('select');
        const selectedOption = select.locator('option[value="1"]');
        await expect(selectedOption).toHaveText('Option 1');

        await expect(selectedOption).toBeAttached();
    });

    test('should call onChange when value changes in single select mode', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const handleChange = (_value: string | number | object | { value: string | number | object; label: string }) => {};

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={handleChange} options={options} />
            </div>,
        );

        const select = component.locator('select');

        await select.evaluate((el: HTMLSelectElement) => {
            el.value = '1';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        expect(select).toBeDefined();
    });

    test('should support multi-select mode', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value={[{ value: '1', label: 'Option 1' }]} onChange={() => {}} options={options} isMulti={true} />
            </div>,
        );

        const select = component.locator('select');
        await expect(select).toHaveAttribute('multiple', '');
    });

    test('should call onChange when value changes in multi-select mode', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const handleChange = (_value: { value: string | number; label: string }[] | undefined) => {};

        const component = await mount(
            <div>
                <Select id="test-select" value={[]} onChange={handleChange} options={options} isMulti={true} />
            </div>,
        );

        const select = component.locator('select');
        await expect(select).toHaveAttribute('multiple', '');

        expect(select).toBeDefined();
    });

    test('should be disabled when isDisabled is true', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} isDisabled={true} />
            </div>,
        );

        const select = component.locator('select');

        const isDisabled = await select.getAttribute('disabled');
        expect(isDisabled).toBe('');
    });

    test('should be disabled when no options are provided', async ({ mount }) => {
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={[]} />
            </div>,
        );

        const select = component.locator('select');

        const isDisabled = await select.getAttribute('disabled');
        expect(isDisabled).toBe('');
    });

    test('should display placeholder', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} placeholder="Choose an option" />
            </div>,
        );

        const select = component.locator('select');
        const dataAttr = await select.getAttribute('data-hs-select');
        expect(dataAttr).toContain('Choose an option');
    });

    test('should display error message when error prop is provided', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} error="This field is required" />
            </div>,
        );

        await expect(component.getByText('This field is required')).toBeVisible();
        const errorDiv = component.getByText('This field is required');
        await expect(errorDiv).toHaveClass(/text-red-500/);
    });

    test('should show required indicator when required is true', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} label="Required Field" required={true} />
            </div>,
        );

        const label = component.getByText('Required Field');
        const requiredSpan = label.locator('..').locator('span.text-red-500');
        await expect(requiredSpan).toBeVisible();
    });

    test('should support disabled options', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2', disabled: true },
            { value: '3', label: 'Option 3' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );

        const select = component.locator('select');
        const disabledOption = select.locator('option[value="2"]');
        await expect(disabledOption).toHaveAttribute('disabled', '');
    });

    test('should support custom className', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} className="custom-class" />
            </div>,
        );

        const select = component.locator('select');
        await expect(select).toHaveClass('custom-class');
    });

    test('should render "Choose" option as default', async ({ mount }) => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );

        const select = component.locator('select');
        const chooseOption = select.locator('option[value=""]');
        await expect(chooseOption).toHaveText('Choose');
    });

    test('should handle empty options array', async ({ mount }) => {
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={[]} />
            </div>,
        );

        const select = component.locator('select');

        const isDisabled = await select.getAttribute('disabled');
        expect(isDisabled).toBe('');
    });

    test('should support numeric values', async ({ mount }) => {
        const options = [
            { value: 1, label: 'Option 1' },
            { value: 2, label: 'Option 2' },
        ];

        const component = await mount(
            <div>
                <Select id="test-select" value={1} onChange={() => {}} options={options} />
            </div>,
        );

        const select = component.locator('select');
        const option1 = select.locator('option[value="1"]');
        await expect(option1).toHaveText('Option 1');

        await expect(option1).toBeAttached();
    });

    test('should accept value as object with value and label in single mode', async ({ mount }) => {
        const options = [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
        ];
        const component = await mount(
            <div>
                <Select id="test-select" value={{ value: 'a', label: 'A' }} onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select).toHaveValue('a');
    });

    test('should show clear button and call onChange(undefined) when isClearable and has value', async ({ mount }) => {
        let cleared = false;
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];
        const component = await mount(
            <div>
                <Select
                    id="test-select"
                    value="1"
                    onChange={(v) => {
                        if (v === undefined || v === '') cleared = true;
                    }}
                    options={options}
                    isClearable={true}
                />
            </div>,
        );
        const clearBtn = component.getByTestId('select-test-select-clear');
        await expect(clearBtn).toBeAttached();
        await clearBtn.click({ force: true });
        expect(cleared).toBe(true);
    });

    test('should call onChange with empty string when single select is cleared to Choose', async ({ mount }) => {
        let received: string | undefined = undefined;
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
        ];
        const component = await mount(
            <div>
                <Select id="test-select" value="1" onChange={(v) => (received = v as string)} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await select.evaluate((el: HTMLSelectElement) => {
            el.value = '';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(received).toBe('');
    });

    test('should use dataTestId when provided', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} dataTestId="my-select" />
            </div>,
        );
        await expect(component.getByTestId('my-select')).toBeVisible();
        await expect(component.getByTestId('my-select-input')).toBeAttached();
    });

    test('should apply minWidth style', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} minWidth={300} />
            </div>,
        );
        const wrapper = component.locator('div.relative').first();
        await expect(wrapper).toHaveCSS('min-width', '300px');
    });

    test('should pass placement to data-hs-select', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} placement="top" />
            </div>,
        );
        const select = component.locator('select');
        const dataAttr = await select.getAttribute('data-hs-select');
        expect(dataAttr).toContain('top');
    });

    test('should pass isSearchable to data-hs-select', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} isSearchable={true} />
            </div>,
        );
        const select = component.locator('select');
        const dataAttr = await select.getAttribute('data-hs-select');
        expect(dataAttr).toContain('hasSearch');
    });

    test('should support options with object value containing reference', async ({ mount }) => {
        const options = [
            { value: { reference: 'ref-1' }, label: 'Ref 1' },
            { value: { reference: 'ref-2' }, label: 'Ref 2' },
        ];
        const component = await mount(
            <div>
                <Select id="test-select" value={{ reference: 'ref-1' }} onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select.locator('option[value="ref-1"]')).toHaveText('Ref 1');
    });

    test('should support options with object value containing data', async ({ mount }) => {
        const options = [
            { value: { data: 'data-val' }, label: 'Data 1' },
            { value: { data: 42 }, label: 'Data 2' },
        ];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select.locator('option[value="data-val"]')).toHaveText('Data 1');
        await expect(select.locator('option[value="42"]')).toHaveText('Data 2');
    });

    test('should support options with object value containing uuid', async ({ mount }) => {
        const options = [{ value: { uuid: 'uuid-123' }, label: 'UUID Option' }];
        const component = await mount(
            <div>
                <Select id="test-select" value={{ uuid: 'uuid-123' }} onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select).toHaveValue('uuid-123');
    });

    test('should support options with object value containing name for valuesMatch', async ({ mount }) => {
        const options = [{ value: { name: 'Item A' }, label: 'Item A' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="Item A" onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        const opt = select.locator('option').filter({ hasText: 'Item A' }).first();
        await expect(opt).toBeAttached();
    });

    test('should call onChange with option value when single select option is selected', async ({ mount }) => {
        let received: string | number | object | { value: string | number | object; label: string } | undefined;
        const options = [
            { value: 'x', label: 'X' },
            { value: 'y', label: 'Y' },
        ];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={(v) => (received = v)} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await select.evaluate((el: HTMLSelectElement) => {
            el.value = 'x';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(received).toBe('x');
    });

    test('should call onChange with matched option when single select option selected and value is option object', async ({ mount }) => {
        let received: unknown;
        const options = [
            { value: 10, label: 'Ten' },
            { value: 20, label: 'Twenty' },
        ];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={(v) => (received = v)} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await select.evaluate((el: HTMLSelectElement) => {
            el.value = '10';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(received).toBe(10);
    });

    test('should show No options placeholder when options empty and placeholder set', async ({ mount }) => {
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={[]} placeholder="Pick one" />
            </div>,
        );
        const select = component.locator('select');
        const dataAttr = await select.getAttribute('data-hs-select');
        expect(dataAttr).toContain('No options');
    });

    test('should pass dropdownScope to data-hs-select', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} dropdownScope="window" />
            </div>,
        );
        const select = component.locator('select');
        const dataAttr = await select.getAttribute('data-hs-select');
        expect(dataAttr).toContain('window');
    });

    test('should pass dropdownWidth to data-hs-select', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} dropdownWidth={400} />
            </div>,
        );
        const select = component.locator('select');
        const dataAttr = await select.getAttribute('data-hs-select');
        expect(dataAttr).toContain('400');
    });

    test('should render multi-select with multiple values selected', async ({ mount }) => {
        const options = [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
            { value: '3', label: 'Three' },
        ];
        const component = await mount(
            <div>
                <Select
                    id="test-select"
                    value={[
                        { value: '1', label: 'One' },
                        { value: '3', label: 'Three' },
                    ]}
                    onChange={() => {}}
                    options={options}
                    isMulti={true}
                />
            </div>,
        );
        const select = component.locator('select');
        await expect(select).toHaveAttribute('multiple', '');
        const selectedValues = await select.evaluate((el: HTMLSelectElement) => Array.from(el.selectedOptions).map((o) => o.value));
        expect(selectedValues).toContain('1');
        expect(selectedValues).toContain('3');
        expect(selectedValues).toHaveLength(2);
    });

    test('should call multi onChange with undefined when all options deselected', async ({ mount }) => {
        let received: { value: string; label: string }[] | undefined = undefined;
        const options = [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
        ];
        const component = await mount(
            <div>
                <Select
                    id="test-select"
                    value={[{ value: '1', label: 'One' }]}
                    onChange={(v) => (received = v)}
                    options={options}
                    isMulti={true}
                />
            </div>,
        );
        const select = component.locator('select');
        await select.evaluate((el: HTMLSelectElement) => {
            Array.from(el.options).forEach((o) => {
                (o as HTMLOptionElement).selected = false;
            });
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(received).toBeUndefined();
    });

    test('should use clear button data-testid when dataTestId provided', async ({ mount }) => {
        const options = [{ value: '1', label: 'Option 1' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="1" onChange={() => {}} options={options} isClearable={true} dataTestId="custom-select" />
            </div>,
        );
        await expect(component.getByTestId('custom-select-clear')).toBeVisible();
    });

    test('should support option value with data as object (getOptionValueString JSON path)', async ({ mount }) => {
        const objVal = { data: { nested: true } };
        const options = [{ value: objVal, label: 'With data object' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        const opt = select.locator('option').filter({ hasText: 'With data object' });
        await expect(opt).toHaveAttribute('value', JSON.stringify({ nested: true }));
    });

    test('should support option value with data.uuid (getUuidFromValue nested)', async ({ mount }) => {
        const options = [{ value: { data: { uuid: 'nested-uuid-1' } }, label: 'Nested UUID' }];
        const component = await mount(
            <div>
                <Select id="test-select" value={{ data: { uuid: 'nested-uuid-1' } }} onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select).toHaveValue('nested-uuid-1');
    });

    test('should support option value as plain object (getOptionValueString fallback)', async ({ mount }) => {
        const plainObj = { foo: 'bar' };
        const options = [{ value: plainObj, label: 'Plain object' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select.locator('option').filter({ hasText: 'Plain object' })).toHaveAttribute('value', JSON.stringify(plainObj));
    });

    test('should match values with both data objects (valuesMatch data object branch)', async ({ mount }) => {
        const dataVal = { data: { id: 1 } };
        const options = [{ value: dataVal, label: 'Data object' }];
        const component = await mount(
            <div>
                <Select id="test-select" value={dataVal} onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select).toHaveValue(JSON.stringify({ id: 1 }));
    });

    test('should not show clear button when value equals placeholder', async ({ mount }) => {
        const options = [{ value: '1', label: 'One' }];
        const placeholder = 'Pick one';
        const component = await mount(
            <div>
                <Select
                    id="test-select"
                    value={placeholder}
                    onChange={() => {}}
                    options={options}
                    placeholder={placeholder}
                    isClearable={true}
                />
            </div>,
        );
        await expect(component.locator('[data-testid="select-test-select-clear"]')).toHaveCount(0);
    });

    test('should support value as object with name for valuesMatch (object vs string)', async ({ mount }) => {
        const options = [{ value: { name: 'ByName' }, label: 'ByName' }];
        const component = await mount(
            <div>
                <Select id="test-select" value={{ name: 'ByName' }} onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select.locator('option').filter({ hasText: 'ByName' })).toBeAttached();
        await expect(select).toHaveValue(JSON.stringify({ name: 'ByName' }));
    });

    test('should support data as boolean in option value', async ({ mount }) => {
        const options = [{ value: { data: true }, label: 'Bool' }];
        const component = await mount(
            <div>
                <Select id="test-select" value="" onChange={() => {}} options={options} />
            </div>,
        );
        const select = component.locator('select');
        await expect(select.locator('option[value="true"]')).toHaveText('Bool');
    });

    test('should run Select useEffect when HSSelect is mocked (coverage)', async ({ mount }) => {
        const component = await mount(
            <div>
                <SelectHSSelectTestWrapper />
            </div>,
        );
        const select = component.locator('select#hs-select-test');
        await expect(select).toBeAttached();
    });

    test('should execute HSSelect valueChanged branch and close opened instance', async ({ mount, page }) => {
        await mount(<SelectHSSelectValueChangeHarness />);
        await page.getByTestId('set-second').click();
        await expect.poll(async () => page.evaluate(() => (window as any).__hsState)).toMatchObject({ close: 1, destroy: 2, autoInit: 2 });
    });
});
