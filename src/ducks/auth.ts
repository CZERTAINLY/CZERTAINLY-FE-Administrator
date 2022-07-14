import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { UserProfileModel, Role } from 'models';


export type State = {
   token: string;
   isLoggingIn: boolean;
   isFetchingProfile: boolean;
   isAuthenticated: boolean;
   isUpdatingProfile: boolean;
   userProfile?: UserProfileModel;
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


      loginSuccess: (state, action: PayloadAction<{ token: string }>) => {

         state.token = action.payload.token;
         state.isAuthenticated = true;
         state.isLoggingIn = false;

      },


      loginFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.token = "";
         state.isAuthenticated = false;
         state.isLoggingIn = false;

      },


      logout: (state, action: PayloadAction<void>) => {

         state.token = "";
         state.isAuthenticated = false;

      },


      getProfile: (state, action: PayloadAction<void>) => {

         state.userProfile = undefined;
         state.isFetchingProfile = true;

      },


      getProfileSuccess: (state, action: PayloadAction<{ userProfile: UserProfileModel }>) => {

         state.userProfile = action.payload.userProfile;
         state.isFetchingProfile = false;

      },


      getProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.userProfile = undefined;
         state.isFetchingProfile = true;

      },


      updateProfile: (state, action: PayloadAction<{ userProfile: UserProfileModel }>) => {

         state.isUpdatingProfile = true;

      },

      updateProfileSuccess: (state, action: PayloadAction<{ userProfile: UserProfileModel }>) => {

         state.userProfile = action.payload.userProfile;
         state.isUpdatingProfile = false;

      },

      updateProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdatingProfile = false;

      }


   }

});


const selectState = createFeatureSelector<State>(slice.name);

const userProfile = createSelector(selectState, state => state.userProfile);

const isAuthenticated = createSelector(selectState, state => state.isAuthenticated);

const isLoggingIn = createSelector(selectState, state => state.isLoggingIn);

const isFetchingProfile = createSelector(selectState, state => state.isFetchingProfile);

const isUpdatingProfile = createSelector(selectState, state => state.isUpdatingProfile);

const isSuperAdmin = createSelector(userProfile, profile => profile?.role === Role.SuperAdmin );


export const selectors = {
   selectState,
   profile: userProfile,
   isAuthenticated,
   isLoggingIn,
   isFetchingProfile,
   isUpdatingProfile,
   isSuperAdmin
};


export const actions = slice.actions;


export default slice.reducer;
