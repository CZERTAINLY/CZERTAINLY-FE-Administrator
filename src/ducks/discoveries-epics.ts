import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./discoveries";
import { actions as appRedirectActions } from "./app-redirect";

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
               err => of(
                  slice.actions.listDiscoveriesFailure({ error: extractError(err, "Failed to get Discovery list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery list" })
               )
            )

         )

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
               err => of(
                  slice.actions.getDiscoveryDetailFailure({ error: extractError(err, "Failed to get Discovery detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery detail" })
               )
            )

         )

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
               err => of(
                  slice.actions.listDiscoveryProvidersFailure({ error: extractError(err, "Failed to get Discovery Provider list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery Provider list" })
               )
            )

         )

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
               err => of(
                  slice.actions.getDiscoveryProviderAttributeDescriptorsFailure({ error: extractError(err, "Failed to get Discovery Provider Attribute list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery Provider Attribute list" })
               )
            )

         )

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

            mergeMap(
               obj => of(
                  slice.actions.createDiscoverySuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${obj.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.createDiscoveryFailure({ error: extractError(err, "Failed to create discovery") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create discovery" })
               )
            )

         )

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

            mergeMap(
               () => of(
                  slice.actions.deleteDiscoverySuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
               )
            ),

            catchError(
               err => of(
                  slice.actions.deleteDiscoveryFailure({ error: extractError(err, "Failed to delete discovery") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete discovery" })
               )
            )

         )

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
               () => slice.actions.bulkDeleteDiscoverySuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(
                  slice.actions.bulkDeleteDiscoveryFailure({ error: extractError(err, "Failed to bulk delete Discoveries") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk delete Discoveries" })
               )
            )

         )

      )

   );

}


const epics = [
   listDiscoveries,
   getDiscoveryDetail,
   listDiscoveryProviders,
   getDiscoveryProviderAttributesDescriptors,
   createDiscovery,
   deleteDiscovery,
   bulkDeleteDiscovery,
];


export default epics;
