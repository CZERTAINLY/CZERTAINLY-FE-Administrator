import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./roles";
import { actions as alertActions } from "./alerts";
import { transformRoleDetailDTOToModel, transformRoleDTOToModel, transformSubjectPermissionsDTOToModel } from "./transform/roles";


const list: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.list.match
      ),
      switchMap(

         () => deps.apiClients.roles.list().pipe(

            map(list => slice.actions.listSuccess({ roles: list.map(role => transformRoleDTOToModel(role)) })),

            catchError(err => of(slice.actions.listFailure({ error: extractError(err, "Failed to get roles list") })))

         )
      )

   )

}


const listFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const getDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDetail.match
      ),
      switchMap(

         action => deps.apiClients.roles.getDetail(action.payload.uuid).pipe(

            map(role => slice.actions.getDetailSuccess({ role: transformRoleDetailDTOToModel(role) })),

            catchError(err => of(slice.actions.getDetailFailure({ error: extractError(err, "Failed to get role detail") })))

         )

      )

   )

}


const getDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const create: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.create.match
      ),
      switchMap(

         action => deps.apiClients.roles.create(action.payload.name, action.payload.description).pipe(

            map(role => slice.actions.createSuccess({ role: transformRoleDetailDTOToModel(role) })),

            catchError(err => of(slice.actions.createFailure({ error: extractError(err, "Failed to create role") })))

         )

      )

   )

}


const createFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const update: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.update.match
      ),
      switchMap(

         action => deps.apiClients.roles.update(
            action.payload.uuid,
            action.payload.name,
            action.payload.description
         ).pipe(

            map(role => slice.actions.updateSuccess({ role: transformRoleDetailDTOToModel(role) })),

            catchError(err => of(slice.actions.updateFailure({ error: extractError(err, "Failed to update role") })))

         )

      )

   )

}


const updateFailure: AppEpic = (action$, state, deps) => {


   return action$.pipe(

      filter(
         slice.actions.updateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const deleteRole: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.delete.match
      ),
      switchMap(

         action => deps.apiClients.roles.delete(action.payload.uuid).pipe(

            map(() => slice.actions.deleteSuccess({ uuid: action.payload.uuid })),

            catchError(err => of(slice.actions.deleteFailure({ error: extractError(err, "Failed to delete role") })))

         )

      )

   )

}


const deleteFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const getPermissions: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getPermissions.match
      ),
      switchMap(

         action => deps.apiClients.roles.getPermissions(action.payload.uuid).pipe(

            map(permissions => slice.actions.getPermissionsSuccess({
               uuid: action.payload.uuid,
               permissions: transformSubjectPermissionsDTOToModel(permissions)
            })),

            catchError(err => of(slice.actions.getPermissionsFailure({ error: extractError(err, "Failed to get role permissions") })))

         )

      )

   )

}


const getPermissionsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getPermissionsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const updatePermissions: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updatePermissions.match
      ),
      switchMap(

         action => deps.apiClients.roles.updatePermissions(
            action.payload.uuid,
            action.payload.permissions
         ).pipe(

            map(permissions => slice.actions.updatePermissionsSuccess({
               uuid: action.payload.uuid,
               permissions: transformSubjectPermissionsDTOToModel(permissions)
            })),

            catchError(err => of(slice.actions.updatePermissionsFailure({ error: extractError(err, "Failed to update role permissions") })))

         )

      )

   )

}


const epics = [
   list,
   listFailure,
   getDetail,
   getDetailFailure,
   create,
   createFailure,
   update,
   updateFailure,
   deleteRole,
   deleteFailure,
   getPermissions,
   getPermissionsFailure,
   updatePermissions
];

export default epics;
