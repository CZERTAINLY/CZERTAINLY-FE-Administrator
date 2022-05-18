import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { UserProfileModel, Role } from 'models';


export type State = {
   token: string;
   isLoggingIn: boolean;
   isFetchingProfile: boolean;
   isAuthenticated: boolean;
   isUpdatingProfile: boolean;
   profile?: UserProfileModel;
};


export const initialState: State = {
   token: "",
   isLoggingIn: false,
   isFetchingProfile: false,
   isAuthenticated: true,
   isUpdatingProfile: false,
};


export const slice = createSlice({

   name: "auth",

   initialState,

   reducers: {

      login: (state, action: PayloadAction<{ credentials: any }>) => {
         state.token = "";
         state.isAuthenticated = false;
         state.isLoggingIn = true;

      },


      loginSuccess: (state, action: PayloadAction<string>) => {
         state.token = action.payload;
         state.isAuthenticated = true;
         state.isLoggingIn = false;
      },


      loginFailed: (state, action: PayloadAction<string | undefined>) => {
         state.token = "";
         state.isAuthenticated = false;
         state.isLoggingIn = false;
      },


      logout: (state) => {
         state.token = "";
         state.isAuthenticated = false;
      },


      getProfile: (state) => {
         state.profile = undefined;
         state.isFetchingProfile = true;
      },


      getProfileSuccess: (state, action: PayloadAction<UserProfileModel>) => {
         state.profile = action.payload;
         state.isFetchingProfile = false;
      },


      getProfileFailed: (state, action: PayloadAction<string | undefined>) => {
         state.profile = undefined;
         state.isFetchingProfile = true;
      },


      updateProfile: (state, action: PayloadAction<UserProfileModel>) => {
         state.isUpdatingProfile = true;
      },

      updateProfileSuccess: (state, action: PayloadAction<UserProfileModel>) => {
         state.profile = action.payload;
         state.isUpdatingProfile = false;
      },

      updateProfileFailed: (state, action: PayloadAction<string | undefined>) => {
         state.isUpdatingProfile = false;
      }


   }

});

const selectState = createFeatureSelector<State>(slice.name);

const isAuthenticated = createSelector(selectState, state => state.isAuthenticated);

const isLoggingIn = createSelector(selectState, state => state.isLoggingIn);

const isFetchingProfile = createSelector(selectState, state => state.isFetchingProfile);

const isUpdatingProfile = createSelector(selectState, state => state.isUpdatingProfile);

const profile = createSelector(selectState, state => state.profile);

const isSuperAdmin = createSelector(profile, profile => profile?.role === Role.SuperAdmin );

export const selectors = {
   selectState,
   isAuthenticated,
   isLoggingIn,
   isFetchingProfile,
   isUpdatingProfile,
   profile,
   isSuperAdmin
};

export const actions = slice.actions;

export default slice.reducer;
