import { test, expect } from '../../../playwright/ct-test';
import ProgressButton from './index';

test.describe('ProgressButton', () => {
    test('should render button with title text', async ({ mount }) => {
        const component = await mount(<ProgressButton inProgress={false} title="Click Me" onClick={() => {}} />);

        await expect(component.getByText('Click Me')).toBeVisible();
    });

    test('should show loading state when inProgress is true', async ({ mount }) => {
        const component = await mount(
            <ProgressButton inProgress={true} title="Click Me" inProgressTitle="Loading..." onClick={() => {}} />,
        );

        const textElement = component.getByText('Loading...');
        await expect(textElement).toBeVisible();
        const button = textElement.locator('xpath=ancestor::button[1]');
        await expect(button).toBeVisible();
        await expect(button).toBeDisabled();

        await expect(button.getByRole('status', { name: 'loading' })).toBeVisible();
    });

    test('should use default inProgressTitle when not provided', async ({ mount }) => {
        const component = await mount(<ProgressButton inProgress={true} title="Submit" onClick={() => {}} />);

        const textElement = component.getByText('Submit');
        await expect(textElement).toBeVisible();
        const button = textElement.locator('xpath=ancestor::button[1]');
        await expect(button).toBeVisible();
        await expect(button).toBeDisabled();
    });

    test('should be disabled when disabled prop is true', async ({ mount }) => {
        let clicked = false;
        const handleClick = () => {
            clicked = true;
        };

        const component = await mount(<ProgressButton inProgress={false} title="Click Me" disabled={true} onClick={handleClick} />);

        await expect(component.getByText('Click Me')).toBeVisible();

        await component.getByText('Click Me').click({ force: true });
        expect(clicked).toBe(false);
    });

    test('should be disabled when inProgress is true even if disabled is false', async ({ mount }) => {
        const component = await mount(<ProgressButton inProgress={true} title="Click Me" disabled={false} onClick={() => {}} />);

        const textElement = component.getByText('Click Me');
        await expect(textElement).toBeVisible();
        const button = textElement.locator('xpath=ancestor::button[1]');
        await expect(button).toBeVisible();
        await expect(button).toBeDisabled();
    });

    test('should call onClick handler when clicked and not in progress', async ({ mount }) => {
        let clicked = false;
        const handleClick = () => {
            clicked = true;
        };

        const component = await mount(<ProgressButton inProgress={false} title="Click Me" onClick={handleClick} />);

        const textElement = component.getByText('Click Me');
        await expect(textElement).toBeVisible();

        await textElement.click();
        expect(clicked).toBe(true);
    });

    test('should not call onClick handler when in progress', async ({ mount }) => {
        let clicked = false;
        const handleClick = () => {
            clicked = true;
        };

        const component = await mount(<ProgressButton inProgress={true} title="Click Me" onClick={handleClick} />);

        const textElement = component.getByText('Click Me');
        await expect(textElement).toBeVisible();
        const button = textElement.locator('xpath=ancestor::button[1]');
        await expect(button).toBeVisible();
        await expect(button).toBeDisabled();

        expect(clicked).toBe(false);
    });

    test('should support different button colors', async ({ mount }) => {
        const primaryButton = await mount(<ProgressButton inProgress={false} title="Primary" color="primary" onClick={() => {}} />);
        await expect(primaryButton.getByText('Primary')).toBeVisible();
        await primaryButton.unmount();

        const dangerButton = await mount(<ProgressButton inProgress={false} title="Danger" color="danger" onClick={() => {}} />);
        await expect(dangerButton.getByText('Danger')).toBeVisible();
    });

    test('should support different button types', async ({ mount }) => {
        const submitButton = await mount(<ProgressButton inProgress={false} title="Submit" type="submit" onClick={() => {}} />);
        const submitText = submitButton.getByText('Submit');
        await expect(submitText).toBeVisible();

        const submitBtn = submitText.locator('..').locator('button').first();
        await expect(submitBtn).toHaveAttribute('type', 'submit');
        await submitButton.unmount();

        const button = await mount(<ProgressButton inProgress={false} title="Button" type="button" onClick={() => {}} />);
        const buttonText = button.getByText('Button');
        await expect(buttonText).toBeVisible();
        const btn = buttonText.locator('..').locator('button').first();
        await expect(btn).toHaveAttribute('type', 'button');
    });

    test('should use custom data-testid when provided', async ({ mount }) => {
        const component = await mount(
            <ProgressButton inProgress={false} title="Click Me" dataTestId="custom-button-id" onClick={() => {}} />,
        );

        const textElement = component.getByText('Click Me');
        await expect(textElement).toBeVisible();

        const button = textElement.locator('..').locator('button').first();
        await expect(button).toHaveAttribute('data-testid', 'custom-button-id');
    });
});
