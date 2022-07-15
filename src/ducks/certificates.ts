import { AvailableCertificateFilterModel, CertificateEventHistoryModel, CertificateListQueryModel, CertificateModel } from "models/certificate";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeModel } from "models/attributes/AttributeModel";
import { certificatePEM2CertificateModel } from "utils/certificate";


export const statePath = "certificates";


export type State = {

   availableCertificateFilters: AvailableCertificateFilterModel[];

   certificates: CertificateModel[];
   certificateDetail?: CertificateModel;
   certificateHistory?: CertificateEventHistoryModel[];

   isFetchingAvailableCertificateFilters: boolean;

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isFetchingHistory: boolean;

   isIssuingCertificate: boolean;
   isRevokingCertificate: boolean;
   isRenewingCertificate: boolean;

   isUpdatingGroup: boolean;


};


export const initialState: State = {

   availableCertificateFilters: [],

   certificates: [],

   isFetchingAvailableCertificateFilters: false,

   isFetchingList: false,
   isFetchingDetail: false,
   isFetchingHistory: false,

   isIssuingCertificate: false,
   isRevokingCertificate: false,
   isRenewingCertificate: false,

   isUpdatingGroup: false,


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

         state.isIssuingCertificate = true;

      },


      createCertificateSuccess: (state, action: PayloadAction<{
         uuid: string,
         certificateData: string
      }>) => {

         state.isIssuingCertificate = false;

      },


      createCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isIssuingCertificate = false;

      },


      revokeCertificate: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isRevokingCertificate = true;

      },


      revokeCertificateSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isRevokingCertificate = false;

         const cerificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (cerificateIndex >= 0) state.certificates.splice(cerificateIndex, 1);

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail = undefined;

      },


      revokeCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isRevokingCertificate = false;

      },


      renewCertificate: (state, action: PayloadAction<{
         uuid: string;
         raProfileUuid: string;
         pkcs10: string;
      }>) => {

         state.isRenewingCertificate = true;

      },


      renewCertificateSuccess: (state, action: PayloadAction<{
         uuid: string;
         certificateData: string;
      }>) => {

         state.isRenewingCertificate = false;

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates[certificateIndex] = certificatePEM2CertificateModel(action.payload.certificateData);

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail = certificatePEM2CertificateModel(action.payload.certificateData);

      },


      renewCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isRenewingCertificate = false;

      },


      getAvailableCertificateFilters: (state, action: PayloadAction<void>) => {

         state.availableCertificateFilters = [];
         state.isFetchingAvailableCertificateFilters = true;

      },


      getAvailableCertificateFiltersSuccess: (state, action: PayloadAction<{ availableCertificateFilters: AvailableCertificateFilterModel[] }>) => {

         state.isFetchingAvailableCertificateFilters = false;
         state.availableCertificateFilters = action.payload.availableCertificateFilters;

      },


      getAvailableCertificateFiltersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAvailableCertificateFilters = false;

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


      updateGroup: (state, action: PayloadAction<{ uuid: string, groupUuid: string }>) =>{

         state.isUpdatingGroup = true;

      },


      updateGroupSuccess: (state, action: PayloadAction<{ uuid: string, groupUuid: string, group: GroupM }>) =>{

         state.isUpdatingGroup = false;

         const certificateIndex = state.certificates.findIndex(certificate => certificate.uuid === action.payload.uuid);

         if (certificateIndex >= 0) state.certificates[certificateIndex].group = action.payload.group;

         if (state.certificateDetail?.uuid === action.payload.uuid) state.certificateDetail.group = action.payload.group;

      },


      updateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) =>{

         state.isUpdatingGroup = false;

      }



















   }

})


const state = createFeatureSelector<State>(statePath);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);

const certificates = createSelector(state, (state) => state.certificates);
const certificateDetail = createSelector(state, (state) => state.certificateDetail);


export const selectors = {
   state,
   certificates,
   certificateDetail,
   isFetchingList,
   isFetchingDetail,
};


export const actions = slice.actions;


export default slice.reducer;
