import React from 'react';
import { test, expect } from '../../../../../playwright/ct-test';
import { AttributeFieldSelectTestWrapper } from './AttributeFieldSelectTestWrapper';
import type { DataAttributeModel } from 'types/attributes';
import { AttributeContentType } from 'types/openapi';

const defaultProperties = {
    label: 'Test Select',
    required: false,
    readOnly: false,
    visible: true,
    list: false,
    multiSelect: false,
};

function minimalDescriptor(overrides: Partial<DataAttributeModel> = {}): DataAttributeModel {
    return {
        type: 'Data',
        name: 'testSelect',
        contentType: AttributeContentType.String,
        properties: defaultProperties,
        ...overrides,
    };
}

test.describe('AttributeFieldSelect', () => {
    test('renders label and Select when visible', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, label: 'My Select Field' },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        await expect(page.getByText('My Select Field')).toBeVisible();
        await expect(page.getByTestId('select-testSelectSelect')).toBeVisible();
    });

    test('renders Select when options empty', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, label: 'Choose one' },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        const selectContainer = page.getByTestId('select-testSelectSelect');
        await expect(selectContainer).toBeVisible();
        await expect(page.getByTestId('label-testSelectSelect')).toHaveText('Choose one');
    });

    test('does not render label when descriptor.properties.visible is false', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, visible: false, label: 'Hidden Label' },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        await expect(page.getByText('Hidden Label')).toHaveCount(0);
        await expect(page.getByTestId('select-testSelectSelect')).toBeVisible();
    });

    test('renders description when descriptor.description is set and visible', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            description: 'Pick an option from the list.',
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        await expect(page.getByText('Pick an option from the list.')).toBeVisible();
    });

    test('renders deleteButton when provided', async ({ mount, page }) => {
        const descriptor = minimalDescriptor();
        await mount(
            <AttributeFieldSelectTestWrapper
                name="testSelect"
                descriptor={descriptor}
                deleteButton={<button type="button">Remove select</button>}
            />,
        );

        await expect(page.getByRole('button', { name: 'Remove select' })).toBeVisible();
    });

    test('renders required indicator on label when descriptor.properties.required is true', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, required: true, label: 'Required Select' },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        await expect(page.getByText('Required Select')).toBeVisible();
        await expect(page.locator('label[for="testSelectSelect"]')).toContainText('Required Select');
    });

    test('Select is disabled when busy is true', async ({ mount, page }) => {
        const descriptor = minimalDescriptor();
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} busy />);

        const selectInput = page.getByTestId('select-testSelectSelect-input');
        await expect(selectInput).toHaveAttribute('disabled');
    });

    test('Select is disabled when descriptor.properties.readOnly is true', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, readOnly: true },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        const selectInput = page.getByTestId('select-testSelectSelect-input');
        await expect(selectInput).toHaveAttribute('disabled');
    });

    test('renders options when provided', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, label: 'Status' },
        } as any);
        const options = [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
        ];
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} options={options} />);

        await expect(page.getByTestId('label-testSelectSelect')).toHaveText('Status');
        await expect(page.getByTestId('select-testSelectSelect')).toBeVisible();
        await page.getByTestId('select-testSelectSelect').click();
        await expect(page.locator('.hs-select-option-row[data-value="active"]')).toBeVisible();
        await expect(page.locator('.hs-select-option-row[data-value="inactive"]')).toBeVisible();
    });

    test('renders single Select when multiSelect is false', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, multiSelect: false },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        await expect(page.getByTestId('select-testSelectSelect')).toBeVisible();
        await expect(page.getByTestId('select-testSelectSelect-input')).toBeAttached();
    });

    test('renders multi Select when multiSelect is true', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, multiSelect: true },
        } as any);
        await mount(<AttributeFieldSelectTestWrapper name="testSelect" descriptor={descriptor} />);

        await expect(page.getByTestId('select-testSelectSelect')).toBeVisible();
        await expect(page.getByTestId('select-testSelectSelect-input')).toBeAttached();
    });

    test('includes add-new option when addNewAttributeValue is provided', async ({ mount, page }) => {
        const descriptor = minimalDescriptor({
            properties: { ...defaultProperties, label: 'Add item' },
        } as any);
        const options = [{ label: 'Option A', value: 'a' }];
        await mount(
            <AttributeFieldSelectTestWrapper
                name="testSelect"
                descriptor={descriptor}
                options={options}
                addNewAttributeValue={{ label: 'Add new', value: '__add_new__' }}
            />,
        );

        await expect(page.getByTestId('select-testSelectSelect')).toBeVisible();
        await page.getByTestId('select-testSelectSelect').click();
        await expect(page.locator('.hs-select-option-row', { hasText: 'Option A' })).toBeVisible();
        await expect(page.locator('.hs-select-option-row', { hasText: '+' })).toBeVisible();
    });
});
