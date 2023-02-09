import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { AttributeDescriptorModel } from "types/attributes";
import {
   LocationAddRequestModel,
   LocationEditRequestModel,
   LocationIssueRequestModel,
   LocationPushRequestModel,
   LocationResponseModel
} from "types/locations";


export type State = {

   checkedRows: string[];

   location?: LocationResponseModel;
   locations: LocationResponseModel[];

   pushAttributeDescriptors?: AttributeDescriptorModel[];
   csrAttributeDescriptors?: AttributeDescriptorModel[];

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;

   isEnabling: boolean;
   isDisabling: boolean;

   isSyncing: boolean;

   isFetchingPushAttributeDescriptors: boolean;
   isFetchingCSRAttributeDescriptors: boolean;

   isPushingCertificate: boolean;
   isIssuingCertificate: boolean;
   isAutoRenewingCertificate: boolean;

   isRemovingCertificate: boolean;

}


export const initialState: State = {

   checkedRows: [],

   locations: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isCreating: false,
   isDeleting: false,
   isUpdating: false,

   isEnabling: false,
   isDisabling: false,

   isSyncing: false,

   isFetchingPushAttributeDescriptors: false,
   isFetchingCSRAttributeDescriptors: false,

   isPushingCertificate: false,
   isIssuingCertificate: false,
   isAutoRenewingCertificate: false,

   isRemovingCertificate: false,

};


export const slice = createSlice({

   name: "locations",

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

         state.checkedRows = action.payload.checkedRows;

      },


      clearPushAttributeDescriptors: (state, action: PayloadAction<void>) => {

         state.pushAttributeDescriptors = undefined;

      },


      listLocations: (state, action: PayloadAction<void>) => {

         state.isFetchingList = true;

      },


      listLocationsSuccess: (state, action: PayloadAction<{ locations: LocationResponseModel[] }>) => {

         state.isFetchingList = false;
         state.locations = action.payload.locations;

      },


      listLocationsFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isFetchingList = false;

      },


      getLocationDetail: (state, action: PayloadAction<{ entityUuid: string, uuid: string }>) => {

         state.location = undefined;
         state.isFetchingDetail = true;

      },


      getLocationDetailSuccess: (state, action: PayloadAction<{ location: LocationResponseModel }>) => {

         state.location = action.payload.location;
         state.isFetchingDetail = false;

      },


      getLocationDetailFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isFetchingDetail = false;

      },


      addLocation: (state, action: PayloadAction<{
         entityUuid: string,
         addLocationRequest: LocationAddRequestModel
      }>) => {

         state.isCreating = true;

      },


      addLocationSuccess: (state, action: PayloadAction<{ location: LocationResponseModel, entityUuid: string }>) => {

         state.isCreating = false;
         state.locations.push(action.payload.location);

      },


      addLocationFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isCreating = false;

      },


      editLocation: (state, action: PayloadAction<{
         uuid: string,
         entityUuid: string,
         editLocationRequest: LocationEditRequestModel
      }>) => {

         state.isUpdating = true;

      },


      editLocationSuccess: (state, action: PayloadAction<{ location: LocationResponseModel }>) => {

         state.isUpdating = false;
         const index = state.locations.findIndex(l => l.uuid === action.payload.location.uuid);
         if (index > 0) state.locations[index] = action.payload.location;

      },


      editLocationFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isUpdating = false;

      },


      deleteLocation: (state, action: PayloadAction<{ entityUuid: string, uuid: string, redirect?: string }>) => {

         state.isDeleting = true;

      },


      deleteLocationSuccess: (state, action: PayloadAction<{ uuid: string, redirect?: string }>) => {

         state.isDeleting = false;
         const index = state.locations.findIndex(l => l.uuid === action.payload.uuid);
         if (index > 0) state.locations.splice(index, 1);

      },


      deleteLocationFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isDeleting = false;

      },


      enableLocation: (state, action: PayloadAction<{ entityUuid: string, uuid: string }>) => {

         state.isEnabling = true;

      },


      enableLocationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = false;
         const location = state.locations.find(l => l.uuid === action.payload.uuid);
         if (location) location.enabled = true;
         if (state.location?.uuid === action.payload.uuid) state.location.enabled = true;

      },


      enableLocationFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isEnabling = false;

      },


      disableLocation: (state, action: PayloadAction<{ entityUuid: string, uuid: string }>) => {

         state.isDisabling = true;

      },


      disableLocationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = false;
         const location = state.locations.find(l => l.uuid === action.payload.uuid);
         if (location) location.enabled = false;
         if (state.location?.uuid === action.payload.uuid) state.location.enabled = false;
      },


      disableLocationFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isDisabling = false;

      },


      syncLocation: (state, action: PayloadAction<{ entityUuid: string, uuid: string }>) => {

         state.isSyncing = true;

      },


      syncLocationSuccess: (state, action: PayloadAction<{ location: LocationResponseModel }>) => {

         state.isSyncing = false;

         const index = state.locations.findIndex(l => l.uuid === action.payload.location.uuid);

         if (index > 0) {
            state.locations[index] = action.payload.location;
         } else {
            state.locations.push(action.payload.location);
         }

         if (state.location?.uuid === action.payload.location.uuid) {
            state.location = action.payload.location;
         }

      },


      syncLocationFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isSyncing = false;

      },


      getPushAttributes: (state, action: PayloadAction<{ entityUuid: string, uuid: string }>) => {

         state.isFetchingPushAttributeDescriptors = true;

      },


      getPushAttributesSuccess: (state, action: PayloadAction<{ attributes: AttributeDescriptorModel[] }>) => {

         state.pushAttributeDescriptors = action.payload.attributes;
         state.isFetchingPushAttributeDescriptors = false;

      },


      getPushAttributesFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isFetchingPushAttributeDescriptors = false;

      },


      getCSRAttributes: (state, action: PayloadAction<{ entityUuid: string, uuid: string }>) => {

         state.isFetchingCSRAttributeDescriptors = true;

      },


      getCSRAttributesSuccess: (state, action: PayloadAction<{ attributes: AttributeDescriptorModel[] }>) => {

         state.csrAttributeDescriptors = action.payload.attributes;
         state.isFetchingCSRAttributeDescriptors = false;

      },


      getCSRAttributesFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isFetchingCSRAttributeDescriptors = false;

      },


      pushCertificate: (state, action: PayloadAction<{
         entityUuid: string,
         locationUuid: string,
         certificateUuid: string,
         pushRequest: LocationPushRequestModel
      }>) => {

         state.isPushingCertificate = true;

      },


      pushCertificateSuccess: (state, action: PayloadAction<{ location: LocationResponseModel, certificateUuid: string }>) => {

         state.isPushingCertificate = false;
         const index = state.locations.findIndex(l => l.uuid === action.payload.location.uuid);
         if (index > 0) state.locations[index] = action.payload.location;
         if (state.location?.uuid === action.payload.location.uuid) state.location = action.payload.location;

      },


      pushCertificateFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isPushingCertificate = false;

      },


      issueCertificate: (state, action: PayloadAction<{
         entityUuid: string,
         locationUuid: string,
         issueRequest: LocationIssueRequestModel
      }>) => {

         state.isIssuingCertificate = true;

      },


      issueCertificateSuccess: (state, action: PayloadAction<{ location: LocationResponseModel }>) => {

         state.isIssuingCertificate = false;
         const index = state.locations.findIndex(l => l.uuid === action.payload.location.uuid);
         if (index > 0) state.locations[index] = action.payload.location;
         if (state.location?.uuid === action.payload.location.uuid) state.location = action.payload.location;

      },


      issueCertificateFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isIssuingCertificate = false;

      },


      autoRenewCertificate: (state, action: PayloadAction<{ entityUuid: string, locationUuid: string, certificateUuid: string }>) => {

         state.isAutoRenewingCertificate = true;

      },


      autoRenewCertificateSuccess: (state, action: PayloadAction<{ location: LocationResponseModel, certificateUuid: string }>) => {

         state.isAutoRenewingCertificate = false;
         const index = state.locations.findIndex(l => l.uuid === action.payload.location.uuid);
         if (index > 0) state.locations[index] = action.payload.location;
         if (state.location?.uuid === action.payload.location.uuid) state.location = action.payload.location;

      },


      autoRenewCertificateFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isAutoRenewingCertificate = false;

      },


      removeCertificate: (state, action: PayloadAction<{ entityUuid: string, locationUuid: string, certificateUuid: string }>) => {

         state.isRemovingCertificate = true;

      },


      removeCertificateSuccess: (state, action: PayloadAction<{ location: LocationResponseModel, certificateUuid: string }>) => {

         state.isRemovingCertificate = false;
         const index = state.locations.findIndex(l => l.uuid === action.payload.location.uuid);
         if (index > 0) state.locations[index] = action.payload.location;
         if (state.location?.uuid === action.payload.location.uuid) state.location = action.payload.location;

      },


      removeCertificateFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isRemovingCertificate = false;

      }


   }

});


export const state = createFeatureSelector<State>(slice.name);

export const checkedRows = createSelector(state, (state) => state.checkedRows);

export const location = createSelector(state, (state) => state.location);
export const locations = createSelector(state, (state) => state.locations);

export const pushAttributeDescriptors = createSelector(state, (state) => state.pushAttributeDescriptors);
export const csrAttributeDescriptors = createSelector(state, (state) => state.csrAttributeDescriptors);

export const isFetchingPushAttributeDescriptors = createSelector(state, (state) => state.isFetchingPushAttributeDescriptors);
export const isFetchingCSRAttributeDescriptors = createSelector(state, (state) => state.isFetchingCSRAttributeDescriptors);

export const isFetchingList = createSelector(state, (state) => state.isFetchingList);
export const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
export const isCreating = createSelector(state, (state) => state.isCreating);
export const isUpdating = createSelector(state, (state) => state.isUpdating);
export const isDeleting = createSelector(state, (state) => state.isDeleting);

export const isEnabling = createSelector(state, (state) => state.isEnabling);
export const isDisabling = createSelector(state, (state) => state.isDisabling);

export const isSyncing = createSelector(state, (state) => state.isSyncing);

export const isPushingCertificate = createSelector(state, (state) => state.isPushingCertificate);
export const isIssuingCertificate = createSelector(state, (state) => state.isIssuingCertificate);
export const isAutoRenewingCertificate = createSelector(state, (state) => state.isAutoRenewingCertificate);

export const isRemovingCertificate = createSelector(state, (state) => state.isRemovingCertificate);


export const selectors = {

   state,

   checkedRows,

   location,
   locations,

   pushAttributeDescriptors,
   csrAttributeDescriptors,

   isFetchingPushAttributeDescriptors,
   isFetchingCSRAttributeDescriptors,

   isFetchingList,
   isFetchingDetail,
   isCreating,
   isUpdating,
   isDeleting,

   isEnabling,
   isDisabling,

   isSyncing,

   isPushingCertificate,
   isIssuingCertificate,
   isAutoRenewingCertificate,

   isRemovingCertificate

}


export const actions = slice.actions;


export default slice.reducer;