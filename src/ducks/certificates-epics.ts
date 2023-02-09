import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { extractError } from "utils/net";
import { actions as alertActions } from "./alerts";
import { actions as appRedirectActions } from "./app-redirect";

import * as slice from "./certificates";
import { transformAttributeDescriptorDtoToModel } from "./transform/attributes";
import { transformCertificateGroupResponseDtoToModel } from "./transform/certificateGroups";

import {
    transformCertificateBulkDeleteRequestModelToDto,
    transformCertificateBulkDeleteResponseDtoToModel,
    transformCertificateBulkObjectModelToDto,
    transformCertificateComplianceCheckModelToDto,
    transformCertificateContentResponseDtoToModel,
    transformCertificateDetailResponseDtoToModel,
    transformCertificateHistoryDtoToModel,
    transformCertificateListResponseDtoToModel,
    transformCertificateObjectModelToDto,
    transformCertificateRekeyRequestModelToDto,
    transformCertificateRenewRequestModelToDto,
    transformCertificateRevokeRequestModelToDto,
    transformCertificateSignRequestModelToDto,
    transformCertificateUploadModelToDto,
    transformSearchFieldDtoToModel,
    transformSearchRequestModelToDto,
} from "./transform/certificates";
import { transformLocationResponseDtoToModel } from "./transform/locations";
import { transformRaProfileResponseDtoToModel } from "./transform/ra-profiles";

const listCertificates: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCertificates.match
      ),
      switchMap(

         action => {

            return deps.apiClients.certificates.listCertificates({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }
            ).pipe(

               map(
                  list => {
                      const certificateList = list.certificates.map(transformCertificateListResponseDtoToModel);
                      return slice.actions.listCertificatesSuccess({
                          certificateList: certificateList,
                          totalItems: list.totalItems,
                          totalPages: list.totalPages,
                      })
                  }
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

         action => deps.apiClients.certificates.getCertificate({ uuid: action.payload.uuid }).pipe(

            map(
               certificate => slice.actions.getCertificateDetailSuccess({ certificate: transformCertificateDetailResponseDtoToModel(certificate) })
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

         action => deps.apiClients.certificates.getCertificateValidationResult({ uuid: action.payload.uuid }).pipe(

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

         action => deps.apiClients.clientOperations.issueCertificate({
             authorityUuid: action.payload.authorityUuid,
             raProfileUuid: action.payload.raProfileUuid,
             clientCertificateSignRequestDto: transformCertificateSignRequestModelToDto(action.payload.signRequest)
         }
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

         action => deps.apiClients.clientOperations.revokeCertificate({
             authorityUuid: action.payload.authorityUuid,
             raProfileUuid: action.payload.raProfileUuid,
             certificateUuid: action.payload.uuid,
             clientCertificateRevocationDto: transformCertificateRevokeRequestModelToDto(action.payload.revokeRequest)
         }
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

         action => deps.apiClients.clientOperations.renewCertificate({
                 authorityUuid: action.payload.authorityUuid,
                 raProfileUuid: action.payload.raProfileUuid,
                 certificateUuid: action.payload.uuid,
                 clientCertificateRenewRequestDto: transformCertificateRenewRequestModelToDto(action.payload.renewRequest),
             }
         ).pipe(

            mergeMap(
               operation => of(
                  slice.actions.renewCertificateSuccess({ uuid: operation.uuid }),
                  appRedirectActions.redirect({ url: `../${operation.uuid}` })
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


const rekeyCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.rekeyCertificate.match
      ),
      switchMap(

         action => deps.apiClients.clientOperations.rekeyCertificate({
                 authorityUuid: action.payload.authorityUuid,
                 raProfileUuid: action.payload.raProfileUuid,
                 certificateUuid: action.payload.uuid,
                 clientCertificateRekeyRequestDto: transformCertificateRekeyRequestModelToDto(action.payload.rekey),
             }
         ).pipe(

            mergeMap(
               operation => of(
                  slice.actions.rekeyCertificateSuccess({ uuid: operation.uuid }),
                  appRedirectActions.redirect({ url: `../${operation.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.rekeyCertificateFailure({ error: extractError(err, "Failed to rekey certificate") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to rekey certificate" })
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

         action => deps.apiClients.certificates.getSearchableFieldInformation1().pipe(

            map(
               filters => slice.actions.getAvailableCertificateFiltersSuccess({
                  availableCertificateFilters: filters.map(filter => transformSearchFieldDtoToModel(filter))
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

         action => deps.apiClients.certificates.getCertificateEventHistory({ uuid: action.payload.uuid }).pipe(

            map(
               records => slice.actions.getCertificateHistorySuccess({
                  certificateHistory: records.map(record => transformCertificateHistoryDtoToModel(record))
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

         action => deps.apiClients.certificates.listCertificateLocations({ certificateUuid: action.payload.uuid }).pipe(

            map(
               locations => slice.actions.listCertificateLocationsSuccess({
                  certificateLocations: locations.map(location => transformLocationResponseDtoToModel(location))
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

         action => deps.apiClients.certificates.deleteCertificate({ uuid: action.payload.uuid }).pipe(

            mergeMap(
               () => of(
                  slice.actions.deleteCertificateSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
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

         action => deps.apiClients.certificates.updateCertificateObjects({ uuid: action.payload.uuid, certificateUpdateObjectsDto: transformCertificateObjectModelToDto(action.payload.updateGroupRequest) }
         ).pipe(

            switchMap(

               () => deps.apiClients.certificateGroups.getGroup({ uuid: action.payload.updateGroupRequest.groupUuid! }).pipe(

                  mergeMap(
                     group => of(
                        slice.actions.updateGroupSuccess({
                           uuid: action.payload.uuid,
                           groupUuid: action.payload.updateGroupRequest.groupUuid!,
                           group: transformCertificateGroupResponseDtoToModel(group)
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

         action => deps.apiClients.certificates.updateCertificateObjects({
                 uuid: action.payload.uuid,
                 certificateUpdateObjectsDto: transformCertificateObjectModelToDto(action.payload.updateRaProfileRequest),
             }
         ).pipe(

            switchMap(

               () => deps.apiClients.raProfiles.getRaProfile({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.updateRaProfileRequest.raProfileUuid! }).pipe(

                  mergeMap(
                     raProfile => of(
                        slice.actions.updateRaProfileSuccess({
                           uuid: action.payload.uuid,
                           raProfileUuid: action.payload.updateRaProfileRequest.raProfileUuid!,
                           raProfile: transformRaProfileResponseDtoToModel(raProfile)
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

         action => deps.apiClients.certificates.updateCertificateObjects({
                 uuid: action.payload.uuid,
                 certificateUpdateObjectsDto: action.payload.updateOwnerRequest
             }
         ).pipe(

            mergeMap(
               () => of(
                  slice.actions.updateOwnerSuccess({
                     uuid: action.payload.uuid,
                     owner: action.payload.updateOwnerRequest.owner!
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

         action => deps.apiClients.certificates.bulkUpdateCertificateObjects({ multipleCertificateObjectUpdateDto: transformCertificateBulkObjectModelToDto(action.payload) }
         ).pipe(

            switchMap(

               () => deps.apiClients.certificateGroups.getGroup({ uuid: action.payload.groupUuid! }).pipe(

                  map(

                     group => slice.actions.bulkUpdateGroupSuccess({
                        uuids: action.payload.certificateUuids!,
                        group: group,
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

         action => deps.apiClients.certificates.bulkUpdateCertificateObjects({ multipleCertificateObjectUpdateDto: transformCertificateBulkObjectModelToDto(action.payload.raProfileRequest) }
         ).pipe(

            switchMap(

               () => deps.apiClients.raProfiles.getRaProfile({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.raProfileRequest.raProfileUuid! }).pipe(

                  map(

                     raProfile => slice.actions.bulkUpdateRaProfileSuccess({
                        uuids: action.payload.raProfileRequest.certificateUuids!,
                        raProfile,
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

         action => deps.apiClients.certificates.bulkUpdateCertificateObjects({ multipleCertificateObjectUpdateDto: transformCertificateBulkObjectModelToDto(action.payload) }
         ).pipe(

            map(

               () => slice.actions.bulkUpdateOwnerSuccess({
                  uuids: action.payload.certificateUuids!,
                  owner: action.payload.owner!,
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

         action => deps.apiClients.certificates.bulkDeleteCertificate({ removeCertificateDto: transformCertificateBulkDeleteRequestModelToDto(action.payload) }
         ).pipe(

             mergeMap(
                 (result) => of(
                     slice.actions.bulkDeleteSuccess({response: transformCertificateBulkDeleteResponseDtoToModel(result)}),
                     alertActions.success("Selected certificates successfully deleted.")
                 )
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

         action => deps.apiClients.certificates.upload({ uploadCertificateRequestDto: transformCertificateUploadModelToDto(action.payload) }
         ).pipe(

            switchMap(

               obj => deps.apiClients.certificates.getCertificate({ uuid: obj.uuid }).pipe(

                  map(

                     certificate => slice.actions.uploadCertificateSuccess({
                        uuid: obj.uuid,
                        certificate: transformCertificateDetailResponseDtoToModel(certificate),
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

         action => deps.apiClients.clientOperations.listIssueCertificateAttributes({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.raProfileUuid }
         ).pipe(

            map(

               attributes => slice.actions.getIssuanceAttributesSuccess({
                  raProfileUuid: action.payload.raProfileUuid,
                  issuanceAttributes: attributes.map(attribute => transformAttributeDescriptorDtoToModel(attribute)),
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

         action => deps.apiClients.clientOperations.listRevokeCertificateAttributes({ authorityUuid: action.payload.authorityUuid, raProfileUuid: action.payload.raProfileUuid }
         ).pipe(

            map(

               attributes => slice.actions.getRevocationAttributesSuccess({
                  raProfileUuid: action.payload.raProfileUuid,
                  revocationAttributes: attributes.map(attribute => transformAttributeDescriptorDtoToModel(attribute)),
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

         action => deps.apiClients.certificates.checkCertificatesCompliance({ certificateComplianceCheckDto: transformCertificateComplianceCheckModelToDto(action.payload) }
         ).pipe(

             mergeMap(
                 () => of(
                     slice.actions.checkComplianceSuccess(),
                     alertActions.success("Compliance Check for the certificates initiated")
                 )
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



const getCsrAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCsrAttributes.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getCsrGenerationAttributes().pipe(

            map(

               attributes => slice.actions.getCsrAttributesSuccess({
                  csrAttributes: attributes.map(attribute => transformAttributeDescriptorDtoToModel(attribute)),
               }),

            ),

            catchError(
               err => of(
                  slice.actions.getCsrAttributesFailure({ error: extractError(err, "Failed to get CSR generation attributes") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get CSR generation attributes" })
               )
            )

         )

      )

   )

}



const getCertificateContent: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateContents.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getCertificateContent({requestBody: action.payload.uuids}).pipe(

            map(
               list => slice.actions.getCertificateContentsSuccess({
                  contents: list.map(transformCertificateContentResponseDtoToModel),
                  format: action.payload.format,
                  uuids: action.payload.uuids,
               })
            ),

            catchError(
               error => of(
                  slice.actions.getCertificateContentsFailure({ error: extractError(error, "Failed to download certificates") }),
                  appRedirectActions.fetchError({ error, message: "Failed to download certificates" })
               )
            )
         )
      )
   );

}


const epics = [
   listCertificates,
   getCertificateDetail,
   getCertificateValidationResult,
   issueCertificate,
   revokeCertificate,
   renewCertificate,
   rekeyCertificate,
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
   getCsrAttributes,
   getCertificateContent
];


export default epics;
