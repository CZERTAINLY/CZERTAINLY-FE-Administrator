import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./users";
import { actions as alertActions } from "./alerts";

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

            map(list => slice.actions.listSuccess({ users: list.map(transformUserDTOToModel) })),

            catchError(err => of(slice.actions.listFailure({ error: extractError(err, "Failed to get user list") })))

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

         action => deps.apiClients.users.detail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getDetailSuccess({ user: transformUserDetailDTOToModel(detail) })
            ),

            catchError(
               err => of(slice.actions.getDetailFailure({ error: extractError(err, "Failed to load user detail") }))
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


const createUser: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.create.match
      ),

      switchMap(

         action => deps.apiClients.users.create(
            action.payload.username,
            action.payload.firstName,
            action.payload.lastName,
            action.payload.email,
            action.payload.enabled,
            action.payload.certificateUuid,
            action.payload.certificate ? transformCertModelToDTO(action.payload.certificate) : undefined
         ).pipe(

            map(userDetailDTO => slice.actions.createSuccess({ user: transformUserDetailDTOToModel(userDetailDTO) })),

            catchError(err => of(slice.actions.createFailure({ error: extractError(err, "Failed to create user") })))

         )

      ),

      catchError(err => of(slice.actions.createFailure({ error: extractError(err, "Failed to create user") }))),

   )

}


const createAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createSuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload.user.uuid}`);
            return EMPTY;
         }

      )

   )

}


const createAdminFailure: AppEpic = (action$, state, deps) => {

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

         action => deps.apiClients.users.update(
            action.payload.uuid,
            action.payload.firstName,
            action.payload.lastName,
            action.payload.email,
            action.payload.enabled,
            action.payload.certificateUuid,
            action.payload.certificate ? transformCertModelToDTO(action.payload.certificate) : undefined
         ).pipe(

            map(
               userDetailDTO => slice.actions.updateSuccess({ user: transformUserDetailDTOToModel(userDetailDTO) })
            ),

            catchError(
               err => of(slice.actions.updateFailure({ error: extractError(err, "Failed to update user") }))
            )

         )

      ),

      catchError(
         err => of(slice.actions.updateFailure({ error: extractError(err, "Failed to update user") }))
      ),

   )


}


const updateSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateSuccess.match
      ),
      switchMap(

         action => {
            history.push(`../detail/${action.payload.user.uuid}`);
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


const deletUser: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteUser.match
      ),
      switchMap(

         action => deps.apiClients.users.delete(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteUserSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.deleteUserFailure({ error: extractError(err, "Failed to delete user") }))
            )

         )

      )

   )

}

const deleteUserSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteUserSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}

const deleteUserFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteUserFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const enable: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enable.match
      ),
      switchMap(

         action => deps.apiClients.users.enable(action.payload.uuid).pipe(

            map(
               () => slice.actions.enableSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.enableFailure({ error: extractError(err, "Failed to enable user") }))
            )

         )

      )

   )

}


const enableFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const disable: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disable.match
      ),
      switchMap(

         action => deps.apiClients.users.disable(action.payload.uuid).pipe(

            map(
               () => slice.actions.disableSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.disableFailure({ error: extractError(err, "Failed to disable user") }))
            )

         )

      )

   )

}


const disableFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.getRolesFailure({ error: extractError(err, "Failed to get roles") }))
            )

         )

      )

   )

}


const getRolesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getRolesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.updateRolesFailure({ error: extractError(err, "Failed to update roles") }))
            )

         )

      )

   )

}


const updateRolesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateRolesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.addRoleFailure({ error: extractError(err, "Failed to add role") }))
            )

         )

      )

   )

}


const addRoleFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addRoleFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.removeRoleFailure({ error: extractError(err, "Failed to remove role") }))
            )

         )

      )

   )

}


const removeRoleFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.removeRoleFailure.match
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
   createUser,
   createAdminSuccess,
   createAdminFailure,
   update,
   updateSuccess,
   updateFailure,
   deletUser,
   deleteUserSuccess,
   deleteUserFailure,
   enable,
   enableFailure,
   disable,
   disableFailure,
   getRoles,
   getRolesFailure,
   updateRoles,
   updateRolesFailure,
   addRole,
   addRoleFailure,
   removeRole,
   removeRoleFailure
];

export default epics;