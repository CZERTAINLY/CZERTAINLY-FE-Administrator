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

            map(
               list => slice.actions.listClientsSuccess({ clientList: list.map(clientDto => transformClientDTOToModel(clientDto)) })
            ),
            catchError(
               err => of(slice.actions.listClientsFailure({ error: extractError(err, "Failed to get clients list") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const getClientDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getClientDetail.match
      ),

      switchMap(

         action => deps.apiClients.clients.getClientDetail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getClientDetailSuccess({ client: transformClientDTOToModel(detail) })
            ),
            catchError(
               err => of(slice.actions.getClientDetailFailure({ error: extractError(err, "Failed to load client detail") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const getAuthorizedProfiles: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorizedProfiles.match
      ),
      switchMap(

         action => deps.apiClients.clients.getAuthorizedProfiles(action.payload.clientUuid).pipe(

            map(
               profiles => slice.actions.getAuthorizedProfilesSuccess({
                  clientUuid: action.payload.clientUuid,
                  authorizedProfiles: profiles.map(profileDto => transformClientAuthorizedProfileDTOToModel(profileDto))
               })
            ),
            catchError(
               err => of(slice.actions.getAuthorizedProfilesFailure({ error: extractError(err, "Failed to get authorized profiles") }))
            )

         )

      )

   )

};


const getAuthorizedProfilesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorizedProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

                  map(
                     uuid => slice.actions.createClientSuccess({ uuid })
                  ),
                  catchError(
                     err => of(slice.actions.createClientFailure({ error: extractError(err, "Failed to create client") }))
                  )

               )

            ),
            catchError(
               err => of(slice.actions.createClientFailure({ error: extractError(err, "Failed to create client") }))
            ),

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
            history.push(`./detail/${action.payload.uuid}`);
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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

                  map(
                     clientDTO => slice.actions.updateClientSuccess({ client: transformClientDTOToModel(clientDTO) })
                  ),
                  catchError(
                     err => of(slice.actions.updateClientFailure({ error: extractError(err, "Failed to update client") }))
                  )

               )
            ),

            catchError(
               err => of(slice.actions.updateClientFailure({ error: extractError(err, "Failed to update client") }))
            )

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
            history.push(`../detail/${action.payload.client.uuid}`);
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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const deleteClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClient.match
      ),

      switchMap(

         action => deps.apiClients.clients.deleteClient(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteClientSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteClientFailure({ error: extractError(err, "Failed to delete client") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const bulkDeleteClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteClients.match
      ),
      switchMap(

         action => deps.apiClients.clients.bulkDeleteClient(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkDeleteClientsSuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkDeleteClientsFailure({ error: extractError(err, "Failed to delete selected clients") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

            map(
               () => slice.actions.authorizeClientSuccess({ clientUuid: action.payload.clientUuid, raProfile: action.payload.raProfile })
            ),
            catchError(
               err => of(slice.actions.authorizeClientFailure({ error: extractError(err, "Failed to authorize client") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

            map(
               () => slice.actions.unauthorizeClientSuccess({ clientUuid: action.payload.clientUuid, raProfile: action.payload.raProfile })
            ),

            catchError(
               err => of(slice.actions.unauthorizeClientFailure({ error: extractError(err, "Failed to unauthorize client") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const enableClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableClient.match
      ),
      switchMap(

         action => deps.apiClients.clients.enableClient(action.payload.uuid).pipe(

            map(
               () => slice.actions.enableClientSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.enableClientFailure({ error: extractError(err, "Failed to enable client") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const bulkEnableClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableClients.match
      ),
      switchMap(

         action => deps.apiClients.clients.bulkEnableClient(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkEnableClientsSuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkEnableClientsFailure({ error: extractError(err, "Failed to enable clients") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const disableClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableClient.match
      ),
      switchMap(

         action => deps.apiClients.clients.disableClient(action.payload.uuid).pipe(

            map(
               () => slice.actions.disableClientSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.disableClientFailure({ error: extractError(err, "Failed to disable client") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const bulkDisableClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableClients.match
      ),
      switchMap(

         action => deps.apiClients.clients.bulkDisableClient(action.payload.uuids).pipe(

            map(() => slice.actions.bulkDisableClientsSuccess({ uuids: action.payload.uuids })),

            catchError(err => of(slice.actions.bulkDisableClientsFailure({ error: extractError(err, "Failed to disable clients") })))

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

};


const epics = [
   listClients,
   listClientsFailure,
   getClientDetail,
   getClientDetailFailure,
   getAuthorizedProfiles,
   getAuthorizedProfilesFailure,
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
