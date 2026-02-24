import { test, expect } from '../../../../../playwright/ct-test';
import KeyStateCircleWithStore from './KeyStateCircleWithStore';
import { KeyState } from 'types/openapi';

test.describe('KeyStateCircle', () => {
    test('should render circle with title for Active', async ({ mount, page }) => {
        await mount(<KeyStateCircleWithStore state={KeyState.Active} />);
        const circle = page.getByTitle('Active');
        await expect(circle).toBeAttached();
        await expect(circle).toHaveAttribute('title', 'Active');
    });

    test('should render circle for Compromised', async ({ mount, page }) => {
        await mount(<KeyStateCircleWithStore state={KeyState.Compromised} />);
        const circle = page.getByTitle('Compromised');
        await expect(circle).toBeAttached();
        await expect(circle).toHaveAttribute('title', 'Compromised');
    });

    test('should render circle for unknown state', async ({ mount, page }) => {
        await mount(<KeyStateCircleWithStore state={'unknown' as KeyState} />);
        const circle = page.getByTitle('unknown');
        await expect(circle).toBeAttached();
    });
});
