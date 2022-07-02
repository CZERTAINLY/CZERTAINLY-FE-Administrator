import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import history from "browser-history";

import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./acme-accounts";
import { actions as alertActions } from "./alerts";
import { transformAcmeAccountDtoToModel, transformAcmeAccountListDtoToModel } from "./transform/acme-accounts";

const listAcmeAccounts: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAcmeAccounts.match
      ),
      switchMap(

         () => deps.apiClients.acmeAccounts.getAcmeAccountList().pipe(

            map(
               accounts => slice.actions.listAcmeAccountsSuccess({
                  acmeAccounts: accounts.map(transformAcmeAccountListDtoToModel)
               })
            ),

            catchError(
               err => of(slice.actions.listAcmeAccountsFailed({ error: extractError(err, "Failed to get ACME Accounts list") }))
            )


         )

      )

   );

}


const listAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAcmeAccountsFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const getAccountDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAcmeAccount.match
      ),
      switchMap(

         action =>

            deps.apiClients.acmeAccounts.getAcmeAccountDetails(action.payload.uuid).pipe(

               map(
                  detail => slice.actions.getAcmeAccountSuccess({ acmeAccount: transformAcmeAccountDtoToModel(detail) })
               ),

               catchError(
                  err => of(slice.actions.getAcmeAccountFailed({ error: extractError(err, "Failed to get ACME Account details") }))
               )

            )

      )

   );

}


const getAccountDetailFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAcmeAccountFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const revokeAcmeAccount: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.revokeAcmeAccount.match
      ),

      switchMap(

         action => deps.apiClients.acmeAccounts.revokeAcmeAccount(action.payload.uuid).pipe(

            map(
               () => slice.actions.revokeAcmeAccountSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.revokeAcmeAccountFailed({ error: extractError(err, "Failed to revoke ACME Account") }))
            )

         )

      )

   );

}


const revokeAcmeAccountSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.revokeAcmeAccountSuccess.match
      ),
      map(
         action => slice.actions.getAcmeAccount({ uuid: action.payload.uuid })
      ),

   )

}


const revokeAcmeAccountFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.revokeAcmeAccountFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const enableAcmeAccount: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAcmeAccount.match
      ),
      switchMap(

         action => deps.apiClients.acmeAccounts.enableAcmeAccount(action.payload.uuid).pipe(

            map(
               () => slice.actions.enableAcmeAccountSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.enableAcmeAccountFailed({ error: extractError(err, "Failed to enable ACME Account") }))
            )

         )

      )

   );

}


const enableAcmeAccountFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAcmeAccountFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const disableAcmeAccount: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableAcmeAccount.match
      ),
      switchMap(

         action => deps.apiClients.acmeAccounts.disableAcmeAccount(action.payload.uuid).pipe(

            map(
               () => slice.actions.disableAcmeAccountSuccess({ uuid: action.payload.uuid })
            ),
            catchError(

               err => of(slice.actions.disableAcmeAccountFailed({ error: extractError(err, "Failed to disable ACME Account") }))
            )

         )

      )

   );

}


const disableAcmeAccountFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(
      filter(
         slice.actions.disableAcmeAccountFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )
   );
}


const bulkRevokeAcmeAccounts: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkRevokeAcmeAccounts.match
      ),
      switchMap(

         action => deps.apiClients.acmeAccounts.bulkRevokeAcmeAccount(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkRevokeAcmeAccountsSuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkRevokeAcmeAccountsFailed({ error: extractError(err, "Failed to revoke ACME Accounts") }))
            )

         )

      )

   );




}


const bulkRevokeAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkRevokeAcmeAccountsFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const bulkEnableAcmeAccounts: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAcmeAccounts.match
      ),
      switchMap(

         action => deps.apiClients.acmeAccounts.bulkEnableAcmeAccount(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkEnableAcmeAccountsSuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkEnableAcmeAccountsFailed({ error: extractError(err, "Failed to enable ACME Accounts") }))
            )

         )

      )

   );

}


const bulkEnableAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAcmeAccountsFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const bulkDisableAcmeAccounts: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAcmeAccounts.match
      ),
      switchMap(

         action => deps.apiClients.acmeAccounts.bulkDisableAcmeAccount(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkDisableAcmeAccountsSuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkDisableAcmeAccountsFailed({ error: extractError(err, "Failed to disable ACME Accounts") }))
            )

         )

      )

   );

}


const bulkDisableAcmeAccountsFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAcmeAccountsFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listAcmeAccounts,
   getAccountDetail,
   revokeAcmeAccount,
   revokeAcmeAccountSuccess,
   enableAcmeAccount,
   disableAcmeAccount,
   bulkRevokeAcmeAccounts,
   bulkEnableAcmeAccounts,
   bulkDisableAcmeAccounts,
   listAcmeAccountsFailed,
   getAccountDetailFailed,
   revokeAcmeAccountFailed,
   enableAcmeAccountFailed,
   disableAcmeAccountFailed,
   bulkRevokeAcmeAccountsFailed,
   bulkEnableAcmeAccountsFailed,
   bulkDisableAcmeAccountsFailed
];


export default epics;
