import { test, expect } from '../../../../../playwright/ct-test';
import KeyStateBadgeWithStore from './KeyStateBadgeWithStore';
import { KeyState } from 'types/openapi';

test.describe('KeyStateBadge', () => {
    test('should render Active badge', async ({ mount }) => {
        const component = await mount(<KeyStateBadgeWithStore state={KeyState.Active} />);
        await expect(component.getByText('Active')).toBeVisible();
    });

    test('should render Pre-active badge', async ({ mount }) => {
        const component = await mount(<KeyStateBadgeWithStore state={KeyState.PreActive} />);
        await expect(component.getByText('Pre-active')).toBeVisible();
    });

    test('should render Compromised badge', async ({ mount }) => {
        const component = await mount(<KeyStateBadgeWithStore state={KeyState.Compromised} />);
        await expect(component.getByText('Compromised')).toBeVisible();
    });

    test('should render unknown state as badge', async ({ mount }) => {
        const component = await mount(<KeyStateBadgeWithStore state={'unknown' as KeyState} />);
        await expect(component.getByText('unknown')).toBeVisible();
    });
});
