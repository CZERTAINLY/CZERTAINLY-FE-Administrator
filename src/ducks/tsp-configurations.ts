import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchFieldDataByGroupDto, TspConfigurationDto, TspConfigurationListDto, TspConfigurationRequestDto } from 'types/openapi';
import { BulkActionMessageDto } from 'types/openapi/models/BulkActionMessageDto';

export type State = {
    checkedRows: string[];

    deleteErrorMessage: string;
    bulkDeleteErrorMessages: BulkActionMessageDto[];

    tspConfiguration?: TspConfigurationDto;
    tspConfigurations: TspConfigurationListDto[];
    tspConfigurationsTotalItems: number;

    searchableFields?: SearchFieldDataByGroupDto[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingSearchableFields: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isUpdating: boolean;
    isEnabling: boolean;
    isDisabling: boolean;
    isBulkDeleting: boolean;
    isBulkEnabling: boolean;
    isBulkDisabling: boolean;
};

export const initialState: State = {
    checkedRows: [],

    deleteErrorMessage: '',
    bulkDeleteErrorMessages: [],

    tspConfigurations: [],
    tspConfigurationsTotalItems: 0,

    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingSearchableFields: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
    isEnabling: false,
    isDisabling: false,
    isBulkDeleting: false,
    isBulkEnabling: false,
    isBulkDisabling: false,
};

export const slice = createSlice({
    name: 'tspConfigurations',

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

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = '';
            state.bulkDeleteErrorMessages = [];
        },

        listTspConfigurations: (state, action: PayloadAction<void>) => {
            state.isFetchingList = true;
        },

        listTspConfigurationsSuccess: (
            state,
            action: PayloadAction<{ tspConfigurations: TspConfigurationListDto[]; totalItems: number }>,
        ) => {
            state.isFetchingList = false;
            state.tspConfigurations = action.payload.tspConfigurations;
            state.tspConfigurationsTotalItems = action.payload.totalItems;
        },

        listTspConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getTspConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingDetail = true;
        },

        getTspConfigurationSuccess: (state, action: PayloadAction<{ tspConfiguration: TspConfigurationDto }>) => {
            state.isFetchingDetail = false;
            state.tspConfiguration = action.payload.tspConfiguration;

            const idx = state.tspConfigurations.findIndex((c) => c.uuid === action.payload.tspConfiguration.uuid);
            if (idx >= 0) {
                state.tspConfigurations[idx] = action.payload.tspConfiguration;
            }
        },

        getTspConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        listTspConfigurationSearchableFields: (state, action: PayloadAction<void>) => {
            state.isFetchingSearchableFields = true;
        },

        listTspConfigurationSearchableFieldsSuccess: (state, action: PayloadAction<{ searchableFields: SearchFieldDataByGroupDto[] }>) => {
            state.isFetchingSearchableFields = false;
            state.searchableFields = action.payload.searchableFields;
        },

        listTspConfigurationSearchableFieldsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSearchableFields = false;
        },

        createTspConfiguration: (state, action: PayloadAction<{ tspConfigurationRequestDto: TspConfigurationRequestDto }>) => {
            state.isCreating = true;
        },

        createTspConfigurationSuccess: (state, action: PayloadAction<{ tspConfiguration: TspConfigurationDto }>) => {
            state.isCreating = false;
        },

        createTspConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateTspConfiguration: (
            state,
            action: PayloadAction<{ uuid: string; tspConfigurationRequestDto: TspConfigurationRequestDto }>,
        ) => {
            state.isUpdating = true;
        },

        updateTspConfigurationSuccess: (state, action: PayloadAction<{ tspConfiguration: TspConfigurationDto }>) => {
            state.isUpdating = false;
            state.tspConfiguration = action.payload.tspConfiguration;

            const idx = state.tspConfigurations.findIndex((c) => c.uuid === action.payload.tspConfiguration.uuid);
            if (idx >= 0) {
                state.tspConfigurations[idx] = action.payload.tspConfiguration;
            }
        },

        updateTspConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteTspConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
            state.deleteErrorMessage = '';
        },

        deleteTspConfigurationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const idx = state.tspConfigurations.findIndex((c) => c.uuid === action.payload.uuid);
            if (idx >= 0) state.tspConfigurations.splice(idx, 1);

            if (state.tspConfiguration?.uuid === action.payload.uuid) {
                state.tspConfiguration = undefined;
            }
        },

        deleteTspConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
        },

        enableTspConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableTspConfigurationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const idx = state.tspConfigurations.findIndex((c) => c.uuid === action.payload.uuid);
            if (idx >= 0) state.tspConfigurations[idx].enabled = true;

            if (state.tspConfiguration?.uuid === action.payload.uuid) {
                state.tspConfiguration.enabled = true;
            }
        },

        enableTspConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableTspConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = true;
        },

        disableTspConfigurationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = false;

            const idx = state.tspConfigurations.findIndex((c) => c.uuid === action.payload.uuid);
            if (idx >= 0) state.tspConfigurations[idx].enabled = false;

            if (state.tspConfiguration?.uuid === action.payload.uuid) {
                state.tspConfiguration.enabled = false;
            }
        },

        disableTspConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },

        bulkDeleteTspConfigurations: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.bulkDeleteErrorMessages = [];
            state.isBulkDeleting = true;
        },

        bulkDeleteTspConfigurationsSuccess: (state, action: PayloadAction<{ uuids: string[]; errors: BulkActionMessageDto[] }>) => {
            state.isBulkDeleting = false;

            if (action.payload.errors?.length > 0) {
                state.bulkDeleteErrorMessages = action.payload.errors;
                return;
            }

            action.payload.uuids.forEach((uuid) => {
                const idx = state.tspConfigurations.findIndex((c) => c.uuid === uuid);
                if (idx >= 0) state.tspConfigurations.splice(idx, 1);
            });

            if (state.tspConfiguration && action.payload.uuids.includes(state.tspConfiguration.uuid)) {
                state.tspConfiguration = undefined;
            }
        },

        bulkDeleteTspConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },

        bulkEnableTspConfigurations: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = true;
        },

        bulkEnableTspConfigurationsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = false;

            action.payload.uuids.forEach((uuid) => {
                const idx = state.tspConfigurations.findIndex((c) => c.uuid === uuid);
                if (idx >= 0) state.tspConfigurations[idx].enabled = true;
            });

            if (state.tspConfiguration && action.payload.uuids.includes(state.tspConfiguration.uuid)) {
                state.tspConfiguration.enabled = true;
            }
        },

        bulkEnableTspConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkEnabling = false;
        },

        bulkDisableTspConfigurations: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = true;
        },

        bulkDisableTspConfigurationsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = false;

            action.payload.uuids.forEach((uuid) => {
                const idx = state.tspConfigurations.findIndex((c) => c.uuid === uuid);
                if (idx >= 0) state.tspConfigurations[idx].enabled = false;
            });

            if (state.tspConfiguration && action.payload.uuids.includes(state.tspConfiguration.uuid)) {
                state.tspConfiguration.enabled = false;
            }
        },

        bulkDisableTspConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDisabling = false;
        },
    },
});

const state = (reduxStore: any): State => reduxStore?.[slice.name];

const tspConfiguration = createSelector(state, (state) => state.tspConfiguration);
const tspConfigurations = createSelector(state, (state) => state.tspConfigurations);
const tspConfigurationsTotalItems = createSelector(state, (state) => state.tspConfigurationsTotalItems);
const searchableFields = createSelector(state, (state) => state.searchableFields);
const checkedRows = createSelector(state, (state) => state.checkedRows);
const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, (state) => state.bulkDeleteErrorMessages);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingSearchableFields = createSelector(state, (state) => state.isFetchingSearchableFields);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const isDisabling = createSelector(state, (state) => state.isDisabling);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, (state) => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, (state) => state.isBulkDisabling);

export const selectors = {
    state,
    checkedRows,
    deleteErrorMessage,
    bulkDeleteErrorMessages,
    tspConfiguration,
    tspConfigurations,
    tspConfigurationsTotalItems,
    searchableFields,
    isFetchingList,
    isFetchingDetail,
    isFetchingSearchableFields,
    isCreating,
    isDeleting,
    isUpdating,
    isEnabling,
    isDisabling,
    isBulkDeleting,
    isBulkEnabling,
    isBulkDisabling,
};

export const actions = slice.actions;

export default slice.reducer;
