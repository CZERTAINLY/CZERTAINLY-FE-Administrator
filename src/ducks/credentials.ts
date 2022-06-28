import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CredentialModel } from "models/credentials";
import { ConnectorModel } from "models/connectors";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";


export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   credential?: CredentialModel;
   credentials: CredentialModel[];

   credentialProviders?: ConnectorModel[];
   credentialProviderAttributeDescriptors?: AttributeDescriptorModel[];

   isFetchingCredentialProviders: boolean;
   isFetchingCredentialProviderAttributeDescriptors: boolean;

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isCreating: boolean;
   isDeleting: boolean;
   isUpdating: boolean;
   isBulkDeleteing: boolean;
   isForceBulkDeleting: boolean;

};


export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   credentials: [],

   isFetchingCredentialProviders: false,
   isFetchingCredentialProviderAttributeDescriptors: false,

   isFetchingList: false,
   isFetchingDetail: false,
   isCreating: false,
   isDeleting: false,
   isUpdating: false,
   isBulkDeleteing: false,
   isForceBulkDeleting: false,

};


export const slice = createSlice({

   name: "credentials",

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


      listCredentialProviders: (state, action: PayloadAction<void>) => {

         state.credentialProviders = undefined;
         state.isFetchingCredentialProviders = true;

      },


      listCredentialProvidersSuccess: (state, action: PayloadAction<{ credentialProviderList: ConnectorModel[] }>) => {

         state.isFetchingCredentialProviders = false;
         state.credentialProviders = action.payload.credentialProviderList;

      },


      listCredentialProvidersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingCredentialProviders = false;

      },



      getCredentialProviderAttributesDescriptors: (state, action: PayloadAction<{ uuid: string, kind: string}>) => {

         state.isFetchingCredentialProviderAttributeDescriptors = true;
         state.credentialProviderAttributeDescriptors = [];

      },


      getCredentialProviderAttributesDescriptorsSuccess: (state, action: PayloadAction<{ credentialProviderAttributesDescriptors: AttributeDescriptorModel[] }>) => {

         state.isFetchingCredentialProviderAttributeDescriptors = false;
         state.credentialProviderAttributeDescriptors = action.payload.credentialProviderAttributesDescriptors;

      },


      getCredentialProviderAttributesDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingCredentialProviderAttributeDescriptors = false;

      },



      listCredentials: (state, action: PayloadAction<void>) => {

         state.checkedRows = [];
         state.credentials = [];
         state.isFetchingList = true;

      },


      listCredentialsSuccess: (state, action: PayloadAction<{ credentialList: CredentialModel[] }>) => {

         state.credentials = action.payload.credentialList;
         state.isFetchingList = false;

      },


      listCredentialsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      getCredentialDetail: (state, action: PayloadAction<{ uuid: string }>) => {

         state.credential = undefined;
         state.isFetchingDetail = true;

      },


      getCredentialDetailSuccess: (state, action: PayloadAction<{ credetnial: CredentialModel }>) => {

         state.credential = action.payload.credetnial;
         state.isFetchingDetail = false;

      },


      getCredentialDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false;

      },


      createCredential: (state, action: PayloadAction<{
         name: string,
         kind: string,
         connectorUuid: string,
         attributes: any
      }>) => {

         state.isCreating = true;

      },


      createCredentialSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isCreating = false;

      },


      createCredentialFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      updateCredential: (state, action: PayloadAction<{ uuid: string, attributes: AttributeModel[] }>) => {

         state.isUpdating = true;

      },


      updateCredentialSuccess: (state, action: PayloadAction<{ credential: CredentialModel }>) => {

         state.isUpdating = false;

         const index = state.credentials.findIndex(credential => credential.uuid === action.payload.credential.uuid);

         if (index >= 0) {
            state.credentials[index] = action.payload.credential;
         } else {
            state.credentials.push(action.payload.credential);
         }

         if (state.credential?.uuid === action.payload.credential.uuid) {
            state.credential = action.payload.credential;
         }

      },


      updateCredentialFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false;

      },


      deleteCredential: (state, action: PayloadAction<{ uuid: string }>) => {

         state.deleteErrorMessage = "";
         state.isDeleting = true;

      },


      deleteCredentialSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = false;
         const index = state.credentials.findIndex(credential => credential.uuid === action.payload.uuid);
         if (index >= 0) state.credentials.splice(index, 1);

      },


      deleteCredentialFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.deleteErrorMessage = action.payload.error || "Unknown error";
         state.isDeleting = false;

      },



      bulkDeleteCredentials: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleteing = true;

      },


      bulkDeleteCredentialsSuccess: (state, action: PayloadAction<{ uuids: string[], errors: DeleteObjectErrorModel[] }>) => {

         state.isBulkDeleteing = false;

         if (action.payload.errors.length > 0) {
            state.bulkDeleteErrorMessages = action.payload.errors;
            return;
         }

         action.payload.uuids.forEach(

            uuid => {
               const index = state.credentials.findIndex(credential => credential.uuid === uuid);
               if (index >= 0) state.credentials.splice(index, 1);
            }

         );

         if (state.credential && action.payload.uuids.includes(state.credential.uuid)) state.credential = undefined;

      },


      bulkDeleteCredentialsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleteing = false;

      },


      bulkForceDeleteCredentials: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isForceBulkDeleting = true;

      },


      bulkForceDeleteCredentialsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isForceBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const index = state.credentials.findIndex(credential => credential.uuid === uuid);
               if (index >= 0) state.credentials.splice(index, 1);
            }

         );

         if (state.credential && action.payload.uuids.includes(state.credential.uuid)) state.credential = undefined;

      },


      bulkForceDeleteCredentialsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isForceBulkDeleting = false;

      },


   }

})

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state => state.checkedRows);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const credentialProviders = createSelector(state, state => state.credentialProviders);
const credentialProviderAttributeDescriptors = createSelector(state, state => state.credentialProviderAttributeDescriptors);

const credential = createSelector(state, state => state.credential);
const credentials = createSelector(state, state => state.credentials);

const isFetchingCredentialProviders = createSelector(state, state => state.isFetchingCredentialProviders);
const isFetchingCredentialProviderAttributeDescriptors = createSelector(state, state => state.isFetchingCredentialProviderAttributeDescriptors);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isCreating = createSelector(state, state => state.isCreating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isUpdating = createSelector(state, state => state.isUpdating);
const isBulkDeleteing = createSelector(state, state => state.isBulkDeleteing);
const isForceBulkDeleting = createSelector(state, state => state.isForceBulkDeleting);


export const selectors = {

   state,

   checkedRows,

   deleteErrorMessage,
   bulkDeleteErrorMessages,

   credentialProviders,
   credentialProviderAttributeDescriptors,

   credential,
   credentials,

   isFetchingCredentialProviders,
   isFetchingCredentialProviderAttributeDescriptors,

   isFetchingList,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isUpdating,
   isBulkDeleteing,
   isForceBulkDeleting

}

export const actions = slice.actions;

export default slice.reducer;