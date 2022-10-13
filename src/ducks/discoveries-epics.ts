import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import history from "browser-history";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./discoveries";
import { transformDiscoveryDTOToModel } from "./transform/discoveries";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transformConnectorDTOToModel } from "./transform/connectors";


const listDiscoveries: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(slice.actions.listDiscoveries.match),
      switchMap(

         () => deps.apiClients.discoveries.getDiscoveryList().pipe(

            map(

               discoveries => slice.actions.listDiscoveriesSuccess({
                  discoveryList: discoveries.map(transformDiscoveryDTOToModel)
               })

            ),

            catchError(
               err => of(slice.actions.listDiscoveriesFailure({ error: extractError(err, "Failed to get Discovery list") }))
            )

         )

      )

   );

}


const listDiscoveriesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listDiscoveriesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const getDiscoveryDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(


      filter(
         slice.actions.getDiscoveryDetail.match
      ),

      switchMap(

         action => deps.apiClients.discoveries.getDiscoveryDetail(action.payload.uuid).pipe(

            map(
               discoveryDto => slice.actions.getDiscoveryDetailSuccess({ discovery: transformDiscoveryDTOToModel(discoveryDto) })
            ),

            catchError(
               err => of(slice.actions.getDiscoveryDetailFailure({ error: extractError(err, "Failed to get Discovery detail") }))
            )

         )

      )

   );

}


const getDiscoveryDetailFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDiscoveryDetailFailure.match
      ),

      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const listDiscoveryProviders: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listDiscoveryProviders.match
      ),
      switchMap(
         () => deps.apiClients.connectors.getConnectorsList("discoveryProvider").pipe(

            map(
               providers => slice.actions.listDiscoveryProvidersSuccess({
                  connectors: providers.map(transformConnectorDTOToModel)
               })
            ),

            catchError(
               err => of(slice.actions.listDiscoveryProvidersFailure({ error: extractError(err, "Failed to get Discovery Provider list") }))
            )

         )

      )

   );

}

const listDiscoveryProvidersFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(
      filter(
         slice.actions.listDiscoveryProvidersFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )
   );
}



const getDiscoveryProviderAttributesDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDiscoveryProviderAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAttributes(
            action.payload.uuid,
            "discoveryProvider",
            action.payload.kind
         ).pipe(

            map(
               attributeDescriptors => slice.actions.getDiscoveryProviderAttributesDescriptorsSuccess({
                  attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               err => of(slice.actions.getDiscoveryProviderAttributeDescriptorsFailure({ error: extractError(err, "Failed to get Discovery Provider Attribute list") }))
            )

         )

      )

   );
}


const getDiscoveryProviderAttributesDescriptorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDiscoveryProviderAttributeDescriptorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )
   );

}


const createDiscovery: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createDiscovery.match
      ),
      switchMap(

         action => deps.apiClients.discoveries.createNewDiscovery(
            action.payload.name,
            action.payload.kind,
            action.payload.connectorUuid,
            action.payload.attributes.map(transformAttributeModelToDTO),
         ).pipe(

            map(
               obj => slice.actions.createDiscoverySuccess({ uuid: obj.uuid })
            ),

            catchError(
               err => of(slice.actions.createDiscoveryFailure({ error: extractError(err, "Failed to create discovery") }))
            )

         )

      )

   );

}


const createDiscoverySuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createDiscoverySuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload.uuid}`);
            return EMPTY;
         }
      )

   );

}


const createDiscoveryFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createDiscoveryFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const deleteDiscovery: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteDiscovery.match
      ),
      switchMap(

         action => deps.apiClients.discoveries.deleteDiscovery(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteDiscoverySuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteDiscoveryFailure({ error: extractError(err, "Failed to delete discovery") }))
            )

         )

      )

   );

}


const deleteDiscoverySuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteDiscoverySuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}


const deleteDiscoveryFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteDiscoveryFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const bulkDeleteDiscovery: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteDiscovery.match
      ),
      switchMap(

         action => deps.apiClients.discoveries.bulkDeleteDiscovery(action.payload.uuids).pipe(

            map(
               ()=> slice.actions.bulkDeleteDiscoverySuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(slice.actions.bulkDeleteDiscoveryFailure({ error: extractError(err, "Failed to bulk delete Discoveries") }))
            )

         )

      )

   );

}


const bulkDeleteDiscoveryFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteDiscoveryFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listDiscoveries,
   listDiscoveriesFailure,
   getDiscoveryDetail,
   getDiscoveryDetailFailure,
   listDiscoveryProviders,
   listDiscoveryProvidersFailure,
   getDiscoveryProviderAttributesDescriptors,
   getDiscoveryProviderAttributesDescriptorsFailure,
   createDiscovery,
   createDiscoverySuccess,
   createDiscoveryFailure,
   deleteDiscovery,
   deleteDiscoverySuccess,
   deleteDiscoveryFailure,
   bulkDeleteDiscovery,
   bulkDeleteDiscoveryFailure,
];


export default epics;
