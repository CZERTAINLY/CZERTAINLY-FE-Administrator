import { describe, expect, test } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import cbomEpics from './cbom-epics';
import { slice } from './cbom';
import { alertsSlice } from './alert-slice';
import { actions as userInterfaceActions } from './user-interface';
import { actions as appRedirectActions } from './app-redirect';
import { LockWidgetNameEnum } from 'types/user-interface';

type EpicDeps = {
    apiClients: {
        cbomManagement: {
            listCboms: (args: any) => any;
            getCbomDetail: (args: any) => any;
            listCbomVersions: (args: any) => any;
            getSearchableFieldInformation5: () => any;
            uploadCbom: (args: any) => any;
        };
    };
};

function createDeps(overrides: Partial<EpicDeps['apiClients']['cbomManagement']> = {}): EpicDeps {
    return {
        apiClients: {
            cbomManagement: {
                listCboms: () => of({ items: [], totalItems: 0, pageNumber: 1, itemsPerPage: 10, totalPages: 0 }),
                getCbomDetail: () => of({ uuid: 'detail-default' }),
                listCbomVersions: () => of([]),
                getSearchableFieldInformation5: () => of([]),
                uploadCbom: () => of({ uuid: 'uploaded-default' }),
                ...overrides,
            },
        },
    };
}

describe('cbom epics', () => {
    test('listCboms success emits listCbomsSuccess and removeWidgetLock', async () => {
        const searchRequest = { pageNumber: 1, itemsPerPage: 10, filters: [] } as any;
        const response = { items: [{ uuid: 'cbom-1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 } as any;

        const deps = createDeps({
            listCboms: ({ searchRequestDto }) => {
                expect(searchRequestDto).toEqual(searchRequest);
                return of(response);
            },
        });

        const output$ = (cbomEpics[0] as any)(of(slice.actions.listCboms(searchRequest)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted).toEqual([
            slice.actions.listCbomsSuccess({ data: response }),
            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfCboms),
        ]);
    });

    test('listCboms failure emits listCbomsFailure and insertWidgetLock', async () => {
        const deps = createDeps({
            listCboms: () => throwError(() => new Error('list failed')),
        });

        const output$ = (cbomEpics[0] as any)(
            of(slice.actions.listCboms({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any)),
            of({}) as any,
            deps as any,
        );
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.listCbomsFailure({ error: 'Failed to fetch CBOMs. list failed' }));
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload.widgetName).toBe(LockWidgetNameEnum.ListOfCboms);
    });

    test('getCbomDetail success emits getCbomDetailSuccess and removeWidgetLock', async () => {
        const uuid = 'cbom-detail-1';
        const detail = { uuid, version: 4, serialNumber: 'urn:cbom:1' } as any;

        const deps = createDeps({
            getCbomDetail: ({ uuid: value }) => {
                expect(value).toBe(uuid);
                return of(detail);
            },
        });

        const output$ = (cbomEpics[1] as any)(of(slice.actions.getCbomDetail({ uuid })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted).toEqual([
            slice.actions.getCbomDetailSuccess({ detail }),
            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CbomDetail),
        ]);
    });

    test('getCbomDetail failure emits getCbomDetailFailure and insertWidgetLock', async () => {
        const deps = createDeps({
            getCbomDetail: () => throwError(() => new Error('detail failed')),
        });

        const output$ = (cbomEpics[1] as any)(of(slice.actions.getCbomDetail({ uuid: 'u' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.getCbomDetailFailure({ error: 'Failed to fetch CBOM detail. detail failed' }));
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload.widgetName).toBe(LockWidgetNameEnum.CbomDetail);
    });

    test('listCbomVersions success emits listCbomVersionsSuccess and removeWidgetLock', async () => {
        const uuid = 'cbom-versions-1';
        const versions = [
            { uuid: 'v-1', version: 1 },
            { uuid: 'v-2', version: 2 },
        ] as any[];

        const deps = createDeps({
            listCbomVersions: ({ uuid: value }) => {
                expect(value).toBe(uuid);
                return of(versions);
            },
        });

        const output$ = (cbomEpics[2] as any)(of(slice.actions.listCbomVersions({ uuid })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted).toEqual([
            slice.actions.listCbomVersionsSuccess({ versions }),
            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CbomVersions),
        ]);
    });

    test('listCbomVersions failure emits listCbomVersionsFailure and insertWidgetLock', async () => {
        const deps = createDeps({
            listCbomVersions: () => throwError(() => new Error('versions failed')),
        });

        const output$ = (cbomEpics[2] as any)(of(slice.actions.listCbomVersions({ uuid: 'u' })), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.listCbomVersionsFailure({ error: 'Failed to fetch CBOM versions. versions failed' }));
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].payload.widgetName).toBe(LockWidgetNameEnum.CbomVersions);
    });

    test('getSearchableFields success emits getSearchableFieldsSuccess', async () => {
        const fields = [{ group: 'cbom', fields: [{ field: 'serialNumber', label: 'Serial Number' }] }] as any;
        const deps = createDeps({
            getSearchableFieldInformation5: () => of(fields),
        });

        const output$ = (cbomEpics[3] as any)(of(slice.actions.getSearchableFields()), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted).toEqual([slice.actions.getSearchableFieldsSuccess({ fields })]);
    });

    test('getSearchableFields failure emits getSearchableFieldsFailure and fetchError', async () => {
        const err = new Error('searchable failed');
        const deps = createDeps({
            getSearchableFieldInformation5: () => throwError(() => err),
        });

        const output$ = (cbomEpics[3] as any)(of(slice.actions.getSearchableFields()), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(
            slice.actions.getSearchableFieldsFailure({ error: 'Failed to fetch searchable fields. searchable failed' }),
        );
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to fetch searchable fields' }));
    });

    test('uploadCbom success emits uploadCbomSuccess', async () => {
        const uploadPayload = { content: { metadata: { serialNumber: 'urn:cbom:1' } } } as any;
        const created = { uuid: 'created-cbom', serialNumber: 'urn:cbom:1' } as any;

        const deps = createDeps({
            uploadCbom: ({ cbomUploadRequestDto }) => {
                expect(cbomUploadRequestDto).toEqual(uploadPayload);
                return of(created);
            },
        });

        const output$ = (cbomEpics[4] as any)(of(slice.actions.uploadCbom(uploadPayload)), of({}) as any, deps as any);
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted).toEqual([slice.actions.uploadCbomSuccess({ cbom: created })]);
    });

    test('uploadCbom failure emits uploadCbomFailure and alert error', async () => {
        const deps = createDeps({
            uploadCbom: () => throwError(() => new Error('upload failed')),
        });

        const output$ = (cbomEpics[4] as any)(
            of(slice.actions.uploadCbom({ content: { metadata: {} } } as any)),
            of({}) as any,
            deps as any,
        );
        const emitted = (await firstValueFrom(output$.pipe(take(2), toArray()))) as any[];

        expect(emitted[0]).toEqual(slice.actions.uploadCbomFailure({ error: 'Failed to upload CBOM. upload failed' }));
        expect(emitted[1]).toEqual(alertsSlice.actions.error('Failed to upload CBOM. upload failed'));
    });
});
