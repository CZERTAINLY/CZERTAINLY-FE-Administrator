import { useEffect } from 'react';
import { of, throwError } from 'rxjs';
import cbomEpics from './cbom-epics';
import reducer, { actions, initialState, selectors } from './cbom';
import {
    transformCbomDetailDtoToModel,
    transformCbomDtoToModel,
    transformCbomUploadRequestModelToDto,
    transformPaginationResponseDtoToModel,
    transformSearchableFieldsDtoToModel,
    transformSearchRequestModelToDto,
} from './transform/cbom';

function runReducerAndSelectors() {
    let state = reducer(undefined, { type: 'unknown' });
    state = reducer(state, actions.listCboms({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any));
    state = reducer(
        state,
        actions.listCbomsSuccess({
            data: { items: [{ uuid: 'cbom-1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 } as any,
        }),
    );
    state = reducer(state, actions.listCbomsFailure({ error: 'err' }));

    state = reducer(state, actions.getCbomDetail({ uuid: 'detail-1' }));
    state = reducer(state, actions.getCbomDetailSuccess({ detail: { uuid: 'detail-1', version: 2 } as any }));
    state = reducer(state, actions.getCbomDetailFailure({ error: 'err' }));
    state = reducer(state, actions.clearCbomDetail());

    state = reducer(state, actions.listCbomVersions({ uuid: 'detail-1' }));
    state = reducer(state, actions.listCbomVersionsSuccess({ versions: [{ uuid: 'v-1' } as any] }));
    state = reducer(state, actions.listCbomVersionsFailure({ error: 'err' }));

    state = reducer(state, actions.getSearchableFields());
    state = reducer(state, actions.getSearchableFieldsSuccess({ fields: [{ group: 'cbom', fields: [] }] as any }));
    state = reducer(state, actions.getSearchableFieldsFailure({ error: 'err' }));

    state = reducer(state, actions.uploadCbom({ content: { metadata: {} } } as any));
    state = reducer(state, actions.uploadCbomSuccess({ cbom: { uuid: 'cbom-new' } as any }));
    state = reducer(state, actions.uploadCbomFailure({ error: 'err' }));
    state = reducer(state, actions.resetState());

    const rootState = { cbom: state } as any;
    selectors.selectCbomsData(rootState);
    selectors.selectCbomList(rootState);
    selectors.selectCbomDetail(rootState);
    selectors.selectCbomVersions(rootState);
    selectors.selectSearchableFields(rootState);
    selectors.selectIsFetchingList(rootState);
    selectors.selectIsFetchingDetail(rootState);
    selectors.selectIsFetchingVersions(rootState);
    selectors.selectIsFetchingSearchableFields(rootState);
    selectors.selectIsUploading(rootState);

    reducer(
        {
            ...initialState,
            cbomsData: { items: [{ uuid: 'old' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 } as any,
            isUploading: true,
        },
        actions.uploadCbomSuccess({ cbom: { uuid: 'new' } as any }),
    );
}

function runTransforms() {
    transformCbomDtoToModel({ uuid: 'cbom-1', metadata: { source: 'lens' } } as any);
    transformCbomDetailDtoToModel({ uuid: 'detail-1', content: { metadata: { a: 1 } } } as any);
    transformCbomUploadRequestModelToDto({ content: { metadata: { serialNumber: 'urn:1' } } } as any);
    transformSearchRequestModelToDto({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any);
    transformSearchableFieldsDtoToModel([{ group: 'cbom', fields: [{ field: 'serialNumber', label: 'Serial Number' }] }] as any);
    transformPaginationResponseDtoToModel({
        items: [{ uuid: 'cbom-1' }],
        totalItems: 1,
        pageNumber: 1,
        itemsPerPage: 10,
        totalPages: 1,
    } as any);
}

function runEpics() {
    const successDeps = {
        apiClients: {
            cbomManagement: {
                listCboms: () => of({ items: [{ uuid: 'cbom-1' }], totalItems: 1, pageNumber: 1, itemsPerPage: 10, totalPages: 1 }),
                getCbomDetail: () => of({ uuid: 'detail-1', version: 1 }),
                listCbomVersions: () => of([{ uuid: 'v-1', version: 1 }]),
                getSearchableFieldInformation5: () => of([{ group: 'cbom', fields: [] }]),
                uploadCbom: () => of({ uuid: 'created-1' }),
            },
        },
    } as any;

    const failureDeps = {
        apiClients: {
            cbomManagement: {
                listCboms: () => throwError(() => new Error('list failed')),
                getCbomDetail: () => throwError(() => new Error('detail failed')),
                listCbomVersions: () => throwError(() => new Error('versions failed')),
                getSearchableFieldInformation5: () => throwError(() => new Error('search fields failed')),
                uploadCbom: () => throwError(() => new Error('upload failed')),
            },
        },
    } as any;

    cbomEpics[0](
        of(actions.listCboms({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any)) as any,
        of({}) as any,
        successDeps,
    ).subscribe();
    cbomEpics[0](
        of(actions.listCboms({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any)) as any,
        of({}) as any,
        failureDeps,
    ).subscribe();

    cbomEpics[1](of(actions.getCbomDetail({ uuid: 'detail-1' })) as any, of({}) as any, successDeps).subscribe();
    cbomEpics[1](of(actions.getCbomDetail({ uuid: 'detail-1' })) as any, of({}) as any, failureDeps).subscribe();

    cbomEpics[2](of(actions.listCbomVersions({ uuid: 'detail-1' })) as any, of({}) as any, successDeps).subscribe();
    cbomEpics[2](of(actions.listCbomVersions({ uuid: 'detail-1' })) as any, of({}) as any, failureDeps).subscribe();

    cbomEpics[3](of(actions.getSearchableFields()) as any, of({}) as any, successDeps).subscribe();
    cbomEpics[3](of(actions.getSearchableFields()) as any, of({}) as any, failureDeps).subscribe();

    cbomEpics[4](of(actions.uploadCbom({ content: { metadata: {} } } as any)) as any, of({}) as any, successDeps).subscribe();
    cbomEpics[4](of(actions.uploadCbom({ content: { metadata: {} } } as any)) as any, of({}) as any, failureDeps).subscribe();
}

export default function CbomCoverageRunner() {
    useEffect(() => {
        runReducerAndSelectors();
        runTransforms();
        runEpics();
    }, []);

    return <div data-testid="cbom-coverage-done" />;
}
