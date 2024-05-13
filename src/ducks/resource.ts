import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource } from 'types/openapi';
import { ResourceEventModel, ResourceModel } from 'types/resource';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    resourceslist: ResourceModel[];
    resourceEvents: ResourceEventModel[];
    isFetchingResourcesList: boolean;
    isFetchingResourceEvents: boolean;
};

export const initialState: State = {
    resourceslist: [],
    resourceEvents: [],
    isFetchingResourcesList: false,
    isFetchingResourceEvents: false,
};

export const slice = createSlice({
    name: 'resource',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        listResources: (state, action: PayloadAction<void>) => {
            state.isFetchingResourcesList = true;
        },

        listResourcesSuccess(state, action: PayloadAction<{ resourceslist: ResourceModel[] }>) {
            state.isFetchingResourcesList = false;
            state.resourceslist = action.payload.resourceslist;
        },

        listResourcesFailure(state, action: PayloadAction<{ error: string | undefined }>) {
            state.isFetchingResourcesList = false;
        },

        listResourceEvents: (state, action: PayloadAction<{ resource: Resource }>) => {
            state.isFetchingResourceEvents = true;
        },

        listResourceEventsSuccess(state, action: PayloadAction<{ events: ResourceEventModel[] }>) {
            state.isFetchingResourceEvents = false;
            state.resourceEvents = action.payload.events;
        },

        listResourceEventsFailure(state, action: PayloadAction<{ error: string | undefined }>) {
            state.isFetchingResourceEvents = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const resourceslist = createSelector(state, (state) => state.resourceslist);
const resourceEvents = createSelector(state, (state) => state.resourceEvents);
const isFetchingResourcesList = createSelector(state, (state) => state.isFetchingResourcesList);

export const selectors = {
    resourceslist,
    resourceEvents,
    isFetchingResourcesList,
};

export const actions = slice.actions;

export default slice.reducer;
