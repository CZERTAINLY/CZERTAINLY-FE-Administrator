import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { slice } from "./entities";
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
            catchError((err) =>
               of(
                  slice.actions.listEntityProvidersFailure({ error: extractError(err, "Failed to get Authority Provider list") })
               )
            )
         )
      )
   );
}


const listAuthorityProvidersFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(
      filter(
         slice.actions.listEntityProvidersFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getEntityProviderAttributeDescriptorsFailure({ error: extractError(err, "Failed to get Authority Provider Attribute Descriptor list") }))
            )

         )

      )

   );
}


const getAuthorityProviderAttributesDescriptorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getEntityProviderAttributeDescriptorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.listEntitiesFailure({ error: extractError(err, "Failed to get Authorities list") }))
            )


         )

      )

   );

}


const listEntitiesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listEntitiesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getEntityDetailFailure({ error: extractError(err, "Failed to get Authority detail") }))
            )

         )

      )

   );

}


const getEntityDetailFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getEntityDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(

               uuid => slice.actions.addEntitySuccess({ uuid })

            ),
            catchError(

               err => of(slice.actions.addEntityFailure({ error: extractError(err, "Failed to add Authority") }))

            )

         )

      )

   );

}


const addEntityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addEntityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(

               entity => slice.actions.updateEntitySuccess({ entity: transformEntityDtoToModel(entity) })

            ),
            catchError(

               err => of(slice.actions.updateEntityFailure({ error: extractError(err, "Failed to update Authority") }))

            )

         )

      )

   );

}


const updateEntityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateEntityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}



const deleteEntity: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteEntity.match
      ),
      switchMap(

         action => deps.apiClients.entities.removeEntity(action.payload.uuid).pipe(

            map(

               () => slice.actions.deleteEntitySuccess({ uuid: action.payload.uuid })

            ),


            catchError(
               err => of(slice.actions.deleteEntityFailure({ error: extractError(err, "Failed to delete Authority") }))
            )
         )

      )

   );

}


const deleteEntityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteEntityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listEntityProviders,
   listAuthorityProvidersFailure,
   getEntityProviderAttributesDescriptors,
   getAuthorityProviderAttributesDescriptorsFailure,
   listEntities,
   listEntitiesFailure,
   getEntityDetail,
   getEntityDetailFailure,
   addEntity,
   addEntityFailure,
   updateEntity,
   updateEntityFailure,
   deleteEntity,
   deleteEntityFailure
];


export default epics;
