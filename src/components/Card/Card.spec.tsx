import { test, expect } from '../../../playwright/ct-test';
import Card from './index';

test.describe('Card', () => {
    test('should render card with children', async ({ mount }) => {
        const component = await mount(
            <Card>
                <div>Card Content</div>
            </Card>,
        );

        await expect(component.getByText('Card Content')).toBeVisible();
    });

    test('should render card with title', async ({ mount }) => {
        const component = await mount(<Card title="Card Title">Content</Card>);

        await expect(component.getByText('Card Title')).toBeVisible();
        await expect(component.getByText('Content')).toBeVisible();
    });

    test('should render card with subtitle', async ({ mount }) => {
        const component = await mount(<Card subtitle="Card Subtitle">Content</Card>);

        await expect(component.getByText('Card Subtitle')).toBeVisible();
        await expect(component.getByText('Content')).toBeVisible();
    });

    test('should render card with content', async ({ mount }) => {
        const component = await mount(<Card content="Card content text">Additional Content</Card>);

        await expect(component.getByText('Card content text')).toBeVisible();
        await expect(component.getByText('Additional Content')).toBeVisible();
    });

    test('should render card with title, subtitle, and content', async ({ mount }) => {
        const component = await mount(
            <Card title="Title" subtitle="Subtitle" content="Content text">
                <div>Children</div>
            </Card>,
        );

        await expect(component.getByRole('heading', { name: 'Title' })).toBeVisible();
        await expect(component.getByText('Subtitle')).toBeVisible();
        await expect(component.getByText('Content text')).toBeVisible();
        await expect(component.getByText('Children')).toBeVisible();
    });

    test('should show spinner when isLoading is true', async ({ mount }) => {
        const component = await mount(
            <Card isLoading={true}>
                <div>This should not be visible</div>
            </Card>,
        );

        await expect(component.getByRole('status', { name: 'loading' })).toBeVisible();

        await expect(component.getByText('This should not be visible')).not.toBeVisible();
    });

    test('should not show spinner when isLoading is false', async ({ mount }) => {
        const component = await mount(
            <Card isLoading={false}>
                <div>Content</div>
            </Card>,
        );

        await expect(component.getByText('Content')).toBeVisible();

        await expect(component.getByRole('status', { name: 'loading' })).not.toBeVisible();
    });

    test('should render card without title, subtitle, or content', async ({ mount }) => {
        const component = await mount(
            <Card>
                <div>Only Children</div>
            </Card>,
        );

        await expect(component.getByText('Only Children')).toBeVisible();
    });
});
