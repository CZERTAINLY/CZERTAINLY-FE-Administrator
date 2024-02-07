import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';
import { extractError } from 'utils/net';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './acme-accounts';
import { actions as appRedirectActions } from './app-redirect';
import { transformAcmeAccountListResponseDtoToModel, transformAcmeAccountResponseDtoToModel } from './transform/acme-accounts';
import { actions as userInterfaceActions } from './user-interface';

const listAcmeAccounts: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAcmeAccounts.match),
        switchMap(() =>
            deps.apiClients.acmeAccounts.listAcmeAccounts().pipe(
                switchMap((accounts) =>
                    of(
                        slice.actions.listAcmeAccountsSuccess({
                            acmeAccounts: accounts.map(transformAcmeAccountListResponseDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfACMEAccounts),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listAcmeAccountsFailed({ error: extractError(error, 'Failed to get ACME Accounts list') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfACMEAccounts),
                    ),
                ),
            ),
        ),
    );
};

const getAccountDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAcmeAccount.match),
        switchMap((action) =>
            deps.apiClients.acmeAccounts
                .getAcmeAccount({ acmeProfileUuid: action.payload.acmeProfileUuid, acmeAccountUuid: action.payload.uuid })
                .pipe(
                    switchMap((detail) =>
                        of(
                            slice.actions.getAcmeAccountSuccess({ acmeAccount: transformAcmeAccountResponseDtoToModel(detail) }),
                            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ACMEAccountDetails),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.getAcmeAccountFailed({ error: extractError(error, 'Failed to get ACME Account details') }),
                            userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ACMEAccountDetails),
                        ),
                    ),
                ),
        ),
    );
};

const revokeAcmeAccount: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.revokeAcmeAccount.match),

        switchMap((action) =>
            deps.apiClients.acmeAccounts
                .revokeAcmeAccount({ acmeProfileUuid: action.payload.acmeProfileUuid, acmeAccountUuid: action.payload.uuid })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.revokeAcmeAccountSuccess({
                                acmeProfileUuid: action.payload.acmeProfileUuid,
                                uuid: action.payload.uuid,
                            }),
                            slice.actions.getAcmeAccount({ acmeProfileUuid: action.payload.acmeProfileUuid, uuid: action.payload.uuid }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.revokeAcmeAccountFailed({ error: extractError(error, 'Failed to revoke ACME Account') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to revoke ACME Account' }),
                        ),
                    ),
                ),
        ),
    );
};

const enableAcmeAccount: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableAcmeAccount.match),
        switchMap((action) =>
            deps.apiClients.acmeAccounts
                .enableAcmeAccount({ acmeProfileUuid: action.payload.acmeProfileUuid, acmeAccountUuid: action.payload.uuid })
                .pipe(
                    map(() => slice.actions.enableAcmeAccountSuccess({ uuid: action.payload.uuid })),

                    catchError((error) =>
                        of(
                            slice.actions.enableAcmeAccountFailed({ error: extractError(error, 'Failed to enable ACME Account') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to enable ACME Account' }),
                        ),
                    ),
                ),
        ),
    );
};

const disableAcmeAccount: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableAcmeAccount.match),
        switchMap((action) =>
            deps.apiClients.acmeAccounts
                .disableAcmeAccount({ acmeProfileUuid: action.payload.acmeProfileUuid, acmeAccountUuid: action.payload.uuid })
                .pipe(
                    map(() => slice.actions.disableAcmeAccountSuccess({ uuid: action.payload.uuid })),

                    catchError((error) =>
                        of(
                            slice.actions.disableAcmeAccountFailed({ error: extractError(error, 'Failed to disable ACME Account') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to disable ACME Account' }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkRevokeAcmeAccounts: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkRevokeAcmeAccounts.match),
        switchMap((action) =>
            deps.apiClients.acmeAccounts.bulkRevokeAcmeAccount({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkRevokeAcmeAccountsSuccess({ uuids: action.payload.uuids })),

                catchError((error) =>
                    of(
                        slice.actions.bulkRevokeAcmeAccountsFailed({ error: extractError(error, 'Failed to revoke ACME Accounts') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to revoke ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableAcmeAccounts: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableAcmeAccounts.match),
        switchMap((action) =>
            deps.apiClients.acmeAccounts.bulkEnableAcmeAccount({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableAcmeAccountsSuccess({ uuids: action.payload.uuids })),

                catchError((error) =>
                    of(
                        slice.actions.bulkEnableAcmeAccountsFailed({ error: extractError(error, 'Failed to enable ACME Accounts') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableAcmeAccounts: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableAcmeAccounts.match),
        switchMap((action) =>
            deps.apiClients.acmeAccounts.bulkDisableAcmeAccount({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableAcmeAccountsSuccess({ uuids: action.payload.uuids })),

                catchError((error) =>
                    of(
                        slice.actions.bulkDisableAcmeAccountsFailed({ error: extractError(error, 'Failed to disable ACME Accounts') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listAcmeAccounts,
    getAccountDetail,
    revokeAcmeAccount,
    enableAcmeAccount,
    disableAcmeAccount,
    bulkRevokeAcmeAccounts,
    bulkEnableAcmeAccounts,
    bulkDisableAcmeAccounts,
];

export default epics;
