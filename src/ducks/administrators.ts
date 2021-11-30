import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import { Administrator, AdministratorDetail } from "models";
import { arrayReducer, createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";

export const statePath = "administrators";

export enum Actions {
  CreateRequest = "@@administrators/CREATE_REQUEST",
  CreateSuccess = "@@administrators/CREATE_SUCCESS",
  CreateFailure = "@@administrators/CREATE_FAILURE",
  DeleteRequest = "@@administrators/DELETE_REQUEST",
  DeleteSuccess = "@@administrators/DELETE_SUCCESS",
  DeleteFailure = "@@administrators/DELETE_FAILURE",
  BulkDeleteRequest = "@@administrators/BULK_DELETE_REQUEST",
  BulkDeleteSuccess = "@@administrators/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@administrators/BULK_DELETE_FAILURE",
  DetailRequest = "@@administrators/DETAIL_REQUEST",
  DetailSuccess = "@@administrators/DETAIL_SUCCESS",
  DetailFailure = "@@administrators/DETAIL_FAILURE",
  DisableRequest = "@@administrators/DISABLE_REQUEST",
  DisableSuccess = "@@administrators/DISABLE_SUCCESS",
  DisableFailure = "@@administrators/DISABLE_FAILURE",
  EnableRequest = "@@administrators/ENABLE_REQUEST",
  EnableSuccess = "@@administrators/ENABLE_SUCCESS",
  EnableFailure = "@@administrators/ENABLE_FAILURE",
  BulkDisableRequest = "@@administrators/BULK_DISABLE_REQUEST",
  BulkDisableSuccess = "@@administrators/BULK_DISABLE_SUCCESS",
  BulkDisableFailure = "@@administrators/BULK_DISABLE_FAILURE",
  BulkEnableRequest = "@@administrators/BULK_ENABLE_REQUEST",
  BulkEnableSuccess = "@@administrators/BULK_ENABLE_SUCCESS",
  BulkEnableFailure = "@@administrators/BULK_ENABLE_FAILURE",
  ListRequest = "@@administrators/LIST_REQUEST",
  ListSuccess = "@@administrators/LIST_SUCCESS",
  ListFailure = "@@administrators/LIST_FAILURE",
  UpdateRequest = "@@administrators/UPDATE_REQUEST",
  UpdateSuccess = "@@administrators/UPDATE_SUCCESS",
  UpdateFailure = "@@administrators/UPDATE_FAILURE",
}

export const actions = {
  requestCreate: createCustomAction(
    Actions.CreateRequest,
    (
      name: string,
      surname: string,
      username: string,
      email: string,
      certificate: File,
      description: string,
      superAdmin: boolean,
      enabled: boolean,
      certificateUuid: string,
      history: History<unknown>
    ) => ({
      name,
      surname,
      username,
      email,
      certificate,
      description,
      superAdmin,
      enabled,
      certificateUuid,
      history,
    })
  ),
  receiveCreate: createCustomAction(Actions.CreateSuccess, (uuid: string) => ({
    uuid,
  })),
  failCreate: createCustomAction(Actions.CreateFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
  requestDetail: createCustomAction(Actions.DetailRequest, (uuid: string) => ({
    uuid,
  })),
  receiveDetail: createCustomAction(
    Actions.DetailSuccess,
    (detail: AdministratorDetail) => ({ detail })
  ),
  failDetail: createCustomAction(Actions.DetailFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
  requestEnable: createCustomAction(Actions.EnableRequest, (uuid: string) => ({
    uuid,
  })),
  receiveEnable: createCustomAction(Actions.EnableSuccess, (uuid: string) => ({
    uuid,
  })),
  failEnable: createCustomAction(Actions.EnableFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
  requestDisable: createCustomAction(
    Actions.DisableRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveDisable: createCustomAction(
    Actions.DisableSuccess,
    (uuid: string) => ({ uuid })
  ),
  failDisable: createCustomAction(Actions.DisableFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),

  requestBulkEnable: createCustomAction(
    Actions.BulkEnableRequest,
    (uuid: string[]) => ({
      uuid,
    })
  ),
  receiveBulkEnable: createCustomAction(
    Actions.BulkEnableSuccess,
    (uuid: string[]) => ({
      uuid,
    })
  ),
  failBulkEnable: createCustomAction(
    Actions.BulkEnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkDisable: createCustomAction(
    Actions.BulkDisableRequest,
    (uuid: string[]) => ({ uuid })
  ),
  receiveBulkDisable: createCustomAction(
    Actions.BulkDisableSuccess,
    (uuid: string[]) => ({ uuid })
  ),
  failBulkDisable: createCustomAction(
    Actions.BulkDisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestAdministratorsList: createCustomAction(Actions.ListRequest),
  receiveAdministratorsList: createCustomAction(
    Actions.ListSuccess,
    (administrators: Administrator[]) => ({ administrators })
  ),
  failAdministratorsList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestDelete: createCustomAction(
    Actions.DeleteRequest,
    (uuid: string, history: History) => ({
      uuid,
      history,
    })
  ),
  receiveDelete: createCustomAction(Actions.DeleteSuccess, (uuid: string) => ({
    uuid,
  })),
  failDelete: createCustomAction(Actions.DeleteFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
  requestBulkDelete: createCustomAction(
    Actions.BulkDeleteRequest,
    (uuid: string[]) => ({
      uuid,
    })
  ),
  receiveBulkDelete: createCustomAction(
    Actions.BulkDeleteSuccess,
    (uuid: string[]) => ({
      uuid,
    })
  ),
  failBulkDelete: createCustomAction(Actions.DeleteFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
  requestUpdate: createCustomAction(
    Actions.UpdateRequest,
    (
      uuid: string,
      name: string,
      surname: string,
      username: string,
      email: string,
      certificate: File,
      description: string,
      superAdmin: boolean,
      certificateUuid: string,
      history: History<unknown>
    ) => ({
      uuid,
      name,
      surname,
      username,
      email,
      certificate,
      description,
      superAdmin,
      certificateUuid,
      history,
    })
  ),
  receiveUpdate: createCustomAction(
    Actions.UpdateSuccess,
    (admin: AdministratorDetail) => ({ admin })
  ),
  failUpdate: createCustomAction(Actions.UpdateFailure, (error?: string) =>
    createErrorAlertAction(error)
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  administrators: Administrator[];
  isCreating: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  isFetchingDetail: boolean;
  isFetchingList: boolean;
  selectedAdministrator: AdministratorDetail | null;
};

export const initialState: State = {
  administrators: [],
  isCreating: false,
  isDeleting: false,
  isEditing: false,
  isFetchingDetail: false,
  isFetchingList: false,
  selectedAdministrator: null,
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestCreate):
      return { ...state, isCreating: true };
    case getType(actions.receiveCreate):
      return { ...state, isCreating: false };
    case getType(actions.failCreate):
      return { ...state, isCreating: false };
    case getType(actions.requestBulkDelete):
      return { ...state, isDeleting: true };
    case getType(actions.receiveBulkDelete):
      let updated: Administrator[] = [];
      for (let i of state.administrators) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeleting: false,
        administrators: updated,
      };
    case getType(actions.failBulkDelete):
      return { ...state, isDeleting: false };

    case getType(actions.requestDelete):
      return { ...state, isDeleting: true };
    case getType(actions.receiveDelete):
      return {
        ...state,
        isDeleting: false,
      };
    case getType(actions.failDelete):
      return { ...state, isDeleting: false };

    case getType(actions.requestDetail):
      return { ...state, isFetchingDetail: true, selectedAdministrator: null };
    case getType(actions.receiveDetail):
      return {
        ...state,
        isFetchingDetail: false,
        selectedAdministrator: action.detail,
      };
    case getType(actions.failDetail):
      return { ...state, isFetchingDetail: false };

    case getType(actions.requestBulkEnable):
      return { ...state, isFetchingList: true };
    case getType(actions.requestBulkDisable):
      return { ...state, isFetchingList: true };
    case getType(actions.receiveBulkDisable):
      let updatedDisable: Administrator[] = [];
      for (let i of state.administrators) {
        if (!action.uuid.includes(i.uuid)) {
          updatedDisable.push(i);
        } else {
          i.enabled = false;
          updatedDisable.push(i);
        }
      }
      return {
        ...state,
        isFetchingList: false,
        administrators: updatedDisable,
      };
    case getType(actions.receiveBulkEnable):
      let updatedEnable: Administrator[] = [];
      for (let i of state.administrators) {
        if (!action.uuid.includes(i.uuid)) {
          updatedEnable.push(i);
        } else {
          i.enabled = true;
          updatedEnable.push(i);
        }
      }
      return {
        ...state,
        isFetchingList: false,
        administrators: updatedEnable,
      };
    case getType(actions.failBulkDisable):
      return { ...state, isFetchingList: false };
    case getType(actions.failBulkEnable):
      return { ...state, isFetchingList: false };

    case getType(actions.requestEnable):
      return { ...state, isFetchingList: true };
    case getType(actions.requestDisable):
      return { ...state, isFetchingList: true };
    case getType(actions.receiveDisable):
      let detailsDisabled =
        state.selectedAdministrator ||
        ({ enabled: true } as AdministratorDetail);
      detailsDisabled["enabled"] = false;
      return {
        ...state,
        isFetchingList: false,
        selectedAdministrator: detailsDisabled,
      };
    case getType(actions.receiveEnable):
      let detailsEnabled =
        state.selectedAdministrator ||
        ({ enabled: false } as AdministratorDetail);
      detailsEnabled["enabled"] = true;
      return {
        ...state,
        isFetchingList: false,
        selectedAdministrator: detailsEnabled,
      };
    case getType(actions.failDisable):
      return { ...state, isFetchingList: false };
    case getType(actions.failEnable):
      return { ...state, isFetchingList: false };

    case getType(actions.requestAdministratorsList):
      return { ...state, administrators: [], isFetchingList: true };
    case getType(actions.receiveAdministratorsList):
      return {
        ...state,
        administrators: action.administrators,
        isFetchingList: false,
      };
    case getType(actions.failAdministratorsList):
      return { ...state, isFetchingList: false };
    case getType(actions.requestUpdate):
      return { ...state, isEditing: true };
    case getType(actions.receiveUpdate):
      return {
        ...state,
        isEditing: false,
        administrators: arrayReducer(
          state.administrators,
          action.admin.uuid,
          (admin) => ({
            ...admin,
            adminDn: action.admin.adminDn,
            superAdmin: action.admin.superAdmin,
          })
        ),
        selectedAdministrator: action.admin,
      };
    case getType(actions.failUpdate):
      return { ...state, isEditing: false };
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isCreating = createSelector(selectState, (state) => state.isCreating);

const isDeleting = createSelector(selectState, (state) => state.isDeleting);

const isEditing = createSelector(selectState, (state) => state.isEditing);

const isFetchingDetail = createSelector(
  selectState,
  (state) => state.isFetchingDetail
);

const isFetchingList = createSelector(
  selectState,
  (state) => state.isFetchingList
);

const isFetching = createSelector(
  isFetchingDetail,
  isFetchingList,
  (detail, list) => detail || list
);

const selectAdministrators = createSelector(
  selectState,
  (state) => state.administrators
);

const selectSelectedAdministrator = createSelector(
  selectState,
  (state) => state.selectedAdministrator
);

const selectAdministratorDetails = createSelector(
  selectAdministrators,
  selectSelectedAdministrator,
  (admins, selectedAdmin) => {
    if (!selectedAdmin) {
      return null;
    }

    const admin = admins.find((a) => a.uuid === selectedAdmin.uuid);
    if (!admin) {
      return null;
    }

    return {
      ...admin,
      ...selectedAdmin,
    };
  }
);

export const selectors = {
  selectState,
  isCreating,
  isDeleting,
  isEditing,
  isFetching,
  isFetchingDetail,
  isFetchingList,
  selectAdministratorDetails,
  selectAdministrators,
  selectSelectedAdministrator,
};
