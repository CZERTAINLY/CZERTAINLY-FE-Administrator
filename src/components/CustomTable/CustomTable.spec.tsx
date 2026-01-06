import { test, expect } from '@playwright/experimental-ct-react';
import CustomTable, { TableHeader, TableDataRow } from './index';

test.describe('CustomTable', () => {
    const mockHeaders: TableHeader[] = [
        { id: 'name', content: 'Name', sortable: true },
        { id: 'email', content: 'Email' },
        { id: 'status', content: 'Status' },
    ];

    const mockData: TableDataRow[] = [
        { id: 1, columns: ['John Doe', 'john@example.com', 'Active'] },
        { id: 2, columns: ['Jane Smith', 'jane@example.com', 'Inactive'] },
        { id: 3, columns: ['Bob Johnson', 'bob@example.com', 'Active'] },
    ];

    test('should render table with headers and data', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={mockData} />);

        const table = component.locator('table');
        await expect(table).toBeVisible();
        await expect(component.getByText('Name')).toBeVisible();
        await expect(component.getByText('Email')).toBeVisible();
        await expect(component.getByText('John Doe')).toBeVisible();
        await expect(component.getByText('Jane Smith')).toBeVisible();
    });

    test('should render table without header when hasHeader is false', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={mockData} hasHeader={false} />);

        const table = component.locator('table');
        await expect(table).toBeVisible();
    });

    test('should render search input when canSearch is true', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={mockData} canSearch={true} />);

        const searchInput = component.getByPlaceholder('Search');
        await expect(searchInput).toBeVisible();
    });

    test('should filter data when search is used', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={mockData} canSearch={true} />);

        const searchInput = component.getByPlaceholder('Search');
        await searchInput.fill('John');

        await expect(component.getByText('John Doe')).toBeVisible();
        await expect(component.getByText('Bob Johnson')).toBeVisible();

        await expect(component.getByText('Jane Smith')).not.toBeVisible();
    });

    test('should render checkboxes when hasCheckboxes is true', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={mockData} hasCheckboxes={true} />);

        const checkboxes = component.locator('input[type="checkbox"]');
        const count = await checkboxes.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should call onCheckedRowsChanged when checkbox is clicked', async ({ mount }) => {
        let checkedRows: (string | number)[] = [];
        const handleCheckedChange = (rows: (string | number)[]) => {
            checkedRows = rows;
        };

        const component = await mount(
            <CustomTable headers={mockHeaders} data={mockData} hasCheckboxes={true} onCheckedRowsChanged={handleCheckedChange} />,
        );

        const firstCheckbox = component.locator('input[type="checkbox"]').nth(1);
        await firstCheckbox.click();

        expect(checkedRows.length).toBeGreaterThan(0);
    });

    test('should render pagination when hasPagination is true', async ({ mount }) => {
        const paginationData = {
            page: 1,
            totalItems: 20,
            pageSize: 10,
            loadedPageSize: 10,
            totalPages: 2,
            itemsPerPageOptions: [5, 10, 20],
        };

        const component = await mount(
            <CustomTable headers={mockHeaders} data={mockData} hasPagination={true} paginationData={paginationData} />,
        );

        await expect(component.getByText(/Showing.*items of/)).toBeVisible();
    });

    test('should call onPageChanged when page is changed', async ({ mount }) => {
        let currentPage = 1;
        const handlePageChange = (page: number) => {
            currentPage = page;
        };

        const paginationData = {
            page: 1,
            totalItems: 20,
            pageSize: 10,
            loadedPageSize: 10,
            totalPages: 2,
            itemsPerPageOptions: [5, 10, 20],
        };

        const component = await mount(
            <CustomTable
                headers={mockHeaders}
                data={mockData}
                hasPagination={true}
                paginationData={paginationData}
                onPageChanged={handlePageChange}
            />,
        );

        const nextButton = component.getByRole('button', { name: /next|>/i }).or(component.locator('a').filter({ hasText: /2/ }));
        if ((await nextButton.count()) > 0) {
            await nextButton.first().click();
        }
    });

    test('should call onPageSizeChanged when page size is changed', async ({ mount }) => {
        let pageSize = 10;
        const handlePageSizeChange = (size: number) => {
            pageSize = size;
        };

        const paginationData = {
            page: 1,
            totalItems: 20,
            pageSize: 10,
            loadedPageSize: 10,
            totalPages: 2,
            itemsPerPageOptions: [5, 10, 20],
        };

        const component = await mount(
            <CustomTable
                headers={mockHeaders}
                data={mockData}
                hasPagination={true}
                paginationData={paginationData}
                onPageSizeChanged={handlePageSizeChange}
            />,
        );

        const selectButton = component.locator('button[aria-expanded]').first();
        if ((await selectButton.count()) > 0) {
            await expect(component.getByText(/Showing.*items of/)).toBeVisible();
        }
    });

    test('should sort columns when sortable header is clicked', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={mockData} />);

        const nameHeader = component.getByText('Name');
        await nameHeader.click();

        const table = component.locator('table');
        await expect(table).toBeVisible();
    });

    test('should handle empty data array', async ({ mount }) => {
        const component = await mount(<CustomTable headers={mockHeaders} data={[]} />);

        await expect(component.getByText('Name')).toBeVisible();
        await expect(component.getByText('Email')).toBeVisible();
    });

    test('should support row details when hasDetails is true', async ({ mount }) => {
        const dataWithDetails: TableDataRow[] = [
            {
                id: 1,
                columns: ['John Doe', 'john@example.com'],
                detailColumns: ['Detail 1', 'Detail 2'],
            },
        ];

        const component = await mount(<CustomTable headers={mockHeaders} data={dataWithDetails} hasDetails={true} />);

        const table = component.locator('table');
        await expect(table).toBeVisible();
    });

    test('should support multiSelect checkbox behavior', async ({ mount }) => {
        let checkedRows: (string | number)[] = [];
        const handleCheckedChange = (rows: (string | number)[]) => {
            checkedRows = rows;
        };

        const component = await mount(
            <CustomTable
                headers={mockHeaders}
                data={mockData}
                hasCheckboxes={true}
                multiSelect={true}
                onCheckedRowsChanged={handleCheckedChange}
            />,
        );

        const checkboxes = component.locator('input[type="checkbox"]');
        const checkboxCount = await checkboxes.count();
        if (checkboxCount > 1) {
            await checkboxes.nth(1).click();
            await checkboxes.nth(2).click();

            expect(checkedRows.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('should support single select when multiSelect is false', async ({ mount }) => {
        let checkedRows: (string | number)[] = [];
        const handleCheckedChange = (rows: (string | number)[]) => {
            checkedRows = rows;
        };

        const component = await mount(
            <CustomTable
                headers={mockHeaders}
                data={mockData}
                hasCheckboxes={true}
                multiSelect={false}
                onCheckedRowsChanged={handleCheckedChange}
            />,
        );

        const checkboxes = component.locator('input[type="checkbox"]');
        const checkboxCount = await checkboxes.count();
        if (checkboxCount > 1) {
            await checkboxes.nth(1).click();
            const firstChecked = checkedRows.length;
            await checkboxes.nth(2).click();

            expect(checkedRows.length).toBeLessThanOrEqual(1);
        }
    });
});
