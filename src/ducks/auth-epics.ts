import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';

import { UserProfileDTO } from 'api/auth';
import { Profile, Role } from 'models';
import { extractError } from 'utils/net';
import { EpicDependencies, State as AppState } from './app-state';
import { Action, Actions, actions } from './auth';

const loginUserEpic: Epic<Action, Action> = action$ => action$.pipe(
  filter(isOfType(Actions.LoginRequest)),
  map(() => actions.receiveLogin('ahoj')),
);

const getProfile: Epic<Action, Action, AppState, EpicDependencies> = (action$, _, { apiClients }) => action$.pipe(
  filter(isOfType(Actions.ProfileRequest)),
  switchMap(() => apiClients.auth.getProfile().pipe(
    map(profile => actions.receiveProfile(mapProfile(profile))),
    catchError(err => of(actions.failProfile(extractError(err, 'Failed to get user profile')))),
  )),
);

const updateProfile: Epic<Action, Action, AppState, EpicDependencies> = (action$, _, { apiClients }) => action$.pipe(
  filter(isOfType(Actions.UpdateProfileRequest)),
  switchMap(({ name, surname, username, email }) => apiClients.auth.updateProfile(name, surname, username, email).pipe(
    map(() => actions.receiveUpdateProfile(name, surname, username, email)),
    catchError(err => of(actions.failUpdateProfile(extractError(err, 'Failed to update user profile')))),
  )),
);

function mapProfile(profile: UserProfileDTO): Profile {
  return {
    name: profile.name,
    surname: profile.surname,
    username: profile.username,
    email: profile.email,
    role: profile.role as Role,
  };
}

const epics = [
  getProfile,
  loginUserEpic,
  updateProfile,
];

export default epics;
