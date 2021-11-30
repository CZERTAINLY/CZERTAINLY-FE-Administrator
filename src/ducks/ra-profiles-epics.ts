import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import { RaProfileResponse } from "api/profiles";
import { RaProfile } from "models";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import {
  Action as ClientAction,
  actions as clientActions,
  selectors as clientSelectors,
} from "./clients";
import { Action, Actions, actions, selectors } from "./ra-profiles";
import { AttributeResponse } from "models/attributes";
import { useHistory } from "react-router";

const getProfilesList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.profiles.getRaProfilesList().pipe(
        map((profiles) =>
          Array.isArray(profiles)
            ? actions.receiveRaProfilesList(profiles.map(mapProfile))
            : actions.failRaProfilesList("Failed to get RA Profiles list")
        ),
        catchError((err) =>
          of(
            actions.failRaProfilesList(
              extractError(err, "Failed to get RA Profiles list")
            )
          )
        )
      )
    )
  );

const getProfileDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.getRaProfileDetail(uuid).pipe(
        map((detail) => {
          try {
            return actions.receiveProfileDetail(detail);
          } catch (err) {
            return actions.failProfileDetail("Failed to get RA Profile detail");
          }
        }),
        catchError((err) =>
          of(
            actions.failProfileDetail(
              extractError(err, "Failed to get RA Profile detail")
            )
          )
        )
      )
    )
  );

const getProfileClients: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.AuthListRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.getAuthorizedClients(uuid).pipe(
        map((clients) =>
          actions.receiveAuthorizedClients(
            clients.map((c) => c.uuid.toString())
          )
        ),
        catchError((err) =>
          of(
            actions.failAuthorizedClients(
              extractError(err, "Failed to get authorized clients")
            )
          )
        )
      )
    )
  );

const fetchAdditionalDetailData: Epic<
  Action | ClientAction,
  Action | ClientAction,
  AppState
> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    mergeMap(({ uuid }) => {
      const result = [];
      const clients = clientSelectors.selectClients(state$.value);
      const profiles = selectors.selectProfiles(state$.value);

      result.push(actions.requestAuthorizedClients(uuid));
      if (!profiles.find((p) => p.uuid === uuid)) {
        result.push(actions.requestRaProfilesList());
      }
      if (!clients.length) {
        result.push(clientActions.requestClientsList());
      }

      return result;
    })
  );

const createRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(({ caInstanceUuid, name, description, attributes, history }) =>
      apiClients.profiles
        .createRaProfile(caInstanceUuid, name, description, attributes)
        .pipe(
          map((uuid) => {
            history.push(`./detail/${uuid}`);
            return actions.receiveCreateRaProfile(uuid);
          }),
          catchError((err) =>
            of(
              actions.failCreateRaProfile(
                extractError(err, "Failed to create RA Profile")
              )
            )
          )
        )
    )
  );

const startDeleteProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DeleteRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.getAuthorizedClients(uuid).pipe(
        map((clients) => {
          if (Array.isArray(clients) && clients.length > 0) {
            return actions.confirmDeleteProfileRequest(uuid, useHistory());
          }
          return actions.confirmDeleteProfile(uuid, useHistory());
        }),
        catchError(() =>
          of(
            actions.failDeleteProfile(
              "Cannot delete profile: Failed to retrieve clients authorized to this profile"
            )
          )
        )
      )
    )
  );

const deleteRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.profiles.deleteRaProfile(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.receiveDeleteProfile(uuid);
        }),
        catchError((err) =>
          of(
            actions.failDeleteProfile(
              extractError(err, "Failed to delete profile")
            )
          )
        )
      )
    )
  );

const enableRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.EnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.enableRaProfile(uuid).pipe(
        map(() => actions.receiveEnableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failEnableProfile(
              extractError(err, "Failed to enable profile")
            )
          )
        )
      )
    )
  );

const disableRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.disableRaProfile(uuid).pipe(
        map(() => actions.receiveDisableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failDisableProfile(
              extractError(err, "Failed to disable profile")
            )
          )
        )
      )
    )
  );

const bulkDeleteRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkConfirmDelete)),
    switchMap(({ uuid }) =>
      apiClients.profiles.bulkDeleteRaProfile(uuid).pipe(
        map(() => actions.receiveBulkDeleteProfile(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDeleteProfile(
              extractError(err, "Failed to delete profile")
            )
          )
        )
      )
    )
  );

const bulkEnableRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkEnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.bulkEnableRaProfile(uuid).pipe(
        map(() => actions.receiveBulkEnableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failBulkEnableProfile(
              extractError(err, "Failed to enable profile")
            )
          )
        )
      )
    )
  );

const bulkDisableRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkDisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.profiles.bulkDisableRaProfile(uuid).pipe(
        map(() => actions.receiveBulkDisableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDisableProfile(
              extractError(err, "Failed to disable profile")
            )
          )
        )
      )
    )
  );

const updateRaProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateProfileRequest)),
    switchMap(
      ({ caInstanceUuid, uuid, name, description, attributes, history }) =>
        apiClients.profiles
          .updateRaProfile(caInstanceUuid, uuid, name, description, attributes)
          .pipe(
            map((profile) => {
              history.push(`../detail/${uuid}`);
              return actions.receiveUpdateProfile(profile);
            }),
            catchError((err) =>
              of(
                actions.failUpdateProfile(
                  extractError(err, "Failed to update profile")
                )
              )
            )
          )
    )
  );

const getAttributes: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.AttributeRequest)),
    switchMap(({ authorityUuid }) =>
      apiClients.profiles.getAttributes(authorityUuid).pipe(
        map((attributes) =>
          Array.isArray(attributes)
            ? actions.receiveAttribute(attributes.map(mapAttributes))
            : actions.failAttribute("Failed to retrieve attributes list")
        ),
        catchError((err) =>
          of(
            actions.failAttribute(
              extractError(err, "Failed to retrieve attributes list")
            )
          )
        )
      )
    )
  );

function mapAttributes(attributes: AttributeResponse): AttributeResponse {
  return {
    ...attributes,
    id: attributes.id,
    name: attributes.name.toString(),
    type: attributes.type.toString(),
    required: attributes.required,
    readOnly: attributes.readOnly,
    editable: attributes.editable,
    visible: attributes.visible,
    multiValue: attributes.multiValue,
    description: attributes.description,
    validationRegex: attributes.validationRegex,
    dependsOn: attributes.dependsOn,
    value: attributes.value,
    attributeCallback: attributes.attributeCallback,
  };
}

function mapProfile(profile: RaProfileResponse): RaProfile {
  return {
    uuid: profile.uuid.toString(),
    name: profile.name,
    enabled: profile.enabled,
    caInstanceUuid: profile.caInstanceUuid,
    description: profile.description,
    caInstanceName: profile.caInstanceName,
  };
}

const epics = [
  createRaProfile,
  startDeleteProfile,
  deleteRaProfile,
  enableRaProfile,
  disableRaProfile,
  bulkDeleteRaProfile,
  bulkDisableRaProfile,
  bulkEnableRaProfile,
  fetchAdditionalDetailData,
  getProfilesList,
  getProfileDetail,
  getProfileClients,
  getAttributes,
  updateRaProfile,
];

export default epics;
