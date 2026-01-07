import { test, expect } from '../../../playwright/ct-test';
import Label from './index';

test.describe('Label', () => {
    test('should render label with children text', async ({ mount }) => {
        const component = await mount(<Label>Test Label</Label>);

        const label = component.getByText('Test Label');
        await expect(label).toBeVisible();

        const forAttribute = await label.getAttribute('for');
        expect(forAttribute).toBeNull();
    });

    test('should render label with title prop', async ({ mount }) => {
        const component = await mount(<Label title="Title Text">Children Text</Label>);

        await expect(component.getByText('Title Text')).toBeVisible();
        await expect(component.getByText('Children Text')).not.toBeVisible();
    });

    test('should render required indicator when required is true', async ({ mount }) => {
        const component = await mount(<Label required={true}>Required Label</Label>);

        await expect(component.getByText('Required Label')).toBeVisible();

        const label = component.getByText('Required Label');
        const requiredSpan = label.locator('..').locator('span.text-red-500');
        await expect(requiredSpan).toBeVisible();
        await expect(requiredSpan).toHaveText(' *');
    });

    test('should not render required indicator when required is false', async ({ mount }) => {
        const component = await mount(<Label required={false}>Optional Label</Label>);

        await expect(component.getByText('Optional Label')).toBeVisible();
        const label = component.getByText('Optional Label');
        const requiredSpan = label.locator('..').locator('span.text-red-500');
        await expect(requiredSpan).toHaveCount(0);
    });

    test('should support htmlFor prop', async ({ mount }) => {
        const component = await mount(<Label htmlFor="test-input-id">Label Text</Label>);

        const label = component.getByText('Label Text');
        await expect(label).toHaveAttribute('for', 'test-input-id');
    });

    test('should support custom className', async ({ mount }) => {
        const component = await mount(<Label className="custom-label-class">Label</Label>);

        const label = component.getByText('Label');
        await expect(label).toHaveClass(/custom-label-class/);
    });

    test('should render with React node children', async ({ mount }) => {
        const component = await mount(
            <Label>
                <span>Label</span>
                <span>Text</span>
            </Label>,
        );

        await expect(component.getByText('Label')).toBeVisible();
        await expect(component.getByText('Text')).toBeVisible();
    });
});
