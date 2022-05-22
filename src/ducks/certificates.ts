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

      listCertificates: (state, action: PayloadAction<CertificateListQuery>) => {

         state.certificates = [];
         state.isFetchingList = true;

      },


      listCertificatesSuccess: (state, action: PayloadAction<CertificateModel[]>) => {

         state.isFetchingList = false;
         state.certificates = action.payload;

      },


      listCertificatesFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingList = false;

      },


      getCertificateDetail: (state, action: PayloadAction<string>) => {

         state.certificateDetail = undefined;
         state.isFetchingDetail = true;

      },


      getCertificateDetailSuccess: (state, action: PayloadAction<CertificateModel>) => {

         state.isFetchingDetail = false;
         state.certificateDetail = action.payload;

      },


      getCertificateDetailFailure: (state, action: PayloadAction<string | undefined>) => {

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
