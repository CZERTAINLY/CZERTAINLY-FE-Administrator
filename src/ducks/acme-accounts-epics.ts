import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./acme-accounts";
import { actions as alertActions } from "./alerts";
import { transformAcmeAccountDtoToModel, transformAcmeAccountListDtoToModel } from "./transform/acme-accounts";

const listAcmeAccounts: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.listAcmeAccounts.match),
    switchMap(() =>
      deps.apiClients.acmeAccounts.getAcmeAccountList().pipe(
        map((accounts) =>
          Array.isArray(accounts)
            ? slice.actions.listAcmeAccountsSuccess(accounts.map(accountDto => transformAcmeAccountListDtoToModel(accountDto)))
            : slice.actions.listAcmeAccountsFailed("Failed to get ACME Accounts list")
        ),
        catchError((err) =>
          of(
            slice.actions.listAcmeAccountsFailed(
              extractError(err, "Failed to get ACME Accounts list")
            )
          )
        )
      )
    )
  );
}

const listAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.listAcmeAccountsFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const getAccountDetail: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.getAcmeAccount.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.getAcmeAccountDetails(payload).pipe(
        map((detail) => {
          try {
            return slice.actions.getAcmeAccountSuccess(transformAcmeAccountDtoToModel(detail));
          } catch (err) {
            return slice.actions.getAcmeAccountFailed(
              "Failed to get ACME Account details"
            );
          }
        }),
        catchError((err) =>
          of(
            slice.actions.getAcmeAccountFailed(
              extractError(err, "Failed to get ACME Account details")
            )
          )
        )
      )
    )
  );
}

const getAccountDetailFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.getAcmeAccountFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const deleteAcmeAccount: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.deleteAcmeAccount.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.revokeAcmeAccount(payload).pipe(
        map(() => slice.actions.deleteAcmeAccountSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.deleteAcmeAccountFailed(
              extractError(err, "Failed to delete ACME Account")
            )
          )
        )
      )
    )
  );
}


const deleteAcmeAccountFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.deleteAcmeAccountFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const enableAcmeAccount: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.enableAcmeAccount.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.enableAcmeAccount(payload).pipe(
        map(() => slice.actions.enableAcmeAccountSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.enableAcmeAccountFailed(
              extractError(err, "Failed to enable ACME Account")
            )
          )
        )
      )
    )
  );
}


const enableAcmeAccountFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.enableAcmeAccountFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const disableAcmeAccount: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.disableAcmeAccount.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.disableAcmeAccount(payload).pipe(
        map(() => slice.actions.disableAcmeAccountSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.disableAcmeAccountFailed(
              extractError(err, "Failed to disable ACME Account")
            )
          )
        )
      )
    )
  );
}


const disableAcmeAccountFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.disableAcmeAccountFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkDeleteAcmeAccounts: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDeleteAcmeAccounts.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.bulkRevokeAcmeAccount(payload).pipe(
        map(() => slice.actions.bulkDeleteAcmeAccountsSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkDeleteAcmeAccountsFailed(
              extractError(err, "Failed to delete ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkDeleteAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDeleteAcmeAccountsFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkEnableAcmeAccounts: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkEnableAcmeAccounts.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.bulkEnableAcmeAccount(payload).pipe(
        map(() => slice.actions.bulkEnableAcmeAccountsSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkEnableAcmeAccountsFailed(
              extractError(err, "Failed to enable ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkEnableAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkEnableAcmeAccountsFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const bulkDisableAcmeAccounts: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDisableAcmeAccounts.match),
    switchMap(({ payload }) =>
      deps.apiClients.acmeAccounts.bulkDisableAcmeAccount(payload).pipe(
        map(() => slice.actions.bulkDisableAcmeAccountsSuccess(payload)),
        catchError((err) =>
          of(
            slice.actions.bulkDisableAcmeAccountsFailed(
              extractError(err, "Failed to disable ACME Accounts")
            )
          )
        )
      )
    )
  );
}


const bulkDisableAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {
  return action$.pipe(
    filter(slice.actions.bulkDisableAcmeAccountsFailed.match),
    map(
      action => alertActions.error(action.payload || "Unexpected error occurred")
    )
  );
}


const epics = [
  listAcmeAccounts,
  getAccountDetail,
  deleteAcmeAccount,
  enableAcmeAccount,
  disableAcmeAccount,
  bulkDeleteAcmeAccounts,
  bulkEnableAcmeAccounts,
  bulkDisableAcmeAccounts,
  listAcmeAccountsFailed,
  getAccountDetailFailed,
  deleteAcmeAccountFailed,
  enableAcmeAccountFailed,
  disableAcmeAccountFailed,
  bulkDeleteAcmeAccountsFailed,
  bulkEnableAcmeAccountsFailed,
  bulkDisableAcmeAccountsFailed
];

export default epics;
