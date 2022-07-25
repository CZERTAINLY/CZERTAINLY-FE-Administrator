import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { AcmeProfileListItemModel, AcmeProfileModel } from "models/acme-profiles";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";
import { AttributeModel } from "models/attributes/AttributeModel";


export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   acmeProfile?: AcmeProfileModel;
   acmeProfiles: AcmeProfileListItemModel[];

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isCreating: boolean;
   isDeleting: boolean;
   isUpdating: boolean;
   isEnabling: boolean;
   isDisabling: boolean;
   isBulkDeleting: boolean;
   isBulkEnabling: boolean;
   isBulkDisabling: boolean;
   isBulkForceDeleting: boolean;

};


export const initialState: State = {

   checkedRows: [],

   acmeProfiles: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isCreating: false,
   isDeleting: false,
   isUpdating: false,
   isEnabling: false,
   isDisabling: false,
   isBulkDeleting: false,
   isBulkEnabling: false,
   isBulkDisabling: false,
   isBulkForceDeleting: false

};


export const slice = createSlice({

   name: "acmeProfiles",

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


      listAcmeProfiles: (state, action: PayloadAction<void>) => {

         state.isFetchingList = true;

      },


      listAcmeProfilesSuccess: (state, action: PayloadAction<{ acmeProfileList: AcmeProfileListItemModel[] }>) => {

         state.acmeProfiles = action.payload.acmeProfileList;
         state.isFetchingList = false;

      },


      listAcmeProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false

      },


      getAcmeProfile: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isFetchingDetail = true;

      },


      getAcmeProfileSuccess: (state, action: PayloadAction<{ acmeProfile: AcmeProfileModel }>) => {

         state.isFetchingDetail = false;

         state.acmeProfile = action.payload.acmeProfile;

         const acmeProfileIndex = state.acmeProfiles.findIndex(acmeProfile => acmeProfile.uuid === action.payload.acmeProfile.uuid);

         if (acmeProfileIndex >= 0) {
            state.acmeProfiles[acmeProfileIndex] = action.payload.acmeProfile;
         } else {
            state.acmeProfiles.push(action.payload.acmeProfile);
         }


      },


      getAcmeProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false

      },


      createAcmeProfile: (state, action: PayloadAction<{
         name: string,
         description: string,
         termsOfServiceUrl: string,
         dnsResolverIp: string,
         dnsResolverPort: string,
         raProfileUuid: string | undefined,
         websiteUrl: string,
         retryInterval: number,
         termsOfServiceChangeDisable: boolean,
         validity: number,
         issueCertificateAttributes: AttributeModel[],
         revokeCertificateAttributes: AttributeModel[],
         requireContact: boolean,
         requireTermsOfService: boolean,
         termsOfServiceChangeUrl: string
      }>) => {

         state.isCreating = true;

      },


      createAcmeProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isCreating = false;

      },


      createAcmeProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false

      },


      updateAcmeProfile: (state, action: PayloadAction<{
         uuid: string,
         description: string,
         termsOfServiceUrl: string,
         dnsResolverIp: string,
         dnsResolverPort: string,
         raProfileUuid: string | undefined,
         websiteUrl: string,
         retryInterval: number,
         termsOfServiceChangeDisable: boolean,
         validity: number,
         issueCertificateAttributes: AttributeModel[],
         revokeCertificateAttributes: AttributeModel[],
         requireContact: boolean,
         requireTermsOfService: boolean,
         termsOfServiceChangeUrl: string
      }>) => {

         state.isUpdating = true;

      },


      updateAcmeProfileSuccess: (state, action: PayloadAction<{ acmeProfile: AcmeProfileModel }>) => {

         state.isUpdating = false;

         const acmeProfileIndex = state.acmeProfiles.findIndex(acmeProfile => acmeProfile.uuid === action.payload.acmeProfile.uuid);

         if (acmeProfileIndex >= 0) {
            state.acmeProfiles[acmeProfileIndex] = action.payload.acmeProfile;
         } else {
            state.acmeProfiles.push(action.payload.acmeProfile);
         }

         if (state.acmeProfile?.uuid === action.payload.acmeProfile.uuid) state.acmeProfile = action.payload.acmeProfile;

      },


      updateAcmeProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false

      },


      deleteAcmeProfile: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = true;
         state.deleteErrorMessage = "";

      },


      deleteAcmeProfileSuccess: (state, action: PayloadAction<{ uuid: string}>) => {

         state.isDeleting = false;

         const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === action.payload.uuid);

         if (profileIndex >= 0) state.acmeProfiles.splice(profileIndex, 1);

         if (state.acmeProfile?.uuid === action.payload.uuid) state.acmeProfile = undefined;

      },


      deleteAcmeProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false
         state.deleteErrorMessage = action.payload.error || "Unknown error";

      },


      enableAcmeProfile: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = true;

      },


      enableAcmeProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = false;

         const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === action.payload.uuid);

         if (profileIndex >= 0) state.acmeProfiles[profileIndex].enabled = true;

         if (state.acmeProfile?.uuid === action.payload.uuid) state.acmeProfile.enabled = true;

      },


      enableAcmeProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isEnabling = false;

      },


      disableAcmeProfile: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = true;

      },


      disableAcmeProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = false;

         const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === action.payload.uuid);

         if (profileIndex >= 0) state.acmeProfiles[profileIndex].enabled = false;

         if (state.acmeProfile?.uuid === action.payload.uuid) state.acmeProfile.enabled = false;

      },


      disableAcmeProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDisabling = false;

      },


      bulkDeleteAcmeProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
         state.bulkDeleteErrorMessages = [];

         state.isBulkDeleting = true;

      },


      bulkDeleteAcmeProfilesSuccess: (state, action: PayloadAction<{ uuids: string[], errors: DeleteObjectErrorModel[] }>) => {

         state.isBulkDeleting = false;
         if (action.payload.errors.length > 0) {
            state.bulkDeleteErrorMessages = action.payload.errors;
            return
         }

         action.payload.uuids.forEach(

            uuid => {
               const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === uuid);
               if (profileIndex >= 0) state.acmeProfiles.splice(profileIndex, 1);
            }

         );

         if (state.acmeProfile && action.payload.uuids.includes(state.acmeProfile.uuid)) state.acmeProfile = undefined;

      },


      bulkDeleteAcmeProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkForceDeleteAcmeProfiles: (state, action: PayloadAction<{ uuids: string[], redirect?: string }>) => {

         state.isBulkForceDeleting = true;

      },


      bulkForceDeleteAcmeProfilesSuccess: (state, action: PayloadAction<{ uuids: string[],redirect?: string }>) => {

         state.isBulkForceDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === uuid);
               if (profileIndex >= 0) state.acmeProfiles.splice(profileIndex, 1);
            }

         );

         if (state.acmeProfile && action.payload.uuids.includes(state.acmeProfile.uuid)) state.acmeProfile = undefined;

      },


      bulkForceDeleteAcmeProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkForceDeleting = false;

      },


      bulkEnableAcmeProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableAcmeProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

         action.payload.uuids.forEach(

            uuid => {
               const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === uuid);
               if (profileIndex >= 0) state.acmeProfiles[profileIndex].enabled = true;
            }

         );

         if (state.acmeProfile && action.payload.uuids.includes(state.acmeProfile.uuid)) state.acmeProfile.enabled = true;

      },


      bulkEnableAcmeProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkEnabling = false

      },


      bulkDisableAcmeProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableAcmeProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

         action.payload.uuids.forEach(

            uuid => {
               const profileIndex = state.acmeProfiles.findIndex(profile => profile.uuid === uuid);
               if (profileIndex >= 0) state.acmeProfiles[profileIndex].enabled = false;
            }

         );

         if (state.acmeProfile && action.payload.uuids.includes(state.acmeProfile.uuid)) state.acmeProfile.enabled = false;

      },


      bulkDisableAcmeProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDisabling = false

      },

   }
})


const state = createFeatureSelector<State>(slice.name);

const acmeProfile = createSelector(state, state => state.acmeProfile);
const acmeProfiles = createSelector(state, state => state.acmeProfiles);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const checkedRows = createSelector(state, state => state.checkedRows);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const isDisabling = createSelector(state, (state) => state.isDisabling);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, (state) => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, (state) => state.isBulkDisabling);
const isBulkForceDeleting = createSelector(state, (state) => state.isBulkForceDeleting);


export const selectors = {

   state,

   checkedRows,

   deleteErrorMessage,
   bulkDeleteErrorMessages,

   acmeProfile,
   acmeProfiles,

   isFetchingList,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isUpdating,
   isEnabling,
   isDisabling,
   isBulkDeleting,
   isBulkEnabling,
   isBulkDisabling,
   isBulkForceDeleting

};


export const actions = slice.actions;


export default slice.reducer;