import { describe, expect, test } from 'vitest';
import reducer, { actions, initialState, selectors } from './cbom';
import { LockWidgetNameEnum } from 'types/user-interface';

describe('cbom slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values and clears unknown keys', () => {
        const dirtyState = {
            ...initialState,
            cbomsData: { items: [{ uuid: '1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 },
            cbomDetail: { uuid: 'detail-1' },
            cbomVersions: [{ uuid: 'v1' }],
            searchableFields: [{ group: 'g', fields: [] }],
            isFetchingList: true,
            isFetchingDetail: true,
            isFetchingVersions: true,
            isFetchingSearchableFields: true,
            isUploading: true,
            tempOnlyKey: 'to-be-removed',
        } as any;

        const next = reducer(dirtyState, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempOnlyKey).toBeUndefined();
    });

    test('listCboms / success / failure update list flags and data', () => {
        let next = reducer(initialState, actions.listCboms({ filters: [], pageNumber: 1, itemsPerPage: 10 } as any));
        expect(next.cbomsData).toBeUndefined();
        expect(next.isFetchingList).toBe(true);

        const payload = { items: [{ uuid: 'cbom-1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 } as any;
        next = reducer(next, actions.listCbomsSuccess({ data: payload }));
        expect(next.cbomsData).toEqual(payload);
        expect(next.isFetchingList).toBe(false);

        next = reducer({ ...next, isFetchingList: true }, actions.listCbomsFailure({ error: 'x' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getCbomDetail / success / failure and clearCbomDetail', () => {
        let next = reducer({ ...initialState, cbomDetail: { uuid: 'old' } as any }, actions.getCbomDetail({ uuid: 'u-1' }));
        expect(next.cbomDetail).toBeUndefined();
        expect(next.isFetchingDetail).toBe(true);

        const detail = { uuid: 'u-1', version: 2 } as any;
        next = reducer(next, actions.getCbomDetailSuccess({ detail }));
        expect(next.cbomDetail).toEqual(detail);
        expect(next.isFetchingDetail).toBe(false);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getCbomDetailFailure({ error: 'fail' }));
        expect(next.isFetchingDetail).toBe(false);

        next = reducer(next, actions.clearCbomDetail());
        expect(next.cbomDetail).toBeUndefined();
    });

    test('listCbomVersions / success / failure updates versions and flags', () => {
        let next = reducer({ ...initialState, cbomVersions: [{ uuid: 'old' } as any] }, actions.listCbomVersions({ uuid: 'u-1' }));
        expect(next.cbomVersions).toEqual([]);
        expect(next.isFetchingVersions).toBe(true);

        const versions = [{ uuid: 'v-1' }, { uuid: 'v-2' }] as any[];
        next = reducer(next, actions.listCbomVersionsSuccess({ versions }));
        expect(next.cbomVersions).toEqual(versions);
        expect(next.isFetchingVersions).toBe(false);

        next = reducer({ ...next, isFetchingVersions: true }, actions.listCbomVersionsFailure({ error: 'err' }));
        expect(next.isFetchingVersions).toBe(false);
    });

    test('getSearchableFields / success / failure updates fields and flags', () => {
        let next = reducer({ ...initialState, searchableFields: [{ group: 'old', fields: [] }] as any }, actions.getSearchableFields());
        expect(next.searchableFields).toEqual([]);
        expect(next.isFetchingSearchableFields).toBe(true);

        const fields = [{ group: 'cbom', fields: [{ label: 'serialNumber', field: 'serialNumber' }] }] as any;
        next = reducer(next, actions.getSearchableFieldsSuccess({ fields }));
        expect(next.searchableFields).toEqual(fields);
        expect(next.isFetchingSearchableFields).toBe(false);

        next = reducer({ ...next, isFetchingSearchableFields: true }, actions.getSearchableFieldsFailure({ error: 'err' }));
        expect(next.isFetchingSearchableFields).toBe(false);
    });

    test('uploadCbom / success / failure updates flags and prepends to list when available', () => {
        let next = reducer(initialState, actions.uploadCbom({ content: { metadata: {} } } as any));
        expect(next.isUploading).toBe(true);

        next = reducer(next, actions.uploadCbomFailure({ error: 'upload failed' }));
        expect(next.isUploading).toBe(false);

        const withList = {
            ...initialState,
            isUploading: true,
            cbomsData: { items: [{ uuid: 'old-1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 },
        } as any;
        const createdCbom = { uuid: 'new-1' } as any;
        next = reducer(withList, actions.uploadCbomSuccess({ cbom: createdCbom }));
        expect(next.isUploading).toBe(false);
        expect(next.cbomsData!.items[0]).toEqual(createdCbom);
        expect(next.cbomsData!.items[1]).toEqual({ uuid: 'old-1' });

        const withoutList = { ...initialState, isUploading: true };
        next = reducer(withoutList, actions.uploadCbomSuccess({ cbom: createdCbom }));
        expect(next.isUploading).toBe(false);
        expect(next.cbomsData).toBeUndefined();
    });
});

describe('cbom selectors', () => {
    test('selectCbomList falls back to empty array', () => {
        const state = { cbom: initialState } as any;
        expect(selectors.selectCbomList(state)).toEqual([]);
    });

    test('selectors return values from cbom state', () => {
        const cbomState = {
            ...initialState,
            cbomsData: { items: [{ uuid: '1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 },
            cbomDetail: { uuid: 'detail-1' },
            cbomVersions: [{ uuid: 'v-1' }],
            searchableFields: [{ group: 'cbom', fields: [] }],
            isFetchingList: true,
            isFetchingDetail: false,
            isFetchingVersions: true,
            isFetchingSearchableFields: false,
            isUploading: true,
        } as any;
        const state = { cbom: cbomState, userInterface: { widgetLocks: [{ widgetName: LockWidgetNameEnum.CbomDetail }] } } as any;

        expect(selectors.selectCbomsData(state)).toEqual(cbomState.cbomsData);
        expect(selectors.selectCbomList(state)).toEqual(cbomState.cbomsData.items);
        expect(selectors.selectCbomDetail(state)).toEqual(cbomState.cbomDetail);
        expect(selectors.selectCbomVersions(state)).toEqual(cbomState.cbomVersions);
        expect(selectors.selectSearchableFields(state)).toEqual(cbomState.searchableFields);
        expect(selectors.selectIsFetchingList(state)).toBe(true);
        expect(selectors.selectIsFetchingDetail(state)).toBe(false);
        expect(selectors.selectIsFetchingVersions(state)).toBe(true);
        expect(selectors.selectIsFetchingSearchableFields(state)).toBe(false);
        expect(selectors.selectIsUploading(state)).toBe(true);
    });
});
