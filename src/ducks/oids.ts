import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchRequestModel } from 'types/certificate';
import { OIDRequestModel, OIDResponseModel, OIDUpdateRequestModel } from 'types/oids';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    oid?: OIDResponseModel;
    oids: OIDResponseModel[];

    isFetching: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
};

export const initialState: State = {
    oids: [],

    isFetching: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: 'oids',
    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        listOIDs: (state, action: PayloadAction<SearchRequestModel>) => {
            state.isFetching = true;
            state.oids = [];
        },

        listOIDsSuccess: (state, action: PayloadAction<{ oids: OIDResponseModel[] }>) => {
            state.isFetching = false;
            state.oids = action.payload.oids;
        },

        listOIDsFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isFetching = false;
        },

        getOID: (state, action: PayloadAction<{ oid: string }>) => {
            state.isFetching = true;
        },

        getOIDSuccess: (state, action: PayloadAction<{ oid: OIDResponseModel }>) => {
            state.isFetching = false;
            state.oid = action.payload.oid;
        },

        getOIDFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isFetching = false;
        },

        createOID: (state, action: PayloadAction<{ oid: OIDRequestModel }>) => {
            state.isCreating = true;
        },

        createOIDSuccess: (state, action: PayloadAction<{ oid: OIDResponseModel }>) => {
            state.isCreating = false;
            state.oid = action.payload.oid;
        },

        createOIDFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isCreating = false;
        },

        updateOID: (state, action: PayloadAction<{ oid: string; data: OIDUpdateRequestModel }>) => {
            state.isUpdating = true;
        },

        updateOIDSuccess: (state, action: PayloadAction<{ oid: OIDResponseModel }>) => {
            state.isUpdating = false;
            state.oid = action.payload.oid;
        },

        updateOIDFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isUpdating = false;
        },

        deleteOID: (state, action: PayloadAction<{ oid: string }>) => {
            state.isDeleting = true;
        },

        deleteOIDSuccess: (state, action: PayloadAction<{ oid: string }>) => {
            state.isDeleting = false;

            // Remove deleted OID from the state
            const index = state.oids.findIndex((oid) => oid.oid === action.payload.oid);
            if (index !== -1) state.oids.splice(index, 1);
        },

        deleteOIDFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isDeleting = false;
        },
        bulkDeleteOIDs: (state, action: PayloadAction<{ oids: string[] }>) => {
            state.isDeleting = true;
        },

        bulkDeleteOIDsSuccess: (state, action: PayloadAction<{ oids: string[] }>) => {
            state.isDeleting = false;

            // Remove deleted OIDs from the state
            action.payload.oids.forEach((deletedOid) => {
                const index = state.oids.findIndex((oid) => oid.oid === deletedOid);
                if (index !== -1) state.oids.splice(index, 1);
            });
        },

        bulkDeleteOIDsFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isDeleting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const oids = createSelector(state, (state) => state.oids);
const oid = createSelector(state, (state) => state.oid);

const isFetching = createSelector(state, (state) => state.isFetching);
const isCreating = createSelector(state, (state) => state.isCreating);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isDeleting = createSelector(state, (state) => state.isDeleting);

export const selectors = {
    state,
    oids,
    oid,

    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
};

export const actions = slice.actions;

export default slice.reducer;
