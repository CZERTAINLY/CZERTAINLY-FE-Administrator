import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';

import { UserDetailDTO } from 'api/users';
import { ResourceDetailDTO } from 'api/auth';


export type State = {

   profile?: UserDetailDTO;
   resources?: ResourceDetailDTO[];

   isFetchingProfile: boolean;
   isFetchingResources: boolean;

};


export const initialState: State = {

   isFetchingProfile: false,
   isFetchingResources: false,

};


export const slice = createSlice({

   name: "auth",

   initialState,

   reducers: {


      getProfile(state, action: PayloadAction<void>) {

         state.isFetchingProfile = true;

      },


      getProfileSuccess(state, action: PayloadAction<{ profile: UserDetailDTO }>) {

         state.isFetchingProfile = false;
         state.profile = action.payload.profile;

      },


      getProfileFailure(state, action: PayloadAction<{ error: string }>) {

         state.isFetchingProfile = false;

      },


      getResources(state, action: PayloadAction<void>) {

         state.isFetchingResources = true;

      },


      getResourcesSuccess(state, action: PayloadAction<{ resources: ResourceDetailDTO[] }>) {

         state.isFetchingResources = false;
         state.resources = action.payload.resources;

      },


      getResourcesFailure(state, action: PayloadAction<{ error: string }>) {

         state.isFetchingResources = false;

      }


   }

});


const selectState = createFeatureSelector<State>(slice.name);

const profile = createSelector(selectState, state => state.profile);
const resources = createSelector(selectState, state => state.resources);

const isFetchingProfile = createSelector(selectState, state => state.isFetchingProfile);
const isFetchingResources = createSelector(selectState, state => state.isFetchingResources);


export const selectors = {
   selectState,
   profile,
   resources,
   isFetchingProfile,
   isFetchingResources
};


export const actions = slice.actions;


export default slice.reducer;
