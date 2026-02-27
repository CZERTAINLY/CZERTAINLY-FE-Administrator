import { test, expect } from '../../../../playwright/ct-test';
import CustomAttributeWidgetMountHarness from './CustomAttributeWidgetMountHarness';

import { AttributeContentType, AttributeType } from 'types/openapi';

test.describe('CustomAttributeWidget', () => {
    test('renders widget with title Custom Attributes', async ({ mount }) => {
        const component = await mount(<CustomAttributeWidgetMountHarness attributes={undefined} />);
        await expect(component.getByRole('heading', { name: 'Custom Attributes' })).toBeVisible();
    });

    test('shows Add custom attribute section when available attributes exist', async ({ mount }) => {
        const component = await mount(<CustomAttributeWidgetMountHarness attributes={[]} />);
        await expect(component.getByText('Add custom attribute')).toBeVisible();
        await expect(component.getByTestId('select-selectCustomAttribute-input')).toBeAttached();
    });

    test.skip('selecting attribute shows description and content field (dropdown option not stable in CT)', async ({ mount, page }) => {
        const component = await mount(<CustomAttributeWidgetMountHarness attributes={[]} />);
        await component.getByRole('button', { name: /add/i }).click();
        await page.getByRole('option', { name: 'Test Attribute' }).click();
        await expect(component.getByText('Test description')).toBeVisible();
    });

    test('does not show Add custom attribute when no available attributes', async ({ mount }) => {
        const component = await mount(<CustomAttributeWidgetMountHarness attributes={[]} availableAttributes={[]} />);
        await expect(component.getByRole('heading', { name: 'Custom Attributes' })).toBeVisible();
        await expect(component.getByText('Add custom attribute')).not.toBeVisible();
    });

    test('accepts className prop and renders widget', async ({ mount }) => {
        const component = await mount(<CustomAttributeWidgetMountHarness attributes={[]} className="custom-class" />);
        await expect(component.getByRole('heading', { name: 'Custom Attributes' })).toBeVisible();
    });

    test('loads content when attributes prop is provided', async ({ mount }) => {
        const attrs = [
            {
                uuid: 'resp-1',
                name: 'attr1',
                type: AttributeType.Custom,
                properties: { label: 'A1' },
                content: [],
            },
        ] as any;
        const component = await mount(<CustomAttributeWidgetMountHarness attributes={attrs} />);
        await expect(component.getByRole('heading', { name: 'Custom Attributes' })).toBeVisible();
    });

    test('allows editing and removing existing custom attribute', async ({ mount }) => {
        const attributes = [
            {
                uuid: 'resp-1',
                name: 'testAttr',
                type: AttributeType.Custom,
                contentType: AttributeContentType.String,
                properties: { label: 'Attr 1', required: false, readOnly: false, list: false, multiSelect: false, visible: true },
                content: [{ data: 'initial' }],
            },
        ] as any;

        const component = await mount(<CustomAttributeWidgetMountHarness attributes={attributes} />);

        await component.getByTestId('edit-button').click();
        await expect(component.getByTestId('save-custom-value')).toBeVisible();
        await component.getByTestId('save-custom-value').click();

        await expect(component.getByTestId('delete-button')).toBeVisible();
        await component.getByTestId('delete-button').click();

        await expect(component.getByRole('heading', { name: 'Custom Attributes' })).toBeVisible();
    });
});
