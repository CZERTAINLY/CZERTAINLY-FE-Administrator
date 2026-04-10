import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './users';

describe('users slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            user: { uuid: 'u-1' } as any,
            users: [{ uuid: 'u-1' } as any],
            isFetchingList: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('setUserListCheckedRows and setUserRolesListCheckedRows', () => {
        let next = reducer(initialState, actions.setUserListCheckedRows({ checkedRows: ['u-1', 'u-2'] }));
        expect(next.usersListCheckedRows).toEqual(['u-1', 'u-2']);

        next = reducer(initialState, actions.setUserRolesListCheckedRows({ checkedRows: ['r-1'] }));
        expect(next.userRolesListCheckedRows).toEqual(['r-1']);
    });

    test('clearDeleteErrorMessages', () => {
        const next = reducer({ ...initialState, deleteErrorMessage: 'some error' }, actions.clearDeleteErrorMessages());
        expect(next.deleteErrorMessage).toBe('');
    });

    test('list / success / failure', () => {
        let next = reducer(initialState, actions.list());
        expect(next.isFetchingList).toBe(true);
        expect(next.usersListCheckedRows).toEqual([]);

        const users = [{ uuid: 'u-1' }, { uuid: 'u-2' }] as any[];
        next = reducer(next, actions.listSuccess({ users }));
        expect(next.isFetchingList).toBe(false);
        expect(next.users).toEqual(users);

        next = reducer({ ...next, isFetchingList: true }, actions.listFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getDetail / success updates existing user in list / failure', () => {
        const existing = { uuid: 'u-1', name: 'Alice', enabled: false } as any;

        let next = reducer({ ...initialState, users: [existing] }, actions.getDetail({ uuid: 'u-1' }));
        expect(next.isFetchingDetail).toBe(true);
        expect(next.user).toBeUndefined();
        expect(next.userRoles).toBeUndefined();

        const updated = { uuid: 'u-1', name: 'Alice', enabled: true } as any;
        next = reducer(next, actions.getDetailSuccess({ user: updated }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.user).toEqual(updated);
        expect(next.users.find((u) => u.uuid === 'u-1')).toEqual(updated);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getDetailFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('getDetail success pushes user when not in list', () => {
        const user = { uuid: 'u-new', name: 'Bob' } as any;
        const next = reducer(initialState, actions.getDetailSuccess({ user }));
        expect(next.users).toContainEqual(user);
    });

    test('create / success / failure', () => {
        let next = reducer(initialState, actions.create({ userAddRequest: { username: 'alice' } as any }));
        expect(next.isCreating).toBe(true);
        expect(next.createUserSucceeded).toBe(false);

        const user = { uuid: 'u-1', username: 'alice' } as any;
        next = reducer(next, actions.createSuccess({ user }));
        expect(next.isCreating).toBe(false);
        expect(next.createUserSucceeded).toBe(true);
        expect(next.users).toContainEqual(user);

        next = reducer({ ...next, isCreating: true }, actions.createFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createUserSucceeded).toBe(false);
    });

    test('update / success updates list and user / failure', () => {
        const existing = { uuid: 'u-1', username: 'alice', enabled: false } as any;
        const updated = { uuid: 'u-1', username: 'alice', enabled: true } as any;

        let next = reducer(
            { ...initialState, users: [existing], user: existing },
            actions.update({ uuid: 'u-1', updateUserRequest: {} as any }),
        );
        expect(next.isUpdating).toBe(true);
        expect(next.updateUserSucceeded).toBe(false);

        next = reducer(next, actions.updateSuccess({ user: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateUserSucceeded).toBe(true);
        expect(next.users.find((u) => u.uuid === 'u-1')).toEqual(updated);
        expect(next.user?.enabled).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateUserSucceeded).toBe(false);
    });

    test('deleteUser / success removes from list / failure sets error', () => {
        const items = [{ uuid: 'u-1' } as any, { uuid: 'u-2' } as any];
        const user = { uuid: 'u-1' } as any;

        let next = reducer({ ...initialState, users: items, user }, actions.deleteUser({ uuid: 'u-1' }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteUserSuccess({ uuid: 'u-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.users).toEqual([{ uuid: 'u-2' }]);
        expect(next.user).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteUserFailure({ error: 'delete failed' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('delete failed');
    });

    test('bulkDeleteUsers / success removes only deleted users / failure sets error', () => {
        const items = [{ uuid: 'u-1' } as any, { uuid: 'u-2' } as any, { uuid: 'u-3' } as any];
        const user = { uuid: 'u-2' } as any;

        let next = reducer(
            { ...initialState, users: items, user, usersListCheckedRows: ['u-1', 'u-2'], deleteErrorMessage: 'old error' },
            actions.bulkDeleteUsers({ uuids: ['u-1', 'u-2'] }),
        );
        expect(next.isDeleting).toBe(true);
        expect(next.deleteErrorMessage).toBe('');

        next = reducer(next, actions.bulkDeleteUsersSuccess({ uuids: ['u-1'] }));
        expect(next.isDeleting).toBe(false);
        expect(next.users).toEqual([{ uuid: 'u-2' }, { uuid: 'u-3' }]);
        expect(next.user).toEqual(user);
        expect(next.usersListCheckedRows).toEqual([]);

        next = reducer({ ...next, isDeleting: true }, actions.bulkDeleteUsersFailure({ error: 'bulk delete failed' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('bulk delete failed');
    });

    test('enable / success sets enabled on user and list item / failure', () => {
        const user = { uuid: 'u-1', enabled: false } as any;

        let next = reducer({ ...initialState, users: [user], user }, actions.enable({ uuid: 'u-1' }));
        expect(next.isEnabling).toBe(true);

        next = reducer(next, actions.enableSuccess({ uuid: 'u-1' }));
        expect(next.isEnabling).toBe(false);
        expect(next.users.find((u) => u.uuid === 'u-1')?.enabled).toBe(true);
        expect(next.user?.enabled).toBe(true);

        next = reducer({ ...next, isEnabling: true }, actions.enableFailure({ error: 'err' }));
        expect(next.isEnabling).toBe(false);
    });

    test('disable / success sets enabled=false / failure', () => {
        const user = { uuid: 'u-1', enabled: true } as any;

        let next = reducer({ ...initialState, users: [user], user }, actions.disable({ uuid: 'u-1' }));
        expect(next.isDisabling).toBe(true);

        next = reducer(next, actions.disableSuccess({ uuid: 'u-1' }));
        expect(next.isDisabling).toBe(false);
        expect(next.users.find((u) => u.uuid === 'u-1')?.enabled).toBe(false);
        expect(next.user?.enabled).toBe(false);

        next = reducer({ ...next, isDisabling: true }, actions.disableFailure({ error: 'err' }));
        expect(next.isDisabling).toBe(false);
    });

    test('getRoles / success / failure', () => {
        let next = reducer(initialState, actions.getRoles({ uuid: 'u-1' }));
        expect(next.isFetchingRoles).toBe(true);

        const roles = [{ uuid: 'r-1', name: 'Admin' }] as any[];
        next = reducer(next, actions.getRolesSuccess({ uuid: 'u-1', roles }));
        expect(next.isFetchingRoles).toBe(false);
        expect(next.userRoles).toEqual(roles);

        next = reducer({ ...next, isFetchingRoles: true }, actions.getRolesFailure({ error: 'err' }));
        expect(next.isFetchingRoles).toBe(false);
    });

    test('updateRoles / success updates userRoles and user / failure', () => {
        const user = { uuid: 'u-1', roles: [{ uuid: 'r-1' }] } as any;

        let next = reducer({ ...initialState, user }, actions.updateRoles({ uuid: 'u-1', roles: ['r-1', 'r-2'] }));
        expect(next.isUpdatingRoles).toBe(true);
        expect(next.userRoles).toBeUndefined();

        const updatedUser = { uuid: 'u-1', roles: [{ uuid: 'r-1' }, { uuid: 'r-2' }] } as any;
        next = reducer(next, actions.updateRolesSuccess({ user: updatedUser }));
        expect(next.isUpdatingRoles).toBe(false);
        expect(next.userRoles).toEqual(updatedUser.roles);
        expect(next.user).toEqual(updatedUser);

        next = reducer({ ...next, isUpdatingRoles: true }, actions.updateRolesFailure({ error: 'err' }));
        expect(next.isUpdatingRoles).toBe(false);
    });

    test('addRole / success updates userRoles and user / failure', () => {
        const user = { uuid: 'u-1', roles: [] } as any;

        let next = reducer({ ...initialState, user }, actions.addRole({ uuid: 'u-1', roleUuid: 'r-1' }));
        expect(next.isAddingRole).toBe(true);

        const updatedUser = { uuid: 'u-1', roles: [{ uuid: 'r-1' }] } as any;
        next = reducer(next, actions.addRoleSuccess({ user: updatedUser }));
        expect(next.isAddingRole).toBe(false);
        expect(next.userRoles).toEqual(updatedUser.roles);
        expect(next.user).toEqual(updatedUser);

        next = reducer({ ...next, isAddingRole: true }, actions.addRoleFailure({ error: 'err' }));
        expect(next.isAddingRole).toBe(false);
    });

    test('removeRole / success updates userRoles and user / failure', () => {
        const user = { uuid: 'u-1', roles: [{ uuid: 'r-1' }] } as any;

        let next = reducer({ ...initialState, user }, actions.removeRole({ uuid: 'u-1', roleUuid: 'r-1' }));
        expect(next.isRemovingRole).toBe(true);

        const updatedUser = { uuid: 'u-1', roles: [] } as any;
        next = reducer(next, actions.removeRoleSuccess({ user: updatedUser }));
        expect(next.isRemovingRole).toBe(false);
        expect(next.userRoles).toEqual([]);
        expect(next.user).toEqual(updatedUser);

        next = reducer({ ...next, isRemovingRole: true }, actions.removeRoleFailure({ error: 'err' }));
        expect(next.isRemovingRole).toBe(false);
    });
});

describe('users selectors', () => {
    test('selectors read values from users state', () => {
        const user = { uuid: 'u-1' } as any;
        const roles = [{ uuid: 'r-1' }] as any[];
        const featureState = {
            ...initialState,
            user,
            userRoles: roles,
            users: [user],
            usersListCheckedRows: ['u-1'],
            userRolesListCheckedRows: ['r-1'],
            deleteErrorMessage: 'err',
            isFetchingList: true,
            isFetchingDetail: true,
            isCreating: true,
            createUserSucceeded: true,
            isDeleting: true,
            isUpdating: true,
            updateUserSucceeded: true,
            isEnabling: true,
            isDisabling: true,
            isFetchingRoles: true,
            isUpdatingRoles: true,
            isAddingRole: true,
            isRemovingRole: true,
        };

        const state = { users: featureState } as any;

        expect(selectors.user(state)).toEqual(user);
        expect(selectors.userRoles(state)).toEqual(roles);
        expect(selectors.users(state)).toEqual([user]);
        expect(selectors.usersListCheckedRows(state)).toEqual(['u-1']);
        expect(selectors.userRolesListCheckedRows(state)).toEqual(['r-1']);
        expect(selectors.deleteErrorMessage(state)).toBe('err');
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.createUserSucceeded(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.updateUserSucceeded(state)).toBe(true);
        expect(selectors.isEnabling(state)).toBe(true);
        expect(selectors.isDisabling(state)).toBe(true);
        expect(selectors.isFetchingRoles(state)).toBe(true);
        expect(selectors.isUpdatingRoles(state)).toBe(true);
        expect(selectors.isAddingRole(state)).toBe(true);
        expect(selectors.isRemovingRole(state)).toBe(true);
    });
});
