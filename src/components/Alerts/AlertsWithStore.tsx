import { Provider } from 'react-redux';
import { createMockStore } from 'utils/test-helpers';
import Alerts from './index';
import { alertsSlice } from 'ducks/alert-slice';
import type { MessageModel } from 'types/alerts';

export type AlertsWithStoreProps = {
    preloadedState?: Parameters<typeof createMockStore>[0];
};

const defaultPreloadedState: Parameters<typeof createMockStore>[0] = {
    [alertsSlice.name]: {
        messages: [],
        msgId: 0,
    },
};

function AlertsWithStore({ preloadedState }: AlertsWithStoreProps) {
    const store = createMockStore(preloadedState ?? defaultPreloadedState);
    return (
        <Provider store={store}>
            <Alerts />
        </Provider>
    );
}
export default AlertsWithStore;

export function createAlertMessage(overrides: Partial<MessageModel> = {}): MessageModel {
    return {
        id: 0,
        message: 'Test message',
        time: Date.now(),
        color: 'success',
        ...overrides,
    };
}
