import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CredentialModel } from "models/credentials";
import { ConnectorModel } from "models/connectors";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";


export type State = {

   checkedRows: string[];

   credential?: CredentialModel;
   credentials: CredentialModel[];

   credentialProviders?: ConnectorModel[];
   credentialProviderAttributeDescriptors?: AttributeDescriptorModel[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isFetchingCredentialProviders: boolean;
   isFetchingCredentialProviderAttributeDescriptors: boolean;

   isCreating: boolean;
   isDeleting: boolean;
   isForceDeleting: boolean;
   isUpdating: boolean;
   isBulkDeleteing: boolean;
   isForceBulkDeleting: boolean;

};


export const initialState: State = {

   checkedRows: [],

   credentials: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isFetchingCredentialProviders: false,
   isFetchingCredentialProviderAttributeDescriptors: false,

   isCreating: false,
   isDeleting: false,
   isForceDeleting: false,
   isUpdating: false,
   isBulkDeleteing: false,
   isForceBulkDeleting: false,

};


export const slice = createSlice({

   name: "credentials",

   initialState,

   reducers: {

      setCheckedRows: (state, action: PayloadAction<string[]>) => {

         state.checkedRows = action.payload;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },


      clearCredentialDetails: (state, action: PayloadAction<void>) => {

         state.credential = undefined;

      },


      listCredentials: (state, action: PayloadAction<void>) => {

         state.checkedRows = [];
         state.credentials = [];
         state.isFetchingList = true;

      },


      listCredentialsSuccess: (state, action: PayloadAction<CredentialModel[]>) => {

         state.credentials = action.payload;
         state.isFetchingList = false;

      },


      listCredentialsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingList = false;

      },


      getCredentialDetail: (state, action: PayloadAction<string>) => {

         state.credential = undefined;
         state.isFetchingDetail = true;

      },


      getCredentialDetailSuccess: (state, action: PayloadAction<CredentialModel>) => {

         state.credential = action.payload;
         state.isFetchingDetail = false;

      },


      getCredentialDetailFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingDetail = false;

      },



      listCredentialProviders: (state, action: PayloadAction<void>) => {

         state.credentialProviders = undefined;
         state.isFetchingCredentialProviders = true;

      },


      listCredentialProvidersSuccess: (state, action: PayloadAction<ConnectorModel[]>) => {

         state.isFetchingCredentialProviders = false;
         state.credentialProviders = action.payload;

      },


      listCredentialProvidersFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingCredentialProviders = false;

      },


      listCredentialProviderAttributeDescriptors: (state, action: PayloadAction<{ uuid: string, kind: string}>) => {

         state.isFetchingCredentialProviderAttributeDescriptors = true;
         state.credentialProviderAttributeDescriptors = [];

      },


      listCredentialProviderAttributeDescriptorsSuccess: (state, action: PayloadAction<AttributeDescriptorModel[]>) => {

         state.isFetchingCredentialProviderAttributeDescriptors = false;
         state.credentialProviderAttributeDescriptors = action.payload;

      },


      listCredentialProviderAttributeDescriptorsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingCredentialProviderAttributeDescriptors = false;

      },


      createCredential: (state, action: PayloadAction<{
         name: string,
         kind: string,
         connectorUuid: string,
         attributes: any
      }>) => {

         state.isCreating = true;

      },


      createCredentialSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      createCredentialFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isCreating = false;

      },


      deleteCredential: (state, action: PayloadAction<string>) => {

         state.deleteErrorMessage = "";
         state.isDeleting = true;

      },


      deleteCredentialSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;
         const index = state.credentials.findIndex(credential => credential.uuid === action.payload);
         if (index >= 0) state.credentials.splice(index, 1);

      },


      deleteCredentialFailure: (state, action: PayloadAction<string>) => {

         state.deleteErrorMessage = action.payload;
         state.isDeleting = false;

      },


      forceDeleteCredential: (state, action: PayloadAction<string>) => {

         state.bulkDeleteErrorMessages = [];
         state.isForceDeleting = true;

      },


      forceDeleteCredentialSuccess: (state, action: PayloadAction<string>) => {

         state.isForceDeleting = false;
         const index = state.credentials.findIndex(credential => credential.uuid === action.payload);
         if (index >= 0) state.credentials.splice(index, 1);

      },


      forceDeleteCredentialFailure: (state, action: PayloadAction<DeleteObjectErrorModel[]>) => {

         state.isForceDeleting = false;
         state.bulkDeleteErrorMessages = action.payload;

      },


      bulkDeleteCredentials: (state, action: PayloadAction<string[]>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleteing = true;

      },


      bulkDeleteCredentialsSuccess: (state, action: PayloadAction<{ uuid: string[], errors: DeleteObjectErrorModel[] }>) => {

         state.isBulkDeleteing = false;

         if (action.payload.errors.length > 0) {
            state.bulkDeleteErrorMessages = action.payload.errors;
            return;
         }

         action.payload.uuid.forEach(

            uuid => {
               const index = state.credentials.findIndex(credential => credential.uuid === uuid);
               if (index >= 0) state.credentials.splice(index, 1);
            }

         );

      },


      bulkDeleteCredentialsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isBulkDeleteing = false;

      },


      bulkForceDeleteCredentials: (state, action: PayloadAction<string[]>) => {

         state.isForceBulkDeleting = true;

      },


      bulkForceDeleteCredentialsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isForceBulkDeleting = false;

         action.payload.forEach(
            uuid => {
               const index = state.credentials.findIndex(credential => credential.uuid === uuid);
               if (index >= 0) state.credentials.splice(index, 1);
            }
         );

      },


      bulkForceDeleteCredentialsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isForceBulkDeleting = false;

      },



      updateCredential: (state, action: PayloadAction<{ uuid: string, attributes: AttributeModel[] }>) => {

         state.isUpdating = true;

      },


      updateCredentialSuccess: (state, action: PayloadAction<CredentialModel>) => {

         state.isUpdating = false;

         const index = state.credentials.findIndex(credential => credential.uuid === action.payload.uuid);

         if (index >= 0) {
            state.credentials[index] = action.payload;
         } else {
            state.credentials.push(action.payload);
         }

         if (state.credential?.uuid === action.payload.uuid) {
            state.credential = action.payload;
         }

      },


      updateCredentialFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isUpdating = false;

      }

   }

})

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state => state.checkedRows);

const credential = createSelector(state, state => state.credential);
const credentials = createSelector(state, state => state.credentials);

const credentialProviders = createSelector(state, state => state.credentialProviders);
const credentialProviderAttributeDescriptors = createSelector(state, state => state.credentialProviderAttributeDescriptors);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isFetchingCredentialProviders = createSelector(state, state => state.isFetchingCredentialProviders);
const isFetchingCredentialProviderAttributeDescriptors = createSelector(state, state => state.isFetchingCredentialProviderAttributeDescriptors);

const isCreating = createSelector(state, state => state.isCreating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isUpdating = createSelector(state, state => state.isUpdating);
const isBulkDeleteing = createSelector(state, state => state.isBulkDeleteing);
const isForceBulkDeleting = createSelector(state, state => state.isForceBulkDeleting);

export const selectors = {

   state,

   checkedRows,

   credential,
   credentials,

   credentialProviders,
   credentialProviderAttributeDescriptors,

   deleteErrorMessage,
   bulkDeleteErrorMessages,

   isFetchingList,
   isFetchingDetail,
   isFetchingCredentialProviders,
   isFetchingCredentialProviderAttributeDescriptors,

   isCreating,
   isDeleting,
   isUpdating,
   isBulkDeleteing,
   isForceBulkDeleting

}

export const actions = slice.actions;

export default slice.reducer;