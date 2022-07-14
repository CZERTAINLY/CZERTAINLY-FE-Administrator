import { CertificateModel } from "models/certificate";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CertificateListQueryFilter {
   field: string;
   condition: string;
   value?: any;
}


export interface CertificateListQuery {
   itemsPerPage: number;
   pageNumber: number;
   filters: CertificateListQueryFilter[];
}


export const statePath = "certificates";


export type State = {

   certificates: CertificateModel[];
   certificateDetail?: CertificateModel;

   isFetchingList: boolean;
   isFetchingDetail: boolean;

};


export const initialState: State = {

   certificates: [],
   isFetchingList: false,
   isFetchingDetail: false,

};


export const slice = createSlice({

   name: "certificates",

   initialState,

   reducers: {

      listCertificates: (state, action: PayloadAction<{ query: CertificateListQuery }>) => {

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

      }

   }

})


const state = createFeatureSelector<State>(statePath);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state,(state) => state.isFetchingDetail);

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
