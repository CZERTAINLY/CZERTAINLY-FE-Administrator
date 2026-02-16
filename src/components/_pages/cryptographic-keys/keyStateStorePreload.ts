import { KeyState, PlatformEnum } from 'types/openapi';
import { slice as enumsSlice } from 'ducks/enums';

export const keyStateLabels: Record<string, { label: string }> = {
    [KeyState.Active]: { label: 'Active' },
    [KeyState.PreActive]: { label: 'Pre-active' },
    [KeyState.Deactivated]: { label: 'Deactivated' },
    [KeyState.Compromised]: { label: 'Compromised' },
    [KeyState.Destroyed]: { label: 'Destroyed' },
    [KeyState.DestroyedCompromised]: { label: 'Destroyed compromised' },
};

export const keyStatePreloadedState = {
    [enumsSlice.name]: {
        platformEnums: {
            [PlatformEnum.KeyState]: keyStateLabels,
        },
    },
};
