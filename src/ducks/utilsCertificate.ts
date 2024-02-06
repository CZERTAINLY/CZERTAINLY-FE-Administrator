import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { ParseCertificateRequestDtoParseTypeEnum, ParseCertificateResponseDto } from '../types/openapi/utils';

export type State = {
    parsedCertificate?: ParseCertificateResponseDto;
    isFetchingDetail: boolean;
};

export const initialState: State = {
    isFetchingDetail: false,
};

export const slice = createSlice({
    name: 'utilsCertificate',
    initialState,
    reducers: {
        reset: (state) => {
            state.parsedCertificate = undefined;
        },
        parseCertificate: (state, action: PayloadAction<{ certificate: string; parseType: ParseCertificateRequestDtoParseTypeEnum }>) => {
            state.parsedCertificate = undefined;
            state.isFetchingDetail = true;
        },

        parseCertificateSuccess: (state, action: PayloadAction<ParseCertificateResponseDto>) => {
            state.parsedCertificate = action.payload;
            state.isFetchingDetail = false;
        },

        parseCertificateFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const parsedCertificate = createSelector(state, (state: State) => state.parsedCertificate);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);

export const selectors = {
    state,
    parsedCertificate,
    isFetchingDetail,
};

export const actions = slice.actions;

export default slice.reducer;
