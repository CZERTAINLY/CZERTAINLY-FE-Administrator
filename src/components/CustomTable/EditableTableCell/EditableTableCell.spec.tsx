import { test, expect } from '../../../../playwright/ct-test';
import EditableTableCell from './index';

test.describe('EditableTableCell', () => {
    test('should render value and edit button when not editing', async ({ mount, page }) => {
        await mount(<EditableTableCell value="Initial text" onSave={() => {}} />);
        await expect(page.getByTestId('editable-cell-display')).toBeVisible();
        await expect(page.getByText('Initial text')).toBeVisible();
        await expect(page.getByTestId('editable-cell-edit-btn')).toBeVisible();
    });

    test('should show input when edit clicked', async ({ mount, page }) => {
        await mount(<EditableTableCell value="Cell value" onSave={() => {}} />);
        await page.getByTestId('editable-cell-edit-btn').click();
        await expect(page.getByTestId('editable-cell-editing')).toBeVisible();
        const input = page.getByRole('textbox');
        await expect(input).toBeVisible();
        await expect(input).toHaveValue('Cell value');
    });

    test('should call onSave when value submitted', async ({ mount, page }) => {
        let saved: string | null = null;
        await mount(
            <EditableTableCell
                value="Original"
                onSave={(v) => {
                    saved = v as string;
                }}
            />,
        );
        await page.getByTestId('editable-cell-edit-btn').click();
        await page.getByRole('textbox').fill('Updated');
        await page.locator('button').first().click();
        expect(saved).toBe('Updated');
    });

    test('should call onCancel when cancel clicked', async ({ mount, page }) => {
        let cancelled = false;
        await mount(
            <EditableTableCell
                value="Value"
                onSave={() => {}}
                onCancel={() => {
                    cancelled = true;
                }}
            />,
        );
        await page.getByTestId('editable-cell-edit-btn').click();
        await page.locator('button').nth(1).click();
        expect(cancelled).toBe(true);
    });
});
