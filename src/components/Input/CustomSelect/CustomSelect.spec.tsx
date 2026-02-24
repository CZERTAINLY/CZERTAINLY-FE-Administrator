import { test, expect } from '../../../../playwright/ct-test';
import CustomSelect from './index';

test.describe('CustomSelect', () => {
    test('should render with label', async ({ mount }) => {
        const component = await mount(
            <div>
                <CustomSelect label="Select Field" options={[]} onChange={() => {}} />
            </div>,
        );

        await expect(component.getByText('Select Field')).toBeVisible();
    });

    test('should display description when provided', async ({ mount }) => {
        const component = await mount(
            <div>
                <CustomSelect label="Select Field" description="This is a description" options={[]} onChange={() => {}} />
            </div>,
        );

        await expect(component.getByText('This is a description')).toBeVisible();
    });

    test('should display error message when error prop is provided', async ({ mount }) => {
        const component = await mount(
            <div>
                <CustomSelect label="Select Field" error="This field is required" options={[]} onChange={() => {}} />
            </div>,
        );

        await expect(component.getByText('This field is required')).toBeVisible();
    });

    test('should render with options', async ({ mount }) => {
        const options = [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
        ];
        const component = await mount(
            <div>
                <CustomSelect label="Select" options={options} onChange={() => {}} />
            </div>,
        );
        await expect(component.locator('label').first()).toBeVisible();
        await expect(component.locator('label').first()).toHaveText('Select');
        const control = component.locator('[class*="control"]').first();
        await expect(control).toBeAttached();
        await control.click();
        await expect(component.getByRole('option', { name: 'Option A' })).toBeVisible();
        await expect(component.getByRole('option', { name: 'Option B' })).toBeVisible();
    });

    test('should call onChange when option selected', async ({ mount }) => {
        let selected: { label: string; value: string } | undefined;
        const options = [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
        ];
        const component = await mount(
            <div>
                <CustomSelect
                    label="Select"
                    options={options}
                    onChange={(v) => {
                        const single = Array.isArray(v) ? undefined : (v ?? undefined);
                        selected = single as { label: string; value: string } | undefined;
                    }}
                />
            </div>,
        );
        const control = component.locator('[class*="control"]').first();
        await control.click();
        await component.getByRole('option', { name: 'Option B' }).click();
        expect(selected).toEqual({ label: 'Option B', value: 'b' });
    });
});
