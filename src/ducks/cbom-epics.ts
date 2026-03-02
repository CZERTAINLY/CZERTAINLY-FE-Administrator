import type { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { alertsSlice } from './alert-slice';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './cbom';
import {
    transformCbomDtoToModel,
    transformCbomDetailDtoToModel,
    transformPaginationResponseDtoToModel,
    transformSearchableFieldsDtoToModel,
    transformCbomUploadRequestModelToDto,
} from './transform/cbom';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';

const listCboms: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listCboms.match),
        switchMap((action) =>
            deps.apiClients.cbomManagement.listCboms({ searchRequestDto: action.payload }).pipe(
                mergeMap((response) =>
                    of(
                        slice.actions.listCbomsSuccess({
                            data: transformPaginationResponseDtoToModel(response),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfCboms),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listCbomsFailure({ error: extractError(err, 'Failed to fetch CBOMs') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfCboms),
                    ),
                ),
            ),
        ),
    );
};

const getCbomDetail: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getCbomDetail.match),
        switchMap((action) =>
            deps.apiClients.cbomManagement.getCbomDetail({ uuid: action.payload.uuid }).pipe(
                mergeMap((detail) =>
                    of(
                        slice.actions.getCbomDetailSuccess({
                            detail: transformCbomDetailDtoToModel(detail),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CbomDetail),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getCbomDetailFailure({ error: extractError(err, 'Failed to fetch CBOM detail') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.CbomDetail),
                    ),
                ),
            ),
        ),
    );
};

const listCbomVersions: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listCbomVersions.match),
        switchMap((action) =>
            deps.apiClients.cbomManagement.listCbomVersions({ uuid: action.payload.uuid }).pipe(
                mergeMap((versions) =>
                    of(
                        slice.actions.listCbomVersionsSuccess({
                            versions: versions.map(transformCbomDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CbomVersions),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listCbomVersionsFailure({ error: extractError(err, 'Failed to fetch CBOM versions') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.CbomVersions),
                    ),
                ),
            ),
        ),
    );
};

const getSearchableFields: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getSearchableFields.match),
        switchMap(() =>
            deps.apiClients.cbomManagement.getSearchableFieldInformation5().pipe(
                map((fields) =>
                    slice.actions.getSearchableFieldsSuccess({
                        fields: transformSearchableFieldsDtoToModel(fields),
                    }),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getSearchableFieldsFailure({ error: extractError(err, 'Failed to fetch searchable fields') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to fetch searchable fields' }),
                    ),
                ),
            ),
        ),
    );
};

const uploadCbom: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.uploadCbom.match),
        switchMap((action) =>
            deps.apiClients.cbomManagement.uploadCbom({ cbomUploadRequestDto: transformCbomUploadRequestModelToDto(action.payload) }).pipe(
                map((cbom) =>
                    slice.actions.uploadCbomSuccess({
                        cbom: transformCbomDtoToModel(cbom),
                    }),
                ),
                catchError((err) =>
                    of(
                        slice.actions.uploadCbomFailure({ error: extractError(err, 'Failed to upload CBOM') }),
                        alertsSlice.actions.error(extractError(err, 'Failed to upload CBOM')),
                    ),
                ),
            ),
        ),
    );
};

export default [listCboms, getCbomDetail, listCbomVersions, getSearchableFields, uploadCbom];
