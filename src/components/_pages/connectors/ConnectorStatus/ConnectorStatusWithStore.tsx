import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { createMockStore } from 'utils/test-helpers';
import InventoryStatusBadge from './index';
import { ConnectorStatus, PlatformEnum } from 'types/openapi';
import { slice as enumsSlice } from 'ducks/enums';

const connectorStatusLabels: Record<string, { label: string }> = {
    [ConnectorStatus.Connected]: { label: 'Connected' },
    [ConnectorStatus.Failed]: { label: 'Failed' },
    [ConnectorStatus.Offline]: { label: 'Offline' },
    [ConnectorStatus.WaitingForApproval]: { label: 'Waiting for approval' },
};

const preloadedState = {
    [enumsSlice.name]: {
        platformEnums: {
            [PlatformEnum.ConnectorStatus]: connectorStatusLabels,
        },
    },
};

export type ConnectorStatusWithStoreProps = React.ComponentProps<typeof InventoryStatusBadge>;

export default function ConnectorStatusWithStore(props: ConnectorStatusWithStoreProps) {
    const store = createMockStore(preloadedState as any);
    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
                <InventoryStatusBadge {...props} />
            </MemoryRouter>
        </Provider>
    );
}
