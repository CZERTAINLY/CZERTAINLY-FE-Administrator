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
                  data: pagedAuditLog.items.map(item => transformAuditLogDTOToModel(item)),
                  page: pagedAuditLog.page,
                  size: pagedAuditLog.size,
                  total: pagedAuditLog.totalPages
               })
            ),

            catchError(err => of(slice.actions.listLogsFailure(extractError(err, "Failed to get audit logs list"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
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

            map(objects => slice.actions.listObjectsSuccess(objects)),

            catchError(err => of(slice.actions.listObjectsFailure(extractError(err, "Failed to get objects list"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
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

            map(operations => slice.actions.listOperationsSuccess(operations)),

            catchError(err => of(slice.actions.listObjectsFailure(extractError(err, "Failed to get operations list"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
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

            map(statuses => slice.actions.listStatusesSuccess(statuses)),

            catchError(err => of(slice.actions.listStatusesFailure(extractError(err, "Failed to get statuses list"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
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
   listStatusesFailure
]

export default epics