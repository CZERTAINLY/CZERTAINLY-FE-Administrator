import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import {
  CredentialDetailDTO,
  CredentialInfoDTO,
  CredentialProviderAttributes,
  CredentialProviderDTO,
} from "api/credentials";
import { Credential, CredentialDetails, CredentialProviders } from "models";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions } from "./credentials";

const getCredentialsList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.credentials.getCredentialsList().pipe(
        map((credentials) =>
          Array.isArray(credentials)
            ? actions.receiveCredentialsList(credentials.map(mapCredential))
            : actions.failCredentialsList("Failed to retrieve credentials list")
        ),
        catchError((err) =>
          of(
            actions.failCredentialsList(
              extractError(err, "Failed to retrieve credentials list")
            )
          )
        )
      )
    )
  );

const deleteCredential: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.credentials.deleteCredential(uuid).pipe(
        map((errorMessage) => {
          if (errorMessage === null || errorMessage.length === 0) {
            history.push("..");
          }
          return actions.receiveDeleteCredential(uuid, errorMessage);
        }),
        catchError((err) =>
          of(
            actions.failDeleteCredential(
              extractError(err, "Failed to delete credential")
            )
          )
        )
      )
    )
  );

const forceDeleteCredential: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.ForceDeleteRequest)),
    switchMap(({ uuid, history }) =>
      apiClients.credentials.forceDeleteCredential(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.receiveForceDeleteCredential(uuid);
        }),
        catchError((err) =>
          of(
            actions.failForceDeleteCredential(
              extractError(err, "Failed to force delete credentials")
            )
          )
        )
      )
    )
  );

const bulkdeleteCredential: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkConfirmDelete)),
    switchMap(({ uuid }) =>
      apiClients.credentials.bulkDeleteCredential(uuid).pipe(
        map((errorMessage) =>
          actions.receiveBulkDeleteCredential(uuid, errorMessage)
        ),
        catchError((err) =>
          of(
            actions.failBulkDeleteCredential(
              extractError(err, "Failed to delete credential")
            )
          )
        )
      )
    )
  );

const bulkForceDeleteCredential: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.BulkForceDeleteRequest)),
    switchMap(({ uuid }) =>
      apiClients.credentials.bulkForceDeleteCredential(uuid).pipe(
        map(() => actions.receiveBulkForceDeleteCredential(uuid)),
        catchError((err) =>
          of(
            actions.failBulkForceDeleteCredential(
              extractError(err, "Failed to force delete credentials")
            )
          )
        )
      )
    )
  );

const getCredentialProviderList: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.ProviderListRequest)),
    switchMap(() =>
      apiClients.credentials.getCredentialProviderList().pipe(
        map((credentialProviders) =>
          Array.isArray(credentialProviders)
            ? actions.receiveCredentialProviderList(
                credentialProviders.map(mapCredentialProviders)
              )
            : actions.failCredentialProviderList(
                "Failed to retrieve credential provider list"
              )
        ),
        catchError((err) =>
          of(
            actions.failCredentialProviderList(
              extractError(err, "Failed to retrieve credential provider list")
            )
          )
        )
      )
    )
  );

const getCredentialProviderAttributes: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.ProviderListAttributeRequest)),
    switchMap(({ uuid, code, kind }) =>
      apiClients.credentials
        .getCredentialProviderAttributes(uuid, code, kind)
        .pipe(
          map((credentialProviderAttributes) =>
            Array.isArray(credentialProviderAttributes)
              ? actions.receiveCredentialProviderAttributeList(
                  credentialProviderAttributes.map(
                    mapCredentialProviderAttributes
                  )
                )
              : actions.failCredentialsList(
                  "Failed to retrieve credentials list"
                )
          ),
          catchError((err) =>
            of(
              actions.failCredentialsList(
                extractError(err, "Failed to retrieve credentials list")
              )
            )
          )
        )
    )
  );

const getCredentialDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.credentials.getCredentialDetail(uuid).pipe(
        map((credentials) =>
          actions.receiveCredentialDetail(
            mapCredentialDetail(uuid, credentials)
          )
        ),
        catchError((err) =>
          of(
            actions.failCredentialDetail(
              extractError(err, "Failed to retrieve credentials information")
            )
          )
        )
      )
    )
  );

const createCredential: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(({ name, kind, connectorUuid, attributes, history }) =>
      apiClients.credentials
        .createNewCredential(name, kind, connectorUuid, attributes)
        .pipe(
          map((uuid) => {
            history.push(".");
            return actions.receiveCreateCredential(uuid);
          }),
          catchError((err) =>
            of(
              actions.failCreateCredential(
                extractError(err, "Failed to create credential. Reason: ")
              )
            )
          )
        )
    )
  );

const updateCredential: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateRequest)),
    switchMap(({ uuid, name, kind, connectorUuid, attributes, history }) =>
      apiClients.credentials
        .updateCredential(uuid, name, kind, connectorUuid, attributes)
        .pipe(
          map((credential) => {
            history.push(`..`);
            return actions.receiveUpdateCredential(
              mapCredentialDetail(uuid, credential)
            );
          }),
          catchError((err) =>
            of(
              actions.failUpdateCredential(
                extractError(err, "Failed to update client")
              )
            )
          )
        )
    )
  );

function mapCredential(credentials: CredentialInfoDTO): Credential {
  return {
    ...credentials,
    uuid: credentials.uuid,
    name: credentials.name.toString(),
    kind: credentials.kind.toString(),
    connectorUuid: credentials.connectorUuid,
    connectorName: credentials.connectorName,
  };
}

function mapCredentialProviders(
  credentialProviders: CredentialProviderDTO
): CredentialProviders {
  return {
    ...credentialProviders,
    uuid: credentialProviders.uuid,
    name: credentialProviders.name.toString(),
    status: credentialProviders.status?.toString() || "",
    url: credentialProviders.url.toString(),
    functionGroups: credentialProviders.functionGroups,
  };
}

function mapCredentialProviderAttributes(
  credentialProviderAttributes: CredentialProviderAttributes
): CredentialProviderAttributes {
  return {
    ...credentialProviderAttributes,
    uuid: credentialProviderAttributes.uuid,
    name: credentialProviderAttributes.name.toString(),
    type: credentialProviderAttributes.type.toString(),
    required: credentialProviderAttributes.required,
    readOnly: credentialProviderAttributes.readOnly,
    editable: credentialProviderAttributes.editable,
    visible: credentialProviderAttributes.visible,
    multiValue: credentialProviderAttributes.multiValue,
    description: credentialProviderAttributes.description,
    validationRegex: credentialProviderAttributes.validationRegex,
    dependsOn: credentialProviderAttributes.dependsOn,
    value: credentialProviderAttributes.value,
  };
}

function mapCredentialDetail(
  uuid: string,
  data: CredentialDetailDTO
): CredentialDetails {
  return {
    uuid,
    name: data.name,
    kind: data.kind,
    attributes: data.attributes,
    connectorUuid: data.connectorUuid,
    connectorName: data.connectorName,
  };
}

const epics = [
  createCredential,
  getCredentialsList,
  getCredentialDetail,
  getCredentialProviderList,
  getCredentialProviderAttributes,
  deleteCredential,
  updateCredential,
  forceDeleteCredential,
  bulkdeleteCredential,
  bulkForceDeleteCredential,
];

export default epics;
