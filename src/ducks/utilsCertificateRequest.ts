import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { ParseRequestRequestDtoParseTypeEnum, ParseRequestResponseDto } from '../types/openapi/utils';

export type State = {
    parsedCertificateRequest?: ParseRequestResponseDto;
    isFetchingDetail: boolean;
};

export const initialState: State = {
    isFetchingDetail: false,
};

export const slice = createSlice({
    name: 'utilsCertificateRequest',
    initialState,
    reducers: {
        reset: (state) => {
            state.parsedCertificateRequest = undefined;
        },
        parseCertificateRequest: (
            state,
            action: PayloadAction<{ content: string; requestParseType: ParseRequestRequestDtoParseTypeEnum }>,
        ) => {
            state.parsedCertificateRequest = undefined;
            state.isFetchingDetail = true;
        },

        parseCertificateRequestSuccess: (state, action: PayloadAction<ParseRequestResponseDto>) => {
            state.parsedCertificateRequest = action.payload;
            state.isFetchingDetail = false;
        },

        parseCertificateRequestFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const parsedCertificateRequest = createSelector(state, (state: State) => state.parsedCertificateRequest);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);

export const selectors = {
    state,
    parsedCertificateRequest,
    isFetchingDetail,
};

export const actions = slice.actions;

export default slice.reducer;
