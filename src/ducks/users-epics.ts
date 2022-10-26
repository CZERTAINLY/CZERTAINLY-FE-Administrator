import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./users";
import { actions as appRedirectActions } from "./app-redirect";

import { transformCertModelToDTO } from "./transform/certificates";
import { transformUserDetailDTOToModel, transformUserDTOToModel } from "./transform/users";
import { transformRoleDTOToModel } from "./transform/roles";


const list: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.list.match
      ),
      switchMap(

         () => deps.apiClients.users.list().pipe(

            map(
               list => slice.actions.listSuccess({
                  users: list.map(transformUserDTOToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.listFailure({ error: extractError(err, "Failed to get user list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get user list" })
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

         action => deps.apiClients.users.detail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getDetailSuccess({
                  user: transformUserDetailDTOToModel(detail)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getDetailFailure({ error: extractError(err, "Failed to load user detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to load user detail" })
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

         action => deps.apiClients.users.create(
            action.payload.username,
            action.payload.description,
            action.payload.firstName,
            action.payload.lastName,
            action.payload.email,
            action.payload.enabled,
            action.payload.certificateUuid,
            action.payload.certificate ? transformCertModelToDTO(action.payload.certificate) : undefined
         ).pipe(

            switchMap(

               user => deps.apiClients.users.updateRoles(
                  user.uuid,
                  action.payload.roles || []
               ).pipe(

                  mergeMap(
                     userDetailDTO => of(
                        slice.actions.createSuccess({ user: transformUserDetailDTOToModel(userDetailDTO) }),
                        appRedirectActions.redirect({ url: `../detail/${userDetailDTO.uuid}` })
                     )
                  ),

                  catchError(
                     err => of(
                        slice.actions.createFailure({ error: extractError(err, "Failed to update user roles") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to update user roles" })
                     )
                  )

               )
            ),

            catchError(
               err => of(
                  slice.actions.createFailure({ error: extractError(err, "Failed to create user") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create user" })
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

         action => deps.apiClients.users.update(
            action.payload.uuid,
            action.payload.description,
            action.payload.firstName,
            action.payload.lastName,
            action.payload.email,
            action.payload.certificateUuid,
            action.payload.certificate ? transformCertModelToDTO(action.payload.certificate) : undefined
         ).pipe(

            switchMap(

               userDetailDTO => deps.apiClients.users.updateRoles(userDetailDTO.uuid, action.payload.roles || []).pipe(

                  mergeMap(
                     () => of(
                        slice.actions.updateSuccess({ user: transformUserDetailDTOToModel(userDetailDTO) }),
                        appRedirectActions.redirect({ url: `../../detail/${userDetailDTO.uuid}` })
                     )
                  ),

                  catchError(
                     err => of(
                        slice.actions.updateFailure({ error: extractError(err, "Failed to update user roles") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to update user roles" })
                     )
                  )

               )

            ),

            catchError(
               err => of(
                  slice.actions.updateFailure({ error: extractError(err, "Failed to update user") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update user" })
               )
            )

         )

      )

   )

}


const deleteUser: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteUser.match
      ),
      mergeMap(

         action => deps.apiClients.users.delete(action.payload.uuid).pipe(

            mergeMap(

               () => iif(

                  () => !!action.payload.redirect,
                  of(
                     slice.actions.deleteUserSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! })
                  ),
                  of(
                     slice.actions.deleteUserSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect })
                  )

               )

            ),

            catchError(
               err => of(
                  slice.actions.deleteUserFailure({ error: extractError(err, "Failed to delete user") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete user" })
               )
            )

         )

      )

   )

}


const enable: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enable.match
      ),
      mergeMap(

         action => deps.apiClients.users.enable(action.payload.uuid).pipe(

            map(
               () => slice.actions.enableSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.enableFailure({ error: extractError(err, "Failed to enable user") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to enable user" })
               )
            )

         )

      )

   )

}


const disable: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disable.match
      ),
      mergeMap(

         action => deps.apiClients.users.disable(action.payload.uuid).pipe(

            map(
               () => slice.actions.disableSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.disableFailure({ error: extractError(err, "Failed to disable user") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to disable user" })
               )
            )

         )

      )

   )

}


const getRoles: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getRoles.match
      ),
      switchMap(

         action => deps.apiClients.users.getRoles(action.payload.uuid).pipe(

            map(
               roles => slice.actions.getRolesSuccess({ uuid: action.payload.uuid, roles: roles.map(transformRoleDTOToModel) })
            ),

            catchError(
               err => of(
                  slice.actions.getRolesFailure({ error: extractError(err, "Failed to get roles") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get roles" })
               )
            )

         )

      )

   )

}


const updateRoles: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateRoles.match
      ),
      switchMap(

         action => deps.apiClients.users.updateRoles(action.payload.uuid, action.payload.roles).pipe(

            map(
               user => slice.actions.updateRolesSuccess({ user: transformUserDetailDTOToModel(user) })
            ),

            catchError(
               err => of(
                  slice.actions.updateRolesFailure({ error: extractError(err, "Failed to update roles") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update roles" })
               )
            )

         )

      )

   )

}


const addRole: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addRole.match
      ),
      switchMap(

         action => deps.apiClients.users.addRole(action.payload.uuid, action.payload.roleUuid).pipe(

            map(
               user => slice.actions.addRoleSuccess({ user: transformUserDetailDTOToModel(user) })
            ),

            catchError(
               err => of(
                  slice.actions.addRoleFailure({ error: extractError(err, "Failed to add role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to add role" })
               )
            )

         )

      )

   )

}


const removeRole: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.removeRole.match
      ),
      switchMap(

         action => deps.apiClients.users.removeRole(action.payload.uuid, action.payload.roleUuid).pipe(

            map(
               user => slice.actions.removeRoleSuccess({ user: transformUserDetailDTOToModel(user) })
            ),

            catchError(
               err => of(
                  slice.actions.removeRoleFailure({ error: extractError(err, "Failed to remove role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to remove role" })
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
   deleteUser,
   enable,
   disable,
   getRoles,
   updateRoles,
   addRole,
   removeRole,
];

export default epics;