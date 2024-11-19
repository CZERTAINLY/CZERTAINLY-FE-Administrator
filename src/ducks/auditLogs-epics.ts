import { AppEpic } from 'ducks';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { store } from 'index';
import { EntityType } from './filters';
import { actions as pagingActions } from './paging';

import { LockWidgetNameEnum } from 'types/user-interface';
import * as slice from './auditLogs';
import { transformAuditLogItemDtoToModel } from './transform/auditLogs';
import { transformSearchRequestModelToDto, transformSearchFilterModelToDto } from './transform/certificates';

const listLogs: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAuditLogs.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.AUDIT_LOG));
            return deps.apiClients.auditLogs.listAuditLogs({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((auditLogResponse) =>
                    of(
                        slice.actions.listAuditLogsSuccess(auditLogResponse.items.map(transformAuditLogItemDtoToModel)),
                        pagingActions.listSuccess({ entity: EntityType.AUDIT_LOG, totalItems: auditLogResponse.totalItems }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.AuditLogs),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listAuditLogsFailure(),
                        pagingActions.listFailure(EntityType.AUDIT_LOG),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.AuditLogs),
                    ),
                ),
            );
        }),
    );
};

const purgeLogs: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.purgeLogs.match),
        switchMap((action) =>
            deps.apiClients.auditLogs
                .purgeAuditLogs({
                    searchFilterRequestDto: action.payload.map(transformSearchFilterModelToDto),
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.purgeLogsSuccess(),
                            slice.actions.listAuditLogs({ pageNumber: 1, itemsPerPage: 10, filters: action.payload }),
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
                    searchFilterRequestDto: action.payload.map(transformSearchFilterModelToDto),
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

const epics = [listLogs, purgeLogs, exportLogs];

export default epics;
