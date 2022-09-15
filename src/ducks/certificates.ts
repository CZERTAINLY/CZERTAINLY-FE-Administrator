import { AvailableCertificateFilterModel, CertificateEventHistoryModel, CertificateListQueryFilterModel, CertificateListQueryModel, CertificateModel, CertificateValidationResultModel } from "models/certificate";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeModel } from "models/attributes/AttributeModel";
import { CertificateRAProfileModel } from "models/certificate";
import { GroupModel } from "models/groups";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { CertificateRevocationReason } from "types/certificate";
import { LocationModel } from "models/locations";


export type State = {

   forceRefreshList: boolean;

   checkedRows: string[];

   deleteErrorMessage: string;

   lastQuery?: CertificateListQueryModel;

   availableFilters: AvailableCertificateFilterModel[];
   currentFilters: CertificateListQueryFilterModel[];

   certificates: CertificateModel[];
   totalPages: number;
   totalItems: number;

   certificateDetail?: CertificateModel;
   certificateHistory?: CertificateEventHistoryModel[];
   certificateLocations?: LocationModel[];
   issuanceAttributes:  { [raProfileId: string]: AttributeDescriptorModel[] };
   revocationAttributes: AttributeDescriptorModel[];
   validationResult: CertificateValidationResultModel;

   isFetchingAvailableFilters: boolean;

   isFetchingValidationResult: boolean;

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isFetchingHistory: boolean;
   isFetchingLocations: boolean;

   isIssuing: boolean;
   isRevoking: boolean;
   isRenewing: boolean;

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


};


export const initialState: State = {

   forceRefreshList: false,

   checkedRows: [],

   deleteErrorMessage: "",

   availableFilters: [],
   currentFilters: [], // used just in the filter

   certificates: [],
   totalPages: 0,
   totalItems: 0,

   issuanceAttributes: {},
   revocationAttributes: [],
   validationResult: {},

   isFetchingAvailableFilters: false,

   isFetchingValidationResult: false,

   isFetchingList: false,
   isFetchingDetail: false,
   isFetchingHistory: false,
   isFetchingLocations: false,

   isIssuing: false,
   isRevoking: false,
   isRenewing: false,

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


};


export const slice = createSlice({

   name: "certificates",

   initialState,

   reducers: {

      resetState: (state, action: PayloadAction<void>) => {

         state = initialState;

      },


      setForceRefreshList: (state, action: PayloadAction<{ forceRefreshList: boolean }>) => {

         state.forceRefreshList = action.payload.forceRefreshList;

      },


      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";

      },


      setCurrentFilters: (state, action: PayloadAction<{ currentFilters: CertificateListQueryFilterModel[] }>) => {

         state.currentFilters = action.payload.currentFilters;

      },


      listCertificates: (state, action: PayloadAction<{ query: CertificateListQueryModel }>) => {

         state.certificates = [];
         state.isFetchingList = true;
         state.lastQuery = action.payload.query;

      },


      listCertificatesSuccess: (state, action: PayloadAction<{
         certificateList: CertificateModel[],
         totalPages: number,
         totalItems: number
      }>) => {

         state.isFetchingList = false;
         state.certificates = action.payload.certificateList;
         state.totalItems = action.payload.totalItems;
         state.totalPages = action.payload.totalPages;

      },


      listCertificatesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      getCertificateDetail: (state, action: PayloadAction<{ uuid: string }>) => {

         state.certificateDetail = undefined;
         state.isFetchingDetail = true;

      },


      getCertificateDetailSuccess: (state, action: PayloadAction<{ certificate: CertificateModel }>) => {

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


      getCertificateValidationResultSuccess: (state, action: PayloadAction<CertificateValidationResultModel>) => {

         state.isFetchingValidationResult = false;
         state.validationResult = action.payload;

      },


      getCertificateValidationResultFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingValidationResult = false;

      },


      issueCertificate: (state, action: PayloadAction<{
         raProfileUuid: string;
         pkcs10: string;
         attributes: AttributeModel[],
         authorityUuid: string
      }>) => {

         state.isIssuing = true;

      },


      issueCertificateSuccess: (state, action: PayloadAction<{
         uuid: string,
         certificateData: string
      }>) => {

         state.isIssuing = false;

      },


      issueCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isIssuing = false;

      },


      revokeCertificate: (state, action: PayloadAction<{
         uuid: string,
         raProfileUuid: string,
         reason: CertificateRevocationReason,
         attributes: AttributeModel[],
         authorityUuid: string
       }>) => {

         state.isRevoking = true;

      },


      revokeCertificateSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isRevoking = false;

         const cerificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (cerificateIndex >= 0) state.certificates.splice(cerificateIndex, 1);

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.status = "revoked";

      },


      revokeCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isRevoking = false;

      },


      renewCertificate: (state, action: PayloadAction<{
         uuid: string;
         raProfileUuid: string;
         pkcs10: string;
         authorityUuid: string
      }>) => {

         state.isRenewing = true;

      },


      renewCertificateSuccess: (state, action: PayloadAction<{
         uuid: string;
      }>) => {

         state.isRenewing = false;
      },


      renewCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isRenewing = false;

      },


      getAvailableCertificateFilters: (state, action: PayloadAction<void>) => {

         state.availableFilters = [];
         state.isFetchingAvailableFilters = true;

      },


      getAvailableCertificateFiltersSuccess: (state, action: PayloadAction<{ availableCertificateFilters: AvailableCertificateFilterModel[] }>) => {

         state.isFetchingAvailableFilters = false;
         state.availableFilters = action.payload.availableCertificateFilters;

      },


      getAvailableCertificateFiltersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAvailableFilters = false;

      },


      getCertificateHistory: (state, action: PayloadAction<{ uuid: string }>) => {

         state.certificateHistory = [];
         state.isFetchingHistory = true;

      },


      getCertificateHistorySuccess: (state, action: PayloadAction<{ certificateHistory: CertificateEventHistoryModel[] }>) => {

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


      listCertificateLocationsSuccess: (state, action: PayloadAction<{ certificateLocations: LocationModel[] }>) => {

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

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates.splice(certificateIndex, 1);

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail = undefined;

      },


      deleteCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false;
         state.deleteErrorMessage = action.payload.error || "Unknown error";

      },


      updateGroup: (state, action: PayloadAction<{ uuid: string, groupUuid: string }>) => {

         state.isUpdatingGroup = true;

      },


      updateGroupSuccess: (state, action: PayloadAction<{ uuid: string, groupUuid: string, group: GroupModel }>) => {

         state.isUpdatingGroup = false;

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates[certificateIndex].group = action.payload.group;

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.group = action.payload.group;

      },


      updateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdatingGroup = false;

      },


      updateRaProfile: (state, action: PayloadAction<{ uuid: string, authorityUuid: string, raProfileUuid: string }>) => {

         state.isUpdatingRaProfile = true;

      },


      updateRaProfileSuccess: (state, action: PayloadAction<{ uuid: string, raProfileUuid: string, raProfile: CertificateRAProfileModel }>) => {

         state.isUpdatingRaProfile = false;

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates[certificateIndex].raProfile = action.payload.raProfile;

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.raProfile = action.payload.raProfile;

      },


      updateRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdatingRaProfile = false;

      },


      updateOwner: (state, action: PayloadAction<{ uuid: string, owner: string }>) => {

         state.isUpdatingOwner = true;

      },


      updateOwnerSuccess: (state, action: PayloadAction<{ uuid: string, owner: string }>) => {

         state.isUpdatingOwner = false;

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates[certificateIndex].owner = action.payload.owner;

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.owner = action.payload.owner;

      },


      updateOwnerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdatingOwner = false;

      },


      bulkUpdateGroup: (state, action: PayloadAction<{ uuids: string[], groupUuid: string, inFilter: any, allSelect: boolean }>) => {

         state.isBulkUpdatingGroup = true;

      },


      bulkUpdateGroupSuccess: (state, action: PayloadAction<{ uuids: string[], group: GroupModel, inFilter: any, allSelect: boolean }>) => {

         state.isBulkUpdatingGroup = false;

         action.payload.uuids.forEach(

            uuid => {

               const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === uuid);

               if (certificateIndex >= 0) state.certificates[certificateIndex].group = action.payload.group;

               if (state.certificateDetail?.uuid === uuid) state.certificateDetail.group = action.payload.group;

            }

         );

      },


      bulkUpdateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkUpdatingGroup = false;

      },


      bulkUpdateRaProfile: (state, action: PayloadAction<{ uuids: string[], authorityUuid: string, raProfileUuid: string, inFilter: any, allSelect: boolean }>) => {

         state.isBulkUpdatingRaProfile = true;

      },


      bulkUpdateRaProfileSuccess: (state, action: PayloadAction<{ uuids: string[], raProfile: CertificateRAProfileModel, inFilter: any, allSelect: boolean }>) => {

         state.isBulkUpdatingRaProfile = false;

         action.payload.uuids.forEach(

            uuid => {

               const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === uuid);

               if (certificateIndex >= 0) state.certificates[certificateIndex].raProfile = action.payload.raProfile;

               if (state.certificateDetail?.uuid === uuid) state.certificateDetail.raProfile = action.payload.raProfile;

            }

         )

      },


      bulkUpdateRaProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkUpdatingRaProfile = false;

      },


      bulkUpdateOwner: (state, action: PayloadAction<{ uuids: string[], owner: string, inFilter: any, allSelect: boolean}>) => {

         state.isBulkUpdatingOwner = true;

      },


      bulkUpdateOwnerSuccess: (state, action: PayloadAction<{ uuids: string[], owner: string, inFilter: any, allSelect: boolean }>) => {

         state.isBulkUpdatingOwner = false;

         action.payload.uuids.forEach(

            uuid => {

               const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === uuid);

               if (certificateIndex >= 0) state.certificates[certificateIndex].owner = action.payload.owner;

               if (state.certificateDetail?.uuid === uuid) state.certificateDetail.owner = action.payload.owner;

            }

         )

      },


      bulkUpdateOwnerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkUpdatingOwner = false;

      },


      bulkDelete: (state, action: PayloadAction<{ uuids: string[], inFilter: any, allSelect: boolean  }>) => {

         state.deleteErrorMessage = "";
         state.isBulkDeleting = true;

      },


      bulkDeleteSuccess: (state, action: PayloadAction<{ uuids: string[], inFilter: any, allSelect: boolean  }>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {

               const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === uuid);

               if (certificateIndex >= 0) state.certificates.splice(certificateIndex, 1);

               if (state.certificateDetail?.uuid === uuid) state.certificateDetail = undefined;

            }

         )

      },


      bulkDeleteFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;
         state.deleteErrorMessage = action.payload.error || "Unknown error";

      },


      uploadCertificate: (state, action: PayloadAction<{ certificate: string }>) => {

         state.isUploading = true;

      },


      uploadCertificateSuccess: (state, action: PayloadAction<{ uuid: string, certificate: CertificateModel }>) => {

         state.isUploading = false;
         state.forceRefreshList = true;
         state.certificates.push(action.payload.certificate);

      },


      uploadCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUploading = false;

      },


      getIssuanceAttributes: (state, action: PayloadAction<{ raProfileUuid: string, authorityUuid: string }>) => {

         state.isFetchingIssuanceAttributes = true;

      },


      getIssuanceAttributesSuccess: (state, action: PayloadAction<{ raProfileUuid: string, issuanceAttributes: AttributeDescriptorModel[] }>) => {

         state.isFetchingIssuanceAttributes = false;
         state.issuanceAttributes[action.payload.raProfileUuid] = action.payload.issuanceAttributes;

      },


      getIssuanceAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingIssuanceAttributes = false;

      },


      getRevocationAttributes: (state, action: PayloadAction<{ raProfileUuid: string, authorityUuid: string }>) => {

            state.isFetchingRevocationAttributes = true;

         },


      getRevocationAttributesSuccess: (state, action: PayloadAction<{ raProfileUuid: string, revocationAttributes: AttributeDescriptorModel[] }>) => {

         state.isFetchingRevocationAttributes = false;
         state.revocationAttributes = action.payload.revocationAttributes;

      },


      getRevocationAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingRevocationAttributes = false;

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


   }

})


const state = createFeatureSelector<State>(slice.name);

const forceRefreshList = createSelector(state, (state) => state.forceRefreshList);

const checkedRows = createSelector(state, state => state.checkedRows);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);

const availableCertificateFilters = createSelector(state, state => state.availableFilters);
const currentCertificateFilters = createSelector(state, state => state.currentFilters);

const certificates = createSelector(state, state => state.certificates);
const totalItems = createSelector(state, state => state.totalItems);
const totalPages = createSelector(state, state => state.totalPages);

const certificateDetail = createSelector(state, state => state.certificateDetail);
const certificateHistory = createSelector(state, state => state.certificateHistory);
const certificateLocations = createSelector(state, state => state.certificateLocations);
const issuanceAttributes = createSelector(state, state => state.issuanceAttributes);
const revocationAttributes = createSelector(state, state => state.revocationAttributes);

const isFetchingAvailablFilters = createSelector(state, state => state.isFetchingAvailableFilters);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isFetchingHistory = createSelector(state, state => state.isFetchingHistory);
const isFetchingLocations = createSelector(state, state => state.isFetchingLocations);

const isIssuing = createSelector(state, state => state.isIssuing);
const isRevoking = createSelector(state, state => state.isRevoking);
const isRenewing = createSelector(state, state => state.isRenewing);

const isDeleting = createSelector(state, state => state.isDeleting);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);

const isUpdatingGroup = createSelector(state, state => state.isUpdatingGroup);
const isUpdatingRaProfile = createSelector(state, state => state.isUpdatingRaProfile);
const isUpdatingOwner = createSelector(state, state => state.isUpdatingOwner);

const isBulkUpdatingGroup = createSelector(state, state => state.isBulkUpdatingGroup);
const isBulkUpdatingRaProfile = createSelector(state, state => state.isBulkUpdatingRaProfile);
const isBulkUpdatingOwner = createSelector(state, state => state.isBulkUpdatingOwner);

const isUploading = createSelector(state, state => state.isUploading);

const isFetchingIssuanceAttributes = createSelector(state, state => state.isFetchingIssuanceAttributes);
const isFetchingRevocationAttributes = createSelector(state, state => state.isFetchingRevocationAttributes);

const isFetchingValidationResult = createSelector(state, state => state.isFetchingValidationResult);
const validationResult = createSelector(state, state => state.validationResult);


export const selectors = {
   state,
   forceRefreshList,
   checkedRows,
   deleteErrorMessage,
   availableCertificateFilters,
   currentCertificateFilters,
   certificates,
   totalItems,
   totalPages,
   certificateDetail,
   certificateHistory,
   certificateLocations,
   issuanceAttributes,
   revocationAttributes,
   isFetchingAvailablFilters,
   isFetchingList,
   isFetchingDetail,
   isFetchingHistory,
   isFetchingLocations,
   isIssuing,
   isRevoking,
   isRenewing,
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
   validationResult
};


export const actions = slice.actions;


export default slice.reducer;
