import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import history from "browser-history";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./authorities";
import { transformAuthorityDtoToModel } from "./transform/authorities";
import { transformAttributeModelToDTO } from "./transform/attributes";


const listAuthorities: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(slice.actions.listAuthorities.match),
      switchMap(

         () => deps.apiClients.authorities.getAuthoritiesList().pipe(

            map(

               authorities => slice.actions.listAuthoritiesSuccess({
                  authorityList: authorities.map(profileDto => transformAuthorityDtoToModel(profileDto))
               })

            ),

            catchError(
               err => of(slice.actions.listAuthoritiesFailure({ error: extractError(err, "Failed to get Authorities list") }))
            )

         )

      )

   );

}


const listAuthoritiesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listAuthoritiesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getAuthorityDetailFailure({ error: extractError(err, "Failed to get Authority detail") }))
            )

         )

      )

   );

}


const getAuthorityDetailFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAuthorityDetailFailure.match
      ),

      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
            action.payload.attributes.map(attribute => transformAttributeModelToDTO(attribute)),
            action.payload.connectorUuid,
            action.payload.kind
         ).pipe(

            map(
               uuid => slice.actions.createAuthoritySuccess({ uuid })
            ),
            catchError(
               err => of(slice.actions.createAuthorityFailure({ error: extractError(err, "Failed to create Authority") }))
            )

         )

      )

   );

}


const createAuthoritySuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAuthoritySuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload}`);
            return EMPTY;
         }
      )

   );

}


const createAuthorityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createAuthorityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
            action.payload.authority.uuid,
            action.payload.authority.attributes.map(attribute => transformAttributeModelToDTO(attribute)),
         ).pipe(

            map(
               authorityDto => slice.actions.updateAuthoritySuccess({ authority: transformAuthorityDtoToModel(authorityDto) })
            ),
            catchError(
               err => of(slice.actions.updateAuthorityFailure({ error: extractError(err, "Failed to update Authority") }))
            )

         )

      )

   );

}


const updateAuthorityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateAuthorityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.deleteAuthoritySuccess({ uuid: action.payload.uuid })
            ),
            catchError(
               err => of(slice.actions.deleteAuthorityFailure({ error: extractError(err, "Failed to delete Authority") }))
            )

         )

      )

   );

}


const deleteAuthorityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteAuthorityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkDeleteAuthorityFailure({ error: extractError(err, "Failed to bulk delete Authorities") }))
            )

         )

      )

   );

}


const bulkDeleteAuthorityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteAuthorityFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.bulkForceDeleteAuthoritySuccess({ uuids: action.payload.uuids })
            ),
            catchError(
               err => of(slice.actions.bulkForceDeleteAuthorityFailure(extractError(err, "Failed to bulk force delete Authorities")))
            )

         )

      )

   );

}


const bulkForceDeleteAuthorityFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteAuthorityFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occurred")
      )

   );

}


const epics = [
   listAuthorities,
   listAuthoritiesFailure,
   getAuthorityDetail,
   getAuthorityDetailFailure,
   createAuthority,
   createAuthoritySuccess,
   createAuthorityFailure,
   updateAuthority,
   updateAuthorityFailure,
   deleteAuthority,
   deleteAuthorityFailure,
   bulkDeleteAuthority,
   bulkDeleteAuthorityFailure,
   bulkForceDeleteAuthority,
   bulkForceDeleteAuthorityFailure,
];


export default epics;
