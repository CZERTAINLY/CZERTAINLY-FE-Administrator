import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";

import * as slice from "./audit";
import { transformAuditLogDTOToModel } from "./transform/auditlog";
import { actions as appRedirectActions } from "./app-redirect";


const listLogs: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listLogs.match
      ),
      switchMap(

         action => deps.apiClients.auditLogs.getLogs(
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.filters
         ).pipe(

            map(
               pagedAuditLog => slice.actions.listLogsSuccess({
                  data: pagedAuditLog.items.map(transformAuditLogDTOToModel),
                  page: pagedAuditLog.page,
                  size: pagedAuditLog.size,
                  total: pagedAuditLog.totalPages
               })
            ),

            catchError(
               error => of(slice.actions.listLogsFailure(),
                   appRedirectActions.fetchError({ error, message: "Failed to get audit logs list" }))
            )

         )

      )

   )

}


const listObjects: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listObjects.match
      ),
      switchMap(

         action => deps.apiClients.auditLogs.getObjects().pipe(

            map(
               objectList => slice.actions.listObjectsSuccess({ objectList })
            ),

            catchError(
               error => of(slice.actions.listObjectsFailure(),
                   appRedirectActions.fetchError({ error, message: "Failed to get objects list" }))
            )

         )

      )

   )

}


const listOperations: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listOperations.match
      ),
      switchMap(

         action => deps.apiClients.auditLogs.getOperations().pipe(

            map(
               operationList => slice.actions.listOperationsSuccess({ operationList })
            ),

            catchError(
               error => of(slice.actions.listObjectsFailure(),
                   appRedirectActions.fetchError({ error, message: "Failed to get operations list" }))
            )

         )

      )

   )

}


const listStatuses: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listStatuses.match
      ),
      switchMap(

         action => deps.apiClients.auditLogs.getStatuses().pipe(

            map(
               statusList => slice.actions.listStatusesSuccess({ statusList })
            ),

            catchError(
               error => of(slice.actions.listStatusesFailure(),
                   appRedirectActions.fetchError({ error, message: "Failed to get statuses list" }))
            )

         )

      )

   )

}


const purgeLogs: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.purgeLogs.match
      ),
      switchMap(

         action => deps.apiClients.auditLogs.purgeLogs(action.payload.queryString).pipe(

            map(
               () => slice.actions.listLogs({ page: 0, size: 10, sort: action.payload.sort, filters: action.payload.filters })
            ),

            catchError(
               error => of(slice.actions.purgeLogsFailure(),
                   appRedirectActions.fetchError({ error, message: "Failed to purge audit logs" }))
            )

         )

      )

   )

}

const epics = [
   listLogs,
   listObjects,
   listOperations,
   listStatuses,
   purgeLogs,
]

export default epics