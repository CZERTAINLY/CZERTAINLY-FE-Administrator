import { AcmeProfileDTO, AcmeProfileListItemDTO } from "api/acme-profile";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { AcmeProfileListModel, AcmeProfileModel } from "models/acme-profiles";
import { AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";


export type State = {

   checkedRows: string[];

   profile?: AcmeProfileModel;
   profiles: AcmeProfileListModel[];

   deleteProfileErrors: DeleteObjectErrorModel[];

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

   profiles: [],

   deleteProfileErrors: [],

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

      listAcmeProfiles: (state, action: PayloadAction<void>) => {

         state.isFetchingList = true;

      },


      listAcmeProfilesSuccess: (state, action: PayloadAction<AcmeProfileListItemDTO[]>) => {

         state.profiles = action.payload;
         state.isFetchingList = false;

      },


      listAcmeProfilesFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingList = false

      },


      getAcmeProfile: (state, action: PayloadAction<string>) => {

         state.isFetchingDetail = true;

      },


      getAcmeProfileSuccess: (state, action: PayloadAction<AcmeProfileModel>) => {

         state.profile = action.payload;
         state.isFetchingDetail = false;

      },


      getAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingDetail = false

      },


      createAcmeProfile: (state, action: PayloadAction<{
         name: string,
         description: string,
         termsOfServiceUrl: string,
         dnsResolverIp: string,
         dnsResolverPort: string,
         raProfileUuid: string,
         websiteUrl: string,
         retryInterval: number,
         termsOfServiceChangeDisable: boolean,
         validity: number,
         issueCertificateAttributes: AttributeDTO[],
         revokeCertificateAttributes: AttributeDTO[],
         requireContact: boolean,
         requireTermsOfService: boolean,
         termsOfServiceChangeUrl: string
      }>) => {

         state.isCreating = true;

      },


      createAcmeProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      createAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isCreating = false

      },


      editAcmeProfile: (state, action: PayloadAction<{
         uuid: string,
         name: string,
         description: string,
         termsOfServiceUrl: string,
         dnsResolverIp: string,
         dnsResolverPort: string,
         raProfileUuid: string,
         websiteUrl: string,
         retryInterval: number,
         termsOfServiceChangeDisable: boolean,
         validity: number,
         issueCertificateAttributes: AttributeDTO[],
         revokeCertificateAttributes: AttributeDTO[],
         requireContact: boolean,
         requireTermsOfService: boolean,
         termsOfServiceChangeUrl: string
      }>) => {

         state.isUpdating = true;

      },


      editAcmeProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isUpdating = false;

      },


      editAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isUpdating = false

      },


      deleteAcmeProfile: (state, action: PayloadAction<string>) => {

         state.isDeleting = true;

      },


      deleteAcmeProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;
         const profileIndex = state.profiles.findIndex(profile => profile.uuid === action.payload);
         if (profileIndex >= 0) state.profiles.splice(profileIndex, 1);

         if (state.profile?.uuid === action.payload) state.profile = undefined;

      },


      deleteAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isDeleting = false

      },


      enableAcmeProfile: (state, action: PayloadAction<string>) => {

         state.isUpdating = true;

      },


      enableAcmeProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isUpdating = false;
         const profileIndex = state.profiles.findIndex(profile => profile.uuid === action.payload);
         if (profileIndex >= 0) state.profiles[profileIndex].enabled = true;

      },


      enableAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isUpdating = false;

      },


      disableAcmeProfile: (state, action: PayloadAction<string>) => {

         state.isUpdating = true;

      },


      disableAcmeProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isUpdating = false;
         const profileIndex = state.profiles.findIndex(profile => profile.uuid === action.payload);
         if (profileIndex >= 0) state.profiles[profileIndex].enabled = false;

      },


      disableAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {

         state.isUpdating = false;

      },


      bulkDeleteAcmeProfiles: (state, action: PayloadAction<string[]>) => {

         state.isDeleting = true;

      },


      bulkDeleteAcmeProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isDeleting = false;

         action.payload.forEach(uuid => {
            const profileIndex = state.profiles.findIndex(profile => profile.uuid === uuid);
            if (profileIndex >= 0) state.profiles.splice(profileIndex, 1);
         });

      },


      bulkDeleteAcmeProfilesFailed: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

      },


      bulkForceDeleteAcmeProfiles: (state, action: PayloadAction<string[]>) => {

         state.isDeleting = true;

      },


      bulkForceDeleteAcmeProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isDeleting = false;
         action.payload.forEach(uuid => {
            const profileIndex = state.profiles.findIndex(profile => profile.uuid === uuid);
            if (profileIndex >= 0) state.profiles.splice(profileIndex, 1);
         });

      },


      bulkForceDeleteAcmeProfilesFailed: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

      },


      bulkEnableAcmeProfiles: (state, action: PayloadAction<string[]>) => {

         state.isUpdating = true;

      },


      bulkEnableAcmeProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isUpdating = false;
         action.payload.forEach(uuid => {
            const profileIndex = state.profiles.findIndex(profile => profile.uuid === uuid);
            if (profileIndex >= 0) state.profiles[profileIndex].enabled = true;
         });

      },


      bulkEnableAcmeProfilesFailed: (state, action: PayloadAction<string>) => {

         state.isUpdating = false

      },


      bulkDisableAcmeProfiles: (state, action: PayloadAction<string[]>) => {

         state.isUpdating = true;

      },


      bulkDisableAcmeProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isUpdating = false;
         action.payload.forEach(uuid => {
            const profileIndex = state.profiles.findIndex(profile => profile.uuid === uuid);
            if (profileIndex >= 0) state.profiles[profileIndex].enabled = false;
         });

      },


      bulkDisableAcmeProfilesFailed: (state, action: PayloadAction<string>) => {

         state.isUpdating = false

      },

   }
})


const state = createFeatureSelector<State>(slice.name);

const profiles = createSelector(state, state => state.profiles);
const profile = createSelector(state, state => state.profile);

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
   profiles,
   profile,
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
   isBulkForceDeleting,
};


export const actions = slice.actions;


export default slice.reducer;