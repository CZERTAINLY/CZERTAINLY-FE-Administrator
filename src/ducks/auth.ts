import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResourceModel, UserDetailModel, UserUpdateRequestModel } from 'types/auth';
import { NameAndUuidModel } from 'types/locations';
import { Resource } from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    profile?: UserDetailModel;
    resources?: AuthResourceModel[];
    objects?: NameAndUuidModel[];

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
    name: 'auth',

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

        getProfileFailure(state, action: PayloadAction<void>) {
            state.isFetchingProfile = false;
        },

        resetProfile(state, action: PayloadAction<void>) {
            state.profile = undefined;
        },

        updateProfile(state, action: PayloadAction<{ profile: UserUpdateRequestModel; redirect?: string }>) {
            state.isUpdatingProfile = true;
        },

        updateProfileSuccess(state, action: PayloadAction<{ profile: UserDetailModel; redirect?: string }>) {
            state.isUpdatingProfile = false;
            state.profile = action.payload.profile;
        },

        updateProfileFailure(state, action: PayloadAction<void>) {
            state.isUpdatingProfile = false;
        },

        getAuthResources(state, action: PayloadAction<void>) {
            state.isFetchingResources = true;
            state.resources = undefined;
        },

        getAuthResourcesSuccess(state, action: PayloadAction<{ resources: AuthResourceModel[] }>) {
            state.isFetchingResources = false;
            state.resources = action.payload.resources;
        },

        getAuthResourcesFailure(state, action: PayloadAction<void>) {
            state.isFetchingResources = false;
        },

        getObjectsForResource(state, action: PayloadAction<{ resource: Resource }>) {
            state.objects = undefined;
            state.isFetchingObjects = true;
        },

        getObjectsForResourceSuccess(state, action: PayloadAction<{ objects: NameAndUuidModel[] }>) {
            state.isFetchingObjects = false;
            state.objects = action.payload.objects;
        },

        getObjectsForResourceFailure(state, action: PayloadAction<void>) {
            state.isFetchingObjects = false;
        },
    },
});

const selectState = createFeatureSelector<State>(slice.name);

const profile = createSelector(selectState, (state) => state.profile);
const resources = createSelector(selectState, (state) => state.resources);
const objects = createSelector(selectState, (state) => state.objects);

const isFetchingProfile = createSelector(selectState, (state) => state.isFetchingProfile);
const isUpdatingProfile = createSelector(selectState, (state) => state.isUpdatingProfile);
const isFetchingResources = createSelector(selectState, (state) => state.isFetchingResources);
const isFetchingObjects = createSelector(selectState, (state) => state.isFetchingObjects);

export const selectors = {
    selectState,
    profile,
    resources,
    objects,
    isFetchingProfile,
    isUpdatingProfile,
    isFetchingResources,
    isFetchingObjects,
};

export const actions = slice.actions;

export default slice.reducer;
