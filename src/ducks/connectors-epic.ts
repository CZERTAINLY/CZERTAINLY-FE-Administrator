import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import { ConnectorDetailResponse, ConnectorInfoResponse } from "api/connectors";
import { Connector, ConnectorDetails } from "models";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions } from "./connectors";

const getConnectorsList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.connectors.getConnectorsList().pipe(
        map((connectors) =>
          Array.isArray(connectors)
            ? actions.receiveConnectorsList(connectors.map(mapConnector))
            : actions.failConnectorsList("Failed to retrieve connectors list")
        ),
        catchError((err) =>
          of(
            actions.failConnectorsList(
              extractError(err, "Failed to retrieve connectors list")
            )
          )
        )
      )
    )
  );

const deleteConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.connectors.deleteConnector(uuid).pipe(
        map((errorMessage) => {
          if (!errorMessage) {
            history.push("..");
          }
          return actions.receiveDeleteConnector(errorMessage, uuid);
        }),
        catchError((err) => {
          if (err.status === 422) {
            return of(
              actions.receiveDeleteConnector(
                [{ uuid: uuid, name: "", message: err.error.join(", ") }],
                uuid
              )
            );
          } else {
            return of(
              actions.failDeleteConnector(
                extractError(err, "Failed to delete connectors")
              )
            );
          }
        })
      )
    )
  );

const forceDeleteConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ForceDeleteRequest)),
    switchMap(({ uuid, history }) =>
      apiClients.connectors.forceDeleteConnector(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.recieveForceDeleteConnector(uuid);
        }),
        catchError((err) =>
          of(
            actions.failForceDeleteConnector(
              extractError(err, "Failed to force delete connectors")
            )
          )
        )
      )
    )
  );

const authorizeConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.AuthorizeConfirm)),
    switchMap(({ uuid }) =>
      apiClients.connectors.authorizeConnector(uuid).pipe(
        map(() => actions.receiveAuthorizeConnector(uuid)),
        catchError((err) =>
          of(
            actions.failAuthorizeConnector(
              extractError(err, "Failed to authorize connector")
            )
          )
        )
      )
    )
  );

const reconnectConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ReconnectRequest)),
    switchMap(({ uuid }) =>
      apiClients.connectors.reconnectConnector(uuid).pipe(
        map(() => actions.recieveReconnectConnector(uuid)),
        catchError((err) =>
          of(
            actions.failReconnectConnector(
              extractError(err, "Failed to reconnect connector")
            )
          )
        )
      )
    )
  );

const bulkDeleteConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkConfirmDelete)),
    switchMap(({ uuid }) =>
      apiClients.connectors.bulkDeleteConnector(uuid).pipe(
        map((errorMessage) =>
          actions.receiveBulkDeleteConnector(errorMessage, uuid)
        ),
        catchError((err) =>
          of(
            actions.failBulkDeleteConnector(
              extractError(err, "Failed to delete connectors")
            )
          )
        )
      )
    )
  );

const bulkForceDeleteConnector: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.BulkForceDeleteRequest)),
    switchMap(({ uuid }) =>
      apiClients.connectors.bulkForceDeleteConnector(uuid).pipe(
        map(() => actions.recieveBulkForceDeleteConnector(uuid)),
        catchError((err) =>
          of(
            actions.failBulkForceDeleteConnector(
              extractError(err, "Failed to force delete connectors")
            )
          )
        )
      )
    )
  );

const bulkAuthorizeConnector: Epic<Action, Action, AppState, EpicDependencies> =
  (action$, _, { apiClients }) =>
    action$.pipe(
      filter(isOfType(Actions.BulkAuthorizeConfirm)),
      switchMap(({ uuid }) =>
        apiClients.connectors.bulkAuthorizeConnector(uuid).pipe(
          map(() => actions.receiveBulkAuthorizeConnector(uuid)),
          catchError((err) =>
            of(
              actions.failBulkAuthorizeConnector(
                extractError(err, "Failed to authorize connector")
              )
            )
          )
        )
      )
    );

const bulkReconnectConnector: Epic<Action, Action, AppState, EpicDependencies> =
  (action$, _, { apiClients }) =>
    action$.pipe(
      filter(isOfType(Actions.BulkReconnectRequest)),
      switchMap(({ uuid }) =>
        apiClients.connectors.bulkReconnectConnector(uuid).pipe(
          map(() => actions.recieveBulkReconnectConnector(uuid)),
          catchError((err) =>
            of(
              actions.failBulkReconnectConnector(
                extractError(err, "Failed to reconnect connector")
              )
            )
          )
        )
      )
    );

const getConnectorDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.connectors.getConnectorDetail(uuid).pipe(
        map((connectors) =>
          actions.receiveConnectorDetail(mapConnectorDetail(uuid, connectors))
        ),
        catchError((err) =>
          of(
            actions.failConnectorDetail(
              extractError(err, "Failed to retrieve connectors information")
            )
          )
        )
      )
    )
  );

const getConnectorHealth: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.HealthRequest)),
    switchMap(({ uuid }) =>
      apiClients.connectors.getConnectorHealth(uuid).pipe(
        map((health) => actions.recieveConnectorHealth(health)),
        catchError((err) =>
          of(
            actions.failConnectorHealth(
              extractError(
                err,
                "Failed to retrieve connectors health information"
              )
            )
          )
        )
      )
    )
  );

const getConnectorAttributes: Epic<Action, Action, AppState, EpicDependencies> =
  (action$, _, { apiClients }) =>
    action$.pipe(
      filter(isOfType(Actions.AttributeRequest)),
      switchMap(({ uuid, code, kind }) =>
        apiClients.connectors.getConnectorAttributes(uuid, code, kind).pipe(
          map((attributes) =>
            Array.isArray(attributes)
              ? actions.receiveAttributeList(attributes)
              : actions.failAttributeList(
                  "Failed to retrieve connector attributes"
                )
          ),
          catchError((err) =>
            of(
              actions.failAttributeList(
                "Failed to retrieve connector attributes"
              )
            )
          )
        )
      )
    );

const getConnectorAllAttributes: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.AllAttributeRequest)),
    switchMap(({ uuid }) =>
      apiClients.connectors.getConnectorAllAttributes(uuid).pipe(
        map((attributes) => actions.receiveAllAttributeList(attributes)),
        catchError((err) =>
          of(
            actions.failAttributeList("Failed to retrieve connector attributes")
          )
        )
      )
    )
  );

const createConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(({ name, url, authType, authAttributes, history }) =>
      apiClients.connectors
        .createNewConnector(name, url, authType, authAttributes)
        .pipe(
          map((uuid) => {
            history.push(".");
            return actions.receiveCreateConnector(uuid);
          }),
          catchError((err) =>
            of(
              actions.failCreateConnector(
                extractError(err, "Failed to create connector")
              )
            )
          )
        )
    ),
    catchError(() =>
      of(actions.failCreateConnector("Failed to create connector"))
    )
  );

const connectConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConnectRequest)),
    switchMap(({ name, url, authType, authAttributes, uuid }) =>
      apiClients.connectors
        .connectNewConnector(name, url, authType, authAttributes, uuid)
        .pipe(
          map((connectorResponse) => {
            return actions.receiveConnectConnector(connectorResponse);
          }),
          catchError((err) =>
            of(
              actions.failConnectConnector(
                extractError(
                  err,
                  "Failed to connect to connector with provided details"
                )
              )
            )
          )
        )
    ),
    catchError(() =>
      of(actions.failCreateConnector("Failed to connect to new connector"))
    )
  );

const getCallback: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CallbackRequest)),
    switchMap(
      ({ connectorUuid, request, functionGroup, kind, authorityUuid }) =>
        apiClients.connectors
          .getCallback(
            connectorUuid,
            request,
            functionGroup,
            kind,
            authorityUuid
          )
          .pipe(
            map((response) => actions.receiveCallback(response)),
            catchError((err) =>
              of(
                actions.failCallback(
                  extractError(err, "Failed to retrieve callback response")
                )
              )
            )
          )
    )
  );

const updateConnector: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateRequest)),
    switchMap(({ uuid, name, url, authType, authAttributes, history }) =>
      apiClients.connectors
        .updateConnector(uuid, name, url, authType, authAttributes)
        .pipe(
          map((uuid) => {
            history.push("..");
            return actions.receiveUpdateConnector(uuid);
          }),
          catchError((err) =>
            of(
              actions.failUpdateConnector(
                extractError(err, "Failed to update connector")
              )
            )
          )
        )
    )
  );

function mapConnector(connectors: ConnectorInfoResponse): Connector {
  return {
    ...connectors,
    uuid: connectors.uuid,
    name: connectors.name.toString(),
    url: connectors.url,
    status: connectors.status,
    functionGroups: connectors.functionGroups,
  };
}

function mapConnectorDetail(
  uuid: string,
  data: ConnectorDetailResponse
): ConnectorDetails {
  return {
    uuid,
    name: data.name,
    functionGroups: data.functionGroups,
    url: data.url,
    status: data.status,
    authType: data.authType,
    authAttributes: data.authAttributes,
  };
}

const epics = [
  createConnector,
  connectConnector,
  getConnectorsList,
  getConnectorDetail,
  deleteConnector,
  updateConnector,
  authorizeConnector,
  getConnectorAttributes,
  getConnectorAllAttributes,
  getConnectorHealth,
  forceDeleteConnector,
  reconnectConnector,
  bulkDeleteConnector,
  bulkForceDeleteConnector,
  bulkReconnectConnector,
  bulkAuthorizeConnector,
  getCallback,
];

export default epics;
