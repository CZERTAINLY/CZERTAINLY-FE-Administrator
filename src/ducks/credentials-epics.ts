import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./credentials";
import { actions as appRedirectActions } from "./app-redirect";

import { transformCredentialDtoToModel } from "./transform/credentials";
import { transformConnectorDTOToModel } from "./transform/connectors";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";


const listCredentials: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCredentials.match
      ),
      switchMap(

         () => deps.apiClients.credentials.getCredentialsList().pipe(

            map(
               credentials => slice.actions.listCredentialsSuccess({
                  credentialList: credentials.map(transformCredentialDtoToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listCredentialsFailure({ error: extractError(error, "Failed to get Credential list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential list" })
               )
            )

         )

      )

   );

}


const getCredentialDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCredentialDetail.match
      ),
      switchMap(

         action => deps.apiClients.credentials.getCredentialDetail(action.payload.uuid).pipe(

            map(
               credential => slice.actions.getCredentialDetailSuccess({
                  credetnial: transformCredentialDtoToModel(credential)
               })
            ),

            catchError(
               error => of(
                  slice.actions.getCredentialDetailFailure({ error: extractError(error, "Failed to get Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential" })
               )
            )

         )

      )

   );

}


const listCredentialProviders: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCredentialProviders.match
      ),
      switchMap(
         () => deps.apiClients.connectors.getConnectorsList("credentialProvider").pipe(

            map(
               providers => slice.actions.listCredentialProvidersSuccess({
                  connectors: providers.map(transformConnectorDTOToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listCredentialProvidersFailure({ error: extractError(error, "Failed to get Credential Provider list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential Provider list" })
               )
            )
         )
      )
   );
}


const getCredentialProviderAttributeDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCredentialProviderAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAttributes(
            action.payload.uuid,
            "credentialProvider",
            action.payload.kind
         ).pipe(

            map(
               attributeDescriptors => slice.actions.getCredentialProviderAttributesDescriptorsSuccess({
                  credentialProviderAttributesDescriptors: attributeDescriptors.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.getCredentialProviderAttributesDescriptorsFailure({ error: extractError(error, "Failed to get Credential Provider Attribute Descriptor list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential Provider Attribute Descriptor list" })
               )
            )

         )

      )

   );
}


const createCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createCredential.match
      ),
      switchMap(

         action => deps.apiClients.credentials.createNewCredential(
            action.payload.name,
            action.payload.kind,
            action.payload.connectorUuid,
            action.payload.attributes
         ).pipe(

            mergeMap(
               obj => of(
                  slice.actions.createCredentialSuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${obj.uuid}` })
               )
            ),

            catchError(
               error => of(
                  slice.actions.createCredentialFailure({ error: extractError(error, "Failed to create Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to create Credential" })
               )
            )

         )

      )

   );

}


const deleteCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteCredential.match
      ),
      switchMap(

         action => deps.apiClients.credentials.deleteCredential(action.payload.uuid).pipe(

            mergeMap(
               () => of(
                  slice.actions.deleteCredentialSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
               )
            ),

            catchError(
               error => of(
                  slice.actions.deleteCredentialFailure({ error: extractError(error, "Failed to delete Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to delete Credential" })
               )
            )

         )

      )

   );

}


const updateCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateCredential.match
      ),
      switchMap(

         action => deps.apiClients.credentials.updateCredential(
            action.payload.uuid,
            action.payload.attributes.map(transformAttributeModelToDTO)
         ).pipe(

            mergeMap(

               credential => of(

                  slice.actions.updateCredentialSuccess({
                     credential: transformCredentialDtoToModel(credential)
                  }),

                  appRedirectActions.redirect({ url: "../../detail/" + credential.uuid })
               )

            ),

            catchError(
               error => of(
                  slice.actions.updateCredentialFailure({ error: extractError(error, "Failed to update Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to update Credential" })
               )
            )

         )

      )

   );

}


const bulkDeleteCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteCredentials.match
      ),
      switchMap(

         action => deps.apiClients.credentials.bulkDeleteCredentials(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteCredentialsSuccess({ uuids: action.payload.uuids, errors })
            ),

            catchError(
               error => of(
                  slice.actions.bulkDeleteCredentialsFailure({ error: extractError(error, "Failed to update Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to update Credential" })
               )
            )

         )

      )

   );

}


const bulkForceDeleteCredentials: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteCredentials.match
      ),
      switchMap(

         action => deps.apiClients.credentials.bulkForceDeleteCredentials(action.payload.uuids).pipe(
            map(
               () => slice.actions.bulkForceDeleteCredentialsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               error => of(
                  slice.actions.bulkForceDeleteCredentialsFailure({ error: extractError(error, "Failed to update Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to update Credential" })
               )
            )

         )

      )

   );

}


const epics = [
   listCredentials,
   listCredentialProviders,
   getCredentialProviderAttributeDescriptors,
   getCredentialDetail,
   createCredential,
   deleteCredential,
   updateCredential,
   bulkDeleteCredential,
   bulkForceDeleteCredentials,
];

export default epics;
