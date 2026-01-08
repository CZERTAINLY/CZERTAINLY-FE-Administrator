import { test, expect } from '../../../playwright/ct-test';
import Container from './index';

test.describe('Container', () => {
    test('should render container with children', async ({ mount }) => {
        const component = await mount(
            <Container>
                <div>Content 1</div>
                <div>Content 2</div>
            </Container>,
        );

        await expect(component.getByText('Content 1')).toBeVisible();
        await expect(component.getByText('Content 2')).toBeVisible();
    });

    test('should apply flex flex-col classes', async ({ mount }) => {
        const component = await mount(
            <Container>
                <div>Content</div>
            </Container>,
        );

        const content = component.getByText('Content');
        const container = content.locator('..');
        await expect(container).toBeVisible();
        await expect(container).toHaveClass(/flex/);
        await expect(container).toHaveClass(/flex-col/);
    });

    test('should support custom className', async ({ mount }) => {
        const component = await mount(
            <Container className="custom-container">
                <div>Content</div>
            </Container>,
        );

        const content = component.getByText('Content');
        const container = content.locator('..');
        await expect(container).toHaveClass(/custom-container/);
    });

    test('should apply marginTop when marginTop is true', async ({ mount }) => {
        const component = await mount(
            <Container marginTop={true}>
                <div>Content</div>
            </Container>,
        );

        const content = component.getByText('Content');
        const container = content.locator('..');
        await expect(container).toHaveClass(/mt-4/);
    });

    test('should not apply marginTop when marginTop is false', async ({ mount }) => {
        const component = await mount(
            <Container marginTop={false}>
                <div>Content</div>
            </Container>,
        );

        const content = component.getByText('Content');
        const container = content.locator('..');

        const classes = await container.getAttribute('class');
        expect(classes).not.toContain('mt-4');
    });

    test('should support custom gap', async ({ mount }) => {
        const component = await mount(
            <Container gap={6}>
                <div>Content</div>
            </Container>,
        );

        const content = component.getByText('Content');
        const container = content.locator('..');

        await expect(container).toHaveClass(/gap-6/);
    });

    test('should use default gap when gap is not provided', async ({ mount }) => {
        const component = await mount(
            <Container>
                <div>Content</div>
            </Container>,
        );

        const content = component.getByText('Content');
        const container = content.locator('..');

        await expect(container).toHaveClass(/gap-4/);
        await expect(container).toHaveClass(/md:gap-8/);
    });
});
