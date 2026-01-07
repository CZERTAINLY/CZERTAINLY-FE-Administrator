import { test, expect } from '../../../playwright/ct-test';
import Checkbox from './index';

test.describe('Checkbox', () => {
    test('should render checkbox', async ({ mount }) => {
        const component = await mount(<Checkbox checked={false} onChange={() => {}} />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).toBeVisible();
        await expect(checkbox).not.toBeChecked();
    });

    test('should be checked when checked prop is true', async ({ mount }) => {
        const component = await mount(<Checkbox checked={true} onChange={() => {}} />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).toBeChecked();
    });

    test('should call onChange when clicked', async ({ mount }) => {
        let checked = false;
        const handleChange = (newChecked: boolean) => {
            checked = newChecked;
        };

        const component = await mount(<Checkbox checked={false} onChange={handleChange} />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).not.toBeChecked();
        await checkbox.click();
        expect(checked).toBe(true);
    });

    test('should toggle checked state on click', async ({ mount }) => {
        let checked = false;
        const handleChange = (newChecked: boolean) => {
            checked = newChecked;
        };

        const component = await mount(<Checkbox checked={checked} onChange={handleChange} />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).not.toBeChecked();

        await checkbox.click();
        expect(checked).toBe(true);
    });

    test('should be disabled when disabled prop is true', async ({ mount }) => {
        let clicked = false;
        const handleChange = () => {
            clicked = true;
        };

        const component = await mount(<Checkbox checked={false} onChange={handleChange} disabled={true} />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).toBeDisabled();

        await checkbox.click({ force: true });
        expect(clicked).toBe(false);
    });

    test('should render with label', async ({ mount }) => {
        const component = await mount(<Checkbox checked={false} onChange={() => {}} label="Test Checkbox" />);

        await expect(component.getByText('Test Checkbox')).toBeVisible();
        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).toBeVisible();
    });

    test('should render without visible label when label is not provided', async ({ mount }) => {
        const component = await mount(<Checkbox checked={false} onChange={() => {}} />);

        const label = component.getByText('Checkbox');
        await expect(label).toBeVisible();
        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).toBeVisible();
    });

    test('should support id prop', async ({ mount }) => {
        const component = await mount(<Checkbox checked={false} onChange={() => {}} id="test-checkbox-id" />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).toHaveAttribute('id', 'test-checkbox-id');
    });

    test('should associate label with checkbox via id', async ({ mount }) => {
        const component = await mount(<Checkbox checked={false} onChange={() => {}} id="test-checkbox" label="Test Label" />);

        const checkbox = component.getByTestId('table-checkbox');
        const label = component.getByText('Test Label');

        await expect(checkbox).toHaveAttribute('id', 'test-checkbox');
        await expect(label).toHaveAttribute('for', 'test-checkbox');
    });

    test('should update when checked prop changes', async ({ mount }) => {
        const component = await mount(<Checkbox checked={false} onChange={() => {}} />);

        const checkbox = component.getByTestId('table-checkbox');
        await expect(checkbox).not.toBeChecked();

        await component.update(<Checkbox checked={true} onChange={() => {}} />);
        await expect(checkbox).toBeChecked();
    });
});
