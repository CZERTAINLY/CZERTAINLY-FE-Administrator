import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./ra-profiles";
import history from "browser-history";
import { transformRaAuthorizedClientDtoToModel, transformRaProfileDtoToModel } from "./transform/ra-profiles";
import { transformAttributeDescriptorDTOToModel } from "./transform/attributes";


const listProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listProfiles.match
      ),
      switchMap(

         () => deps.apiClients.profiles.getRaProfilesList().pipe(

            map(list => slice.actions.listProfilesSuccess(list.map(profile => transformRaProfileDtoToModel(profile)))),

            catchError((err) => of(slice.actions.listProfilesFailure(extractError(err, "Failed to get RA profiles list"))))
         )
      )
   );

}


const listProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )
   );

}


const getProfileDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getProfileDetail.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getRaProfileDetail(action.payload).pipe(

            map(profileDto => slice.actions.getProfileDetailSuccess(transformRaProfileDtoToModel(profileDto))),

            catchError(err => of(slice.actions.getProfileDetailFailure(extractError(err, "Failed to get RA Profile detail"))))

         )
      )

   );

}


const getProfileDetailFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getProfileDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const listAuthorizedClients: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAuthorizedClients.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getAuthorizedClients(action.payload).pipe(

            map(clients => slice.actions.listAuthorizedClientsSuccess(clients.map(client => transformRaAuthorizedClientDtoToModel(client)))),

            catchError(err => of(slice.actions.listAuthorizedClientsFailure(extractError(err, "Failed to get list of authorized clients"))))
         )

      )

   );
}


const listAuthorizedClientsFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAuthorizedClientsFailure.match
      ),

      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const createProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createProfile.match
      ),

      switchMap(

         action => deps.apiClients.profiles.createRaProfile(
            action.payload.authorityInstanceUuid,
            action.payload.name,
            action.payload.attributes,
            action.payload.description
         ).pipe(

            map(uuid => slice.actions.createProfileSuccess(uuid)),

            catchError(err => of(slice.actions.createProfileFailure(extractError(err, "Failed to create profile"))))
         )
      )

   );

}


const createProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createProfileSuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload}`);
            return EMPTY;
         }

      )

   )

}


const createProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(
      filter(
         slice.actions.createProfileFailure.match
      ),

      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}



const updateProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.editProfile.match
      ),
      switchMap(

         action => deps.apiClients.profiles.updateRaProfile(
            action.payload.profileUuid,
            action.payload.authorityInstanceUuid,
            action.payload.attributes,
            action.payload.enabled,
            action.payload.description
         ).pipe(

            map(raProfileDTO => slice.actions.editProfileSuccess(transformRaProfileDtoToModel(raProfileDTO))),

            catchError(err => of(slice.actions.editProfileFailure(extractError(err, "Failed to update profile"))))

         )

      )

   );

}


const updateProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.editProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const enableProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableProfile.match
      ),

      switchMap(

         action => deps.apiClients.profiles.enableRaProfile(action.payload).pipe(

            map(() => slice.actions.enableProfileSuccess(action.payload)),

            catchError(err => of(slice.actions.enableProfileFailure(extractError(err, "Failed to enable profile"))))

         )
      )

   );

}


const enableProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )
   );

}


const disableProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableProfile.match
      ),

      switchMap(

         action => deps.apiClients.profiles.disableRaProfile(action.payload).pipe(

            map(() => slice.actions.disableProfileSuccess(action.payload)),

            catchError(err => of(slice.actions.enableProfileFailure(extractError(err, "Failed to disable profile"))))

         )
      )

   );

}


const disableProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableProfileFailure.match
      ),

      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const deleteProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteProfile.match
      ),
      switchMap(

         action => deps.apiClients.profiles.deleteRaProfile(action.payload).pipe(

            map(() => slice.actions.deleteProfileSuccess(action.payload)),

            catchError(err => of(slice.actions.deleteProfileFailure(extractError(err, "Failed to delete profile"))))

         )

      )

   );

}


const deleteProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const activateAcme: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.activateAcme.match
      ),
      switchMap(

         action => deps.apiClients.profiles.activateAcme(
            action.payload.uuid,
            action.payload.acmeProfileUuid,
            action.payload.issueCertificateAttributes,
            action.payload.revokeCertificateAttributes
         ).pipe(

            map(raAcmeLink => slice.actions.activateAcmeSuccess(raAcmeLink)),

            catchError((err) => of(slice.actions.activateAcmeFailure(extractError(err, "Failed to activate ACME"))))

         )

      )

   );

}



const activateAcmeFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.activateAcmeFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const deactivateAcme: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deactivateAcme.match
      ),
      switchMap(

         action => deps.apiClients.profiles.deactivateAcme(action.payload).pipe(

            map(() => slice.actions.deactivateAcmeSuccess(action.payload)),

            catchError(err => of(slice.actions.deactivateAcmeFailure(extractError(err, "Failed to deactivate ACME"))))

         )

      )

   );

}


const deactivateAcmeFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deactivateAcmeFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const listIssuanceAttributes: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listIssuanceAttributes.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getIssueAttributes(action.payload).pipe(

            map(issuanceAttributes => slice.actions.listIssuanceAttributesSuccess(issuanceAttributes.map(issuanceAttribute => transformAttributeDescriptorDTOToModel(issuanceAttribute)))),

            catchError((err) => of(slice.actions.listIssuanceAttributesFailure(extractError(err, "Failed to list issuance attributes"))))

         )
      )

   );

}


const listIssuanceAttributesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listIssuanceAttributesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const listRevocationAttributes: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRevocationAttributes.match
      ),

      switchMap(

         action => deps.apiClients.profiles.getRevocationAttributes(action.payload).pipe(

            map(revocationAttributes => slice.actions.listRevocationAttributesSuccess(revocationAttributes.map(revocationAttribute => transformAttributeDescriptorDTOToModel(revocationAttribute)))),

            catchError(err => of(slice.actions.listRevocationAttributesFailure(extractError(err, "Failed to list revocation attributes"))))

         )

      )

   );

}


const listRevocationAttributesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRevocationAttributesFailure.match
      ),

      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const bulkEnableProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableProfiles.match
      ),
      switchMap(

         action => deps.apiClients.profiles.bulkEnableRaProfile(action.payload).pipe(

            map(() => slice.actions.bulkEnableProfilesSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkEnableProfilesFailure(extractError(err, "Failed to enable profiles"))))

         )

      )

   );

}


const bulkEnableProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const bulkDisableProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableProfiles.match
      ),

      switchMap(

         action => deps.apiClients.profiles.bulkDisableRaProfile(action.payload).pipe(

            map(() => slice.actions.bulkDisableProfilesSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDisableProfilesFailure(extractError(err, "Failed to disable profiles"))))

         )

      )

   );

}


const bulkDisableProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const bulkDeleteProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteProfiles.match
      ),
      switchMap(

         action => deps.apiClients.profiles.bulkDeleteRaProfile(action.payload).pipe(

            map(() => slice.actions.bulkDeleteProfilesSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkDeleteProfilesFailure(extractError(err, "Failed to delete profiles"))))

         )
      )

   );

}


const bulkDeleteProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const epics = [
   listProfiles,
   listProfilesFailure,
   listAuthorizedClients,
   listAuthorizedClientsFailure,
   getProfileDetail,
   getProfileDetailFailure,
   createProfile,
   createProfileFailure,
   createProfileSuccess,
   updateProfile,
   updateProfileFailure,
   enableProfile,
   enableProfileFailure,
   disableProfile,
   disableProfileFailure,
   deleteProfile,
   deleteProfileFailure,
   activateAcme,
   activateAcmeFailure,
   deactivateAcme,
   deactivateAcmeFailure,
   listIssuanceAttributes,
   listIssuanceAttributesFailure,
   listRevocationAttributes,
   listRevocationAttributesFailure,
   bulkEnableProfiles,
   bulkEnableProfilesFailure,
   bulkDisableProfiles,
   bulkDisableProfilesFailure,
   bulkDeleteProfiles,
   bulkDeleteProfilesFailure
];

export default epics;