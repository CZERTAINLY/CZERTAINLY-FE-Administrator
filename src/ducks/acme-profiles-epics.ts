import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./acme-profiles";
import { actions as appRedirectActions } from "./app-redirect";

import { transformAcmeProfileDtoToModel, transformAcmeProfileListDtoToModel } from "./transform/acme-profiles";
import { transformAttributeModelToDTO } from "./transform/attributes";


const listAcmeProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAcmeProfiles.match
      ),
      switchMap(

         () => deps.apiClients.acmeProfiles.getAcmeProfilesList().pipe(

            map(
               acmeProfiles => slice.actions.listAcmeProfilesSuccess(
                  { acmeProfileList: acmeProfiles.map(transformAcmeProfileListDtoToModel) }
               )
            ),

            catchError(
               error => of(
                  slice.actions.listAcmeProfilesFailure({ error: extractError(error, "Failed to get ACME Profiles list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get ACME Profiles list" })
               )
            )

         )

      )

   );

}


const getAcmeProfileDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAcmeProfile.match
      ),

      switchMap(

         action => deps.apiClients.acmeProfiles.getAcmeProfileDetail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getAcmeProfileSuccess({ acmeProfile: transformAcmeProfileDtoToModel(detail) })
            ),

            catchError(
               error => of(
                  slice.actions.getAcmeProfileFailure({ error: extractError(error, "Failed to get ACME Profile details") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get ACME Profile details" })
               )
            )

         )

      )

   );

}


const createAcmeProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAcmeProfile.match
      ),

      switchMap(

         action => deps.apiClients.acmeProfiles.createAcmeProfile(
            action.payload.name,
            action.payload.issueCertificateAttributes.map(transformAttributeModelToDTO),
            action.payload.revokeCertificateAttributes.map(transformAttributeModelToDTO),
            action.payload.description,
            action.payload.termsOfServiceUrl,
            action.payload.websiteUrl,
            action.payload.dnsResolverIp,
            action.payload.dnsResolverPort,
            action.payload.raProfileUuid,
            action.payload.retryInterval,
            action.payload.validity,
            action.payload.requireContact,
            action.payload.requireTermsOfService
         ).pipe(

            mergeMap(
               acmeProfile => of(
                  slice.actions.createAcmeProfileSuccess({ uuid: acmeProfile.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${acmeProfile.uuid}` })
               )
            ),

            catchError(
               error => of(
                  slice.actions.createAcmeProfileFailure({ error: extractError(error, "Failed to create ACME Profile") }),
                  appRedirectActions.fetchError({ error, message: "Failed to create ACME Profile" })
               )
            )


         )

      )

   )

}


const updateAcmeProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAcmeProfile.match
      ),

      switchMap(

         action => deps.apiClients.acmeProfiles.updateAcmeProfile(
            action.payload.uuid,
            action.payload.issueCertificateAttributes.map(transformAttributeModelToDTO),
            action.payload.revokeCertificateAttributes.map(transformAttributeModelToDTO),
            action.payload.description,
            action.payload.termsOfServiceUrl,
            action.payload.websiteUrl,
            action.payload.dnsResolverIp,
            action.payload.dnsResolverPort,
            action.payload.raProfileUuid,
            action.payload.retryInterval,
            action.payload.termsOfServiceChangeDisable,
            action.payload.termsOfServiceChangeUrl,
            action.payload.validity,
            action.payload.requireContact,
            action.payload.requireTermsOfService

         ).pipe(

            mergeMap(
               acmeProfile => of(
                  slice.actions.updateAcmeProfileSuccess({ acmeProfile: transformAcmeProfileDtoToModel(acmeProfile) }),
                  appRedirectActions.redirect({ url: `../../detail/${acmeProfile.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.updateAcmeProfileFailure({ error: extractError(err, "Failed to update ACME Profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update ACME Profile" })
               )
            )

         )

      )

   );

}


const deleteAcmeProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAcmeProfile.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.deleteAcmeProfile(action.payload.uuid).pipe(

            mergeMap(
               () => of(
                  slice.actions.deleteAcmeProfileSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
               )
            ),

            catchError(
               err => of(
                  slice.actions.deleteAcmeProfileFailure({ error: extractError(err, "Failed to delete ACME Profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete ACME Profile" })
               )
            )

         )

      )

   );

}


const enableAcmeProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAcmeProfile.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.enableAcmeProfile(action.payload.uuid).pipe(

            map(
               () => slice.actions.enableAcmeProfileSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.enableAcmeProfileFailure({ error: extractError(err, "Failed to enable ACME Profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to enable ACME Profile" })
               )
            )

         )

      )

   )
}


const disableAcmeProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableAcmeProfile.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.disableAcmeProfile(action.payload.uuid).pipe(

            map(
               () => slice.actions.disableAcmeProfileSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.disableAcmeProfileFailure({ error: extractError(err, "Failed to disable ACME Profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to disable ACME Profile" })
               )
            )

         )

      )

   );

}


const bulkDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAcmeProfiles.match
      ),

      switchMap(

         action => deps.apiClients.acmeProfiles.bulkDeleteAcmeProfiles(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteAcmeProfilesSuccess({ uuids: action.payload.uuids, errors })
            ),

            catchError(
               err => of(
                  slice.actions.bulkDeleteAcmeProfilesFailure({ error: extractError(err, "Failed to delete ACME Accounts") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete ACME Accounts" })
               )
            )

         )

      )

   )

}


const bulkForceDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {


   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteAcmeProfiles.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.bulkForceDeleteAcmeProfiles(action.payload.uuids).pipe(

            mergeMap(

               () => iif(

                  () => !!action.payload.redirect,

                  of(
                     slice.actions.bulkForceDeleteAcmeProfilesSuccess({ uuids: action.payload.uuids, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! })
                  ),
                  of(
                     slice.actions.bulkForceDeleteAcmeProfilesSuccess({ uuids: action.payload.uuids, redirect: action.payload.redirect })
                  )

               )
            ),

            catchError(
               err => of(
                  slice.actions.bulkForceDeleteAcmeProfilesFailure({ error: extractError(err, "Failed to delete ACME Accounts") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete ACME Accounts" })
               )
            )

         )

      )

   );

}


const bulkEnableAcmeProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAcmeProfiles.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.bulkEnableAcmeProfile(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkEnableAcmeProfilesSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(
                  slice.actions.bulkEnableAcmeProfilesFailure({ error: extractError(err, "Failed to enable ACME Accounts") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to enable ACME Accounts" })
               )
            )

         )

      )

   );

}


const bulkDisableAcmeProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAcmeProfiles.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.bulkDisableAcmeProfile(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkDisableAcmeProfilesSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(
                  slice.actions.bulkDisableAcmeProfilesFailure({ error: extractError(err, "Failed to disable ACME Accounts") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to disable ACME Accounts" })
               )
            )

         )

      )

   );

}


const epics = [
   listAcmeProfiles,
   getAcmeProfileDetail,
   updateAcmeProfile,
   createAcmeProfile,
   deleteAcmeProfile,
   enableAcmeProfile,
   disableAcmeProfile,
   bulkDeleteAcmeProfiles,
   bulkForceDeleteAcmeProfiles,
   bulkEnableAcmeProfiles,
   bulkDisableAcmeProfiles,
];


export default epics;
