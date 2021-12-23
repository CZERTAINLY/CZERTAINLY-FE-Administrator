import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import {
  AuthorityDetailResponse,
  AuthorityInfoResponse,
  AuthorityProviderAttributes,
  AuthorityProviderResponse,
} from "api/authorities";
import { Authority, AuthorityDetails, AuthorityProviders } from "models";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions } from "./ca-authorities";

const getAuthoritiesList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.authorities.getAuthoritiesList().pipe(
        map((authorities) =>
          Array.isArray(authorities)
            ? actions.receiveAuthoritiesList(authorities.map(mapAuthority))
            : actions.failAuthoritiesList("Failed to retrieve authorities list")
        ),
        catchError((err) =>
          of(
            actions.failAuthoritiesList(
              extractError(err, "Failed to retrieve authorities list")
            )
          )
        )
      )
    )
  );

const deleteAuthority: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.authorities.deleteAuthority(uuid).pipe(
        map((errorMessage) => {
          if (!errorMessage) {
            history.push("..");
          }
          return actions.receiveDeleteAuthority(uuid, errorMessage);
        }),
        catchError((err) => {
          if (err.status === 422) {
            return of(
              actions.receiveDeleteAuthority(uuid, [
                { uuid: uuid, name: "", message: err.error.join(", ") },
              ])
            );
          } else {
            return of(
              actions.failDeleteAuthority(
                extractError(err, "Failed to delete authority")
              )
            );
          }
        })
      )
    )
  );

const bulkDeleteAuthority: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmBulkDelete)),
    switchMap(({ uuid }) =>
      apiClients.authorities.deleteBulkAuthority(uuid).pipe(
        map((errorMessage) => {
          return actions.receiveBulkDeleteAuthority(uuid, errorMessage);
        }),
        catchError((err) =>
          of(
            actions.failBulkDeleteAuthority(
              extractError(err, "Failed to delete authority")
            )
          )
        )
      )
    )
  );

const forceDeleteAuthority: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ForceDeleteRequest)),
    switchMap(({ uuid, history }) =>
      apiClients.authorities.forceDeleteAuthority(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.recieveForceDeleteAuthority(uuid);
        }),
        catchError((err) =>
          of(
            actions.failForceDeleteAuthority(
              extractError(err, "Failed to force delete authorities")
            )
          )
        )
      )
    )
  );

const bulkForceDeleteAuthority: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.BulkForceDeleteRequest)),
    switchMap(({ uuid }) =>
      apiClients.authorities.bulkForceDeleteAuthority(uuid).pipe(
        map(() => actions.recieveBulkForceDeleteAuthority(uuid)),
        catchError((err) =>
          of(
            actions.failBulkForceDeleteAuthority(
              extractError(err, "Failed to force delete authorities")
            )
          )
        )
      )
    )
  );

const getAuthorityProviderList: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.ProviderListRequest)),
    switchMap(() =>
      apiClients.authorities.getAuthorityProviderList().pipe(
        map((authorityProviders) =>
          Array.isArray(authorityProviders)
            ? actions.receiveAuthorityProviderList(
                authorityProviders.map(mapAuthorityProviders)
              )
            : actions.failAuthorityProviderList(
                "Failed to retrieve authority provider list"
              )
        ),
        catchError((err) =>
          of(
            actions.failAuthorityProviderList(
              extractError(err, "Failed to retrieve authority provider list")
            )
          )
        )
      )
    )
  );

const getAuthorityProviderAttributes: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.ProviderListAttributeRequest)),
    switchMap(({ uuid, kind, functionGroup }) =>
      apiClients.authorities
        .getAuthorityProviderAttributes(uuid, kind, functionGroup)
        .pipe(
          map((authorityProviderAttributes) =>
            Array.isArray(authorityProviderAttributes)
              ? actions.receiveAuthorityProviderAttributeList(
                  authorityProviderAttributes.map(
                    mapAuthorityProviderAttributes
                  )
                )
              : actions.failAuthoritiesList(
                  "Failed to retrieve authorities list"
                )
          ),
          catchError((err) =>
            of(
              actions.failAuthoritiesList(
                extractError(err, "Failed to retrieve authorities list")
              )
            )
          )
        )
    )
  );

const getAuthorityDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.authorities.getAuthorityDetail(uuid).pipe(
        map((authorities) =>
          actions.receiveAuthorityDetail(mapAuthorityDetail(uuid, authorities))
        ),
        catchError((err) =>
          of(
            actions.failAuthorityDetail(
              extractError(err, "Failed to retrieve authorities information")
            )
          )
        )
      )
    )
  );

const createAuthority: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(
      ({
        name,
        connectorUuid,
        credential,
        status,
        attributes,
        kind,
        history,
      }) =>
        apiClients.authorities
          .createNewAuthority(
            name,
            connectorUuid,
            credential,
            status,
            attributes,
            kind
          )
          .pipe(
            map((uuid) => {
              history.push(".");
              return actions.receiveCreateAuthority(uuid);
            }),
            catchError((err) =>
              of(
                actions.failCreateAuthority(
                  extractError(err, "Failed to create authority. Reason: ")
                )
              )
            )
          )
    )
  );

const updateAuthority: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateRequest)),
    switchMap(
      ({
        uuid,
        name,
        connectorUuid,
        credential,
        status,
        attributes,
        kind,
        history,
      }) =>
        apiClients.authorities
          .updateAuthority(
            uuid,
            name,
            connectorUuid,
            credential,
            status,
            attributes,
            kind
          )
          .pipe(
            map((authority) => {
              history.push(`..`);
              return actions.receiveUpdateAuthority(
                mapAuthorityDetail(uuid, authority)
              );
            }),
            catchError((err) =>
              of(
                actions.failUpdateAuthority(
                  extractError(err, "Failed to update client")
                )
              )
            )
          )
    )
  );

function mapAuthority(authorities: AuthorityInfoResponse): Authority {
  return {
    ...authorities,
    uuid: authorities.uuid,
    name: authorities.name.toString(),
    connectorUuid: authorities.connectorUuid,
    connectorName: authorities.connectorName,
  };
}

function mapAuthorityProviders(
  authorityProviders: AuthorityProviderResponse
): AuthorityProviders {
  return {
    ...authorityProviders,
    uuid: authorityProviders.uuid,
    name: authorityProviders.name.toString(),
    status: authorityProviders.status?.toString() || "",
    url: authorityProviders.url.toString(),
    functionGroups: authorityProviders.functionGroups,
  };
}

function mapAuthorityProviderAttributes(
  authorityProviderAttributes: AuthorityProviderAttributes
): AuthorityProviderAttributes {
  return {
    ...authorityProviderAttributes,
    id: authorityProviderAttributes.id,
    name: authorityProviderAttributes.name.toString(),
    type: authorityProviderAttributes.type.toString(),
    required: authorityProviderAttributes.required,
    readOnly: authorityProviderAttributes.readOnly,
    editable: authorityProviderAttributes.editable,
    visible: authorityProviderAttributes.visible,
    multiValue: authorityProviderAttributes.multiValue,
    description: authorityProviderAttributes.description,
    validationRegex: authorityProviderAttributes.validationRegex,
    dependsOn: authorityProviderAttributes.dependsOn,
    value: authorityProviderAttributes.value,
  };
}

function mapAuthorityDetail(
  uuid: string,
  data: AuthorityDetailResponse
): AuthorityDetails {
  return {
    uuid,
    name: data.name,
    attributes: data.attributes,
    connectorUuid: data.connectorUuid,
    credential: data.credential,
    kind: data.kind,
    connectorName: data.connectorName,
  };
}

const epics = [
  createAuthority,
  getAuthoritiesList,
  getAuthorityDetail,
  getAuthorityProviderList,
  getAuthorityProviderAttributes,
  deleteAuthority,
  bulkDeleteAuthority,
  updateAuthority,
  forceDeleteAuthority,
  bulkForceDeleteAuthority,
];

export default epics;
