import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./ra-profiles";
import { actions as appRedirectActions } from "./app-redirect";

import { transformRaAcmeLinkDtoToModel, transformRaAuthorizedClientDtoToModel, transformRaProfileDtoToModel } from "./transform/ra-profiles";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transfromRaAcmeLinkDtoToModel } from "./transform/acme-profiles";
import { transformRaComplianceProfileDtoToModel } from "./transform/compliance-profiles";


const listRaProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRaProfiles.match
      ),
      switchMap(

         () => deps.apiClients.profiles.getRaProfilesList().pipe(

            map(
               list => slice.actions.listRaProfilesSuccess({
                  raProfiles: list.map(transformRaProfileDtoToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listRaProfilesFailure({ error: extractError(error, "Failed to get RA profiles list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get RA profiles list" })
               )
            )
         )
      )
   );

}


const getRaProfileDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getRaProfileDetail.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getRaProfileDetail(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               profileDto => slice.actions.getRaProfileDetailSuccess({
                  raProfile: transformRaProfileDtoToModel(profileDto)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getRaProfileDetailFailure({ error: extractError(err, "Failed to get RA Profile detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get RA Profile detail" })
               )
            )

         )
      )

   );

}


const listAuthorizedClients: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAuthorizedClients.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getAuthorizedClients(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               clients => slice.actions.listAuthorizedClientsSuccess({
                  authorizedClientsUuids: clients.map(transformRaAuthorizedClientDtoToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.listAuthorizedClientsFailure({ error: extractError(err, "Failed to get list of authorized clients") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get list of authorized clients" })
               )
            )
         )

      )

   );
}


const createRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createRaProfile.match
      ),

      switchMap(

         action => deps.apiClients.profiles.createRaProfile(
            action.payload.authorityInstanceUuid,
            action.payload.name,
            action.payload.attributes.map(transformAttributeModelToDTO),
            action.payload.description
         ).pipe(

            mergeMap(
               obj => of(
                  slice.actions.createRaProfileSuccess({ uuid: obj.uuid, authorityInstanceUuid: action.payload.authorityInstanceUuid }),
                  appRedirectActions.redirect({ url: `../detail/${action.payload.authorityInstanceUuid}/${obj.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.createRaProfileFailure({ error: extractError(err, "Failed to create profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create profile" })
               )
            )
         )
      )

   );

}


const updateRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.profiles.updateRaProfile(
            action.payload.profileUuid,
            action.payload.authorityInstanceUuid,
            action.payload.attributes.map(transformAttributeModelToDTO),
            action.payload.enabled,
            action.payload.description
         ).pipe(

            mergeMap(

               raProfileDTO => iif(

                  () => !!action.payload.redirect,
                  of(

                     slice.actions.updateRaProfileSuccess({
                        raProfile: transformRaProfileDtoToModel(raProfileDTO),
                        redirect: action.payload.redirect
                     }),

                     appRedirectActions.redirect({ url: action.payload.redirect! })

                  ),
                  of(
                     slice.actions.updateRaProfileSuccess({
                        raProfile: transformRaProfileDtoToModel(raProfileDTO),
                        redirect: action.payload.redirect
                     })
                  )
               )

            ),

            catchError(
               err => of(slice.actions.updateRaProfileFailure({ error: extractError(err, "Failed to update profile") }))
            )

         )

      )

   );

}


const enableRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableRaProfile.match
      ),

      switchMap(

         action => deps.apiClients.profiles.enableRaProfile(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               () => slice.actions.enableRaProfileSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.enableRaProfileFailure({ error: extractError(err, "Failed to enable profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to enable profile" })
               )
            )

         )
      )

   );

}


const disableRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableRaProfile.match
      ),

      switchMap(

         action => deps.apiClients.profiles.disableRaProfile(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               () => slice.actions.disableRaProfileSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.enableRaProfileFailure({ error: extractError(err, "Failed to disable profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to disable profile" })
               )
            )

         )
      )

   );

}


const deleteRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.profiles.deleteRaProfile(action.payload.authorityUuid, action.payload.uuid).pipe(

            mergeMap(

               () => iif(

                  () => !!action.payload.redirect,
                  of(
                     slice.actions.deleteRaProfileSuccess({ uuid: action.payload.uuid }),
                     appRedirectActions.redirect({ url: action.payload.redirect! })
                  ),
                  of(
                     slice.actions.deleteRaProfileSuccess({ uuid: action.payload.uuid })
                  )
               )

            ),

            catchError(
               err => of(
                  slice.actions.deleteRaProfileFailure({ error: extractError(err, "Failed to delete profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete profile" })
               )
            )

         )

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
            action.payload.authorityUuid,
            action.payload.uuid,
            action.payload.acmeProfileUuid,
            action.payload.issueCertificateAttributes.map(transformAttributeModelToDTO),
            action.payload.revokeCertificateAttributes.map(transformAttributeModelToDTO),
         ).pipe(

            map(
               raAcmeLink => slice.actions.activateAcmeSuccess({
                  raAcmelink: transformRaAcmeLinkDtoToModel(raAcmeLink)
               })
            ),

            catchError(
               err => of(
                  slice.actions.activateAcmeFailure({ error: extractError(err, "Failed to activate ACME") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to activate ACME" })
               )
            )

         )

      )

   );

}


const deactivateAcme: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deactivateAcme.match
      ),
      switchMap(

         action => deps.apiClients.profiles.deactivateAcme(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               () => slice.actions.deactivateAcmeSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(
                  slice.actions.deactivateAcmeFailure({ error: extractError(err, "Failed to deactivate ACME") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to deactivate ACME" })
               )
            )

         )

      )

   );

}


const getAcmeDetails: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAcmeDetails.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getRaAcmeProfile(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               acmeDetails => slice.actions.getAcmeDetailsSuccess({
                  raAcmeLink: transfromRaAcmeLinkDtoToModel(acmeDetails)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getAcmeDetailsFailure({ error: extractError(err, "Failed to get ACME details") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get ACME details" })
               )
            )

         )

      )

   );

}



const listIssuanceAttributeDescriptors: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listIssuanceAttributeDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getIssueAttributes(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               issuanceAttributes => slice.actions.listIssuanceAttributesDescriptorsSuccess({
                  uuid: action.payload.uuid,
                  attributesDescriptors: issuanceAttributes.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.listIssuanceAttributesFailure({ error: extractError(err, "Failed to list issuance attributes") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to list issuance attributes" })
               )
            )

         )
      )

   );

}


const listRevocationAttributeDescriptors: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRevocationAttributeDescriptors.match
      ),

      switchMap(

         action => deps.apiClients.profiles.getRevocationAttributes(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               revocationAttributes => slice.actions.listRevocationAttributeDescriptorsSuccess({
                  uuid: action.payload.uuid,
                  attributesDescriptors: revocationAttributes.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.listRevocationAttributeDescriptorsFailure({ error: extractError(err, "Failed to list revocation attributes") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to list revocation attributes" })
               )
            )

         )

      )

   );

}



const bulkEnableProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableRaProfiles.match
      ),
      switchMap(

         action => deps.apiClients.profiles.bulkEnableRaProfile(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkEnableRaProfilesSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(
                  slice.actions.bulkEnableRaProfilesFailure({ error: extractError(err, "Failed to enable profiles") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to enable profiles" })
               )
            )

         )

      )

   );

}


const bulkDisableProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableRaProfiles.match
      ),

      switchMap(

         action => deps.apiClients.profiles.bulkDisableRaProfile(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkDisableRaProfilesSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(
                  slice.actions.bulkDisableRaProfilesFailure({ error: extractError(err, "Failed to disable profiles") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to disable profiles" })
               )
            )

         )

      )

   );

}


const bulkDeleteProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteRaProfiles.match
      ),
      switchMap(

         action => deps.apiClients.profiles.bulkDeleteRaProfile(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteRaProfilesSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(
                  slice.actions.bulkDeleteRaProfilesFailure({ error: extractError(err, "Failed to delete profiles") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete profiles" })
               )
            )

         )
      )

   );

}


const checkCompliance: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkCompliance.match
      ),
      switchMap(

         action => deps.apiClients.profiles.checkCompliance(
            action.payload.uuids
         ).pipe(

            map(
               () => slice.actions.checkComplianceSuccess()
            ),

            catchError(
               err => of(
                  slice.actions.checkComplianceFailed({ error: extractError(err, "Failed to start compliance check") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to start compliance check" })
               )

            )

         )

      )

   )
}


const associateRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.associateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.associateComplianceProfileToRaProfile(
            action.payload.complianceProfileUuid,
            [action.payload.uuid]
         ).pipe(

            map(
               () => slice.actions.associateRaProfileSuccess({
                  uuid: action.payload.uuid,
                  complianceProfileUuid: action.payload.complianceProfileUuid,
                  complianceProfileName: action.payload.complianceProfileName,
                  description: action.payload.description
               })
            ),

            catchError(
               err => of(
                  slice.actions.associateRaProfileFailed({ error: extractError(err, "Failed to associate RA Profile to Compliance Profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to associate RA Profile to Compliance Profile" })
               )
            )

         )

      )

   )
}


const dissociateRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.dissociateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.dissociateComplianceProfileFromRaProfile(
            action.payload.complianceProfileUuid,
            [action.payload.uuid]
         ).pipe(

            map(
               () => slice.actions.dissociateRaProfileSuccess({ uuid: action.payload.uuid, complianceProfileUuid: action.payload.complianceProfileUuid, complianceProfileName: action.payload.complianceProfileName, description: action.payload.description })
            ),

            catchError(
               err => of(
                  slice.actions.dissociateRaProfileFailed({ error: extractError(err, "Failed to dissociate RA Profile from Compliance Profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to dissociate RA Profile from Compliance Profile" })
               )
            )

         )

      )

   )
}


const getComplianceProfilesForRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getComplianceProfilesForRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.profiles.getComplianceProfilesForRaProfile(action.payload.authorityUuid, action.payload.uuid).pipe(

            map(
               profileDto => slice.actions.getComplianceProfilesForRaProfileSuccess({
                  complianceProfiles: profileDto.map(transformRaComplianceProfileDtoToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getComplianceProfilesForRaProfileFailure({ error: extractError(err, "Failed to get associated Compliance Profiles") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get associated Compliance Profiles" })
               )
            )

         )
      )

   );

}


const epics = [
   listRaProfiles,
   listAuthorizedClients,
   getRaProfileDetail,
   createRaProfile,
   updateRaProfile,
   enableRaProfile,
   disableRaProfile,
   deleteRaProfile,
   activateAcme,
   deactivateAcme,
   getAcmeDetails,
   listIssuanceAttributeDescriptors,
   listRevocationAttributeDescriptors,
   bulkEnableProfiles,
   bulkDisableProfiles,
   bulkDeleteProfiles,
   checkCompliance,
   associateRaProfile,
   dissociateRaProfile,
   getComplianceProfilesForRaProfile,
];


export default epics;