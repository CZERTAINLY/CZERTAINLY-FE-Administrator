import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { RaAcmeLinkModel, RaAuthorizedClientModel, RaProfileModel } from "models/ra-profiles";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";

export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   raProfile?: RaProfileModel;
   raProfiles: RaProfileModel[];

   authorizedClients?: string[];
   attributes?: AttributeModel[];

   acmeDetails?: RaAcmeLinkModel;

   issuanceAttributesDescriptors?: AttributeDescriptorModel[];
   revocationAttributesDescriptors?: AttributeDescriptorModel[];

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isFetchingAuthorizedClients: boolean;
   isFetchingAttributes: boolean;
   isFetchingIssuanceAttributes: boolean;
   isFetchinRevocationAttributes: boolean;

   isFetchingAcmeDetails: boolean;

   isCreating: boolean;
   isDeleting: boolean;
   isBulkDeleting: boolean;
   isUpdating: boolean;
   isEnabling: boolean;
   isBulkEnabling: boolean;
   isDisabling: boolean;
   isBulkDisabling: boolean;
   isActivatingAcme: boolean;
   isDeactivatingAcme: boolean;
   isCheckingCompliance: boolean;
   isAssociatingComplianceProfile: boolean;
   isDissociatingComplianceProfile: boolean;

};

export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   raProfiles: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isFetchingAuthorizedClients: false,
   isFetchingAttributes: false,
   isFetchingIssuanceAttributes: false,
   isFetchinRevocationAttributes: false,
   isFetchingAcmeDetails: false,
   isCreating: false,
   isDeleting: false,
   isBulkDeleting: false,
   isUpdating: false,
   isEnabling: false,
   isDisabling: false,
   isBulkEnabling: false,
   isBulkDisabling: false,
   isActivatingAcme: false,
   isDeactivatingAcme: false,
   isCheckingCompliance: false,
   isAssociatingComplianceProfile: false,
   isDissociatingComplianceProfile: false,

};


export const slice = createSlice({

   name: "raprofiles",

   initialState,

   reducers: {

      resetState: (state, action: PayloadAction<void>) => {

         for (const key in state) {
            if (!initialState.hasOwnProperty(key)) {
               (state as any)[key] = undefined;
            }
         }

         for (const key in initialState) {
            (state as any)[key] = (initialState as any)[key];
         }

      },


      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },


      clearIssuanceAttributesDescriptors: (state, action: PayloadAction<void>) => {

         state.issuanceAttributesDescriptors = undefined;

      },


      clearRevocationAttributesDescriptors: (state, action: PayloadAction<void>) => {

         state.revocationAttributesDescriptors = undefined;

      },


      listRaProfiles: (state, action: PayloadAction<void>) => {

         state.raProfiles = [];
         state.isFetchingList = true;

      },


      listRaProfilesSuccess: (state, action: PayloadAction<{ raProfiles: RaProfileModel[] }>) => {

         state.raProfiles = action.payload.raProfiles;
         state.isFetchingList = false;

      },


      listRaProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      listAuthorizedClients: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.authorizedClients = undefined;
         state.isFetchingAuthorizedClients = true;

      },


      listAuthorizedClientsSuccess: (state, action: PayloadAction<{ authorizedClientsUuids: RaAuthorizedClientModel[] }>) => {

         state.authorizedClients = action.payload.authorizedClientsUuids.map(client => client.uuid);
         state.isFetchingAuthorizedClients = false;

      },


      listAuthorizedClientsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAuthorizedClients = false;

      },


      getRaProfileDetail: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.raProfile = undefined;
         state.isFetchingDetail = true;

      },


      getRaProfileDetailSuccess: (state, action: PayloadAction<{ raProfile: RaProfileModel }>) => {

         state.isFetchingDetail = false;
         state.raProfile = action.payload.raProfile;

      },


      getRaProfileDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false;

      },


      createRaProfile: (state, action: PayloadAction<{
         authorityInstanceUuid: string,
         name: string,
         description: string,
         attributes: AttributeModel[]
      }>) => {

         state.isCreating = true;

      },


      createRaProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isCreating = false;

      },


      createRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      updateRaProfile: (state, action: PayloadAction<{
         profileUuid: string,
         authorityInstanceUuid: string,
         description: string,
         enabled: boolean,
         attributes: AttributeModel[]
      }>) => {

         state.isUpdating = true;

      },


      updateRaProfileSuccess: (state, action: PayloadAction<{ raProfile: RaProfileModel }>) => {

         state.isUpdating = false;
         state.raProfile = action.payload.raProfile;

      },


      updateRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false;

      },


      enableRaProfile: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isEnabling = true;

      },


      enableRaProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = false;

         const raProfile = state.raProfiles.find(raProfile => raProfile.uuid === action.payload.uuid);
         if (raProfile) raProfile.enabled = true;

         if (state.raProfile?.uuid === action.payload.uuid) state.raProfile.enabled = true;

      },


      enableRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isEnabling = false;

      },


      disableRaProfile: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isDisabling = true;

      },


      disableRaProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = false;

         const raProfile = state.raProfiles.find(raProfile => raProfile.uuid === action.payload.uuid);
         if (raProfile) raProfile.enabled = false;

         if (state.raProfile?.uuid === action.payload.uuid) state.raProfile.enabled = false;

      },


      disableRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDisabling = false;

      },


      deleteRaProfile: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isDeleting = true;

      },


      deleteRaProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = false;

         const index = state.raProfiles.findIndex(raProfile => raProfile.uuid === action.payload.uuid);
         if (index !== -1) state.raProfiles.splice(index, 1);

         if (state.raProfile?.uuid === action.payload.uuid) state.raProfile = undefined;

      },


      deleteRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false;

      },


      activateAcme: (state, action: PayloadAction<{
         authorityUuid: string, 
         uuid: string,
         acmeProfileUuid: string,
         issueCertificateAttributes: AttributeModel[],
         revokeCertificateAttributes: AttributeModel[]
      }>) => {

         state.isActivatingAcme = true;

      },


      activateAcmeSuccess: (state, action: PayloadAction<{ raAcmelink: RaAcmeLinkModel }>) => {

         state.isActivatingAcme = false;
         state.acmeDetails = action.payload.raAcmelink;

      },


      activateAcmeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isActivatingAcme = false;

      },


      deactivateAcme: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isDeactivatingAcme = true;

      },


      deactivateAcmeSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeactivatingAcme = false;
         state.acmeDetails = undefined;

      },


      deactivateAcmeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeactivatingAcme = false;

      },


      getAcmeDetails: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isFetchingAcmeDetails = true;

      },


      getAcmeDetailsSuccess: (state, action: PayloadAction<{ raAcmeLink: RaAcmeLinkModel }>) => {

         state.isFetchingAcmeDetails = false;
         state.acmeDetails = action.payload.raAcmeLink;

      },


      getAcmeDetailsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAcmeDetails = false;

      },


      bulkDeleteRaProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteRaProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const index = state.raProfiles.findIndex(raProfile => raProfile.uuid === uuid);
               if (index >= 0) state.raProfiles.splice(index, 1);
            }

         );

         if (state.raProfile && action.payload.uuids.includes(state.raProfile.uuid)) state.raProfile = undefined;

      },


      bulkDeleteRaProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkEnableRaProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableRaProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

         state.raProfiles = state.raProfiles.map(
            raProfile => ({ ...raProfile, enabled: action.payload.uuids.includes(raProfile.uuid) ? true : raProfile.enabled })
         );

         if (state.raProfile && action.payload.uuids.includes(state.raProfile.uuid)) state.raProfile.enabled = true;

      },


      bulkEnableRaProfilesFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkEnabling = false;

      },


      bulkDisableRaProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableRaProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

         state.raProfiles = state.raProfiles.map(
            raProfile => ({ ...raProfile, enabled: action.payload.uuids.includes(raProfile.uuid) ? false : raProfile.enabled })
         );

         if (state.raProfile && action.payload.uuids.includes(state.raProfile.uuid)) state.raProfile.enabled = false;

      },


      bulkDisableRaProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDisabling = false;

      },


      listIssuanceAttributeDescriptors: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isFetchingIssuanceAttributes = true;

      },


      listIssuanceAttributesDescriptorsSuccess: (state, action: PayloadAction<{ uuid: string, attributesDescriptors: AttributeDescriptorModel[] }>) => {

         state.isFetchingIssuanceAttributes = false;

         state.issuanceAttributesDescriptors = action.payload.attributesDescriptors;

      },


      listIssuanceAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingIssuanceAttributes = false;

      },


      listRevocationAttributeDescriptors: (state, action: PayloadAction<{ authorityUuid: string, uuid: string }>) => {

         state.isFetchinRevocationAttributes = true;

      },


      listRevocationAttributeDescriptorsSuccess: (state, action: PayloadAction<{ uuid: string, attributesDescriptors: AttributeDescriptorModel[] }>) => {

         state.isFetchinRevocationAttributes = false;
         state.revocationAttributesDescriptors = action.payload.attributesDescriptors;

      },


      listRevocationAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
         state.isFetchinRevocationAttributes = false;
      },

      checkCompliance: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isCheckingCompliance = true;
      },

      checkComplianceSuccess: (state, action: PayloadAction<void>) => {

         state.isCheckingCompliance = false;
      },

      checkComplianceFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCheckingCompliance = false;
      },

      associateRaProfile: (state, action: PayloadAction<{ uuid: string, complianceProfileUuid: string, complianceProfileName: string, description?: string }>) => {

         state.isAssociatingComplianceProfile = true;

      },


      associateRaProfileSuccess: (state, action: PayloadAction<{ uuid: string, complianceProfileUuid: string, complianceProfileName: string, description?: string }>) => {

         state.isAssociatingComplianceProfile = false;

         if (!state.raProfile) return;

         state.raProfile.complianceProfiles = (state.raProfile.complianceProfiles || []).concat([{uuid: action.payload.complianceProfileUuid, name: action.payload.complianceProfileName, description: action.payload.description}]);

      },


      associateRaProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isAssociatingComplianceProfile = false;
      },


      dissociateRaProfile: (state, action: PayloadAction<{ uuid: string, complianceProfileUuid: string, complianceProfileName: string, description?: string }>) => {

         state.isDissociatingComplianceProfile = true;
      },

      dissociateRaProfileSuccess: (state, action: PayloadAction<{ uuid: string, complianceProfileUuid: string, complianceProfileName: string, description?: string }>) => {

         state.isDissociatingComplianceProfile = false;

         if (!state.raProfile) return;
         if (!state.raProfile.complianceProfiles) return;
         const raProfileIndex = state.raProfile.complianceProfiles.findIndex(profile => profile.uuid === action.payload.complianceProfileUuid);
         if (raProfileIndex >= 0) state.raProfile.complianceProfiles.splice(raProfileIndex, 1);
      },

      dissociateRaProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDissociatingComplianceProfile = false;
      },

   }
});


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const raProfile = createSelector(state, (state: State) => state.raProfile);
const raProfiles = createSelector(state, (state: State) => state.raProfiles);

const authorizedClients = createSelector(state, (state: State) => state.authorizedClients);
const attributes = createSelector(state, (state: State) => state.attributes);
const acmeDetails = createSelector(state, (state: State) => state.acmeDetails);
const issuanceAttributes = createSelector(state, (state: State) => state.issuanceAttributesDescriptors);
const revocationAttributes = createSelector(state, (state: State) => state.revocationAttributesDescriptors);

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isFetchingAuthorizedClients = createSelector(state, (state: State) => state.isFetchingAuthorizedClients);
const isFetchingAttributes = createSelector(state, (state: State) => state.isFetchingAttributes);
const isFetchingIssuanceAttributes = createSelector(state, (state: State) => state.isFetchingIssuanceAttributes);
const isFetchingRevocationAttributes = createSelector(state, (state: State) => state.isFetchinRevocationAttributes);
const isFetchingAcmeDetails = createSelector(state, (state: State) => state.isFetchingAcmeDetails);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);
const isEnabling = createSelector(state, (state: State) => state.isEnabling);
const isBulkEnabling = createSelector(state, (state: State) => state.isBulkEnabling);
const isDisabling = createSelector(state, (state: State) => state.isDisabling);
const isBulkDisabling = createSelector(state, (state: State) => state.isBulkDisabling);
const isActivatingAcme = createSelector(state, (state: State) => state.isActivatingAcme);
const isDeactivatingAcme = createSelector(state, (state: State) => state.isDeactivatingAcme);


export const selectors = {

   state,

   checkedRows,

   raProfile,
   raProfiles,

   authorizedClients,
   attributes,
   acmeDetails,
   issuanceAttributes,
   revocationAttributes,

   isFetchingList,
   isFetchingDetail,
   isFetchingAuthorizedClients,
   isFetchingAttributes,
   isFetchingIssuanceAttributes,
   isFetchingRevocationAttributes,
   isFetchingAcmeDetails,
   isCreating,
   isDeleting,
   isBulkDeleting,
   isUpdating,
   isEnabling,
   isBulkEnabling,
   isDisabling,
   isBulkDisabling,
   isActivatingAcme,
   isDeactivatingAcme

};


export const actions = slice.actions;


export default slice.reducer;
