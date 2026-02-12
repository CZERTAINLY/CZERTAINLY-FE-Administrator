import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { createMockStore } from 'utils/test-helpers';
import KeyStateBadge from './index';
import { KeyState, PlatformEnum } from 'types/openapi';

const keyStateLabels: Record<string, { label: string }> = {
    [KeyState.Active]: { label: 'Active' },
    [KeyState.PreActive]: { label: 'Pre-active' },
    [KeyState.Deactivated]: { label: 'Deactivated' },
    [KeyState.Compromised]: { label: 'Compromised' },
    [KeyState.Destroyed]: { label: 'Destroyed' },
    [KeyState.DestroyedCompromised]: { label: 'Destroyed compromised' },
};

const preloadedState: Parameters<typeof createMockStore>[0] = {
    enums: {
        platformEnums: {
            [PlatformEnum.KeyState]: keyStateLabels,
        },
    },
};

export type KeyStateBadgeWithStoreProps = React.ComponentProps<typeof KeyStateBadge>;

export default function KeyStateBadgeWithStore(props: KeyStateBadgeWithStoreProps) {
    const store = createMockStore(preloadedState as any);
    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
                <KeyStateBadge {...props} />
            </MemoryRouter>
        </Provider>
    );
}
