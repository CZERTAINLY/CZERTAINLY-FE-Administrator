import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import { ClientDTO, ClientInfoDTO } from "api/clients";
import { Client, ClientDetails } from "models";
import { readCertificate } from "utils/file";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions, selectors } from "./clients";
import {
  Action as ProfileAction,
  actions as profileActions,
  selectors as profileSelectors,
} from "./ra-profiles";
import { useHistory } from "react-router";

const getAuthorizedProfiles: Epic<Action, Action, AppState, EpicDependencies> =
  (action$, _, { apiClients }) =>
    action$.pipe(
      filter(isOfType(Actions.AuthListRequest)),
      switchMap(({ uuid }) =>
        apiClients.clients.getClientAuth(uuid).pipe(
          map((profiles) =>
            actions.receiveAuthorizedProfiles(
              profiles.map((p) => p.uuid.toString())
            )
          ),
          catchError((err) =>
            of(
              actions.failAuthorizedProfiles(
                extractError(
                  err,
                  "Failed to retrieve authorized profiles of the client"
                )
              )
            )
          )
        )
      )
    );

const getClientsList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.clients.getClientsList().pipe(
        map((clients) =>
          Array.isArray(clients)
            ? actions.receiveClientsList(clients.map(mapClient))
            : actions.failClientsList("Failed to retrieve clients list")
        ),
        catchError((err) =>
          of(
            actions.failClientsList(
              extractError(err, "Failed to retrieve clients list")
            )
          )
        )
      )
    )
  );

const fetchAdditionalDetailData: Epic<
  Action | ProfileAction,
  Action | ProfileAction,
  AppState,
  EpicDependencies
> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    mergeMap(({ uuid }) => {
      const result = [];
      const clients = selectors.selectClients(state$.value);
      const profiles = profileSelectors.selectProfiles(state$.value);

      result.push(actions.requestAuthorizedProfiles(uuid));

      if (!clients.find((c) => c.uuid === uuid)) {
        result.push(actions.requestClientsList());
      }
      if (!profiles.length) {
        result.push(profileActions.requestRaProfilesList());
      }

      return result;
    })
  );

const getClientDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.clients.getClientDetail(uuid).pipe(
        map((client) =>
          actions.receiveClientDetail(mapClientDetail(uuid, client))
        ),
        catchError((err) =>
          of(
            actions.failClientDetail(
              extractError(err, "Failed to retrieve client information")
            )
          )
        )
      )
    )
  );

const authorizeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.AuthorizeProfileRequest)),
    switchMap(({ clientId, profileId }) =>
      apiClients.clients.authorizeClient(clientId, profileId).pipe(
        map(() => actions.receiveAuthorizeProfile(clientId, profileId)),
        catchError((err) =>
          of(
            actions.failAuthorizeProfile(
              extractError(err, `Failed to authorize profile ${profileId}`)
            )
          )
        )
      )
    )
  );

const unauthorizeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UnauthorizeRequest)),
    switchMap(({ clientId, profileId }) =>
      apiClients.clients.unauthorizeClient(clientId, profileId).pipe(
        map(() => actions.receiveUnauthorizeProfile(clientId, profileId)),
        catchError(() =>
          of(
            actions.failUnauthorizeProfile(
              clientId,
              profileId,
              `Failed to unauthorize profile ${profileId}`
            )
          )
        )
      )
    )
  );

const createClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(
      ({ name, certificate, description, enabled, certificateUuid, history }) =>
        readCertificate(certificate).pipe(
          switchMap((clientCertificate) =>
            apiClients.clients
              .createNewClient(
                name,
                clientCertificate,
                description,
                enabled,
                certificateUuid
              )
              .pipe(
                map((uuid) => {
                  history.push(`./detail/${uuid}`);
                  return actions.receiveCreateClient(uuid);
                }),
                catchError((err) =>
                  of(
                    actions.failCreateClient(
                      extractError(err, "Failed to create client")
                    )
                  )
                )
              )
          ),
          catchError(() =>
            of(actions.failCreateClient("Failed to read client certificate"))
          )
        )
    )
  );

const startDeleteClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DeleteRequest)),
    switchMap(({ uuid }) =>
      apiClients.clients.getClientAuth(uuid).pipe(
        map((profiles) => {
          if (Array.isArray(profiles) && profiles.length > 0) {
            return actions.confirmDeleteClientRequest(uuid, useHistory());
          }
          return actions.confirmDeleteClient(uuid, useHistory());
        }),
        catchError(() =>
          of(
            actions.failDeleteClient(
              "Cannot delete client: Failed to retrieve authorized profiles of the client"
            )
          )
        )
      )
    )
  );

const deleteClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.clients.deleteClient(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.receiveDeleteClient(uuid);
        }),
        catchError((err) =>
          of(
            actions.failDeleteClient(
              extractError(err, "Failed to delete client")
            )
          )
        )
      )
    )
  );

const enableClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.EnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.clients.enableClient(uuid).pipe(
        map(() => actions.receiveEnableClient(uuid)),
        catchError((err) =>
          of(
            actions.failEnableClient(
              extractError(err, "Failed to enable client")
            )
          )
        )
      )
    )
  );

const disableClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.clients.disableClient(uuid).pipe(
        map(() => actions.receiveDisableClient(uuid)),
        catchError((err) =>
          of(
            actions.failDisableClient(
              extractError(err, "Failed to disable client")
            )
          )
        )
      )
    )
  );

const bulkDeleteClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkConfirmDelete)),
    switchMap(({ uuid }) =>
      apiClients.clients.bulkDeleteClient(uuid).pipe(
        map(() => actions.receiveBulkDeleteClient(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDeleteClient(
              extractError(err, "Failed to delete client")
            )
          )
        )
      )
    )
  );

const bulkEnableClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkEnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.clients.bulkEnableClient(uuid).pipe(
        map(() => actions.receiveBulkEnableClient(uuid)),
        catchError((err) =>
          of(
            actions.failBulkEnableClient(
              extractError(err, "Failed to enable client")
            )
          )
        )
      )
    )
  );

const bulkDisableClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkDisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.clients.bulkDisableClient(uuid).pipe(
        map(() => actions.receiveBulkDisableClient(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDisableClient(
              extractError(err, "Failed to disable client")
            )
          )
        )
      )
    )
  );

const updateClient: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateRequest)),
    switchMap(({ uuid, certificate, description, certificateUuid, history }) =>
      (certificate ? readCertificate(certificate) : of("")).pipe(
        switchMap((clientCertificate) =>
          apiClients.clients
            .updateClient(
              uuid,
              clientCertificate || undefined,
              description,
              certificateUuid
            )
            .pipe(
              map((client) => {
                history.push(`../detail/${uuid}`);
                return actions.receiveUpdateClient(
                  mapClientDetail(uuid, client)
                );
              }),
              catchError((err) =>
                of(
                  actions.failUpdateClient(
                    extractError(err, "Failed to update client")
                  )
                )
              )
            )
        ),
        catchError((err) =>
          of(
            actions.failUpdateClient(
              extractError(err, "Failed to read certificate")
            )
          )
        )
      )
    )
  );

function mapClient(client: ClientInfoDTO): Client {
  return {
    ...client,
    uuid: client.uuid.toString(),
    name: client.name.toString(),
    certificate: client.certificate,
    enabled: client.enabled,
  };
}

function mapClientDetail(
  uuid: string,
  data: ClientDTO
): ClientDetails {
  return {
    uuid,
    certificate: data.certificate,
    name: data.name,
    description: data.description,
    enabled: data.enabled,
    serialNumber: data.serialNumber,
  };
}

const epics = [
  authorizeProfile,
  createClient,
  startDeleteClient,
  deleteClient,
  enableClient,
  disableClient,
  bulkDeleteClient,
  bulkEnableClient,
  bulkDisableClient,
  getClientsList,
  getClientDetail,
  fetchAdditionalDetailData,
  getAuthorizedProfiles,
  unauthorizeProfile,
  updateClient,
];

export default epics;
