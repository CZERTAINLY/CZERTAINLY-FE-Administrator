import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import { Client, ClientDetails } from "models";
import { arrayReducer, createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";

export const statePath = "clients";

export enum Actions {
  AuthorizeProfileRequest = "@@clients/AUTHORIZE_REQUEST",
  AuthorizeProfileSuccess = "@@clients/AUTHORIZE_SUCCESS",
  AuthorizeProfileFailure = "@@clients/AUTHORIZE_FAILURE",
  AuthListRequest = "@@clients/AUTH_LIST_REQUEST",
  AuthListSuccess = "@@clients/AUTH_LIST_SUCCESS",
  AuthListFailure = "@@clients/AUTH_LIST_FAILURE",
  DetailRequest = "@@clients/DETAIL_REQUEST",
  DetailSuccess = "@@clients/DETAIL_SUCCESS",
  DetailFailure = "@@clients/DETAIL_FAILURE",
  ListRequest = "@@clients/LIST_REQUEST",
  ListSuccess = "@@clients/LIST_SUCCESS",
  ListFailure = "@@clients/LIST_FAILURE",
  EnableRequest = "@@clients/ENABLE_REQUEST",
  EnableSuccess = "@@clients/ENABLE_SUCCESS",
  EnableFailure = "@@clients/ENABLE_FAILURE",
  DisableRequest = "@@clients/DISABLE_REQUEST",
  DisableSuccess = "@@clients/DISABLE_SUCCESS",
  DisableFailure = "@@clients/DISABLE_FAILURE",
  DeleteRequest = "@@clients/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@clients/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@clients/CONFIRM_DELETE",
  CancelDelete = "@@clients/CANCEL_DELETE",
  DeleteSuccess = "@@clients/DELETE_SUCCESS",
  DeleteFailure = "@@clients/DELETE_FAILURE",

  BulkEnableRequest = "@@clients/BULK_ENABLE_REQUEST",
  BulkEnableSuccess = "@@clients/BULK_ENABLE_SUCCESS",
  BulkEnableFailure = "@@clients/BULK_ENABLE_FAILURE",
  BulkDisableRequest = "@@clients/BULK_DISABLE_REQUEST",
  BulkDisableSuccess = "@@clients/BULK_DISABLE_SUCCESS",
  BulkDisableFailure = "@@clients/BULK_DISABLE_FAILURE",
  BulkDeleteRequest = "@@clients/BULK_DELETE_REQUEST",
  BulkConfirmDeleteRequest = "@@clients/BULK_CONFIRM_DELETE_REQUEST",
  BulkConfirmDelete = "@@clients/BULK_CONFIRM_DELETE",
  BulkCancelDelete = "@@clients/BULK_CANCEL_DELETE",
  BulkDeleteSuccess = "@@clients/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@clients/BULK_DELETE_FAILURE",

  UnauthorizeRequest = "@@clients/UNAUTHORIZE_REQUEST",
  UnauthorizeSuccess = "@@clients/UNAUTHORIZE_SUCCESS",
  UnauthorizeFailure = "@@clients/UNAUTHORIZE_FAILURE",
  CreateRequest = "@@clients/CREATE_REQUEST",
  CreateSuccess = "@@clients/CREATE_SUCCESS",
  CreateFailure = "@@clients/CREATE_FAILURE",
  UpdateRequest = "@@clients/UPDATE_REQUEST",
  UpdateSuccess = "@@clients/UPDATE_SUCCESS",
  UpdateFailure = "@@clients/UPDATE_FAILURE",
}

export const actions = {
  requestAuthorizedProfiles: createCustomAction(
    Actions.AuthListRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveAuthorizedProfiles: createCustomAction(
    Actions.AuthListSuccess,
    (profiles: string[]) => ({ profiles })
  ),
  failAuthorizedProfiles: createCustomAction(
    Actions.AuthListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestClientDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveClientDetail: createCustomAction(
    Actions.DetailSuccess,
    (data: ClientDetails) => ({ data })
  ),
  failClientDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestEnableClient: createCustomAction(
    Actions.EnableRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveEnableClient: createCustomAction(
    Actions.EnableSuccess,
    (uuid: string) => ({ uuid })
  ),
  failEnableClient: createCustomAction(
    Actions.EnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestDisableClient: createCustomAction(
    Actions.DisableRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveDisableClient: createCustomAction(
    Actions.DisableSuccess,
    (uuid: string) => ({ uuid })
  ),
  failDisableClient: createCustomAction(
    Actions.DisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestDeleteClient: createCustomAction(
    Actions.DeleteRequest,
    (uuid: string, history: History) => ({ uuid, history })
  ),
  confirmDeleteClientRequest: createCustomAction(
    Actions.ConfirmDeleteRequest,
    (uuid: string, history: History) => ({ uuid, history })
  ),
  confirmDeleteClient: createCustomAction(
    Actions.ConfirmDelete,
    (uuid: string, history: History) => ({ uuid, history })
  ),
  cancelDeleteClient: createCustomAction(Actions.CancelDelete),
  receiveDeleteClient: createCustomAction(
    Actions.DeleteSuccess,
    (uuid: string) => ({ uuid })
  ),
  failDeleteClient: createCustomAction(
    Actions.DeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkEnableClient: createCustomAction(
    Actions.BulkEnableRequest,
    (uuid: string[]) => ({ uuid })
  ),
  receiveBulkEnableClient: createCustomAction(
    Actions.BulkEnableSuccess,
    (uuid: string[]) => ({ uuid })
  ),
  failBulkEnableClient: createCustomAction(
    Actions.BulkEnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkDisableClient: createCustomAction(
    Actions.BulkDisableRequest,
    (uuid: string[]) => ({ uuid })
  ),
  receiveBulkDisableClient: createCustomAction(
    Actions.BulkDisableSuccess,
    (uuid: string[]) => ({ uuid })
  ),
  failBulkDisableClient: createCustomAction(
    Actions.BulkDisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkDeleteClient: createCustomAction(
    Actions.BulkDeleteRequest,
    (uuid: string[]) => ({ uuid })
  ),
  confirmBulkDeleteClientRequest: createCustomAction(
    Actions.BulkConfirmDeleteRequest,
    (uuid: string[]) => ({ uuid })
  ),
  confirmBulkDeleteClient: createCustomAction(
    Actions.BulkConfirmDelete,
    (uuid: string[]) => ({ uuid })
  ),
  cancelBulkDeleteClient: createCustomAction(Actions.BulkCancelDelete),
  receiveBulkDeleteClient: createCustomAction(
    Actions.BulkDeleteSuccess,
    (uuid: string[]) => ({ uuid })
  ),
  failBulkDeleteClient: createCustomAction(
    Actions.BulkDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestClientsList: createCustomAction(Actions.ListRequest),
  receiveClientsList: createCustomAction(
    Actions.ListSuccess,
    (clients: Client[]) => ({ clients })
  ),
  failClientsList: createCustomAction(Actions.ListFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
  requestAuthorizeProfile: createCustomAction(
    Actions.AuthorizeProfileRequest,
    (clientId: string, profileId: string) => ({ clientId, profileId })
  ),
  receiveAuthorizeProfile: createCustomAction(
    Actions.AuthorizeProfileSuccess,
    (clientId: string, profileId: string) => ({ clientId, profileId })
  ),
  failAuthorizeProfile: createCustomAction(
    Actions.AuthorizeProfileFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUnauthorizeProfile: createCustomAction(
    Actions.UnauthorizeRequest,
    (clientId: string, profileId: string) => ({ clientId, profileId })
  ),
  receiveUnauthorizeProfile: createCustomAction(
    Actions.UnauthorizeSuccess,
    (clientId: string, profileId: string) => ({ clientId, profileId })
  ),
  failUnauthorizeProfile: createCustomAction(
    Actions.UnauthorizeFailure,
    (clientId: string, profileId: string, error?: string) =>
      createErrorAlertAction(error, { clientId, profileId })
  ),
  requestCreateClient: createCustomAction(
    Actions.CreateRequest,
    (
      name: string,
      certificate: File,
      description: string,
      enabled: boolean,
      certificateUuid: string,
      history: History<unknown>
    ) => ({ name, certificate, description, enabled, certificateUuid, history })
  ),
  receiveCreateClient: createCustomAction(
    Actions.CreateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failCreateClient: createCustomAction(
    Actions.CreateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUpdateClient: createCustomAction(
    Actions.UpdateRequest,
    (
      uuid: string,
      certificate: File | undefined,
      description: string,
      certificateUuid: string,
      history: History<unknown>
    ) => ({ uuid, certificate, description, certificateUuid, history })
  ),
  receiveUpdateClient: createCustomAction(
    Actions.UpdateSuccess,
    (client: ClientDetails) => ({ client })
  ),
  failUpdateClient: createCustomAction(
    Actions.UpdateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  clients: Client[];
  isCreatingClient: boolean;
  isDeletingClient: boolean;
  isFetchingProfiles: boolean;
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isAuthorizingProfile: boolean;
  isEditing: boolean;
  confirmDeleteClient: string;
  selectedClient: ClientDetails | null;
  authorizedProfiles: string[];
};

export const initialState: State = {
  clients: [],
  isCreatingClient: false,
  isDeletingClient: false,
  isFetchingProfiles: false,
  isFetchingList: false,
  isFetchingDetail: false,
  isAuthorizingProfile: false,
  isEditing: false,
  confirmDeleteClient: "",
  selectedClient: null,
  authorizedProfiles: [],
};

function authorizedProfile(
  state: State,
  clientId: string,
  profileId: string
): State {
  if (state.selectedClient?.uuid !== clientId) {
    return {
      ...state,
      isAuthorizingProfile: false,
    };
  }

  return {
    ...state,
    authorizedProfiles: [...state.authorizedProfiles, profileId],
    isAuthorizingProfile: false,
  };
}

function optimisticUnauthorizeProfile(
  state: State,
  clientId: string,
  profileId: string
): State {
  if (state.selectedClient?.uuid !== clientId) {
    return state;
  }

  const authorizedProfiles = [...state.authorizedProfiles];
  const idx = authorizedProfiles.indexOf(profileId);
  if (idx >= 0) {
    authorizedProfiles.splice(idx, 1);
  }

  return { ...state, authorizedProfiles };
}

function unathorizeFailed(
  state: State,
  clientId: string,
  profileId: string
): State {
  if (state.selectedClient?.uuid === clientId) {
    return {
      ...state,
      authorizedProfiles: [...state.authorizedProfiles, profileId],
    };
  }

  return state;
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestCreateClient):
      return { ...state, isCreatingClient: true };
    case getType(actions.receiveCreateClient):
      return { ...state, isCreatingClient: false };
    case getType(actions.failCreateClient):
      return { ...state, isCreatingClient: false };
    case getType(actions.requestDeleteClient):
      return { ...state, isDeletingClient: true };
    case getType(actions.confirmDeleteClientRequest):
      return {
        ...state,
        confirmDeleteClient: action.uuid,
        isDeletingClient: true,
      };
    case getType(actions.cancelDeleteClient):
      return { ...state, confirmDeleteClient: "", isDeletingClient: false };
    case getType(actions.confirmDeleteClient):
      return { ...state, confirmDeleteClient: "" };
    case getType(actions.failDeleteClient):
      return { ...state, isDeletingClient: false };
    case getType(actions.receiveDeleteClient):
      return {
        ...state,
        isDeletingClient: false,
      };

    case getType(actions.requestBulkDeleteClient):
      return { ...state, isDeletingClient: true };
    case getType(actions.confirmBulkDeleteClientRequest):
      return {
        ...state,
        confirmDeleteClient: action.uuid,
        isDeletingClient: true,
      };
    case getType(actions.cancelBulkDeleteClient):
      return { ...state, confirmDeleteClient: "", isDeletingClient: false };
    case getType(actions.confirmBulkDeleteClient):
      return { ...state, confirmDeleteClient: "" };
    case getType(actions.failBulkDeleteClient):
      return { ...state, isDeletingClient: false };
    case getType(actions.receiveBulkDeleteClient):
      let updated: Client[] = [];
      for (let i of state.clients) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeletingClient: false,
        clients: updated,
      };

    case getType(actions.requestAuthorizedProfiles):
      return { ...state, authorizedProfiles: [], isFetchingProfiles: true };
    case getType(actions.receiveAuthorizedProfiles):
      return {
        ...state,
        authorizedProfiles: action.profiles,
        isFetchingProfiles: false,
      };
    case getType(actions.failAuthorizedProfiles):
      return { ...state, isFetchingProfiles: false };
    case getType(actions.requestClientDetail):
      return { ...state, selectedClient: null, isFetchingDetail: true };
    case getType(actions.receiveClientDetail):
      return { ...state, isFetchingDetail: false, selectedClient: action.data };
    case getType(actions.failClientDetail):
      return { ...state, isFetchingDetail: false };
    case getType(actions.requestClientsList):
      return { ...state, clients: [], isFetchingList: true };
    case getType(actions.receiveClientsList):
      return { ...state, isFetchingList: false, clients: action.clients };
    case getType(actions.failClientsList):
      return { ...state, isFetchingList: false };
    case getType(actions.requestAuthorizeProfile):
      return { ...state, isAuthorizingProfile: true };
    case getType(actions.receiveAuthorizeProfile):
      return authorizedProfile(state, action.clientId, action.profileId);
    case getType(actions.failAuthorizeProfile):
      return { ...state, isAuthorizingProfile: false };
    case getType(actions.requestUnauthorizeProfile):
      return optimisticUnauthorizeProfile(
        state,
        action.clientId,
        action.profileId
      );
    case getType(actions.failUnauthorizeProfile):
      return unathorizeFailed(state, action.clientId, action.profileId);
    case getType(actions.requestEnableClient):
      return { ...state, isEditing: true };
    case getType(actions.requestDisableClient):
      return { ...state, isEditing: true };
    case getType(actions.failEnableClient):
      return { ...state, isEditing: false };
    case getType(actions.failDisableClient):
      return { ...state, isEditing: false };
    case getType(actions.receiveEnableClient):
      let clientEnable = state.selectedClient || ({} as ClientDetails);
      clientEnable["enabled"] = true;
      return {
        ...state,
        isEditing: false,
        selectedClient: clientEnable,
      };
    case getType(actions.receiveDisableClient):
      let clientDisable = state.selectedClient || ({} as ClientDetails);
      clientDisable["enabled"] = false;
      return {
        ...state,
        isEditing: false,
        selectedClient: clientDisable,
      };

    case getType(actions.requestBulkEnableClient):
    case getType(actions.requestBulkDisableClient):
      return { ...state, isEditing: true };
    case getType(actions.failBulkEnableClient):
    case getType(actions.failBulkDisableClient):
      return { ...state, isEditing: false };
    case getType(actions.receiveBulkEnableClient):
      let updatedEnable: Client[] = [];
      for (let i of state.clients) {
        if (!action.uuid.includes(i.uuid)) {
          updatedEnable.push(i);
        } else {
          i.enabled = true;
          updatedEnable.push(i);
        }
      }
      return {
        ...state,
        isEditing: false,
        clients: updatedEnable,
      };
    case getType(actions.receiveBulkDisableClient):
      let updatedDisable: Client[] = [];
      for (let i of state.clients) {
        if (!action.uuid.includes(i.uuid)) {
          updatedDisable.push(i);
        } else {
          i.enabled = false;
          updatedDisable.push(i);
        }
      }
      return {
        ...state,
        isEditing: false,
        clients: updatedDisable,
      };

    case getType(actions.requestUpdateClient):
      return { ...state, isEditing: true };
    case getType(actions.receiveUpdateClient):
      return {
        ...state,
        isEditing: false,
        clients: arrayReducer(state.clients, action.client.uuid, (client) => ({
          ...client,
          clientDn: action.client.clientDn,
        })),
        selectedClient: action.client,
      };
    case getType(actions.failUpdateClient):
      return { ...state, isEditing: false };
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isAuthorizingProfile = createSelector(
  selectState,
  (state) => state.isAuthorizingProfile
);

const isCreatingClient = createSelector(
  selectState,
  (state) => state.isCreatingClient
);

const isDeletingClient = createSelector(
  selectState,
  (state) => state.isDeletingClient
);

const isEditing = createSelector(selectState, (state) => state.isEditing);

const isFetching = createSelector(
  selectState,
  (state) =>
    state.isFetchingList || state.isFetchingDetail || state.isFetchingProfiles
);

const selectAuthorizedProfileIds = createSelector(
  selectState,
  (state) => state.authorizedProfiles
);

const selectClients = createSelector(selectState, (state) => state.clients);

const selectSelectedClient = createSelector(
  selectState,
  (state) => state.selectedClient
);

const selectClientDetails = createSelector(
  selectClients,
  selectSelectedClient,
  selectAuthorizedProfileIds,
  (clients, selectedClient, authRaProfiles) => {
    if (!selectedClient) {
      return null;
    }

    const client = clients.find((c) => c.uuid === selectedClient.uuid);
    if (!client) {
      return null;
    }

    return {
      ...client,
      ...selectedClient,
      authRaProfiles,
    };
  }
);

const selectConfirmDeleteClientId = createSelector(
  selectState,
  (state) => state.confirmDeleteClient
);

export const selectors = {
  selectState,
  isAuthorizingProfile,
  isCreatingClient,
  isDeletingClient,
  isEditing,
  isFetching,
  selectAuthorizedProfiles: selectAuthorizedProfileIds,
  selectClients,
  selectClientDetails,
  selectConfirmDeleteClientId,
  selectSelectedClient,
};
