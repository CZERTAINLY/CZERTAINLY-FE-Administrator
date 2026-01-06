import { test, expect } from '@playwright/experimental-ct-react';
import MultipleValueTextInput from './index';

test.describe('MultipleValueTextInput', () => {
    test('should render input', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput value={[]} onChange={() => {}} />
            </div>,
        );

        const input = component.locator('input');
        await expect(input).toBeVisible();
    });

    test('should display placeholder', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput value={[]} onChange={() => {}} placeholder="Enter values" />
            </div>,
        );

        const input = component.locator('input');
        await expect(input).toHaveAttribute('placeholder', 'Enter values');
    });

    test('should call onChange when value is added via Enter', async ({ mount }) => {
        let values: string[] = [];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput value={[]} onChange={handleChange} />
            </div>,
        );

        const input = component.locator('input');
        await input.fill('value1');
        await input.press('Enter');
        expect(values).toContain('value1');
    });

    test('should call onChange when value is added via comma', async ({ mount }) => {
        let values: string[] = [];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput value={[]} onChange={handleChange} />
            </div>,
        );

        const input = component.locator('input');
        await input.fill('value1');
        await input.press(',');
        expect(values).toContain('value1');
    });

    test('should remove last value on Backspace when input is empty', async ({ mount }) => {
        let values = ['value1', 'value2'];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput value={['value1', 'value2']} onChange={handleChange} />
            </div>,
        );

        const input = component.locator('input');
        await input.press('Backspace');
        expect(values).toHaveLength(1);
        expect(values).toContain('value1');
    });

    test('should not add duplicate values', async ({ mount }) => {
        let values = ['value1'];
        const handleChange = (newValues: string[]) => {
            values = newValues;
        };

        const component = await mount(
            <div>
                <MultipleValueTextInput value={['value1']} onChange={handleChange} />
            </div>,
        );

        const input = component.locator('input');
        await input.fill('value1');
        await input.press('Enter');

        expect(values).toHaveLength(1);
    });

    test('should display existing values as badges', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput value={['value1', 'value2']} onChange={() => {}} />
            </div>,
        );

        await expect(component.getByText('value1')).toBeVisible();
        await expect(component.getByText('value2')).toBeVisible();
    });

    test('should support id prop', async ({ mount }) => {
        const component = await mount(
            <div>
                <MultipleValueTextInput value={[]} onChange={() => {}} id="test-input" />
            </div>,
        );

        const input = component.locator('input');
        await expect(input).toHaveAttribute('id', 'test-input');
    });
});
