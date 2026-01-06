import { test, expect } from '@playwright/experimental-ct-react';
import DropDownForm from './index';

test.describe('DropDownForm', () => {
    test('should render form with dropdowns', async ({ mount }) => {
        const dropDownOptionsList = [
            {
                formLabel: 'Field 1',
                formValue: 'field1',
                options: [
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                ],
            },
        ];

        const component = await mount(
            <div>
                <DropDownForm dropDownOptionsList={dropDownOptionsList} onSubmit={() => {}} onClose={() => {}} />
            </div>,
        );

        const label = component.locator('label[for="field1"]');
        await expect(label).toBeVisible();
        await expect(label).toHaveText('Field 1');
    });

    test('should render submit and close buttons', async ({ mount }) => {
        const dropDownOptionsList = [
            {
                formLabel: 'Field 1',
                formValue: 'field1',
                options: [{ label: 'Option 1', value: '1' }],
            },
        ];

        const component = await mount(
            <div>
                <DropDownForm dropDownOptionsList={dropDownOptionsList} onSubmit={() => {}} onClose={() => {}} />
            </div>,
        );

        await expect(component.getByRole('button', { name: 'Close' })).toBeVisible();
        await expect(component.getByRole('button', { name: 'Submit' })).toBeVisible();
    });

    test('should disable submit button when form is invalid', async ({ mount }) => {
        const dropDownOptionsList = [
            {
                formLabel: 'Field 1',
                formValue: 'field1',
                options: [{ label: 'Option 1', value: '1' }],
            },
        ];

        const component = await mount(
            <div>
                <DropDownForm dropDownOptionsList={dropDownOptionsList} onSubmit={() => {}} onClose={() => {}} />
            </div>,
        );

        const submitButton = component.getByRole('button', { name: 'Submit' });
        await expect(submitButton).toBeDisabled();
    });
});
