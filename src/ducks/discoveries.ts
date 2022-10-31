import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AttributeModel } from "models/attributes/AttributeModel";
import { DiscoveryModel } from "models/discoveries";
import { ConnectorModel } from "models/connectors";

import { AttributeDescriptorModel } from "../models/attributes/AttributeDescriptorModel";


export type State = {

   checkedRows: string[];

   discovery?: DiscoveryModel;
   discoveries: DiscoveryModel[];

   discoveryProviders?: ConnectorModel[];
   discoveryProviderAttributeDescriptors?: AttributeDescriptorModel[];

   isFetchingDiscoveryProviders: boolean;
   isFetchingDiscoveryProviderAttributeDescriptors: boolean;

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isCreating: boolean;
   isDeleting: boolean;
   isBulkDeleting: boolean;

};


export const initialState: State = {

   checkedRows: [],

   discoveries: [],

   isFetchingDiscoveryProviders: false,
   isFetchingDiscoveryProviderAttributeDescriptors: false,

   isFetchingList: false,
   isFetchingDetail: false,
   isCreating: false,
   isDeleting: false,
   isBulkDeleting: false,

};


export const slice = createSlice({

   name: "discoveries",

   initialState,

   reducers: {

      resetState: (state, action: PayloadAction<void>) => {

         Object.keys(state).forEach(
            key => { if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined; }
         );

         Object.keys(initialState).forEach(
            key => (state as any)[key] = (initialState as any)[key]
         );

      },


      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows

      },



      clearDiscoveryProviderAttributeDescriptors: (state, action: PayloadAction<void>) => {

         state.discoveryProviderAttributeDescriptors = [];

      },



      listDiscoveryProviders: (state, action: PayloadAction<void>) => {

         state.discoveryProviders = undefined;
         state.isFetchingDiscoveryProviders = true;

      },


      listDiscoveryProvidersSuccess: (state, action: PayloadAction<{ connectors: ConnectorModel[] }>) => {

         state.discoveryProviders = action.payload.connectors;
         state.isFetchingDiscoveryProviders = false;

      },


      listDiscoveryProvidersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDiscoveryProviders = false;

      },


      getDiscoveryProviderAttributesDescriptors: (state, action: PayloadAction<{ uuid: string, kind: string }>) => {

         state.discoveryProviderAttributeDescriptors = [];
         state.isFetchingDiscoveryProviderAttributeDescriptors = true;

      },


      getDiscoveryProviderAttributesDescriptorsSuccess: (state, action: PayloadAction<{ attributeDescriptor: AttributeDescriptorModel[] }>) => {

         state.discoveryProviderAttributeDescriptors = action.payload.attributeDescriptor;
         state.isFetchingDiscoveryProviderAttributeDescriptors = false;

      },


      getDiscoveryProviderAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDiscoveryProviderAttributeDescriptors = false;

      },


      listDiscoveries: (state, action: PayloadAction<void>) => {

         state.discoveries = [];
         state.isFetchingList = true;

      },


      listDiscoveriesSuccess: (state, action: PayloadAction<{ discoveryList: DiscoveryModel[] }>) => {

         state.discoveries = action.payload.discoveryList;
         state.isFetchingList = false;

      },


      listDiscoveriesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      getDiscoveryDetail: (state, action: PayloadAction<{ uuid: string }>) => {

         state.discovery = undefined;
         state.isFetchingDetail = true;

      },


      getDiscoveryDetailSuccess: (state, action: PayloadAction<{ discovery: DiscoveryModel }>) => {

         state.isFetchingDetail = false;

         state.discovery = action.payload.discovery;

         const discoveryIndex = state.discoveries.findIndex(discovery => discovery.uuid === action.payload.discovery.uuid);

         if (discoveryIndex >= 0) {
            state.discoveries[discoveryIndex] = action.payload.discovery;
         } else {
            state.discoveries.push(action.payload.discovery);
         }

      },


      getDiscoveryDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false;

      },


      createDiscovery: (state, action: PayloadAction<{
         name: string,
         connectorUuid: string,
         attributes: AttributeModel[],
         kind: string,
      }>) => {

         state.isCreating = true;

      },


      createDiscoverySuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isCreating = false;

      },


      createDiscoveryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      deleteDiscovery: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = true;

      },


      deleteDiscoverySuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = false;

         const index = state.discoveries.findIndex(a => a.uuid === action.payload.uuid);

         if (index !== -1) state.discoveries.splice(index, 1);

         if (state.discovery?.uuid === action.payload.uuid) state.discovery = undefined;

      },


      deleteDiscoveryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false;

      },


      bulkDeleteDiscovery: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteDiscoverySuccess: (state, action: PayloadAction<{ uuids: string[]}>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const index = state.discoveries.findIndex(discovery => discovery.uuid === uuid);
               if (index !== -1) state.discoveries.splice(index, 1);
            }

         );

         if (state.discovery && action.payload.uuids.includes(state.discovery.uuid)) state.discovery = undefined;

      },


      bulkDeleteDiscoveryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },

   }

})


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state=> state.checkedRows);

const discoveryProviders = createSelector(state, state => state.discoveryProviders);
const discoveryProviderAttributeDescriptors = createSelector(state, state => state.discoveryProviderAttributeDescriptors);

const discovery = createSelector(state, state => state.discovery);
const discoveries = createSelector(state, state => state.discoveries);

const isFetchingDiscoveryProviders = createSelector(state, state => state.isFetchingDiscoveryProviders);
const isFetchingDiscoveryProviderAttributeDescriptors = createSelector(state, state => state.isFetchingDiscoveryProviderAttributeDescriptors);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isCreating = createSelector(state, state => state.isCreating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);

export const selectors = {

   state,

   checkedRows,

   discoveryProviders,
   discoveryProviderAttributeDescriptors,

   discovery,
   discoveries,

   isFetchingDiscoveryProviders,
   isFetchingDiscoveryProviderAttributeDescriptors,

   isFetchingList,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isBulkDeleting,

};


export const actions = slice.actions;


export default slice.reducer;
