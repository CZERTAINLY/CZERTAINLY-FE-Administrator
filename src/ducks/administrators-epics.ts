import { EMPTY, of } from "rxjs";
import { catchError, concatMap, filter, map, mergeMap, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./administrators";
import { actions as alertActions } from "./alerts";

import { readFileString$ } from "utils/readFile";
import { getCertificateInformation } from "utils/certificate";
import { transformCertModelToCertDTO } from "./transform/certificates";
import { transformAdminDtoToAdminModel } from "./transform/administrators";


const listAdmins: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAdmins.match
      ),
      switchMap(

         () => deps.apiClients.admins.getAdminsList().pipe(

            map(list => slice.actions.listAdminsSuccess(list.map(adminDto => transformAdminDtoToAdminModel(adminDto)))),

            catchError(err => of(slice.actions.listAdminFailure(extractError(err, "Failed to get administrators list"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}



const getAdminDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAdminDetail.match
      ),
      switchMap(

         action => deps.apiClients.admins.getAdminDetail(action.payload).pipe(

            map(detail => slice.actions.getAdminDetailSuccess(transformAdminDtoToAdminModel(detail))),

            catchError(err => of(slice.actions.getAdminDetailFailure(extractError(err, "Failed to load administrator detail"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const createAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAdmin.match
      ),

      mergeMap(

         action => (action.payload.certificate ? readFileString$(action.payload.certificate) : of("")).pipe(

            switchMap(

               certificateContent => deps.apiClients.admins.createAdmin(
                  action.payload.username,
                  action.payload.name,
                  action.payload.surname,
                  action.payload.email,
                  action.payload.description,
                  action.payload.role,
                  false,
                  action.payload.certificateUuid,
                  certificateContent ? transformCertModelToCertDTO(getCertificateInformation(certificateContent as string)) : undefined
               ).pipe(

                  map(uuid => slice.actions.createAdminSuccess(uuid)),

                  catchError(err => of(slice.actions.createAdminFailure(extractError(err, "Failed to create administrator"))))

               )

            ),

            catchError(err => of(slice.actions.updateAdminFailure(extractError(err, "Failed to update administrator")))),

         )

      )

   )

}


const createAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAdminSuccess.match
      ),
      concatMap(

         action => {
            history.push(`./detail/${action.payload}`);
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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const updateAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAdmin.match
      ),
      mergeMap(

         action => (action.payload.certificate ? readFileString$(action.payload.certificate) : of("")).pipe(

            switchMap(

               certificateContent => deps.apiClients.admins.updateAdmin(
                  action.payload.uuid,
                  action.payload.username,
                  action.payload.name,
                  action.payload.surname,
                  action.payload.email,
                  action.payload.description,
                  action.payload.role,
                  action.payload.certificateUuid,
                  certificateContent ? transformCertModelToCertDTO(getCertificateInformation(certificateContent as string)) : undefined
               ).pipe(

                  map(adminDTO => slice.actions.updateAdminSuccess(transformAdminDtoToAdminModel(adminDTO))),

                  catchError(err => of(slice.actions.updateAdminFailure(extractError(err, "Failed to update administrator"))))

               )

            ),

            catchError(err => of(slice.actions.updateAdminFailure(extractError(err, "Failed to update administrator")))),

         )

      )

   )

}


const updateAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAdminSuccess.match
      ),
      concatMap(

         action => {
            history.push(`../detail/${action.payload.uuid}`);
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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const deleteAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.deleteAdmin(action.payload).pipe(

            map(() => slice.actions.deleteAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.deleteAdminFailure(extractError(err, "Failed to delete administrator"))))

         )

      )

   )

}

const deleteAdminSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAdminSuccess.match
      ),
      concatMap(

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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkDeleteAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkDeleteAdmin(action.payload).pipe(

            map(() => slice.actions.bulkDeleteAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDeleteAdminFailure(extractError(err, "Failed to delete selected administrators"))))

         )

      )

   )

}


const bulkDeleteAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const enableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.enableAdmin(action.payload).pipe(

            map(() => slice.actions.enableAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.enableAdminFailure(extractError(err, "Failed to enable administrator"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkEnableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkEnableAdmin(action.payload).pipe(

            map(() => slice.actions.bulkEnableAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkEnableAdminFailure(extractError(err, "Failed to enable selected administrators"))))

         )

      )

   )

}


const bulkEnableAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const disableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.disableAdmin(action.payload).pipe(

            map(() => slice.actions.disableAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.disableAdminFailure(extractError(err, "Failed to disable administrator"))))

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
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkDisableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkDisableAdmin(action.payload).pipe(

            map(() => slice.actions.bulkDisableAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDisableAdminFailure(extractError(err, "Failed to disable selected administrators"))))

         )

      )

   )

}


const bulkDisableAdminFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAdminFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const epics = [
   listAdmins,
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