import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import {
  AllAttributeResponse,
  Connector,
  ConnectorDetails,
  ConnectorHealth,
  ErrorDeleteObject,
} from "models";
import { createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";
import {
  ConnectorAttributes,
  ConnectorConnectionResponse,
} from "api/connectors";

export const statePath = "connectors";

export enum Actions {
  DetailRequest = "@@connectors/DETAIL_REQUEST",
  DetailSuccess = "@@connectors/DETAIL_SUCCESS",
  DetailFailure = "@@connectors/DETAIL_FAILURE",
  ListRequest = "@@connectors/LIST_REQUEST",
  ListSuccess = "@@connectors/LIST_SUCCESS",
  ListFailure = "@@connectors/LIST_FAILURE",
  CreateRequest = "@@connectors/CREATE_REQUEST",
  CreateSuccess = "@@connectors/CREATE_SUCCESS",
  CreateFailure = "@@connectors/CREATE_FAILURE",
  ConnectRequest = "@@connectors/CONNECT_REQUEST",
  ConnectSuccess = "@@connectors/CONNECT_SUCCESS",
  ConnectFailure = "@@connectors/CONNECT_FAILURE",
  UpdateRequest = "@@connectors/UPDATE_REQUEST",
  UpdateSuccess = "@@connectors/UPDATE_SUCCESS",
  UpdateFailure = "@@connectors/UPDATE_FAILURE",
  AttributeRequest = "@@connectors/ATTRIBUTE_REQUEST",
  AttributeSuccess = "@@connectors/ATTRIBUTE_SUCCESS",
  AttributeFailure = "@@connectors/ATTRIBUTE_FAILURE",
  AllAttributeRequest = "@@connectors/ALL_ATTRIBUTE_REQUEST",
  AllAttributeSuccess = "@@connectors/ALL_ATTRIBUTE_SUCCESS",
  AllAttributeFailure = "@@connectors/ALL_ATTRIBUTE_FAILURE",

  DeleteRequest = "@@connectors/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@connectors/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@connectors/CONFIRM_DELETE",
  CancelDelete = "@@connectors/CANCEL_DELETE",
  DeleteSuccess = "@@connectors/DELETE_SUCCESS",
  DeleteFailure = "@@connectors/DELETE_FAILURE",

  ForceDeleteRequest = "@@connectors/FORCE_DELETE_REQUEST",
  ForceDeleteSuccess = "@@connectors/FORCE_DELETE_SUCCESS",
  ForceDeleteFailure = "@@connectors/FORCE_DELETE_FAILURE",
  ForceDeleteCancel = "@@connectors/FORCE_DELETE_CANCEL",

  AuthorizeRequest = "@@connectors/AUTHORIZE_REQUEST",
  AuthorizeConfirm = "@@connectors/CONFIRM_AUTHORIZE_REQUEST",
  AuthorizeSuccess = "@@connectors/AUTHORIZE_SUCCESS",
  AuthorizeFailure = "@@connector/AUTHORIZE_FAILURE",
  AuthorizeCancel = "@@connector/AUTHORIZE_CANCEL",

  ReconnectRequest = "@@connectors/RECONNECT_REQUEST",
  ReconnectSuccess = "@@connectors/RECONNECT_SUCCESS",
  ReconnectFailure = "@@connector/RECONNECT_FAILURE",

  HealthRequest = "@@connector/HEALTH_REQUEST",
  HealthSuccess = "@@connector/HEALTH_SUCCESS",
  HealthFailure = "@@connector/HEALTH_FAILURE",

  CallbackRequest = "@@connector/CALLBACK_REQUEST",
  CallbackSuccess = "@@connector/CALLBACK_SUCCESS",
  CallbackFailure = "@@connector/CALLBACK_FAILURE",

  BulkDeleteRequest = "@@connectors/BULK_DELETE_REQUEST",
  BulkConfirmDeleteRequest = "@@connectors/BULK_CONFIRM_DELETE_REQUEST",
  BulkConfirmDelete = "@@connectors/BULK_CONFIRM_DELETE",
  BulkCancelDelete = "@@connectors/BULK_CANCEL_DELETE",
  BulkDeleteSuccess = "@@connectors/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@connectors/BULK_DELETE_FAILURE",

  BulkForceDeleteRequest = "@@connectors/BULK_FORCE_DELETE_REQUEST",
  BulkForceDeleteSuccess = "@@connectors/BULK_FORCE_DELETE_SUCCESS",
  BulkForceDeleteFailure = "@@connectors/BULK_FORCE_DELETE_FAILURE",
  BulkForceDeleteCancel = "@@connectors/BULK_FORCE_DELETE_CANCEL",

  BulkAuthorizeRequest = "@@connectors/BULK_AUTHORIZE_REQUEST",
  BulkAuthorizeConfirm = "@@connectors/BULK_CONFIRM_AUTHORIZE_REQUEST",
  BulkAuthorizeSuccess = "@@connectors/BULK_AUTHORIZE_SUCCESS",
  BulkAuthorizeFailure = "@@connector/BULK_AUTHORIZE_FAILURE",
  BulkAuthorizeCancel = "@@connector/BULK_AUTHORIZE_CANCEL",

  BulkReconnectRequest = "@@connectors/BULK_RECONNECT_REQUEST",
  BulkReconnectSuccess = "@@connectors/BULK_RECONNECT_SUCCESS",
  BulkReconnectFailure = "@@connector/BULK_RECONNECT_FAILURE",
}
export const actions = {
  requestConnectorDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveConnectorDetail: createCustomAction(
    Actions.DetailSuccess,
    (data: ConnectorDetails) => ({ data })
  ),
  failConnectorDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestConnectorsList: createCustomAction(Actions.ListRequest),
  receiveConnectorsList: createCustomAction(
    Actions.ListSuccess,
    (connectors: Connector[]) => ({ connectors })
  ),
  failConnectorsList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestAttributeList: createCustomAction(
    Actions.AttributeRequest,
    (uuid: string, code: string, kind: string) => ({
      uuid,
      code,
      kind,
    })
  ),
  receiveAttributeList: createCustomAction(
    Actions.AttributeSuccess,
    (attributes: ConnectorAttributes[]) => ({ attributes })
  ),
  failAttributeList: createCustomAction(
    Actions.AttributeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestAllAttributeList: createCustomAction(
    Actions.AllAttributeRequest,
    (uuid: string) => ({
      uuid,
    })
  ),
  receiveAllAttributeList: createCustomAction(
    Actions.AllAttributeSuccess,
    (attributes: AllAttributeResponse) => ({ attributes })
  ),
  failAllAttributeList: createCustomAction(
    Actions.AllAttributeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestCreateConnector: createCustomAction(
    Actions.CreateRequest,
    (
      name: string,
      url: string,
      authType: string,
      authAttributes: any,
      history: History<unknown>
    ) => ({
      name,
      url,
      authType,
      authAttributes,
      history,
    })
  ),
  receiveCreateConnector: createCustomAction(
    Actions.CreateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failCreateConnector: createCustomAction(
    Actions.CreateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestConnectConnector: createCustomAction(
    Actions.ConnectRequest,
    (
      name: string,
      url: string,
      authType: string,
      authAttributes: any,
      uuid: string
    ) => ({
      name,
      url,
      authType,
      authAttributes,
      uuid,
    })
  ),
  receiveConnectConnector: createCustomAction(
    Actions.ConnectSuccess,
    (connectorConnectResponse: ConnectorConnectionResponse[]) => ({
      connectorConnectResponse,
    })
  ),
  failConnectConnector: createCustomAction(
    Actions.ConnectFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUpdateConnector: createCustomAction(
    Actions.UpdateRequest,
    (
      uuid: string,
      name: string,
      url: string,
      authType: string,
      authAttributes: any,
      history: History<unknown>
    ) => ({
      uuid,
      name,
      url,
      authType,
      authAttributes,
      history,
    })
  ),
  receiveUpdateConnector: createCustomAction(
    Actions.UpdateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failUpdateConnector: createCustomAction(
    Actions.UpdateSuccess,
    (uuid: string) => ({ uuid })
    // (error?: string) => createErrorAlertAction(error)
  ),

  requestDeleteConnector: createCustomAction(
    Actions.DeleteRequest,
    (uuid: string) => ({ uuid })
  ),
  confirmDeleteConnectorRequest: createCustomAction(
    Actions.ConfirmDeleteRequest,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),

  requestForceDeleteConnector: createCustomAction(
    Actions.ForceDeleteRequest,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  recieveForceDeleteConnector: createCustomAction(
    Actions.ForceDeleteSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failForceDeleteConnector: createCustomAction(
    Actions.ForceDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelForceDeleteConnector: createCustomAction(Actions.ForceDeleteCancel),

  confirmDeleteConnector: createCustomAction(
    Actions.ConfirmDelete,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  cancelDeleteConnector: createCustomAction(Actions.CancelDelete),
  receiveDeleteConnector: createCustomAction(
    Actions.DeleteSuccess,
    (errorMessage: ErrorDeleteObject[], uuid: string | number) => ({
      errorMessage,
      uuid,
    })
  ),
  failDeleteConnector: createCustomAction(
    Actions.DeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestAuthorizeConnector: createCustomAction(
    Actions.AuthorizeRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveAuthorizeConnector: createCustomAction(
    Actions.AuthorizeSuccess,
    (uuid: string) => ({ uuid })
  ),
  confirmAuthorizeConnector: createCustomAction(
    Actions.AuthorizeConfirm,
    (uuid: string) => ({ uuid })
  ),
  failAuthorizeConnector: createCustomAction(
    Actions.AuthorizeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestReconnectConnector: createCustomAction(
    Actions.ReconnectRequest,
    (uuid: string) => ({ uuid })
  ),
  recieveReconnectConnector: createCustomAction(
    Actions.ReconnectSuccess,
    (uuid: string) => ({ uuid })
  ),
  failReconnectConnector: createCustomAction(
    Actions.ReconnectFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelAuthorizeConnector: createCustomAction(
    Actions.AuthorizeCancel,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestConnectorHealth: createCustomAction(
    Actions.HealthRequest,
    (uuid: string) => ({ uuid })
  ),
  recieveConnectorHealth: createCustomAction(
    Actions.HealthSuccess,
    (health: ConnectorHealth) => ({ health })
  ),
  failConnectorHealth: createCustomAction(
    Actions.HealthFailure,
    (error?: string) => error
  ),

  requestCallback: createCustomAction(
    Actions.CallbackRequest,
    (
      connectorUuid: string,
      request: any,
      functionGroup: string,
      kind: string,
      authorityUuid: string
    ) => ({
      connectorUuid,
      request,
      functionGroup,
      kind,
      authorityUuid,
    })
  ),
  receiveCallback: createCustomAction(
    Actions.CallbackFailure,
    (response: any) => ({ response })
  ),
  failCallback: createCustomAction(Actions.CallbackSuccess, (error?: string) =>
    createErrorAlertAction(error)
  ),

  requestBulkDeleteConnector: createCustomAction(
    Actions.BulkDeleteRequest,
    (uuid: string) => ({ uuid })
  ),
  confirmBulkDeleteConnectorRequest: createCustomAction(
    Actions.BulkConfirmDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),

  requestBulkForceDeleteConnector: createCustomAction(
    Actions.BulkForceDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  recieveBulkForceDeleteConnector: createCustomAction(
    Actions.BulkForceDeleteSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkForceDeleteConnector: createCustomAction(
    Actions.BulkForceDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelBulkForceDeleteConnector: createCustomAction(
    Actions.BulkForceDeleteCancel
  ),

  confirmBulkDeleteConnector: createCustomAction(
    Actions.BulkConfirmDelete,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  cancelBulkDeleteConnector: createCustomAction(Actions.BulkCancelDelete),
  receiveBulkDeleteConnector: createCustomAction(
    Actions.BulkDeleteSuccess,
    (errorMessage: ErrorDeleteObject[], uuid: (string | number)[]) => ({
      errorMessage,
      uuid,
    })
  ),
  failBulkDeleteConnector: createCustomAction(
    Actions.BulkDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkAuthorizeConnector: createCustomAction(
    Actions.BulkAuthorizeRequest,
    (uuid: string[]) => ({ uuid })
  ),
  receiveBulkAuthorizeConnector: createCustomAction(
    Actions.BulkAuthorizeSuccess,
    (uuid: string[]) => ({ uuid })
  ),
  confirmBulkAuthorizeConnector: createCustomAction(
    Actions.BulkAuthorizeConfirm,
    (uuid: string[]) => ({ uuid })
  ),
  failBulkAuthorizeConnector: createCustomAction(
    Actions.BulkAuthorizeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkReconnectConnector: createCustomAction(
    Actions.BulkReconnectRequest,
    (uuid: string[]) => ({ uuid })
  ),
  recieveBulkReconnectConnector: createCustomAction(
    Actions.BulkReconnectSuccess,
    (uuid: string[]) => ({ uuid })
  ),
  failBulkReconnectConnector: createCustomAction(
    Actions.BulkReconnectFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelBulkAuthorizeConnector: createCustomAction(
    Actions.BulkAuthorizeCancel,
    (error?: string) => createErrorAlertAction(error)
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  connectors: Connector[];
  connectorConnectionDetails: ConnectorConnectionResponse[];
  attributes: ConnectorAttributes[];
  allAttributes: AllAttributeResponse | null;
  isConnected: boolean;
  isCreatingConnector: boolean;
  isConnectingConnector: boolean;
  isDeletingConnector: boolean;
  isFetchingProfiles: boolean;
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isEditing: boolean;
  confirmDeleteConnector: string;
  confirmAuthorizeConnector: string;
  selectedConnector: ConnectorDetails | null;
  connectorHealth: ConnectorHealth;
  isFetchingHealth: boolean;
  deleteConnectorErrors: ErrorDeleteObject[];
  isReconnecting: boolean;
  callbackResponse: any;
  isFetchingCallback: boolean;
};

export const initialState: State = {
  connectors: [],
  connectorConnectionDetails: [],
  attributes: [],
  allAttributes: null,
  isConnected: false,
  isCreatingConnector: false,
  isConnectingConnector: false,
  isDeletingConnector: false,
  isFetchingProfiles: false,
  isFetchingList: false,
  isFetchingDetail: false,
  isEditing: false,
  confirmDeleteConnector: "",
  confirmAuthorizeConnector: "",
  selectedConnector: null,
  connectorHealth: { status: "Unknown" },
  isFetchingHealth: false,
  deleteConnectorErrors: [],
  isReconnecting: false,
  callbackResponse: [],
  isFetchingCallback: false,
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestDeleteConnector):
      return { ...state };
    case getType(actions.confirmDeleteConnectorRequest):
      return { ...state, confirmDeleteConnector: action.uuid };
    case getType(actions.cancelDeleteConnector):
      return {
        ...state,
        confirmDeleteConnector: "",
        isDeletingConnector: false,
      };
    case getType(actions.confirmDeleteConnector):
      return {
        ...state,
        confirmDeleteConnector: "",
        isDeletingConnector: false,
      };
    case getType(actions.failDeleteConnector):
      return { ...state, isDeletingConnector: false };

    case getType(actions.requestForceDeleteConnector):
      return { ...state, isDeletingConnector: true };
    case getType(actions.cancelForceDeleteConnector):
      return {
        ...state,
        isDeletingConnector: false,
        deleteConnectorErrors: [],
      };
    case getType(actions.recieveForceDeleteConnector):
      return {
        ...state,
        isDeletingConnector: false,
        deleteConnectorErrors: [],
      };
    case getType(actions.failForceDeleteConnector):
      return {
        ...state,
        isDeletingConnector: false,
        deleteConnectorErrors: [],
      };

    case getType(actions.receiveDeleteConnector):
      return {
        ...state,
        deleteConnectorErrors: action.errorMessage,
        isDeletingConnector: false,
      };

    case getType(actions.requestBulkDeleteConnector):
      return { ...state };
    case getType(actions.confirmBulkDeleteConnectorRequest):
      return { ...state, confirmDeleteConnector: action.uuid };
    case getType(actions.cancelBulkDeleteConnector):
      return {
        ...state,
        confirmDeleteConnector: "",
        isDeletingConnector: false,
      };
    case getType(actions.confirmBulkDeleteConnector):
      return {
        ...state,
        confirmDeleteConnector: "",
        isDeletingConnector: false,
      };
    case getType(actions.failBulkDeleteConnector):
      return { ...state, isDeletingConnector: false };

    case getType(actions.requestBulkForceDeleteConnector):
      return { ...state, isDeletingConnector: true };
    case getType(actions.cancelBulkForceDeleteConnector):
      return {
        ...state,
        isDeletingConnector: false,
        deleteConnectorErrors: [],
      };
    case getType(actions.recieveBulkForceDeleteConnector):
      let updated: Connector[] = [];
      for (let i of state.connectors) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeletingConnector: false,
        deleteConnectorErrors: [],
        connectors: updated,
      };
    case getType(actions.failBulkForceDeleteConnector):
      return {
        ...state,
        isDeletingConnector: false,
        deleteConnectorErrors: [],
      };

    case getType(actions.receiveBulkDeleteConnector):
      let upd: Connector[] = [];
      const failedDelete: (string | number)[] = action.errorMessage.map(
        function (conn: ErrorDeleteObject) {
          return conn.uuid;
        }
      );
      for (let i of state.connectors) {
        if (action.uuid.includes(i.uuid) && failedDelete.includes(i.uuid)) {
          upd.push(i);
        } else if (!action.uuid.includes(i.uuid)) {
          upd.push(i);
        }
      }
      return {
        ...state,
        deleteConnectorErrors: action.errorMessage,
        isDeletingConnector: false,
        connectors: upd,
      };

    case getType(actions.requestCreateConnector):
      return { ...state, isCreatingConnector: true };
    case getType(actions.receiveCreateConnector):
      return { ...state, isCreatingConnector: false, isConnected: false };
    case getType(actions.failCreateConnector):
      return { ...state, isCreatingConnector: false, isConnected: false };
    case getType(actions.requestConnectConnector):
      return { ...state, isConnectingConnector: true, isConnected: false };
    case getType(actions.receiveConnectConnector):
      return {
        ...state,
        isConnectingConnector: false,
        isConnected: true,
        connectorConnectionDetails: action.connectorConnectResponse,
      };
    case getType(actions.failConnectConnector):
      return {
        ...state,
        isConnectingConnector: false,
        isConnected: true,
        connectorConnectionDetails: [],
      };
    case getType(actions.requestConnectorDetail):
      return { ...state, selectedConnector: null, isFetchingDetail: true };
    case getType(actions.receiveConnectorDetail):
      return {
        ...state,
        isFetchingDetail: false,
        selectedConnector: action.data,
      };
    case getType(actions.failConnectorDetail):
      return { ...state, isFetchingDetail: false };
    case getType(actions.requestAttributeList):
      return { ...state, attributes: [] };
    case getType(actions.receiveAttributeList):
      return {
        ...state,
        attributes: action.attributes,
      };
    case getType(actions.failAttributeList):
      return { ...state, isFetchingDetail: false };

    case getType(actions.requestAllAttributeList):
      return { ...state, allAttributes: {} };
    case getType(actions.receiveAllAttributeList):
      return {
        ...state,
        allAttributes: action.attributes,
      };
    case getType(actions.failAllAttributeList):
      return { ...state, isFetchingDetail: false };

    case getType(actions.requestConnectorsList):
      return {
        ...state,
        selectedConnector: null,
        connectors: [],
        isFetchingList: true,
        isFetchingDetail: false,
        isConnectingConnector: false,
        isConnected: false,
        deleteConnectorErrors: [],
      };
    case getType(actions.receiveConnectorsList):
      return {
        ...state,
        isFetchingList: false,
        connectors: action.connectors,
      };
    case getType(actions.failConnectorsList):
      return { ...state, isFetchingList: false };

    case getType(actions.requestUpdateConnector):
      return { ...state, isEditing: true };
    case getType(actions.receiveUpdateConnector):
      return {
        ...state,
        isEditing: false,
      };
    case getType(actions.failUpdateConnector):
      return {
        ...state,
        isEditing: false,
      };

    case getType(actions.requestAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: action.uuid };
    case getType(actions.receiveAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: "" };
    case getType(actions.cancelAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: "" };
    case getType(actions.confirmAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: "" };

    case getType(actions.requestReconnectConnector):
      return { ...state, isReconnecting: true };
    case getType(actions.recieveReconnectConnector):
      return { ...state, isReconnecting: false };
    case getType(actions.failReconnectConnector):
      return { ...state, isReconnecting: false };

    case getType(actions.requestBulkAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: action.uuid };
    case getType(actions.receiveBulkAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: "" };
    case getType(actions.cancelBulkAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: "" };
    case getType(actions.confirmBulkAuthorizeConnector):
      return { ...state, confirmAuthorizeConnector: "" };

    case getType(actions.requestBulkReconnectConnector):
      return { ...state, isReconnecting: true };
    case getType(actions.recieveBulkReconnectConnector):
      return { ...state, isReconnecting: false };
    case getType(actions.failBulkReconnectConnector):
      return { ...state, isReconnecting: false };

    case getType(actions.requestConnectorHealth):
      return {
        ...state,
        isFetchingHealth: true,
        connectorHealth: { status: "Unknown" },
      };
    case getType(actions.recieveConnectorHealth):
      return {
        ...state,
        isFetchingHealth: false,
        connectorHealth: action.health,
      };
    case getType(actions.failConnectorHealth):
      return { ...state, isFetchingHealth: false };

    case getType(actions.requestCallback):
      return { ...state, isFetchingCallback: true, callbackResponse: [] };
    case getType(actions.receiveCallback):
      return {
        ...state,
        isFetchingCallback: false,
        callbackResponse: action.response,
      };
    case getType(actions.failCallback):
      return { ...state, isFetchingCallback: false };
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isCreatingConnector = createSelector(
  selectState,
  (state) => state.isCreatingConnector
);

const isConnectingConnector = createSelector(
  selectState,
  (state) => state.isConnectingConnector
);

const isDeletingConnector = createSelector(
  selectState,
  (state) => state.isDeletingConnector
);

const isEditing = createSelector(selectState, (state) => state.isEditing);

const isConnected = createSelector(selectState, (state) => state.isConnected);

const isFetching = createSelector(
  selectState,
  (state) =>
    state.isFetchingList ||
    state.isFetchingDetail ||
    state.isFetchingProfiles ||
    state.isFetchingCallback ||
    state.isReconnecting
);

const isFetchingCallback = createSelector(
  selectState,
  (state) => state.isFetchingCallback
);

const selectConnectors = createSelector(
  selectState,
  (state) => state.connectors
);

const selectAttributes = createSelector(
  selectState,
  (state) => state.attributes
);

const selectAllAttributes = createSelector(
  selectState,
  (state) => state.allAttributes
);

const selectSelectedConnector = createSelector(
  selectState,
  (state) => state.selectedConnector
);

const connectorConnectionDetails = createSelector(
  selectState,
  (state) => state.connectorConnectionDetails
);

const selectConnectorDetails = createSelector(
  selectState,
  (state) => state.selectedConnector
);

const selectConfirmDeleteConnectorId = createSelector(
  selectState,
  (state) => state.confirmDeleteConnector
);

const selectConfirmAuthorizeConnectorId = createSelector(
  selectState,
  (state) => state.confirmAuthorizeConnector
);

const selectConnectorHealth = createSelector(
  selectState,
  (state) => state.connectorHealth
);

const selectDeleteConnectorError = createSelector(
  selectState,
  (state) => state.deleteConnectorErrors
);

const selectIsReconnecting = createSelector(
  selectState,
  (state) => state.isReconnecting
);

const callbackResponse = createSelector(
  selectState,
  (state) => state.callbackResponse
);

export const selectors = {
  selectState,
  isCreatingConnector,
  isConnectingConnector,
  isDeletingConnector,
  isConnected,
  connectorConnectionDetails,
  isEditing,
  isFetching,
  selectConnectors,
  selectConnectorDetails,
  selectConfirmDeleteConnectorId,
  selectSelectedConnector,
  selectConfirmAuthorizeConnectorId,
  selectAttributes,
  selectAllAttributes,
  selectConnectorHealth,
  selectDeleteConnectorError,
  selectIsReconnecting,
  isFetchingCallback,
  callbackResponse,
};
