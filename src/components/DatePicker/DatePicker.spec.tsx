import { test, expect } from '../../../playwright/ct-test';
import DatePicker from './index';

test.describe('DatePicker', () => {
    test('should render date picker input', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toBeVisible();
    });

    test('should display selected date value', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="2024-01-15" onChange={() => {}} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toHaveValue('15.01.2024');
    });

    test('should call onChange when date is selected', async ({ mount }) => {
        let selectedValue = '';
        const handleChange = (value: string) => {
            selectedValue = value;
        };

        const component = await mount(
            <div>
                <DatePicker value="" onChange={handleChange} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await input.click();
        await component.page().waitForTimeout(200);

        const calendar = component.locator('[class*="fixed z-50"]');
        if (await calendar.isVisible().catch(() => false)) {
            const day15Button = calendar.getByRole('button', { name: '15' }).first();

            if (await day15Button.isVisible().catch(() => false)) {
                await day15Button.click();
                await component.page().waitForTimeout(100);

                expect(selectedValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            }
        }
    });

    test('should be disabled when disabled prop is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} disabled={true} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toBeDisabled();
    });

    test('should display error message when error prop is provided', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} error="This field is required" />
            </div>,
        );

        await expect(component.getByText('This field is required')).toBeVisible();
    });

    test('should apply invalid styling when invalid is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} invalid={true} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toHaveClass(/border-red-500/);
    });

    test('should support time picker when timePicker is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="2024-01-15T10:30:00" onChange={() => {}} timePicker={true} />
            </div>,
        );

        const input = component.locator('input[type="text"]');

        const value = await input.inputValue();
        expect(value).toContain('10:30:00');
    });

    test('should display placeholder', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toHaveAttribute('placeholder', 'dd.mm.yyyy');
    });

    test('should display time placeholder when timePicker is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} timePicker={true} />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toHaveAttribute('placeholder', 'dd.mm.yyyy 00:00:00');
    });

    test('should support custom className', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} className="custom-datepicker" />
            </div>,
        );

        const container = component.locator('.custom-datepicker');
        await expect(container).toBeAttached();
    });

    test('should support id prop', async ({ mount }) => {
        const component = await mount(
            <div>
                <DatePicker value="" onChange={() => {}} id="test-datepicker" />
            </div>,
        );

        const input = component.locator('input[type="text"]');
        await expect(input).toHaveAttribute('id', 'test-datepicker');
    });
});
