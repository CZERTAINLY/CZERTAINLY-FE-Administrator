import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { RaAcmeLinkModel, RaAuthorizedClientModel, RaProfileModel } from "models/ra-profiles";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type State = {

   checkedRows: string[];

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

   checkedRows: [],

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

      setCheckedRows(state, action: PayloadAction<string[]>) {

         state.checkedRows = action.payload;

      },


      listRaProfiles: (state, action: PayloadAction<void>) => {

         state.raProfiles = [];
         state.isFetchingList = true;

      },


      listRaProfilesSuccess: (state, action: PayloadAction<RaProfileModel[]>) => {

         state.raProfiles = action.payload;
         state.isFetchingList = false;

      },


      listRaProfilesFailure: (state, action: PayloadAction<string>) => {

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


      getRaProfileDetail: (state, action: PayloadAction<string>) => {

         state.raProfile = undefined;
         state.isFetchingDetail = true;

      },


      getRaProfileDetailSuccess: (state, action: PayloadAction<RaProfileModel>) => {

         state.isFetchingDetail = false;
         state.raProfile = action.payload;

      },


      getRaProfileDetailFailure: (state, action: PayloadAction<string>) => {

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


      createRaProfile: (state, action: PayloadAction<{
         authorityInstanceUuid: string,
         name: string,
         description: string,
         attributes: AttributeModel[]
      }>) => {

         state.isCreating = true;

      },


      createRaProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      createRaProfileFailure: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

      },


      updateRaProfile: (state, action: PayloadAction<{
         profileUuid: string,
         authorityInstanceUuid: string,
         description: string,
         enabled: boolean,
         attributes: AttributeModel[]
      }>) => {

         state.isEditing = true;

      },


      updateRaProfileSuccess: (state, action: PayloadAction<RaProfileModel>) => {

         state.isEditing = false;
         state.raProfile = action.payload;

      },


      updateRaProfileFailure: (state, action: PayloadAction<string>) => {

         state.isEditing = false;

      },


      enableRaProfile: (state, action: PayloadAction<string>) => {

         state.isEnabling = true;

      },


      enableRaProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

         const raProfile = state.raProfiles.find(raProfile => raProfile.uuid === action.payload);
         if (raProfile) raProfile.enabled = true;

      },


      enableRaProfileFailure: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

      },


      disableRaProfile: (state, action: PayloadAction<string>) => {

         state.isDisabling = true;

      },


      disableRaProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

         const raProfile = state.raProfiles.find(raProfile => raProfile.uuid === action.payload);
         if (raProfile) raProfile.enabled = false;

      },


      disableRaProfileFailure: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

      },


      deleteRaProfile: (state, action: PayloadAction<string>) => {

         state.isDeleting = true;

      },


      deleteRaProfileSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

         const index = state.raProfiles.findIndex(raProfile => raProfile.uuid === action.payload);
         if (index !== -1) state.raProfiles.splice(index, 1);

      },


      deleteRaProfileFailure: (state, action: PayloadAction<string>) => {

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


      bulkDeleteRaProfiles: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteRaProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = false;

         state.raProfiles = state.raProfiles.filter(p => !action.payload.includes(p.uuid));

      },


      bulkDeleteRaProfilesFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDeleting = false;

      },


      bulkEnableRaProfiles: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableRaProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = false;

         state.raProfiles = state.raProfiles.map(raProfile => ({ ...raProfile, enabled: true }));

      },


      bulkEnableRaProfilesFailure: (state, action: PayloadAction<string>) => {

         state.isBulkEnabling = false;

      },


      bulkDisableRaProfiles: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableRaProfilesSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = false;

         state.raProfiles = state.raProfiles.map(raProfile => ({ ...raProfile, enabled: false }));

      },


      bulkDisableRaProfilesFailure: (state, action: PayloadAction<string>) => {

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

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

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
   isFetchinRevocationAttributes,
   isFetchingAcmeDetails,
   isCreating,
   isDeleting,
   isBulkDeleting,
   isUpdating: isEditing,
   isEnabling,
   isBulkEnabling,
   isDisabling,
   isBulkDisabling,
   isActivatingAcme,
   isDeactivatingAcme
};

export const actions = slice.actions;

export default slice.reducer;
