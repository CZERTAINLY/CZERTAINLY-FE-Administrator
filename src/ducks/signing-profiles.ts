import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ApprovalProfileDto,
    CertificateDto,
    IlmSigningProtocolActivationDetailDto,
    PaginationResponseDtoDigitalSignatureListDto,
    SearchFieldDataByGroupDto,
    SigningProfileDto,
    SigningProfileListDto,
    SigningProfileRequestDto,
    SigningProtocol,
    SigningWorkflowType,
    TspActivationDetailDto,
} from 'types/openapi';
import { BulkActionMessageDto } from 'types/openapi/models/BulkActionMessageDto';
import { SearchRequestModel } from 'types/certificate';

export type State = {
    deleteErrorMessage: string;
    bulkDeleteErrorMessages: BulkActionMessageDto[];

    signingProfile?: SigningProfileDto;
    signingProfiles: SigningProfileListDto[];

    associatedApprovalProfiles: ApprovalProfileDto[];
    ilmActivationDetails?: IlmSigningProtocolActivationDetailDto;
    tspActivationDetails?: TspActivationDetailDto;
    supportedProtocols: SigningProtocol[];
    signingCertificates: CertificateDto[];
    digitalSignatures?: PaginationResponseDtoDigitalSignatureListDto;

    searchableFields?: SearchFieldDataByGroupDto[];

    isFetchingDetail: boolean;
    isFetchingSearchableFields: boolean;
    isFetchingAssociatedApprovalProfiles: boolean;
    isFetchingIlmActivationDetails: boolean;
    isFetchingTspActivationDetails: boolean;
    isFetchingSupportedProtocols: boolean;
    isFetchingSigningCertificates: boolean;
    isFetchingDigitalSignatures: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isUpdating: boolean;
    isEnabling: boolean;
    isDisabling: boolean;
    isBulkDeleting: boolean;
    isBulkEnabling: boolean;
    isBulkDisabling: boolean;
    isActivatingIlm: boolean;
    isDeactivatingIlm: boolean;
    isActivatingTsp: boolean;
    isDeactivatingTsp: boolean;
    isAssociatingApprovalProfile: boolean;
    isDisassociatingApprovalProfile: boolean;
};

export const initialState: State = {
    deleteErrorMessage: '',
    bulkDeleteErrorMessages: [],

    signingProfiles: [],

    associatedApprovalProfiles: [],
    supportedProtocols: [],
    signingCertificates: [],

    isFetchingDetail: false,
    isFetchingSearchableFields: false,
    isFetchingAssociatedApprovalProfiles: false,
    isFetchingIlmActivationDetails: false,
    isFetchingTspActivationDetails: false,
    isFetchingSupportedProtocols: false,
    isFetchingSigningCertificates: false,
    isFetchingDigitalSignatures: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
    isEnabling: false,
    isDisabling: false,
    isBulkDeleting: false,
    isBulkEnabling: false,
    isBulkDisabling: false,
    isActivatingIlm: false,
    isDeactivatingIlm: false,
    isActivatingTsp: false,
    isDeactivatingTsp: false,
    isAssociatingApprovalProfile: false,
    isDisassociatingApprovalProfile: false,
};

export const slice = createSlice({
    name: 'signingProfiles',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });
            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = '';
            state.bulkDeleteErrorMessages = [];
        },

        // List
        listSigningProfiles: (state, action: PayloadAction<SearchRequestModel>) => {},

        listSigningProfilesSuccess: (state, action: PayloadAction<{ signingProfiles: SigningProfileListDto[] }>) => {
            state.signingProfiles = action.payload.signingProfiles;
        },

        listSigningProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {},

        // Get detail
        getSigningProfile: (state, action: PayloadAction<{ uuid: string; version?: number }>) => {
            state.isFetchingDetail = true;
        },

        getSigningProfileSuccess: (state, action: PayloadAction<{ signingProfile: SigningProfileDto }>) => {
            state.isFetchingDetail = false;
            state.signingProfile = action.payload.signingProfile;
        },

        getSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        // Searchable fields
        listSigningProfileSearchableFields: (state, action: PayloadAction<void>) => {
            state.isFetchingSearchableFields = true;
        },

        listSigningProfileSearchableFieldsSuccess: (state, action: PayloadAction<{ searchableFields: SearchFieldDataByGroupDto[] }>) => {
            state.isFetchingSearchableFields = false;
            state.searchableFields = action.payload.searchableFields;
        },

        listSigningProfileSearchableFieldsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSearchableFields = false;
        },

        // Create
        createSigningProfile: (state, action: PayloadAction<{ signingProfileRequestDto: SigningProfileRequestDto }>) => {
            state.isCreating = true;
        },

        createSigningProfileSuccess: (state, action: PayloadAction<{ signingProfile: SigningProfileDto }>) => {
            state.isCreating = false;
        },

        createSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        // Update
        updateSigningProfile: (state, action: PayloadAction<{ uuid: string; signingProfileRequestDto: SigningProfileRequestDto }>) => {
            state.isUpdating = true;
        },

        updateSigningProfileSuccess: (state, action: PayloadAction<{ signingProfile: SigningProfileDto }>) => {
            state.isUpdating = false;
            state.signingProfile = action.payload.signingProfile;
        },

        updateSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        // Delete
        deleteSigningProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
            state.deleteErrorMessage = '';
        },

        deleteSigningProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const idx = state.signingProfiles.findIndex((p) => p.uuid === action.payload.uuid);
            if (idx >= 0) state.signingProfiles.splice(idx, 1);

            if (state.signingProfile?.uuid === action.payload.uuid) {
                state.signingProfile = undefined;
            }
        },

        deleteSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
        },

        // Enable / Disable
        enableSigningProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableSigningProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const idx = state.signingProfiles.findIndex((p) => p.uuid === action.payload.uuid);
            if (idx >= 0) state.signingProfiles[idx].enabled = true;

            if (state.signingProfile?.uuid === action.payload.uuid) {
                state.signingProfile.enabled = true;
            }
        },

        enableSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableSigningProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = true;
        },

        disableSigningProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = false;

            const idx = state.signingProfiles.findIndex((p) => p.uuid === action.payload.uuid);
            if (idx >= 0) state.signingProfiles[idx].enabled = false;

            if (state.signingProfile?.uuid === action.payload.uuid) {
                state.signingProfile.enabled = false;
            }
        },

        disableSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },

        // Bulk operations
        bulkDeleteSigningProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.bulkDeleteErrorMessages = [];
            state.isBulkDeleting = true;
        },

        bulkDeleteSigningProfilesSuccess: (state, action: PayloadAction<{ uuids: string[]; errors: BulkActionMessageDto[] }>) => {
            state.isBulkDeleting = false;

            if (action.payload.errors?.length > 0) {
                state.bulkDeleteErrorMessages = action.payload.errors;
                return;
            }

            action.payload.uuids.forEach((uuid) => {
                const idx = state.signingProfiles.findIndex((p) => p.uuid === uuid);
                if (idx >= 0) state.signingProfiles.splice(idx, 1);
            });

            if (state.signingProfile && action.payload.uuids.includes(state.signingProfile.uuid)) {
                state.signingProfile = undefined;
            }
        },

        bulkDeleteSigningProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },

        bulkEnableSigningProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = true;
        },

        bulkEnableSigningProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = false;

            action.payload.uuids.forEach((uuid) => {
                const idx = state.signingProfiles.findIndex((p) => p.uuid === uuid);
                if (idx >= 0) state.signingProfiles[idx].enabled = true;
            });

            if (state.signingProfile && action.payload.uuids.includes(state.signingProfile.uuid)) {
                state.signingProfile.enabled = true;
            }
        },

        bulkEnableSigningProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkEnabling = false;
        },

        bulkDisableSigningProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = true;
        },

        bulkDisableSigningProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = false;

            action.payload.uuids.forEach((uuid) => {
                const idx = state.signingProfiles.findIndex((p) => p.uuid === uuid);
                if (idx >= 0) state.signingProfiles[idx].enabled = false;
            });

            if (state.signingProfile && action.payload.uuids.includes(state.signingProfile.uuid)) {
                state.signingProfile.enabled = false;
            }
        },

        bulkDisableSigningProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDisabling = false;
        },

        // ILM activation
        activateIlmSigningProtocol: (
            state,
            action: PayloadAction<{ signingProfileUuid: string; ilmSigningProtocolConfigurationUuid: string }>,
        ) => {
            state.isActivatingIlm = true;
        },

        activateIlmSigningProtocolSuccess: (
            state,
            action: PayloadAction<{ ilmActivationDetails: IlmSigningProtocolActivationDetailDto }>,
        ) => {
            state.isActivatingIlm = false;
            state.ilmActivationDetails = action.payload.ilmActivationDetails;
        },

        activateIlmSigningProtocolFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isActivatingIlm = false;
        },

        deactivateIlmSigningProtocol: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeactivatingIlm = true;
        },

        deactivateIlmSigningProtocolSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeactivatingIlm = false;
            state.ilmActivationDetails = undefined;
        },

        deactivateIlmSigningProtocolFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeactivatingIlm = false;
        },

        getIlmSigningProtocolActivationDetails: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingIlmActivationDetails = true;
        },

        getIlmSigningProtocolActivationDetailsSuccess: (
            state,
            action: PayloadAction<{ ilmActivationDetails: IlmSigningProtocolActivationDetailDto }>,
        ) => {
            state.isFetchingIlmActivationDetails = false;
            state.ilmActivationDetails = action.payload.ilmActivationDetails;
        },

        getIlmSigningProtocolActivationDetailsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingIlmActivationDetails = false;
        },

        // TSP activation
        activateTsp: (state, action: PayloadAction<{ signingProfileUuid: string; tspConfigurationUuid: string }>) => {
            state.isActivatingTsp = true;
        },

        activateTspSuccess: (state, action: PayloadAction<{ tspActivationDetails: TspActivationDetailDto }>) => {
            state.isActivatingTsp = false;
            state.tspActivationDetails = action.payload.tspActivationDetails;
        },

        activateTspFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isActivatingTsp = false;
        },

        deactivateTsp: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeactivatingTsp = true;
        },

        deactivateTspSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeactivatingTsp = false;
            state.tspActivationDetails = undefined;
        },

        deactivateTspFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeactivatingTsp = false;
        },

        getTspActivationDetails: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingTspActivationDetails = true;
        },

        getTspActivationDetailsSuccess: (state, action: PayloadAction<{ tspActivationDetails: TspActivationDetailDto }>) => {
            state.isFetchingTspActivationDetails = false;
            state.tspActivationDetails = action.payload.tspActivationDetails;
        },

        getTspActivationDetailsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingTspActivationDetails = false;
        },

        // Approval profile association
        getAssociatedApprovalProfiles: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingAssociatedApprovalProfiles = true;
        },

        getAssociatedApprovalProfilesSuccess: (state, action: PayloadAction<{ approvalProfiles: ApprovalProfileDto[] }>) => {
            state.isFetchingAssociatedApprovalProfiles = false;
            state.associatedApprovalProfiles = action.payload.approvalProfiles;
        },

        getAssociatedApprovalProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingAssociatedApprovalProfiles = false;
        },

        associateWithApprovalProfile: (state, action: PayloadAction<{ signingProfileUuid: string; approvalProfileUuid: string }>) => {
            state.isAssociatingApprovalProfile = true;
        },

        associateWithApprovalProfileSuccess: (
            state,
            action: PayloadAction<{ signingProfileUuid: string; approvalProfileUuid: string }>,
        ) => {
            state.isAssociatingApprovalProfile = false;
        },

        associateWithApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isAssociatingApprovalProfile = false;
        },

        disassociateFromApprovalProfile: (state, action: PayloadAction<{ signingProfileUuid: string; approvalProfileUuid: string }>) => {
            state.isDisassociatingApprovalProfile = true;
        },

        disassociateFromApprovalProfileSuccess: (
            state,
            action: PayloadAction<{ signingProfileUuid: string; approvalProfileUuid: string }>,
        ) => {
            state.isDisassociatingApprovalProfile = false;
            state.associatedApprovalProfiles = state.associatedApprovalProfiles.filter(
                (ap) => ap.uuid !== action.payload.approvalProfileUuid,
            );
        },

        disassociateFromApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisassociatingApprovalProfile = false;
        },

        // Supported protocols
        listSupportedProtocols: (state, action: PayloadAction<{ workflowType: SigningWorkflowType }>) => {
            state.isFetchingSupportedProtocols = true;
        },

        listSupportedProtocolsSuccess: (state, action: PayloadAction<{ supportedProtocols: SigningProtocol[] }>) => {
            state.isFetchingSupportedProtocols = false;
            state.supportedProtocols = action.payload.supportedProtocols;
        },

        listSupportedProtocolsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSupportedProtocols = false;
        },

        // Signing certificates
        listSigningCertificates: (state, action: PayloadAction<{ workflowType: SigningWorkflowType }>) => {
            state.isFetchingSigningCertificates = true;
        },

        listSigningCertificatesSuccess: (state, action: PayloadAction<{ signingCertificates: CertificateDto[] }>) => {
            state.isFetchingSigningCertificates = false;
            state.signingCertificates = action.payload.signingCertificates;
        },

        listSigningCertificatesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSigningCertificates = false;
        },

        // Digital signatures
        listDigitalSignaturesForSigningProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingDigitalSignatures = true;
        },

        listDigitalSignaturesForSigningProfileSuccess: (
            state,
            action: PayloadAction<{ digitalSignatures: PaginationResponseDtoDigitalSignatureListDto }>,
        ) => {
            state.isFetchingDigitalSignatures = false;
            state.digitalSignatures = action.payload.digitalSignatures;
        },

        listDigitalSignaturesForSigningProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDigitalSignatures = false;
        },
    },
});

const state = (reduxStore: any): State => reduxStore?.[slice.name];

const signingProfile = createSelector(state, (state) => state.signingProfile);
const signingProfiles = createSelector(state, (state) => state.signingProfiles);
const associatedApprovalProfiles = createSelector(state, (state) => state.associatedApprovalProfiles);
const ilmActivationDetails = createSelector(state, (state) => state.ilmActivationDetails);
const tspActivationDetails = createSelector(state, (state) => state.tspActivationDetails);
const supportedProtocols = createSelector(state, (state) => state.supportedProtocols);
const signingCertificates = createSelector(state, (state) => state.signingCertificates);
const digitalSignatures = createSelector(state, (state) => state.digitalSignatures);
const searchableFields = createSelector(state, (state) => state.searchableFields);
const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, (state) => state.bulkDeleteErrorMessages);

const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingSearchableFields = createSelector(state, (state) => state.isFetchingSearchableFields);
const isFetchingAssociatedApprovalProfiles = createSelector(state, (state) => state.isFetchingAssociatedApprovalProfiles);
const isFetchingIlmActivationDetails = createSelector(state, (state) => state.isFetchingIlmActivationDetails);
const isFetchingTspActivationDetails = createSelector(state, (state) => state.isFetchingTspActivationDetails);
const isFetchingSupportedProtocols = createSelector(state, (state) => state.isFetchingSupportedProtocols);
const isFetchingSigningCertificates = createSelector(state, (state) => state.isFetchingSigningCertificates);
const isFetchingDigitalSignatures = createSelector(state, (state) => state.isFetchingDigitalSignatures);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const isDisabling = createSelector(state, (state) => state.isDisabling);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, (state) => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, (state) => state.isBulkDisabling);
const isActivatingIlm = createSelector(state, (state) => state.isActivatingIlm);
const isDeactivatingIlm = createSelector(state, (state) => state.isDeactivatingIlm);
const isActivatingTsp = createSelector(state, (state) => state.isActivatingTsp);
const isDeactivatingTsp = createSelector(state, (state) => state.isDeactivatingTsp);
const isAssociatingApprovalProfile = createSelector(state, (state) => state.isAssociatingApprovalProfile);
const isDisassociatingApprovalProfile = createSelector(state, (state) => state.isDisassociatingApprovalProfile);

export const selectors = {
    state,
    deleteErrorMessage,
    bulkDeleteErrorMessages,
    signingProfile,
    signingProfiles,
    associatedApprovalProfiles,
    ilmActivationDetails,
    tspActivationDetails,
    supportedProtocols,
    signingCertificates,
    digitalSignatures,
    searchableFields,
    isFetchingDetail,
    isFetchingSearchableFields,
    isFetchingAssociatedApprovalProfiles,
    isFetchingIlmActivationDetails,
    isFetchingTspActivationDetails,
    isFetchingSupportedProtocols,
    isFetchingSigningCertificates,
    isFetchingDigitalSignatures,
    isCreating,
    isDeleting,
    isUpdating,
    isEnabling,
    isDisabling,
    isBulkDeleting,
    isBulkEnabling,
    isBulkDisabling,
    isActivatingIlm,
    isDeactivatingIlm,
    isActivatingTsp,
    isDeactivatingTsp,
    isAssociatingApprovalProfile,
    isDisassociatingApprovalProfile,
};

export const actions = slice.actions;

export default slice.reducer;
