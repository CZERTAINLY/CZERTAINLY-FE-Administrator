import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AttributeDescriptorCollectionModel, AttributeDescriptorModel } from 'types/attributes';

import {
    BulkActionModel,
    CallbackConnectorModel,
    CallbackResourceModel,
    ConnectorRequestModel,
    ConnectorResponseModel,
    ConnectorUpdateRequestModel,
    ConnectRequestModel,
    FunctionGroupModel,
    HealthModel,
} from 'types/connectors';
import { ConnectorStatus, FunctionGroupCode } from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    checkedRows: string[];

    connector?: ConnectorResponseModel;
    connectorHealth?: HealthModel;
    connectorAttributes?: AttributeDescriptorCollectionModel;
    connectorConnectionDetails?: FunctionGroupModel[];
    connectors: ConnectorResponseModel[];

    callbackData: { [key: string]: any };

    deleteErrorMessage: string;
    bulkDeleteErrorMessages: BulkActionModel[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingHealth: boolean;
    isFetchingAttributes: boolean;
    isFetchingAllAttributes: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
    isBulkForceDeleting: boolean;
    isUpdating: boolean;
    isConnecting: boolean;
    isReconnecting: boolean;
    isBulkReconnecting: boolean;
    isAuthorizing: boolean;
    isBulkAuthorizing: boolean;
    isRunningCallback: { [key: string]: boolean };
};

export const initialState: State = {
    checkedRows: [],

    connectors: [],

    callbackData: {},

    deleteErrorMessage: '',
    bulkDeleteErrorMessages: [],

    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingHealth: false,
    isFetchingAttributes: false,
    isFetchingAllAttributes: false,
    isCreating: false,
    isDeleting: false,
    isBulkDeleting: false,
    isBulkForceDeleting: false,
    isUpdating: false,
    isConnecting: false,
    isReconnecting: false,
    isBulkReconnecting: false,
    isAuthorizing: false,
    isBulkAuthorizing: false,
    isRunningCallback: {},
};

export const slice = createSlice({
    name: 'connectors',

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
            state.bulkDeleteErrorMessages = [];
        },

        clearConnectionDetails: (state, action: PayloadAction<void>) => {
            state.connectorConnectionDetails = undefined;
        },

        clearCallbackData: (state, action: PayloadAction<void>) => {
            state.callbackData = {};
        },

        listConnectors: (state, action: PayloadAction<void>) => {
            state.checkedRows = [];
            state.connectors = [];
            state.isFetchingList = true;
        },

        listConnectorsSuccess: (state, action: PayloadAction<{ connectorList: ConnectorResponseModel[] }>) => {
            state.isFetchingList = false;
            state.connectors = action.payload.connectorList;
        },

        listConnectorsFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingList = false;
        },

        getConnectorDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.connector = undefined;
            state.connectorAttributes = undefined;
            state.connectorHealth = undefined;
            state.connectorConnectionDetails = undefined;
            state.isFetchingDetail = true;
        },

        getConnectorDetailSuccess: (state, action: PayloadAction<{ connector: ConnectorResponseModel }>) => {
            state.isFetchingDetail = false;

            state.connector = action.payload.connector;

            const index = state.connectors.findIndex((connector) => connector.uuid === action.payload.connector.uuid);

            if (index >= 0) {
                state.connectors[index] = action.payload.connector;
            } else {
                state.connectors.push(action.payload.connector);
            }
        },

        getConnectorDetailFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingDetail = false;
        },

        getConnectorAttributesDescriptors: (
            state,
            action: PayloadAction<{ uuid: string; functionGroup: FunctionGroupCode; kind: string }>,
        ) => {
            if (
                state.connectorAttributes &&
                state.connectorAttributes.hasOwnProperty(action.payload.functionGroup) &&
                state.connectorAttributes[action.payload.functionGroup]!.hasOwnProperty(action.payload.kind)
            ) {
                delete state.connectorAttributes![action.payload.functionGroup]![action.payload.kind];
            }

            state.isFetchingAttributes = true;
        },

        getConnectorAttributeDescriptorsSuccess: (
            state,
            action: PayloadAction<{ functionGroup: string; kind: string; attributes: AttributeDescriptorModel[] }>,
        ) => {
            state.isFetchingAllAttributes = false;
            state.connectorAttributes = state.connectorAttributes || {};
            state.connectorAttributes[action.payload.functionGroup] = state.connectorAttributes[action.payload.functionGroup] || {};
            state.connectorAttributes[action.payload.functionGroup][action.payload.kind] = action.payload.attributes;
        },

        getConnectorAttributesDescriptorsFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingAllAttributes = false;
        },

        getConnectorAllAttributesDescriptors: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingAllAttributes = true;
            state.connectorAttributes = undefined;
        },

        getConnectorAllAttributesDescriptorsSuccess: (
            state,
            action: PayloadAction<{ attributeDescriptorCollection: AttributeDescriptorCollectionModel }>,
        ) => {
            state.isFetchingAllAttributes = false;
            state.connectorAttributes = action.payload.attributeDescriptorCollection;
        },

        getAllConnectorAllAttributesDescriptorsFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingAllAttributes = false;
        },

        getConnectorHealth: (state, action: PayloadAction<{ uuid: string }>) => {
            state.connectorHealth = undefined;
            state.isFetchingHealth = true;
        },

        getConnectorHealthSuccess: (state, action: PayloadAction<{ health: HealthModel }>) => {
            state.isFetchingHealth = false;
            state.connectorHealth = action.payload.health;
        },

        getConnectorHealthFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingHealth = false;
        },

        createConnector: (state, action: PayloadAction<ConnectorRequestModel>) => {
            state.isCreating = true;
        },

        createConnectorSuccess: (state, action: PayloadAction<{ connector: ConnectorResponseModel }>) => {
            state.isCreating = false;

            const index = state.connectors.findIndex((connector) => connector.uuid === action.payload.connector.uuid);

            if (index >= 0) {
                state.connectors[index] = action.payload.connector;
            } else {
                state.connectors.push(action.payload.connector);
            }

            state.connector = action.payload.connector;
            state.connectorHealth = undefined;
            state.connectorAttributes = undefined;
            state.connectorConnectionDetails = undefined;
        },

        createConnectorFailure: (state, action: PayloadAction<void>) => {
            state.isCreating = false;
        },

        updateConnector: (
            state,
            action: PayloadAction<{
                uuid: string;
                connectorUpdateRequest: ConnectorUpdateRequestModel;
            }>,
        ) => {
            state.isUpdating = true;
        },

        updateConnectorSuccess: (state, action: PayloadAction<{ connector: ConnectorResponseModel }>) => {
            state.isUpdating = false;

            const index = state.connectors.findIndex((connector) => connector.uuid === action.payload.connector.uuid);

            if (index >= 0) {
                state.connectors[index] = action.payload.connector;
            } else {
                state.connectors.push(action.payload.connector);
            }

            if (state.connector?.uuid === action.payload.connector.uuid) state.connector = action.payload.connector;
        },

        updateConnectorFailure: (state, action: PayloadAction<void>) => {
            state.isUpdating = false;
        },

        deleteConnector: (state, action: PayloadAction<{ uuid: string }>) => {
            state.deleteErrorMessage = '';
            state.isDeleting = true;
        },

        deleteConnectorSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const index = state.connectors.findIndex((connector) => connector.uuid === action.payload.uuid);

            if (index >= 0) state.connectors.splice(index, 1);

            if (state.connector?.uuid === action.payload.uuid) {
                state.connector = undefined;
                state.connectorHealth = undefined;
                state.connectorAttributes = undefined;
                state.connectorConnectionDetails = undefined;
            }
        },

        deleteConnectorFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
            state.isDeleting = false;
        },

        bulkDeleteConnectors: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.bulkDeleteErrorMessages = [];
            state.isBulkDeleting = true;
        },

        bulkDeleteConnectorsSuccess: (state, action: PayloadAction<{ uuids: string[]; errors: BulkActionModel[] }>) => {
            state.isBulkDeleting = false;

            if (action.payload.errors?.length > 0) {
                state.bulkDeleteErrorMessages = action.payload.errors;
                return;
            }

            action.payload.uuids.forEach((uuid) => {
                const index = state.connectors.findIndex((connector) => connector.uuid === uuid);
                if (index >= 0) state.connectors.splice(index, 1);
            });

            if (state.connector && action.payload.uuids.includes(state.connector.uuid)) {
                state.connector = undefined;
                state.connectorHealth = undefined;
                state.connectorAttributes = undefined;
                state.connectorConnectionDetails = undefined;
            }
        },

        bulkDeleteConnectorsFailure: (state, action: PayloadAction<void>) => {
            state.isBulkDeleting = false;
        },

        bulkForceDeleteConnectors: (state, action: PayloadAction<{ uuids: string[]; successRedirect?: string }>) => {
            state.isBulkForceDeleting = true;
        },

        bulkForceDeleteConnectorsSuccess: (state, action: PayloadAction<{ uuids: string[]; successRedirect?: string }>) => {
            state.isBulkForceDeleting = false;

            action.payload.uuids.forEach((uuid) => {
                const index = state.connectors.findIndex((connector) => connector.uuid === uuid);
                if (index >= 0) state.connectors.splice(index, 1);
            });

            if (state.connector && action.payload.uuids.includes(state.connector.uuid)) {
                state.connector = undefined;
                state.connectorHealth = undefined;
                state.connectorAttributes = undefined;
                state.connectorConnectionDetails = undefined;
            }
        },

        bulkForceDeleteConnectorsFailure: (state, action: PayloadAction<void>) => {
            state.isBulkForceDeleting = false;
        },

        connectConnector: (state, action: PayloadAction<ConnectRequestModel>) => {
            state.connectorConnectionDetails = [];
            state.isConnecting = true;
        },

        connectConnectorSuccess: (state, action: PayloadAction<{ connectionDetails: FunctionGroupModel[] }>) => {
            state.isConnecting = false;
            state.connectorConnectionDetails = action.payload.connectionDetails;
        },

        connectConnectorFailure: (state, action: PayloadAction<void>) => {
            state.isConnecting = false;
        },

        reconnectConnector: (state, action: PayloadAction<{ uuid: string }>) => {
            state.connectorConnectionDetails = undefined;
            state.isReconnecting = true;
        },

        reconnectConnectorSuccess: (state, action: PayloadAction<{ uuid: string; functionGroups: FunctionGroupModel[] }>) => {
            state.connectorConnectionDetails = action.payload.functionGroups;
            state.isReconnecting = false;
        },

        reconnectConnectorFailure: (state, action: PayloadAction<void>) => {
            state.isReconnecting = false;
        },

        bulkReconnectConnectors: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkReconnecting = true;
        },

        bulkReconnectConnectorsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkReconnecting = false;
        },

        bulkReconnectConnectorsFailure: (state, action: PayloadAction<void>) => {
            state.isBulkReconnecting = false;
        },

        authorizeConnector: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isAuthorizing = true;
        },

        authorizeConnectorSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isAuthorizing = false;
            state.connector!.status = ConnectorStatus.Connected;
        },

        authorizeConnectorFailure: (state, action: PayloadAction<void>) => {
            state.isAuthorizing = false;
        },

        bulkAuthorizeConnectors: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkAuthorizing = true;
        },

        bulkAuthorizeConnectorsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkAuthorizing = false;
        },

        bulkAuthorizeConnectorsFailure: (state, action: PayloadAction<void>) => {
            state.isBulkAuthorizing = false;
        },

        callbackConnector: (
            state,
            action: PayloadAction<{
                callbackId: string;
                callbackConnector: CallbackConnectorModel;
            }>,
        ) => {
            if (state.callbackData[action.payload.callbackId]) state.callbackData[action.payload.callbackId] = undefined;

            state.isRunningCallback[action.payload.callbackId] = true;
        },

        callbackResource: (
            state,
            action: PayloadAction<{
                callbackId: string;
                callbackResource: CallbackResourceModel;
            }>,
        ) => {
            if (state.callbackData[action.payload.callbackId]) state.callbackData[action.payload.callbackId] = undefined;

            state.isRunningCallback[action.payload.callbackId] = true;
        },

        callbackSuccess: (state, action: PayloadAction<{ callbackId: string; data: object }>) => {
            state.callbackData[action.payload.callbackId] = action.payload.data;
            state.isRunningCallback[action.payload.callbackId] = false;
        },

        callbackFailure: (state, action: PayloadAction<{ callbackId: string }>) => {
            state.isRunningCallback[action.payload.callbackId] = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state) => state.checkedRows);

const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, (state) => state.bulkDeleteErrorMessages);

const connector = createSelector(state, (state) => state.connector);
const connectorHealth = createSelector(state, (state) => state.connectorHealth);
const connectorAttributes = createSelector(state, (state) => state.connectorAttributes);
const connectorConnectionDetails = createSelector(state, (state) => state.connectorConnectionDetails);
const callbackData = createSelector(state, (state) => state.callbackData);

const connectors = createSelector(state, (state) => state.connectors);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingHealth = createSelector(state, (state) => state.isFetchingHealth);
const isFetchingAttributes = createSelector(state, (state) => state.isFetchingAttributes);
const isFetchingAllAttributes = createSelector(state, (state) => state.isFetchingAllAttributes);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkForceDeleting = createSelector(state, (state) => state.isBulkForceDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isConnecting = createSelector(state, (state) => state.isConnecting);
const isBulkConnecting = createSelector(state, (state) => state.isBulkReconnecting);
const isReconnecting = createSelector(state, (state) => state.isReconnecting);
const isBulkReconnecting = createSelector(state, (state) => state.isBulkReconnecting);
const isAuthorizing = createSelector(state, (state) => state.isAuthorizing);
const isBulkAuthorizing = createSelector(state, (state) => state.isBulkAuthorizing);
const isRunningCallback = createSelector(state, (state) => state.isRunningCallback);

export const selectors = {
    state,

    checkedRows,

    deleteErrorMessage,
    bulkDeleteErrorMessages,

    connector,
    connectorHealth,
    connectorAttributes,
    connectorConnectionDetails,
    connectors,
    callbackData,

    isFetchingList,
    isFetchingDetail,
    isFetchingHealth,
    isFetchingAttributes,
    isFetchingAllAttributes,
    isCreating,
    isDeleting,
    isBulkDeleting,
    isBulkForceDeleting,
    isUpdating,
    isConnecting,
    isBulkConnecting,
    isReconnecting,
    isBulkReconnecting,
    isAuthorizing,
    isBulkAuthorizing,
    isRunningCallback,
};

export const actions = slice.actions;

export default slice.reducer;
