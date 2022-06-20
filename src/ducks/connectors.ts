import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeDescriptorCollectionModel, AttributeDescriptorModel, AttributeModel } from "models/attributes";
import { ConnectorHealthModel, ConnectorModel, FunctionGroupModel } from "models/connectors";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";
import { createSelector } from "reselect";
import { AuthType, FunctionGroupCode } from "types/connectors";

import { createFeatureSelector } from "utils/ducks";

export type State = {

   checkedRows: string[]

   connector?: ConnectorModel;
   connectorHealth?: ConnectorHealthModel;
   connectorAttributes?: AttributeDescriptorCollectionModel;
   connectorConnectionDetails?: FunctionGroupModel[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   connectors: ConnectorModel[];

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

};


export const initialState: State = {

   checkedRows: [],

   connectors: [],

   deleteErrorMessage: "",
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
   isBulkAuthorizing: false

};


export const slice = createSlice({

   name: "connectors",

   initialState,

   reducers: {

      setCheckedRows: (state, action: PayloadAction<string[]>) => {

         state.checkedRows = action.payload;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },


      clearConnectionDetails: (state, action: PayloadAction<void>) => {

         state.connectorConnectionDetails = undefined;

      },


      listConnectors: (state, action: PayloadAction<void>) => {

         state.checkedRows = [];
         state.connectors = [];
         state.isFetchingList = true;

      },


      listConnectorsSuccess: (state, action: PayloadAction<ConnectorModel[]>) => {

         state.isFetchingList = false;
         state.connectors = action.payload;

      },


      listConnectorsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingList = false;

      },


      getConnectorDetail: (state, action: PayloadAction<string>) => {

         state.connector = undefined;
         state.connectorAttributes = undefined;
         state.connectorHealth = undefined;
         state.connectorConnectionDetails = undefined;
         state.isFetchingDetail = true;

      },


      getConnectorDetailSuccess: (state, action: PayloadAction<ConnectorModel>) => {

         state.isFetchingDetail = false;
         state.connector = action.payload;
         const index = state.connectors.findIndex(connector => connector.uuid === action.payload.uuid);
         if (index >= 0) state.connectors[index] = action.payload;

      },


      getConnectorDetailFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingDetail = false;

      },


      getConnectorAttributes: (state, action: PayloadAction<{ uuid: string, functionGroup: FunctionGroupCode, kind: string }>) => {

         if (
            state.connectorAttributes &&
            state.connectorAttributes.hasOwnProperty(action.payload.functionGroup) &&
            state.connectorAttributes[action.payload.functionGroup]!.hasOwnProperty(action.payload.kind)
         ) {
            delete state.connectorAttributes![action.payload.functionGroup]![action.payload.functionGroup];
         }

         state.isFetchingAttributes = true;

      },


      getConnectorAttributesSuccess: (state, action: PayloadAction<{ functionGroup: FunctionGroupCode, kind: string, attributes: AttributeDescriptorModel[] }>) => {

         state.isFetchingAllAttributes = false;
         state.connectorAttributes = state.connectorAttributes || {};
         state.connectorAttributes[action.payload.functionGroup] = state.connectorAttributes[action.payload.functionGroup] || {};
         state.connectorAttributes![action.payload.functionGroup]![action.payload.functionGroup] = action.payload.attributes;

      },


      getConnectorAttributesFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingAllAttributes = false;

      },


      getAllConnectorAttributes: (state, action: PayloadAction<string>) => {

         state.isFetchingAllAttributes = true;
         state.connectorAttributes = undefined;

      },


      getAllConnectorAttributesSuccess: (state, action: PayloadAction<AttributeDescriptorCollectionModel>) => {

         state.isFetchingAllAttributes = false;
         state.connectorAttributes = action.payload;

      },


      getAllConnectorAttributesFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingAllAttributes = false;

      },


      getConnectorHealth: (state, action: PayloadAction<string>) => {

         state.connectorHealth = undefined;
         state.isFetchingHealth = true;

      },


      getConnectorHealthSuccess: (state, action: PayloadAction<ConnectorHealthModel>) => {

         state.isFetchingHealth = false;
         state.connectorHealth = action.payload;

      },


      getConnectorHealthFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingHealth = false;

      },


      connectorCallback: (state, action: PayloadAction<{ authorityUuid: string, connectorUuid: string, name: string, functionGroup: string }>) => {
      },


      connectorCallbackSuccess: (state, action: PayloadAction<any>) => {
      },


      connectorCallbackFailure: (state, action: PayloadAction<string | undefined>) => {
      },


      createConnector: (state, action: PayloadAction<{name: string, url: string, authType: AuthType, authAttributes?: AttributeModel[]}>) => {

         state.isCreating = true;

      },


      createConnectorSuccess: (state, action: PayloadAction<ConnectorModel>) => {

         state.isCreating = false;
         // !!! When connector is created the complete object should be returned in order to be possible to local cache

      },


      createConnectorFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isCreating = false;

      },


      updateConnector: (state, action: PayloadAction<{ uuid: string, url: string, authType: AuthType, authAttributes?: AttributeModel[] }>) => {

         state.isUpdating = true;

      },


      updateConnectorSuccess: (state, action: PayloadAction<ConnectorModel>) => {

         state.isUpdating = false;

         if (state.connector?.uuid === action.payload.uuid) {
            state.connector = action.payload;
         }

         const index = state.connectors.findIndex(connector => connector.uuid === action.payload.uuid);
         if (index >= 0) {
            state.connectors[index] = action.payload
         } else {
            state.connectors.push(action.payload)
         }

      },


      updateConnectorFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isUpdating = false;

      },


      deleteConnector: (state, action: PayloadAction<string>) => {

         state.deleteErrorMessage = "";
         state.isDeleting = true;

      },


      deleteConnectorSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

         const index = state.connectors.findIndex(connector => connector.uuid === action.payload);
         if (index >= 0) state.connectors.splice(index, 1);

      },


      deleteConnectorFailure: (state, action: PayloadAction<string>) => {

         state.deleteErrorMessage = action.payload;
         state.isDeleting = false;

      },


      bulkDeleteConnectors: (state, action: PayloadAction<string[]>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteConnectorsSuccess: (state, action: PayloadAction<{ uuids: string[], errors: DeleteObjectErrorModel[] }>) => {

         state.isBulkDeleting = false;
         if (Array.isArray(action.payload.errors) && action.payload.errors.length > 0) {
            state.bulkDeleteErrorMessages = action.payload.errors;
            return;
         }

         action.payload.uuids.forEach(
            uuid => {
               const index = state.connectors.findIndex(connector => connector.uuid === uuid);
               if (index >= 0) state.connectors.splice(index, 1);
            }
         )

      },


      bulkDeleteConnectorsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.bulkDeleteErrorMessages = [
            {
               uuid: "",
               name: "Failed to delete connectors",
               message: action.payload || "Unknown error"
            }
         ]
         state.isBulkDeleting = false;

      },


      bulkForceDeleteConnectors: (state, action: PayloadAction<{ uuids: string[], successRedirect?: string}>) => {

         state.isBulkForceDeleting = true;

      },


      bulkForceDeleteConnectorsSuccess: (state, action: PayloadAction<{ uuids: string[], successRedirect?: string}>) => {

         state.isBulkForceDeleting = false;

         action.payload.uuids.forEach(
            uuid => {
               const index = state.connectors.findIndex(connector => connector.uuid === uuid);
               if (index >= 0) state.connectors.splice(index, 1);
            }
         )

      },


      bulkForceDeleteConnectorsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isBulkForceDeleting = false;

      },


      connectConnector: (state, action: PayloadAction<{ url: string, authType: AuthType, authAttributes?: AttributeModel[], uuid?: string }>) => {

         state.connectorConnectionDetails = [];
         state.isConnecting = true;

      },


      connectConnectorSuccess: (state, action: PayloadAction<FunctionGroupModel[]>) => {

         state.isConnecting = false;
         state.connectorConnectionDetails = action.payload;

      },


      connectConnectorFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isConnecting = false;

      },


      reconnectConnector: (state, action: PayloadAction<string>) => {

         state.connectorConnectionDetails = undefined;
         state.isReconnecting = true;

      },


      reconnectConnectorSuccess: (state, action: PayloadAction<{ uuid: string, functionGroups: FunctionGroupModel[] }>) => {

         state.connectorConnectionDetails = action.payload.functionGroups;
         state.isReconnecting = false;

      },


      reconnectConnectorFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isReconnecting = false;

      },


      bulkReconnectConnectors: (state, action: PayloadAction<string[]>) => {

         state.isBulkReconnecting = true;
      },


      bulkReconnectConnectorsSuccess: (state, action: PayloadAction<void>) => {

         state.isBulkReconnecting = false;

      },


      bulkReconnectConnectorsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isBulkReconnecting = false;

      },


      authorizeConnector: (state, action: PayloadAction<string>) => {

         state.isAuthorizing = true;

      },


      authorizeConnectorAuccess: (state, action: PayloadAction<void>) => {

         state.isAuthorizing = false;

      },


      authorizeConnectorFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isAuthorizing = false;

      },


      bulkAuthorizeConnectors: (state, action: PayloadAction<string[]>) => {

         state.isBulkReconnecting = true;

      },


      bulkAuthorizeConnectorsSuccess: (state, action: PayloadAction<void>) => {

         state.isBulkReconnecting = false;

      },


      bulkAuthorizeConnectorsFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isBulkReconnecting = false;

      }

   }

});

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state => state.checkedRows);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const connector = createSelector(state, state => state.connector);
const connectorHealth = createSelector(state, state => state.connectorHealth);
const connectorAttributes = createSelector(state, state => state.connectorAttributes);
const connectorConnectionDetails = createSelector(state, state => state.connectorConnectionDetails);

const connectors = createSelector(state, state => state.connectors);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isFetchingHealth = createSelector(state, state => state.isFetchingHealth);
const isFetchingAttributes = createSelector(state, state => state.isFetchingAttributes);
const isFetchingAllAttributes = createSelector(state, state => state.isFetchingAllAttributes);
const isCreating = createSelector(state, state => state.isCreating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);
const isBulkForceDeleting = createSelector(state, state => state.isBulkForceDeleting);
const isUpdating = createSelector(state, state => state.isUpdating);
const isConnecting = createSelector(state, state => state.isConnecting);
const isBulkConnecting = createSelector(state, state => state.isBulkReconnecting);
const isReconnecting = createSelector(state, state => state.isReconnecting);
const isBulkReconnecting = createSelector(state, state => state.isBulkReconnecting);
const isAuthorizing = createSelector(state, state => state.isAuthorizing);
const isBulkAuthorizing = createSelector(state, state => state.isBulkAuthorizing);

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
   isBulkAuthorizing
};

export const actions = slice.actions;

export default slice.reducer;

