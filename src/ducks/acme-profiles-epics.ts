import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./acme-profiles";
import history from "browser-history";
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
               ),
               catchError(
                  err => of(slice.actions.listAcmeProfilesFailed({ error: extractError(err, "Failed to get ACME Profiles list") }))

               )
            )

         )

      )

   );

}


const listAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAcmeProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getAcmeProfileFailed({ error: extractError(err, "Failed to get ACME Profile details") }))
            )

         )

      )

   );

}


const getAcmeProfileDetailFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAcmeProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               uuid => slice.actions.createAcmeProfileSuccess({ uuid }),
            ),
            catchError(
               err => of(slice.actions.createAcmeProfileFailed({ error: extractError(err, "Failed to create ACME Profile") }))
            )


         )

      )

   )

}


const createAcmeProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAcmeProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )
   );
}


const createAcmeProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAcmeProfileSuccess.match
      ),
      switchMap(

         action => {
            history.push(`./detail/${action.payload.uuid}`);
            return EMPTY;
         }

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

            map(
               acmeProfile => slice.actions.updateAcmeProfileSuccess({ acmeProfile: transformAcmeProfileDtoToModel(acmeProfile) })
            ),
            catchError(
               err => of(slice.actions.updateAcmeProfileFailed({ error: extractError(err, "Failed to update ACME Profile") }))
            )

         )

      )

   );

}


const updateAcmeProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAcmeProfileSuccess.match
      ),
      switchMap(

         action => {
            history.push(`../detail/${action.payload.acmeProfile.uuid}`);
            return EMPTY;
         }

      )

   )

}


const updateAcmeProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAcmeProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.deleteAcmeProfileSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.deleteAcmeProfileFailed({ error: extractError(err, "Failed to delete ACME Profile") }))
            )

         )

      )

   );

}


const deleteAcmeProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAcmeProfileSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}

const deleteAcmeProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAcmeProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.enableAcmeProfileFailed({ error: extractError(err, "Failed to enable ACME Profile") }))
            )

         )

      )

   )
}


const enableAcmeProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableAcmeProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

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

               err => of(slice.actions.disableAcmeProfileFailed({ error: extractError(err, "Failed to disable ACME Profile") }))

            )

         )

      )

   );

}


const disableAcmeProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableAcmeProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkDeleteAcmeProfilesFailed({ error: extractError(err, "Failed to delete ACME Accounts") }))
            )

         )

      )

   )

}


const bulkDeleteAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAcmeProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const bulkForceDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {


   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteAcmeProfiles.match
      ),
      switchMap(

         action => deps.apiClients.acmeProfiles.bulkForceDeleteAcmeProfiles(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkForceDeleteAcmeProfilesSuccess({ uuids: action.payload.uuids, redirect: action.payload.redirect })
            ),
            catchError(
               err => of(slice.actions.bulkForceDeleteAcmeProfilesFailed({ error: extractError(err, "Failed to delete ACME Accounts") }))
            )

         )

      )

   );

}


const bulkForceDeleteAcmeProfilesSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteAcmeProfilesSuccess.match
      ),
      switchMap(
         action => {
            if (action.payload.redirect) history.push(action.payload.redirect);
            return EMPTY;
         }

      )

   )

}

const bulkForceDeleteAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteAcmeProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkEnableAcmeProfilesFailed({ error: extractError(err, "Failed to enable ACME Accounts") }))
            )

         )

      )

   );

}


const bulkEnableAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableAcmeProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkDisableAcmeProfilesFailed({ error: extractError(err, "Failed to disable ACME Accounts") }))
            )

         )

      )

   );

}


const bulkDisableAcmeProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableAcmeProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listAcmeProfiles,
   listAcmeProfilesFailed,
   getAcmeProfileDetail,
   getAcmeProfileDetailFailed,
   updateAcmeProfile,
   updateAcmeProfileSuccess,
   updateAcmeProfileFailed,
   createAcmeProfile,
   createAcmeProfileFailed,
   createAcmeProfileSuccess,
   deleteAcmeProfile,
   deleteAcmeProfileSuccess,
   deleteAcmeProfileFailed,
   enableAcmeProfile,
   enableAcmeProfileFailed,
   disableAcmeProfile,
   disableAcmeProfileFailed,
   bulkDeleteAcmeProfiles,
   bulkDeleteAcmeProfilesFailed,
   bulkForceDeleteAcmeProfiles,
   bulkForceDeleteAcmeProfilesSuccess,
   bulkForceDeleteAcmeProfilesFailed,
   bulkEnableAcmeProfiles,
   bulkEnableAcmeProfilesFailed,
   bulkDisableAcmeProfiles,
   bulkDisableAcmeProfilesFailed
];


export default epics;
