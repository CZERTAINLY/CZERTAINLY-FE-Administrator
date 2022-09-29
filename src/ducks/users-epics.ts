import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./users";
import { actions as alertActions } from "./alerts";

import { transformCertModelToDTO } from "./transform/certificates";
import { transformAdminDtoToModel } from "./transform/administrators";


const list: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAdmins.match
      ),
      switchMap(

         () => deps.apiClients.admins.getAdminsList().pipe(

            map(list => slice.actions.listSucces({ adminList: list.map(transformAdminDtoToModel) })),

            catchError(err => of(slice.actions.listAdminFailure({ error: extractError(err, "Failed to get administrators list") })))

         )
      )

   )

}


const listAdminsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}



const getAdminDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDetail.match
      ),
      switchMap(

         action => deps.apiClients.admins.getAdminDetail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getDetailSuccess({ administrator: transformAdminDtoToModel(detail) })
            ),

            catchError(
               err => of(slice.actions.getAdminDetailFailure({ error: extractError(err, "Failed to load administrator detail") }))
            )

         )

      )

   )

}


const getAdminDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAdminDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const createAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAdmin.match
      ),

      switchMap(

         action => deps.apiClients.admins.createAdmin(
            action.payload.username,
            action.payload.name,
            action.payload.surname,
            action.payload.email,
            action.payload.description,
            action.payload.role,
            false,
            action.payload.certificateUuid,
            action.payload.certificate ? transformCertModelToDTO(action.payload.certificate) : undefined
         ).pipe(

            map(uuid => slice.actions.createAdminSuccess({ uuid })),

            catchError(err => of(slice.actions.createAdminFailure({ error: extractError(err, "Failed to create administrator") })))

         )

      ),

      catchError(err => of(slice.actions.createAdminFailure({ error: extractError(err, "Failed to create administrator") }))),

   )

}


const createAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAdminSuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload.uuid}`);
            return EMPTY;
         }

      )

   )

}


const createAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const updateAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.updateAdmin(
            action.payload.uuid,
            action.payload.username,
            action.payload.name,
            action.payload.surname,
            action.payload.email,
            action.payload.description,
            action.payload.role,
            action.payload.certificateUuid,
            action.payload.certificate ? transformCertModelToDTO(action.payload.certificate) : undefined
         ).pipe(

            map(
               adminDTO => slice.actions.updateAdminSuccess({ administrator: transformAdminDtoToModel(adminDTO) })
            ),

            catchError(
               err => of(slice.actions.updateAdminFailure({ error: extractError(err, "Failed to update administrator") }))
            )

         )

      ),

      catchError(
         err => of(slice.actions.updateAdminFailure({ error: extractError(err, "Failed to update administrator") }))
      ),

   )


}


const updateAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAdminSuccess.match
      ),
      switchMap(

         action => {
            history.push(`../detail/${action.payload.administrator.uuid}`);
            return EMPTY;
         }

      )

   )

}


const updateAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const deleteAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.deleteAdmin(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteAdminSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.deleteAdminFailure({ error: extractError(err, "Failed to delete administrator") }))
            )

         )

      )

   )

}

const deleteAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAdminSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}

const deleteAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const bulkDeleteAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAdmins.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkDeleteAdmin(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkDeleteAdminsSuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkDeleteAdminsFailure({ error: extractError(err, "Failed to delete selected administrators") }))
            )

         )

      )

   )

}


const bulkDeleteAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAdminsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const enableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.enableAdmin(action.payload.uuid).pipe(

            map(
               () => slice.actions.enableAdminSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.enableAdminFailure({ error: extractError(err, "Failed to enable administrator") }))
            )

         )

      )

   )

}


const enableAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const bulkEnableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAdmins.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkEnableAdmin(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkEnableAdminsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(slice.actions.bulkEnableAdminsFailure({ error: extractError(err, "Failed to enable selected administrators") }))
            )

         )

      )

   )

}


const bulkEnableAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAdminsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const disableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.disableAdmin(action.payload.uuid).pipe(

            map(
               () => slice.actions.disableAdminSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.disableAdminFailure({ error: extractError(err, "Failed to disable administrator") }))
            )

         )

      )

   )

}



const disableAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const bulkDisableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAdmins.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkDisableAdmin(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkDisableAdminsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(slice.actions.bulkDisableAdminsFailure({ error: extractError(err, "Failed to disable selected administrators") }))
            )

         )

      )

   )

}


const bulkDisableAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAdminsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const epics = [
   list,
   listAdminsFailure,
   getAdminDetail,
   getAdminDetailFailure,
   createAdmin,
   createAdminSuccess,
   createAdminFailure,
   updateAdmin,
   updateAdminSuccess,
   updateAdminFailure,
   deleteAdmin,
   deleteAdminSuccess,
   deleteAdminFailure,
   bulkDeleteAdmin,
   bulkDeleteAdminFailure,
   enableAdmin,
   enableAdminFailure,
   bulkEnableAdmin,
   bulkEnableAdminFailure,
   disableAdmin,
   disableAdminFailure,
   bulkDisableAdmin,
   bulkDisableAdminFailure
];

export default epics;