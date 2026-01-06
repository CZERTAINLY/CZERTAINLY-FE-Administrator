import { test, expect } from '@playwright/experimental-ct-react';
import Badge from './index';

test.describe('Badge', () => {
    test('should render badge with children text', async ({ mount }) => {
        const component = await mount(<Badge>Test Badge</Badge>);

        const badge = component.getByText('Test Badge');
        await expect(badge).toBeVisible();
    });

    test('should render with different colors', async ({ mount }) => {
        const successBadge = await mount(<Badge color="success">Success</Badge>);
        await expect(successBadge.getByText('Success')).toBeVisible();
        await successBadge.unmount();

        const dangerBadge = await mount(<Badge color="danger">Danger</Badge>);
        await expect(dangerBadge.getByText('Danger')).toBeVisible();
        await dangerBadge.unmount();

        const primaryBadge = await mount(<Badge color="primary">Primary</Badge>);
        await expect(primaryBadge.getByText('Primary')).toBeVisible();
    });

    test('should render with different sizes', async ({ mount }) => {
        const smallBadge = await mount(<Badge size="small">Small</Badge>);
        await expect(smallBadge.getByText('Small')).toBeVisible();
        await smallBadge.unmount();

        const mediumBadge = await mount(<Badge size="medium">Medium</Badge>);
        await expect(mediumBadge.getByText('Medium')).toBeVisible();
        await mediumBadge.unmount();

        const largeBadge = await mount(<Badge size="large">Large</Badge>);
        await expect(largeBadge.getByText('Large')).toBeVisible();
    });

    test('should call onClick when clicked', async ({ mount }) => {
        let clicked = false;
        const handleClick = () => {
            clicked = true;
        };

        const component = await mount(<Badge onClick={handleClick}>Clickable</Badge>);

        const badge = component.getByText('Clickable');
        await badge.click();
        expect(clicked).toBe(true);
    });

    test('should have cursor-pointer class when onClick is provided', async ({ mount }) => {
        const component = await mount(<Badge onClick={() => {}}>Clickable</Badge>);

        const badge = component.getByText('Clickable');
        await expect(badge).toHaveClass(/cursor-pointer/);
    });

    test('should render remove button when onRemove is provided', async ({ mount }) => {
        const component = await mount(<Badge onRemove={() => {}}>Removable</Badge>);

        const removeButton = component.getByRole('button', { name: 'Remove badge' });
        await expect(removeButton).toBeVisible();
    });

    test('should call onRemove when remove button is clicked', async ({ mount }) => {
        let removed = false;
        const handleRemove = () => {
            removed = true;
        };

        const component = await mount(<Badge onRemove={handleRemove}>Removable</Badge>);

        await component.getByRole('button', { name: 'Remove badge' }).click();
        expect(removed).toBe(true);
    });

    test('should support title attribute', async ({ mount }) => {
        const component = await mount(<Badge title="Tooltip text">Badge</Badge>);

        const badge = component.getByText('Badge');
        await expect(badge).toHaveAttribute('title', 'Tooltip text');
    });

    test('should use custom data-testid when provided', async ({ mount }) => {
        const component = await mount(<Badge dataTestId="custom-badge-id">Badge</Badge>);

        const badge = component.getByText('Badge');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveAttribute('data-testid', 'custom-badge-id');

        const defaultBadge = component.locator('span[data-testid="badge"]');
        await expect(defaultBadge).toHaveCount(0);
    });

    test('should support custom className', async ({ mount }) => {
        const component = await mount(<Badge className="custom-class">Badge</Badge>);

        const badge = component.getByText('Badge');
        await expect(badge).toHaveClass(/custom-class/);
    });
});
