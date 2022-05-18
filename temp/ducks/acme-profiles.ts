import { History } from "history";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";

import { arrayReducer, createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";
import { Action as ClientAction } from "./clients";
import { AttributeResponse } from "models/attributes";
import {
  AcmeProfileDTO,
  AcmeProfileListItemDTO,
} from "api/acme-profile";
import { ErrorDeleteObject } from "models";

export const statePath = "acmeProfiles";

export enum Actions {
  ListRequest = "@@acmeprofiles/LIST_REQUEST",
  ListSuccess = "@@acmeprofiles/LIST_SUCCESS",
  ListFailure = "@@acmeprofiles/LIST_FAILURE",
  DeleteRequest = "@@acmeprofiles/DELETE_REQUEST",
  ConfirmDeleteRequest = "@@acmeprofiles/CONFIRM_DELETE_REQUEST",
  ConfirmDelete = "@@acmeprofiles/CONFIRM_DELETE",
  CancelDelete = "@@acmeprofiles/CANCEL_DELETE",
  DeleteSuccess = "@@acmeprofiles/DELETE_SUCCESS",
  DeleteFailure = "@@acmeprofiles/DELETE_FAILURE",
  DisableRequest = "@@acmeprofiles/DISABLE_REQUEST",
  EnableRequest = "@@acmeprofiles/ENABLE_REQUEST",
  EnableSuccess = "@@acmeprofiles/ENABLE_SUCCESS",
  EnableFailure = "@@acmeprofiles/ENABLE_FAILURE",
  DisableSuccess = "@@acmeprofiles/DISABLE_SUCCESS",
  DisableFailure = "@@acmeprofiles/DISABLE_FAILURE",

  BulkDeleteRequest = "@@acmeprofiles/BULK_DELETE_REQUEST",
  BulkConfirmDeleteRequest = "@@acmeprofiles/BULK_CONFIRM_DELETE_REQUEST",
  BulkConfirmDelete = "@@acmeprofiles/BULK_CONFIRM_DELETE",
  BulkCancelDelete = "@@acmeprofiles/BULK_CANCEL_DELETE",
  BulkDeleteSuccess = "@@acmeprofiles/BULK_DELETE_SUCCESS",
  BulkDeleteFailure = "@@acmeprofiles/BULK_DELETE_FAILURE",

  BulkForceDeleteRequest = "@@acmeprofiles/BULK_FORCE_DELETE_REQUEST",
  BulkForceConfirmDeleteRequest = "@@acmeprofiles/BULK_FORCE_CONFIRM_DELETE_REQUEST",
  BulkForceConfirmDelete = "@@acmeprofiles/BULK_FORCE_CONFIRM_DELETE",
  BulkForceCancelDelete = "@@acmeprofiles/BULK_FORCE_CANCEL_DELETE",
  BulkForceDeleteSuccess = "@@acmeprofiles/BULK_FORCE_DELETE_SUCCESS",
  BulkForceDeleteFailure = "@@acmeprofiles/BULK_FORCE_DELETE_FAILURE",

  BulkDisableRequest = "@@acmeprofiles/BULK_DISABLE_REQUEST",
  BulkEnableRequest = "@@acmeprofiles/BULK_ENABLE_REQUEST",
  BulkEnableSuccess = "@@acmeprofiles/BULK_ENABLE_SUCCESS",
  BulkEnableFailure = "@@acmeprofiles/BULK_ENABLE_FAILURE",
  BulkDisableSuccess = "@@acmeprofiles/BULK_DISABLE_SUCCESS",
  BulkDisableFailure = "@@acmeprofiles/BULK_DISABLE_FAILURE",

  DetailRequest = "@@acmeprofiles/DETAIL_REQUEST",
  DetailSuccess = "@@acmeprofiles/DETAIL_SUCCESS",
  DetailFailure = "@@acmeprofiles/DETAIL_FAILURE",
  CreateRequest = "@@acmeprofiles/CREATE_REQUEST",
  CreateSuccess = "@@acmeprofiles/CREATE_SUCCESS",
  CreateFailure = "@@acmeprofiles/CREATE_FAILURE",
  UpdateProfileRequest = "@@acmeprofiles/UPDATE_PROFILE_REQUEST",
  UpdateProfileSuccess = "@@acmeprofiles/UPDATE_PROFILE_SUCCESS",
  UpdateProfileFailure = "@@acmeprofiles/UPDATE_PROFILE_FAILURE",
}

export const actions = {
  requestAcmeProfilesList: createCustomAction(Actions.ListRequest),
  receiveAcmeProfilesList: createCustomAction(
    Actions.ListSuccess,
    (profiles: AcmeProfileListItemDTO[]) => ({ profiles })
  ),
  failAcmeProfilesList: createCustomAction(
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
    (uuid: string | number, errorMessage: ErrorDeleteObject[]) => ({
      uuid,
      errorMessage,
    })
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
    (uuid: (string | number)[], errorMessage: ErrorDeleteObject[]) => ({
      uuid,
      errorMessage,
    })
  ),
  failBulkDeleteProfile: createCustomAction(
    Actions.BulkDeleteFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestBulkForceDeleteProfile: createCustomAction(
    Actions.BulkForceDeleteRequest,
    (uuid: (string | number)[], pushBack: boolean, history: History) => ({
      uuid,
      pushBack,
      history,
    })
  ),
  confirmBulkForceDeleteProfileRequest: createCustomAction(
    Actions.BulkForceConfirmDeleteRequest,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  confirmBulkForceDeleteProfile: createCustomAction(
    Actions.BulkForceConfirmDelete,
    (uuid: (string | number)[]) => ({ uuid })
  ),
  cancelBulkForceDeleteProfile: createCustomAction(
    Actions.BulkForceCancelDelete
  ),
  receiveBulkForceDeleteProfile: createCustomAction(
    Actions.BulkForceDeleteSuccess,
    (uuid: (string | number)[]) => ({
      uuid,
    })
  ),
  failBulkForceDeleteProfile: createCustomAction(
    Actions.BulkForceDeleteFailure,
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
    (profile: AcmeProfileDTO) => ({ profile })
  ),
  failProfileDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),

  requestCreateAcmeProfile: createCustomAction(
    Actions.CreateRequest,
    (
      name: string,
      description: string,
      termsOfServiceUrl: string,
      dnsResolverIp: string,
      dnsResolverPort: string,
      raProfileUuid: string,
      websiteUrl: string,
      retryInterval: number,
      termsOfServiceChangeDisable: boolean,
      validity: number,
      issueCertificateAttributes: AttributeResponse[],
      revokeCertificateAttributes: AttributeResponse[],
      requireContact: boolean,
      requireTermsOfService: boolean,
      termsOfServiceChangeUrl: string,
      history: History<unknown>
    ) => ({
      name,
      description,
      termsOfServiceUrl,
      dnsResolverIp,
      dnsResolverPort,
      raProfileUuid,
      websiteUrl,
      retryInterval,
      termsOfServiceChangeDisable,
      validity,
      issueCertificateAttributes,
      revokeCertificateAttributes,
      requireContact,
      requireTermsOfService,
      termsOfServiceChangeUrl,
      history,
    })
  ),
  receiveCreateAcmeProfile: createCustomAction(
    Actions.CreateSuccess,
    (uuid: string) => ({ uuid })
  ),
  failCreateAcmeProfile: createCustomAction(
    Actions.CreateFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestUpdateProfile: createCustomAction(
    Actions.UpdateProfileRequest,
    (
      uuid: string,
      description: string,
      termsOfServiceUrl: string,
      dnsResolverIp: string,
      dnsResolverPort: string,
      raProfileUuid: string,
      websiteUrl: string,
      retryInterval: number,
      termsOfServiceChangeDisable: boolean,
      validity: number,
      issueCertificateAttributes: AttributeResponse[],
      revokeCertificateAttributes: AttributeResponse[],
      requireContact: boolean,
      requireTermsOfService: boolean,
      termsOfServiceChangeUrl: string,
      history: History<unknown>
    ) => ({
      uuid,
      description,
      termsOfServiceUrl,
      dnsResolverIp,
      dnsResolverPort,
      raProfileUuid,
      websiteUrl,
      retryInterval,
      termsOfServiceChangeDisable,
      validity,
      issueCertificateAttributes,
      revokeCertificateAttributes,
      requireContact,
      requireTermsOfService,
      termsOfServiceChangeUrl,
      history,
    })
  ),
  receiveUpdateProfile: createCustomAction(
    Actions.UpdateProfileSuccess,
    (profile: AcmeProfileDTO) => ({ profile })
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
  isCreating: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  profiles: AcmeProfileListItemDTO[];
  selectedProfile: AcmeProfileDTO | null;
  confirmDeleteProfile: string;
  deleteProfileErrors: ErrorDeleteObject[];
};

export const initialState: State = {
  isFetchingList: false,
  isFetchingDetail: false,
  isCreating: false,
  isDeleting: false,
  isEditing: false,
  profiles: [],
  selectedProfile: null,
  confirmDeleteProfile: "",
  deleteProfileErrors: [],
};

export function reducer(
  state: State = initialState,
  action: Action | ClientAction
): State {
  switch (action.type) {
    case getType(actions.requestAcmeProfilesList):
      return { ...state, profiles: [], isFetchingList: true };
    case getType(actions.receiveAcmeProfilesList):
      return { ...state, profiles: action.profiles, isFetchingList: false };
    case getType(actions.failAcmeProfilesList):
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

    case getType(actions.requestCreateAcmeProfile):
      return { ...state, isCreating: true };
    case getType(actions.receiveCreateAcmeProfile):
      return { ...state, isCreating: false };
    case getType(actions.failCreateAcmeProfile):
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
        deleteProfileErrors: action.errorMessage,
        isDeleting: false,
      };
    case getType(actions.requestEnableProfile):
    case getType(actions.requestDisableProfile):
      return { ...state, isEditing: true };
    case getType(actions.failEnableProfile):
    case getType(actions.failDisableProfile):
      return { ...state, isEditing: false };
    case getType(actions.receiveEnableProfile):
      let detailEnable =
        state.selectedProfile || ({} as AcmeProfileDTO);
      detailEnable["enabled"] = true;
      return {
        ...state,
        isEditing: false,
        selectedProfile: detailEnable,
      };
    case getType(actions.receiveDisableProfile):
      let detailDisable =
        state.selectedProfile || ({} as AcmeProfileDTO);
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
      let upd: AcmeProfileListItemDTO[] = [];
      const failedDelete: (string | number)[] = action.errorMessage.map(
        function (conn: ErrorDeleteObject) {
          return conn.uuid;
        }
      );
      for (let i of state.profiles) {
        if (action.uuid.includes(i.uuid) && failedDelete.includes(i.uuid)) {
          upd.push(i);
        } else if (!action.uuid.includes(i.uuid)) {
          upd.push(i);
        }
      }
      return {
        ...state,
        deleteProfileErrors: action.errorMessage,
        isDeleting: false,
        profiles: upd,
      };

    case getType(actions.requestBulkForceDeleteProfile):
      return { ...state, isDeleting: true };
    case getType(actions.confirmBulkForceDeleteProfileRequest):
      return { ...state, confirmDeleteProfile: action.uuid, isDeleting: true };
    case getType(actions.cancelBulkForceDeleteProfile):
      return {
        ...state,
        confirmDeleteProfile: "",
        deleteProfileErrors: [],
        isDeleting: false,
      };
    case getType(actions.confirmBulkForceDeleteProfile):
      return { ...state, confirmDeleteProfile: "", isDeleting: true };
    case getType(actions.failBulkForceDeleteProfile):
      return { ...state, isDeleting: false };
    case getType(actions.receiveBulkForceDeleteProfile):
      let updated: AcmeProfileListItemDTO[] = [];
      for (let i of state.profiles) {
        if (!action.uuid.includes(i.uuid)) {
          updated.push(i);
        }
      }
      return {
        ...state,
        deleteProfileErrors: [],
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
      let updatedEnable: AcmeProfileListItemDTO[] = [];
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
      let updatedDisable: AcmeProfileListItemDTO[] = [];
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
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isFetching = createSelector(
  selectState,
  (state) => state.isFetchingList || state.isFetchingDetail
);

const isCreating = createSelector(selectState, (state) => state.isCreating);

const isDeleting = createSelector(selectState, (state) => state.isDeleting);

const isEditing = createSelector(selectState, (state) => state.isEditing);

const selectProfiles = createSelector(selectState, (state) => state.profiles);

const selectSelectedProfile = createSelector(
  selectState,
  (state) => state.selectedProfile
);

const selectProfileDetail = createSelector(
  selectProfiles,
  selectSelectedProfile,
  (profiles, selectedProfile) => {
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
    };
  }
);

const selectConfirmDeleteProfileId = createSelector(
  selectState,
  (state) => state.confirmDeleteProfile
);

const selectDeleteProfileError = createSelector(
  selectState,
  (state) => state.deleteProfileErrors
);

export const selectors = {
  selectState,
  isCreating,
  isDeleting,
  isEditing,
  isFetching,
  selectProfiles,
  selectSelectedProfile,
  selectProfileDetail,
  selectConfirmDeleteProfileId,
  selectDeleteProfileError,
};
