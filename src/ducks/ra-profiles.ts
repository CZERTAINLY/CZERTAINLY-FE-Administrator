import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import { RaProfile, RaProfileDetail } from "models";
import { arrayReducer, createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";
import { Action as ClientAction, actions as clientActions } from "./clients";
import { AttributeResponse } from "models/attributes";

export const statePath = "raProfiles";

export enum Actions {
  AuthListRequest = "@@profiles/LIST_AUTHORIZATIONS",
  AuthListSuccess = "@@profiles/LIST_AUTHORIZATIONS_SUCCESS",
  AuthListFailure = "@@profiles/LIST_AUTHORIZATIONS_FAILURE",
  ListRequest = "@@profiles/LIST_REQUEST",
  ListSuccess = "@@profiles/LIST_SUCCESS",
  ListFailure = "@@profiles/LIST_FAILURE",
  DeleteRequest = "@@profiles/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@profiles/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@profiles/CONFIRM_DELETE",
  CancelDelete = "@@profiles/CANCEL_DELETE",
  DeleteSuccess = "@@profiles/DELETE_SUCCESS",
  DeleteFailure = "@@profiles/DELETE_FAILURE",
  DisableRequest = "@@profiles/DISABLE_REQUEST",
  EnableRequest = "@@profiles/ENABLE_REQUEST",
  EnableSuccess = "@@profiles/ENABLE_SUCCESS",
  EnableFailure = "@@profiles/ENABLE_FAILURE",
  DisableSuccess = "@@profiles/DISABLE_SUCCESS",
  DisableFailure = "@@profiles/DISABLE_FAILURE",

  BulkDeleteRequest = "@@profiles/BULK_DELETE_REQUEST",
  BulkConfirmDeleteRequest = "@@profiles/BULK_CONFIRM_DELETE_REQUEST",
  BulkConfirmDelete = "@@profiles/BULK_CONFIRM_DELETE",
  BulkCancelDelete = "@@profiles/BULK_CANCEL_DELETE",
  BulkDeleteSuccess = "@@profiles/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@profiles/BULK_DELETE_FAILURE",
  BulkDisableRequest = "@@profiles/BULK_DISABLE_REQUEST",
  BulkEnableRequest = "@@profiles/BULK_ENABLE_REQUEST",
  BulkEnableSuccess = "@@profiles/BULK_ENABLE_SUCCESS",
  BulkEnableFailure = "@@profiles/BULK_ENABLE_FAILURE",
  BulkDisableSuccess = "@@profiles/BULK_DISABLE_SUCCESS",
  BulkDisableFailure = "@@profiles/BULK_DISABLE_FAILURE",

  DetailRequest = "@@profiles/DETAIL_REQUEST",
  DetailSuccess = "@@profiles/DETAIL_SUCCESS",
  DetailFailure = "@@profiles/DETAIL_FAILURE",
  AttributeRequest = "@@profiles/ATTRIBUTE_REQUEST",
  AttributeSuccess = "@@profiles/ATTRIBUTE_SUCCESS",
  AttributeFailure = "@@profiles/ATTRIBUTE_FAILURE",
  CreateRequest = "@@profiles/CREATE_REQUEST",
  CreateSuccess = "@@profiles/CREATE_SUCCESS",
  CreateFailure = "@@profiles/CREATE_FAILURE",
  UpdateProfileRequest = "@@profiles/UPDATE_PROFILE_REQUEST",
  UpdateProfileSuccess = "@@profiles/UPDATE_PROFILE_SUCCESS",
  UpdateProfileFailure = "@@profiles/UPDATE_PROFILE_FAILURE",
}

export const actions = {
  requestAuthorizedClients: createCustomAction(
    Actions.AuthListRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveAuthorizedClients: createCustomAction(
    Actions.AuthListSuccess,
    (clients: string[]) => ({ clients })
  ),
  failAuthorizedClients: createCustomAction(
    Actions.AuthListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestRaProfilesList: createCustomAction(Actions.ListRequest),
  receiveRaProfilesList: createCustomAction(
    Actions.ListSuccess,
    (profiles: RaProfile[]) => ({ profiles })
  ),
  failRaProfilesList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestDeleteProfile: createCustomAction(
    Actions.DeleteRequest,
    (uuid: string | number) => ({ uuid })
  ),
  confirmDeleteProfileRequest: createCustomAction(
    Actions.ConfirmDeleteRequest,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  confirmDeleteProfile: createCustomAction(
    Actions.ConfirmDelete,
    (uuid: string | number, history: History) => ({ uuid, history })
  ),
  cancelDeleteProfile: createCustomAction(Actions.CancelDelete),
  receiveDeleteProfile: createCustomAction(
    Actions.DeleteSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failDeleteProfile: createCustomAction(
    Actions.DeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestEnableProfile: createCustomAction(
    Actions.EnableRequest,
    (uuid: string | number) => ({ uuid })
  ),
  receiveEnableProfile: createCustomAction(
    Actions.EnableSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failEnableProfile: createCustomAction(
    Actions.EnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestDisableProfile: createCustomAction(
    Actions.DisableRequest,
    (uuid: string | number) => ({ uuid })
  ),
  receiveDisableProfile: createCustomAction(
    Actions.DisableSuccess,
    (uuid: string | number) => ({ uuid })
  ),
  failDisableProfile: createCustomAction(
    Actions.DisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkDeleteProfile: createCustomAction(
    Actions.BulkDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkDeleteProfileRequest: createCustomAction(
    Actions.BulkConfirmDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkDeleteProfile: createCustomAction(
    Actions.BulkConfirmDelete,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  cancelBulkDeleteProfile: createCustomAction(Actions.BulkCancelDelete),
  receiveBulkDeleteProfile: createCustomAction(
    Actions.BulkDeleteSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkDeleteProfile: createCustomAction(
    Actions.BulkDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkEnableProfile: createCustomAction(
    Actions.BulkEnableRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  receiveBulkEnableProfile: createCustomAction(
    Actions.BulkEnableSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkEnableProfile: createCustomAction(
    Actions.BulkEnableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestBulkDisableProfile: createCustomAction(
    Actions.BulkDisableRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  receiveBulkDisableProfile: createCustomAction(
    Actions.BulkDisableSuccess,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  failBulkDisableProfile: createCustomAction(
    Actions.BulkDisableFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestProfileDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveProfileDetail: createCustomAction(
    Actions.DetailSuccess,
    (profile: RaProfileDetail) => ({ profile })
  ),
  failProfileDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestAttribute: createCustomAction(
    Actions.AttributeRequest,
    (authorityUuid: string) => ({
      authorityUuid,
    })
  ),
  receiveAttribute: createCustomAction(
    Actions.AttributeSuccess,
    (attributes: AttributeResponse[]) => ({ attributes })
  ),
  failAttribute: createCustomAction(
    Actions.AttributeFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestCreateRaProfile: createCustomAction(
    Actions.CreateRequest,
    (
      caInstanceUuid: string,
      name: string,
      description: string,
      attributes: AttributeResponse[],
      history: History<unknown>
    ) => ({
      caInstanceUuid,
      name,
      description,
      attributes,
      history,
    })
  ),
  receiveCreateRaProfile: createCustomAction(
    Actions.CreateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failCreateRaProfile: createCustomAction(
    Actions.CreateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUpdateProfile: createCustomAction(
    Actions.UpdateProfileRequest,
    (
      caInstanceUuid: string,
      uuid: string,
      name: string,
      description: string,
      attributes: AttributeResponse[],
      history: History<unknown>
    ) => ({
      caInstanceUuid,
      uuid,
      name,
      description,
      attributes,
      history,
    })
  ),
  receiveUpdateProfile: createCustomAction(
    Actions.UpdateProfileSuccess,
    (profile: RaProfileDetail) => ({ profile })
  ),
  failUpdateProfile: createCustomAction(
    Actions.UpdateProfileFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  isFetchingList: boolean;
  isFetchingDetail: boolean;
  isFetchingClient: boolean;
  attributes: AttributeResponse[];
  isFetchingAttributes: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  profiles: RaProfile[];
  authorizedClients: string[];
  selectedProfile: RaProfileDetail | null;
  confirmDeleteProfile: string;
};

export const initialState: State = {
  isFetchingList: false,
  isFetchingDetail: false,
  isFetchingAttributes: false,
  isFetchingClient: false,
  isCreating: false,
  isDeleting: false,
  isEditing: false,
  attributes: [],
  profiles: [],
  authorizedClients: [],
  selectedProfile: null,
  confirmDeleteProfile: "",
};

function authorizedProfile(
  state: State,
  clientId: string,
  profileId: string
): State {
  if (!state.selectedProfile || state.selectedProfile.uuid !== profileId) {
    return state;
  }

  return {
    ...state,
    authorizedClients: [...state.authorizedClients, clientId],
  };
}

function optimisticUnauthorizeClient(
  state: State,
  clientId: string,
  profileId: string
): State {
  if (!state.selectedProfile || state.selectedProfile.uuid !== profileId) {
    return state;
  }

  const clientIdx = state.authorizedClients.indexOf(clientId);
  if (clientIdx < 0) {
    return state;
  }

  const authorizedClients = [...state.authorizedClients];
  authorizedClients.splice(clientIdx, 1);

  return {
    ...state,
    authorizedClients,
  };
}

function unauthorizeFailed(
  state: State,
  clientId: string,
  profileId: string
): State {
  if (!state.selectedProfile || state.selectedProfile.uuid !== profileId) {
    return state;
  }

  return {
    ...state,
    authorizedClients: [...state.authorizedClients, clientId],
  };
}

export function reducer(
  state: State = initialState,
  action: Action | ClientAction
): State {
  switch (action.type) {
    case getType(actions.requestAuthorizedClients):
      return { ...state, authorizedClients: [], isFetchingClient: true };
    case getType(actions.receiveAuthorizedClients):
      return {
        ...state,
        authorizedClients: action.clients,
        isFetchingClient: false,
      };
    case getType(actions.failAuthorizedClients):
      return { ...state, isFetchingClient: false };
    case getType(actions.requestRaProfilesList):
      return { ...state, profiles: [], isFetchingList: true };
    case getType(actions.receiveRaProfilesList):
      return { ...state, profiles: action.profiles, isFetchingList: false };
    case getType(actions.failRaProfilesList):
      return { ...state, isFetchingList: false };
    case getType(actions.requestProfileDetail):
      return { ...state, isFetchingDetail: true, selectedProfile: null };
    case getType(actions.receiveProfileDetail):
      return {
        ...state,
        isFetchingDetail: false,
        selectedProfile: action.profile,
      };
    case getType(actions.failProfileDetail):
      return { ...state, isFetchingDetail: false };

    case getType(actions.requestAttribute):
      return {
        ...state,
        isFetchingDetail: true,
        isFetchingAttributes: true,
        attributes: [],
      };
    case getType(actions.receiveAttribute):
      return {
        ...state,
        isFetchingDetail: false,
        isFetchingAttributes: false,
        attributes: action.attributes,
      };
    case getType(actions.failAttribute):
      return { ...state, isFetchingDetail: false, isFetchingAttributes: false };

    case getType(actions.requestCreateRaProfile):
      return { ...state, isCreating: true };
    case getType(actions.receiveCreateRaProfile):
      return { ...state, isCreating: false };
    case getType(actions.failCreateRaProfile):
      return { ...state, isCreating: false };

    case getType(actions.requestDeleteProfile):
      return { ...state, isDeleting: true };
    case getType(actions.confirmDeleteProfileRequest):
      return { ...state, confirmDeleteProfile: action.uuid, isDeleting: true };
    case getType(actions.cancelDeleteProfile):
      return { ...state, confirmDeleteProfile: "", isDeleting: false };
    case getType(actions.confirmDeleteProfile):
      return { ...state, confirmDeleteProfile: "", isDeleting: true };
    case getType(actions.failDeleteProfile):
      return { ...state, isDeleting: false };
    case getType(actions.receiveDeleteProfile):
      return {
        ...state,
        isDeleting: false,
      };
    case getType(actions.requestEnableProfile):
    case getType(actions.requestDisableProfile):
      return { ...state, isEditing: true };
    case getType(actions.failEnableProfile):
    case getType(actions.failDisableProfile):
      return { ...state, isEditing: false };
    case getType(actions.receiveEnableProfile):
      let detailEnable = state.selectedProfile || ({} as RaProfileDetail);
      detailEnable["enabled"] = true;
      return {
        ...state,
        isEditing: false,
        selectedProfile: detailEnable,
      };
    case getType(actions.receiveDisableProfile):
      let detailDisable = state.selectedProfile || ({} as RaProfileDetail);
      detailDisable["enabled"] = false;
      return {
        ...state,
        isEditing: false,
        selectedProfile: detailDisable,
      };

    case getType(actions.requestBulkDeleteProfile):
      return { ...state, isDeleting: true };
    case getType(actions.confirmBulkDeleteProfileRequest):
      return { ...state, confirmDeleteProfile: action.uuid, isDeleting: true };
    case getType(actions.cancelBulkDeleteProfile):
      return { ...state, confirmDeleteProfile: "", isDeleting: false };
    case getType(actions.confirmBulkDeleteProfile):
      return { ...state, confirmDeleteProfile: "", isDeleting: true };
    case getType(actions.failBulkDeleteProfile):
      return { ...state, isDeleting: false };
    case getType(actions.receiveBulkDeleteProfile):
      let updated: RaProfile[] = [];
      for (let i of state.profiles) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        isDeleting: false,
        profiles: updated,
      };
    case getType(actions.requestBulkEnableProfile):
    case getType(actions.requestBulkDisableProfile):
      return { ...state, isEditing: true };
    case getType(actions.failBulkEnableProfile):
    case getType(actions.failBulkDisableProfile):
      return { ...state, isEditing: false };
    case getType(actions.receiveBulkEnableProfile):
      let updatedEnable: RaProfile[] = [];
      for (let i of state.profiles) {
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
        profiles: updatedEnable,
      };
    case getType(actions.receiveBulkDisableProfile):
      let updatedDisable: RaProfile[] = [];
      for (let i of state.profiles) {
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
        profiles: updatedDisable,
      };

    case getType(actions.requestUpdateProfile):
      return { ...state, isEditing: true };
    case getType(actions.receiveUpdateProfile):
      return {
        ...state,
        isEditing: false,
        selectedProfile: action.profile,
        profiles: arrayReducer(
          state.profiles,
          action.profile.uuid,
          (profile) => ({ ...profile, name: action.profile.name })
        ),
      };
    case getType(actions.failUpdateProfile):
      return { ...state, isEditing: false };
    case getType(clientActions.receiveAuthorizeProfile):
      return authorizedProfile(state, action.clientId, action.profileId);
    case getType(clientActions.requestUnauthorizeProfile):
      return optimisticUnauthorizeClient(
        state,
        action.clientId,
        action.profileId
      );
    case getType(clientActions.failUnauthorizeProfile):
      return unauthorizeFailed(state, action.clientId, action.profileId);
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isFetching = createSelector(
  selectState,
  (state) =>
    state.isFetchingList ||
    state.isFetchingDetail ||
    state.isFetchingAttributes ||
    state.isFetchingClient
);

const isCreating = createSelector(selectState, (state) => state.isCreating);

const isDeleting = createSelector(selectState, (state) => state.isDeleting);

const isEditing = createSelector(selectState, (state) => state.isEditing);

const isFetchingAttributes = createSelector(
  selectState,
  (state) => state.isFetchingAttributes
);

const selectProfiles = createSelector(selectState, (state) => state.profiles);

const selectAuthorizedClientIds = createSelector(
  selectState,
  (state) => state.authorizedClients
);

const selectSelectedProfile = createSelector(
  selectState,
  (state) => state.selectedProfile
);

const selectProfileDetail = createSelector(
  selectProfiles,
  selectSelectedProfile,
  selectAuthorizedClientIds,
  (profiles, selectedProfile, authClients) => {
    if (!selectedProfile) {
      return null;
    }

    const profile = profiles.find(
      (p) => p.uuid.toString() === selectedProfile.uuid.toString()
    );
    if (!profile) {
      return null;
    }

    return {
      ...profile,
      ...selectedProfile,
      authClients,
    };
  }
);

const selectConfirmDeleteProfileId = createSelector(
  selectState,
  (state) => state.confirmDeleteProfile
);

const selectAttributes = createSelector(
  selectState,
  (state) => state.attributes
);

export const selectors = {
  selectState,
  isCreating,
  isDeleting,
  isEditing,
  isFetching,
  isFetchingAttributes,
  selectProfiles,
  selectAuthorizedClientIds,
  selectSelectedProfile,
  selectProfileDetail,
  selectConfirmDeleteProfileId,
  selectAttributes,
};
