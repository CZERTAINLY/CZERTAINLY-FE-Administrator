import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./acme-profiles";
import history from "browser-history";
import { transformAcmeProfileDtoToModel, transformAcmeProfileListDtoToModel } from "./transform/acme-profiles";

const listAcmeProfiles: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.listAcmeProfiles.match),
    switchMap(() =>
      deps.apiClients.acmeProfiles.getAcmeProfilesList().pipe(
        map((profiles) =>
          Array.isArray(profiles)
            ? slice.actions.listAcmeProfilesSuccess(profiles.map(profileDto => transformAcmeProfileListDtoToModel(profileDto)))
            : slice.actions.listAcmeProfilesFailed("Failed to get ACME Profiles list")
        ),
        catchError((err) =>
          of(
            slice.actions.listAcmeProfilesFailed(
              extractError(err, "Failed to get ACME Profiles list")
            )
          )
        )
      )
    )
  );
}


const listAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.listAcmeProfilesFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const getAcmeProfileDetail: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.getAcmeProfile.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.getAcmeProfileDetail(payload).pipe(
        map((detail) => {
          try {
            return slice.actions.getAcmeProfileSuccess(transformAcmeProfileDtoToModel(detail));
          } catch (err) {
            return slice.actions.getAcmeProfileFailed(
              "Failed to get ACME Profile details"
            );
          }
        }),
        catchError((err) =>
          of(
            slice.actions.getAcmeProfileFailed(
              extractError(err, "Failed to get ACME Profile details")
            )
          )
        )
      )
    )
  );
}


const getAcmeProfileDetailFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.getAcmeProfileFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const createAcmeProfile: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.createAcmeProfile.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.createAcmeProfile(payload.name, payload.issueCertificateAttributes, payload.revokeCertificateAttributes, payload.description, payload.termsOfServiceUrl, payload.websiteUrl, payload.dnsResolverIp, payload.dnsResolverPort, payload.raProfileUuid, payload.retryInterval, payload.validity, payload.requireContact, payload.requireTermsOfService).pipe(
        map((uuid) => slice.actions.createAcmeProfileSuccess(uuid)),
        catchError((err) =>
          of(
            slice.actions.createAcmeProfileFailed(
              extractError(err, "Failed to create ACME Profile")
            )
          )
        )
      )
    )
  );
}


const createAcmeProfileFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.createAcmeProfileFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const createAcmeProfileSuccess: AppEpic = (action$, state, deps) => {
  return action$.pipe(
    filter(
      slice.actions.createAcmeProfileSuccess.match
    ),
    switchMap(
      action => {
        history.push(`./detail/${action.payload}`);
        return EMPTY;
      }
    )
  )
}


const editAcmeProfile: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.editAcmeProfile.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.updateAcmeProfile(payload.uuid, payload.issueCertificateAttributes, payload.revokeCertificateAttributes, payload.description, payload.termsOfServiceUrl, payload.websiteUrl, payload.dnsResolverIp, payload.dnsResolverPort, payload.raProfileUuid, payload.retryInterval, payload.termsOfServiceChangeDisable, payload.termsOfServiceChangeUrl, payload.validity, payload.requireContact, payload.requireTermsOfService).pipe(
        map(() => slice.actions.editAcmeProfileSuccess(payload.uuid)),
        catchError((err) =>
          of(
            slice.actions.editAcmeProfileFailed(
              extractError(err, "Failed to update ACME Profile")
            )
          )
        )
      )
    )
  );
}


const editAcmeProfileFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.editAcmeProfileFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const deleteAcmeProfile: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.deleteAcmeProfile.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.deleteAcmeProfile(payload).pipe(
        map(() => slice.actions.deleteAcmeProfileSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.deleteAcmeProfileFailed(
              extractError(err, "Failed to delete ACME Profile")
            )
          )
        )
      )
    )
  );
}


const deleteAcmeProfileFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.deleteAcmeProfileFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const enableAcmeProfile: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.enableAcmeProfile.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.enableAcmeProfile(payload).pipe(
        map(() => slice.actions.enableAcmeProfileSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.enableAcmeProfileFailed(
              extractError(err, "Failed to enable ACME Profile")
            )
          )
        )
      )
    )
  );
}


const enableAcmeProfileFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.enableAcmeProfileFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const disableAcmeProfile: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.disableAcmeProfile.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.disableAcmeProfile(payload).pipe(
        map(() => slice.actions.disableAcmeProfileSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.disableAcmeProfileFailed(
              extractError(err, "Failed to disable ACME Profile")
            )
          )
        )
      )
    )
  );
}


const disableAcmeProfileFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.disableAcmeProfileFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDeleteAcmeProfiles.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.bulkDeleteAcmeProfiles(payload).pipe(
        map(() => slice.actions.bulkDeleteAcmeProfilesSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkDeleteAcmeProfilesFailed(
              extractError(err, "Failed to delete ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkDeleteAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDeleteAcmeProfilesFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkForceDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkForceDeleteAcmeProfiles.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.bulkForceDeleteAcmeProfiles(payload).pipe(
        map(() => slice.actions.bulkForceDeleteAcmeProfilesSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkForceDeleteAcmeProfilesFailed(
              extractError(err, "Failed to delete ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkForceDeleteAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkForceDeleteAcmeProfilesFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkEnableAcmeProfiles: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkEnableAcmeProfiles.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.bulkEnableAcmeProfile(payload).pipe(
        map(() => slice.actions.bulkEnableAcmeProfilesSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkEnableAcmeProfilesFailed(
              extractError(err, "Failed to enable ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkEnableAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkEnableAcmeProfilesFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkDisableAcmeProfiles: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDisableAcmeProfiles.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeProfiles.bulkDisableAcmeProfile(payload).pipe(
        map(() => slice.actions.bulkDisableAcmeProfilesSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkDisableAcmeProfilesFailed(
              extractError(err, "Failed to disable ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkDisableAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDisableAcmeProfilesFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const epics = [
  listAcmeProfiles,
  listAcmeProfilesFailed,
  getAcmeProfileDetail,
  getAcmeProfileDetailFailed,
  editAcmeProfile,
  editAcmeProfileFailed,
  createAcmeProfile,
  createAcmeProfileFailed,
  createAcmeProfileSuccess,
  deleteAcmeProfile,
  enableAcmeProfile,
  disableAcmeProfile,
  bulkDeleteAcmeProfiles,
  bulkForceDeleteAcmeProfiles,
  bulkEnableAcmeProfiles,
  bulkDisableAcmeProfiles,
  createAcmeProfileFailed,
  deleteAcmeProfileFailed,
  enableAcmeProfileFailed,
  disableAcmeProfileFailed,
  bulkDeleteAcmeProfilesFailed,
  bulkForceDeleteAcmeProfilesFailed,
  bulkEnableAcmeProfilesFailed,
  bulkDisableAcmeProfilesFailed
];

export default epics;
