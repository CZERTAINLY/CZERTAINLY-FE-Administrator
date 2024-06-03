import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    CustomAttributeCreateRequestModel,
    CustomAttributeDetailResponseModel,
    CustomAttributeResponseModel,
    CustomAttributeUpdateRequestModel,
} from 'types/customAttributes';
import { createFeatureSelector } from 'utils/ducks';
import { AttributeResponseModel, BaseAttributeContentModel, CustomAttributeModel } from '../types/attributes';
import { AttributeContentType, Resource } from '../types/openapi';

type ResourceCustomAttributesContents = {
    resource: Resource;
    resourceUuid: string;
    customAttributes: AttributeResponseModel[];
};

export type State = {
    checkedRows: string[];

    customAttribute?: CustomAttributeDetailResponseModel;
    customAttributes: CustomAttributeResponseModel[];
    resourceCustomAttributes: CustomAttributeModel[];
    secondaryResourceCustomAttributes: CustomAttributeModel[];
    resourceCustomAttributesContents: ResourceCustomAttributesContents[];
    resources: Resource[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingResources: boolean;
    isFetchingResourceCustomAttributes: boolean;
    isFetchingResourceSecondaryCustomAttributes: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
    isBulkEnabling: boolean;
    isEnabling: boolean;
    isBulkDisabling: boolean;
    isDisabling: boolean;
    isUpdating: boolean;
    isUpdatingContent: boolean;
};

export const initialState: State = {
    checkedRows: [],
    customAttributes: [],
    resourceCustomAttributes: [],
    secondaryResourceCustomAttributes: [],
    resourceCustomAttributesContents: [],
    resources: [],
    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingResources: false,
    isFetchingResourceCustomAttributes: false,
    isFetchingResourceSecondaryCustomAttributes: false,
    isCreating: false,
    isDeleting: false,
    isBulkDeleting: false,
    isBulkEnabling: false,
    isEnabling: false,
    isBulkDisabling: false,
    isDisabling: false,
    isUpdating: false,
    isUpdatingContent: false,
};

export const slice = createSlice({
    name: 'customAttributes',
    initialState,
    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {
            state.checkedRows = action.payload.checkedRows;
        },

        listCustomAttributes: (state, action: PayloadAction<{ attributeContentType?: AttributeContentType }>) => {
            state.customAttributes = [];
            state.isFetchingList = true;
        },

        listCustomAttributesSuccess: (state, action: PayloadAction<CustomAttributeResponseModel[]>) => {
            state.customAttributes = action.payload;
            state.isFetchingList = false;
        },

        listCustomAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        listResources: (state, action: PayloadAction<void>) => {
            state.resources = [];
            state.isFetchingResources = true;
        },

        listResourcesSuccess: (state, action: PayloadAction<Resource[]>) => {
            state.resources = action.payload;
            state.isFetchingResources = false;
        },

        listResourcesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingResources = false;
        },

        listResourceCustomAttributes: (state, action: PayloadAction<Resource>) => {
            state.resourceCustomAttributes = [];
            state.isFetchingResourceCustomAttributes = true;
        },

        listResourceCustomAttributesSuccess: (state, action: PayloadAction<CustomAttributeModel[]>) => {
            state.resourceCustomAttributes = action.payload;
            state.isFetchingResourceCustomAttributes = false;
        },

        listResourceCustomAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingResourceCustomAttributes = false;
        },

        listSecondaryResourceCustomAttributes: (state, action: PayloadAction<Resource>) => {
            state.secondaryResourceCustomAttributes = [];
            state.isFetchingResourceSecondaryCustomAttributes = true;
        },

        listSecondaryResourceCustomAttributesSuccess: (state, action: PayloadAction<CustomAttributeModel[]>) => {
            state.secondaryResourceCustomAttributes = action.payload;
            state.isFetchingResourceSecondaryCustomAttributes = false;
        },

        listSecondaryResourceCustomAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingResourceSecondaryCustomAttributes = false;
        },

        createCustomAttribute: (state, action: PayloadAction<CustomAttributeCreateRequestModel>) => {
            state.isCreating = true;
        },

        createCustomAttributeSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
        },

        createCustomAttributeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateCustomAttribute: (
            state,
            action: PayloadAction<{ uuid: string; customAttributeUpdateRequest: CustomAttributeUpdateRequestModel }>,
        ) => {
            state.isUpdating = true;
        },

        updateCustomAttributeSuccess: (state, action: PayloadAction<CustomAttributeDetailResponseModel>) => {
            state.isUpdating = false;
            // state.customAttribute = action.payload;
        },

        updateCustomAttributeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        updateCustomAttributeContent: (
            state,
            action: PayloadAction<{
                resource: Resource;
                resourceUuid: string;
                attributeUuid: string;
                content: BaseAttributeContentModel[];
            }>,
        ) => {
            state.isUpdatingContent = true;
        },

        updateCustomAttributeContentSuccess: (state, action: PayloadAction<ResourceCustomAttributesContents>) => {
            state.isUpdatingContent = false;
            const index = state.resourceCustomAttributesContents.findIndex(
                (r) => r.resource === action.payload.resource && r.resourceUuid === action.payload.resourceUuid,
            );
            if (index !== -1) {
                state.resourceCustomAttributesContents[index].customAttributes = action.payload.customAttributes;
            } else {
                state.resourceCustomAttributesContents.push(action.payload);
            }
        },

        updateCustomAttributeContentFailure: (
            state,
            action: PayloadAction<{ resource: Resource; resourceUuid: string; error: string | undefined }>,
        ) => {
            state.isUpdatingContent = false;
        },

        removeCustomAttributeContent: (
            state,
            action: PayloadAction<{ resource: Resource; resourceUuid: string; attributeUuid: string }>,
        ) => {
            state.isUpdatingContent = true;
        },

        removeCustomAttributeContentSuccess: (state, action: PayloadAction<ResourceCustomAttributesContents>) => {
            state.isUpdatingContent = false;
            const index = state.resourceCustomAttributesContents.findIndex(
                (r) => r.resource === action.payload.resource && r.resourceUuid === action.payload.resourceUuid,
            );
            if (index !== -1) {
                state.resourceCustomAttributesContents[index].customAttributes = action.payload.customAttributes;
            } else {
                state.resourceCustomAttributesContents.push(action.payload);
            }
        },

        removeCustomAttributeContentFailure: (
            state,
            action: PayloadAction<{ resource: Resource; resourceUuid: string; error: string | undefined }>,
        ) => {
            state.isUpdatingContent = false;
        },

        loadCustomAttributeContent: (state, action: PayloadAction<ResourceCustomAttributesContents>) => {
            const index = state.resourceCustomAttributesContents.findIndex(
                (r) => r.resource === action.payload.resource && r.resourceUuid === action.payload.resourceUuid,
            );

            if (index === -1) {
                state.resourceCustomAttributesContents.push(action.payload);
            } else {
                state.resourceCustomAttributesContents[index].customAttributes = action.payload.customAttributes;
            }

            return state;
        },

        getCustomAttribute: (state, action: PayloadAction<string>) => {
            state.customAttribute = undefined;
            state.isFetchingDetail = true;
        },

        getCustomAttributeSuccess: (state, action: PayloadAction<CustomAttributeDetailResponseModel>) => {
            state.customAttribute = action.payload;
            state.isFetchingDetail = false;
        },

        getCustomAttributeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        deleteCustomAttribute: (state, action: PayloadAction<string>) => {
            state.isDeleting = true;
        },

        deleteCustomAttributeSuccess: (state, action: PayloadAction<string>) => {
            state.isDeleting = false;
            const index = state.customAttributes.findIndex((attr) => attr.uuid === action.payload);
            if (index !== -1) state.customAttributes.splice(index, 1);
        },

        deleteCustomAttributeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        bulkDeleteCustomAttributes: (state, action: PayloadAction<string[]>) => {
            state.isBulkDeleting = true;
        },

        bulkDeleteCustomAttributesSuccess: (state, action: PayloadAction<string[]>) => {
            state.isBulkDeleting = false;
            action.payload.forEach((uuid) => {
                const index = state.customAttributes.findIndex((attr) => attr.uuid === uuid);
                if (index >= 0) {
                    state.customAttributes.splice(index, 1);
                }
            });
            if (state.customAttribute && action.payload.includes(state.customAttribute.uuid)) {
                state.customAttribute = undefined;
            }
            state.checkedRows = [];
        },

        bulkDeleteCustomAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },

        bulkEnableCustomAttributes: (state, action: PayloadAction<string[]>) => {
            state.isBulkEnabling = true;
        },

        bulkEnableCustomAttributesSuccess: (state, action: PayloadAction<string[]>) => {
            state.isBulkEnabling = false;
            action.payload.forEach((uuid) => {
                const attribute = state.customAttributes.find((a) => a.uuid === uuid);
                if (attribute) {
                    attribute.enabled = true;
                }
            });
            if (state.customAttribute && action.payload.includes(state.customAttribute.uuid)) {
                state.customAttribute.enabled = true;
            }
        },

        bulkEnableCustomAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkEnabling = false;
        },

        bulkDisableCustomAttributes: (state, action: PayloadAction<string[]>) => {
            state.isBulkDisabling = true;
        },

        bulkDisableCustomAttributesSuccess: (state, action: PayloadAction<string[]>) => {
            state.isBulkDisabling = false;
            action.payload.forEach((uuid) => {
                const attribute = state.customAttributes.find((a) => a.uuid === uuid);
                if (attribute) {
                    attribute.enabled = false;
                }
            });
            if (state.customAttribute && action.payload.includes(state.customAttribute.uuid)) {
                state.customAttribute.enabled = false;
            }
        },

        bulkDisableCustomAttributesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDisabling = false;
        },

        enableCustomAttribute: (state, action: PayloadAction<string>) => {
            state.isEnabling = true;
        },

        enableCustomAttributeSuccess: (state, action: PayloadAction<string>) => {
            state.isEnabling = false;
            const attribute = state.customAttributes.find((a) => a.uuid === action.payload);
            if (attribute) {
                attribute.enabled = true;
            }
            if (state.customAttribute && state.customAttribute.uuid === action.payload) {
                state.customAttribute.enabled = true;
            }
        },

        enableCustomAttributeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableCustomAttribute: (state, action: PayloadAction<string>) => {
            state.isDisabling = true;
        },

        disableCustomAttributeSuccess: (state, action: PayloadAction<string>) => {
            state.isDisabling = false;
            const attribute = state.customAttributes.find((a) => a.uuid === action.payload);
            if (attribute) {
                attribute.enabled = false;
            }
            if (state.customAttribute && state.customAttribute.uuid === action.payload) {
                state.customAttribute.enabled = false;
            }
        },

        disableCustomAttributeFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const customAttribute = createSelector(state, (state: State) => state.customAttribute);
const customAttributes = createSelector(state, (state: State) => state.customAttributes);
const resources = createSelector(state, (state: State) => state.resources);
const resourceCustomAttributes = createSelector(state, (state: State) => state.resourceCustomAttributes);
const secondaryResourceCustomAttributes = createSelector(state, (state: State) => state.secondaryResourceCustomAttributes);
const resourceCustomAttributesContents = (resource: Resource, resourceUuid: string) =>
    createSelector(
        state,
        (state: State) =>
            state.resourceCustomAttributesContents.find((c) => c.resource === resource && c.resourceUuid === resourceUuid)
                ?.customAttributes,
    );

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isFetchingResources = createSelector(state, (state: State) => state.isFetchingResources);
const isFetchingResourceCustomAttributes = createSelector(state, (state: State) => state.isFetchingResourceCustomAttributes);
const isFetchingResourceSecondaryCustomAttributes = createSelector(
    state,
    (state: State) => state.isFetchingResourceSecondaryCustomAttributes,
);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, (state: State) => state.isBulkEnabling);
const isEnabling = createSelector(state, (state: State) => state.isEnabling);
const isBulkDisabling = createSelector(state, (state: State) => state.isBulkDisabling);
const isDisabling = createSelector(state, (state: State) => state.isDisabling);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);
const isUpdatingContent = createSelector(state, (state: State) => state.isUpdatingContent);

export const selectors = {
    state,

    checkedRows,

    customAttribute,
    customAttributes,
    resources,
    resourceCustomAttributes,
    secondaryResourceCustomAttributes,
    resourceCustomAttributesContents,

    isCreating,
    isFetchingList,
    isFetchingDetail,
    isFetchingResources,
    isFetchingResourceCustomAttributes,
    isFetchingResourceSecondaryCustomAttributes,
    isDeleting,
    isBulkDeleting,
    isBulkEnabling,
    isEnabling,
    isBulkDisabling,
    isDisabling,
    isUpdating,
    isUpdatingContent,
};

export const actions = slice.actions;

export default slice.reducer;
