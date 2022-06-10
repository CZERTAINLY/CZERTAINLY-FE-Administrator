import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./clients";
import { actions as alertActions } from "./alerts";

import { readFileString$ } from "utils/readFile";
import { getCertificateInformation } from "utils/certificate";

import { transformCertModelToDTO } from "./transform/certificates";
import { transformClientAuthorizedProfileDTOToModel, transformClientDTOToModel } from "./transform/clients";


const listClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listClients.match
      ),
      switchMap(

         () => deps.apiClients.clients.getClientsList().pipe(

            map(list => slice.actions.listClientsSuccess(list.map(clientDto => transformClientDTOToModel(clientDto)))),

            catchError(err => of(slice.actions.listClientsFailure(extractError(err, "Failed to get clients list"))))

         )

      )

   )

};


const listClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listClientsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")

      )

   )

};


const getClientDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getClientDetail.match
      ),

      switchMap(

         action => deps.apiClients.clients.getClientDetail(action.payload).pipe(

            map(detail => slice.actions.getClientDetailSuccess(transformClientDTOToModel(detail))),

            catchError(err => of(slice.actions.getClientDetailFailure(extractError(err, "Failed to load administrator detail"))))

         )

      )

   )

};


const getClientDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getClientDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const getAuthorizedProfiles: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorizedProfiles.match
      ),
      switchMap(

         action => deps.apiClients.clients.getAuthorizedProfiles(action.payload).pipe(

            map(profiles => slice.actions.getAuthorizedProfilesSuccess(
               profiles.map(profile => transformClientAuthorizedProfileDTOToModel(profile)))
            )

         )

      )

   )

};


const getAuthorizedProfileFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorizedProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const createClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createClient.match
      ),

      switchMap(

         action => (action.payload.certificate ? readFileString$(action.payload.certificate) : of("")).pipe(

            switchMap(

               certificateContent => deps.apiClients.clients.createNewClient(
                  action.payload.name,
                  action.payload.description,
                  false,
                  action.payload.certificateUuid,
                  certificateContent ? transformCertModelToDTO(getCertificateInformation(certificateContent as string)) : undefined
               ).pipe(

                  map(uuid => slice.actions.createClientSuccess(uuid)),

                  catchError(err => of(slice.actions.createClientFailure(extractError(err, "Failed to create client"))))
               )

            ),

            catchError(err => of(slice.actions.createClientFailure(extractError(err, "Failed to update administrator")))),

         )

      )

   )

};


const createClientSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createClientSuccess.match
      ),
      switchMap(

         action => {
            history.push(`./detail/${action.payload}`);
            return EMPTY;
         }

      )

   )

};


const createClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const updateClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateClient.match
      ),


      switchMap(

         action => (action.payload.certificate ? readFileString$(action.payload.certificate) : of("")).pipe(


            switchMap(

               certificateContent => deps.apiClients.clients.updateClient(
                  action.payload.uuid,
                  action.payload.description,
                  action.payload.certificateUuid,
                  certificateContent ? transformCertModelToDTO(getCertificateInformation(certificateContent as string)) : undefined
               ).pipe(

                  map(clientDTO => slice.actions.updateClientSuccess(transformClientDTOToModel(clientDTO))),

                  catchError(err => of(slice.actions.updateClientFailure(extractError(err, "Failed to update client"))))

               )
            ),

            catchError(err => of(slice.actions.updateClientFailure(extractError(err, "Failed to update client"))))

         )

      )

   )

};


const updateClientSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateClientSuccess.match
      ),
      switchMap(

         action => {
            history.push(`../detail/${action.payload.uuid}`);
            return EMPTY;
         }

      )

   )

};


const updateClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const deleteClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClient.match
      ),

      switchMap(

         action => deps.apiClients.clients.deleteClient(action.payload).pipe(

            map(() => slice.actions.deleteClientSuccess(action.payload)),

            catchError(err => of(slice.actions.deleteClientFailure(extractError(err, "Failed to delete administrator"))))

         )

      )

   )

};


const deleteClientSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClientSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

};


const deleteClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const bulkDeleteClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteClients.match
      ),
      switchMap(

         action => deps.apiClients.clients.bulkDeleteClient(action.payload).pipe(

            map(() => slice.actions.bulkDeleteClientsSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDeleteClientsFailure(extractError(err, "Failed to delete selected clients"))))

         )

      )

   )

};


const bulkDeleteClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteClientsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const authorizeClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeClient.match
      ),
      switchMap(

         action => deps.apiClients.clients.authorizeClient(
            action.payload.clientUuid,
            action.payload.raProfile.uuid
         ).pipe(

            map(() => slice.actions.authorizeClientSuccess(action.payload)),

            catchError(err => of(slice.actions.authorizeClientFailure(extractError(err, "Failed to authorize client"))))

         )

      )


   )

};


const authorizeClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const unauthorizeClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.unauthorizeClient.match
      ),
      switchMap(

         action => deps.apiClients.clients.unauthorizeClient(action.payload.clientUuid, action.payload.raProfile.uuid).pipe(

            map(() => slice.actions.unauthorizeClientSuccess(action.payload)),

            catchError(err => of(slice.actions.unauthorizeClientFailure(extractError(err, "Failed to unauthorize client"))))

         )

      )

   )

};


const unauthorizeClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.unauthorizeClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const enableClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableClient.match
      ),
      switchMap(

         action => deps.apiClients.clients.enableClient(action.payload).pipe(

            map(() => slice.actions.enableClientSuccess(action.payload)),

            catchError(err => of(slice.actions.enableClientFailure(extractError(err, "Failed to enable client"))))

         )

      )

   )

};


const enableClientFailed: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const bulkEnableClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableClients.match
      ),
      switchMap(

         action => deps.apiClients.clients.bulkEnableClient(action.payload).pipe(

            map(() => slice.actions.bulkEnableClientsSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkEnableClientsFailure(extractError(err, "Failed to enable clients"))))

         )

      )

   )

};


const bulkEnableClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableClientsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const disableClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableClient.match
      ),
      switchMap(

         action => deps.apiClients.clients.disableClient(action.payload).pipe(

            map(() => slice.actions.disableClientSuccess(action.payload)),

            catchError(err => of(slice.actions.disableClientFailure(extractError(err, "Failed to disable client"))))

         )

      )

   )

};


const disableClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableClientFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const bulkDisableClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableClients.match
      ),
      switchMap(

         action => deps.apiClients.clients.bulkDisableClient(action.payload).pipe(

            map(() => slice.actions.bulkDisableClientsSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDisableClientsFailure(extractError(err, "Failed to disable clients"))))

         )

      )

   )

};


const bulkDisableClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableClientsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

};


const epics = [
   listClients,
   listClientsFailure,
   getClientDetail,
   getClientDetailFailure,
   getAuthorizedProfiles,
   getAuthorizedProfileFailure,
   createClient,
   createClientSuccess,
   createClientFailure,
   updateClient,
   updateClientSuccess,
   updateClientFailure,
   deleteClient,
   deleteClientSuccess,
   deleteClientFailure,
   bulkDeleteClients,
   bulkDeleteClientsFailure,
   authorizeClient,
   authorizeClientFailure,
   unauthorizeClient,
   unauthorizeClientFailure,
   enableClient,
   enableClientFailed,
   bulkEnableClients,
   bulkEnableClientsFailure,
   disableClient,
   disableClientFailure,
   bulkDisableClients,
   bulkDisableClientsFailure,
];

export default epics;
