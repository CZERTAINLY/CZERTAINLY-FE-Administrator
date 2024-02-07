import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';
import { SearchRequestModel } from 'types/certificate';
import { ConnectorResponseModel } from 'types/connectors';
import { EntityRequestModel, EntityResponseModel } from 'types/entities';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    entity?: EntityResponseModel;
    entities: EntityResponseModel[];

    locationAttributeDescriptors?: AttributeDescriptorModel[];

    entityProviders?: ConnectorResponseModel[];
    entityProviderAttributeDescriptors?: AttributeDescriptorModel[];

    isFetchingEntityProviders: boolean;
    isFetchingEntityProviderAttributeDescriptors: boolean;

    isFetchingDetail: boolean;
    isFetchingLocationAttributeDescriptors: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
};

export const initialState: State = {
    entities: [],

    isFetchingEntityProviders: false,
    isFetchingEntityProviderAttributeDescriptors: false,

    isFetchingDetail: false,
    isFetchingLocationAttributeDescriptors: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: 'entities',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        clearEntityProviderAttributeDescriptors: (state, action: PayloadAction<void>) => {
            state.entityProviderAttributeDescriptors = [];
        },

        listEntityProviders: (state, action: PayloadAction<void>) => {
            state.isFetchingEntityProviders = true;
        },

        listEntityProvidersSuccess: (state, action: PayloadAction<{ providers: ConnectorResponseModel[] }>) => {
            state.isFetchingEntityProviders = false;
            state.entityProviders = action.payload.providers;
        },

        listEntityProvidersFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isFetchingEntityProviders = false;
        },

        getEntityProviderAttributesDescriptors: (state, action: PayloadAction<{ uuid: string; kind: string }>) => {
            state.entityProviderAttributeDescriptors = [];
            state.isFetchingEntityProviderAttributeDescriptors = true;
        },

        getEntityProviderAttributesDescriptorsSuccess: (
            state,
            action: PayloadAction<{ attributeDescriptor: AttributeDescriptorModel[] }>,
        ) => {
            state.entityProviderAttributeDescriptors = action.payload.attributeDescriptor;
            state.isFetchingEntityProviderAttributeDescriptors = false;
        },

        getEntityProviderAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingEntityProviderAttributeDescriptors = false;
        },

        listEntities: (state, action: PayloadAction<SearchRequestModel>) => {
            state.entities = [];
        },

        listEntitiesSuccess: (state, action: PayloadAction<EntityResponseModel[]>) => {
            state.entities = action.payload;
        },

        getEntityDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.entity = undefined;
            state.isFetchingDetail = true;
        },

        getEntityDetailSuccess: (state, action: PayloadAction<{ entity: EntityResponseModel }>) => {
            state.entity = action.payload.entity;
            state.isFetchingDetail = false;
        },

        getEntityDetailFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isFetchingDetail = false;
        },

        addEntity: (state, action: PayloadAction<EntityRequestModel>) => {
            state.isCreating = true;
        },

        addEntitySuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
        },

        addEntityFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isCreating = false;
        },

        deleteEntity: (state, action: PayloadAction<{ uuid: string; redirect?: string }>) => {
            state.isDeleting = true;
        },

        deleteEntitySuccess: (state, action: PayloadAction<{ uuid: string; redirect?: string }>) => {
            const index1 = state.entities.findIndex((entity: EntityResponseModel) => entity.uuid === action.payload.uuid);
            state.entities.splice(index1, 1);

            state.isDeleting = false;
        },

        deleteEntityFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isDeleting = false;
        },

        updateEntity: (
            state,
            action: PayloadAction<{ uuid: string; attributes: AttributeRequestModel[]; customAttributes?: AttributeRequestModel[] }>,
        ) => {
            state.isUpdating = true;
        },

        updateEntitySuccess: (state, action: PayloadAction<{ entity: EntityResponseModel }>) => {
            state.isUpdating = false;
        },

        updateEntityFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isUpdating = false;
        },

        listLocationAttributeDescriptors: (state, action: PayloadAction<{ entityUuid: string }>) => {
            state.isFetchingLocationAttributeDescriptors = true;
        },

        listLocationAttributeDescriptorsSuccess: (state, action: PayloadAction<{ descriptors: AttributeDescriptorModel[] }>) => {
            state.isFetchingLocationAttributeDescriptors = false;
            state.locationAttributeDescriptors = action.payload.descriptors;
        },

        listLocationAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isFetchingLocationAttributeDescriptors = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const entityProviders = createSelector(state, (state) => state.entityProviders);
const entityProviderAttributeDescriptors = createSelector(state, (state) => state.entityProviderAttributeDescriptors);
const locationAttributeDescriptors = createSelector(state, (state) => state.locationAttributeDescriptors);

const entity = createSelector(state, (state) => state.entity);
const entities = createSelector(state, (state) => state.entities);

const isFetchingEntityProviders = createSelector(state, (state) => state.isFetchingEntityProviders);
const isFetchingEntityProviderAttributeDescriptors = createSelector(state, (state) => state.isFetchingEntityProviderAttributeDescriptors);

const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingLocationAttributeDescriptors = createSelector(state, (state) => state.isFetchingLocationAttributeDescriptors);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);

export const selectors = {
    state,

    entityProviders,
    entityProviderAttributeDescriptors,
    locationAttributeDescriptors,

    entity,
    entities,

    isFetchingEntityProviders,
    isFetchingEntityProviderAttributeDescriptors,
    isFetchingLocationAttributeDescriptors,

    isFetchingDetail,
    isCreating,
    isDeleting,
    isUpdating,
};

export const actions = slice.actions;

export default slice.reducer;
