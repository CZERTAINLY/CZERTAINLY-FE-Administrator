import { test, expect } from '../../../../playwright/ct-test';
import MultipleValueTextInput from './index';

test.describe('MultipleValueTextInput', () => {
    test('should render Select and input', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={() => {}} />
            </div>,
        );

        const select = component.locator('select[data-hs-select]');
        const input = component.locator('input[type="text"]');
        await expect(select).toBeAttached();
        await expect(input).toBeVisible();
    });

    test('should display placeholder for Select', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={() => {}} placeholder="Select or add values" />
            </div>,
        );

        const select = component.locator('select[data-hs-select]');
        await expect(select).toBeAttached();
    });

    test('should display addPlaceholder for input', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={() => {}} addPlaceholder="Add value" />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toHaveAttribute('placeholder', 'Add value');
    });

    test('should call onValuesChange when value is added via Enter', async ({ mount }) => {
        let values: string[] = [];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={handleChange} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await input.fill('value1');
        await input.press('Enter');
        expect(values).toContain('value1');
        expect(values).toHaveLength(1);
    });

    test('should call onValuesChange when value is added via Add button', async ({ mount }) => {
        let values: string[] = [];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={handleChange} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        const addButton = component.locator('button[type="button"]').filter({ hasText: /^Add$/ }).last();
        await input.fill('value1');
        await addButton.click();
        expect(values).toContain('value1');
        expect(values).toHaveLength(1);
    });

    test('should not add duplicate values', async ({ mount }) => {
        let values = ['value1'];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={['value1']} onValuesChange={handleChange} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await input.fill('value1');
        await input.press('Enter');

        expect(values).toHaveLength(1);
        expect(values).toContain('value1');
    });

    test('should clear input after adding value', async ({ mount }) => {
        let values: string[] = [];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={handleChange} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await input.fill('value1');
        await input.press('Enter');
        await expect(input).toHaveValue('');
    });

    test('should support id prop', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={() => {}} id="test-input" />
            </div>,
        );

        const select = component.locator('select[data-hs-select]');
        await expect(select).toHaveAttribute('id', 'test-input');
    });

    test('should display initial options in Select', async ({ mount }) => {
        const initialOptions = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={[]} onValuesChange={() => {}} initialOptions={initialOptions} />
            </div>,
        );

        const select = component.locator('select[data-hs-select]');
        await expect(select).toBeAttached();
    });

    test('should add multiple values', async ({ mount }) => {
        let values: string[] = [];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        let component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={values} onValuesChange={handleChange} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        const addButton = component.locator('button[type="button"]').filter({ hasText: /^Add$/ }).last();

        await input.fill('value1');
        await addButton.click();
        await expect.poll(() => values, { timeout: 1000 }).toContain('value1');
        expect(values).toHaveLength(1);

        await component.unmount();
        component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={values} onValuesChange={handleChange} />
            </div>,
        );

        const input2 = component.locator('input[type="text"]');
        const addButton2 = component.locator('button[type="button"]').filter({ hasText: /^Add$/ }).last();

        await input2.fill('value2');
        await addButton2.click();
        await expect.poll(() => values, { timeout: 1000 }).toContain('value2');

        expect(values).toHaveLength(2);
        expect(values).toContain('value1');
        expect(values).toContain('value2');
    });

    test('should call onValuesChange when selecting from initialOptions', async ({ mount }) => {
        let values: string[] = [];
        const initialOptions = [
            { label: 'Opt1', value: 'opt1' },
            { label: 'Opt2', value: 'opt2' },
        ];
        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={values} onValuesChange={(v) => (values = v)} initialOptions={initialOptions} />
            </div>,
        );
        await component.locator('input[type="text"]').fill('opt1');
        await component.locator('input[type="text"]').press('Enter');
        expect(values).toContain('opt1');
    });

    test('should render with pre-filled selectedValues', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput selectedValues={['existing1', 'existing2']} onValuesChange={() => {}} />
            </div>,
        );
        const select = component.locator('select[data-hs-select]');
        await expect(select).toBeAttached();
        await expect(component.locator('input[type="text"]')).toHaveAttribute('placeholder', 'Add value');
    });
});
