import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import history from "browser-history";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./credentials";

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
                  credentialList: credentials.map(credentialDTO => transformCredentialDtoToModel(credentialDTO))
               })
            ),

            catchError(
               err => of(slice.actions.listCredentialsFailure({ error: extractError(err, "Failed to get Credential list") }))
            )

         )

      )

   );

}


const listCredentialsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCredentialsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getCredentialDetailFailure({ error: extractError(err, "Failed to get Credential") }))
            )

         )

      )

   );

}


const getCredentialDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCredentialDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
                  credentialProviderList: providers.map(provider => transformConnectorDTOToModel(provider))
               })
            ),
            catchError((err) =>
               of(
                  slice.actions.listCredentialProvidersFailure({ error: extractError(err, "Failed to get Credential Provider list") })
               )
            )
         )
      )
   );
}

const getCredentialProvidersFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(
      filter(
         slice.actions.listCredentialProvidersFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
                  credentialProviderAttributesDescriptors: attributeDescriptors.map(attributeDescriptor => transformAttributeDescriptorDTOToModel(attributeDescriptor))
               })
            ),
            catchError(
               err => of(slice.actions.getCredentialProviderAttributesDescriptorsFailure({ error: extractError(err, "Failed to get Credential Provider Attribute Descriptor list") }))
            )

         )

      )

   );
}


const getCredentialProviderAttributeDescriptorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCredentialProviderAttributesDescriptorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               uuid => slice.actions.createCredentialSuccess({ uuid })
            ),

            catchError(
               err => of(slice.actions.createCredentialFailure({ error: extractError(err, "Failed to create Credential") }))
            )

         )

      )

   );

}


const createCredentialSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(
      filter(
         slice.actions.createCredentialSuccess.match
      ),
      switchMap(
         action => {
            history.push(`./detail/${action.payload}`);
            return EMPTY;
         }
      )
   )

}


const createCredentialFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createCredentialFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.deleteCredentialSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteCredentialFailure({ error: extractError(err, "Failed to delete Credential") }))
            )

         )

      )

   );

}


const deleteCredentialSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteCredentialSuccess.match
      ),
      switchMap(
         () => {
            history.push("../");
            return EMPTY
         }
      )
   )

}


const deleteCredentialFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteCredentialFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
            action.payload.attributes.map(attribute => transformAttributeModelToDTO(attribute))
         ).pipe(

            map(
               credential => slice.actions.updateCredentialSuccess({
                  credential: transformCredentialDtoToModel(credential)
               })
            ),
            catchError(
               err => of(slice.actions.updateCredentialFailure({ error: extractError(err, "Failed to update Credential") }))
            )

         )

      )

   );

}


const updateCredentialSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(
      filter(
         slice.actions.updateCredentialSuccess.match
      ),
      switchMap(
         action => {
            history.push(`../detail/${action.payload.credential.uuid}`);
            return EMPTY;
         }
      )
   )

}


const updateCredentialFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateCredentialFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

               err => of(slice.actions.bulkDeleteCredentialsFailure({ error: extractError(err, "Failed to update Credential") }))

            )

         )

      )

   );

}


const bulkDeleteCredentialFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteCredentialsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkForceDeleteCredentialsFailure({ error: extractError(err, "Failed to update Credential") }))
            )

         )

      )

   );

}


const bulkForceDeleteCredentialsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteCredentialsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listCredentials,
   listCredentialsFailure,
   listCredentialProviders,
   getCredentialProvidersFailure,
   getCredentialProviderAttributeDescriptors,
   getCredentialProviderAttributeDescriptorsFailure,
   getCredentialDetail,
   getCredentialDetailFailure,
   createCredential,
   createCredentialFailure,
   createCredentialSuccess,
   deleteCredential,
   deleteCredentialSuccess,
   deleteCredentialFailure,
   updateCredential,
   updateCredentialSuccess,
   updateCredentialFailure,
   bulkDeleteCredential,
   bulkDeleteCredentialFailure,
   bulkForceDeleteCredentials,
   bulkForceDeleteCredentialsFailure
];

export default epics;
