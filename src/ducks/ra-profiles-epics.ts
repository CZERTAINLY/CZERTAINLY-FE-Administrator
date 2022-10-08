import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./ra-profiles";
import history from "browser-history";
import { transformRaAcmeLinkDtoToModel, transformRaAuthorizedClientDtoToModel, transformRaProfileDtoToModel } from "./transform/ra-profiles";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transfromRaAcmeLinkDtoToModel } from "./transform/acme-profiles";


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
               err => of(slice.actions.listRaProfilesFailure({ error: extractError(err, "Failed to get RA profiles list") }))
            )
         )
      )
   );

}


const listRaProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRaProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getRaProfileDetailFailure({ error: extractError(err, "Failed to get RA Profile detail") }))
            )

         )
      )

   );

}


const getRaProfileDetailFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getRaProfileDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.listAuthorizedClientsFailure({ error: extractError(err, "Failed to get list of authorized clients") }))
            )
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
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               obj => slice.actions.createRaProfileSuccess({ uuid: obj.uuid, authorityInstanceUuid: action.payload.authorityInstanceUuid })
            ),

            catchError(
               err => of(slice.actions.createRaProfileFailure({ error: extractError(err, "Failed to create profile") }))
            )
         )
      )

   );

}


const createRaProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createRaProfileSuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload.authorityInstanceUuid}/${action.payload.uuid}`);
            return EMPTY;
         }

      )

   )

}


const createRaProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(
      filter(
         slice.actions.createRaProfileFailure.match
      ),

      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               raProfileDTO => slice.actions.updateRaProfileSuccess({ raProfile: transformRaProfileDtoToModel(raProfileDTO) })
            ),

            catchError(
               err => of(slice.actions.updateRaProfileFailure({ error: extractError(err, "Failed to update profile") }))
            )

         )

      )

   );

}


const updateRaProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateRaProfileSuccess.match
      ),

      switchMap(

         action => {
            history.push(`../detail/${action.payload.raProfile.uuid}`);
            return EMPTY;
         }

      )

   )

}


const updateRaProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateRaProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.enableRaProfileFailure({ error: extractError(err, "Failed to enable profile") }))
            )

         )
      )

   );

}


const enableRaProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableRaProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.enableRaProfileFailure({ error: extractError(err, "Failed to disable profile") }))
            )

         )
      )

   );

}


const disableRaProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableRaProfileFailure.match
      ),

      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.deleteRaProfileSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteRaProfileFailure({ error: extractError(err, "Failed to delete profile") }))
            )

         )

      )

   );

}


const deleteRaProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteRaProfileSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}


const deleteRaProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteRaProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.activateAcmeFailure({ error: extractError(err, "Failed to activate ACME") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.deactivateAcmeFailure({ error: extractError(err, "Failed to deactivate ACME") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getAcmeDetailsFailure({ error: extractError(err, "Failed to get ACME details") }))
            )

         )

      )

   );

}


const getAcmeDetailsFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAcmeDetailsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.listIssuanceAttributesFailure({ error: extractError(err, "Failed to list issuance attributes") }))
            )

         )
      )

   );

}


const listIssuanceAttributeDescriptorsFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listIssuanceAttributesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.listRevocationAttributeDescriptorsFailure({ error: extractError(err, "Failed to list revocation attributes") }))
            )

         )

      )

   );

}


const listRevocationAttributeDescriptorsFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listRevocationAttributeDescriptorsFailure.match
      ),

      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkEnableRaProfilesFailure({ error: extractError(err, "Failed to enable profiles") }))
            )

         )

      )

   );

}


const bulkEnableProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkEnableRaProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkDisableRaProfilesFailure({ error: extractError(err, "Failed to disable profiles") }))
            )

         )

      )

   );

}


const bulkDisableProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDisableRaProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkDeleteRaProfilesFailure({ error: extractError(err, "Failed to delete profiles") }))
            )

         )
      )

   );

}


const bulkDeleteProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteRaProfilesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.checkComplianceFailed({ error: extractError(err, "Failed to check compliance") }))

            )

         )

      )

   )
}


const checkComplianceFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkComplianceFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const checkComplianceSuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkComplianceSuccess.match
      ),
      map(

         action => alertActions.success("Compliance Check for the certificates initiated")
      )

   );
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
               () => slice.actions.associateRaProfileSuccess({ uuid: action.payload.uuid, complianceProfileUuid: action.payload.complianceProfileUuid, complianceProfileName: action.payload.complianceProfileName, description: action.payload.description })
            ),
            catchError(
               err => of(slice.actions.associateRaProfileFailed({ error: extractError(err, "Failed to associate RA Profile to Compliance Profile") }))
            )

         )

      )

   )
}


const associateRaProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.associateRaProfileFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
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
               err => of(slice.actions.dissociateRaProfileFailed({ error: extractError(err, "Failed to dissociate RA Profile from Compliance Profile") }))
            )

         )

      )

   )
}


const dissociateRaProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.dissociateRaProfileFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const epics = [
   listRaProfiles,
   listRaProfilesFailure,
   listAuthorizedClients,
   listAuthorizedClientsFailure,
   getRaProfileDetail,
   getRaProfileDetailFailure,
   createRaProfile,
   createRaProfileFailure,
   createRaProfileSuccess,
   updateRaProfile,
   updateRaProfileSuccess,
   updateRaProfileFailure,
   enableRaProfile,
   enableRaProfileFailure,
   disableRaProfile,
   disableRaProfileFailure,
   deleteRaProfile,
   deleteRaProfileSuccess,
   deleteRaProfileFailure,
   activateAcme,
   activateAcmeFailure,
   deactivateAcme,
   deactivateAcmeFailure,
   getAcmeDetails,
   getAcmeDetailsFailure,
   listIssuanceAttributeDescriptors,
   listIssuanceAttributeDescriptorsFailure,
   listRevocationAttributeDescriptors,
   listRevocationAttributeDescriptorsFailure,
   bulkEnableProfiles,
   bulkEnableProfilesFailure,
   bulkDisableProfiles,
   bulkDisableProfilesFailure,
   bulkDeleteProfiles,
   bulkDeleteProfilesFailure,
   checkCompliance,
   checkComplianceFailed,
   checkComplianceSuccess,
   associateRaProfile,
   associateRaProfileFailed,
   dissociateRaProfile,
   dissociateRaProfileFailed
];


export default epics;