import { test, expect } from '../../../playwright/ct-test';
import Dialog from './index';
import DialogWithState from './DialogWithState';

test.describe('Dialog', () => {
    test('should not render when isOpen is false', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={false} caption="Test Dialog" body="Dialog content" dataTestId="test-dialog" />);

        await expect(component.getByText('Test Dialog')).not.toBeVisible();
        await expect(component.getByText('Dialog content')).not.toBeVisible();
    });

    test('should render when isOpen is true', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Test Dialog" body="Dialog content" dataTestId="test-dialog" />);

        await expect(component.getByText('Test Dialog')).toBeVisible();
        await expect(component.getByText('Dialog content')).toBeVisible();
    });

    test('should call toggle when close button is clicked', async ({ mount, page }) => {
        let toggleCalled = false;
        const toggle = () => {
            toggleCalled = true;
        };

        await mount(<Dialog isOpen={true} caption="Test Dialog" body="Dialog content" toggle={toggle} dataTestId="test-dialog" />);

        await expect(page.getByText('Test Dialog')).toBeVisible();

        const dialog = page.locator('[data-testid="test-dialog"]');
        const closeButton = dialog.getByRole('button').first();
        await closeButton.click();

        expect(toggleCalled).toBe(true);
    });

    test('should call button onClick handlers', async ({ mount }) => {
        let cancelClicked = false;
        let confirmClicked = false;

        const buttons = [
            {
                color: 'primary' as const,
                onClick: () => {
                    confirmClicked = true;
                },
                body: 'Confirm',
            },
            {
                color: 'secondary' as const,
                onClick: () => {
                    cancelClicked = true;
                },
                body: 'Cancel',
            },
        ];

        const component = await mount(
            <Dialog isOpen={true} caption="Test Dialog" body="Dialog content" buttons={buttons} dataTestId="test-dialog" />,
        );

        await component.getByText('Confirm').click();
        expect(confirmClicked).toBe(true);

        await component.getByText('Cancel').click();
        expect(cancelClicked).toBe(true);
    });

    test('should support different dialog sizes', async ({ mount }) => {
        const smallDialog = await mount(
            <Dialog isOpen={true} caption="Test Dialog" body="Dialog content" size="sm" dataTestId="test-dialog" />,
        );
        await expect(smallDialog.getByText('Test Dialog')).toBeVisible();
        await smallDialog.unmount();

        const largeDialog = await mount(
            <Dialog isOpen={true} caption="Test Dialog" body="Dialog content" size="lg" dataTestId="test-dialog" />,
        );
        await expect(largeDialog.getByText('Test Dialog')).toBeVisible();
    });

    test('should render icon when provided', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Delete Item" body="Are you sure?" icon="delete" dataTestId="test-dialog" />,
        );

        await expect(component.getByText('Delete Item')).toBeVisible();

        const iconContainer = component.locator('.w-12.h-12');
        await expect(iconContainer).toBeVisible();
    });

    test('should render info icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Info Dialog" body="Information message" icon="info" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Info Dialog' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render warning icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Warning Dialog" body="Warning message" icon="warning" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Warning Dialog' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should support size xl', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Extra Large" body="Content" size="xl" dataTestId="test-dialog" />);
        await expect(component.getByText('Extra Large')).toBeVisible();
    });

    test('should support size xxl', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="2XL" body="Content" size="xxl" dataTestId="test-dialog" />);
        await expect(component.getByText('2XL')).toBeVisible();
    });

    test('should disable buttons when button disabled prop is true', async ({ mount }) => {
        const buttons = [
            {
                color: 'primary' as const,
                onClick: () => {},
                body: 'Submit',
                disabled: true,
            },
        ];

        const component = await mount(
            <Dialog isOpen={true} caption="Test Dialog" body="Dialog content" buttons={buttons} dataTestId="test-dialog" />,
        );

        const submitButton = component.getByText('Submit');
        await expect(submitButton).toBeDisabled();
    });

    test('should use custom data-testid when provided', async ({ mount, page }) => {
        await mount(<Dialog isOpen={true} caption="Test Dialog" body="Dialog content" dataTestId="custom-dialog-id" />);

        await expect(page.getByText('Test Dialog')).toBeVisible();

        const dialogElement = page.locator('[data-testid="custom-dialog-id"]');
        await expect(dialogElement).toBeVisible();
        await expect(dialogElement).toHaveAttribute('data-testid', 'custom-dialog-id');
    });

    test('should prevent body scroll when dialog is open', async ({ mount, page }) => {
        await mount(<Dialog isOpen={true} caption="Test Dialog" body="Dialog content" dataTestId="test-dialog" />);

        await page.waitForTimeout(100);

        const bodyStyle = await page.evaluate(() => document.body.style.overflow);
        expect(bodyStyle).toBe('hidden');
    });

    test('should support noBorder prop', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="No Border" body="Content" noBorder={true} dataTestId="test-dialog" />);
        await expect(component.getByText('No Border')).toBeVisible();
    });

    test('should support size md', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Medium" body="Content" size="md" dataTestId="test-dialog" />);
        await expect(component.getByText('Medium')).toBeVisible();
    });

    test('should render body as React node', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Test" body={<span data-testid="custom-body">Custom body</span>} dataTestId="test-dialog" />,
        );
        await expect(component.getByTestId('custom-body')).toBeVisible();
        await expect(component.getByText('Custom body')).toBeVisible();
    });

    test('should render success icon', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Success" body="Done" icon="check" dataTestId="test-dialog" />);
        await expect(component.getByRole('heading', { name: 'Success' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render destroy icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Destroy" body="Confirm destroy" icon="destroy" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Destroy' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should restore body overflow when closed via toggle', async ({ mount, page }) => {
        await mount(<DialogWithState />);
        await page.waitForTimeout(50);
        expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

        await page.getByTestId('test-dialog').getByRole('button').first().click();
        await page.waitForTimeout(100);
        expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    });

    test('should render upload icon', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Upload" body="Upload file" icon="upload" dataTestId="test-dialog" />);
        await expect(component.getByRole('heading', { name: 'Upload' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render users icon', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Users" body="Manage users" icon="users" dataTestId="test-dialog" />);
        await expect(component.getByRole('heading', { name: 'Users' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render user icon', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="User" body="User profile" icon="user" dataTestId="test-dialog" />);
        await expect(component.getByRole('heading', { name: 'User' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render download icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Download" body="Download file" icon="download" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Download' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render refresh icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Refresh" body="Refresh data" icon="refresh" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Refresh' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render shuffle icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Shuffle" body="Shuffle items" icon="shuffle" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Shuffle' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render minus icon', async ({ mount }) => {
        const component = await mount(<Dialog isOpen={true} caption="Remove" body="Remove item" icon="minus" dataTestId="test-dialog" />);
        await expect(component.getByRole('heading', { name: 'Remove' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render plug icon', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="Connect" body="Connect plugin" icon="plug" dataTestId="test-dialog" />,
        );
        await expect(component.getByRole('heading', { name: 'Connect' })).toBeVisible();
        await expect(component.locator('.w-12.h-12')).toBeVisible();
    });

    test('should render custom icon as React node', async ({ mount }) => {
        const component = await mount(
            <Dialog
                isOpen={true}
                caption="Custom"
                body="Content"
                icon={<span data-testid="custom-icon">Icon</span>}
                dataTestId="test-dialog"
            />,
        );
        await expect(component.getByTestId('custom-icon')).toBeVisible();
        await expect(component.getByText('Icon')).toBeVisible();
    });

    test('should use button key when provided', async ({ mount }) => {
        const buttons = [
            { key: 'save-btn', color: 'primary' as const, onClick: () => {}, body: 'Save' },
            { key: 'cancel-btn', color: 'secondary' as const, onClick: () => {}, body: 'Cancel' },
        ];
        const component = await mount(<Dialog isOpen={true} caption="Test" body="Content" buttons={buttons} dataTestId="test-dialog" />);
        await expect(component.getByText('Save')).toBeVisible();
        await expect(component.getByText('Cancel')).toBeVisible();
    });

    test('should pass button variant to Button', async ({ mount }) => {
        const buttons = [
            {
                color: 'primary' as const,
                variant: 'outline' as const,
                onClick: () => {},
                body: 'Outline',
            },
        ];
        const component = await mount(<Dialog isOpen={true} caption="Test" body="Content" buttons={buttons} dataTestId="test-dialog" />);
        const btn = component.getByText('Outline');
        await expect(btn).toBeVisible();
    });

    test('should render without buttons section when buttons is empty', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption="No Buttons" body="Just content" buttons={[]} dataTestId="test-dialog" />,
        );
        await expect(component.getByText('No Buttons')).toBeVisible();
        await expect(component.getByText('Just content')).toBeVisible();
        await expect(component.locator('.modal-footer')).not.toBeVisible();
    });

    test('should render caption as React node', async ({ mount }) => {
        const component = await mount(
            <Dialog isOpen={true} caption={<span data-testid="custom-caption">Custom title</span>} body="Body" dataTestId="test-dialog" />,
        );
        await expect(component.getByTestId('custom-caption')).toBeVisible();
        await expect(component.getByText('Custom title')).toBeVisible();
    });
});
