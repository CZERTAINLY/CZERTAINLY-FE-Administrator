import { createSelector } from 'reselect';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';

import { Profile, Role } from 'models';
import { createFeatureSelector } from 'utils/ducks';
import { createErrorAlertAction } from './alerts';

export const statePath = 'auth';

export enum Actions {
  LoginRequest = '@@auth/LOGIN_REQUEST',
  LoginSuccess = '@@auth/LOGIN_SUCCESS',
  LoginFailure = '@@auth/LOGIN_FAILURE',
  LogoutRequest = '@@auth/LOGOUT_REQUEST',
  LogoutSuccess = '@@auth/LOGOUT_SUCCESS',
  LogoutFailure = '@@auth/LOGOUT_FAILURE',
  ProfileRequest = '@@auth/PROFILE_REQUEST',
  ProfileSuccess = '@@auth/PROFILE_SUCCESS',
  ProfileFailure = '@@auth/PROFILE_FAILURE',
  UpdateProfileRequest = '@@auth/UPDATE_PROFILE_REQUEST',
  UpdateProfileSuccess = '@@auth/UPDATE_PROFILE_SUCCESS',
  UpdateProfileFailure = '@@auth/UPDATE_PROFILE_FAILURE',
};

export const actions = {
  requestLogin: createCustomAction(Actions.LoginRequest, (creds: any) => ({ creds })),
  receiveLogin: createCustomAction(Actions.LoginSuccess, (token: string) => ({ token })),
  requestLogout: createCustomAction(Actions.LogoutRequest),
  requestProfile: createCustomAction(Actions.ProfileRequest),
  receiveProfile: createCustomAction(Actions.ProfileSuccess, (profile: Profile) => ({ profile })),
  failProfile: createCustomAction(Actions.ProfileFailure, (error?: string) => createErrorAlertAction(error)),
  requestUpdateProfile: createCustomAction(Actions.UpdateProfileRequest, (name: string, surname: string, username: string, email: string) => ({ name, surname, username, email })),
  receiveUpdateProfile: createCustomAction(Actions.UpdateProfileSuccess, (name: string, surname: string, username: string, email: string) => ({ name, surname, username, email })),
  failUpdateProfile: createCustomAction(Actions.UpdateProfileFailure, (error?: string) => createErrorAlertAction(error)),
};

export type Action = ActionType<typeof actions>;

export type State = {
  isFetching: boolean;
  isFetchingProfile: boolean;
  isAuthenticated: boolean;
  isUpdatingProfile: boolean;
  errorMessage: string;
  profile: Profile | null;
};

// const token = localStorage.getItem('token');

export const initialState: State = {
  isFetching: false,
  isFetchingProfile: false,
  isAuthenticated: true, // !!token,
  isUpdatingProfile: false,
  errorMessage: '',
  profile: null,
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestLogin):
      return { ...state, isFetching: true, isAuthenticated: false };
    case getType(actions.receiveLogin):
      return { ...state, isFetching: false, isAuthenticated: true };
    case getType(actions.requestLogout):
      return { ...state, isAuthenticated: false };
    case getType(actions.requestProfile):
      return { ...state, isFetchingProfile: true, profile: null };
    case getType(actions.receiveProfile):
      return { ...state, isFetchingProfile: false, profile: action.profile };
    case getType(actions.failProfile):
      return { ...state, isFetchingProfile: false, isAuthenticated: false };
    case getType(actions.requestUpdateProfile):
      return { ...state, isUpdatingProfile: true };
    case getType(actions.receiveUpdateProfile):
      return { ...state, isUpdatingProfile: false, profile: { ...(state.profile as Profile), name: action.name, surname: action.surname, username: action.username, email: action.email }};
    case getType(actions.failUpdateProfile):
      return { ...state, isUpdatingProfile: false };
    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const isAuthenticated = createSelector(
  selectState,
  state => state.isAuthenticated,
);

const isFetching = createSelector(
  selectState,
  state => state.isFetching,
);

const isFetchingProfile = createSelector(
  selectState,
  state => state.isFetchingProfile,
);

const isUpdatingProfile = createSelector(
  selectState,
  state => state.isUpdatingProfile,
);

const selectErrorMessage = createSelector(
  selectState,
  state => state.errorMessage,
);

const selectProfile = createSelector(
  selectState,
  state => state.profile,
);

const isSuperAdmin = createSelector(
  selectProfile,
  profile => profile?.role === Role.SuperAdmin,
);

export const selectors = {
  selectState,
  isAuthenticated,
  isFetching,
  isFetchingProfile,
  isSuperAdmin,
  isUpdatingProfile,
  selectErrorMessage,
  selectProfile,
};
