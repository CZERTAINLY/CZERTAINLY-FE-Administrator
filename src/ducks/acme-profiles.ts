import { AcmeProfileDTO, AcmeProfileListItemDTO } from "api/acme-profile";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorDeleteObject } from "models/commons";
import { createFeatureSelector } from "utils/ducks";
import { AcmeProfileListModel, AcmeProfileModel } from "models/acme-profiles";
import { AttributeDTO } from "api/_common/attributeDTO";

export type State = {
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  profiles: AcmeProfileListModel[];
  profile: AcmeProfileModel | null;
  confirmDeleteProfile: string;
  deleteProfileErrors: ErrorDeleteObject[];
};


export const initialState: State = {
  isFetchingList: false,
  isFetchingDetail: false,
  isCreating: false,
  isDeleting: false,
  isEditing: false,
  profiles: [],
  profile: null,
  confirmDeleteProfile: "",
  deleteProfileErrors: [],
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
      state.isEditing = true;
    },
    editAcmeProfileSuccess: (state, action: PayloadAction<string>) => {
      state.isEditing = false;
    },
    editAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {
      state.isEditing = false
    },
    deleteAcmeProfile: (state, action: PayloadAction<string>) => {
      state.isDeleting = true;
    },
    deleteAcmeProfileSuccess: (state, action: PayloadAction<string>) => {
      state.isDeleting = false;
      const profileIndex = state.profiles.findIndex(profile => profile.uuid === action.payload);
      if (profileIndex >= 0) state.profiles.splice(profileIndex, 1);

      if (state.profile?.uuid === action.payload) state.profile = null;
    },
    deleteAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {
      state.isDeleting = false
    },
    enableAcmeProfile: (state, action: PayloadAction<string>) => {
      state.isEditing = true;
    },
    enableAcmeProfileSuccess: (state, action: PayloadAction<string>) => {
      state.isEditing = false;
      const profileIndex = state.profiles.findIndex(profile => profile.uuid === action.payload);
      if (profileIndex >= 0) state.profiles[profileIndex].enabled = true;
    },
    enableAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {
      state.isEditing = false
    },
    disableAcmeProfile: (state, action: PayloadAction<string>) => {
      state.isEditing = true;
    },
    disableAcmeProfileSuccess: (state, action: PayloadAction<string>) => {
      state.isEditing = false;
      const profileIndex = state.profiles.findIndex(profile => profile.uuid === action.payload);
      if (profileIndex >= 0) state.profiles[profileIndex].enabled = false;
    },
    disableAcmeProfileFailed: (state, action: PayloadAction<string | undefined>) => {
      state.isEditing = false
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
      state.isEditing = true;
    },
    bulkEnableAcmeProfilesSuccess: (state, action: PayloadAction<string[]>) => {
      state.isEditing = false;
      action.payload.forEach(uuid => {
        const profileIndex = state.profiles.findIndex(profile => profile.uuid === uuid);
        if (profileIndex >= 0) state.profiles[profileIndex].enabled = true;
      });
    },
    bulkEnableAcmeProfilesFailed: (state, action: PayloadAction<string>) => { state.isEditing = false },
    bulkDisableAcmeProfiles: (state, action: PayloadAction<string[]>) => {
      state.isEditing = true;
    },
    bulkDisableAcmeProfilesSuccess: (state, action: PayloadAction<string[]>) => {
      state.isEditing = false;
      action.payload.forEach(uuid => {
        const profileIndex = state.profiles.findIndex(profile => profile.uuid === uuid);
        if (profileIndex >= 0) state.profiles[profileIndex].enabled = false;
      });
    },
    bulkDisableAcmeProfilesFailed: (state, action: PayloadAction<string>) => { state.isEditing = false },
  }
})


const state = createFeatureSelector<State>(slice.name);

const isFetching = createSelector(
  state,
  (state) => state.isFetchingList || state.isFetchingDetail
);

const isCreating = createSelector(state, (state) => state.isCreating);

const isDeleting = createSelector(state, (state) => state.isDeleting);

const isEditing = createSelector(state, (state) => state.isEditing);

const profiles = createSelector(state, (state) => state.profiles);

const profile = createSelector(
  state,
  (state) => state.profile
);

const profileDetail = createSelector(
  profiles,
  profile,
  (profiles, selectedProfile) => {
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
    };
  }
);

const confirmDeleteProfileId = createSelector(
  state,
  (state) => state.confirmDeleteProfile
);

const deleteProfileError = createSelector(
  state,
  (state) => state.deleteProfileErrors
);

export const selectors = {
  state,
  isCreating,
  isDeleting,
  isEditing,
  isFetching,
  profiles,
  profile,
  profileDetail,
  confirmDeleteProfileId,
  deleteProfileError,
};