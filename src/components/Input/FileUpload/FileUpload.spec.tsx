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
});
