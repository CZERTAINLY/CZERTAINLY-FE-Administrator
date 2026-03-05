import { test, expect } from '../../playwright/ct-test';
import CbomCoverageRunner from './CbomCoverageRunner';

test.describe('cbom browser coverage', () => {
    test('runs CBOM reducers, transforms and epics in browser context for coverage', async ({ mount, page }) => {
        await mount(<CbomCoverageRunner />);
        await expect(page.getByTestId('cbom-coverage-done')).toBeAttached();
    });
});
