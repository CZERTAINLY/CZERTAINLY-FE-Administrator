import { AppEpic } from "ducks";
import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";

import { slice } from "./locations";
import { slice as certsSlice } from "./certificates";
import { actions as appRedirectActions } from "./app-redirect";

import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transformLocationDtoToModel } from "./transform/locations";


const listLocations: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listLocations.match
      ),
      switchMap(
         () => deps.apiClients.locations.listLocations().pipe(

            map(
               locations => slice.actions.listLocationsSuccess({
                  locations: locations.map(transformLocationDtoToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listLocationsFailure({ error: extractError(error, "Failed to get Location list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Location list" })
               )
            )

         )
      )
   );
}


const getLocationDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getLocationDetail.match
      ),
      switchMap(

         action => deps.apiClients.locations.getLocationDetail(action.payload.entityUuid, action.payload.uuid).pipe(

            map(
               location => slice.actions.getLocationDetailSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               error => of(
                  slice.actions.getLocationDetailFailure({ error: extractError(error, "Failed to get Location detail") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Location detail" })
               )
            )

         )

      )

   );

}


const addLocation: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addLocation.match
      ),
      switchMap(

         action => deps.apiClients.locations.addLocation(
            action.payload.entityUuid,
            action.payload.name,
            action.payload.description,
            action.payload.attributes.map(transformAttributeModelToDTO),
            action.payload.enabled
         ).pipe(

            switchMap(

               obj => deps.apiClients.locations.getLocationDetail(action.payload.entityUuid, obj.uuid).pipe(

                  mergeMap(
                     location => of(
                        slice.actions.addLocationSuccess({ location: transformLocationDtoToModel(location), entityUuid: action.payload.entityUuid }),
                        appRedirectActions.redirect({ url: `../detail/${action.payload.entityUuid}/${location.uuid}` })
                     )
                  )

               )

            ),

            catchError(
               error => of(
                  slice.actions.addLocationFailure({ error: extractError(error, "Failed to add Location") }),
                  appRedirectActions.fetchError({ error, message: "Failed to add Location" })
               )
            )

         )

      )

   );

}


const editLocation: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.editLocation.match
      ),
      switchMap(

         action => deps.apiClients.locations.editLocation(
            action.payload.uuid,
            action.payload.entityUuid,
            action.payload.description,
            action.payload.attributes.map(transformAttributeModelToDTO),
            action.payload.enabled
         ).pipe(

            mergeMap(
               location => of(
                  slice.actions.editLocationSuccess({ location: transformLocationDtoToModel(location) }),
                  appRedirectActions.redirect({ url: `../../../detail/${action.payload.entityUuid}/${location.uuid}` })
               )
            ),

            catchError(
               error => of(
                  slice.actions.editLocationFailure({ error: extractError(error, "Failed to edit Location") }),
                  appRedirectActions.fetchError({ error, message: "Failed to edit Location" })
               )
            )

         )

      )

   );

}


const deleteLocation: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteLocation.match
      ),
      mergeMap(

         action => deps.apiClients.locations.deleteLocation(action.payload.entityUuid, action.payload.uuid).pipe(

            mergeMap(
               () => iif(
                  () => !!action.payload.redirect,
                  of(
                     slice.actions.deleteLocationSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! })
                  ),
                  of(
                     slice.actions.deleteLocationSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect })
                  )
               )
            ),

            catchError(
               error => of(
                  slice.actions.deleteLocationFailure({ error: extractError(error, "Failed to delete Location") }),
                  appRedirectActions.fetchError({ error, message: "Failed to delete Location" })
               )
            )

         )

      )

   );

}


const enableLocation: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableLocation.match
      ),
      mergeMap(

         action => deps.apiClients.locations.enableLocation(action.payload.entityUuid, action.payload.uuid).pipe(

            map(
               () => slice.actions.enableLocationSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               error => of(
                  slice.actions.enableLocationFailure({ error: extractError(error, "Failed to enable Location") }),
                  appRedirectActions.fetchError({ error, message: "Failed to enable Location" })
               )
            )

         )

      )

   );

}


const disableLocation: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableLocation.match
      ),
      mergeMap(

         action => deps.apiClients.locations.disableLocation(action.payload.entityUuid, action.payload.uuid).pipe(

            map(
               () => slice.actions.disableLocationSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               error => of(
                  slice.actions.disableLocationFailure({ error: extractError(error, "Failed to disable Location") }),
                  appRedirectActions.fetchError({ error, message: "Failed to disable Location" })
               )
            )

         )

      )

   );

}


const getPushAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getPushAttributes.match
      ),
      switchMap(

         action => deps.apiClients.locations.getPushAttributes(action.payload.entityUuid, action.payload.uuid).pipe(

            map(
               attributes => slice.actions.getPushAttributesSuccess({ attributes: attributes.map(transformAttributeDescriptorDTOToModel) })
            ),

            catchError(
               error => of(
                  slice.actions.getPushAttributesFailure({ error: extractError(error, "Failed to get Push Attributes") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Push Attributes" })
               )
            )

         )

      )

   );

}


const getCSRAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCSRAttributes.match
      ),
      switchMap(

         action => deps.apiClients.locations.getCSRAttributes(action.payload.entityUuid, action.payload.uuid).pipe(

            map(
               attributes => slice.actions.getCSRAttributesSuccess({ attributes: attributes.map(transformAttributeDescriptorDTOToModel) })
            ),

            catchError(
               error => of(
                  slice.actions.getCSRAttributesFailure({ error: extractError(error, "Failed to get CSR Attributes") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get CSR Attributes" })
               )
            )

         )

      )

   );

}


const pushCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.pushCertificate.match
      ),
      mergeMap(

         action => deps.apiClients.locations.pushCertificate(
            action.payload.entityUuid,
            action.payload.locationUuid,
            action.payload.certificateUuid,
            action.payload.pushAttributes.map(transformAttributeModelToDTO)
         ).pipe(

            mergeMap(
               location => of(
                  slice.actions.pushCertificateSuccess({ location: transformLocationDtoToModel(location), certificateUuid: action.payload.certificateUuid }),
                  certsSlice.actions.getCertificateHistory({ uuid: action.payload.certificateUuid })
               )
            ),

            catchError(
               error => of(
                  slice.actions.pushCertificateFailure({ error: extractError(error, "Failed to push Certificate") }),
                  appRedirectActions.fetchError({ error, message: "Failed to push Certificate" })
               )
            )

         )

      )

   );

}


const issueCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.issueCertificate.match
      ),
      switchMap(

         action => deps.apiClients.locations.issueCertificate(
            action.payload.entityUuid,
            action.payload.locationUuid,
            action.payload.raProfileUuid,
            action.payload.csrAttributes.map(transformAttributeModelToDTO),
            action.payload.issueAttributes.map(transformAttributeModelToDTO)
         ).pipe(

            map(
               location => slice.actions.issueCertificateSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               error => of(
                  slice.actions.issueCertificateFailure({ error: extractError(error, "Failed to issue Certificate") }),
                  appRedirectActions.fetchError({ error, message: "Failed to issue Certificate" })
               )
            )

         )

      )

   );

}


const autoRenewCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.autoRenewCertificate.match
      ),
      mergeMap(

         action => deps.apiClients.locations.autoRenewCertificate(
            action.payload.entityUuid,
            action.payload.locationUuid,
            action.payload.certificateUuid
         ).pipe(

            mergeMap(
               location => of(
                  slice.actions.autoRenewCertificateSuccess({ location: transformLocationDtoToModel(location), certificateUuid: action.payload.certificateUuid }),
                  certsSlice.actions.getCertificateHistory({ uuid: action.payload.certificateUuid })
               )
            ),

            catchError(
               error => of(
                  slice.actions.autoRenewCertificateFailure({ error: extractError(error, "Failed to auto-renew Certificate") }),
                  appRedirectActions.fetchError({ error, message: "Failed to auto-renew Certificate" })
               )
            )

         )

      )

   );

}


const removeCertificate: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.removeCertificate.match
      ),
      mergeMap(

         action => deps.apiClients.locations.removeCertificate(
            action.payload.entityUuid,
            action.payload.locationUuid,
            action.payload.certificateUuid
         ).pipe(

            mergeMap(
               location => of(
                  slice.actions.removeCertificateSuccess({ location: transformLocationDtoToModel(location), certificateUuid: action.payload.certificateUuid }),
                  certsSlice.actions.getCertificateHistory({ uuid: action.payload.certificateUuid })
               )
            ),

            catchError(
               error => of(
                  slice.actions.removeCertificateFailure({ error: extractError(error, "Failed to remove Certificate") }),
                  appRedirectActions.fetchError({ error, message: "Failed to remove Certificate" })
               )
            )

         )

      )

   );

}




const syncLocation: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.syncLocation.match
      ),
      switchMap(

         action => deps.apiClients.locations.syncLocation(action.payload.entityUuid, action.payload.uuid).pipe(

            map(
               location => slice.actions.syncLocationSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               error => of(
                  slice.actions.syncLocationFailure({ error: extractError(error, "Failed to sync Location") }),
                  appRedirectActions.fetchError({ error, message: "Failed to sync Location" })
               )
            )

         )

      )

   );

}


const epics = [
   listLocations,
   getLocationDetail,
   addLocation,
   editLocation,
   deleteLocation,
   enableLocation,
   disableLocation,
   getPushAttributes,
   getCSRAttributes,
   pushCertificate,
   issueCertificate,
   autoRenewCertificate,
   removeCertificate,
   syncLocation,
];


export default epics;