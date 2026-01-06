import { test, expect } from '@playwright/experimental-ct-react';
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
});
