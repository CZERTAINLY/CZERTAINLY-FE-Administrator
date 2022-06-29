import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AttributeModel } from "models/attributes/AttributeModel";
import { AuthorityModel } from "models/authorities";
import { ConnectorModel } from "models/connectors";

import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";
import { AttributeDescriptorModel } from "../models/attributes/AttributeDescriptorModel";


export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   authority?: AuthorityModel;
   authorities: AuthorityModel[];

   authorityProviders?: ConnectorModel[];
   authorityProviderAttributeDescriptors?: AttributeDescriptorModel[];

   isFetchingAuthorityProviders: boolean;
   isFetchingAuthorityProviderAttributeDescriptors: boolean;

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isCreating: boolean;
   isDeleting: boolean;
   isForceDeleting: boolean;
   isUpdating: boolean;
   isBulkDeleting: boolean;
   isBulkForceDeleting: boolean;

};


export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   authorities: [],

   isFetchingAuthorityProviders: false,
   isFetchingAuthorityProviderAttributeDescriptors: false,

   isFetchingList: false,
   isFetchingDetail: false,
   isCreating: false,
   isDeleting: false,
   isForceDeleting: false,
   isUpdating: false,
   isBulkDeleting: false,
   isBulkForceDeleting: false

};


export const slice = createSlice({

   name: "authorities",

   initialState,

   reducers: {

      resetState: (state, action: PayloadAction<void>) => {

         state = initialState;

      },


      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },


      listAuthorityProviders: (state, action: PayloadAction<void>) => {

         state.authorityProviders = undefined;
         state.isFetchingAuthorityProviders = true;

      },


      listAuthorityProvidersSuccess: (state, action: PayloadAction<{ connectors: ConnectorModel[] }>) => {

         state.authorityProviders = action.payload.connectors;
         state.isFetchingAuthorityProviders = false;

      },


      listAuthorityProvidersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAuthorityProviders = false;

      },


      getAuthorityProviderAttributeDescriptors: (state, action: PayloadAction<{ uuid: string, kind: string, functionGroup: string }>) => {

         state.authorityProviderAttributeDescriptors = [];
         state.isFetchingAuthorityProviderAttributeDescriptors = true;

      },


      getAuthorityProviderAttributeDescriptorsSuccess: (state, action: PayloadAction<{ attributeDescriptor: AttributeDescriptorModel[] }>) => {

         state.authorityProviderAttributeDescriptors = action.payload.attributeDescriptor;
         state.isFetchingAuthorityProviderAttributeDescriptors = false;

      },


      getAuthorityProviderAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAuthorityProviderAttributeDescriptors = false;

      },


      listAuthorities: (state, action: PayloadAction<void>) => {

         state.authorities = [];
         state.isFetchingList = true;

      },


      listAuthoritiesSuccess: (state, action: PayloadAction<{ authorityList: AuthorityModel[] }>) => {

         state.authorities = action.payload.authorityList;
         state.isFetchingList = false;

      },


      listAuthoritiesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      getAuthorityDetail: (state, action: PayloadAction<{ uuid: string }>) => {

         state.authority = undefined;
         state.isFetchingDetail = true;

      },


      getAuthorityDetailSuccess: (state, action: PayloadAction<{ authority: AuthorityModel }>) => {

         state.isFetchingDetail = false;

         state.authority = action.payload.authority;

         const authorityIndex = state.authorities.findIndex(authority => authority.uuid === action.payload.authority.uuid);

         if (authorityIndex >= 0) {
            state.authorities[authorityIndex] = action.payload.authority;
         } else {
            state.authorities.push(action.payload.authority);
         }

      },


      getAuthorityDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false;

      },


      createAuthority: (state, action: PayloadAction<{
         name: string,
         connectorUuid: string,
         credential: any,
         status: string,
         attributes: AttributeModel[],
         kind: string,
      }>) => {

         state.isCreating = true;

      },


      createAuthoritySuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isCreating = false;

      },


      createAuthorityFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      updateAuthority: (state, action: PayloadAction<{ authority: AuthorityModel }>) => {

         state.isUpdating = true;

      },


      updateAuthoritySuccess: (state, action: PayloadAction<{ authority: AuthorityModel }>) => {

         state.isUpdating = false;

         const authorityIndex = state.authorities.findIndex(authority => authority.uuid === action.payload.authority.uuid);

         if (authorityIndex >= 0) {
            state.authorities[authorityIndex] = action.payload.authority;
         } else {
            state.authorities.push(action.payload.authority);
         }

         if (state.authority?.uuid === action.payload.authority.uuid) state.authority = action.payload.authority;

      },


      updateAuthorityFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false;

      },


      deleteAuthority: (state, action: PayloadAction<{ uuid: string }>) => {

         state.deleteErrorMessage = "";
         state.isDeleting = true;

      },


      deleteAuthoritySuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = false;

         const index = state.authorities.findIndex(a => a.uuid === action.payload.uuid);

         if (index !== -1) state.authorities.splice(index, 1);

         if (state.authority?.uuid === action.payload.uuid) state.authority = undefined;

      },


      deleteAuthorityFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.deleteErrorMessage = action.payload.error || "Unknown error";
         state.isDeleting = false;

      },


      bulkDeleteAuthority: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteAuthoritySuccess: (state, action: PayloadAction<{ uuids: string[], errors: DeleteObjectErrorModel[] }>) => {

         state.isBulkDeleting = false;

         if (action.payload.errors.length > 0) {
            state.bulkDeleteErrorMessages = action.payload.errors;
            return
         }

         action.payload.uuids.forEach(

            uuid => {
               const index = state.authorities.findIndex(authority => authority.uuid === uuid);
               if (index !== -1) state.authorities.splice(index, 1);
            }

         );

         if (state.authority && action.payload.uuids.includes(state.authority.uuid)) state.authority = undefined;

      },


      bulkDeleteAuthorityFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkForceDeleteAuthority: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkForceDeleting = true;

      },


      bulkForceDeleteAuthoritySuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkForceDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const index = state.authorities.findIndex(authority => authority.uuid === uuid);
               if (index !== -1) state.authorities.splice(index, 1);
            }

         );

         if (state.authority && action.payload.uuids.includes(state.authority.uuid)) state.authority = undefined;

      },


      bulkForceDeleteAuthorityFailure: (state, action: PayloadAction<string>) => {

         state.isBulkForceDeleting = false;

      }


   }

})


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state=> state.checkedRows);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const authorityProviders = createSelector(state, state => state.authorityProviders);
const authorityProviderAttributeDescriptors = createSelector(state, state => state.authorityProviderAttributeDescriptors);

const authority = createSelector(state, state => state.authority);
const authorities = createSelector(state, state => state.authorities);

const isFetchingAuthorityProviders = createSelector(state, state => state.isFetchingAuthorityProviders);
const isFetchingAuthorityProviderAttributeDescriptors = createSelector(state, state => state.isFetchingAuthorityProviderAttributeDescriptors);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isCreating = createSelector(state, state => state.isCreating);
const isUpdating = createSelector(state, state => state.isUpdating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);
const isBulkForceDeleting = createSelector(state, state => state.isBulkForceDeleting);


export const selectors = {

   state,

   checkedRows,

   deleteErrorMessage,
   bulkDeleteErrorMessages,

   authorityProviders,
   authorityProviderAttributeDescriptors,

   authority,
   authorities,

   isFetchingAuthorityProviders,
   isFetchingAuthorityProviderAttributeDescriptors,

   isFetchingList,
   isFetchingDetail,
   isCreating,
   isUpdating,
   isDeleting,
   isBulkDeleting,
   isBulkForceDeleting

};


export const actions = slice.actions;


export default slice.reducer;
