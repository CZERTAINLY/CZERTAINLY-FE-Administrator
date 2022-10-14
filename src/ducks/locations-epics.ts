import { AppEpic } from "ducks";
import { EMPTY, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import history from "browser-history";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { slice } from "./locations";

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
               err => of(slice.actions.listLocationsFailure({ error: extractError(err, "Failed to get Location list") }))
            )

         )
      )
   );
}


const listLocationsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listLocationsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getLocationDetailFailure({ error: extractError(err, "Failed to get Location detail") }))
            )

         )

      )

   );

}


const getLocationDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getLocationDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

                  map(
                     location => slice.actions.addLocationSuccess({ location: transformLocationDtoToModel(location), entityUuid: action.payload.entityUuid })
                  )

               )

            ),

            catchError(
               err => of(slice.actions.addLocationFailure({ error: extractError(err, "Failed to add Location") }))
            )

         )

      )

   );

}


const addLocationSuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addLocationSuccess.match
      ),
      switchMap(
         action => {
            history.push(`./detail/${action.payload.entityUuid}/${action.payload.location.uuid}`);
            return EMPTY;
         }
      )

   );

}


const addLocationFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addLocationFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               location => slice.actions.editLocationSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               err => of(slice.actions.editLocationFailure({ error: extractError(err, "Failed to edit Location") }))
            )

         )

      )

   );

}


const editLocationSuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.editLocationSuccess.match
      ),
      switchMap(
         action => {
            history.push(`../detail/${action.payload.location.uuid}`);
            return EMPTY;
         }
      )

   );

}


const editLocationFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.editLocationFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.deleteLocationSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect })
            ),

            catchError(
               err => of(slice.actions.deleteLocationFailure({ error: extractError(err, "Failed to delete Location") }))
            )

         )

      )

   );

}




const deleteLocationSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteLocationSuccess.match
      ),
      switchMap(

         action => {
            if (action.payload.redirect) history.push(action.payload.redirect);
            return EMPTY;
         }

      )

   )

};


const deleteLocationFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteLocationFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.enableLocationFailure({ error: extractError(err, "Failed to enable Location") }))
            )

         )

      )

   );

}


const enableLocationFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.enableLocationFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.disableLocationFailure({ error: extractError(err, "Failed to disable Location") }))
            )

         )

      )

   );

}


const disableLocationFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.disableLocationFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getPushAttributesFailure({ error: extractError(err, "Failed to get Push Attributes") }))
            )

         )

      )

   );

}


const getPushAttributesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getPushAttributesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getCSRAttributesFailure({ error: extractError(err, "Failed to get CSR Attributes") }))
            )

         )

      )

   );

}


const getCSRAttributesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCSRAttributesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               location => slice.actions.pushCertificateSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               err => of(slice.actions.pushCertificateFailure({ error: extractError(err, "Failed to push Certificate") }))
            )

         )

      )

   );

}


const pushCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.pushCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.issueCertificateFailure({ error: extractError(err, "Failed to issue Certificate") }))
            )

         )

      )

   );

}


const issueCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.issueCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               location => slice.actions.autoRenewCertificateSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               err => of(slice.actions.autoRenewCertificateFailure({ error: extractError(err, "Failed to auto-renew Certificate") }))
            )

         )

      )

   );

}


const autoRenewCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.autoRenewCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               location => slice.actions.removeCertificateSuccess({ location: transformLocationDtoToModel(location) })
            ),

            catchError(
               err => of(slice.actions.removeCertificateFailure({ error: extractError(err, "Failed to remove Certificate") }))
            )

         )

      )

   );

}


const removeCertificateFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.removeCertificateFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.syncLocationFailure({ error: extractError(err, "Failed to sync Location") }))
            )

         )

      )

   );

}


const syncLocationFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.syncLocationFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listLocations,
   listLocationsFailure,
   getLocationDetail,
   getLocationDetailFailure,
   addLocation,
   addLocationSuccess,
   addLocationFailure,
   editLocation,
   editLocationSuccess,
   editLocationFailure,
   deleteLocation,
   deleteLocationSuccess,
   deleteLocationFailure,
   enableLocation,
   enableLocationFailure,
   disableLocation,
   disableLocationFailure,
   getPushAttributes,
   getPushAttributesFailure,
   getCSRAttributes,
   getCSRAttributesFailure,
   pushCertificate,
   pushCertificateFailure,
   issueCertificate,
   issueCertificateFailure,
   autoRenewCertificate,
   autoRenewCertificateFailure,
   removeCertificate,
   removeCertificateFailure,
   syncLocation,
   syncLocationFailure
];


export default epics;