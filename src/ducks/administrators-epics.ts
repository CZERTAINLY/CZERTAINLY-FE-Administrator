import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./administrators";
import { AdministratorDTO } from "api/administrators";
import { AdministratorModel } from "models";


const adminDtoToAdminModel = (adminDto: AdministratorDTO): AdministratorModel => {
   return {
      uuid: adminDto.uuid,
      name: adminDto.name,
      username: adminDto.username,
      //certificate: Certificate,
      role: adminDto.role,
      email: adminDto.email,
      serialNumber: adminDto.serialNumber,
      description: adminDto.description,
      enabled: adminDto.enabled,
      surname: adminDto.surname
   }
}


const listAdmins: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAdmins.match
      ),
      switchMap(

         () => deps.apiClients.admins.getAdminsList().pipe(

            map(list => slice.actions.listAdminsSuccess(list.map(adminDto => adminDtoToAdminModel(adminDto)))),

            catchError(err => of(slice.actions.listAdminFailure(extractError(err, "Failed to get administrators list"))))

         )
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

            map(detail => slice.actions.getAdminDetailSuccess(adminDtoToAdminModel(detail))),

            catchError(err => of(slice.actions.getAdminDetailFailure(extractError(err, "Failed to administrator detail"))))

         )

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
            action.payload.name,
            action.payload.surname,
            action.payload.username,
            action.payload.email,
            action.payload.description,
            action.payload.superAdmin ? "superAdministrator" : "administrator",
            action.payload.enabled
         ).pipe(

            map(uuid => slice.actions.createAdminSuccess(uuid)),

            catchError(err => of(slice.actions.createAdminFailure(extractError(err, "Failed to create administrator"))))

         )

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
            action.payload.name,
            action.payload.surname,
            action.payload.username,
            action.payload.email,
            action.payload.certificate?.arrayBuffer.toString(),
            action.payload.description,
            action.payload.role,
            action.payload.certificateUuid
         ).pipe(

            map(adminDTO => slice.actions.updateAdminSuccess(adminDtoToAdminModel(adminDTO))),

            catchError(err => of(slice.actions.updateAdminFailure(extractError(err, "Failed to update administrator"))))

         )

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


const bulkEnableAdmin: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAdmin.match
      ),
      switchMap(

         action => deps.apiClients.admins.bulkEnableAdmin(action.payload).pipe(

            map(() => slice.actions.bulkEnableAdminSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDisableAdminFailure(extractError(err, "Failed to enable selected administrators"))))

         )

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

            catchError(err => of(slice.actions.disableAdmin(extractError(err, "Failed to disable administrator"))))

         )

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


const epics = [
   listAdmins,
   getAdminDetail,
   createAdmin,
   updateAdmin,
   deleteAdmin,
   bulkDeleteAdmin,
   enableAdmin,
   bulkEnableAdmin,
   disableAdmin,
   bulkDisableAdmin
];


export default epics;
