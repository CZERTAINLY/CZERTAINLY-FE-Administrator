import { test, expect } from '../../../playwright/ct-test';
import Dialog from './index';

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

    test('should close when clicking outside the dialog', async ({ mount, page }) => {
        let toggleCalled = false;
        const toggle = () => {
            toggleCalled = true;
        };

        await mount(<Dialog isOpen={true} caption="Test Dialog" body="Dialog content" toggle={toggle} dataTestId="test-dialog" />);

        await expect(page.getByText('Test Dialog')).toBeVisible();

        const overlay = page.locator('[data-testid="test-dialog"]');
        await expect(overlay).toBeVisible();

        const dialogContent = page.locator('.hs-overlay-animation-target');
        const dialogBox = await dialogContent.boundingBox();
        const overlayBox = await overlay.boundingBox();

        if (overlayBox && dialogBox) {
            const clickX = overlayBox.x + 20;
            const clickY = overlayBox.y + 20;

            if (
                clickX < dialogBox.x ||
                clickY < dialogBox.y ||
                clickX > dialogBox.x + dialogBox.width ||
                clickY > dialogBox.y + dialogBox.height
            ) {
                await overlay.evaluate((el) => {
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                    });
                    el.dispatchEvent(event);
                });
            } else {
                await overlay.evaluate((el) => {
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                    });
                    el.dispatchEvent(event);
                });
            }
        } else {
            await overlay.evaluate((el) => {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                el.dispatchEvent(event);
            });
        }

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
});
