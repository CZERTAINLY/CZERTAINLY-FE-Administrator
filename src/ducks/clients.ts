import { ClientAuthorizedRaProfileModel, ClientModel } from "models/clients";

import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaProfileModel } from "models/ra-profiles";


export type State = {

   checkedRows: string[],

   clients: ClientModel[],

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


      setCheckedRows: (state, action: PayloadAction<string[]>) => {

         state.checkedRows = action.payload;

      },


      listClients: (state, action: PayloadAction<void>) => {

         state.checkedRows = [];
         state.isFetchingList = true;

      },


      listClientsSuccess: (state, action: PayloadAction<ClientModel[]>) => {

         state.isFetchingList = false;
         state.clients = action.payload;

      },


      listClientsFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingList = false;

      },


      getClientDetail: (state, action: PayloadAction<string>) => {

         state.client = undefined;
         state.isFetchingDetail = true;

      },


      getClientDetailSuccess: (state, action: PayloadAction<ClientModel>) => {

         state.client = action.payload;
         state.isFetchingDetail = false;

      },


      getClientDetailFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingDetail = false;

      },


      getAuthorizedProfiles: (state, action: PayloadAction<string>) => {

         state.authorizedProfiles = [];
         state.isFetchingAuthorizedProfiles = true;

      },


      getAuthorizedProfilesSuccess: (state, action: PayloadAction<ClientAuthorizedRaProfileModel[]>) => {

         state.authorizedProfiles = action.payload;
         state.isFetchingAuthorizedProfiles = false;

      },


      getAuthorizedProfileFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingAuthorizedProfiles = false;

      },


      createClient: (state, action: PayloadAction<{
         name: string,
         description: string
         certificate: FileList | undefined,
         certificateUuid: string,
      }>) => {

         state.isCreating = true;

      },


      createClientSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      createClientFailure: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      updateClient: (state, action: PayloadAction<{
         uuid: string,
         description: string
         certificate: FileList | undefined,
         certificateUuid: string,
      }>) => {

         state.isUpdating = true;

      },


      updateClientSuccess: (state, action: PayloadAction<ClientModel>) => {

         state.isUpdating = false;

         const clientIndex = state.clients.findIndex(client => client.uuid === action.payload.uuid);
         if (clientIndex >= 0) state.clients[clientIndex] = action.payload;

         if (state.client?.uuid === action.payload.uuid) state.client = action.payload;

      },


      updateClientFailure: (state, action: PayloadAction<string>) => {

         state.isUpdating = false;

      },


      deleteClient: (state, action: PayloadAction<string>) => {

         state.isDeleting = true;

      },


      deleteClientSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;
         state.checkedRows = [];

         const clientIndex = state.clients.findIndex(client => client.uuid === action.payload);
         if (clientIndex >= 0) state.clients.splice(clientIndex, 1);

         if (state.client?.uuid === action.payload) {
            state.client = undefined;
            state.authorizedProfiles = [];
         }

      },


      deleteClientFailure: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

      },


      bulkDeleteClients: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteClientsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = false;

         state.isDeleting = false;
         state.checkedRows = [];

         action.payload.forEach(
            uuid => {

               const clientIndex = state.clients.findIndex(client => client.uuid === uuid);
               if (clientIndex >= 0) state.clients.splice(clientIndex, 1);

               if (state.client?.uuid === uuid) {
                  state.client = undefined;
                  state.authorizedProfiles = [];
               }

            }
         )

      },


      bulkDeleteClientsFailure: (state, action: PayloadAction<string>) => {

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


      authorizeClientFailure: (state, action: PayloadAction<string>) => {

         state.isAuthorizing = false;

      },


      unauthorizeClient: (state, action: PayloadAction<{ clientUuid: string, raProfile: RaProfileModel | ClientAuthorizedRaProfileModel }>) => {

         state.isUnauthorizing = true;

      },


      unauthorizeClientSuccess: (state, action: PayloadAction<{ clientUuid: string, raProfile: RaProfileModel | ClientAuthorizedRaProfileModel }>) => {

         state.isUnauthorizing = false;

         if (state.client?.uuid !== action.payload.clientUuid) return;

         const authProfileIndex = state.authorizedProfiles.findIndex(authorizedProfile => authorizedProfile.uuid === action.payload.raProfile.uuid);
         if (authProfileIndex === -1) return;

         state.authorizedProfiles.splice(authProfileIndex, 1);

      },


      unauthorizeClientFailure: (state, action: PayloadAction<string>) => {

         state.isUnauthorizing = false;

      },

      enableClient: (state, action: PayloadAction<string>) => {

         state.isEnabling = true;

      },


      enableClientSuccess: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

         const client = state.clients.find(client => client.uuid === action.payload);
         if (client) client.enabled = true;

         if (state.client?.uuid === action.payload) state.client.enabled = true;

      },


      enableClientFailure: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

      },


      bulkEnableClients: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableClientsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = false;

         action.payload.forEach(

            uuid => {

               const client = state.clients.find(client => client.uuid === uuid);
               if (client) client.enabled = true;

               if (state.client?.uuid === uuid) state.client.enabled = true;

            }

         )

      },


      bulkEnableClientsFailure: (state, action: PayloadAction<string>) => {

         state.isBulkEnabling = false;
      },


      disableClient: (state, action: PayloadAction<string>) => {

         state.isDisabling = true;

      },


      disableClientSuccess: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

         const client = state.clients.find(client => client.uuid === action.payload);
         if (client) client.enabled = false;

         if (state.client?.uuid === action.payload) state.client.enabled = false;

      },


      disableClientFailure: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

      },


      bulkDisableClients: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableClientsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = false;

         action.payload.forEach(

            uuid => {

               const client = state.clients.find(client => client.uuid === uuid);
               if (client) client.enabled = false;

               if (state.client?.uuid === uuid) state.client.enabled = false;

            }

         )


      },


      bulkDisableClientsFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDisabling = false;
      },


   }

});


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state => state.checkedRows);

const clients = createSelector(state, state => state.clients);
const client = createSelector(state, state => state.client);
const authorizedProfiles = createSelector(state, state => state.authorizedProfiles);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isFetchingAuthorizedProfiles = createSelector(state, state => state.isFetchingAuthorizedProfiles);
const isCreating = createSelector(state, state => state.isCreating);
const isUpdating = createSelector(state, state => state.isUpdating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isAuthorizing = createSelector(state, state => state.isAuthorizing);
const isUnuthorizing = createSelector(state, state => state.isUnauthorizing);
const isEnabling = createSelector(state, state => state.isEnabling);
const isDisabling = createSelector(state, state => state.isDisabling);
const isBulkEnabling = createSelector(state, state => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, state => state.isBulkDisabling);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);

export const selectors = {
   state,
   clients,
   client,
   authorizedProfiles,
   checkedRows,
   isFetchingList,
   isFetchingDetail,
   isFetchingAuthorizedProfiles,
   isCreating,
   isUpdating,
   isDeleting,
   isAuthorizing,
   isUnuthorizing,
   isEnabling,
   isDisabling,
   isBulkEnabling,
   isBulkDisabling,
   isBulkDeleting
};


export const actions = slice.actions;

export default slice.reducer;