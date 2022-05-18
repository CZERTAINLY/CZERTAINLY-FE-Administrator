import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { UserProfileModel, Role } from 'models';
import { extractError } from 'utils/net';
import { UserProfileDTO } from 'api/auth';
import * as slice from './auth';


const dtoToModel = (profile: UserProfileDTO): UserProfileModel => ({
      username: profile.username,
      name: profile.name,
      surname: profile.surname,
      email: profile.email,
      role: profile.role === "superAdministrator" ? Role.SuperAdmin : Role.Admin,
});


const login: AppEpic = action$ => {

   return action$.pipe(

      filter(
         slice.actions.login.match
      ),
      map(
         () => slice.actions.loginSuccess("token")
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

            map(profile => slice.actions.getProfileSuccess(dtoToModel(profile))),

            catchError(err => of(slice.actions.getProfileFailed(extractError(err, "Failed to get user profile"))))

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
            action.payload.name,
            action.payload.surname,
            action.payload.username,
            action.payload.email
         ).pipe(

            map(() => slice.actions.updateProfileSuccess(action.payload)),

            catchError(err => of(slice.actions.updateProfileFailed(extractError(err, "Failed to update profile"))))

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
