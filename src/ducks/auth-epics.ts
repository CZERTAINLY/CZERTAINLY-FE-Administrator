import { EMPTY, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
// import history from "browser-history";

import { AppEpic } from 'ducks';

import { actions as alertActions } from "./alerts";
import { extractError } from 'utils/net';

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
               err => of(slice.actions.getProfileFailure({ error: extractError(err, "Failed to get user profile") }))
            )

         )

      )

   );

};


const getProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

               err => of(slice.actions.updateProfileFailure({ error: extractError(err, "Failed to update user profile") }))

            )

         )

      )

   );

};


const updateProfileFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateProfileFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

};


const updateProfileSuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateProfileSuccess.match
      ),
      switchMap(

         action => {
            if (action.payload.redirect) {
               throw new Error("REDIRECT NOT IMPLEMENTED");
               //history.push(action.payload.redirect);
            } else {
               throw new Error("REDIRECT NOT IMPLEMENTED");
               //history.goBack();
            }
            return EMPTY;
         }

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
               err => of(slice.actions.getResourcesFailure({ error: extractError(err, "Failed to get user resources") }))
            )

         )
      )

   );

};


const getResourcesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getResourcesFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.listObjectsFailure({ error: extractError(err, "Failed to get objects list") }))
            )

         )

      )

   );

};


const listObjectsFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listObjectsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

};


export const epics = [
   getProfile,
   getProfileFailure,
   getResources,
   updateProfile,
   updateProfileSuccess,
   updateProfileFailure,
   getResourcesFailure,
   listObjects,
   listObjectsFailure
];


export default epics;
