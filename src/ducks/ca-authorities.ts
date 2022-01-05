import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import {
  Authority,
  AuthorityDetails,
  AuthorityProviders,
  ErrorDeleteObject,
} from "models";
import { arrayReducer, createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";
import { AuthorityProviderAttributes } from "api/authorities";
import { functionGroupChecker } from "utils/commons";

export const statePath = "authorities";

export enum Actions {
  DetailRequest = "@@authorities/DETAIL_REQUEST",
  DetailSuccess = "@@authorities/DETAIL_SUCCESS",
  DetailFailure = "@@authorities/DETAIL_FAILURE",
  ListRequest = "@@authorities/LIST_REQUEST",
  ListSuccess = "@@authorities/LIST_SUCCESS",
  ListFailure = "@@authorities/LIST_FAILURE",
  ProviderListRequest = "@@authorities/PROVIDER_LIST_REQUEST",
  ProviderListSuccess = "@@authorities/PROVIDER_LIST_SUCCESS",
  ProviderListFailure = "@@authorities/PROVIDER_LIST_FAILURE",
  ProviderListAttributeRequest = "@@authorities/PROVIDER_LIST_ATTRIBUTE_REQUEST",
  ProviderListAttributeSuccess = "@@authorities/PROVIDER_LIST_ATTRIBUTE_SUCCESS",
  ProviderListAttributeFailure = "@@authorities/PROVIDER_LIST_ATTRIBUTE_FAILURE",
  CreateRequest = "@@authorities/CREATE_REQUEST",
  CreateSuccess = "@@authorities/CREATE_SUCCESS",
  CreateFailure = "@@authorities/CREATE_FAILURE",
  UpdateRequest = "@@authorities/UPDATE_REQUEST",
  UpdateSuccess = "@@authorities/UPDATE_SUCCESS",
  UpdateFailure = "@@authorities/UPDATE_FAILURE",
  DeleteBulkRequest = "@@authorities/DELETE_BULK_REQUEST",

  ConfirmBulkDeleteRequest = "@@authorities/CONFIRM_BULK_DELETE_REQUEST",
  ConfirmBulkDelete = "@@authorities/CONFIRM_BULK_DELETE",
  CancelBulkDelete = "@@authorities/CANCEL_BULK_DELETE",
  DeleteBulkSuccess = "@@authorities/DELETE_BULK_SUCCESS",
  DeleteBulkFailure = "@@authorities/DELETE_BULK_FAILURE",

  DeleteRequest = "@@authorities/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@authorities/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@authorities/CONFIRM_DELETE",
  CancelDelete = "@@authorities/CANCEL_DELETE",
  DeleteSuccess = "@@authorities/DELETE_SUCCESS",
  DeleteFailure = "@@authorities/DELETE_FAILURE",

  ForceDeleteRequest = "@@authorities/FORCE_DELETE_REQUEST",
  ForceDeleteSuccess = "@@authorities/FORCE_DELETE_SUCCESS",
  ForceDeleteFailure = "@@authorities/FORCE_DELETE_FAILURE",
  ForceDeleteCancel = "@@authorities/FORCE_DELETE_CANCEL",

  BulkForceDeleteRequest = "@@authorities/BULK_FORCE_DELETE_REQUEST",
  BulkForceDeleteSuccess = "@@authorities/BULK_FORCE_DELETE_SUCCESS",
  BulkForceDeleteFailure = "@@authorities/BULK_FORCE_DELETE_FAILURE",
  BulkForceDeleteCancel = "@@authorities/BULK_FORCE_DELETE_CANCEL",
}
export const actions = {
  requestAuthorityDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveAuthorityDetail: createCustomAction(
    Actions.DetailSuccess,
    (data: AuthorityDetails) => ({ data })
  ),
  failAuthorityDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestAuthoritiesList: createCustomAction(Actions.ListRequest),
  receiveAuthoritiesList: createCustomAction(
    Actions.ListSuccess,
    (authorities: Authority[]) => ({ authorities })
  ),
  requestAuthorityProviderList: createCustomAction(Actions.ProviderListRequest),
  receiveAuthorityProviderList: createCustomAction(
    Actions.ProviderListSuccess,
    (authorityProviders: AuthorityProviders[]) => ({ authorityProviders })
  ),
  failAuthorityProviderList: createCustomAction(
    Actions.ProviderListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestAuthorityProviderAttributeList: createCustomAction(
    Actions.ProviderListAttributeRequest,
    (uuid: string, kind: string, functionGroup: string) => ({
      uuid,
      kind,
      functionGroup,
    })
  ),
  receiveAuthorityProviderAttributeList: createCustomAction(
    Actions.ProviderListAttributeSuccess,
    (authorityProviderAttributes: AuthorityProviderAttributes[]) => ({
      authorityProviderAttributes,
    })
  ),

  successAuthorityProviderAttributeList: createCustomAction(
    Actions.ProviderListAttributeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  failAuthoritiesList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestCreateAuthority: createCustomAction(
    Actions.CreateRequest,
    (
      name: string,
      connectorUuid: string,
      credential: any,
      status: string,
      attributes: any,
      kind: string,
      history: History<unknown>
    ) => ({
      name,
      connectorUuid,
      credential,
      status,
      attributes,
      kind,
      history,
    })
  ),
  receiveCreateAuthority: createCustomAction(
    Actions.CreateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failCreateAuthority: createCustomAction(
    Actions.CreateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUpdateAuthority: createCustomAction(
    Actions.UpdateRequest,
    (
      uuid: string,
      name: string,
      connectorUuid: string,
      credential: any,
      status: string,
      attributes: any,
      kind: string,
      history: History<unknown>
    ) => ({
      uuid,
      name,
      connectorUuid,
      credential,
      status,
      attributes,
      kind,
      history,
    })
  ),
  receiveUpdateAuthority: createCustomAction(
    Actions.UpdateSuccess,
    (authority: AuthorityDetails) => ({ authority })
  ),
  failUpdateAuthority: createCustomAction(
    Actions.UpdateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestDeleteAuthority: createCustomAction(
    Actions.DeleteRequest,
    (uuid: string | number) => ({ uuid })
  ),
  confirmDeleteAuthorityRequest: createCustomAction(
    Actions.ConfirmDeleteRequest,
    (uuid: string | number) => ({ uuid })
  ),
  confirmDeleteAuthority: createCustomAction(
    Actions.ConfirmDelete,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  cancelDeleteAuthority: createCustomAction(Actions.CancelDelete),
  receiveDeleteAuthority: createCustomAction(
    Actions.DeleteSuccess,
    (uuid: string | number, errorMessage: ErrorDeleteObject[]) => ({
      uuid,
      errorMessage,
    })
  ),
  failDeleteAuthority: createCustomAction(
    Actions.DeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkDeleteAuthority: createCustomAction(
    Actions.DeleteBulkRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkDeleteAuthorityRequest: createCustomAction(
    Actions.ConfirmBulkDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkDeleteAuthority: createCustomAction(
    Actions.ConfirmBulkDelete,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  cancelBulkDeleteAuthority: createCustomAction(Actions.CancelBulkDelete),
  receiveBulkDeleteAuthority: createCustomAction(
    Actions.DeleteBulkSuccess,
    (uuid: (string | number)[], errorMessage: ErrorDeleteObject[]) => ({
      uuid,
      errorMessage,
    })
  ),
  failBulkDeleteAuthority: createCustomAction(
    Actions.DeleteBulkFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestForceDeleteAuthority: createCustomAction(
    Actions.ForceDeleteRequest,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  recieveForceDeleteAuthority: createCustomAction(
    Actions.ForceDeleteSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failForceDeleteAuthority: createCustomAction(
    Actions.ForceDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelForceDeleteAuthority: createCustomAction(Actions.ForceDeleteCancel),

  requestBulkForceDeleteAuthority: createCustomAction(
    Actions.BulkForceDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  recieveBulkForceDeleteAuthority: createCustomAction(
    Actions.BulkForceDeleteSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkForceDeleteAuthority: createCustomAction(
    Actions.BulkForceDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  cancelBulkForceDeleteAuthority: createCustomAction(
    Actions.BulkForceDeleteCancel
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  authorities: Authority[];
  authorityProviders: AuthorityProviders[];
  authorityProviderAttributes: AuthorityProviderAttributes[];
  isCreatingAuthority: boolean;
  isDeletingAuthority: boolean;
  isFetchingProfiles: boolean;
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isFetchingAttributes: boolean;
  isEditing: boolean;
  confirmDeleteAuthority: string;
  selectedAuthority: AuthorityDetails | null;
  selectAuthorityConnectorUuid: string;
  selectAuthorityCredentialUuid: string;
  selectAuthorityCredentialName: string;
  deleteAuthorityErrors: ErrorDeleteObject[];
};

export const initialState: State = {
  authorities: [],
  authorityProviders: [],
  authorityProviderAttributes: [],
  isCreatingAuthority: false,
  isDeletingAuthority: false,
  isFetchingProfiles: false,
  isFetchingList: false,
  isFetchingDetail: false,
  isFetchingAttributes: false,
  isEditing: false,
  confirmDeleteAuthority: "",
  selectedAuthority: null,
  selectAuthorityConnectorUuid: "",
  selectAuthorityCredentialUuid: "",
  selectAuthorityCredentialName: "",
  deleteAuthorityErrors: [],
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestDeleteAuthority):
      return { ...state, isDeletingAuthority: true };
    case getType(actions.confirmDeleteAuthorityRequest):
      return { ...state, confirmDeleteAuthority: action.uuid };
    case getType(actions.cancelDeleteAuthority):
      return {
        ...state,
        confirmDeleteAuthority: "",
        isDeletingAuthority: false,
      };
    case getType(actions.confirmDeleteAuthority):
      return { ...state, confirmDeleteAuthority: "" };
    case getType(actions.failDeleteAuthority):
      return { ...state, isDeletingAuthority: false };
    case getType(actions.receiveDeleteAuthority):
      return {
        ...state,
        deleteAuthorityErrors: action.errorMessage,
        isDeletingAuthority: false,
      };

    case getType(actions.requestBulkDeleteAuthority):
      return { ...state, isDeletingAuthority: true };
    case getType(actions.confirmBulkDeleteAuthorityRequest):
      return { ...state, confirmDeleteAuthority: action.uuid };
    case getType(actions.cancelBulkDeleteAuthority):
      return {
        ...state,
        confirmDeleteAuthority: "",
        isDeletingAuthority: false,
      };
    case getType(actions.confirmBulkDeleteAuthority):
      return { ...state, confirmDeleteAuthority: "" };
    case getType(actions.failBulkDeleteAuthority):
      return { ...state, isDeletingAuthority: false };
    case getType(actions.receiveBulkDeleteAuthority):
      let upd: Authority[] = [];
      const failedDelete: (string | number)[] = action.errorMessage.map(
        function (conn: ErrorDeleteObject) {
          return conn.uuid;
        }
      );
      for (let i of state.authorities) {
        if (action.uuid.includes(i.uuid) && failedDelete.includes(i.uuid)) {
          upd.push(i);
        } else if (!action.uuid.includes(i.uuid)) {
          upd.push(i);
        }
      }
      return {
        ...state,
        deleteAuthorityErrors: action.errorMessage,
        isDeletingAuthority: false,
        authorities: upd,
      };

    case getType(actions.requestCreateAuthority):
      return { ...state, isCreatingAuthority: true };
    case getType(actions.receiveCreateAuthority):
      return { ...state, isCreatingAuthority: false };
    case getType(actions.failCreateAuthority):
      return { ...state, isCreatingAuthority: false };
    case getType(actions.requestAuthorityDetail):
      return { ...state, selectedAuthority: null, isFetchingDetail: true };
    case getType(actions.receiveAuthorityDetail):
      return {
        ...state,
        isFetchingDetail: false,
        selectedAuthority: action.data,
        selectAuthorityConnectorUuid: action.data.connectorUuid,
        selectAuthorityCredentialUuid: action.data?.credential?.uuid,
        selectAuthorityCredentialName: action.data?.credential?.name,
      };
    case getType(actions.failAuthorityDetail):
      return { ...state, isFetchingDetail: false };
    case getType(actions.requestAuthoritiesList):
      return {
        ...state,
        authorities: [],
        isFetchingList: true,
        selectedAuthority: null,
        selectAuthorityConnectorUuid: "",
        selectAuthorityCredentialUuid: "",
        selectAuthorityCredentialName: "",
      };
    case getType(actions.receiveAuthoritiesList):
      return {
        ...state,
        isFetchingList: false,
        authorities: action.authorities,
      };

    case getType(actions.requestAuthorityProviderList):
      return { ...state, authorityProviders: [] };
    case getType(actions.receiveAuthorityProviderList):
      const providers: any = [];
      for (let i of action.authorityProviders) {
        if (
          functionGroupChecker("authorityProvider", i.functionGroups) ||
          functionGroupChecker("legacyAuthorityProvider", i.functionGroups)
        ) {
          providers.push(i);
        }
      }
      return {
        ...state,
        authorityProviders: providers,
      };
    case getType(actions.requestAuthorityProviderAttributeList):
      return {
        ...state,
        isFetchingAttributes: true,
        authorityProviderAttributes: [],
      };
    case getType(actions.receiveAuthorityProviderAttributeList):
      return {
        ...state,
        isFetchingAttributes: false,
        authorityProviderAttributes: action.authorityProviderAttributes,
      };
    case getType(actions.failAuthoritiesList):
      return { ...state, isFetchingAttributes: false, isFetchingList: false };
    case getType(actions.requestUpdateAuthority):
      return { ...state, isEditing: true };
    case getType(actions.receiveUpdateAuthority):
      return {
        ...state,
        isEditing: false,
        authorities: arrayReducer(
          state.authorities,
          action.authority.uuid,
          (authority) => ({
            ...authority,
            authorityDn: action.authority.authorityDn,
          })
        ),
        selectedAuthority: action.authority,
      };
    case getType(actions.failUpdateAuthority):
      return { ...state, isEditing: false };

    case getType(actions.requestForceDeleteAuthority):
      return { ...state, isDeletingAuthority: true };
    case getType(actions.cancelForceDeleteAuthority):
      return {
        ...state,
        isDeletingAuthority: false,
        deleteAuthorityErrors: [],
      };
    case getType(actions.recieveForceDeleteAuthority):
      return {
        ...state,
        isDeletingAuthority: false,
        deleteAuthorityErrors: [],
      };
    case getType(actions.failForceDeleteAuthority):
      return { ...state, isDeletingAuthority: false };

    case getType(actions.requestBulkForceDeleteAuthority):
      return { ...state, isDeletingAuthority: true };
    case getType(actions.cancelBulkForceDeleteAuthority):
      return {
        ...state,
        isDeletingAuthority: false,
        deleteAuthorityErrors: [],
      };
    case getType(actions.recieveBulkForceDeleteAuthority):
      let updated: Authority[] = [];
      for (let i of state.authorities) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeletingAuthority: false,
        deleteAuthorityErrors: [],
        authorities: updated,
      };
    case getType(actions.failBulkForceDeleteAuthority):
      return { ...state, isDeletingAuthority: false };

    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isCreatingAuthority = createSelector(
  selectState,
  (state) => state.isCreatingAuthority
);

const isDeletingAuthority = createSelector(
  selectState,
  (state) => state.isDeletingAuthority
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

const selectAuthorities = createSelector(
  selectState,
  (state) => state.authorities
);

const selectAuthorityProviders = createSelector(
  selectState,
  (state) => state.authorityProviders
);

const selectAuthorityProviderAttributes = createSelector(
  selectState,
  (state) => state.authorityProviderAttributes
);

const selectSelectedAuthority = createSelector(
  selectState,
  (state) => state.selectedAuthority
);

const selectAuthorityDetails = createSelector(
  selectState,
  (state) => state.selectedAuthority
);

const selectConfirmDeleteAuthorityId = createSelector(
  selectState,
  (state) => state.confirmDeleteAuthority
);

const selectAuthorityConnectorId = createSelector(
  selectState,
  (state) => state.selectAuthorityConnectorUuid
);

const selectAuthorityCredentialId = createSelector(
  selectState,
  (state) => state.selectAuthorityCredentialUuid
);

const selectAuthorityCredentialName = createSelector(
  selectState,
  (state) => state.selectAuthorityCredentialName
);

const selectDeleteAuthorityError = createSelector(
  selectState,
  (state) => state.deleteAuthorityErrors
);

export const selectors = {
  selectState,
  isCreatingAuthority,
  isDeletingAuthority,
  isEditing,
  isFetching,
  isFetchingAttributes,
  selectAuthorities,
  selectAuthorityProviders,
  selectAuthorityProviderAttributes,
  selectSelectedAuthority,
  selectAuthorityDetails,
  selectAuthorityConnectorId,
  selectConfirmDeleteAuthorityId,
  selectAuthorityCredentialId,
  selectAuthorityCredentialName,
  selectDeleteAuthorityError,
};
