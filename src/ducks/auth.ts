import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';

import { ResourceDetailModel } from 'models';
import { UserDetailModel } from 'models/users';

export type State = {

   profile?: UserDetailModel;
   resources?: ResourceDetailModel[];
   objects?: { uuid: string; name: string; }[];

   isFetchingProfile: boolean;
   isFetchingResources: boolean;
   isFetchingObjects: boolean;

};


export const initialState: State = {

   isFetchingProfile: false,
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

         state = initialState;

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


      getResources(state, action: PayloadAction<void>) {

         state.isFetchingResources = true;
         state.profile = undefined;
         state.isFetchingProfile = false;

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
const isFetchingResources = createSelector(selectState, state => state.isFetchingResources);
const isFetchingObjects = createSelector(selectState, state => state.isFetchingObjects);


export const selectors = {
   selectState,
   profile,
   resources,
   objects,
   isFetchingProfile,
   isFetchingResources,
   isFetchingObjects
};


export const actions = slice.actions;


export default slice.reducer;
