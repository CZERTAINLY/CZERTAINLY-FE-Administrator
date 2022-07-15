import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./certificates";
import { actions as alertActions } from "./alerts";
import { transformAvailableCertificateFilterDTOToModel, transformCertDTOToModel, transformCertificateHistoryDTOToModel, transformRaProfileDtoToCertificaeModel } from "./transform/certificates";
import { transformAttributeModelToDTO } from "./transform/attributes";
import { transformGroupDtoToModel } from "./transform/groups";


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
                  list => slice.actions.listCertificatesSuccess({ certificateList: list.certificates.map(transformCertDTOToModel) })
               ),

               catchError(err => of(slice.actions.listCertificatesFailure({ error: extractError(err, "Failed to get certificates list") })))

            )
         }

      )

   )

}


const listCertificatesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCertificatesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.getCertificateDetailFailure({ error: extractError(err, "Failed to get certificate detail") }))
            )

         )

      )

   )

}


const getCertificateDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const issueCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.issueCertificate.match
      ),
      switchMap(

         action => deps.apiClients.operations.issueCertificate(
            action.payload.raProfileUuid,
            action.payload.pkcs10,
            action.payload.attributes.map(attribute => transformAttributeModelToDTO(attribute))
         ).pipe(

            map(
               operation => slice.actions.issueCertificateSuccess({ uuid: operation.uuid, certificateData: operation.certificateData })
            ),

            catchError(
               err => of(slice.actions.issueCertificateFailure({ error: extractError(err, "Failed to issue certificate") }))
            )

         )

      )

   )

}


const issueCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.issueCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const revokeCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.revokeCertificate.match
      ),
      switchMap(

         action => deps.apiClients.operations.revokeCertificate(
            action.payload.uuid,
            action.payload.raProfileUuid,
            action.payload.reason,
            action.payload.attributes.map(attribute => transformAttributeModelToDTO(attribute))
         ).pipe(

            map(
               () => slice.actions.revokeCertificateSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.revokeCertificateFailure({ error: extractError(err, "Failed to revoke certificate") }))
            )

         )

      )

   )

}


const revokeCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.revokeCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const renewCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.renewCertificate.match
      ),
      switchMap(

         action => deps.apiClients.operations.renewCertificate(
            action.payload.uuid,
            action.payload.raProfileUuid,
            action.payload.pkcs10
         ).pipe(

            map(
               operation => slice.actions.renewCertificateSuccess({ uuid: operation.uuid, certificateData: operation.certificateData })
            ),
            catchError(
               err => of(slice.actions.renewCertificateFailure({ error: extractError(err, "Failed to renew certificate") }))
            )

         )

      )

   )

}


const renewCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.renewCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.getAvailableCertificateFiltersFailure({ error: extractError(err, "Failed to get available certificate filters") }))
            )

         )

      )

   )

}


const getAvailableCertificateFiltersFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAvailableCertificateFiltersFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
               err => of(slice.actions.getCertificateHistoryFailure({ error: extractError(err, "Failed to get certificate history") }))
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

            map(
               () => slice.actions.deleteCertificateSuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.deleteCertificateFailure({ error: extractError(err, "Failed to delete certificate") }))
            )

         )

      )

   )

}


const deleteCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteCertificateFailure.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

               () => deps.apiClients.groups.getGroupDetail(action.payload.groupUuid).pipe(

                  map(
                     group => slice.actions.updateGroupSuccess({
                        uuid: action.payload.uuid,
                        groupUuid: action.payload.groupUuid,
                        group: transformGroupDtoToModel(group)
                     })
                  ),
                  catchError(
                     err => of(slice.actions.updateGroupFailure({ error: extractError(err, "Failed to update group") }))
                  )

               ),
            ),
            catchError(
               err => of(slice.actions.updateGroupFailure({ error: extractError(err, "Failed to update group") }))
            )

         )

      )

   )

}


const updateGroupFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateGroupFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

               () => deps.apiClients.profiles.getRaProfileDetail(action.payload.raProfileUuid).pipe(

                  map(
                     raProfile => slice.actions.updateRaProfileSuccess({
                        uuid: action.payload.uuid,
                        raProfileUuid: action.payload.raProfileUuid,
                        raProfile: transformRaProfileDtoToCertificaeModel(raProfile)
                     })
                  ),
                  catchError(
                     err => of(slice.actions.updateRaProfileFailure({ error: extractError(err, "Failed to update RA profile") }))
                  )

               ),

            ),

            catchError(
               err => of(slice.actions.updateRaProfileFailure({ error: extractError(err, "Failed to update RA profile") }))
            )

         )

      )

   )

};







const epics = [
   listCertificates,
   listCertificatesFailure,
   getCertificateDetail,
   getCertificateDetailFailure,
   issueCertificate,
   issueCertificateFailure,
   revokeCertificate,
   revokeCertificateFailure,
   renewCertificate,
   renewCertificateFailure,
   getAvailableCertificateFilters,
   getAvailableCertificateFiltersFailure,
   getCertificateHistory,
   deleteCertificate,
   deleteCertificateFailure,
   updateGroup,
   updateGroupFailure,
   updateRaProfile,
   updateRaProfileFailure,
];


export default epics;