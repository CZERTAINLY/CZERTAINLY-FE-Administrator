import { describe, expect, test } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { AjaxError } from 'rxjs/ajax';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions } from './certificateGroups';
import { actions as userInterfaceActions } from './user-interface';
import { LockTypeEnum, LockWidgetNameEnum } from 'types/user-interface';

const GET_GROUP_USERS_EPIC_INDEX = 2;

async function runGetGroupUsersEpic(getGroupUsers: (args: { uuid: string }) => unknown, takeCount = 2): Promise<UnknownAction[]> {
    const { default: epics } = await import('./certificateGroups-epics');
    const epic = epics[GET_GROUP_USERS_EPIC_INDEX];
    const deps = { apiClients: { certificateGroups: { getGroupUsers } } };
    const output$ = epic(of(actions.getGroupUsers({ uuid: 'g1' })), of({}) as never, deps as never);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

function forbidden(): AjaxError {
    return new AjaxError('forbidden', { status: 403, response: { code: 'ACCESS_DENIED', message: 'Access denied' } } as never, {} as never);
}

describe('certificateGroups epics: getGroupUsers', () => {
    test('emits the transformed members and clears the GroupUsers lock', async () => {
        const emitted = await runGetGroupUsersEpic(({ uuid }) => {
            expect(uuid).toBe('g1');
            return of([
                { uuid: 'u1', name: 'alice' },
                { uuid: 'u2', name: 'bob' },
            ]);
        });

        expect(emitted[0]).toEqual(
            actions.getGroupUsersSuccess({
                uuid: 'g1',
                users: [
                    { uuid: 'u1', name: 'alice' },
                    { uuid: 'u2', name: 'bob' },
                ],
            }),
        );
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.GroupUsers));
    });

    test('emits failure and locks only the GroupUsers widget when the call is refused', async () => {
        const emitted = await runGetGroupUsersEpic(() => throwError(() => forbidden()));

        expect(emitted[0].type).toBe(actions.getGroupUsersFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload).toMatchObject({
            widgetName: LockWidgetNameEnum.GroupUsers,
            lockType: LockTypeEnum.PERMISSION,
        });
    });
});
