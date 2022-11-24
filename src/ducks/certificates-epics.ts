import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./certificates";
import { actions as appRedirectActions } from "./app-redirect";

import { transformAvailableCertificateFilterDTOToModel, transformCertDTOToModel, transformCertificateHistoryDTOToModel, transformRaProfileDTOToCertificateModel } from "./transform/certificates";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transformGroupDtoToModel } from "./transform/certificateGroups";
import { transformLocationDtoToModel } from "./transform/locations";


const listCertificates: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCertificates.match
      ),
      switchMap(

         action => {

            return deps.apiClients.certificates.getCertificatesList(
               action.payload.query.itemsPerPage,
               action.payload.query.pageNumber,
               action.payload.query.filters
            ).pipe(

               map(
                  list => slice.actions.listCertificatesSuccess({
                     certificateList: list.certificates.map(transformCertDTOToModel),
                     totalItems: list.totalItems,
                     totalPages: list.totalPages,
                  })
               ),

               catchError(
                  err => of(
                     slice.actions.listCertificatesFailure({ error: extractError(err, "Failed to get certificates list") }),
                     appRedirectActions.fetchError({ error: err, message: "Failed to get certificates list" })
                  )
               )

            )
         }

      )

   )

}


const getCertificateDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateDetail.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getCertificateDetail(action.payload.uuid).pipe(

            map(
               certificate => slice.actions.getCertificateDetailSuccess({ certificate: transformCertDTOToModel(certificate) })
            ),

            catchError(
               err => of(
                  slice.actions.getCertificateDetailFailure({ error: extractError(err, "Failed to get certificate detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get certificate detail" })
               )
            )

         )

      )

   )

}


const getCertificateValidationResult: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateValidationResult.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getCertificateValidationResult(action.payload.uuid).pipe(

            map(
               result => slice.actions.getCertificateValidationResultSuccess(result)
            ),

            catchError(
               err => of(
                  slice.actions.getCertificateValidationResultFailure({ error: extractError(err, "Failed to get certificate validation result") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get certificate validation result" })
               )
            )

         )

      )

   )

}


const issueCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.issueCertificate.match
      ),
      switchMap(

         action => deps.apiClients.clientOperations.issueCertificate(
            action.payload.raProfileUuid,
            action.payload.pkcs10,
            action.payload.attributes.map(attribute => transformAttributeModelToDTO(attribute)),
            action.payload.authorityUuid
         ).pipe(

            mergeMap(
               operation => of(
                  slice.actions.issueCertificateSuccess({ uuid: operation.uuid, certificateData: operation.certificateData }),
                  appRedirectActions.redirect({ url: `../detail/${operation.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.issueCertificateFailure({ error: extractError(err, "Failed to issue certificate") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to issue certificate" })
               )
            )

         )

      )

   )

}


const revokeCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.revokeCertificate.match
      ),
      switchMap(

         action => deps.apiClients.clientOperations.revokeCertificate(
            action.payload.uuid,
            action.payload.raProfileUuid,
            action.payload.reason,
            action.payload.attributes.map(attribute => transformAttributeModelToDTO(attribute)),
            action.payload.authorityUuid
         ).pipe(

            mergeMap(

               () => of(
                  slice.actions.revokeCertificateSuccess({ uuid: action.payload.uuid }),
                  slice.actions.getCertificateHistory({ uuid: action.payload.uuid })
               )

            ),

            catchError(
               err => of(
                  slice.actions.revokeCertificateFailure({ error: extractError(err, "Failed to revoke certificate") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to revoke certificate" })
               )
            )

         )

      )

   )

}


const renewCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.renewCertificate.match
      ),
      switchMap(

         action => deps.apiClients.clientOperations.renewCertificate(
            action.payload.uuid,
            action.payload.raProfileUuid,
            action.payload.pkcs10,
            action.payload.authorityUuid,
         ).pipe(

            mergeMap(
               operation => of(
                  slice.actions.renewCertificateSuccess({ uuid: operation.uuid }),
                  appRedirectActions.redirect({ url: `./${operation.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.renewCertificateFailure({ error: extractError(err, "Failed to renew certificate") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to renew certificate" })
               )
            )

         )

      )

   )

}


const getAvailableCertificateFilters: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAvailableCertificateFilters.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getAvailableCertificateFilters().pipe(

            map(
               filters => slice.actions.getAvailableCertificateFiltersSuccess({
                  availableCertificateFilters: filters.map(filter => transformAvailableCertificateFilterDTOToModel(filter))
               })
            ),

            catchError(
               err => of(
                  slice.actions.getAvailableCertificateFiltersFailure({ error: extractError(err, "Failed to get available certificate filters") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get available certificate filters" })
               )
            )

         )

      )

   )

}


const getCertificateHistory: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateHistory.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getCertificateHistory(action.payload.uuid).pipe(

            map(
               records => slice.actions.getCertificateHistorySuccess({
                  certificateHistory: records.map(record => transformCertificateHistoryDTOToModel(record))
               })
            ),

            catchError(
               err => of(
                  slice.actions.getCertificateHistoryFailure({ error: extractError(err, "Failed to get certificate history") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get certificate history" })
               )
            )

         )

      )

   )

}


const listCertificateLocations: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCertificateLocations.match
      ),
      switchMap(

         action => deps.apiClients.certificates.listLocations(action.payload.uuid).pipe(

            map(
               locations => slice.actions.listCertificateLocationsSuccess({
                  certificateLocations: locations.map(location => transformLocationDtoToModel(location))
               })
            ),

            catchError(
               err => of(
                  slice.actions.listCertificateLocationsFailure({ error: extractError(err, "Failed to list certificate locations") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to list certificate locations" })
               )
            )

         )

      )

   )

}


const deleteCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteCertificate.match
      ),
      switchMap(

         action => deps.apiClients.certificates.deleteCertificate(action.payload.uuid).pipe(

            mergeMap(
               () => of(
                  slice.actions.deleteCertificateSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../" })
               )
            ),

            catchError(
               err => of(
                  slice.actions.deleteCertificateFailure({ error: extractError(err, "Failed to delete certificate") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete certificate" })
               )
            )

         )

      )

   )
}


const updateGroup: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateGroup.match
      ),
      switchMap(

         action => deps.apiClients.certificates.updateGroup(
            action.payload.uuid,
            action.payload.groupUuid,
         ).pipe(

            switchMap(

               () => deps.apiClients.certificateGroups.getGroupDetail(action.payload.groupUuid).pipe(

                  mergeMap(
                     group => of(
                        slice.actions.updateGroupSuccess({
                           uuid: action.payload.uuid,
                           groupUuid: action.payload.groupUuid,
                           certificateGroup: transformGroupDtoToModel(group)
                        }),
                        slice.actions.getCertificateHistory({ uuid: action.payload.uuid })
                     )
                  ),

                  catchError(
                     err => of(
                        slice.actions.updateGroupFailure({ error: extractError(err, "Failed to update group") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to update group" })
                     )
                  )

               ),
            ),

            catchError(
               err => of(
                  slice.actions.updateGroupFailure({ error: extractError(err, "Failed to update group") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update group" })
               )
            )

         )

      )

   )

}


const updateRaProfile: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.certificates.updateRaProfile(
            action.payload.uuid,
            action.payload.raProfileUuid,
         ).pipe(

            switchMap(

               () => deps.apiClients.raProfiles.getRaProfileDetail(action.payload.authorityUuid, action.payload.raProfileUuid).pipe(

                  mergeMap(
                     raProfile => of(
                        slice.actions.updateRaProfileSuccess({
                           uuid: action.payload.uuid,
                           raProfileUuid: action.payload.raProfileUuid,
                           raProfile: transformRaProfileDTOToCertificateModel(raProfile)
                        }),
                        slice.actions.getCertificateHistory({ uuid: action.payload.uuid })
                     )
                  ),

                  catchError(
                     err => of(
                        slice.actions.updateRaProfileFailure({ error: extractError(err, "Failed to update RA profile") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to update RA profile" })
                     )
                  )

               ),

            ),

            catchError(
               err => of(
                  slice.actions.updateRaProfileFailure({ error: extractError(err, "Failed to update RA profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update RA profile" })
               )
            )

         )

      )

   )

};


const updateOwner: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateOwner.match
      ),
      switchMap(

         action => deps.apiClients.certificates.updateOwner(
            action.payload.uuid,
            action.payload.owner,
         ).pipe(

            mergeMap(
               () => of(
                  slice.actions.updateOwnerSuccess({
                     uuid: action.payload.uuid,
                     owner: action.payload.owner
                  }),
                  slice.actions.getCertificateHistory({ uuid: action.payload.uuid })
               )
            ),

            catchError(
               err => of(
                  slice.actions.updateOwnerFailure({ error: extractError(err, "Failed to update owner") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update owner" })
               )
            )

         )

      )

   )

}


const bulkUpdateGroup: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkUpdateGroup.match
      ),
      switchMap(

         action => deps.apiClients.certificates.bulkUpdateGroup(
            action.payload.uuids,
            action.payload.groupUuid,
            action.payload.inFilter,
            action.payload.allSelect,
         ).pipe(

            switchMap(

               () => deps.apiClients.certificateGroups.getGroupDetail(action.payload.groupUuid).pipe(

                  map(

                     group => slice.actions.bulkUpdateGroupSuccess({
                        uuids: action.payload.uuids,
                        group: certificateGroup,
                        inFilter: action.payload.inFilter,
                        allSelect: action.payload.allSelect,
                     })

                  ),

                  catchError(
                     err => of(
                        slice.actions.updateOwnerFailure({ error: extractError(err, "Failed to bulk update update group") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to bulk update update group" })
                     )
                  )

               )

            ),

            catchError(
               err => of(
                  slice.actions.updateOwnerFailure({ error: extractError(err, "Failed to bulk update update group") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk update update group" })
               )
            )

         )

      )

   )

}


const bulkUpdateRaProfile: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkUpdateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.certificates.bulkUpdateRaProfile(
            action.payload.uuids,
            action.payload.raProfileUuid,
            action.payload.inFilter,
            action.payload.allSelect,
         ).pipe(

            switchMap(

               () => deps.apiClients.raProfiles.getRaProfileDetail(action.payload.authorityUuid, action.payload.raProfileUuid).pipe(

                  map(

                     raProfile => slice.actions.bulkUpdateRaProfileSuccess({
                        uuids: action.payload.uuids,
                        raProfile,
                        inFilter: action.payload.inFilter,
                        allSelect: action.payload.allSelect,
                     })

                  ),

                  catchError(
                     err => of(
                        slice.actions.updateOwnerFailure({ error: extractError(err, "Failed to bulk update update RA profile") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to bulk update update RA profile" })
                     )
                  )

               )

            ),

            catchError(
               err => of(
                  slice.actions.updateOwnerFailure({ error: extractError(err, "Failed to bulk update update RA profile") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk update update RA profile" })
               )
            )

         )

      )

   )

}


const bulkUpdateOwner: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkUpdateOwner.match
      ),
      switchMap(

         action => deps.apiClients.certificates.bulkUpdateOwner(
            action.payload.uuids,
            action.payload.owner,
            action.payload.inFilter,
            action.payload.allSelect,
         ).pipe(

            map(

               () => slice.actions.bulkUpdateOwnerSuccess({
                  uuids: action.payload.uuids,
                  owner: action.payload.owner,
                  inFilter: action.payload.inFilter,
                  allSelect: action.payload.allSelect,
               }),

            ),

            catchError(
               err => of(
                  slice.actions.updateOwnerFailure({ error: extractError(err, "Failed to bulk update update owner") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk update update owner" })
               )
            )

         )

      )

   )

}


const bulkDelete: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDelete.match
      ),
      switchMap(

         action => deps.apiClients.certificates.bulkDeleteCertificate(
            action.payload.uuids,
            action.payload.inFilter,
            action.payload.allSelect,
         ).pipe(

            map(

               (result) => slice.actions.bulkDeleteSuccess({
                  uuids: action.payload.uuids,
                  inFilter: action.payload.inFilter,
                  allSelect: action.payload.allSelect,
                  response: result,
               }),

            ),

            catchError(
               err => of(
                  slice.actions.bulkDeleteFailure({ error: extractError(err, "Failed to bulk delete certificates") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk delete certificates" })
               )
            )

         )

      )

   )

}


const uploadCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.uploadCertificate.match
      ),
      switchMap(

         action => deps.apiClients.certificates.uploadCertificate(
            action.payload.certificate
         ).pipe(

            switchMap(

               obj => deps.apiClients.certificates.getCertificateDetail(obj.uuid).pipe(

                  map(

                     certificate => slice.actions.uploadCertificateSuccess({
                        uuid: obj.uuid,
                        certificate,
                     })

                  ),

                  catchError(
                     err => of(
                        slice.actions.uploadCertificateFailure({ error: extractError(err, "Failed to upload certificate") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to upload certificate" })
                     )
                  )

               )

            ),

            catchError(
               err => of(
                  slice.actions.uploadCertificateFailure({ error: extractError(err, "Failed to upload certificate") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to upload certificate" })
               )
            )

         )

      )

   )

}


const getIssuanceAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getIssuanceAttributes.match
      ),
      switchMap(

         action => deps.apiClients.clientOperations.getIssuanceAttributes(
            action.payload.raProfileUuid,
            action.payload.authorityUuid,
         ).pipe(

            map(

               attributes => slice.actions.getIssuanceAttributesSuccess({
                  raProfileUuid: action.payload.raProfileUuid,
                  issuanceAttributes: attributes.map(attribute => transformAttributeDescriptorDTOToModel(attribute)),
               }),

            ),

            catchError(
               err => of(
                  slice.actions.getIssuanceAttributesFailure({ error: extractError(err, "Failed to get issuance attributes") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get issuance attributes" })
               )
            )

         )

      )

   )

}


const getRevocationAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getRevocationAttributes.match
      ),
      switchMap(

         action => deps.apiClients.clientOperations.getRevocationAttributes(
            action.payload.raProfileUuid,
            action.payload.authorityUuid,
         ).pipe(

            map(

               attributes => slice.actions.getRevocationAttributesSuccess({
                  raProfileUuid: action.payload.raProfileUuid,
                  revocationAttributes: attributes.map(attribute => transformAttributeDescriptorDTOToModel(attribute)),
               }),

            ),

            catchError(
               err => of(
                  slice.actions.getRevocationAttributesFailure({ error: extractError(err, "Failed to get revocation attributes") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get revocation attributes" })
               )
            )

         )

      )

   )

}


const checkCompliance: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkCompliance.match
      ),
      switchMap(

         action => deps.apiClients.certificates.checkCompliance(
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


const epics = [
   listCertificates,
   getCertificateDetail,
   getCertificateValidationResult,
   issueCertificate,
   revokeCertificate,
   renewCertificate,
   getAvailableCertificateFilters,
   getCertificateHistory,
   listCertificateLocations,
   deleteCertificate,
   updateGroup,
   updateRaProfile,
   updateOwner,
   bulkUpdateGroup,
   bulkUpdateRaProfile,
   bulkUpdateOwner,
   bulkDelete,
   uploadCertificate,
   getIssuanceAttributes,
   getRevocationAttributes,
   checkCompliance,
];


export default epics;
