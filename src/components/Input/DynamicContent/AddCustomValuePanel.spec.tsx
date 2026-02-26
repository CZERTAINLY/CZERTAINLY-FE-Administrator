import { test, expect } from '../../../../playwright/ct-test';
import { AddCustomValuePanel } from './AddCustomValuePanel';
import { AttributeContentType } from 'types/openapi';

test.describe('AddCustomValuePanel', () => {
    test('renders nothing when open is false', async ({ mount, page }) => {
        await mount(
            <AddCustomValuePanel
                open={false}
                onClose={() => {}}
                idPrefix="test"
                contentType={AttributeContentType.String}
                readOnly={false}
                fieldValue={undefined}
                onFieldChange={() => {}}
            />,
        );
        await expect(page.getByRole('button', { name: 'Add' })).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).not.toBeVisible();
    });

    test('renders panel with input and buttons when open is true', async ({ mount, page }) => {
        await mount(
            <AddCustomValuePanel
                open={true}
                onClose={() => {}}
                idPrefix="test"
                contentType={AttributeContentType.String}
                readOnly={false}
                fieldValue={undefined}
                onFieldChange={() => {}}
            />,
        );
        await expect(page.locator('#test-custom')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    });

    test('Add button is disabled when text input is empty', async ({ mount, page }) => {
        await mount(
            <AddCustomValuePanel
                open={true}
                onClose={() => {}}
                idPrefix="test"
                contentType={AttributeContentType.String}
                readOnly={false}
                fieldValue={undefined}
                onFieldChange={() => {}}
            />,
        );
        const addButton = page.getByRole('button', { name: 'Add' });
        await expect(addButton).toBeDisabled();
    });

    test('Cancel calls onClose', async ({ mount, page }) => {
        let closed = false;
        await mount(
            <AddCustomValuePanel
                open={true}
                onClose={() => {
                    closed = true;
                }}
                idPrefix="test"
                contentType={AttributeContentType.String}
                readOnly={false}
                fieldValue={undefined}
                onFieldChange={() => {}}
            />,
        );
        await page.getByRole('button', { name: 'Cancel' }).click();
        expect(closed).toBe(true);
    });

    test('filling value and clicking Add calls onFieldChange and onClose', async ({ mount, page }) => {
        let receivedValue: any = undefined;
        let closed = false;
        await mount(
            <AddCustomValuePanel
                open={true}
                onClose={() => {
                    closed = true;
                }}
                idPrefix="test"
                contentType={AttributeContentType.String}
                readOnly={false}
                fieldValue={undefined}
                onFieldChange={(v) => {
                    receivedValue = v;
                }}
            />,
        );
        const input = page.getByRole('textbox');
        await input.focus(); // TextInput removes readonly on focus (anti-autofill)
        await input.fill('custom value');
        const addButton = page.getByRole('button', { name: 'Add' });
        await expect(addButton).toBeEnabled({ timeout: 5000 });
        await addButton.click();
        expect(receivedValue).toBe('custom value');
        expect(closed).toBe(true);
    });

    test('multiSelect: Add appends to current field value', async ({ mount, page }) => {
        let receivedValue: any = undefined;
        await mount(
            <AddCustomValuePanel
                open={true}
                onClose={() => {}}
                idPrefix="test"
                contentType={AttributeContentType.String}
                multiSelect={true}
                readOnly={false}
                fieldValue={['existing']}
                onFieldChange={(v) => {
                    receivedValue = v;
                }}
            />,
        );
        const input = page.getByRole('textbox');
        await input.focus();
        await input.fill('new item');
        const addButton = page.getByRole('button', { name: 'Add' });
        await expect(addButton).toBeEnabled({ timeout: 5000 });
        await addButton.click();
        expect(receivedValue).toEqual(['existing', 'new item']);
    });

    test('with parseValue, panel updates state and Add is enabled when input has value', async ({ mount, page }) => {
        await mount(
            <AddCustomValuePanel
                open={true}
                onClose={() => {}}
                idPrefix="test"
                contentType={AttributeContentType.String}
                readOnly={false}
                fieldValue={undefined}
                onFieldChange={() => {}}
                parseValue={(raw) => (typeof raw === 'string' ? parseInt(raw, 10) : raw)}
            />,
        );
        const input = page.getByRole('textbox');
        await input.focus();
        await input.fill('42');
        const addButton = page.getByRole('button', { name: 'Add' });
        await expect(addButton).toBeEnabled({ timeout: 5000 });
    });
});
