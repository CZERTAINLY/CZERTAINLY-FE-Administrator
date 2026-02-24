import { test, expect } from '../../../../playwright/ct-test';
import FooterWithStore from './FooterWithStore';

test.describe('Footer', () => {
    test('should render footer with data-testid', async ({ mount }) => {
        const component = await mount(<FooterWithStore />);

        await expect(component).toBeVisible();
        await expect(component).toHaveAttribute('data-testid', 'footer');
    });

    test('should render Documentation link', async ({ mount }) => {
        const component = await mount(<FooterWithStore />);

        const docsLink = component.getByTestId('footer-docs-link');
        await expect(docsLink).toBeVisible();
        await expect(docsLink).toHaveAttribute('href', 'https://docs.czertainly.com/docs');
        await expect(docsLink).toHaveText('Documentation');
    });

    test('should render Support link', async ({ mount }) => {
        const component = await mount(<FooterWithStore />);

        const supportLink = component.getByTestId('footer-support-link');
        await expect(supportLink).toBeVisible();
        await expect(supportLink).toHaveAttribute('href', 'https://czertainly.atlassian.net/servicedesk/customer/portal/1');
        await expect(supportLink).toHaveText('Support');
    });

    test('should render About Us link', async ({ mount }) => {
        const component = await mount(<FooterWithStore />);

        const aboutLink = component.getByTestId('footer-about-link');
        await expect(aboutLink).toBeVisible();
        await expect(aboutLink).toHaveAttribute('href', 'https://www.czertainly.com');
        await expect(aboutLink).toHaveText('About Us');
    });

    test('should render copyright text', async ({ mount }) => {
        const component = await mount(<FooterWithStore />);

        await expect(component.getByText(/© 2018-/)).toBeVisible();
        await expect(component.getByText(/Identity Lifecycle Management/)).toBeVisible();
    });
});
