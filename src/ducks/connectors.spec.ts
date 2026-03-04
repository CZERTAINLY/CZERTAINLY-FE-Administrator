import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './connectors';
import { ConnectorStatus } from 'types/openapi';

describe('connectors slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values and clears unknown keys', () => {
        const dirtyState = {
            ...initialState,
            connectors: [{ uuid: 'c-1' }],
            connector: { uuid: 'detail-1' } as any,
            connectorHealth: { status: 'Up' } as any,
            isFetchingList: true,
            isCreating: true,
            tempOnlyKey: 'to-be-removed',
        } as any;

        const next = reducer(dirtyState, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempOnlyKey).toBeUndefined();
    });

    test('listConnectors / success / failure update list flags and data', () => {
        let next = reducer(initialState, actions.listConnectors({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any));
        expect(next.isFetchingList).toBe(true);
        expect(next.connectors).toEqual([]);
        expect(next.checkedRows).toEqual([]);

        const connectorList = [{ uuid: 'c-1' }, { uuid: 'c-2' }] as any[];
        next = reducer(next, actions.listConnectorsSuccess({ connectorList }));
        expect(next.isFetchingList).toBe(false);
        expect(next.connectors).toEqual(connectorList);

        next = reducer({ ...next, isFetchingList: true }, actions.listConnectorsFailure());
        expect(next.isFetchingList).toBe(false);
    });

    test('listConnectorsMerge / success / failure merges by uuid without clearing existing list', () => {
        const existing = [{ uuid: 'c-1', name: 'Old' }] as any[];
        let next = reducer({ ...initialState, connectors: existing }, actions.listConnectorsMerge({}));
        expect(next.isFetchingList).toBe(true);

        const incoming = [
            { uuid: 'c-1', name: 'Updated' },
            { uuid: 'c-2', name: 'New' },
        ] as any[];
        next = reducer(next, actions.listConnectorsMergeSuccess({ connectorList: incoming }));

        expect(next.isFetchingList).toBe(false);
        expect(next.connectors).toHaveLength(2);
        expect(next.connectors.find((c) => c.uuid === 'c-1')!.name).toBe('Updated');
        expect(next.connectors.find((c) => c.uuid === 'c-2')).toBeDefined();

        next = reducer({ ...next, isFetchingList: true }, actions.listConnectorsMergeFailure());
        expect(next.isFetchingList).toBe(false);
    });

    test('getConnectorDetail / success / failure updates connector and flags', () => {
        let next = reducer(
            { ...initialState, connector: { uuid: 'old' } as any, connectorHealth: {} as any },
            actions.getConnectorDetail({ uuid: 'c-1' }),
        );
        expect(next.connector).toBeUndefined();
        expect(next.connectorHealth).toBeUndefined();
        expect(next.isFetchingDetail).toBe(true);

        const detail = { uuid: 'c-1', name: 'Detail' } as any;
        next = reducer(next, actions.getConnectorDetailSuccess({ connector: detail }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.connector).toEqual(detail);
        expect(next.connectors).toContainEqual(detail);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getConnectorDetailFailure());
        expect(next.isFetchingDetail).toBe(false);
    });

    test('getConnectorHealth / success / failure updates health and flags', () => {
        let next = reducer({ ...initialState, connectorHealth: { status: 'Old' } as any }, actions.getConnectorHealth({ uuid: 'c-1' }));
        expect(next.connectorHealth).toBeUndefined();
        expect(next.isFetchingHealth).toBe(true);

        const health = { status: 'Up' } as any;
        next = reducer(next, actions.getConnectorHealthSuccess({ health }));
        expect(next.isFetchingHealth).toBe(false);
        expect(next.connectorHealth).toEqual(health);

        next = reducer({ ...next, isFetchingHealth: true }, actions.getConnectorHealthFailure());
        expect(next.isFetchingHealth).toBe(false);
    });

    test('createConnector / success / failure updates list and flags', () => {
        const connector = { uuid: 'c-1', name: 'New' } as any;

        let next = reducer(initialState, actions.createConnector({ name: 'New' } as any));
        expect(next.isCreating).toBe(true);

        next = reducer(next, actions.createConnectorSuccess({ connector }));
        expect(next.isCreating).toBe(false);
        expect(next.connectors).toContainEqual(connector);
        expect(next.connector).toEqual(connector);

        next = reducer({ ...next, isCreating: true }, actions.createConnectorFailure());
        expect(next.isCreating).toBe(false);
    });

    test('deleteConnector / success / failure updates list, detail and error message', () => {
        const connector = { uuid: 'c-1' } as any;
        let next = reducer(
            {
                ...initialState,
                connectors: [connector],
                connector,
                connectorHealth: {} as any,
                connectorAttributes: {} as any,
                connectorConnectionDetails: [] as any,
            },
            actions.deleteConnector({ uuid: 'c-1' }),
        );

        expect(next.isDeleting).toBe(true);
        expect(next.deleteErrorMessage).toBe('');

        next = reducer(next, actions.deleteConnectorSuccess({ uuid: 'c-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.connectors).toEqual([]);
        expect(next.connector).toBeUndefined();
        expect(next.connectorHealth).toBeUndefined();
        expect(next.connectorAttributes).toBeUndefined();
        expect(next.connectorConnectionDetails).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteConnectorFailure({ error: 'failed' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('failed');
    });

    test('bulkDeleteConnectors / success / failure updates list or error messages', () => {
        const connectors = [{ uuid: 'c-1' } as any, { uuid: 'c-2' } as any, { uuid: 'c-3' } as any];

        let next = reducer({ ...initialState, connectors }, actions.bulkDeleteConnectors({ uuids: ['c-1', 'c-2'] }));
        expect(next.isBulkDeleting).toBe(true);
        expect(next.bulkDeleteErrorMessages).toEqual([]);

        // With errors: list should remain untouched and errors populated
        next = reducer(next, actions.bulkDeleteConnectorsSuccess({ uuids: ['c-1', 'c-2'], errors: [{ code: 'E', message: 'x' } as any] }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.connectors).toHaveLength(3);
        expect(next.bulkDeleteErrorMessages).toHaveLength(1);

        // Without errors: targeted uuids should be removed
        next = reducer({ ...initialState, connectors }, actions.bulkDeleteConnectorsSuccess({ uuids: ['c-1', 'c-2'], errors: [] }));
        expect(next.connectors).toHaveLength(1);
        expect(next.connectors[0].uuid).toBe('c-3');

        next = reducer({ ...next, isBulkDeleting: true }, actions.bulkDeleteConnectorsFailure());
        expect(next.isBulkDeleting).toBe(false);
    });

    test('authorizeConnector / success / failure updates flags and status', () => {
        let next = reducer(initialState, actions.authorizeConnector({ uuid: 'c-1' }));
        expect(next.isAuthorizing).toBe(true);

        next = reducer(
            {
                ...next,
                connector: { uuid: 'c-1', status: ConnectorStatus.WaitingForApproval } as any,
            },
            actions.authorizeConnectorSuccess({ uuid: 'c-1' }),
        );
        expect(next.isAuthorizing).toBe(false);
        expect(next.connector!.status).toBe(ConnectorStatus.Connected);

        next = reducer({ ...next, isAuthorizing: true }, actions.authorizeConnectorFailure());
        expect(next.isAuthorizing).toBe(false);
    });
});

describe('connectors selectors', () => {
    test('selectors read values from connectors state', () => {
        const connectorsState = {
            ...initialState,
            checkedRows: ['c-1'],
            connectors: [{ uuid: 'c-1' } as any],
            connector: { uuid: 'c-1' } as any,
            connectorHealth: { status: 'Up' } as any,
            connectorAttributes: { group: 'g' } as any,
            connectorConnectionDetails: [{ code: 'FG' }] as any,
            connectInfo: [{ foo: 'bar' }],
            connectorInfoV2: { info: true },
            deleteErrorMessage: 'err',
            bulkDeleteErrorMessages: [{ code: 'E' } as any],
            isFetchingList: true,
            isFetchingDetail: true,
            isFetchingHealth: true,
            isFetchingAttributes: true,
            isFetchingAllAttributes: true,
            isCreating: true,
            isDeleting: true,
            isBulkDeleting: true,
            isBulkForceDeleting: true,
            isUpdating: true,
            isConnecting: true,
            isReconnecting: true,
            isBulkReconnecting: true,
            isAuthorizing: true,
            isBulkAuthorizing: true,
            isRunningCallback: { cb: true },
            callbackData: { cb: { result: 'ok' } },
        } as any;

        const state = { connectors: connectorsState } as any;

        expect(selectors.checkedRows(state)).toEqual(['c-1']);
        expect(selectors.connectors(state)).toEqual(connectorsState.connectors);
        expect(selectors.connector(state)).toEqual(connectorsState.connector);
        expect(selectors.connectorHealth(state)).toEqual(connectorsState.connectorHealth);
        expect(selectors.connectorAttributes(state)).toEqual(connectorsState.connectorAttributes);
        expect(selectors.connectorConnectionDetails(state)).toEqual(connectorsState.connectorConnectionDetails);
        expect(selectors.connectorConnectInfo(state)).toEqual(connectorsState.connectInfo);
        expect(selectors.connectorInfoV2(state)).toEqual(connectorsState.connectorInfoV2);
        expect(selectors.callbackData(state)).toEqual(connectorsState.callbackData);
        expect(selectors.deleteErrorMessage(state)).toBe('err');
        expect(selectors.bulkDeleteErrorMessages(state)).toEqual(connectorsState.bulkDeleteErrorMessages);
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isFetchingHealth(state)).toBe(true);
        expect(selectors.isFetchingAttributes(state)).toBe(true);
        expect(selectors.isFetchingAllAttributes(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isBulkDeleting(state)).toBe(true);
        expect(selectors.isBulkForceDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.isConnecting(state)).toBe(true);
        expect(selectors.isBulkConnecting(state)).toBe(true);
        expect(selectors.isReconnecting(state)).toBe(true);
        expect(selectors.isBulkReconnecting(state)).toBe(true);
        expect(selectors.isAuthorizing(state)).toBe(true);
        expect(selectors.isBulkAuthorizing(state)).toBe(true);
        expect(selectors.isRunningCallback(state)).toEqual({ cb: true });
    });
});
