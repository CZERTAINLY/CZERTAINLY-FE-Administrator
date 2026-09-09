import { describe, expect, test } from 'vitest';
import type { TokenProfileResponseModel } from 'types/token-profiles';
import { getCommonTokenInstanceUuid } from './index';

describe('getCommonTokenInstanceUuid', () => {
    const tokenProfiles = [
        { uuid: 'profile-1', tokenInstanceUuid: 'token-1' },
        { uuid: 'profile-2', tokenInstanceUuid: 'token-1' },
        { uuid: 'profile-3', tokenInstanceUuid: 'token-2' },
    ] as TokenProfileResponseModel[];

    test('returnsTokenInstance_forProfilesOnTheSameTokenInstance', () => {
        // given
        const selectedProfileUuids = ['profile-1', 'profile-2'];

        // when
        const tokenInstanceUuid = getCommonTokenInstanceUuid(selectedProfileUuids, tokenProfiles);

        // then
        expect(tokenInstanceUuid).toBe('token-1');
    });

    test('returnsUndefined_forProfilesOnDifferentTokenInstances', () => {
        // given
        const selectedProfileUuids = ['profile-1', 'profile-3'];

        // when
        const tokenInstanceUuid = getCommonTokenInstanceUuid(selectedProfileUuids, tokenProfiles);

        // then
        expect(tokenInstanceUuid).toBeUndefined();
    });
});
