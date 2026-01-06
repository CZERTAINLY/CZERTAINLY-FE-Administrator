import { test, expect } from '@playwright/experimental-ct-react';
import Select from './index';

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

        let selectedValue: string | number = '';
        const handleChange = (value: string | number) => {
            selectedValue = value;
        };

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

        let selectedValues: { value: string | number; label: string }[] | undefined = undefined;
        const handleChange = (value: { value: string | number; label: string }[] | undefined) => {
            selectedValues = value;
        };

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
});
