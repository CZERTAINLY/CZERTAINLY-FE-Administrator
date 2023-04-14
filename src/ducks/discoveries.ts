import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeDescriptorModel } from "types/attributes";
import { SearchRequestModel } from "types/certificate";
import { ConnectorResponseModel } from "types/connectors";
import {
    DiscoveryCertificateListModel,
    DiscoveryRequestModel,
    DiscoveryResponseDetailModel,
    DiscoveryResponseModel,
} from "types/discoveries";
import { createFeatureSelector } from "utils/ducks";
import { GetDiscoveryCertificatesRequest } from "../types/openapi";

export type State = {
    checkedRows: string[];

    discovery?: DiscoveryResponseDetailModel;
    discoveries: DiscoveryResponseModel[];

    discoveryProviders?: ConnectorResponseModel[];
    discoveryProviderAttributeDescriptors?: AttributeDescriptorModel[];

    discoveryCertificates?: DiscoveryCertificateListModel;

    totalPages: number;
    totalItems: number;

    isFetchingDiscoveryProviders: boolean;
    isFetchingDiscoveryProviderAttributeDescriptors: boolean;
    isFetchingDiscoveryCertificates: boolean;

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
};

export const initialState: State = {
    checkedRows: [],

    discoveries: [],

    totalPages: 0,
    totalItems: 0,

    isFetchingDiscoveryProviders: false,
    isFetchingDiscoveryProviderAttributeDescriptors: false,
    isFetchingDiscoveryCertificates: false,

    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isBulkDeleting: false,
};

export const slice = createSlice({
    name: "discoveries",

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

        clearDiscoveryProviderAttributeDescriptors: (state, action: PayloadAction<void>) => {
            state.discoveryProviderAttributeDescriptors = [];
        },

        listDiscoveryProviders: (state, action: PayloadAction<void>) => {
            state.discoveryProviders = undefined;
            state.isFetchingDiscoveryProviders = true;
        },

        listDiscoveryProvidersSuccess: (state, action: PayloadAction<{ connectors: ConnectorResponseModel[] }>) => {
            state.discoveryProviders = action.payload.connectors;
            state.isFetchingDiscoveryProviders = false;
        },

        listDiscoveryProvidersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDiscoveryProviders = false;
        },

        getDiscoveryProviderAttributesDescriptors: (state, action: PayloadAction<{ uuid: string; kind: string }>) => {
            state.discoveryProviderAttributeDescriptors = [];
            state.isFetchingDiscoveryProviderAttributeDescriptors = true;
        },

        getDiscoveryProviderAttributesDescriptorsSuccess: (
            state,
            action: PayloadAction<{ attributeDescriptor: AttributeDescriptorModel[] }>,
        ) => {
            state.discoveryProviderAttributeDescriptors = action.payload.attributeDescriptor;
            state.isFetchingDiscoveryProviderAttributeDescriptors = false;
        },

        getDiscoveryProviderAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDiscoveryProviderAttributeDescriptors = false;
        },

        getDiscoveryCertificates: (state, action: PayloadAction<GetDiscoveryCertificatesRequest>) => {
            state.discoveryCertificates = undefined;
            state.isFetchingDiscoveryCertificates = true;
        },

        getDiscoveryCertificatesSuccess: (state, action: PayloadAction<DiscoveryCertificateListModel>) => {
            state.discoveryCertificates = action.payload;
            state.isFetchingDiscoveryCertificates = false;
        },

        getDiscoveryCertificatesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDiscoveryCertificates = false;
        },

        listDiscoveries: (state, action: PayloadAction<SearchRequestModel>) => {
            state.discoveries = [];
            state.isFetchingList = true;
        },

        listDiscoveriesSuccess: (
            state,
            action: PayloadAction<{ discoveryList: DiscoveryResponseModel[]; totalPages: number; totalItems: number }>,
        ) => {
            state.discoveries = action.payload.discoveryList;
            state.isFetchingList = false;
            state.totalItems = action.payload.totalItems;
            state.totalPages = action.payload.totalPages;
        },

        listDiscoveriesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getDiscoveryDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.discovery = undefined;
            state.isFetchingDetail = true;
        },

        getDiscoveryDetailSuccess: (state, action: PayloadAction<{ discovery: DiscoveryResponseDetailModel }>) => {
            state.isFetchingDetail = false;

            state.discovery = action.payload.discovery;

            const discoveryIndex = state.discoveries.findIndex((discovery) => discovery.uuid === action.payload.discovery.uuid);

            if (discoveryIndex >= 0) {
                state.discoveries[discoveryIndex] = action.payload.discovery;
            } else {
                state.discoveries.push(action.payload.discovery);
            }
        },

        getDiscoveryDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        createDiscovery: (state, action: PayloadAction<DiscoveryRequestModel>) => {
            state.isCreating = true;
        },

        createDiscoverySuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
        },

        createDiscoveryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        deleteDiscovery: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
        },

        deleteDiscoverySuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const index = state.discoveries.findIndex((a) => a.uuid === action.payload.uuid);

            if (index !== -1) state.discoveries.splice(index, 1);

            if (state.discovery?.uuid === action.payload.uuid) state.discovery = undefined;
        },

        deleteDiscoveryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        bulkDeleteDiscovery: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDeleting = true;
        },

        bulkDeleteDiscoverySuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDeleting = false;

            action.payload.uuids.forEach((uuid) => {
                const index = state.discoveries.findIndex((discovery) => discovery.uuid === uuid);
                if (index !== -1) state.discoveries.splice(index, 1);
            });

            if (state.discovery && action.payload.uuids.includes(state.discovery.uuid)) state.discovery = undefined;
        },

        bulkDeleteDiscoveryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state) => state.checkedRows);

const discoveryProviders = createSelector(state, (state) => state.discoveryProviders);
const discoveryProviderAttributeDescriptors = createSelector(state, (state) => state.discoveryProviderAttributeDescriptors);

const discoveryCertificates = createSelector(state, (state) => state.discoveryCertificates);

const discovery = createSelector(state, (state) => state.discovery);
const discoveries = createSelector(state, (state) => state.discoveries);

const totalItems = createSelector(state, (state) => state.totalItems);
const totalPages = createSelector(state, (state) => state.totalPages);

const isFetchingDiscoveryProviders = createSelector(state, (state) => state.isFetchingDiscoveryProviders);
const isFetchingDiscoveryProviderAttributeDescriptors = createSelector(
    state,
    (state) => state.isFetchingDiscoveryProviderAttributeDescriptors,
);
const isFetchingDiscoveryCertificates = createSelector(state, (state) => state.isFetchingDiscoveryCertificates);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);

export const selectors = {
    state,

    checkedRows,

    discoveryProviders,
    discoveryProviderAttributeDescriptors,

    discoveryCertificates,

    discovery,
    discoveries,

    totalItems,
    totalPages,

    isFetchingDiscoveryProviders,
    isFetchingDiscoveryProviderAttributeDescriptors,
    isFetchingDiscoveryCertificates,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isDeleting,
    isBulkDeleting,
};

export const actions = slice.actions;

export default slice.reducer;
