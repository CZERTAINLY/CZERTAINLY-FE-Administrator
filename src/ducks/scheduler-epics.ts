import { AppEpic } from 'ducks';
import { concat, from, iif, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { store } from 'index';
import { LockWidgetNameEnum } from 'types/user-interface';
import { EntityType } from './filters';
import { actions as pagingActions } from './paging';
import { slice } from './scheduler';
import { transformSearchRequestModelToDto } from './transform/certificates';
import {
    transformSchedulerJobDetailDtoToModel,
    transformSchedulerJobDtoToModel,
    transformSchedulerJobHistoryDtoToModel,
} from './transform/scheduler';

const listSchedulerJobs: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSchedulerJobs.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.SCHEDULER));
            return deps.apiClients.scheduler.listScheduledJobs({ pagination: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((response) =>
                    of(
                        slice.actions.listSchedulerJobsSuccess(response.scheduledJobs.map(transformSchedulerJobDtoToModel)),
                        pagingActions.listSuccess({ entity: EntityType.SCHEDULER, totalItems: response.totalItems }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfScheduler),
                    ),
                ),

                catchError((err) =>
                    of(
                        pagingActions.listFailure(EntityType.SCHEDULER),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfScheduler),
                    ),
                ),
            );
        }),
    );
};

const getSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getSchedulerJobDetail.match),

        switchMap((action) =>
            deps.apiClients.scheduler.getScheduledJobDetail({ uuid: action.payload.uuid }).pipe(
                switchMap((response) =>
                    of(
                        slice.actions.getSchedulerJobDetailSuccess(transformSchedulerJobDetailDtoToModel(response)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.SchedulerJobDetail),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getSchedulerJobDetailFailure({ error: extractError(err, 'Failed to get Scheduled Job detail') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.SchedulerJobDetail),
                    ),
                ),
            ),
        ),
    );
};

const listSchedulerJobHistory: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSchedulerJobHistory.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.SCHEDULER_HISTORY));
            return deps.apiClients.scheduler
                .getScheduledJobHistory({
                    uuid: action.payload.uuid,
                    pagination: transformSearchRequestModelToDto(action.payload.pagination),
                })
                .pipe(
                    mergeMap((response) =>
                        of(
                            slice.actions.listSchedulerJobHistorySuccess(
                                response.scheduledJobHistory.map(transformSchedulerJobHistoryDtoToModel),
                            ),
                            pagingActions.listSuccess({ entity: EntityType.SCHEDULER_HISTORY, totalItems: response.totalItems }),
                            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSchedulerHistory),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            pagingActions.listFailure(EntityType.SCHEDULER_HISTORY),
                            userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfSchedulerHistory),
                        ),
                    ),
                );
        }),
    );
};

const deleteSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteSchedulerJob.match),
        switchMap((action) =>
            deps.apiClients.scheduler.deleteScheduledJob({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    iif(
                        () => action.payload.redirect,
                        of(
                            slice.actions.deleteSchedulerJobSuccess({ uuid: action.payload.uuid }),
                            appRedirectActions.redirect({ url: '../../jobs' }),
                        ),
                        of(slice.actions.deleteSchedulerJobSuccess({ uuid: action.payload.uuid })),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteSchedulerJobFailure({ error: extractError(err, 'Failed to delete Scheduled Job') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete Scheduled Job' }),
                    ),
                ),
            ),
        ),
    );
};

const enableSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableSchedulerJob.match),
        switchMap((action) =>
            deps.apiClients.scheduler.enableScheduledJob({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableSchedulerJobSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.enableSchedulerJobFailure({ error: extractError(err, 'Failed to enable Scheduled Job') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable Scheduled Job' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableSchedulerJobs: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableSchedulerJobs.match),
        switchMap((action) => {
            return from(action.payload.uuids).pipe(
                concatMap((uuid) =>
                    deps.apiClients.scheduler.enableScheduledJob({ uuid }).pipe(
                        map(() => slice.actions.enableSchedulerJobSuccess({ uuid })),
                        catchError((err) =>
                            of(
                                slice.actions.enableSchedulerJobFailure({ error: extractError(err, 'Failed to enable Scheduled Job') }),
                                appRedirectActions.fetchError({ error: err, message: 'Failed to enable Scheduled Job' }),
                            ),
                        ),
                    ),
                ),
                toArray(),
                map(() => {
                    store.dispatch(slice.actions.bulkEnableSchedulerJobsSuccess({ uuids: action.payload.uuids }));
                    return alertActions.success('Successfully enabled selected Scheduled jobs');
                }),
                catchError((err) => {
                    return concat(
                        of(slice.actions.bulkEnableSchedulerJobsFailure({ error: 'There was some problem' })),
                        of(appRedirectActions.fetchError({ error: err, message: 'Failed to enable Scheduled Jobs' })),
                    );
                }),
            );
        }),
    );
};

const disableSchedulerJob: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableSchedulerJob.match),
        switchMap((action) =>
            deps.apiClients.scheduler.disableScheduledJob({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableSchedulerJobSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.disableSchedulerJobFailure({ error: extractError(err, 'Failed to disable Scheduled Job') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable Scheduled Job' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableSchedulerJobs: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableSchedulerJobs.match),
        switchMap((action) => {
            return from(action.payload.uuids).pipe(
                concatMap((uuid) =>
                    deps.apiClients.scheduler.disableScheduledJob({ uuid }).pipe(
                        map(() => slice.actions.disableSchedulerJobSuccess({ uuid })),
                        catchError((err) =>
                            of(
                                slice.actions.disableSchedulerJobFailure({
                                    error: extractError(err, 'Failed to disable Scheduled Job'),
                                }),
                                appRedirectActions.fetchError({ error: err, message: 'Failed to disable Scheduled Job' }),
                            ),
                        ),
                    ),
                ),
                toArray(),
                map(() => {
                    store.dispatch(slice.actions.bulkDisableSchedulerJobsSuccess({ uuids: action.payload.uuids }));
                    return alertActions.success('Successfully disabled selected Scheduled jobs');
                }),
                catchError((err) => {
                    return concat(
                        of(slice.actions.bulkDisableSchedulerJobsFailure({ error: 'There was some problem' })),
                        of(appRedirectActions.fetchError({ error: err, message: 'Failed to enable Scheduled Jobs' })),
                    );
                }),
            );
        }),
    );
};

const epics = [
    listSchedulerJobs,
    listSchedulerJobHistory,
    getSchedulerJob,
    deleteSchedulerJob,
    enableSchedulerJob,
    disableSchedulerJob,
    bulkEnableSchedulerJobs,
    bulkDisableSchedulerJobs,
];

export default epics;
