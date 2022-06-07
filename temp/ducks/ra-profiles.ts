import { AttributeDescriptorModel, AttributeModel } from "models/attributes";
import { RaAcmeLinkModel, RaAuthorizedClientModel, RaProfileModel } from "models/ra-profiles";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type State = {
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingClient: boolean;
    attributes: AttributeModel[];
    isFetchingAttributes: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isEditing: boolean;
    profiles: RaProfileModel[];
    authorizedClients: string[];
    selectedProfile: RaProfileModel | null;
    confirmDeleteProfile: string;
    issuanceAttributes: AttributeDescriptorModel[];
    revocationAttributes: AttributeDescriptorModel[];
    isActivatingAcme: boolean;
    isDeactivatingAcme: boolean;
    isFetchingAcme: boolean;
    acmeDetails: RaAcmeLinkModel | null;
};

export const initialState: State = {
    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingAttributes: false,
    isFetchingClient: false,
    isCreating: false,
    isDeleting: false,
    isEditing: false,
    attributes: [],
    profiles: [],
    authorizedClients: [],
    selectedProfile: null,
    confirmDeleteProfile: "",
    issuanceAttributes: [],
    revocationAttributes: [],
    isActivatingAcme: false,
    isDeactivatingAcme: false,
    isFetchingAcme: false,
    acmeDetails: null,
};


export const slice = createSlice({
    name: "raprofiles",
    initialState,
    reducers: {
        listProfiles: (state, action: PayloadAction<void>) => {
            state.profiles = [];
            state.isFetchingList = true;
        },
        listProfilesSuccess: (state, action: PayloadAction<RaProfileModel[]>) => {
            state.profiles = action.payload;
            state.isFetchingList = false;
        },
        listProfilesFailure: (state, action: PayloadAction<string>) => {
            state.profiles = [];
            state.isFetchingList = false;
        },
        listAuthorizedClients: (state, action: PayloadAction<string>) => {
            state.authorizedClients = [];
            state.isFetchingClient = true;
        },
        listAuthorizedClientsSuccess: (state, action: PayloadAction<RaAuthorizedClientModel[]>) => {
            state.authorizedClients = action.payload.map(client => client.uuid);
            state.isFetchingClient = false;
        },
        listAuthorizedClientsFailure: (state, action: PayloadAction<string>) => {
            state.authorizedClients = [];
            state.isFetchingClient = false;
        },
        getProfileDetail: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },
        getProfileDetailSuccess: (state, action: PayloadAction<RaProfileModel>) => {
            state.isFetchingDetail = false;
            state.selectedProfile = action.payload;
        },
        getProfileDetailFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
        },
        getAttributes: (state, action: PayloadAction<string>) => {
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
            state.selectedProfile = action.payload;
        },
        editProfileFailure: (state, action: PayloadAction<string>) => {
            state.isEditing = false;
        },
        enableProfile: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },
        enableProfileSuccess: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
            const profile = state.profiles.find(p => p.uuid === action.payload);
            if (profile) {
                profile.enabled = true;
            }
        },
        enableProfileFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
        },
        disableProfile: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },
        disableProfileSuccess: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
            const profile = state.profiles.find(p => p.uuid === action.payload);
            if (profile) {
                profile.enabled = false;
            }
        },
        disableProfileFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
        },
        deleteProfile: (state, action: PayloadAction<string>) => {
            state.isDeleting = true;
        },
        deleteProfileSuccess: (state, action: PayloadAction<string>) => {
            state.isDeleting = false;
            state.profiles = state.profiles.filter(p => p.uuid !== action.payload);
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
            state.acmeDetails = null;
        },

        deactivateAcmeFailure: (state, action: PayloadAction<string>) => {
            state.isDeactivatingAcme = false;
        },

        bulkDeleteProfiles: (state, action: PayloadAction<string[]>) => {
            state.isDeleting = true;
        },
        bulkDeleteProfilesSuccess: (state, action: PayloadAction<string[]>) => {
            state.isDeleting = false;
            const profiles = state.profiles.filter(p => !action.payload.includes(p.uuid));
            state.profiles = profiles;

        },
        bulkDeleteProfilesFailure: (state, action: PayloadAction<string>) => {
            state.isDeleting = false;
        },
        bulkEnableProfiles: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = true;
        },
        bulkEnableProfilesSuccess: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = false;
            const profiles = state.profiles.filter(p => !action.payload.includes(p.uuid));
            state.profiles = profiles;
        },
        bulkEnableProfilesFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
        },
        bulkDisableProfiles: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = true;
        },
        bulkDisableProfilesSuccess: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = false;
            const profiles = state.profiles.filter(p => !action.payload.includes(p.uuid));
            state.profiles = profiles;
        },
        bulkDisableProfilesFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
        },
        listIssuanceAttributes: (state, action: PayloadAction<string>) => {
            state.isFetchingAttributes = true;
        },
        listIssuanceAttributesSuccess: (state, action: PayloadAction<AttributeDescriptorModel[]>) => {
            state.isFetchingAttributes = false;
            state.issuanceAttributes = action.payload;
        },
        listIssuanceAttributesFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingAttributes = false;
        },
        listRevocationAttributes: (state, action: PayloadAction<string>) => {
            state.isFetchingAttributes = true;
        },
        listRevocationAttributesSuccess: (state, action: PayloadAction<AttributeDescriptorModel[]>) => {
            state.isFetchingAttributes = false;
            state.revocationAttributes = action.payload;
        },
        listRevocationAttributesFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingAttributes = false;
        }
    }
});


const state = createFeatureSelector<State>(slice.name);

const isFetching = createSelector(
    state,
    (state) =>
        state.isFetchingList ||
        state.isFetchingDetail ||
        state.isFetchingAttributes ||
        state.isFetchingClient ||
        state.isFetchingClient ||
        state.isActivatingAcme ||
        state.isDeactivatingAcme
);

const isCreating = createSelector(state, (state) => state.isCreating);

const isDeleting = createSelector(state, (state) => state.isDeleting);

const isEditing = createSelector(state, (state) => state.isEditing);

const isActivatingAcme = createSelector(
    state,
    (state) => state.isActivatingAcme
);

const isFetchingAcme = createSelector(
    state,
    (state) => state.isFetchingAcme
);

const isDeactivatingAcme = createSelector(
    state,
    (state) => state.isDeactivatingAcme
);

const isFetchingAttributes = createSelector(
    state,
    (state) => state.isFetchingAttributes
);

const profiles = createSelector(state, (state) => state.profiles);

const authorizedClientIds = createSelector(
    state,
    (state) => state.authorizedClients
);

const profile = createSelector(
    state,
    (state) => state.selectedProfile
);

const profileDetail = createSelector(
    profiles,
    profile,
    authorizedClientIds,
    (profiles, selectedProfile, authClients) => {
        if (!selectedProfile) {
            return null;
        }

        const profile = profiles.find(
            (p) => p.uuid.toString() === selectedProfile.uuid.toString()
        );
        if (!profile) {
            return null;
        }

        return {
            ...profile,
            ...selectedProfile,
            authClients,
        };
    }
);

const attributes = createSelector(
    state,
    (state) => state.attributes
);

const issuanceAttributes = createSelector(
    state,
    (state) => state.issuanceAttributes
);

const revocationAttributes = createSelector(
    state,
    (state) => state.revocationAttributes
);

const acmeDetails = createSelector(
    state,
    (state) => state.acmeDetails
);

export const selectors = {
    state,
    isCreating,
    isDeleting,
    isEditing,
    isFetching,
    isFetchingAttributes,
    profiles,
    authorizedClientIds,
    profile,
    profileDetail,
    attributes,
    issuanceAttributes,
    revocationAttributes,
    isActivatingAcme,
    isDeactivatingAcme,
    isFetchingAcme,
    acmeDetails,
};
