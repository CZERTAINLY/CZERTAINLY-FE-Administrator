import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";

import * as slice from "./auditLogs";
import { actions as appRedirectActions } from "./app-redirect";
import {
    transformAuditLogDtoToModel,
    transformAuditLogFilterModelToDto,
    transformPageableModelToDto
} from "./transform/auditLogs";


const listLogs: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listLogs.match
      ),
      switchMap(

         action => deps.apiClients.auditLogs.listAuditLogs({ pageable: transformPageableModelToDto({ page: action.payload.page, size: action.payload.size }), filter: action.payload.filters ? transformAuditLogFilterModelToDto(action.payload.filters) : {} }
         ).pipe(

            map(
               pagedAuditLog => {
                   const auditLogModel = transformAuditLogDtoToModel(pagedAuditLog);
                   return slice.actions.listLogsSuccess({
                       data: auditLogModel.items,
                       page: auditLogModel.page,
                       size: auditLogModel.size,
                       total: auditLogModel.totalPages
                   })
               }
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

         action => deps.apiClients.auditLogs.listObjects().pipe(

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

         action => deps.apiClients.auditLogs.listOperations().pipe(

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

         action => deps.apiClients.auditLogs.listOperationStatuses().pipe(

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

         action => deps.apiClients.auditLogs.purgeAuditLogs({ pageable: transformPageableModelToDto({ page: action.payload.page, size: action.payload.size }), filter: action.payload.filters ? transformAuditLogFilterModelToDto(action.payload.filters) : {} }
         ).pipe(

            map(
               () => slice.actions.listLogs({ page: 0, size: 10, filters: action.payload.filters })
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