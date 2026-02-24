import { test, expect } from '../../../playwright/ct-test';
import Switch from './index';

test.describe('Switch', () => {
    test('should render switch', async ({ mount }) => {
        const component = await mount(<Switch checked={false} onChange={() => {}} id="test-switch" />);

        const checkbox = component.locator('input[type="checkbox"]');
        await expect(checkbox).toBeVisible();
        await expect(checkbox).not.toBeChecked();
    });

    test('should be checked when checked prop is true', async ({ mount }) => {
        const component = await mount(<Switch checked={true} onChange={() => {}} id="test-switch" />);

        const checkbox = component.locator('input[type="checkbox"]');
        await expect(checkbox).toBeChecked();
    });

    test('should call onChange when toggled', async ({ mount }) => {
        let checked = false;
        const handleChange = (newChecked: boolean) => {
            checked = newChecked;
        };

        const component = await mount(<Switch checked={checked} onChange={handleChange} id="test-switch" />);

        const checkbox = component.locator('input[type="checkbox"]');
        await expect(checkbox).not.toBeChecked();

        const label = component.locator('label[for="test-switch"]').first();
        await label.click();
        expect(checked).toBe(true);
    });

    test('should be disabled when disabled prop is true', async ({ mount }) => {
        let clicked = false;
        const handleChange = () => {
            clicked = true;
        };

        const component = await mount(<Switch checked={false} onChange={handleChange} id="test-switch" disabled={true} />);

        const checkbox = component.locator('input[type="checkbox"]');
        await expect(checkbox).toBeDisabled();

        const label = component.locator('label[for="test-switch"]').first();
        await label.click({ force: true });
        expect(clicked).toBe(false);
    });

    test('should render with label', async ({ mount }) => {
        const component = await mount(<Switch checked={false} onChange={() => {}} id="test-switch" label="Toggle Switch" />);

        await expect(component.getByText('Toggle Switch')).toBeVisible();
        const checkbox = component.locator('input[type="checkbox"]');
        await expect(checkbox).toBeVisible();
    });

    test('should render with secondary label', async ({ mount }) => {
        const component = await mount(<Switch checked={false} onChange={() => {}} id="test-switch" secondaryLabel="Secondary Text" />);

        await expect(component.getByText('Secondary Text')).toBeVisible();
        const checkbox = component.locator('input[type="checkbox"]');
        await expect(checkbox).toBeVisible();
    });

    test('should render with both labels', async ({ mount }) => {
        const component = await mount(
            <Switch checked={false} onChange={() => {}} id="test-switch" label="Primary" secondaryLabel="Secondary" />,
        );

        await expect(component.getByText('Primary')).toBeVisible();
        await expect(component.getByText('Secondary')).toBeVisible();
    });

    test('should support custom className', async ({ mount }) => {
        const component = await mount(<Switch checked={false} onChange={() => {}} id="test-switch" className="custom-class" />);

        const checkbox = component.locator('input[type="checkbox"]');
        const root = checkbox.locator('..').locator('..').locator('..');
        await expect(root).toHaveClass(/custom-class/);
    });

    test('should support labelClassName', async ({ mount }) => {
        const component = await mount(
            <Switch checked={false} onChange={() => {}} id="test-switch" label="Test" labelClassName="custom-label" />,
        );

        const label = component.getByText('Test');
        await expect(label).toHaveClass(/custom-label/);
    });
});
