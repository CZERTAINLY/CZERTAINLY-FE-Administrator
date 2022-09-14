import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./audit";
import { actions as alertActions } from "./alerts";
import { transformAuditLogDTOToModel } from "./transform/auditlog";


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
               err => of(slice.actions.listLogsFailure({ error: extractError(err, "Failed to get audit logs list") }))
            )

         )

      )

   )

}


const listLogsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listLogsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

            catchError(err => of(slice.actions.listObjectsFailure({ error: extractError(err, "Failed to get objects list") })))

         )

      )

   )

}


const listObjectsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listObjectsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.listObjectsFailure({ error: extractError(err, "Failed to get operations list") }))
            )

         )

      )

   )

}


const listOperationsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listOperationsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.errors || "Unexpected error occured")
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
               err => of(slice.actions.listStatusesFailure({ error: extractError(err, "Failed to get statuses list") }))
            )

         )

      )

   )

}


const listStatusesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listStatusesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               () => slice.actions.purgeLogsSuccess({ filters: action.payload.filters, sort: action.payload.sort })
            ),

            catchError(
               err => of(slice.actions.purgeLogsFailure({ error: extractError(err, "Failed to purge audit logs") }))
            )

         )

      )

   )

}


const purgeLogsSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.purgeLogsSuccess.match
      ),
      map(
         action => slice.actions.listLogs({ page: 0, size: 10, sort: action.payload.sort, filters: action.payload.filters })
      )

   )

}

const purgeLogsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.purgeLogsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}

const epics = [
   listLogs,
   listLogsFailure,
   listObjects,
   listObjectsFailure,
   listOperations,
   listOperationsFailure,
   listStatuses,
   listStatusesFailure,
   purgeLogs,
   purgeLogsSuccess,
   purgeLogsFailure
]

export default epics