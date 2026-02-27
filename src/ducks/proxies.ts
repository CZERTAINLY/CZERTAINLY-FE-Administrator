import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProxyListModel, ProxyRequestModel, ProxyResponseModel, ProxyUpdateRequestModel } from 'types/proxies';
import { ProxyStatus } from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    checkedRows: string[];

    proxy?: ProxyResponseModel;
    proxies: ProxyListModel[];

    deleteErrorMessage: string;

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isUpdating: boolean;
};

export const initialState: State = {
    checkedRows: [],

    proxies: [],

    deleteErrorMessage: '',

    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: 'proxies',
    initialState,
    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {
            state.checkedRows = action.payload.checkedRows;
        },

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = '';
        },

        listProxies: (state, action: PayloadAction<{ status?: ProxyStatus }>) => {
            state.checkedRows = [];
            state.proxies = [];
            state.isFetchingList = true;
        },

        listProxiesSuccess: (state, action: PayloadAction<{ proxiesList: ProxyListModel[] }>) => {
            state.isFetchingList = false;
            state.proxies = action.payload.proxiesList;
        },

        listProxiesFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingList = false;
        },

        getProxyDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.proxy = undefined;
            state.isFetchingDetail = true;
        },

        getProxyDetailSuccess: (state, action: PayloadAction<{ proxy: ProxyResponseModel }>) => {
            state.isFetchingDetail = false;
            state.proxy = action.payload.proxy;

            const index = state.proxies.findIndex((proxy) => proxy.uuid === action.payload.proxy.uuid);

            if (index >= 0) {
                state.proxies[index] = action.payload.proxy;
            } else {
                state.proxies.push(action.payload.proxy);
            }
        },

        getProxyDetailFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingDetail = false;
        },

        createProxy: (state, action: PayloadAction<ProxyRequestModel>) => {
            state.isCreating = true;
        },

        createProxySuccess: (state, action: PayloadAction<{ proxy: ProxyResponseModel }>) => {
            state.isCreating = false;

            const index = state.proxies.findIndex((proxy) => proxy.uuid === action.payload.proxy.uuid);

            if (index >= 0) {
                state.proxies[index] = action.payload.proxy;
            } else {
                state.proxies.push(action.payload.proxy);
            }

            state.proxy = action.payload.proxy;
        },

        createProxyFailure: (state, action: PayloadAction<void>) => {
            state.isCreating = false;
        },

        updateProxy: (state, action: PayloadAction<{ uuid: string; proxyUpdateRequest: ProxyUpdateRequestModel }>) => {
            state.isUpdating = true;
        },

        updateProxySuccess: (state, action: PayloadAction<{ proxy: ProxyResponseModel }>) => {
            state.isUpdating = false;

            const index = state.proxies.findIndex((proxy) => proxy.uuid === action.payload.proxy.uuid);

            if (index >= 0) {
                state.proxies[index] = action.payload.proxy;
            }

            state.proxy = action.payload.proxy;
        },

        updateProxyFailure: (state, action: PayloadAction<void>) => {
            state.isUpdating = false;
        },

        deleteProxy: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
        },

        deleteProxySuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;
            state.proxies = state.proxies.filter((proxy) => proxy.uuid !== action.payload.uuid);
        },

        deleteProxyFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);
const checkedRows = createSelector(state, (state) => state.checkedRows);
const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const proxy = createSelector(state, (state) => state.proxy);
const proxies = createSelector(state, (state) => state.proxies);
const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);

export const selectors = {
    state,
    checkedRows,
    deleteErrorMessage,
    proxy,
    proxies,
    isFetchingList,
    isFetchingDetail,
    isCreating,
    isDeleting,
    isUpdating,
};

export const actions = slice.actions;

export default slice.reducer;
