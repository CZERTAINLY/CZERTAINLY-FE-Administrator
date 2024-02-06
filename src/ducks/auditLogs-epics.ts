import { AppEpic } from 'ducks';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import * as slice from './auditLogs';
import { transformAuditLogDtoToModel, transformAuditLogFilterModelToDto, transformPageableModelToDto } from './transform/auditLogs';

const listLogs: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listLogs.match),
        switchMap((action) =>
            deps.apiClients.auditLogs
                .listAuditLogs({
                    pageable: transformPageableModelToDto({ page: action.payload.page, size: action.payload.size }),
                    filter: action.payload.filters ? transformAuditLogFilterModelToDto(action.payload.filters) : {},
                })
                .pipe(
                    map((pagedAuditLog) => {
                        const auditLogModel = transformAuditLogDtoToModel(pagedAuditLog);
                        const action = slice.actions.listLogsSuccess({
                            data: auditLogModel.items,
                            pageNumber: auditLogModel.pageNumber,
                            itemsPerPage: auditLogModel.itemsPerPage,
                            totalPages: auditLogModel.totalPages,
                            totalItems: auditLogModel.totalItems,
                        });
                        return [action, userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.AuditLogs)];
                    }),
                    switchMap((actions) => from(actions)),

                    catchError((error) =>
                        of(slice.actions.listLogsFailure(), userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.AuditLogs)),
                    ),
                ),
        ),
    );
};

const listObjects: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listObjects.match),
        switchMap((action) =>
            deps.apiClients.auditLogs.listObjects().pipe(
                map((objectList) => slice.actions.listObjectsSuccess({ objectList })),

                catchError((error) =>
                    of(slice.actions.listObjectsFailure(), appRedirectActions.fetchError({ error, message: 'Failed to get objects list' })),
                ),
            ),
        ),
    );
};

const listOperations: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listOperations.match),
        switchMap((action) =>
            deps.apiClients.auditLogs.listOperations().pipe(
                map((operationList) => slice.actions.listOperationsSuccess({ operationList })),

                catchError((error) =>
                    of(
                        slice.actions.listObjectsFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to get operations list' }),
                    ),
                ),
            ),
        ),
    );
};

const listStatuses: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listStatuses.match),
        switchMap((action) =>
            deps.apiClients.auditLogs.listOperationStatuses().pipe(
                map((statusList) => slice.actions.listStatusesSuccess({ statusList })),

                catchError((error) =>
                    of(
                        slice.actions.listStatusesFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to get statuses list' }),
                    ),
                ),
            ),
        ),
    );
};

const purgeLogs: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.purgeLogs.match),
        switchMap((action) =>
            deps.apiClients.auditLogs
                .purgeAuditLogs({
                    pageable: transformPageableModelToDto({ page: action.payload.page, size: action.payload.size }),
                    filter: action.payload.filters ? transformAuditLogFilterModelToDto(action.payload.filters) : {},
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.purgeLogsSuccess(),
                            slice.actions.listLogs({ page: 0, size: 10, filters: action.payload.filters }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.purgeLogsFailure(),
                            appRedirectActions.fetchError({ error, message: 'Failed to purge audit logs' }),
                        ),
                    ),
                ),
        ),
    );
};

const exportLogs: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.exportLogs.match),
        switchMap((action) =>
            deps.apiClients.auditLogs
                .exportAuditLogs({
                    pageable: transformPageableModelToDto({ page: action.payload.page, size: action.payload.size }),
                    filter: action.payload.filters ? transformAuditLogFilterModelToDto(action.payload.filters) : {},
                })
                .pipe(
                    map((blob) => slice.actions.exportLogsSuccess(window.URL.createObjectURL(blob))),
                    catchError((error) =>
                        of(
                            slice.actions.exportLogsFailure(),
                            appRedirectActions.fetchError({ error, message: 'Failed to get audit logs export' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [listLogs, listObjects, listOperations, listStatuses, purgeLogs, exportLogs];

export default epics;
