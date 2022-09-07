import { ClientAuthorizedRaProfileModel, ClientModel } from "models/clients";

import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaProfileModel } from "models/ra-profiles";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";
import { CertificateModel } from "models";


export type State = {

   checkedRows: string[],

   clients: ClientModel[],

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   client?: ClientModel,
   authorizedProfiles: ClientAuthorizedRaProfileModel[];

   isFetchingList: boolean,
   isFetchingDetail: boolean,
   isFetchingAuthorizedProfiles: boolean,
   isCreating: boolean,
   isUpdating: boolean,
   isDeleting: boolean,
   isAuthorizing: boolean,
   isUnauthorizing: boolean,
   isEnabling: boolean,
   isDisabling: boolean,
   isBulkEnabling: boolean,
   isBulkDisabling: boolean,
   isBulkDeleting: boolean

};


export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   clients: [],
   authorizedProfiles: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isFetchingAuthorizedProfiles: false,
   isCreating: false,
   isUpdating: false,
   isDeleting: false,
   isAuthorizing: false,
   isUnauthorizing: false,
   isEnabling: false,
   isDisabling: false,
   isBulkEnabling: false,
   isBulkDisabling: false,
   isBulkDeleting: false

};


export const slice = createSlice({

   name: "clients",

   initialState,

   reducers: {


      resetState: (state, action: PayloadAction<void>) => {

         state = initialState;

      },


      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },


      listClients: (state, action: PayloadAction<void>) => {

         state.checkedRows = [];
         state.isFetchingList = true;

      },


      listClientsSuccess: (state, action: PayloadAction<{ clientList: ClientModel[] }>) => {

         state.isFetchingList = false;
         state.clients = action.payload.clientList;

      },


      listClientsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      getClientDetail: (state, action: PayloadAction<{ uuid: string }>) => {

         state.client = undefined;
         state.isFetchingDetail = true;

      },


      getClientDetailSuccess: (state, action: PayloadAction<{ client: ClientModel }>) => {

         state.isFetchingDetail = false;

         state.client = action.payload.client;

         const clientIndex = state.clients.findIndex(client => client.uuid === action.payload.client.uuid);

         if (clientIndex >= 0) {
            state.clients[clientIndex] = action.payload.client;
         } else {
            state.clients.push(action.payload.client);
         }

      },


      getClientDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false;

      },


      getAuthorizedProfiles: (state, action: PayloadAction<{ clientUuid: string }>) => {

         state.authorizedProfiles = [];
         state.isFetchingAuthorizedProfiles = true;

      },


      getAuthorizedProfilesSuccess: (state, action: PayloadAction<{ clientUuid: string, authorizedProfiles: ClientAuthorizedRaProfileModel[]}>) => {

         state.authorizedProfiles = action.payload.authorizedProfiles;
         state.isFetchingAuthorizedProfiles = false;

      },


      getAuthorizedProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAuthorizedProfiles = false;

      },


      createClient: (state, action: PayloadAction<{
         name: string,
         description: string
         certificate: CertificateModel | undefined,
         certificateUuid: string,
      }>) => {

         state.isCreating = true;

      },


      createClientSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isCreating = false;

      },


      createClientFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      updateClient: (state, action: PayloadAction<{
         uuid: string,
         description: string
         certificate: CertificateModel | undefined,
         certificateUuid: string,
      }>) => {

         state.isUpdating = true;

      },


      updateClientSuccess: (state, action: PayloadAction<{ client: ClientModel }>) => {

         state.isUpdating = false;

         const clientIndex = state.clients.findIndex(client => client.uuid === action.payload.client.uuid);

         if (clientIndex >= 0) {
            state.clients[clientIndex] = action.payload.client;
         } else {
            state.clients.push(action.payload.client);
         }

         if (state.client?.uuid === action.payload.client.uuid) state.client = action.payload.client;

      },


      updateClientFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false;

      },


      deleteClient: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = true;

      },


      deleteClientSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = false;

         state.checkedRows = [];

         const clientIndex = state.clients.findIndex(client => client.uuid === action.payload.uuid);

         if (clientIndex >= 0) state.clients.splice(clientIndex, 1);

         if (state.client?.uuid === action.payload.uuid) {
            state.client = undefined;
            state.authorizedProfiles = [];
         }

      },


      deleteClientFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false;
         state.deleteErrorMessage = action.payload.error || "Unknown error";

      },


      bulkDeleteClients: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteClientsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = false;

         state.isDeleting = false;
         state.checkedRows = [];

         action.payload.uuids.forEach(

            uuid => {

               const clientIndex = state.clients.findIndex(client => client.uuid === uuid);
               if (clientIndex >= 0) state.clients.splice(clientIndex, 1);

            }
         )

         if (state.client && action.payload.uuids.includes(state.client.uuid)) {
            state.client = undefined;
            state.authorizedProfiles = [];
         }

      },


      bulkDeleteClientsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      authorizeClient: (state, action: PayloadAction<{ clientUuid: string, raProfile: RaProfileModel | ClientAuthorizedRaProfileModel }>) => {

         state.isAuthorizing = true;

      },


      authorizeClientSuccess: (state, action: PayloadAction<{ clientUuid: string, raProfile: RaProfileModel | ClientAuthorizedRaProfileModel }>) => {

         state.isAuthorizing = false;

         if (state.client?.uuid === action.payload.clientUuid && !state.authorizedProfiles.find(p => p.uuid === action.payload.raProfile.uuid)) {

            state.authorizedProfiles.push({
               uuid: action.payload.raProfile.uuid,
               name: action.payload.raProfile.name,
               description: action.payload.raProfile.description || "",
               enabled: action.payload.raProfile.enabled
            });

         }

      },


      authorizeClientFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isAuthorizing = false;

      },


      unauthorizeClient: (state, action: PayloadAction<{ clientUuid: string, raProfile: RaProfileModel | ClientAuthorizedRaProfileModel }>) => {

         state.isUnauthorizing = true;

      },


      unauthorizeClientSuccess: (state, action: PayloadAction<{ clientUuid: string, raProfile: RaProfileModel | ClientAuthorizedRaProfileModel }>) => {

         state.isUnauthorizing = false;

         if (state.client?.uuid !== action.payload.clientUuid) return;

         const authProfileIndex = state.authorizedProfiles.findIndex(authorizedProfile => authorizedProfile.uuid === action.payload.raProfile.uuid);

         if (authProfileIndex >=0 ) state.authorizedProfiles.splice(authProfileIndex, 1);

      },


      unauthorizeClientFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUnauthorizing = false;

      },

      enableClient: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = true;

      },


      enableClientSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = false;

         const client = state.clients.find(client => client.uuid === action.payload.uuid);

         if (client) client.enabled = true;

         if (state.client?.uuid === action.payload.uuid) state.client.enabled = true;

      },


      enableClientFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isEnabling = false;

      },


      bulkEnableClients: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableClientsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

         action.payload.uuids.forEach(

            uuid => {

               const client = state.clients.find(client => client.uuid === uuid);
               if (client) client.enabled = true;

            }

         )

         if (state.client && action.payload.uuids.includes(state.client.uuid)) state.client.enabled = true;


      },


      bulkEnableClientsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkEnabling = false;
      },


      disableClient: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = true;

      },


      disableClientSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = false;

         const client = state.clients.find(client => client.uuid === action.payload.uuid);

         if (client) client.enabled = false;

         if (state.client?.uuid === action.payload.uuid) state.client.enabled = false;

      },


      disableClientFailure: (state, action: PayloadAction<{ error: string | undefined}>) => {

         state.isDisabling = false;

      },


      bulkDisableClients: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableClientsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

         action.payload.uuids.forEach(

            uuid => {

               const client = state.clients.find(client => client.uuid === uuid);

               if (client) client.enabled = false;

            }

         )

         if (state.client && action.payload.uuids.includes(state.client.uuid)) state.client.enabled = false;

      },


      bulkDisableClientsFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkDisabling = false;

      },


   }

});


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state => state.checkedRows);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const client = createSelector(state, state => state.client);
const clients = createSelector(state, state => state.clients);
const authorizedProfiles = createSelector(state, state => state.authorizedProfiles);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isFetchingAuthorizedProfiles = createSelector(state, state => state.isFetchingAuthorizedProfiles);
const isCreating = createSelector(state, state => state.isCreating);
const isUpdating = createSelector(state, state => state.isUpdating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isAuthorizing = createSelector(state, state => state.isAuthorizing);
const isUnauthorizing = createSelector(state, state => state.isUnauthorizing);
const isEnabling = createSelector(state, state => state.isEnabling);
const isDisabling = createSelector(state, state => state.isDisabling);
const isBulkEnabling = createSelector(state, state => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, state => state.isBulkDisabling);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);


export const selectors = {

   state,

   checkedRows,

   deleteErrorMessage,
   bulkDeleteErrorMessages,

   client,
   clients,

   authorizedProfiles,

   isFetchingList,
   isFetchingDetail,
   isFetchingAuthorizedProfiles,
   isCreating,
   isUpdating,
   isDeleting,
   isAuthorizing,
   isUnauthorizing,
   isEnabling,
   isDisabling,
   isBulkEnabling,
   isBulkDisabling,
   isBulkDeleting

};


export const actions = slice.actions;


export default slice.reducer;