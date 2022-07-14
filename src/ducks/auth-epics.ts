import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { UserProfileDtoToModel } from './transform/auth';
import { extractError } from 'utils/net';

import * as slice from './auth';


const login: AppEpic = action$ => {

   return action$.pipe(

      filter(
         slice.actions.login.match
      ),
      map(
         () => slice.actions.loginSuccess({ token: "token" })
      )

   );

}


const getProfile: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getProfile.match
      ),

      switchMap(

         () => deps.apiClients.auth.getProfile().pipe(

            map(
               profile => slice.actions.getProfileSuccess({ userProfile: UserProfileDtoToModel(profile) })
            ),

            catchError(
               err => of(slice.actions.getProfileFailed({ error: extractError(err, "Failed to get user profile") }))
            )

         )

      )

   )

}


const updateProfile: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateProfile.match
      ),

      switchMap(

         action => deps.apiClients.auth.updateProfile(
            action.payload.userProfile.name,
            action.payload.userProfile.surname,
            action.payload.userProfile.username,
            action.payload.userProfile.email
         ).pipe(

            map(
               () => slice.actions.updateProfileSuccess({ userProfile: action.payload.userProfile })
            ),

            catchError(
               err => of(slice.actions.updateProfileFailed({ error: extractError(err, "Failed to update profile") }))
            )

         )

      )

   )

}


export const epics = [
   login,
   getProfile,
   updateProfile
];


export default epics;
