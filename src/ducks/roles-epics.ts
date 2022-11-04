import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./roles";
import { actions as appRedirectActions } from "./app-redirect";

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
               err => of(
                  slice.actions.listFailure({ error: extractError(err, "Failed to get roles list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get roles list" })
               )
            )

         )

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
               err => of(
                  slice.actions.getDetailFailure({ error: extractError(err, "Failed to get role detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get role detail" })
               )
            )

         )

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

            mergeMap(
               role => of(
                  slice.actions.createSuccess({ role: transformRoleDetailDTOToModel(role) }),
                  appRedirectActions.redirect({ url: `../detail/${role.uuid}` }),

               )
            ),

            catchError(
               err => of(
                  slice.actions.createFailure({ error: extractError(err, "Failed to create role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create role" })
               )
            )

         )

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

            mergeMap(
               role => of(
                  slice.actions.updateSuccess({ role: transformRoleDetailDTOToModel(role) }),
                  appRedirectActions.redirect({ url: `../../detail/${role.uuid}` }),
               )
            ),

            catchError(
               err => of(
                  slice.actions.updateFailure({ error: extractError(err, "Failed to update role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update role" })
               )
            )

         )

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

            mergeMap(
               () => iif(
                  () => !!action.payload.redirect,
                  of(
                     slice.actions.deleteSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! }),
                  ),
                  of(
                     slice.actions.deleteSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                  )
               )

            ),

            catchError(
               err => of(
                  slice.actions.deleteFailure({ error: extractError(err, "Failed to delete role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete role" })
               )
            )

         )

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
               err => of(
                  slice.actions.getUsersFailure({ error: extractError(err, "Failed to get role users") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get role users" })
               )
            )

         )

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

            mergeMap(
               role => of(
                  slice.actions.updateUsersSuccess({ role: transformRoleDetailDTOToModel(role) }),
                  appRedirectActions.goBack()
               )
            ),

            catchError(
               err => of(
                  slice.actions.updateUsersFailure({ error: extractError(err, "Failed to update role users") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update role users" })
               )
            )

         )

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
               err => of(
                  slice.actions.getPermissionsFailure({ error: extractError(err, "Failed to get role permissions") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get role permissions" })
               )
            )

         )

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

            mergeMap(
               permissions => of(
                  slice.actions.updatePermissionsSuccess({
                     uuid: action.payload.uuid,
                     permissions: transformSubjectPermissionsDTOToModel(permissions)
                  }),
                  appRedirectActions.goBack()
               )
            ),

            catchError(
               err => of(
                  slice.actions.updatePermissionsFailure({ error: extractError(err, "Failed to update role permissions") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update role permissions" })
               )
            )

         )

      )

   )

}


const epics = [
   list,
   getDetail,
   create,
   update,
   deleteRole,
   getUsers,
   getPermissions,
   updateUsers,
   updatePermissions,
];


export default epics;
