import { AvailableCertificateFilterModel, CertificateEventHistoryModel, CertificateListQueryModel, CertificateModel } from "models/certificate";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeModel } from "models/attributes/AttributeModel";
import { certificatePEM2CertificateModel } from "utils/certificate";
import { CertificateRAProfileModel } from "models/certificate";
import { GroupModel } from "models/groups";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { CertificateRevocationReason } from "types/certificate";


export const statePath = "certificates";


export type State = {

   availableFilters: AvailableCertificateFilterModel[];

   certificates: CertificateModel[];
   certificateDetail?: CertificateModel;
   certificateHistory?: CertificateEventHistoryModel[];
   issuanceAttributes?: AttributeDescriptorModel[];
   revocationAttributes?: AttributeDescriptorModel[];

   isFetchingAvailableFilters: boolean;

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isFetchingHistory: boolean;

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


};


export const initialState: State = {

   availableFilters: [],

   certificates: [],

   isFetchingAvailableFilters: false,

   isFetchingList: false,
   isFetchingDetail: false,
   isFetchingHistory: false,

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


};


export const slice = createSlice({

   name: "certificates",

   initialState,

   reducers: {

      listCertificates: (state, action: PayloadAction<{ query: CertificateListQueryModel }>) => {

         state.certificates = [];
         state.isFetchingList = true;

      },


      listCertificatesSuccess: (state, action: PayloadAction<{ certificateList: CertificateModel[] }>) => {

         state.isFetchingList = false;
         state.certificates = action.payload.certificateList;

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


      issueCertificate: (state, action: PayloadAction<{
         raProfileUuid: string;
         pkcs10: string;
         attributes: AttributeModel[]
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
         attributes: AttributeModel[]
       }>) => {

         state.isRevoking = true;

      },


      revokeCertificateSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isRevoking = false;

         const cerificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (cerificateIndex >= 0) state.certificates.splice(cerificateIndex, 1);

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail = undefined;

      },


      revokeCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isRevoking = false;

      },


      renewCertificate: (state, action: PayloadAction<{
         uuid: string;
         raProfileUuid: string;
         pkcs10: string;
      }>) => {

         state.isRenewing = true;

      },


      renewCertificateSuccess: (state, action: PayloadAction<{
         uuid: string;
         certificateData: string;
      }>) => {

         state.isRenewing = false;

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates[certificateIndex] = certificatePEM2CertificateModel(action.payload.certificateData);

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail = certificatePEM2CertificateModel(action.payload.certificateData);

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


      deleteCertificate: (state, action: PayloadAction<{ uuid: string }>) => {

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


      updateRaProfile: (state, action: PayloadAction<{ uuid: string, raProfileUuid: string }>) => {

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


      bulkUpdateGroup: (state, action: PayloadAction<{ uuids: string[], groupUuid: string }>) => {

         state.isBulkUpdatingGroup = true;

      },


      bulkUpdateGroupSuccess: (state, action: PayloadAction<{ uuids: string[], group: GroupModel }>) => {

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


      bulkUpdateRaProfile: (state, action: PayloadAction<{ uuids: string[], raProfileUuid: string }>) => {

         state.isBulkUpdatingRaProfile = true;

      },


      bulkUpdateRaProfileSuccess: (state, action: PayloadAction<{ uuids: string[], raProfile: CertificateRAProfileModel }>) => {

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


      bulkUpdateOwner: (state, action: PayloadAction<{ uuids: string[], owner: string }>) => {

         state.isBulkUpdatingOwner = true;

      },


      bulkUpdateOwnerSuccess: (state, action: PayloadAction<{ uuids: string[], owner: string }>) => {

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


      bulkDelete: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

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

      },


      uploadCertificate: (state, action: PayloadAction<{ certificate: string }>) => {

         state.isUploading = true;

      },


      uploadCertificateSuccess: (state, action: PayloadAction<{ uuid: string, certificate: CertificateModel }>) => {

         state.isUploading = false;
         state.certificates.push(action.payload.certificate);

      },


      uploadCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUploading = false;

      },


      getIssuanceAttributes: (state, action: PayloadAction<{ raProfileUuid: string }>) => {

         state.isFetchingIssuanceAttributes = true;

      },


      getIssuanceAttributesSuccess: (state, action: PayloadAction<{ raProfileUuid: string, issuanceAttributes: AttributeDescriptorModel[] }>) => {

         state.isFetchingIssuanceAttributes = false;
         state.issuanceAttributes = action.payload.issuanceAttributes;

      },


      getIssuanceAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingIssuanceAttributes = false;

      },


      getRevocationAttributes: (state, action: PayloadAction<{ raProfileUuid: string }>) => {

            state.isFetchingRevocationAttributes = true;

         },


      getRevocationAttributesSuccess: (state, action: PayloadAction<{ raProfileUuid: string, revocationAttributes: AttributeDescriptorModel[] }>) => {

         state.isFetchingRevocationAttributes = false;
         state.revocationAttributes = action.payload.revocationAttributes;

      },


      getRevocationAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingRevocationAttributes = false;

      }


   }

})


const state = createFeatureSelector<State>(statePath);

const availableCertificateFilters = createSelector(state, state => state.availableFilters);

const certificates = createSelector(state, state => state.certificates);
const certificateDetail = createSelector(state, state => state.certificateDetail);
const certificateHistory = createSelector(state, state => state.certificateHistory);
const issuanceAttributes = createSelector(state, state => state.issuanceAttributes);
const revocationAttributes = createSelector(state, state => state.revocationAttributes);

const isFetchingAvailablFilters = createSelector(state, state => state.isFetchingAvailableFilters);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isFetchingHistory = createSelector(state, state => state.isFetchingHistory);

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


export const selectors = {
   state,
   availableCertificateFilters,
   certificates,
   certificateDetail,
   certificateHistory,
   issuanceAttributes,
   revocationAttributes,
   isFetchingAvailablFilters,
   isFetchingList,
   isFetchingDetail,
   isFetchingHistory,
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
   isFetchingRevocationAttributes
};


export const actions = slice.actions;


export default slice.reducer;
