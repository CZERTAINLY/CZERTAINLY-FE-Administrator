import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { PlatformEnum, SecretState, SecretType } from 'types/openapi';

export function getSecretStatusColor(status: SecretState): string {
    switch (status) {
        case SecretState.Active:
            return '#14B8A6';
        case SecretState.Inactive:
            return '#1F2937';
        case SecretState.Revoked:
            return '#6B7280';
        case SecretState.Expired:
            return '#9CA3AF';
        case SecretState.Failed:
        case SecretState.Rejected:
            return '#EF4444';
        case SecretState.PendingApproval:
            return '#2798E7';
        default:
            return '#6B7280';
    }
}

export function useGetSecretStatusText() {
    const secretStateEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretState));
    const secretTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretType));

    return useCallback(
        (status: SecretState | SecretType) => {
            if (secretStateEnum?.[status]) return getEnumLabel(secretStateEnum, status);
            if (secretTypeEnum?.[status]) return getEnumLabel(secretTypeEnum, status);
            return 'Unknown';
        },
        [secretStateEnum, secretTypeEnum],
    );
}
