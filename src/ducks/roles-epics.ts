import { EMPTY, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./roles";
import { actions as alertActions } from "./alerts";
import { transformRoleDetailDTOToModel, transformRoleDTOToModel, transformSubjectPermissionsDTOToModel } from "./transform/roles";
import { transformUserDTOToModel } from "./transform/users";


const list: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.list.match
      ),
      switchMap(

         () => deps.apiClients.roles.list().pipe(

            map(
               list => slice.actions.listSuccess({ roles: list.map(role => transformRoleDTOToModel(role)) })
            ),

            catchError(
               err => of(slice.actions.listFailure({ error: extractError(err, "Failed to get roles list") }))
            )

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

            map(
               role => slice.actions.getDetailSuccess({ role: transformRoleDetailDTOToModel(role) })
            ),

            catchError(
               err => of(slice.actions.getDetailFailure({ error: extractError(err, "Failed to get role detail") }))
            )

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

            map(
               role => slice.actions.createSuccess({ role: transformRoleDetailDTOToModel(role) })
            ),

            catchError(
               err => of(slice.actions.createFailure({ error: extractError(err, "Failed to create role") }))
            )

         )

      )

   )

}


const createSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createSuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload.role.uuid}`);
            return EMPTY;
         }

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

            map(
               role => slice.actions.updateSuccess({ role: transformRoleDetailDTOToModel(role) })
            ),

            catchError(
               err => of(slice.actions.updateFailure({ error: extractError(err, "Failed to update role") }))
            )

         )

      )

   )

}


const updateSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateSuccess.match
      ),
      switchMap(

         action => {
            history.push(`../detail/${action.payload.role.uuid}`);
            return EMPTY;
         }

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
      mergeMap(

         action => deps.apiClients.roles.delete(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect })
            ),

            catchError(
               err => of(slice.actions.deleteFailure({ error: extractError(err, "Failed to delete role") }))
            )

         )

      )

   )

}


const deleteSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteSuccess.match
      ),
      switchMap(

         action => {
            if (action.payload.redirect) history.push(action.payload.redirect);
            return EMPTY;
         }

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


const getUsers: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getUsers.match
      ),
      switchMap(

         action => deps.apiClients.roles.getUsers(action.payload.uuid).pipe(

            map(
               users => slice.actions.getUsersSuccess({
                  uuid: action.payload.uuid,
                  users: users.map(transformUserDTOToModel)
               })
            ),

            catchError(
               err => of(slice.actions.getUsersFailure({ error: extractError(err, "Failed to get role users") }))
            )

         )

      )

   )

}


const getUsersFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getUsersFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const updateUsers: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateUsers.match
      ),
      switchMap(

         action => deps.apiClients.roles.updateUsers(action.payload.uuid, action.payload.users).pipe(

            map(
               role => slice.actions.updateUsersSuccess({ role: transformRoleDetailDTOToModel(role) })
            ),

            catchError(
               err => of(slice.actions.updateUsersFailure({ error: extractError(err, "Failed to update role users") }))
            )

         )

      )

   )

}


const updateUsersSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateUsersSuccess.match
      ),
      switchMap(

         action => {
            history.goBack();
            return EMPTY;
         }

      )

   )

}



const updateUsersFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateUsersFailure.match
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

            map(
               permissions => slice.actions.getPermissionsSuccess({
                  uuid: action.payload.uuid,
                  permissions: transformSubjectPermissionsDTOToModel(permissions)
               })
            ),

            catchError(
               err => of(slice.actions.getPermissionsFailure({ error: extractError(err, "Failed to get role permissions") }))
            )

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

            map(
               permissions => slice.actions.updatePermissionsSuccess({
                  uuid: action.payload.uuid,
                  permissions: transformSubjectPermissionsDTOToModel(permissions)
               })
            ),

            catchError(
               err => of(slice.actions.updatePermissionsFailure({ error: extractError(err, "Failed to update role permissions") }))
            )

         )

      )

   )

}


const updatePermissionsSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updatePermissionsSuccess.match
      ),
      switchMap(

         action => {
            history.goBack();
            return EMPTY;
         }

      )

   )

}


const updatePermissionsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updatePermissionsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const epics = [
   list,
   listFailure,
   getDetail,
   getDetailFailure,
   create,
   createSuccess,
   createFailure,
   update,
   updateSuccess,
   updateFailure,
   deleteRole,
   deleteSuccess,
   deleteFailure,
   getUsers,
   getUsersFailure,
   getPermissions,
   getPermissionsFailure,
   updateUsers,
   updateUsersSuccess,
   updateUsersFailure,
   updatePermissions,
   updatePermissionsSuccess,
   updatePermissionsFailure
];


export default epics;
