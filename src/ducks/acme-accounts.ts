import {
  AcmeAccountDetailResponse,
  AcmeAccountListResponse,
} from "api/acme-account";
import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import { createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";

export const statePath = "acmeAccounts";

export enum Actions {
  ListRequest = "@@acmeaccounts/LIST_REQUEST",
  ListSuccess = "@@acmeaccounts/LIST_SUCCESS",
  ListFailure = "@@acmeaccounts/LIST_FAILURE",
  DeleteRequest = "@@acmeaccounts/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@acmeaccounts/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@acmeaccounts/CONFIRM_DELETE",
  CancelDelete = "@@acmeaccounts/CANCEL_DELETE",
  DeleteSuccess = "@@acmeaccounts/DELETE_SUCCESS",
  DeleteFailure = "@@acmeaccounts/DELETE_FAILURE",
  DisableRequest = "@@acmeaccounts/DISABLE_REQUEST",
  EnableRequest = "@@acmeaccounts/ENABLE_REQUEST",
  EnableSuccess = "@@acmeaccounts/ENABLE_SUCCESS",
  EnableFailure = "@@acmeaccounts/ENABLE_FAILURE",
  DisableSuccess = "@@acmeaccounts/DISABLE_SUCCESS",
  DisableFailure = "@@acmeaccounts/DISABLE_FAILURE",

  BulkDeleteRequest = "@@acmeaccounts/BULK_DELETE_REQUEST",
  BulkConfirmDeleteRequest = "@@acmeaccounts/BULK_CONFIRM_DELETE_REQUEST",
  BulkConfirmDelete = "@@acmeaccounts/BULK_CONFIRM_DELETE",
  BulkCancelDelete = "@@acmeaccounts/BULK_CANCEL_DELETE",
  BulkDeleteSuccess = "@@acmeaccounts/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@acmeaccounts/BULK_DELETE_FAILURE",
  BulkDisableRequest = "@@acmeaccounts/BULK_DISABLE_REQUEST",
  BulkEnableRequest = "@@acmeaccounts/BULK_ENABLE_REQUEST",
  BulkEnableSuccess = "@@acmeaccounts/BULK_ENABLE_SUCCESS",
  BulkEnableFailure = "@@acmeaccounts/BULK_ENABLE_FAILURE",
  BulkDisableSuccess = "@@acmeaccounts/BULK_DISABLE_SUCCESS",
  BulkDisableFailure = "@@acmeaccounts/BULK_DISABLE_FAILURE",

  DetailRequest = "@@acmeaccounts/DETAIL_REQUEST",
  DetailSuccess = "@@acmeaccounts/DETAIL_SUCCESS",
  DetailFailure = "@@acmeaccounts/DETAIL_FAILURE",
}

export const actions = {
  requestAcmeAccountList: createCustomAction(Actions.ListRequest),
  receiveAcmeAccountList: createCustomAction(
    Actions.ListSuccess,
    (accounts: AcmeAccountListResponse[]) => ({ accounts })
  ),
  failAcmeAccountList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestDeleteAccount: createCustomAction(
    Actions.DeleteRequest,
    (uuid: string | number) => ({ uuid })
  ),
  confirmDeleteAccountRequest: createCustomAction(
    Actions.ConfirmDeleteRequest,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  confirmDeleteAccount: createCustomAction(
    Actions.ConfirmDelete,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  cancelDeleteAccount: createCustomAction(Actions.CancelDelete),
  receiveDeleteAccount: createCustomAction(
    Actions.DeleteSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failDeleteAccount: createCustomAction(
    Actions.DeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestEnableAccount: createCustomAction(
    Actions.EnableRequest,
    (uuid: string | number) => ({ uuid })
  ),
  receiveEnableAccount: createCustomAction(
    Actions.EnableSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failEnableAccount: createCustomAction(
    Actions.EnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestDisableAccount: createCustomAction(
    Actions.DisableRequest,
    (uuid: string | number) => ({ uuid })
  ),
  receiveDisableAccount: createCustomAction(
    Actions.DisableSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failDisableAccount: createCustomAction(
    Actions.DisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkDeleteAccount: createCustomAction(
    Actions.BulkDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkDeleteAccountRequest: createCustomAction(
    Actions.BulkConfirmDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkDeleteAccount: createCustomAction(
    Actions.BulkConfirmDelete,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  cancelBulkDeleteAccount: createCustomAction(Actions.BulkCancelDelete),
  receiveBulkDeleteAccount: createCustomAction(
    Actions.BulkDeleteSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkDeleteAccount: createCustomAction(
    Actions.BulkDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkEnableAccount: createCustomAction(
    Actions.BulkEnableRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  receiveBulkEnableAccount: createCustomAction(
    Actions.BulkEnableSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkEnableAccount: createCustomAction(
    Actions.BulkEnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkDisableAccount: createCustomAction(
    Actions.BulkDisableRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  receiveBulkDisableAccount: createCustomAction(
    Actions.BulkDisableSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkDisableAccount: createCustomAction(
    Actions.BulkDisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestAccountDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveAccountDetail: createCustomAction(
    Actions.DetailSuccess,
    (profile: AcmeAccountDetailResponse) => ({ profile })
  ),
  failAccountDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isDeleting: boolean;
  accounts: AcmeAccountListResponse[];
  selectedAccount: AcmeAccountDetailResponse | null;
  confirmDeleteAccount: string;
};

export const initialState: State = {
  isFetchingList: false,
  isFetchingDetail: false,
  isDeleting: false,
  accounts: [],
  selectedAccount: null,
  confirmDeleteAccount: "",
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestAcmeAccountList):
      return { ...state, accounts: [], isFetchingList: true };
    case getType(actions.receiveAcmeAccountList):
      return { ...state, accounts: action.accounts, isFetchingList: false };
    case getType(actions.failAcmeAccountList):
      return { ...state, isFetchingList: false };
    case getType(actions.requestAccountDetail):
      return { ...state, isFetchingDetail: true, selectedAccount: null };
    case getType(actions.receiveAccountDetail):
      return {
        ...state,
        isFetchingDetail: false,
        selectedAccount: action.profile,
      };
    case getType(actions.failAccountDetail):
      return { ...state, isFetchingDetail: false };

    case getType(actions.requestDeleteAccount):
      return { ...state, isDeleting: true };
    case getType(actions.confirmDeleteAccountRequest):
      return { ...state, confirmDeleteAccount: action.uuid, isDeleting: true };
    case getType(actions.cancelDeleteAccount):
      return { ...state, confirmDeleteAccount: "", isDeleting: false };
    case getType(actions.confirmDeleteAccount):
      return { ...state, confirmDeleteAccount: "", isDeleting: true };
    case getType(actions.failDeleteAccount):
      return { ...state, isDeleting: false };
    case getType(actions.receiveDeleteAccount):
      return {
        ...state,
        isDeleting: false,
      };
    case getType(actions.requestEnableAccount):
    case getType(actions.requestDisableAccount):
      return { ...state };
    case getType(actions.failEnableAccount):
    case getType(actions.failDisableAccount):
      return { ...state };
    case getType(actions.receiveEnableAccount):
      debugger;
      let detailEnable =
        state.selectedAccount || ({} as AcmeAccountDetailResponse);
      detailEnable["enabled"] = true;
      return {
        ...state,
        isFetchingDetail: false,
        selectedAccount: detailEnable,
      };
    case getType(actions.receiveDisableAccount):
      debugger;
      let detailDisable =
        state.selectedAccount || ({} as AcmeAccountDetailResponse);
      detailDisable["enabled"] = false;
      return {
        ...state,
        isFetchingDetail: false,
        selectedAccount: detailDisable,
      };

    case getType(actions.requestBulkDeleteAccount):
      return { ...state, isDeleting: true };
    case getType(actions.confirmBulkDeleteAccountRequest):
      return { ...state, confirmDeleteAccount: action.uuid, isDeleting: true };
    case getType(actions.cancelBulkDeleteAccount):
      return { ...state, confirmDeleteAccount: "", isDeleting: false };
    case getType(actions.confirmBulkDeleteAccount):
      return { ...state, confirmDeleteAccount: "", isDeleting: true };
    case getType(actions.failBulkDeleteAccount):
      return { ...state, isDeleting: false };
    case getType(actions.receiveBulkDeleteAccount):
      let updated: AcmeAccountListResponse[] = [];
      for (let i of state.accounts) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeleting: false,
        accounts: updated,
      };
    case getType(actions.requestBulkEnableAccount):
    case getType(actions.requestBulkDisableAccount):
      return { ...state };
    case getType(actions.failBulkEnableAccount):
    case getType(actions.failBulkDisableAccount):
      return { ...state };
    case getType(actions.receiveBulkEnableAccount):
      let updatedEnable: AcmeAccountListResponse[] = [];
      for (let i of state.accounts) {
        if (!action.uuid.includes(i.uuid)) {
          updatedEnable.push(i);
        } else {
          i.enabled = true;
          updatedEnable.push(i);
        }
      }
      return {
        ...state,
        accounts: updatedEnable,
      };
    case getType(actions.receiveBulkDisableAccount):
      let updatedDisable: AcmeAccountListResponse[] = [];
      for (let i of state.accounts) {
        if (!action.uuid.includes(i.uuid)) {
          updatedDisable.push(i);
        } else {
          i.enabled = false;
          updatedDisable.push(i);
        }
      }
      return {
        ...state,
        accounts: updatedDisable,
      };
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isFetching = createSelector(
  selectState,
  (state) => state.isFetchingList || state.isFetchingDetail
);

const isDeleting = createSelector(selectState, (state) => state.isDeleting);

const selectAccounts = createSelector(selectState, (state) => state.accounts);

const selectSelectedAccount = createSelector(
  selectState,
  (state) => state.selectedAccount
);

const selectConfirmDeleteAccountId = createSelector(
  selectState,
  (state) => state.confirmDeleteAccount
);

export const selectors = {
  selectState,
  isDeleting,
  isFetching,
  selectAccounts,
  selectSelectedAccount,
  selectConfirmDeleteAccountId,
};
