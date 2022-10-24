import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
// import history from "browser-history";

import { AppEpic } from 'ducks';

import { actions as appRedirectActions } from "./app-redirect";

import * as slice from './auth';
import { transformResourceDetailDTOToModel } from './transform/auth';


const getProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getProfile.match
      ),
      switchMap(

         () => deps.apiClients.auth.profile().pipe(

            map(
               profile => slice.actions.getProfileSuccess({ profile })
            ),

            catchError(

               error => {
                  return of(
                     slice.actions.getProfileFailure(),
                     appRedirectActions.fetchError({ error, message: "Failed to get user profile" })
                  )
               }

            )

         )

      )

   );

};


const updateProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateProfile.match
      ),
      switchMap(

         action => deps.apiClients.auth.updateProfile(action.payload.profile).pipe(

            map(
               profile => slice.actions.updateProfileSuccess({ profile, redirect: action.payload.redirect })
            ),

            catchError(

               error => of(
                  slice.actions.updateProfileFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to update user profile" })
               )

            )

         )

      )

   );

};


const updateProfileSuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateProfileSuccess.match
      ),
      map(

         action =>

            action.payload.redirect ?

               appRedirectActions.redirect({ url: action.payload.redirect })
               :
               appRedirectActions.goBack()

      )

   );

};


const getResources: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getResources.match
      ),
      switchMap(
         () => deps.apiClients.auth.getAllResources().pipe(

            map(
               resources => slice.actions.getResourcesSuccess({ resources: resources.map(resource => transformResourceDetailDTOToModel(resource)) })
            ),

            catchError(

               err => of(
                  slice.actions.getResourcesFailure(),
                  appRedirectActions.fetchError({ error: err.payload.error, message: "Failed to get user resources" })
               )

            )

         )
      )

   );

};


const listObjects: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listObjects.match
      ),
      switchMap(

         action => deps.apiClients.auth.listObjects(action.payload.endpoint).pipe(

            map(
               objects => slice.actions.listObjectsSuccess({ objects })
            ),

            catchError(

               err => of(
                  slice.actions.listObjectsFailure(),
                  appRedirectActions.fetchError({ error: err.payload.error, message: "Failed to get objects list" })
               )

            )

         )

      )

   );

};


export const epics = [
   getProfile,
   getResources,
   updateProfile,
   updateProfileSuccess,
   listObjects,
];


export default epics;
