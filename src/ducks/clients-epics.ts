import { EMPTY, of } from "rxjs";
import { catchError, concatMap, filter, map, mergeMap, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./clients";
import { actions as alertActions } from "./alerts";

import { readFileString$ } from "utils/readFile";
import { getCertificateInformation } from "utils/certificate";

import { transformCertModelToCertDTO } from "./transform/certificates";
import { transformClientDTOToClientModel } from "./transform/clients";

import { useHistory } from "react-router";


const listClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listClients.match
      ),
      switchMap(

         () => deps.apiClients.clients.getClientsList().pipe(

            map(list => slice.actions.listClientsSuccess(list.map(clientDto => transformClientDTOToClientModel(clientDto)))),

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

            map(detail => slice.actions.getClientDetailSuccess(transformClientDTOToClientModel(detail))),

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

            map(profiles => slice.actions.getAuthorizedProfilesSuccess(profiles))

         )

      )

   )

};


const getAuthorizedProfileFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorizedProfileFailure.match
      ),

   )

};


const createClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createClient.match
      ),

   )

};


const createClientSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createClientSuccess.match
      ),

   )

};


const createClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createClientFailure.match
      ),

   )

};


const updateClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateClient.match
      ),

   )

};


const updateClientSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateClientSuccess.match
      ),

   )

};


const updateClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateClientFailure.match
      ),

   )

};


const deleteClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClient.match
      ),

   )

};


const deleteClientSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClientSuccess.match
      ),

   )

};


const deleteClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteClientFailure.match
      ),

   )

};


const bulkDeleteClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteClients.match
      ),

   )

};


const bulkDeleteClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteClientsFailure.match
      ),

   )

};


const authorizeClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeClient.match
      ),

   )

};


const authorizeClientFailed: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeClientFailed.match
      ),

   )

};


const enableClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableClient.match
      ),

   )

};


const enableClientFailed: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableClientFailed.match
      ),

   )

};


const bulkEnableClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableClients.match
      ),

   )

};


const bulkEnableClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableClientsFailure.match
      ),

   )

};


const disableClient: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableClient.match
      ),

   )

};


const disableClientFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableClientFailure.match
      ),

   )

};


const bulkDisableClients: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableClients.match
      ),

   )

};


const bulkDisableClientsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableClientsFailure.match
      ),

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
   authorizeClientFailed,
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
