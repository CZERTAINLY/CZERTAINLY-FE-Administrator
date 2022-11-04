import { iif, of } from "rxjs";
import { catchError, filter, map, switchMap, mergeMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./entities";
import { actions as appRedirectActions } from "./app-redirect";

import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transformEntityDtoToModel } from "./transform/entities";
import { transformConnectorDTOToModel } from "./transform/connectors";


const listEntityProviders: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listEntityProviders.match
      ),
      switchMap(
         () => deps.apiClients.connectors.getConnectorsList("entityProvider").pipe(

            map(
               providers => slice.actions.listEntityProvidersSuccess({
                  providers: providers.map(transformConnectorDTOToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listEntityProvidersFailure({ error: extractError(error, "Failed to get Entity Provider list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Entity Provider list" })
               )
            )
         )
      )
   );
}


const getEntityProviderAttributesDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getEntityProviderAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAttributes(
            action.payload.uuid,
            "entityProvider",
            action.payload.kind
         ).pipe(

            map(
               attributeDescriptors => slice.actions.getEntityProviderAttributesDescriptorsSuccess({
                  attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.getEntityProviderAttributeDescriptorsFailure({ error: extractError(error, "Failed to get Entity Provider Attribute Descriptor list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Entity Provider Attribute Descriptor list" })
               )
            )

         )

      )

   );
}


const listEntities: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listEntities.match
      ),
      switchMap(

         () => deps.apiClients.entities.listEntities().pipe(

            map(
               entities => slice.actions.listEntitiesSuccess(
                  entities.map(transformEntityDtoToModel)
               )
            ),

            catchError(
               error => of(
                  slice.actions.listEntitiesFailure({ error: extractError(error, "Failed to get list of Entities") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get list of Entities" })
               )
            )


         )

      )

   );

}


const getEntityDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getEntityDetail.match
      ),
      switchMap(

         action => deps.apiClients.entities.getEntityDetail(action.payload.uuid).pipe(

            map(
               entity => slice.actions.getEntityDetailSuccess({ entity: transformEntityDtoToModel(entity) })
            ),

            catchError(
               error => of(
                  slice.actions.getEntityDetailFailure({ error: extractError(error, "Failed to get Entity detail") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Entity detail" })
               )
            )

         )

      )

   );

}


const addEntity: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addEntity.match
      ),
      switchMap(

         action => deps.apiClients.entities.addEntity(
            action.payload.name,
            action.payload.attributes.map(transformAttributeModelToDTO),
            action.payload.connectorUuid,
            action.payload.kind
         ).pipe(

            mergeMap(
               obj => of(
                  slice.actions.addEntitySuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${obj.uuid}` })
               )
            ),

            catchError(

               error => of(
                  slice.actions.addEntityFailure({ error: extractError(error, "Failed to add Entity") }),
                  appRedirectActions.fetchError({ error, message: "Failed to add Entity" })
               )

            )

         )

      )

   );

}


const updateEntity: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateEntity.match
      ),
      switchMap(

         action => deps.apiClients.entities.updateEntity(
            action.payload.uuid,
            action.payload.attributes.map(transformAttributeModelToDTO)
         ).pipe(

            mergeMap(
               entity => of(
                  slice.actions.updateEntitySuccess({ entity: transformEntityDtoToModel(entity) }),
                  appRedirectActions.redirect({ url: `../../detail/${entity.uuid}` })
               )
            ),

            catchError(
               error => of(
                  slice.actions.updateEntityFailure({ error: extractError(error, "Failed to update Entity") }),
                  appRedirectActions.fetchError({ error, message: "Failed to update Entity" })
               )
            )

         )

      )

   );

}


const deleteEntity: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteEntity.match
      ),
      mergeMap(

         action => deps.apiClients.entities.removeEntity(action.payload.uuid).pipe(

            mergeMap(
               () => iif(

                  () => !!action.payload.redirect,
                  of(
                     slice.actions.deleteEntitySuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! })
                  ),
                  of(
                     slice.actions.deleteEntitySuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                  )
               )
            ),

            catchError(
               error => of(
                  slice.actions.deleteEntityFailure({ error: extractError(error, "Failed to delete Entity") }),
                  appRedirectActions.fetchError({ error, message: "Failed to delete Entity" })
               )
            )

         )

      )

   );

}


const listLocationAttributeDescriptors: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listLocationAttributeDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.entities.listLocationAttributeDescriptors(action.payload.entityUuid).pipe(

            map(
               descriptors => slice.actions.listLocationAttributeDescriptorsSuccess({ descriptors: descriptors.map(transformAttributeDescriptorDTOToModel) })
            ),

            catchError(
               error => of(
                  slice.actions.listLocationAttributeDescriptorsFailure({ error: extractError(error, "Failed to get Location Attribute Descriptors") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Location Attribute Descriptors" })
               )
            )

         )

      )

   );

}


const epics = [
   listEntityProviders,
   getEntityProviderAttributesDescriptors,
   listEntities,
   getEntityDetail,
   addEntity,
   updateEntity,
   deleteEntity,
   listLocationAttributeDescriptors,
];


export default epics;
