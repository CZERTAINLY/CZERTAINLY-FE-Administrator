import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './roles';

describe('roles slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            role: { uuid: 'r-1' } as any,
            roles: [{ uuid: 'r-1' } as any],
            isFetchingList: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('setRolesListCheckedRows and setPermissionsListCheckedRows', () => {
        let next = reducer(initialState, actions.setRolesListCheckedRows({ checkedRows: ['r-1', 'r-2'] }));
        expect(next.rolesListCheckedRows).toEqual(['r-1', 'r-2']);

        next = reducer(initialState, actions.setPermissionsListCheckedRows({ checkedRows: ['p-1'] }));
        expect(next.permissionsListCheckedRows).toEqual(['p-1']);
    });

    test('clearDeleteErrorMessages', () => {
        const next = reducer({ ...initialState, deleteErrorMessage: 'some error' }, actions.clearDeleteErrorMessages());
        expect(next.deleteErrorMessage).toBe('');
    });

    test('list / success / failure', () => {
        let next = reducer(initialState, actions.list());
        expect(next.isFetchingList).toBe(true);
        expect(next.rolesListCheckedRows).toEqual([]);

        const roles = [{ uuid: 'r-1' }, { uuid: 'r-2' }] as any[];
        next = reducer(next, actions.listSuccess({ roles }));
        expect(next.isFetchingList).toBe(false);
        expect(next.roles).toEqual(roles);

        next = reducer({ ...next, isFetchingList: true }, actions.listFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getDetail / success / failure', () => {
        let next = reducer(initialState, actions.getDetail({ uuid: 'r-1' }));
        expect(next.isFetchingDetail).toBe(true);
        expect(next.permissionsListCheckedRows).toEqual([]);

        const role = { uuid: 'r-1', name: 'Admin' } as any;
        next = reducer(next, actions.getDetailSuccess({ role }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.role).toEqual(role);

        next = reducer({ ...next, isFetchingDetail: true, role }, actions.getDetailFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.role).toBeUndefined();
    });

    test('create / success / failure', () => {
        let next = reducer(initialState, actions.create({ name: 'Admin' } as any));
        expect(next.isCreating).toBe(true);
        expect(next.createRoleSucceeded).toBe(false);

        const role = { uuid: 'r-1', name: 'Admin' } as any;
        next = reducer(next, actions.createSuccess({ role }));
        expect(next.isCreating).toBe(false);
        expect(next.createRoleSucceeded).toBe(true);
        expect(next.roles).toContainEqual(role);

        next = reducer({ ...next, isCreating: true }, actions.createFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createRoleSucceeded).toBe(false);
    });

    test('update / success updates list and role / failure', () => {
        const existing = { uuid: 'r-1', name: 'Admin' } as any;
        const updated = { uuid: 'r-1', name: 'SuperAdmin' } as any;

        let next = reducer(
            { ...initialState, roles: [existing], role: existing },
            actions.update({ uuid: 'r-1', roleRequest: { name: 'SuperAdmin' } as any }),
        );
        expect(next.isUpdating).toBe(true);
        expect(next.updateRoleSucceeded).toBe(false);

        next = reducer(next, actions.updateSuccess({ role: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateRoleSucceeded).toBe(true);
        expect(next.roles).toEqual([updated]);
        expect(next.role).toEqual(updated);

        next = reducer({ ...next, isUpdating: true }, actions.updateFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateRoleSucceeded).toBe(false);
    });

    test('delete / success removes from list and clears role / failure', () => {
        const items = [{ uuid: 'r-1' } as any, { uuid: 'r-2' } as any];
        const role = { uuid: 'r-1', name: 'Admin' } as any;

        let next = reducer({ ...initialState, roles: items, role }, actions.delete({ uuid: 'r-1' }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteSuccess({ uuid: 'r-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.roles).toEqual([{ uuid: 'r-2' }]);
        expect(next.role).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });

    test('getUsers / success updates role users / failure', () => {
        const role = { uuid: 'r-1', name: 'Admin', users: [] } as any;

        let next = reducer({ ...initialState, role }, actions.getUsers({ uuid: 'r-1' }));
        expect(next.isFetchingUsers).toBe(true);

        const users = [{ uuid: 'u-1' }] as any[];
        next = reducer(next, actions.getUsersSuccess({ uuid: 'r-1', users }));
        expect(next.isFetchingUsers).toBe(false);
        expect(next.role?.users).toEqual(users);

        next = reducer({ ...next, isFetchingUsers: true }, actions.getUsersFailure({ error: 'err' }));
        expect(next.isFetchingUsers).toBe(false);
    });

    test('updateUsers / success updates role users / failure', () => {
        const role = { uuid: 'r-1', name: 'Admin', users: [] } as any;

        let next = reducer({ ...initialState, role }, actions.updateUsers({ uuid: 'r-1', users: ['u-1'] }));
        expect(next.isUpdatingUsers).toBe(true);

        const updatedRole = { uuid: 'r-1', name: 'Admin', users: [{ uuid: 'u-1' }] } as any;
        next = reducer(next, actions.updateUsersSuccess({ role: updatedRole }));
        expect(next.isUpdatingUsers).toBe(false);
        expect(next.role?.users).toEqual(updatedRole.users);

        next = reducer({ ...next, isUpdatingUsers: true }, actions.updateUsersFailure({ error: 'err' }));
        expect(next.isUpdatingUsers).toBe(false);
    });

    test('getPermissions / success / failure', () => {
        let next = reducer(initialState, actions.getPermissions({ uuid: 'r-1' }));
        expect(next.isFetchingPermissions).toBe(true);
        expect(next.rolePermissions).toBeUndefined();

        const permissions = { allowAllResources: true, resources: [] } as any;
        next = reducer(next, actions.getPermissionsSuccess({ uuid: 'r-1', permissions }));
        expect(next.isFetchingPermissions).toBe(false);
        expect(next.rolePermissions).toEqual({ uuid: 'r-1', permissions });

        next = reducer({ ...next, isFetchingPermissions: true }, actions.getPermissionsFailure({ error: 'err' }));
        expect(next.isFetchingPermissions).toBe(false);
        expect(next.rolePermissions).toBeUndefined();
    });

    test('updatePermissions / success updates rolePermissions / failure', () => {
        const perms = { allowAllResources: false, resources: [] } as any;

        let next = reducer(
            { ...initialState, rolePermissions: { uuid: 'r-1', permissions: perms } },
            actions.updatePermissions({ uuid: 'r-1', permissions: {} as any }),
        );
        expect(next.isUpdatingPermissions).toBe(true);

        const updated = { allowAllResources: true, resources: [] } as any;
        next = reducer(next, actions.updatePermissionsSuccess({ uuid: 'r-1', permissions: updated }));
        expect(next.isUpdatingPermissions).toBe(false);
        expect(next.rolePermissions?.permissions).toEqual(updated);

        next = reducer({ ...next, isUpdatingPermissions: true }, actions.updatePermissionsFailure({ error: 'err' }));
        expect(next.isUpdatingPermissions).toBe(false);
    });
});

describe('roles selectors', () => {
    test('selectors read values from roles state', () => {
        const role = { uuid: 'r-1', name: 'Admin' } as any;
        const perms = { uuid: 'r-1', permissions: { allowAllResources: true, resources: [] } as any };
        const featureState = {
            ...initialState,
            role,
            roles: [role],
            rolePermissions: perms,
            rolesListCheckedRows: ['r-1'],
            permissionsListCheckedRows: ['p-1'],
            deleteErrorMessage: 'some error',
            isFetchingList: true,
            isFetchingDetail: true,
            isFetchingPermissions: true,
            isFetchingUsers: true,
            isCreating: true,
            createRoleSucceeded: true,
            isDeleting: true,
            isUpdating: true,
            updateRoleSucceeded: true,
            isUpdatingUsers: true,
            isUpdatingPermissions: true,
        };

        const state = { roles: featureState } as any;

        expect(selectors.role(state)).toEqual(role);
        expect(selectors.roles(state)).toEqual([role]);
        expect(selectors.permissions(state)).toEqual(perms);
        expect(selectors.rolesListCheckedRows(state)).toEqual(['r-1']);
        expect(selectors.permissionsListCheckedRows(state)).toEqual(['p-1']);
        expect(selectors.deleteErrorMessage(state)).toBe('some error');
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isFetchingPermissions(state)).toBe(true);
        expect(selectors.isFetchingUsers(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.createRoleSucceeded(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.updateRoleSucceeded(state)).toBe(true);
        expect(selectors.isUpdatingUsers(state)).toBe(true);
        expect(selectors.isUpdatingPermissions(state)).toBe(true);
    });
});
