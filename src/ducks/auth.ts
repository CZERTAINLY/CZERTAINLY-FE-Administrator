import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';

import { ResourceDetailModel } from 'models';
import { UserDetailModel } from 'models/users';
import { ProfileDetailModel } from 'models/user-profile';

export type State = {

   profile?: UserDetailModel;
   resources?: ResourceDetailModel[];
   objects?: { uuid: string; name: string; }[];

   isFetchingProfile: boolean;
   isUpdatingProfile: boolean;
   isFetchingResources: boolean;
   isFetchingObjects: boolean;

};


export const initialState: State = {

   isFetchingProfile: false,
   isUpdatingProfile: false,
   isFetchingResources: false,
   isFetchingObjects: false,

};


export const slice = createSlice({

   name: "auth",

   initialState,

   reducers: {


      /*resetState: (state, action: PayloadAction<void>) => {

         Object.keys(state).forEach(
            key => { if (!initialState.hasOwnProperty(key) && key !== "profile") (state as any)[key] = undefined; }
         );

         Object.keys(initialState).forEach(
            key => (state as any)[key] = (initialState as any)[key]
         );

      },*/


      clearResources: (state, action: PayloadAction<void>) => {

         state.resources = undefined;

      },


      getProfile(state, action: PayloadAction<void>) {

         state.isFetchingProfile = true;

      },


      getProfileSuccess(state, action: PayloadAction<{ profile: UserDetailModel }>) {

         state.isFetchingProfile = false;
         state.profile = action.payload.profile;

      },


      getProfileFailure(state, action: PayloadAction<{ error: string }>) {

         state.isFetchingProfile = false;

      },


      updateProfile(state, action: PayloadAction<{ profile: ProfileDetailModel, redirect?: string }>) {

         state.isUpdatingProfile = true;

      },


      updateProfileSuccess(state, action: PayloadAction<{ profile: UserDetailModel, redirect?: string }>) {

         state.isUpdatingProfile = false;
         state.profile = action.payload.profile;

      },


      updateProfileFailure(state, action: PayloadAction<{ error: string }>) {

         state.isUpdatingProfile = false;

      },


      getResources(state, action: PayloadAction<void>) {

         state.isFetchingResources = true;
         state.resources = undefined;

      },


      getResourcesSuccess(state, action: PayloadAction<{ resources: ResourceDetailModel[] }>) {

         state.isFetchingResources = false;
         state.resources = action.payload.resources;

      },


      getResourcesFailure(state, action: PayloadAction<{ error: string }>) {

         state.isFetchingResources = false;

      },


      listObjects(state, action: PayloadAction<{ endpoint: string }>) {

         state.objects = undefined;
         state.isFetchingObjects = true;

      },


      listObjectsSuccess(state, action: PayloadAction<{ objects: { uuid: string; name: string; }[] }>) {

         state.isFetchingObjects = false;
         state.objects = action.payload.objects;

      },


      listObjectsFailure(state, action: PayloadAction<{ error: string }>) {

         state.isFetchingObjects = false;

      }


   }

});


const selectState = createFeatureSelector<State>(slice.name);

const profile = createSelector(selectState, state => state.profile);
const resources = createSelector(selectState, state => state.resources);
const objects = createSelector(selectState, state => state.objects);

const isFetchingProfile = createSelector(selectState, state => state.isFetchingProfile);
const isUpdatingProfile = createSelector(selectState, state => state.isUpdatingProfile);
const isFetchingResources = createSelector(selectState, state => state.isFetchingResources);
const isFetchingObjects = createSelector(selectState, state => state.isFetchingObjects);


export const selectors = {
   selectState,
   profile,
   resources,
   objects,
   isFetchingProfile,
   isUpdatingProfile,
   isFetchingResources,
   isFetchingObjects
};


export const actions = slice.actions;


export default slice.reducer;
