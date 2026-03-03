import { test, expect } from '../../../../playwright/ct-test';
import FileUpload from './FileUpload';

test.describe('FileUpload', () => {
    test('should render file upload component', async ({ mount }) => {
        const component = await mount(
            <div>
                <FileUpload onFileContentLoaded={() => {}} />
            </div>,
        );

        const fileInput = component.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();
    });

    test('should display file content when showContent is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <FileUpload onFileContentLoaded={() => {}} showContent={true} />
            </div>,
        );

        const textarea = component.locator('textarea');
        await expect(textarea).toBeAttached();
    });

    test('should hide file content when showContent is false', async ({ mount }) => {
        const component = await mount(
            <div>
                <FileUpload onFileContentLoaded={() => {}} showContent={false} />
            </div>,
        );

        const textarea = component.locator('textarea');
        await expect(textarea).toHaveCount(0);
    });

    test('should support id prop', async ({ mount }) => {
        const component = await mount(
            <div>
                <FileUpload onFileContentLoaded={() => {}} id="test-file-upload" />
            </div>,
        );

        const fileInput = component.locator('input[type="file"]');
        await expect(fileInput).toHaveAttribute('id', 'test-file-upload__fileUpload__file');
    });

    test('should hide file info fields when showFileInfo is false', async ({ mount }) => {
        const component = await mount(
            <div>
                <FileUpload onFileContentLoaded={() => {}} showFileInfo={false} />
            </div>,
        );

        await expect(component.getByText('File name')).toHaveCount(0);
        await expect(component.getByText('Content type')).toHaveCount(0);
    });

    test('should enable textarea when editable is true', async ({ mount }) => {
        const component = await mount(
            <div>
                <FileUpload onFileContentLoaded={() => {}} showContent={true} editable={true} fileType="json" />
            </div>,
        );

        await expect(component.locator('textarea')).not.toBeDisabled();
        await expect(component.getByText('Select or drag & drop json file')).toBeVisible();
    });
});
