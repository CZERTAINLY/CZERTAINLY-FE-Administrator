import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./authorities";
import { actions as appRedirectActions } from "./app-redirect";

import { transformAuthorityDtoToModel } from "./transform/authorities";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO } from "./transform/attributes";
import { transformConnectorDTOToModel } from "./transform/connectors";


const listAuthorities: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(slice.actions.listAuthorities.match),
      switchMap(

         () => deps.apiClients.authorities.getAuthoritiesList().pipe(

            map(

               authorities => slice.actions.listAuthoritiesSuccess({
                  authorityList: authorities.map(transformAuthorityDtoToModel)
               })

            ),

            catchError(
               err => of(
                  slice.actions.listAuthoritiesFailure({ error: extractError(err, "Failed to get Authorities list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Authorities list" })
               )
            )

         )

      )

   );

}


const getAuthorityDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorityDetail.match
      ),

      switchMap(

         action => deps.apiClients.authorities.getAuthorityDetail(action.payload.uuid).pipe(

            map(
               authorityDto => slice.actions.getAuthorityDetailSuccess({ authority: transformAuthorityDtoToModel(authorityDto) })
            ),

            catchError(
               err => of(
                  slice.actions.getAuthorityDetailFailure({ error: extractError(err, "Failed to get Authority detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Authority detail" })
               )
            )

         )

      )

   );

}


const listAuthorityProviders: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAuthorityProviders.match
      ),
      switchMap(
         () => deps.apiClients.connectors.getConnectorsList("authorityProvider").pipe(

            map(
               providers => slice.actions.listAuthorityProvidersSuccess({
                  connectors: providers.map(transformConnectorDTOToModel)
               })
            ),

            catchError(
               (err) => of(
                  slice.actions.listAuthorityProvidersFailure({ error: extractError(err, "Failed to get Authority Provider list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Authority Provider list" })
               )
            )

         )
      )
   );
}


const getAuthorityProviderAttributesDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorityProviderAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAttributes(
            action.payload.uuid,
            "authorityProvider",
            action.payload.kind
         ).pipe(

            map(
               attributeDescriptors => slice.actions.getAuthorityProviderAttributesDescriptorsSuccess({
                  attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getAuthorityProviderAttributeDescriptorsFailure({ error: extractError(err, "Failed to get Authority Provider Attribute Descriptor list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Authority Provider Attribute Descriptor list" })
               )
            )

         )

      )

   );
}


const getRAProfilesAttributesDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getRAProfilesAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.authorities.listRAProfileAttributesDescriptors(action.payload.authorityUuid).pipe(

            map(
               descriptors => slice.actions.getRAProfilesAttributesDescriptorsSuccess({
                  authorityUuid: action.payload.authorityUuid,
                  attributesDescriptors: descriptors.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getRAProfilesAttributesDescriptorsFailure({ error: extractError(err, "Failed to get RA Profile Attribute Descriptor list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get RA Profile Attribute Descriptor list" })
               )
            )

         )

      )

   );

}


const createAuthority: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAuthority.match
      ),
      switchMap(

         action => deps.apiClients.authorities.createNewAuthority(
            action.payload.name,
            action.payload.attributes.map(transformAttributeModelToDTO),
            action.payload.connectorUuid,
            action.payload.kind
         ).pipe(

            mergeMap(
               obj => of(
                  slice.actions.createAuthoritySuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${obj.uuid}` })
               )
            ),

            catchError(
               err => of(
                  slice.actions.createAuthorityFailure({ error: extractError(err, "Failed to create Authority") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create Authority" })
               )
            )

         )

      )

   );

}


const updateAuthority: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAuthority.match
      ),

      switchMap(

         action => deps.apiClients.authorities.updateAuthority(
            action.payload.uuid,
            action.payload.attributes.map(transformAttributeModelToDTO),
         ).pipe(

            mergeMap(
               authorityDto => of(
                  slice.actions.updateAuthoritySuccess({ authority: transformAuthorityDtoToModel(authorityDto) }),
                  appRedirectActions.redirect({ url: `../../detail/${authorityDto.uuid}` })

               )
            ),

            catchError(
               err => of(
                  slice.actions.updateAuthorityFailure({ error: extractError(err, "Failed to update Authority") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update Authority" })
               )
            )

         )

      )

   );

}


const deleteAuthority: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAuthority.match
      ),
      switchMap(

         action => deps.apiClients.authorities.deleteAuthority(action.payload.uuid).pipe(

            mergeMap(
               () => of(
                  slice.actions.deleteAuthoritySuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
               )
            ),

            catchError(
               err => of(
                  slice.actions.deleteAuthorityFailure({ error: extractError(err, "Failed to delete Authority") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete Authority" })
               )
            )

         )

      )

   );

}


const bulkDeleteAuthority: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAuthority.match
      ),
      switchMap(

         action => deps.apiClients.authorities.bulkDeleteAuthority(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteAuthoritySuccess({ uuids: action.payload.uuids, errors })
            ),

            catchError(
               err => of(
                  slice.actions.bulkDeleteAuthorityFailure({ error: extractError(err, "Failed to bulk delete Authorities") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk delete Authorities" })
               )
            )

         )

      )

   );

}


const bulkForceDeleteAuthority: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteAuthority.match
      ),

      switchMap(

         action => deps.apiClients.authorities.bulkForceDeleteAuthority(action.payload.uuids).pipe(

            mergeMap(

               () => iif(

                  () => !!action.payload.redirect,
                  of(
                     slice.actions.bulkForceDeleteAuthoritySuccess({ uuids: action.payload.uuids, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! })
                  ),
                  of(
                     slice.actions.bulkForceDeleteAuthoritySuccess({ uuids: action.payload.uuids, redirect: action.payload.redirect })
                  )
               )

            ),

            catchError(
               err => of(
                  slice.actions.bulkForceDeleteAuthorityFailure({ error: extractError(err, "Failed to bulk force delete Authorities") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to bulk force delete Authorities" })
               )
            )

         )

      )

   );

}


const epics = [
   listAuthorities,
   getAuthorityDetail,
   listAuthorityProviders,
   getAuthorityProviderAttributesDescriptors,
   getRAProfilesAttributesDescriptors,
   createAuthority,
   updateAuthority,
   deleteAuthority,
   bulkDeleteAuthority,
   bulkForceDeleteAuthority,
];


export default epics;
