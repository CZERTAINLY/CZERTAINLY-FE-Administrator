import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import {
  Credential,
  CredentialDetails,
  CredentialProviders,
  ErrorDeleteObject,
} from "models";
import { arrayReducer, createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";
import { CredentialProviderAttributes } from "api/credentials";
import { functionGroupChecker } from "utils/commons";

export const statePath = "credentials";

export enum Actions {
  AuthorizeProfileRequest = "@@credentials/AUTHORIZE_REQUEST",
  AuthorizeProfileSuccess = "@@credentials/AUTHORIZE_SUCCESS",
  AuthorizeProfileFailure = "@@credentials/AUTHORIZE_FAILURE",
  AuthListRequest = "@@credentials/AUTH_LIST_REQUEST",
  AuthListSuccess = "@@credentials/AUTH_LIST_SUCCESS",
  AuthListFailure = "@@credentials/AUTH_LIST_FAILURE",
  DetailRequest = "@@credentials/DETAIL_REQUEST",
  DetailSuccess = "@@credentials/DETAIL_SUCCESS",
  DetailFailure = "@@credentials/DETAIL_FAILURE",
  ListRequest = "@@credentials/LIST_REQUEST",
  ListSuccess = "@@credentials/LIST_SUCCESS",
  ListFailure = "@@credentials/LIST_FAILURE",
  ProviderListRequest = "@@credentials/PROVIDER_LIST_REQUEST",
  ProviderListSuccess = "@@credentials/PROVIDER_LIST_SUCCESS",
  ProviderListFailure = "@@credentials/PROVIDER_LIST_FAILURE",
  ProviderListAttributeRequest = "@@credentials/PROVIDER_LIST_ATTRIBUTE_REQUEST",
  ProviderListAttributeSuccess = "@@credentials/PROVIDER_LIST_ATTRIBUTE_SUCCESS",
  ProviderListAttributeFailure = "@@credentials/PROVIDER_LIST_ATTRIBUTE_FAILURE",
  UnauthorizeRequest = "@@credentials/UNAUTHORIZE_REQUEST",
  UnauthorizeSuccess = "@@credentials/UNAUTHORIZE_SUCCESS",
  UnauthorizeFailure = "@@credentials/UNAUTHORIZE_FAILURE",
  CreateRequest = "@@credentials/CREATE_REQUEST",
  CreateSuccess = "@@credentials/CREATE_SUCCESS",
  CreateFailure = "@@credentials/CREATE_FAILURE",
  UpdateRequest = "@@credentials/UPDATE_REQUEST",
  UpdateSuccess = "@@credentials/UPDATE_SUCCESS",
  UpdateFailure = "@@credentials/UPDATE_FAILURE",

  DeleteRequest = "@@credentials/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@credentials/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@credentials/CONFIRM_DELETE",
  CancelDelete = "@@credentials/CANCEL_DELETE",
  DeleteSuccess = "@@credentials/DELETE_SUCCESS",
  DeleteFailure = "@@credentials/DELETE_FAILURE",

  ForceDeleteRequest = "@@credentials/FORCE_DELETE_REQUEST",
  ForceDeleteSuccess = "@@credentials/FORCE_DELETE_SUCCESS",
  ForceDeleteFailure = "@@credentials/FORCE_DELETE_FAILURE",
  ForceDeleteCancel = "@@credentials/FORCE_DELETE_CANCEL",

  BulkDeleteRequest = "@@credentials/BULK_DELETE_REQUEST",
  BulkConfirmDeleteRequest = "@@credentials/BULK_CONFIRM_DELETE_REQUEST",
  BulkConfirmDelete = "@@credentials/BULK_CONFIRM_DELETE",
  BulkCancelDelete = "@@credentials/BULK_CANCEL_DELETE",
  BulkDeleteSuccess = "@@credentials/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@credentials/BULK_DELETE_FAILURE",

  BulkForceDeleteRequest = "@@credentials/BULK_FORCE_DELETE_REQUEST",
  BulkForceDeleteSuccess = "@@credentials/BULK_FORCE_DELETE_SUCCESS",
  BulkForceDeleteFailure = "@@credentials/BULK_FORCE_DELETE_FAILURE",
  BulkForceDeleteCancel = "@@credentials/BULK_FORCE_DELETE_CANCEL",
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
  requestCredentialDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveCredentialDetail: createCustomAction(
    Actions.DetailSuccess,
    (data: CredentialDetails) => ({ data })
  ),
  failCredentialDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestCredentialsList: createCustomAction(Actions.ListRequest),
  receiveCredentialsList: createCustomAction(
    Actions.ListSuccess,
    (credentials: Credential[]) => ({ credentials })
  ),
  requestCredentialProviderList: createCustomAction(
    Actions.ProviderListRequest
  ),
  receiveCredentialProviderList: createCustomAction(
    Actions.ProviderListSuccess,
    (credentialProviders: CredentialProviders[]) => ({ credentialProviders })
  ),
  failCredentialProviderList: createCustomAction(
    Actions.ProviderListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestCredentialProviderAttributeList: createCustomAction(
    Actions.ProviderListAttributeRequest,
    (uuid: string, code: string, kind: string) => ({ uuid, code, kind })
  ),
  receiveCredentialProviderAttributeList: createCustomAction(
    Actions.ProviderListAttributeSuccess,
    (credentialProviderAttributes: CredentialProviderAttributes[]) => ({
      credentialProviderAttributes,
    })
  ),

  successCredentialProviderAttributeList: createCustomAction(
    Actions.ProviderListAttributeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  failCredentialsList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestAuthorizeProfile: createCustomAction(
    Actions.AuthorizeProfileRequest,
    (credentialId: string, profileId: string) => ({ credentialId, profileId })
  ),
  receiveAuthorizeProfile: createCustomAction(
    Actions.AuthorizeProfileSuccess,
    (credentialId: string, profileId: string) => ({ credentialId, profileId })
  ),
  failAuthorizeProfile: createCustomAction(
    Actions.AuthorizeProfileFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUnauthorizeProfile: createCustomAction(
    Actions.UnauthorizeRequest,
    (credentialId: string, profileId: string) => ({ credentialId, profileId })
  ),
  receiveUnauthorizeProfile: createCustomAction(
    Actions.UnauthorizeSuccess,
    (credentialId: string, profileId: string) => ({ credentialId, profileId })
  ),
  failUnauthorizeProfile: createCustomAction(
    Actions.UnauthorizeFailure,
    (credentialId: string, profileId: string, error?: string) =>
      createErrorAlertAction(error, { credentialId, profileId })
  ),
  requestCreateCredential: createCustomAction(
    Actions.CreateRequest,
    (
      name: string,
      credentialType: string,
      connectorUuid: string,
      attributes: any,
      history: History<unknown>
    ) => ({ name, credentialType, connectorUuid, attributes, history })
  ),
  receiveCreateCredential: createCustomAction(
    Actions.CreateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failCreateCredential: createCustomAction(
    Actions.CreateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUpdateCredential: createCustomAction(
    Actions.UpdateRequest,
    (
      uuid: string,
      name: string,
      credentialType: string,
      connectorUuid: string,
      attributes: any,
      history: History<unknown>
    ) => ({ uuid, name, credentialType, connectorUuid, attributes, history })
  ),
  receiveUpdateCredential: createCustomAction(
    Actions.UpdateSuccess,
    (credential: CredentialDetails) => ({ credential })
  ),
  failUpdateCredential: createCustomAction(
    Actions.UpdateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestDeleteCredential: createCustomAction(
    Actions.DeleteRequest,
    (uuid: number | string, history: History) => ({ uuid, history })
  ),
  confirmDeleteCredentialRequest: createCustomAction(
    Actions.ConfirmDeleteRequest,
    (uuid: number | string, history: History) => ({ uuid, history })
  ),
  confirmDeleteCredential: createCustomAction(
    Actions.ConfirmDelete,
    (uuid: number | string, history: History) => ({ uuid, history })
  ),
  cancelDeleteCredential: createCustomAction(Actions.CancelDelete),
  receiveDeleteCredential: createCustomAction(
    Actions.DeleteSuccess,
    (uuid: number | string, errorMessage: ErrorDeleteObject[]) => ({
      uuid,
      errorMessage,
    })
  ),
  failDeleteCredential: createCustomAction(
    Actions.DeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestForceDeleteCredential: createCustomAction(
    Actions.ForceDeleteRequest,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  recieveForceDeleteCredential: createCustomAction(
    Actions.ForceDeleteSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failForceDeleteCredential: createCustomAction(
    Actions.ForceDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelForceDeleteCredential: createCustomAction(Actions.ForceDeleteCancel),

  requestBulkDeleteCredential: createCustomAction(
    Actions.BulkDeleteRequest,
    (uuid: (number | string)[]) => ({ uuid })
  ),
  confirmBulkDeleteCredentialRequest: createCustomAction(
    Actions.BulkConfirmDeleteRequest,
    (uuid: (number | string)[]) => ({ uuid })
  ),
  confirmBulkDeleteCredential: createCustomAction(
    Actions.BulkConfirmDelete,
    (uuid: (number | string)[]) => ({ uuid })
  ),
  cancelBulkDeleteCredential: createCustomAction(Actions.BulkCancelDelete),
  receiveBulkDeleteCredential: createCustomAction(
    Actions.BulkDeleteSuccess,
    (uuid: (number | string)[], errorMessage: ErrorDeleteObject[]) => ({
      uuid,
      errorMessage,
    })
  ),
  failBulkDeleteCredential: createCustomAction(
    Actions.BulkDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkForceDeleteCredential: createCustomAction(
    Actions.BulkForceDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  recieveBulkForceDeleteCredential: createCustomAction(
    Actions.BulkForceDeleteSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkForceDeleteCredential: createCustomAction(
    Actions.BulkForceDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelBulkForceDeleteCredential: createCustomAction(
    Actions.BulkForceDeleteCancel
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  credentials: Credential[];
  credentialProviders: CredentialProviders[];
  credentialProviderAttributes: CredentialProviderAttributes[];
  isCreatingCredential: boolean;
  isDeletingCredential: boolean;
  isFetchingAttributes: boolean;
  isFetchingProfiles: boolean;
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isAuthorizingProfile: boolean;
  isEditing: boolean;
  confirmDeleteCredential: string;
  selectedCredential: CredentialDetails | null;
  selectCredentialConnectorUuid: string;
  deleteCredentialErrors: ErrorDeleteObject[];
};

export const initialState: State = {
  credentials: [],
  credentialProviders: [],
  credentialProviderAttributes: [],
  isCreatingCredential: false,
  isDeletingCredential: false,
  isFetchingAttributes: false,
  isFetchingProfiles: false,
  isFetchingList: false,
  isFetchingDetail: false,
  isAuthorizingProfile: false,
  isEditing: false,
  confirmDeleteCredential: "",
  selectedCredential: null,
  selectCredentialConnectorUuid: "",
  deleteCredentialErrors: [],
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestDeleteCredential):
      return { ...state, isDeletingCredential: true };
    case getType(actions.confirmDeleteCredentialRequest):
      return { ...state, confirmDeleteCredential: action.uuid };
    case getType(actions.cancelDeleteCredential):
      return {
        ...state,
        confirmDeleteCredential: "",
        isDeletingCredential: false,
      };
    case getType(actions.confirmDeleteCredential):
      return { ...state, confirmDeleteCredential: "" };
    case getType(actions.failDeleteCredential):
      return { ...state, isDeletingCredential: false };
    case getType(actions.receiveDeleteCredential):
      return {
        ...state,
        deleteCredentialErrors: action.errorMessage,
        isDeletingCredential: false,
      };

    case getType(actions.requestBulkDeleteCredential):
      return { ...state, isDeletingCredential: true };
    case getType(actions.confirmBulkDeleteCredentialRequest):
      return { ...state, confirmDeleteCredential: action.uuid };
    case getType(actions.cancelBulkDeleteCredential):
      return {
        ...state,
        confirmDeleteCredential: "",
        isDeletingCredential: false,
      };
    case getType(actions.confirmBulkDeleteCredential):
      return { ...state, confirmDeleteCredential: "" };
    case getType(actions.failBulkDeleteCredential):
      return { ...state, isDeletingCredential: false };
    case getType(actions.receiveBulkDeleteCredential):
      let upd: Credential[] = [];
      const failedDelete: (string | number)[] = action.errorMessage.map(
        function (conn: ErrorDeleteObject) {
          return conn.uuid;
        }
      );
      for (let i of state.credentials) {
        if (action.uuid.includes(i.uuid) && failedDelete.includes(i.uuid)) {
          upd.push(i);
        } else if (!action.uuid.includes(i.uuid)) {
          upd.push(i);
        }
      }
      return {
        ...state,
        deleteCredentialErrors: action.errorMessage,
        isDeletingCredential: false,
        credentials: upd,
      };

    case getType(actions.requestCreateCredential):
      return { ...state, isCreatingCredential: true };
    case getType(actions.receiveCreateCredential):
      return { ...state, isCreatingCredential: false };
    case getType(actions.failCreateCredential):
      return { ...state, isCreatingCredential: false };
    case getType(actions.requestCredentialDetail):
      return {
        ...state,
        selectedCredential: null,
        isFetchingDetail: true,
        selectCredentialConnectorUuid: "",
      };
    case getType(actions.receiveCredentialDetail):
      return {
        ...state,
        isFetchingDetail: false,
        selectedCredential: action.data,
        selectCredentialConnectorUuid: action.data.connectorUuid,
      };
    case getType(actions.failCredentialDetail):
      return { ...state, isFetchingDetail: false };
    case getType(actions.requestCredentialsList):
      return { ...state, credentials: [], isFetchingList: true };
    case getType(actions.receiveCredentialsList):
      return {
        ...state,
        isFetchingList: false,
        credentials: action.credentials,
      };

    case getType(actions.requestCredentialProviderList):
      return {
        ...state,
        credentialProviders: [],
      };
    case getType(actions.receiveCredentialProviderList):
      const providers: any = [];
      for (let i of action.credentialProviders) {
        if (functionGroupChecker("credentialProvider", i.functionGroups)) {
          providers.push(i);
        }
      }
      return {
        ...state,
        credentialProviders: providers,
      };
    case getType(actions.requestCredentialProviderAttributeList):
      return {
        ...state,
        credentialProviderAttributes: [],
        isFetchingAttributes: true,
      };
    case getType(actions.receiveCredentialProviderAttributeList):
      return {
        ...state,
        isFetchingAttributes: false,
        credentialProviderAttributes: action.credentialProviderAttributes,
      };
    case getType(actions.failCredentialsList):
      return { ...state, isFetchingList: false, isFetchingAttributes: false };
    case getType(actions.requestAuthorizeProfile):
      return { ...state, isAuthorizingProfile: true };
    case getType(actions.requestUpdateCredential):
      return { ...state, isEditing: true };
    case getType(actions.receiveUpdateCredential):
      return {
        ...state,
        isEditing: false,
        credentials: arrayReducer(
          state.credentials,
          action.credential.uuid,
          (credential) => ({
            ...credential,
            credentialDn: action.credential.credentialDn,
          })
        ),
        selectedCredential: action.credential,
      };
    case getType(actions.failUpdateCredential):
      return { ...state, isEditing: false };

    case getType(actions.requestForceDeleteCredential):
      return { ...state, isDeletingCredential: true };
    case getType(actions.cancelForceDeleteCredential):
      return {
        ...state,
        isDeletingCredential: false,
        deleteCredentialErrors: [],
      };
    case getType(actions.recieveForceDeleteCredential):
      return {
        ...state,
        isDeletingCredential: false,
        deleteCredentialErrors: [],
      };
    case getType(actions.failForceDeleteCredential):
      return { ...state, isDeletingCredential: false };

    case getType(actions.requestBulkForceDeleteCredential):
      return { ...state, isDeletingCredential: true };
    case getType(actions.cancelBulkForceDeleteCredential):
      return {
        ...state,
        isDeletingCredential: false,
        deleteCredentialErrors: [],
      };
    case getType(actions.recieveBulkForceDeleteCredential):
      let updated: Credential[] = [];
      for (let i of state.credentials) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeletingCredential: false,
        deleteCredentialErrors: [],
        credentials: updated,
      };
    case getType(actions.failBulkForceDeleteCredential):
      return { ...state, isDeletingCredential: false };

    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isAuthorizingProfile = createSelector(
  selectState,
  (state) => state.isAuthorizingProfile
);

const isCreatingCredential = createSelector(
  selectState,
  (state) => state.isCreatingCredential
);

const isDeletingCredential = createSelector(
  selectState,
  (state) => state.isDeletingCredential
);

const isEditing = createSelector(selectState, (state) => state.isEditing);

const isFetchingAttributes = createSelector(
  selectState,
  (state) => state.isFetchingAttributes
);

const isFetching = createSelector(
  selectState,
  (state) => state.isFetchingList || state.isFetchingDetail
);

const selectCredentials = createSelector(
  selectState,
  (state) => state.credentials
);

const selectCredentialProviders = createSelector(
  selectState,
  (state) => state.credentialProviders
);

const selectCredentialProviderAttributes = createSelector(
  selectState,
  (state) => state.credentialProviderAttributes
);

const selectSelectedCredential = createSelector(
  selectState,
  (state) => state.selectedCredential
);

const selectCredentialDetails = createSelector(
  selectState,
  (state) => state.selectedCredential
);

const selectConfirmDeleteCredentialId = createSelector(
  selectState,
  (state) => state.confirmDeleteCredential
);

const selectCredentialConnectorId = createSelector(
  selectState,
  (state) => state.selectCredentialConnectorUuid
);

const selectDeleteCredentialError = createSelector(
  selectState,
  (state) => state.deleteCredentialErrors
);

export const selectors = {
  selectState,
  isAuthorizingProfile,
  isCreatingCredential,
  isDeletingCredential,
  isEditing,
  isFetchingAttributes,
  isFetching,
  selectCredentials,
  selectCredentialProviders,
  selectCredentialProviderAttributes,
  selectSelectedCredential,
  selectCredentialDetails,
  selectCredentialConnectorId,
  selectConfirmDeleteCredentialId,
  selectDeleteCredentialError,
};
