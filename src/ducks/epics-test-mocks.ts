import { vi } from 'vitest';
import { alertsSlice } from './alert-slice';

export function getEpicMocks() {
    return {
        appStore: {
            dispatch: vi.fn(),
            getState: vi.fn(() => ({})),
        },
        alertActions: {
            error: (message: string) => alertsSlice.actions.error(message),
            success: (message: string) => alertsSlice.actions.success(message),
            info: (message: string) => alertsSlice.actions.info(message),
        },
    };
}
