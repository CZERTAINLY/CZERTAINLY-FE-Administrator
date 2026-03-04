import { describe, expect, test, vi } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import connectorsEpics from './connectors-epic';
import { slice } from './connectors';
import { actions as userInterfaceActions } from './user-interface';
import { actions as appRedirectActions } from './app-redirect';
import { alertsSlice } from './alert-slice';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { LockWidgetNameEnum } from 'types/user-interface';

vi.mock('./alerts', () => ({
    actions: {
        error: (message: string) => alertsSlice.actions.error(message),
        success: (message: string) => alertsSlice.actions.success(message),
        info: (message: string) => alertsSlice.actions.info(message),
    },
}));

type EpicDeps = {
    apiClients: {
        connectorsV2: {
            listConnectorsV2: (args: any) => any;
            getConnectorV2: (args: any) => any;
            getInfoV2: (args: any) => any;
            checkHealthV2: (args: any) => any;
            createConnectorV2: (args: any) => any;
            editConnectorV2: (args: any) => any;
            deleteConnectorV2: (args: any) => any;
            bulkDeleteConnectorV2: (args: any) => any;
            connectV2: (args: any) => any;
            reconnectV2: (args: any) => any;
            bulkReconnectV2: (args: any) => any;
            approveV2: (args: any) => any;
            bulkApproveV2: (args: any) => any;
        };
        connectors: {
            listConnectors: (args: any) => any;
            getAttributes: (args: any) => any;
            getAttributesAll: (args: any) => any;
            forceDeleteConnector: (args: any) => any;
        };
        callback: {
            callback: (args: any) => any;
            resourceCallback: (args: any) => any;
        };
    };
};

function createDeps(overrides: Partial<EpicDeps['apiClients']> = {}): EpicDeps {
    return {
        apiClients: {
            connectorsV2: {
                listConnectorsV2: () => of({ items: [], totalItems: 0, pageNumber: 1, itemsPerPage: 10, totalPages: 0 }),
                getConnectorV2: () => of({ uuid: 'conn-1' }),
                getInfoV2: () => of({ uuid: 'conn-1', info: true }),
                checkHealthV2: () => of({ status: 'Up' }),
                createConnectorV2: () => of({ uuid: 'created-1' }),
                editConnectorV2: () => of({ uuid: 'edited-1' }),
                deleteConnectorV2: () => of(null),
                bulkDeleteConnectorV2: () => of([]),
                connectV2: () => of([]),
                reconnectV2: () => of({}),
                bulkReconnectV2: () => of(null),
                approveV2: () => of(null),
                bulkApproveV2: () => of(null),
                ...(overrides.connectorsV2 || {}),
            },
            connectors: {
                listConnectors: () => of([]),
                getAttributes: () => of([]),
                getAttributesAll: () => of({}),
                forceDeleteConnector: () => of(null),
                ...(overrides.connectors || {}),
            },
            callback: {
                callback: () => of({}),
                resourceCallback: () => of({}),
                ...(overrides.callback || {}),
            },
        },
    };
}

describe('connectors epics', () => {
    test('listConnectors success emits listConnectorsSuccess, paging listSuccess and removeWidgetLock', async () => {
        const searchRequest = { pageNumber: 1, itemsPerPage: 10, filters: [] } as any;
        const response = {
            items: [{ uuid: 'conn-1' }],
            totalItems: 1,
            pageNumber: 1,
            itemsPerPage: 10,
            totalPages: 1,
        } as any;

        const deps = createDeps({
            connectorsV2: {
                listConnectorsV2: ({ searchRequestDto }: { searchRequestDto: any }) => {
                    expect(searchRequestDto.pageNumber).toBe(searchRequest.pageNumber);
                    return of(response);
                },
            } as any,
        });

        const epic = connectorsEpics[0] as any;
        const output$ = epic(of(slice.actions.listConnectors(searchRequest)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(3), toArray()))) as any[];

        expect(emitted[0].type).toBe(slice.actions.listConnectorsSuccess.type);
        expect(emitted[1]).toEqual(pagingActions.listSuccess({ entity: EntityType.CONNECTOR, totalItems: response.totalItems }));
        expect(emitted[2]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorStore));
    });

    test('listConnectors failure emits listConnectorsFailure, paging listFailure and insertWidgetLock', async () => {
        const deps = createDeps({
            connectorsV2: {
                listConnectorsV2: () => throwError(() => new Error('list failed')),
            } as any,
        });

        const epic = connectorsEpics[0] as any;
        const output$ = epic(
            of(slice.actions.listConnectors({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any)),
            of({}) as any,
            deps as any,
        );
        const emitted = (await firstValueFrom(output$.pipe(take(3), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.listConnectorsFailure());
        expect(emitted[1]).toEqual(pagingActions.listFailure(EntityType.CONNECTOR));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[2].payload.widgetName).toBe(LockWidgetNameEnum.ConnectorStore);
    });

    test('listConnectorsMerge success emits merge success and removeWidgetLock', async () => {
        const epic = connectorsEpics[1] as any;
        const deps = createDeps();
        const output$ = epic(of(slice.actions.listConnectorsMerge({ functionGroup: 'FG' } as any)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0].type).toBe(slice.actions.listConnectorsMergeSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorStore));
    });

    test('listConnectorsMerge failure emits merge failure and insertWidgetLock', async () => {
        const deps = createDeps({
            connectors: {
                listConnectors: () => throwError(() => new Error('merge failed')),
            } as any,
        });

        const epic = connectorsEpics[1] as any;
        const output$ = epic(of(slice.actions.listConnectorsMerge({} as any)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.listConnectorsMergeFailure());
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload.widgetName).toBe(LockWidgetNameEnum.ConnectorStore);
    });

    test('getConnectorDetail success emits getConnectorDetailSuccess and removeWidgetLock', async () => {
        const uuid = 'conn-1';
        const detail = {
            uuid,
            name: 'Detail',
            url: 'https://example.com',
            status: 'Connected',
            version: 'V2',
            authType: 'None',
            interfaces: [],
            functionGroups: [],
            authAttributes: [],
            customAttributes: [],
        } as any;

        const deps = createDeps({
            connectorsV2: {
                getConnectorV2: ({ uuid: value }: { uuid: any }) => {
                    expect(value).toBe(uuid);
                    return of(detail);
                },
            } as any,
        });

        const epic = connectorsEpics[2] as any;
        const output$ = epic(of(slice.actions.getConnectorDetail({ uuid })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0].type).toBe(slice.actions.getConnectorDetailSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorDetails));
    });

    test('getConnectorDetail failure emits getConnectorDetailFailure and insertWidgetLock', async () => {
        const deps = createDeps({
            connectorsV2: {
                getConnectorV2: () => throwError(() => new Error('detail failed')),
            } as any,
        });

        const epic = connectorsEpics[2] as any;
        const output$ = epic(of(slice.actions.getConnectorDetail({ uuid: 'x' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.getConnectorDetailFailure());
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload.widgetName).toBe(LockWidgetNameEnum.ConnectorDetails);
    });

    test('getConnectorHealth success emits getConnectorHealthSuccess', async () => {
        const healthInfo = { status: 'Up' } as any;

        const deps = createDeps({
            connectorsV2: {
                checkHealthV2: ({ uuid }: { uuid: any }) => {
                    expect(uuid).toBe('conn-1');
                    return of(healthInfo);
                },
            } as any,
        });

        const epic = connectorsEpics[5] as any;
        const output$ = epic(of(slice.actions.getConnectorHealth({ uuid: 'conn-1' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted[0].type).toBe(slice.actions.getConnectorHealthSuccess.type);
        expect(emitted[0].payload.health.status).toBe('Up');
    });

    test('createConnector success emits createConnectorSuccess and redirect', async () => {
        const created = {
            uuid: 'created-1',
            name: 'Created',
            url: 'https://example.com',
            status: 'Connected',
            version: 'V2',
            authType: 'None',
            interfaces: [],
            functionGroups: [],
            authAttributes: [],
            customAttributes: [],
        } as any;

        const deps = createDeps({
            connectorsV2: {
                createConnectorV2: ({ connectorRequestDtoV2 }: { connectorRequestDtoV2: any }) => {
                    expect(connectorRequestDtoV2).toBeDefined();
                    return of(created);
                },
            } as any,
        });

        const epic = connectorsEpics[6] as any;
        const payload = { name: 'New', url: 'https://example.com' } as any;
        const output$ = epic(of(slice.actions.createConnector(payload)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0].type).toBe(slice.actions.createConnectorSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: `../connectors/detail/${created.uuid}` }));
    });

    test('createConnector failure emits createConnectorFailure and fetchError', async () => {
        const err = new Error('create failed');
        const deps = createDeps({
            connectorsV2: {
                createConnectorV2: () => throwError(() => err),
            } as any,
        });

        const epic = connectorsEpics[6] as any;
        const output$ = epic(of(slice.actions.createConnector({ name: 'New' } as any)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.createConnectorFailure());
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create connector' }));
    });

    test('deleteConnector success emits deleteConnectorSuccess and redirect', async () => {
        const deps = createDeps({
            connectorsV2: {
                deleteConnectorV2: ({ uuid }: { uuid: any }) => {
                    expect(uuid).toBe('conn-1');
                    return of(null);
                },
            } as any,
        });

        const epic = connectorsEpics[8] as any;
        const output$ = epic(of(slice.actions.deleteConnector({ uuid: 'conn-1' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.deleteConnectorSuccess({ uuid: 'conn-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../../connectors' }));
    });

    test('deleteConnector failure emits deleteConnectorFailure and fetchError', async () => {
        const err = new Error('delete failed');
        const deps = createDeps({
            connectorsV2: {
                deleteConnectorV2: () => throwError(() => err),
            } as any,
        });

        const epic = connectorsEpics[8] as any;
        const output$ = epic(of(slice.actions.deleteConnector({ uuid: 'conn-1' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.deleteConnectorFailure({ error: 'Failed to delete connector. delete failed' }));
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete connector' }));
    });

    test('bulkDeleteConnectors success emits bulkDeleteConnectorsSuccess and success alert', async () => {
        const errors = [{ code: 'E', message: 'x' }] as any[];

        const deps = createDeps({
            connectorsV2: {
                bulkDeleteConnectorV2: ({ requestBody }: { requestBody: any }) => {
                    expect(requestBody).toEqual(['c-1', 'c-2']);
                    return of(errors);
                },
            } as any,
        });

        const epic = connectorsEpics[9] as any;
        const output$ = epic(of(slice.actions.bulkDeleteConnectors({ uuids: ['c-1', 'c-2'] })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.bulkDeleteConnectorsSuccess({ uuids: ['c-1', 'c-2'], errors }));
        expect(emitted[1]).toEqual(alertsSlice.actions.success('Selected connectors successfully deleted.'));
    });

    test('bulkDeleteConnectors failure emits bulkDeleteConnectorsFailure and fetchError', async () => {
        const err = new Error('bulk failed');
        const deps = createDeps({
            connectorsV2: {
                bulkDeleteConnectorV2: () => throwError(() => err),
            } as any,
        });

        const epic = connectorsEpics[9] as any;
        const output$ = epic(of(slice.actions.bulkDeleteConnectors({ uuids: ['c-1', 'c-2'] })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.bulkDeleteConnectorsFailure());
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete connector' }));
    });

    test('getConnectorAttributesDescriptors success emits getConnectorAttributeDescriptorsSuccess', async () => {
        const attrs = [{ uuid: 'a-1' }] as any[];
        const deps = createDeps({
            connectors: {
                getAttributes: ({ uuid, functionGroup, kind }: { uuid: any; functionGroup: any; kind: any }) => {
                    expect(uuid).toBe('conn-1');
                    expect(functionGroup).toBe('FG');
                    expect(kind).toBe('kind');
                    return of(attrs);
                },
            } as any,
        });

        const epic = connectorsEpics[3] as any;
        const output$ = epic(
            of(slice.actions.getConnectorAttributesDescriptors({ uuid: 'conn-1', functionGroup: 'FG' as any, kind: 'kind' })),
            of({}) as any,
            deps as any,
        );
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted[0]).toEqual(
            slice.actions.getConnectorAttributeDescriptorsSuccess({
                functionGroup: 'FG',
                kind: 'kind',
                attributes: attrs,
            }),
        );
    });

    test('getConnectorAttributesDescriptors failure emits getConnectorAttributesDescriptorsFailure and fetchError', async () => {
        const err = new Error('attrs failed');
        const deps = createDeps({
            connectors: {
                getAttributes: () => throwError(() => err),
            } as any,
        });

        const epic = connectorsEpics[3] as any;
        const output$ = epic(
            of(slice.actions.getConnectorAttributesDescriptors({ uuid: 'conn-1', functionGroup: 'FG' as any, kind: 'kind' })),
            of({}) as any,
            deps as any,
        );
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.getConnectorAttributesDescriptorsFailure());
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get connector attributes' }));
    });

    test('getConnectorAllAttributesDescriptors success emits getConnectorAllAttributesDescriptorsSuccess', async () => {
        const descColl = { group: { kind: [{ uuid: 'a-1' }] } } as any;
        const deps = createDeps({
            connectors: {
                getAttributesAll: ({ uuid }: { uuid: any }) => {
                    expect(uuid).toBe('conn-1');
                    return of(descColl);
                },
            } as any,
        });

        const epic = connectorsEpics[4] as any;
        const output$ = epic(of(slice.actions.getConnectorAllAttributesDescriptors({ uuid: 'conn-1' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted[0]).toEqual(
            slice.actions.getConnectorAllAttributesDescriptorsSuccess({
                attributeDescriptorCollection: descColl,
            }),
        );
    });

    test('getConnectorAllAttributesDescriptors failure emits getAllConnectorAllAttributesDescriptorsFailure and insertWidgetLock', async () => {
        const err = new Error('all attrs failed');
        const deps = createDeps({
            connectors: {
                getAttributesAll: () => throwError(() => err),
            } as any,
        });

        const epic = connectorsEpics[4] as any;
        const output$ = epic(of(slice.actions.getConnectorAllAttributesDescriptors({ uuid: 'conn-1' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.getAllConnectorAllAttributesDescriptorsFailure());
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload.widgetName).toBe(LockWidgetNameEnum.ConnectorAttributes);
    });

    test('callbackConnector success emits callbackSuccess', async () => {
        const data = { result: 'ok' } as any;

        const deps = createDeps({
            callback: {
                callback: ({ requestAttributeCallback }: { requestAttributeCallback: any }) => {
                    expect(requestAttributeCallback).toBeDefined();
                    return of(data);
                },
            } as any,
        });

        const epic = connectorsEpics[17] as any;
        const action = slice.actions.callbackConnector({
            callbackId: 'cb-1',
            callbackConnector: { requestAttributeCallback: { mappings: [] } } as any,
        });
        const output$ = epic(of(action), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.callbackSuccess({ callbackId: 'cb-1', data }));
    });

    test('callbackConnector failure emits callbackFailure and fetchError', async () => {
        const err = new Error('callback failed');

        const deps = createDeps({
            callback: {
                callback: () => throwError(() => err),
            } as any,
        });

        const epic = connectorsEpics[17] as any;
        const action = slice.actions.callbackConnector({
            callbackId: 'cb-1',
            callbackConnector: { requestAttributeCallback: { mappings: [] } } as any,
        });
        const output$ = epic(of(action), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.callbackFailure({ callbackId: 'cb-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Connector callback failure' }));
    });
});
