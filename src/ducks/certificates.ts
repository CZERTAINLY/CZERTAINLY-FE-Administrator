import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeDescriptorModel } from "types/attributes";
import {
    CertificateBulkDeleteRequestModel,
    CertificateBulkDeleteResponseModel,
    CertificateBulkObjectModel,
    CertificateChainDownloadResponseModel,
    CertificateChainResponseModel,
    CertificateComplianceCheckModel,
    CertificateContentResponseModel,
    CertificateDetailResponseModel,
    CertificateHistoryModel,
    CertificateListResponseModel,
    CertificateObjectModel,
    CertificateRekeyRequestModel,
    CertificateRenewRequestModel,
    CertificateRevokeRequestModel,
    CertificateSignRequestModel,
    CertificateUploadModel,
    CertificateValidationModel,
    SearchRequestModel,
} from "types/certificate";
import { CertificateGroupResponseModel } from "types/certificateGroups";
import { LocationResponseModel } from "types/locations";
import { ApprovalDto, DownloadCertificateChainRequest, ListCertificateApprovalsRequest } from "types/openapi";
import { RaProfileResponseModel } from "types/ra-profiles";
import { UserResponseModel } from "types/users";
import { downloadFileZip } from "utils/download";
import { createFeatureSelector } from "utils/ducks";

export type State = {
    deleteErrorMessage: string;

    certificates: CertificateListResponseModel[];

    certificateDetail?: CertificateDetailResponseModel;
    certificateHistory?: CertificateHistoryModel[];
    certificateLocations?: LocationResponseModel[];
    issuanceAttributes: { [raProfileId: string]: AttributeDescriptorModel[] };
    revocationAttributes: AttributeDescriptorModel[];
    validationResult: { [key: string]: CertificateValidationModel };
    approvals?: ApprovalDto[];
    certificateChain?: CertificateChainResponseModel;
    certificateChainDownloadContent?: CertificateChainDownloadResponseModel;

    isFetchingValidationResult: boolean;

    isFetchingDetail: boolean;
    isFetchingHistory: boolean;
    isFetchingLocations: boolean;
    isFetchingApprovals: boolean;
    isFetchingCertificateChain: boolean;
    isFetchingCertificateChainDownloadContent: boolean;

    isIssuing: boolean;
    isRevoking: boolean;
    isRenewing: boolean;
    isRekeying: boolean;

    isDeleting: boolean;
    isBulkDeleting: boolean;

    isUpdatingGroup: boolean;
    isUpdatingRaProfile: boolean;
    isUpdatingOwner: boolean;

    isBulkUpdatingGroup: boolean;
    isBulkUpdatingRaProfile: boolean;
    isBulkUpdatingOwner: boolean;

    isUploading: boolean;

    isFetchingIssuanceAttributes: boolean;
    isFetchingRevocationAttributes: boolean;

    isCheckingCompliance: boolean;

    isFetchingCsrAttributes: boolean;

    csrAttributeDescriptors: AttributeDescriptorModel[];

    isFetchingContents: boolean;
};

export const initialState: State = {
    deleteErrorMessage: "",

    certificates: [],

    issuanceAttributes: {},
    revocationAttributes: [],
    validationResult: {},
    approvals: [],

    isFetchingValidationResult: false,

    isFetchingApprovals: false,
    isFetchingDetail: false,
    isFetchingHistory: false,
    isFetchingLocations: false,
    isFetchingCertificateChain: false,
    isFetchingCertificateChainDownloadContent: false,

    isIssuing: false,
    isRevoking: false,
    isRenewing: false,
    isRekeying: false,

    isDeleting: false,
    isBulkDeleting: false,

    isUpdatingGroup: false,
    isUpdatingRaProfile: false,
    isUpdatingOwner: false,

    isBulkUpdatingGroup: false,
    isBulkUpdatingRaProfile: false,
    isBulkUpdatingOwner: false,

    isUploading: false,

    isFetchingIssuanceAttributes: false,
    isFetchingRevocationAttributes: false,

    isCheckingCompliance: false,

    isFetchingCsrAttributes: false,

    csrAttributeDescriptors: [],

    isFetchingContents: false,
};

export const slice = createSlice({
    name: "certificates",

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = "";
        },

        clearCertificateDetail: (state, action: PayloadAction<void>) => {
            state.certificateDetail = undefined;
        },

        listCertificates: (state, action: PayloadAction<SearchRequestModel>) => {
            state.certificates = [];
        },

        listCertificatesSuccess: (state, action: PayloadAction<CertificateListResponseModel[]>) => {
            state.certificates = action.payload;
        },

        getCertificateDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.certificateDetail = undefined;
            state.isFetchingDetail = true;
        },

        getCertificateDetailSuccess: (state, action: PayloadAction<{ certificate: CertificateDetailResponseModel }>) => {
            state.isFetchingDetail = false;
            state.certificateDetail = action.payload.certificate;
        },

        getCertificateDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        getCertificateValidationResult: (state, action: PayloadAction<{ uuid: string }>) => {
            state.validationResult = {};
            state.isFetchingValidationResult = true;
        },

        getCertificateValidationResultSuccess: (state, action: PayloadAction<{ [key: string]: CertificateValidationModel }>) => {
            state.isFetchingValidationResult = false;
            state.validationResult = action.payload;
        },

        getCertificateValidationResultFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingValidationResult = false;
        },

        issueCertificate: (
            state,
            action: PayloadAction<{
                authorityUuid: string;
                raProfileUuid: string;
                signRequest: CertificateSignRequestModel;
            }>,
        ) => {
            state.isIssuing = true;
        },

        issueCertificateNew: (
            state,
            action: PayloadAction<{
                authorityUuid: string;
                raProfileUuid: string;
                certificateUuid: string;
            }>,
        ) => {
            state.isIssuing = true;
        },

        issueCertificateSuccess: (
            state,
            action: PayloadAction<{
                uuid: string;
                certificateData?: string;
            }>,
        ) => {
            state.isIssuing = false;
        },

        issueCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isIssuing = false;
        },

        revokeCertificate: (
            state,
            action: PayloadAction<{
                authorityUuid: string;
                raProfileUuid: string;
                uuid: string;
                revokeRequest: CertificateRevokeRequestModel;
            }>,
        ) => {
            state.isRevoking = true;
        },

        revokeCertificateSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isRevoking = false;

            const cerificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === action.payload.uuid);

            if (cerificateIndex >= 0) state.certificates.splice(cerificateIndex, 1);
        },

        revokeCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isRevoking = false;
        },

        renewCertificate: (
            state,
            action: PayloadAction<{
                authorityUuid: string;
                raProfileUuid: string;
                uuid: string;
                renewRequest: CertificateRenewRequestModel;
            }>,
        ) => {
            state.isRenewing = true;
        },

        renewCertificateSuccess: (
            state,
            action: PayloadAction<{
                uuid: string;
            }>,
        ) => {
            state.isRenewing = false;
        },

        renewCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isRenewing = false;
        },

        rekeyCertificate: (
            state,
            action: PayloadAction<{
                authorityUuid: string;
                raProfileUuid: string;
                uuid: string;
                rekey: CertificateRekeyRequestModel;
            }>,
        ) => {
            state.isRekeying = true;
        },

        rekeyCertificateSuccess: (
            state,
            action: PayloadAction<{
                uuid: string;
            }>,
        ) => {
            state.isRekeying = false;
        },

        rekeyCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isRekeying = false;
        },

        getCertificateHistory: (state, action: PayloadAction<{ uuid: string }>) => {
            state.certificateHistory = [];
            state.isFetchingHistory = true;
        },

        getCertificateHistorySuccess: (state, action: PayloadAction<{ certificateHistory: CertificateHistoryModel[] }>) => {
            state.isFetchingHistory = false;
            state.certificateHistory = action.payload.certificateHistory;
        },

        getCertificateHistoryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingHistory = false;
        },

        listCertificateLocations: (state, action: PayloadAction<{ uuid: string }>) => {
            state.certificateLocations = [];
            state.isFetchingLocations = true;
        },

        listCertificateLocationsSuccess: (state, action: PayloadAction<{ certificateLocations: LocationResponseModel[] }>) => {
            state.isFetchingLocations = false;
            state.certificateLocations = action.payload.certificateLocations;
        },

        listCertificateLocationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingLocations = false;
        },

        deleteCertificate: (state, action: PayloadAction<{ uuid: string }>) => {
            state.deleteErrorMessage = "";
            state.isDeleting = true;
        },

        deleteCertificateSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === action.payload.uuid);

            if (certificateIndex >= 0) state.certificates.splice(certificateIndex, 1);

            if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail = undefined;
        },

        deleteCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || "Unknown error";
        },

        updateGroup: (state, action: PayloadAction<{ uuid: string; updateGroupRequest: CertificateObjectModel }>) => {
            state.isUpdatingGroup = true;
        },

        updateGroupSuccess: (state, action: PayloadAction<{ uuid: string; groupUuid: string; group: CertificateGroupResponseModel }>) => {
            state.isUpdatingGroup = false;

            const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === action.payload.uuid);

            if (certificateIndex >= 0) state.certificates[certificateIndex].group = action.payload.group;

            if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.group = action.payload.group;
        },

        updateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingGroup = false;
        },

        updateRaProfile: (
            state,
            action: PayloadAction<{ uuid: string; authorityUuid: string; updateRaProfileRequest: CertificateObjectModel }>,
        ) => {
            state.isUpdatingRaProfile = true;
        },

        updateRaProfileSuccess: (
            state,
            action: PayloadAction<{ uuid: string; raProfileUuid: string; raProfile: RaProfileResponseModel }>,
        ) => {
            state.isUpdatingRaProfile = false;

            const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === action.payload.uuid);

            if (certificateIndex >= 0) state.certificates[certificateIndex].raProfile = action.payload.raProfile;

            if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.raProfile = action.payload.raProfile;
        },

        updateRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingRaProfile = false;
        },

        updateOwner: (
            state,
            action: PayloadAction<{ uuid: string; user: UserResponseModel; updateOwnerRequest: CertificateObjectModel }>,
        ) => {
            state.isUpdatingOwner = true;
        },

        updateOwnerSuccess: (state, action: PayloadAction<{ uuid: string; user: UserResponseModel }>) => {
            state.isUpdatingOwner = false;

            const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === action.payload.uuid);

            if (certificateIndex >= 0) state.certificates[certificateIndex].owner = action.payload.user.username;

            if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.owner = action.payload.user.username;
        },

        updateOwnerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingOwner = false;
        },

        bulkUpdateGroup: (state, action: PayloadAction<CertificateBulkObjectModel>) => {
            state.isBulkUpdatingGroup = true;
        },

        bulkUpdateGroupSuccess: (state, action: PayloadAction<{ uuids: string[]; group: CertificateGroupResponseModel }>) => {
            state.isBulkUpdatingGroup = false;

            action.payload.uuids.forEach((uuid) => {
                const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === uuid);

                if (certificateIndex >= 0) state.certificates[certificateIndex].group = action.payload.group;

                if (state.certificateDetail?.uuid === uuid) state.certificateDetail.group = action.payload.group;
            });
        },

        bulkUpdateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkUpdatingGroup = false;
        },

        bulkUpdateRaProfile: (state, action: PayloadAction<{ authorityUuid: string; raProfileRequest: CertificateBulkObjectModel }>) => {
            state.isBulkUpdatingRaProfile = true;
        },

        bulkUpdateRaProfileSuccess: (state, action: PayloadAction<{ uuids: string[]; raProfile: RaProfileResponseModel }>) => {
            state.isBulkUpdatingRaProfile = false;

            action.payload.uuids.forEach((uuid) => {
                const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === uuid);

                if (certificateIndex >= 0) state.certificates[certificateIndex].raProfile = action.payload.raProfile;

                if (state.certificateDetail?.uuid === uuid) state.certificateDetail.raProfile = action.payload.raProfile;
            });
        },

        bulkUpdateRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkUpdatingRaProfile = false;
        },

        bulkUpdateOwner: (state, action: PayloadAction<{ user: UserResponseModel; request: CertificateBulkObjectModel }>) => {
            state.isBulkUpdatingOwner = true;
        },

        bulkUpdateOwnerSuccess: (state, action: PayloadAction<{ uuids: string[]; user: UserResponseModel }>) => {
            state.isBulkUpdatingOwner = false;

            action.payload.uuids.forEach((uuid) => {
                const certificateIndex = state.certificates.findIndex((certificate) => certificate.uuid === uuid);

                if (certificateIndex >= 0) state.certificates[certificateIndex].owner = action.payload.user.username;

                if (state.certificateDetail?.uuid === uuid) state.certificateDetail.owner = action.payload.user.username;
            });
        },

        bulkUpdateOwnerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkUpdatingOwner = false;
        },

        bulkDelete: (state, action: PayloadAction<CertificateBulkDeleteRequestModel>) => {
            state.deleteErrorMessage = "";
            state.isBulkDeleting = true;
        },

        bulkDeleteSuccess: (state, action: PayloadAction<{ response: CertificateBulkDeleteResponseModel }>) => {
            state.isBulkDeleting = false;
        },

        bulkDeleteFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
            state.deleteErrorMessage = action.payload.error || "Unknown error";
        },

        uploadCertificate: (state, action: PayloadAction<CertificateUploadModel>) => {
            state.isUploading = true;
        },

        uploadCertificateSuccess: (state, action: PayloadAction<{ uuid: string; certificate: CertificateDetailResponseModel }>) => {
            state.isUploading = false;
            state.certificates.push(action.payload.certificate);
        },

        uploadCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUploading = false;
        },

        getIssuanceAttributes: (state, action: PayloadAction<{ raProfileUuid: string; authorityUuid: string }>) => {
            state.isFetchingIssuanceAttributes = true;
        },

        getIssuanceAttributesSuccess: (
            state,
            action: PayloadAction<{ raProfileUuid: string; issuanceAttributes: AttributeDescriptorModel[] }>,
        ) => {
            state.isFetchingIssuanceAttributes = false;
            state.issuanceAttributes[action.payload.raProfileUuid] = action.payload.issuanceAttributes;
        },

        getIssuanceAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingIssuanceAttributes = false;
        },

        getRevocationAttributes: (state, action: PayloadAction<{ raProfileUuid: string; authorityUuid: string }>) => {
            state.isFetchingRevocationAttributes = true;
        },

        getRevocationAttributesSuccess: (
            state,
            action: PayloadAction<{ raProfileUuid: string; revocationAttributes: AttributeDescriptorModel[] }>,
        ) => {
            state.isFetchingRevocationAttributes = false;
            state.revocationAttributes = action.payload.revocationAttributes;
        },

        getRevocationAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingRevocationAttributes = false;
        },

        checkCompliance: (state, action: PayloadAction<CertificateComplianceCheckModel>) => {
            state.isCheckingCompliance = true;
        },

        checkComplianceSuccess: (state, action: PayloadAction<void>) => {
            state.isCheckingCompliance = false;
        },

        checkComplianceFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCheckingCompliance = false;
        },

        getCsrAttributes: (state, action: PayloadAction<void>) => {
            state.isFetchingCsrAttributes = true;
        },

        getCsrAttributesSuccess: (state, action: PayloadAction<{ csrAttributes: AttributeDescriptorModel[] }>) => {
            state.isFetchingCsrAttributes = false;
            state.csrAttributeDescriptors = action.payload.csrAttributes;
        },

        getCsrAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingCsrAttributes = false;
        },

        getCertificateContents: (state, action: PayloadAction<{ uuids: string[]; format: string }>) => {
            state.isFetchingContents = true;
        },

        getCertificateContentsSuccess: (
            state,
            action: PayloadAction<{ uuids: string[]; format: string; contents: CertificateContentResponseModel[] }>,
        ) => {
            state.isFetchingContents = false;
            downloadFileZip(action.payload.uuids, action.payload.contents, action.payload.format);
        },

        getCertificateContentsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingContents = false;
        },

        listCertificateApprovals: (state, action: PayloadAction<ListCertificateApprovalsRequest>) => {
            state.isFetchingApprovals = true;
        },

        listCertificateApprovalsSuccess: (state, action: PayloadAction<{ approvals: ApprovalDto[] }>) => {
            state.isFetchingApprovals = false;
            state.approvals = action.payload.approvals;
        },

        listCertificateApprovalsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingApprovals = false;
        },

        getCertificateChain: (state, action: PayloadAction<{ uuid: string; withEndCertificate: boolean }>) => {
            state.isFetchingCertificateChain = true;
        },

        getCertificateChainSuccess: (state, action: PayloadAction<{ certificateChain: CertificateChainResponseModel }>) => {
            state.isFetchingCertificateChain = false;
            state.certificateChain = action.payload.certificateChain;
        },

        getCertificateChainFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingCertificateChain = false;
        },

        downloadCertificateChain: (state, action: PayloadAction<DownloadCertificateChainRequest>) => {
            state.certificateChainDownloadContent = undefined;
            state.isFetchingCertificateChainDownloadContent = true;
        },

        downloadCertificateChainSuccess: (
            state,
            action: PayloadAction<{ certificateChainDownloadContent: CertificateChainDownloadResponseModel }>,
        ) => {
            state.isFetchingCertificateChainDownloadContent = false;
            state.certificateChainDownloadContent = action.payload.certificateChainDownloadContent;
        },

        downloadCertificateChainFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingCertificateChainDownloadContent = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);

const certificates = createSelector(state, (state) => state.certificates);
const certificateChain = createSelector(state, (state) => state.certificateChain);

const certificateDetail = createSelector(state, (state) => state.certificateDetail);
const certificateChainDownloadContent = createSelector(state, (state) => state.certificateChainDownloadContent);

const certificateHistory = createSelector(state, (state) => state.certificateHistory);
const certificateLocations = createSelector(state, (state) => state.certificateLocations);
const issuanceAttributes = createSelector(state, (state) => state.issuanceAttributes);
const revocationAttributes = createSelector(state, (state) => state.revocationAttributes);
const approvals = createSelector(state, (state) => state.approvals);

const isFetchingApprovals = createSelector(state, (state) => state.isFetchingApprovals);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingHistory = createSelector(state, (state) => state.isFetchingHistory);
const isFetchingLocations = createSelector(state, (state) => state.isFetchingLocations);

const isIssuing = createSelector(state, (state) => state.isIssuing);
const isRevoking = createSelector(state, (state) => state.isRevoking);
const isRenewing = createSelector(state, (state) => state.isRenewing);
const isRekeying = createSelector(state, (state) => state.isRekeying);

const isDeleting = createSelector(state, (state) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);

const isUpdatingGroup = createSelector(state, (state) => state.isUpdatingGroup);
const isUpdatingRaProfile = createSelector(state, (state) => state.isUpdatingRaProfile);
const isUpdatingOwner = createSelector(state, (state) => state.isUpdatingOwner);

const isBulkUpdatingGroup = createSelector(state, (state) => state.isBulkUpdatingGroup);
const isBulkUpdatingRaProfile = createSelector(state, (state) => state.isBulkUpdatingRaProfile);
const isBulkUpdatingOwner = createSelector(state, (state) => state.isBulkUpdatingOwner);

const isUploading = createSelector(state, (state) => state.isUploading);

const isFetchingIssuanceAttributes = createSelector(state, (state) => state.isFetchingIssuanceAttributes);
const isFetchingRevocationAttributes = createSelector(state, (state) => state.isFetchingRevocationAttributes);

const isFetchingValidationResult = createSelector(state, (state) => state.isFetchingValidationResult);
const validationResult = createSelector(state, (state) => state.validationResult);

const isFetchingCsrAttributes = createSelector(state, (state) => state.isFetchingCsrAttributes);
const csrAttributeDescriptors = createSelector(state, (state) => state.csrAttributeDescriptors);

const isFetchingContents = createSelector(state, (state) => state.isFetchingContents);
const isFetchingCertificateChain = createSelector(state, (state) => state.isFetchingCertificateChain);

export const selectors = {
    state,
    deleteErrorMessage,
    certificates,
    certificateDetail,
    certificateChainDownloadContent,
    certificateHistory,
    certificateLocations,
    issuanceAttributes,
    revocationAttributes,
    approvals,
    isFetchingDetail,
    isFetchingHistory,
    isFetchingLocations,
    isFetchingCertificateChain,
    isIssuing,
    isRevoking,
    isRenewing,
    isRekeying,
    isDeleting,
    isBulkDeleting,
    isUpdatingGroup,
    isUpdatingRaProfile,
    isUpdatingOwner,
    isBulkUpdatingGroup,
    isBulkUpdatingRaProfile,
    isBulkUpdatingOwner,
    isUploading,
    isFetchingIssuanceAttributes,
    isFetchingRevocationAttributes,
    isFetchingValidationResult,
    validationResult,
    isFetchingCsrAttributes,
    csrAttributeDescriptors,
    isFetchingContents,
    isFetchingApprovals,
    certificateChain,
};

export const actions = slice.actions;

export default slice.reducer;
