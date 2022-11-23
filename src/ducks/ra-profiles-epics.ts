import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./ra-profiles";
import { actions as appRedirectActions } from "./app-redirect";

import {
    transformComplianceProfileSimplifiedDtoToModel,
    transformRaProfileAcmeDetailResponseDtoToModel,
    transformRaProfileActivateAcmeRequestModelToDto,
    transformRaProfileAddRequestModelToDto,
    transformRaProfileEditRequestModelToDto,
    transformRaProfileResponseDtoToModel
} from "./transform/ra-profiles";
import { transformAttributeDescriptorDtoToModel } from "./transform/attributes";


const listRaProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRaProfiles.match
      ),
      switchMap(

         () => deps.apiClients.raProfiles.listRaProfiles({}).pipe(

            map(
               list => slice.actions.listRaProfilesSuccess({
                  raProfiles: list.map(transformRaProfileResponseDtoToModel)
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

         action => deps.apiClients.raProfiles.getRaProfile1({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

            map(
               profileDto => slice.actions.getRaProfileDetailSuccess({
                  raProfile: transformRaProfileResponseDtoToModel(profileDto)
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


const createRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createRaProfile.match
      ),

      switchMap(

         action => deps.apiClients.raProfiles.createRaProfile({ authorityUuid: action.payload.authorityInstanceUuid, addRaProfileRequestDto: transformRaProfileAddRequestModelToDto(action.payload.raProfileAddRequest) }
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

         action => deps.apiClients.raProfiles.editRaProfile({ raProfileUuid: action.payload.profileUuid, authorityUuid: action.payload.authorityInstanceUuid, editRaProfileRequestDto: transformRaProfileEditRequestModelToDto(action.payload.raProfileEditRequest) }
         ).pipe(

            mergeMap(

               raProfileDto => iif(

                  () => !!action.payload.redirect,
                  of(

                     slice.actions.updateRaProfileSuccess({
                        raProfile: transformRaProfileResponseDtoToModel(raProfileDto),
                        redirect: action.payload.redirect
                     }),

                     appRedirectActions.redirect({ url: action.payload.redirect! })

                  ),
                  of(
                     slice.actions.updateRaProfileSuccess({
                        raProfile: transformRaProfileResponseDtoToModel(raProfileDto),
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

         action => deps.apiClients.raProfiles.enableRaProfile({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

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

         action => deps.apiClients.raProfiles.disableRaProfile({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

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

         action => deps.apiClients.raProfiles.deleteRaProfile1({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

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

         action => deps.apiClients.raProfiles.activateAcmeForRaProfile({
                    authorityUuid: action.payload.authorityUuid,
                    raProfileUuid: action.payload.uuid,
                    acmeProfileUuid: action.payload.acmeProfileUuid,
                    activateAcmeForRaProfileRequestDto: transformRaProfileActivateAcmeRequestModelToDto(action.payload.raProfileActivateAcmeRequest)
                }
         ).pipe(

            map(
                raProfileAcmeDetailResponse => slice.actions.activateAcmeSuccess({
                  raProfileAcmeDetailResponse: transformRaProfileAcmeDetailResponseDtoToModel( raProfileAcmeDetailResponse)
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

         action => deps.apiClients.raProfiles.deactivateAcmeForRaProfile({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

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

         action => deps.apiClients.raProfiles.getAcmeForRaProfile({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

            map(
               acmeDetails => slice.actions.getAcmeDetailsSuccess({
                  raAcmeLink: transformRaProfileAcmeDetailResponseDtoToModel(acmeDetails)
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

         action => deps.apiClients.raProfiles.listIssueCertificateAttributes1({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

            map(
               issuanceAttributes => slice.actions.listIssuanceAttributesDescriptorsSuccess({
                  uuid: action.payload.uuid,
                  attributesDescriptors: issuanceAttributes.map(transformAttributeDescriptorDtoToModel)
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

         action => deps.apiClients.raProfiles.listRevokeCertificateAttributes1({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

            map(
               revocationAttributes => slice.actions.listRevocationAttributeDescriptorsSuccess({
                  uuid: action.payload.uuid,
                  attributesDescriptors: revocationAttributes.map(transformAttributeDescriptorDtoToModel)
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

         action => deps.apiClients.raProfiles.bulkEnableRaProfile({ requestBody: action.payload.uuids }).pipe(

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

         action => deps.apiClients.raProfiles.bulkDisableRaProfile({ requestBody: action.payload.uuids }).pipe(

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

         action => deps.apiClients.raProfiles.bulkDeleteRaProfile({ requestBody: action.payload.uuids }).pipe(

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

         action => deps.apiClients.raProfiles.checkCompliance({ requestBody: action.payload.uuids }
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
//TODO fix with compliance API finished
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
//TODO fix with compliance API finished
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

         action => deps.apiClients.raProfiles.getAssociatedComplianceProfiles({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.uuid }).pipe(

            map(
               profileDto => slice.actions.getComplianceProfilesForRaProfileSuccess({
                  complianceProfiles: profileDto.map(transformComplianceProfileSimplifiedDtoToModel)
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