import { test, expect } from '../../../playwright/ct-test';
import { MemoryRouter } from 'react-router';
import Breadcrumb from './index';

test.describe('Breadcrumb', () => {
    test('should render breadcrumb items', async ({ mount }) => {
        const items = [
            { label: 'Home', href: '/' },
            { label: 'Page', href: '/page' },
        ];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        await expect(component.getByText('Home')).toBeVisible();
        await expect(component.getByText('Page')).toBeVisible();
    });

    test('should render items without href as span', async ({ mount }) => {
        const items = [{ label: 'Home', href: '/' }, { label: 'Current Page' }];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        await expect(component.getByText('Home')).toBeVisible();
        await expect(component.getByText('Current Page')).toBeVisible();
    });

    test('should render separator between items', async ({ mount }) => {
        const items = [
            { label: 'First', href: '/first' },
            { label: 'Second', href: '/second' },
        ];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        await expect(component.getByText('First')).toBeVisible();
        await expect(component.getByText('Second')).toBeVisible();

        const separator = component.locator('svg[aria-hidden="true"]');
        await expect(separator).toBeVisible();
    });

    test('should not render separator for last item', async ({ mount }) => {
        const items = [{ label: 'Single Item' }];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        await expect(component.getByText('Single Item')).toBeVisible();

        const separator = component.locator('svg[aria-hidden="true"]');
        await expect(separator).toHaveCount(0);
    });

    test('should render single item', async ({ mount }) => {
        const items = [{ label: 'Single', href: '/single' }];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        await expect(component.getByText('Single')).toBeVisible();
    });

    test('should render multiple items', async ({ mount }) => {
        const items = [
            { label: 'First', href: '/first' },
            { label: 'Second', href: '/second' },
            { label: 'Third', href: '/third' },
        ];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        await expect(component.getByText('First')).toBeVisible();
        await expect(component.getByText('Second')).toBeVisible();
        await expect(component.getByText('Third')).toBeVisible();

        const separators = component.locator('svg[aria-hidden="true"]');
        await expect(separators).toHaveCount(2);
    });

    test('should apply correct styling to non-last items', async ({ mount }) => {
        const items = [{ label: 'First', href: '/first' }, { label: 'Last' }];

        const component = await mount(
            <MemoryRouter>
                <Breadcrumb items={items} />
            </MemoryRouter>,
        );

        const firstItem = component.getByText('First').locator('..');
        await expect(firstItem).toHaveClass(/text-gray-400/);
    });
});
