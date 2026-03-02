import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    CbomDetailDto,
    CbomDto,
    CbomUploadRequestDto,
    PaginationResponseDtoCbomDto,
    SearchFieldDataByGroupDto,
    SearchRequestDto,
} from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    cbomsData?: PaginationResponseDtoCbomDto;
    cbomDetail?: CbomDetailDto;
    cbomVersions: CbomDto[];
    searchableFields: SearchFieldDataByGroupDto[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingVersions: boolean;
    isFetchingSearchableFields: boolean;
    isUploading: boolean;
};

export const initialState: State = {
    cbomVersions: [],
    searchableFields: [],

    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingVersions: false,
    isFetchingSearchableFields: false,
    isUploading: false,
};

export const slice = createSlice({
    name: 'cbom',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        // List CBOMs
        listCboms: (state, action: PayloadAction<SearchRequestDto>) => {
            state.cbomsData = undefined;
            state.isFetchingList = true;
        },

        listCbomsSuccess: (state, action: PayloadAction<{ data: PaginationResponseDtoCbomDto }>) => {
            state.cbomsData = action.payload.data;
            state.isFetchingList = false;
        },

        listCbomsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        // Get CBOM Detail
        getCbomDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.cbomDetail = undefined;
            state.isFetchingDetail = true;
        },

        getCbomDetailSuccess: (state, action: PayloadAction<{ detail: CbomDetailDto }>) => {
            state.cbomDetail = action.payload.detail;
            state.isFetchingDetail = false;
        },

        getCbomDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        clearCbomDetail: (state, action: PayloadAction<void>) => {
            state.cbomDetail = undefined;
        },

        // List CBOM Versions
        listCbomVersions: (state, action: PayloadAction<{ uuid: string }>) => {
            state.cbomVersions = [];
            state.isFetchingVersions = true;
        },

        listCbomVersionsSuccess: (state, action: PayloadAction<{ versions: CbomDto[] }>) => {
            state.cbomVersions = action.payload.versions;
            state.isFetchingVersions = false;
        },

        listCbomVersionsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingVersions = false;
        },

        // Get Searchable Fields
        getSearchableFields: (state, action: PayloadAction<void>) => {
            state.searchableFields = [];
            state.isFetchingSearchableFields = true;
        },

        getSearchableFieldsSuccess: (state, action: PayloadAction<{ fields: SearchFieldDataByGroupDto[] }>) => {
            state.searchableFields = action.payload.fields;
            state.isFetchingSearchableFields = false;
        },

        getSearchableFieldsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSearchableFields = false;
        },

        // Upload CBOM
        uploadCbom: (state, action: PayloadAction<CbomUploadRequestDto>) => {
            state.isUploading = true;
        },

        uploadCbomSuccess: (state, action: PayloadAction<{ cbom: CbomDto }>) => {
            state.isUploading = false;
            if (state.cbomsData) {
                state.cbomsData.items.unshift(action.payload.cbom);
            }
        },

        uploadCbomFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUploading = false;
        },
    },
});

const featureSelector = createFeatureSelector<State>('cbom');

export const selectCbomsData = createSelector(featureSelector, (state) => state.cbomsData);
export const selectCbomList = createSelector(featureSelector, (state) => state.cbomsData?.items || []);
export const selectCbomDetail = createSelector(featureSelector, (state) => state.cbomDetail);
export const selectCbomVersions = createSelector(featureSelector, (state) => state.cbomVersions);
export const selectSearchableFields = createSelector(featureSelector, (state) => state.searchableFields);

export const selectIsFetchingList = createSelector(featureSelector, (state) => state.isFetchingList);
export const selectIsFetchingDetail = createSelector(featureSelector, (state) => state.isFetchingDetail);
export const selectIsFetchingVersions = createSelector(featureSelector, (state) => state.isFetchingVersions);
export const selectIsFetchingSearchableFields = createSelector(featureSelector, (state) => state.isFetchingSearchableFields);
export const selectIsUploading = createSelector(featureSelector, (state) => state.isUploading);

export const selectors = {
    selectCbomsData,
    selectCbomList,
    selectCbomDetail,
    selectCbomVersions,
    selectSearchableFields,
    selectIsFetchingList,
    selectIsFetchingDetail,
    selectIsFetchingVersions,
    selectIsFetchingSearchableFields,
    selectIsUploading,
};

export const { actions } = slice;
export default slice.reducer;
