import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions } from "./acme-accounts";

const getAccountsList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.acmeAccounts.getAcmeAccountList().pipe(
        map((accounts) =>
          Array.isArray(accounts)
            ? actions.receiveAcmeAccountList(accounts)
            : actions.failAcmeAccountList("Failed to get ACME Account list")
        ),
        catchError((err) =>
          of(
            actions.failAcmeAccountList(
              extractError(err, "Failed to get ACME Account list")
            )
          )
        )
      )
    )
  );

const getAccountDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeAccounts.getAcmeDetails(uuid).pipe(
        map((detail) => {
          try {
            return actions.receiveAccountDetail(detail);
          } catch (err) {
            return actions.failAccountDetail(
              "Failed to get ACME Account detail"
            );
          }
        }),
        catchError((err) =>
          of(
            actions.failAccountDetail(
              extractError(err, "Failed to get ACME account detail")
            )
          )
        )
      )
    )
  );

const deleteAccount: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.acmeAccounts.deleteAcmeAccount(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.receiveDeleteAccount(uuid);
        }),
        catchError((err) =>
          of(
            actions.failAccountDetail(
              extractError(err, "Failed to delete account")
            )
          )
        )
      )
    )
  );

const enableAccount: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.EnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeAccounts.enableAcmeAccount(uuid).pipe(
        map(() => actions.receiveEnableAccount(uuid)),
        catchError((err) =>
          of(
            actions.failEnableAccount(
              extractError(err, "Failed to enable account")
            )
          )
        )
      )
    )
  );

const disableAccount: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeAccounts.disableAcmeAccount(uuid).pipe(
        map(() => actions.receiveDisableAccount(uuid)),
        catchError((err) =>
          of(
            actions.failDisableAccount(
              extractError(err, "Failed to disable account")
            )
          )
        )
      )
    )
  );

const bulkDeleteAccount: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkConfirmDelete)),
    switchMap(({ uuid }) =>
      apiClients.acmeAccounts.bulkDeleteAcmeAccount(uuid).pipe(
        map(() => actions.receiveBulkDeleteAccount(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDeleteAccount(
              extractError(err, "Failed to delete accounts")
            )
          )
        )
      )
    )
  );

const bulkEnableAccount: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkEnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeAccounts.bulkEnableAcmeAccount(uuid).pipe(
        map(() => actions.receiveBulkEnableAccount(uuid)),
        catchError((err) =>
          of(
            actions.failBulkEnableAccount(
              extractError(err, "Failed to enable accounts")
            )
          )
        )
      )
    )
  );

const bulkDisableAccount: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkDisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeAccounts.bulkDisableAcmeAccount(uuid).pipe(
        map(() => actions.receiveBulkDisableAccount(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDisableAccount(
              extractError(err, "Failed to disable accounts")
            )
          )
        )
      )
    )
  );

const epics = [
  deleteAccount,
  enableAccount,
  disableAccount,
  bulkDeleteAccount,
  bulkDisableAccount,
  bulkEnableAccount,
  getAccountsList,
  getAccountDetail,
];

export default epics;
