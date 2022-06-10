import { AttributeDescriptorModel, AttributeModel } from "models/attributes";
import { RaAcmeLinkModel, RaAuthorizedClientModel, RaProfileModel } from "models/ra-profiles";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type State = {

   raProfile?: RaProfileModel;
   raProfiles: RaProfileModel[];

   authorizedClients?: string[];
   attributes?: AttributeModel[];

   acmeDetails?: RaAcmeLinkModel;

   issuanceAttributes?: AttributeDescriptorModel[];
   revocationAttributes?: AttributeDescriptorModel[];

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
   isEditing: boolean;
   isEnabling: boolean;
   isBulkEnabling: boolean;
   isDisabling: boolean;
   isBulkDisabling: boolean;
   isActivatingAcme: boolean;
   isDeactivatingAcme: boolean;

};

export const initialState: State = {

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
   isEditing: false,
   isEnabling: false,
   isDisabling: false,
   isBulkEnabling: false,
   isBulkDisabling: false,
   isActivatingAcme: false,
   isDeactivatingAcme: false,

};


export const slice = createSlice({

   name: "raprofiles",

   initialState,

   reducers: {

      listProfiles: (state, action: PayloadAction<void>) => {

         state.raProfiles = [];
         state.isFetchingList = true;

      },


      listProfilesSuccess: (state, action: PayloadAction<RaProfileModel[]>) => {

         state.raProfiles = action.payload;
         state.isFetchingList = false;

      },


      listProfilesFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingList = false;

      },


      listAuthorizedClients: (state, action: PayloadAction<string>) => {

         state.authorizedClients = undefined;
         state.isFetchingAuthorizedClients = true;

      },


      listAuthorizedClientsSuccess: (state, action: PayloadAction<RaAuthorizedClientModel[]>) => {

         state.authorizedClients = action.payload.map(client => client.uuid);
         state.isFetchingAuthorizedClients = false;

      },


      listAuthorizedClientsFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingAuthorizedClients = false;

      },


      getProfileDetail: (state, action: PayloadAction<string>) => {

         state.raProfile = undefined;
         state.isFetchingDetail = true;

      },


      getProfileDetailSuccess: (state, action: PayloadAction<RaProfileModel>) => {

         state.isFetchingDetail = false;
         state.raProfile = action.payload;

      },


      getProfileDetailFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingDetail = false;

      },


      getAttributes: (state, action: PayloadAction<string>) => {

         state.attributes = undefined;
         state.isFetchingAttributes = true;

      },


      getAttributesSuccess: (state, action: PayloadAction<AttributeModel[]>) => {

         state.isFetchingAttributes = false;
         state.attributes = action.payload;

      },


      getAttributesFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingAttributes = false;

      },


      createProfile: (state, action: PayloadAction<{
         authorityInstanceUuid: string,
         name: string,
         description: string,
         attributes: AttributeModel[]
      }>) => {

         state.isCreating = true;

      },


      createProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      createProfileFailure: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      editProfile: (state, action: PayloadAction<{
         profileUuid: string,
         authorityInstanceUuid: string,
         description: string,
         enabled: boolean,
         attributes: AttributeModel[]
      }>) => {

         state.isEditing = true;

      },


      editProfileSuccess: (state, action: PayloadAction<RaProfileModel>) => {

         state.isEditing = false;
         state.raProfile = action.payload;

      },


      editProfileFailure: (state, action: PayloadAction<string>) => {

         state.isEditing = false;

      },


      enableProfile: (state, action: PayloadAction<string>) => {

         state.isEnabling = true;

      },


      enableProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

         const raProfile = state.raProfiles.find(raProfile => raProfile.uuid === action.payload);
         if (raProfile) raProfile.enabled = true;

      },


      enableProfileFailure: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

      },


      disableProfile: (state, action: PayloadAction<string>) => {

         state.isDisabling = true;

      },


      disableProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

         const raProfile = state.raProfiles.find(raProfile => raProfile.uuid === action.payload);
         if (raProfile) raProfile.enabled = false;

      },


      disableProfileFailure: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

      },


      deleteProfile: (state, action: PayloadAction<string>) => {

         state.isDeleting = true;

      },


      deleteProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

         const index = state.raProfiles.findIndex(raProfile => raProfile.uuid === action.payload);
         if (index !== -1) state.raProfiles.splice(index, 1);

      },


      deleteProfileFailure: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

      },


      activateAcme: (state, action: PayloadAction<{
         uuid: string,
         acmeProfileUuid: string,
         issueCertificateAttributes: AttributeModel[],
         revokeCertificateAttributes: AttributeModel[]
      }>) => {

         state.isActivatingAcme = true;

      },


      activateAcmeSuccess: (state, action: PayloadAction<RaAcmeLinkModel>) => {

         state.isActivatingAcme = false;
         state.acmeDetails = action.payload;

      },


      activateAcmeFailure: (state, action: PayloadAction<string>) => {

         state.isActivatingAcme = false;

      },


      deactivateAcme: (state, action: PayloadAction<string>) => {

         state.isDeactivatingAcme = true;

      },


      deactivateAcmeSuccess: (state, action: PayloadAction<string>) => {

         state.isDeactivatingAcme = false;
         state.acmeDetails = undefined;

      },


      deactivateAcmeFailure: (state, action: PayloadAction<string>) => {

         state.isDeactivatingAcme = false;

      },


      bulkDeleteProfiles: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = false;

         state.raProfiles = state.raProfiles.filter(p => !action.payload.includes(p.uuid));

      },


      bulkDeleteProfilesFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDeleting = false;

      },


      bulkEnableProfiles: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = false;

         state.raProfiles = state.raProfiles.map(raProfile => ({ ...raProfile, enabled: true }));

      },


      bulkEnableProfilesFailure: (state, action: PayloadAction<string>) => {

         state.isBulkEnabling = false;

      },


      bulkDisableProfiles: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = false;

         state.raProfiles = state.raProfiles.map(raProfile => ({ ...raProfile, enabled: false }));

      },


      bulkDisableProfilesFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDisabling = false;

      },


      listIssuanceAttributes: (state, action: PayloadAction<string>) => {

         state.isFetchingIssuanceAttributes = true;

      },


      listIssuanceAttributesSuccess: (state, action: PayloadAction<AttributeDescriptorModel[]>) => {

         state.isFetchingIssuanceAttributes = false;

         state.issuanceAttributes = action.payload;

      },


      listIssuanceAttributesFailure: (state, action: PayloadAction<string>) => {

         state.isFetchingIssuanceAttributes = false;

      },


      listRevocationAttributes: (state, action: PayloadAction<string>) => {

         state.isFetchinRevocationAttributes = true;

      },


      listRevocationAttributesSuccess: (state, action: PayloadAction<AttributeDescriptorModel[]>) => {

         state.isFetchinRevocationAttributes = false;
         state.revocationAttributes = action.payload;

      },


      listRevocationAttributesFailure: (state, action: PayloadAction<string>) => {
         state.isFetchinRevocationAttributes = false;
      }

   }
});


const state = createFeatureSelector<State>(slice.name);

const raProfile = createSelector(state, (state: State) => state.raProfile);
const raProfiles = createSelector(state, (state: State) => state.raProfiles);
const authorizedClients = createSelector(state, (state: State) => state.authorizedClients);
const attributes = createSelector(state, (state: State) => state.attributes);
const acmeDetails = createSelector(state, (state: State) => state.acmeDetails);
const issuanceAttributes = createSelector(state, (state: State) => state.issuanceAttributes);
const revocationAttributes = createSelector(state, (state: State) => state.revocationAttributes);

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isFetchingAuthorizedClients = createSelector(state, (state: State) => state.isFetchingAuthorizedClients);
const isFetchingAttributes = createSelector(state, (state: State) => state.isFetchingAttributes);
const isFetchingIssuanceAttributes = createSelector(state, (state: State) => state.isFetchingIssuanceAttributes);
const isFetchinRevocationAttributes = createSelector(state, (state: State) => state.isFetchinRevocationAttributes);
const isFetchingAcmeDetails = createSelector(state, (state: State) => state.isFetchingAcmeDetails);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isEditing = createSelector(state, (state: State) => state.isEditing);
const isEnabling = createSelector(state, (state: State) => state.isEnabling);
const isBulkEnabling = createSelector(state, (state: State) => state.isBulkEnabling);
const isDisabling = createSelector(state, (state: State) => state.isDisabling);
const isBulkDisabling = createSelector(state, (state: State) => state.isBulkDisabling);
const isActivatingAcme = createSelector(state, (state: State) => state.isActivatingAcme);
const isDeactivatingAcme = createSelector(state, (state: State) => state.isDeactivatingAcme);


export const selectors = {
   state,
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
   isFetchinRevocationAttributes,
   isFetchingAcmeDetails,
   isCreating,
   isDeleting,
   isBulkDeleting,
   isEditing,
   isEnabling,
   isBulkEnabling,
   isDisabling,
   isBulkDisabling,
   isActivatingAcme,
   isDeactivatingAcme
};

export const actions = slice.actions;

export default slice.reducer;
