import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    IlmSigningProtocolConfigurationDto,
    IlmSigningProtocolConfigurationListDto,
    IlmSigningProtocolConfigurationRequestDto,
    SearchFieldDataByGroupDto,
} from 'types/openapi';
import { BulkActionMessageDto } from 'types/openapi/models/BulkActionMessageDto';

export type State = {
    checkedRows: string[];

    deleteErrorMessage: string;
    bulkDeleteErrorMessages: BulkActionMessageDto[];

    ilmSigningProtocolConfiguration?: IlmSigningProtocolConfigurationDto;
    ilmSigningProtocolConfigurations: IlmSigningProtocolConfigurationListDto[];
    ilmSigningProtocolConfigurationsTotalItems: number;

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

    ilmSigningProtocolConfigurations: [],
    ilmSigningProtocolConfigurationsTotalItems: 0,

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
    name: 'ilmSigningProtocolConfigurations',

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

        listIlmSigningProtocolConfigurations: (state, action: PayloadAction<void>) => {
            state.isFetchingList = true;
        },

        listIlmSigningProtocolConfigurationsSuccess: (
            state,
            action: PayloadAction<{
                ilmSigningProtocolConfigurations: IlmSigningProtocolConfigurationListDto[];
                totalItems: number;
            }>,
        ) => {
            state.isFetchingList = false;
            state.ilmSigningProtocolConfigurations = action.payload.ilmSigningProtocolConfigurations;
            state.ilmSigningProtocolConfigurationsTotalItems = action.payload.totalItems;
        },

        listIlmSigningProtocolConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getIlmSigningProtocolConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingDetail = true;
        },

        getIlmSigningProtocolConfigurationSuccess: (
            state,
            action: PayloadAction<{ ilmSigningProtocolConfiguration: IlmSigningProtocolConfigurationDto }>,
        ) => {
            state.isFetchingDetail = false;
            state.ilmSigningProtocolConfiguration = action.payload.ilmSigningProtocolConfiguration;

            const idx = state.ilmSigningProtocolConfigurations.findIndex(
                (c) => c.uuid === action.payload.ilmSigningProtocolConfiguration.uuid,
            );
            if (idx >= 0) {
                state.ilmSigningProtocolConfigurations[idx] = action.payload.ilmSigningProtocolConfiguration;
            }
        },

        getIlmSigningProtocolConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        listIlmSigningProtocolConfigurationSearchableFields: (state, action: PayloadAction<void>) => {
            state.isFetchingSearchableFields = true;
        },

        listIlmSigningProtocolConfigurationSearchableFieldsSuccess: (
            state,
            action: PayloadAction<{ searchableFields: SearchFieldDataByGroupDto[] }>,
        ) => {
            state.isFetchingSearchableFields = false;
            state.searchableFields = action.payload.searchableFields;
        },

        listIlmSigningProtocolConfigurationSearchableFieldsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSearchableFields = false;
        },

        createIlmSigningProtocolConfiguration: (
            state,
            action: PayloadAction<{ ilmSigningProtocolConfigurationRequestDto: IlmSigningProtocolConfigurationRequestDto }>,
        ) => {
            state.isCreating = true;
        },

        createIlmSigningProtocolConfigurationSuccess: (
            state,
            action: PayloadAction<{ ilmSigningProtocolConfiguration: IlmSigningProtocolConfigurationDto }>,
        ) => {
            state.isCreating = false;
        },

        createIlmSigningProtocolConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateIlmSigningProtocolConfiguration: (
            state,
            action: PayloadAction<{
                uuid: string;
                ilmSigningProtocolConfigurationRequestDto: IlmSigningProtocolConfigurationRequestDto;
            }>,
        ) => {
            state.isUpdating = true;
        },

        updateIlmSigningProtocolConfigurationSuccess: (
            state,
            action: PayloadAction<{ ilmSigningProtocolConfiguration: IlmSigningProtocolConfigurationDto }>,
        ) => {
            state.isUpdating = false;
            state.ilmSigningProtocolConfiguration = action.payload.ilmSigningProtocolConfiguration;

            const idx = state.ilmSigningProtocolConfigurations.findIndex(
                (c) => c.uuid === action.payload.ilmSigningProtocolConfiguration.uuid,
            );
            if (idx >= 0) {
                state.ilmSigningProtocolConfigurations[idx] = action.payload.ilmSigningProtocolConfiguration;
            }
        },

        updateIlmSigningProtocolConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteIlmSigningProtocolConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
            state.deleteErrorMessage = '';
        },

        deleteIlmSigningProtocolConfigurationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const idx = state.ilmSigningProtocolConfigurations.findIndex((c) => c.uuid === action.payload.uuid);
            if (idx >= 0) state.ilmSigningProtocolConfigurations.splice(idx, 1);

            if (state.ilmSigningProtocolConfiguration?.uuid === action.payload.uuid) {
                state.ilmSigningProtocolConfiguration = undefined;
            }
        },

        deleteIlmSigningProtocolConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
        },

        enableIlmSigningProtocolConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableIlmSigningProtocolConfigurationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const idx = state.ilmSigningProtocolConfigurations.findIndex((c) => c.uuid === action.payload.uuid);
            if (idx >= 0) state.ilmSigningProtocolConfigurations[idx].enabled = true;

            if (state.ilmSigningProtocolConfiguration?.uuid === action.payload.uuid) {
                state.ilmSigningProtocolConfiguration.enabled = true;
            }
        },

        enableIlmSigningProtocolConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableIlmSigningProtocolConfiguration: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = true;
        },

        disableIlmSigningProtocolConfigurationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = false;

            const idx = state.ilmSigningProtocolConfigurations.findIndex((c) => c.uuid === action.payload.uuid);
            if (idx >= 0) state.ilmSigningProtocolConfigurations[idx].enabled = false;

            if (state.ilmSigningProtocolConfiguration?.uuid === action.payload.uuid) {
                state.ilmSigningProtocolConfiguration.enabled = false;
            }
        },

        disableIlmSigningProtocolConfigurationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },

        bulkDeleteIlmSigningProtocolConfigurations: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.bulkDeleteErrorMessages = [];
            state.isBulkDeleting = true;
        },

        bulkDeleteIlmSigningProtocolConfigurationsSuccess: (
            state,
            action: PayloadAction<{ uuids: string[]; errors: BulkActionMessageDto[] }>,
        ) => {
            state.isBulkDeleting = false;

            if (action.payload.errors?.length > 0) {
                state.bulkDeleteErrorMessages = action.payload.errors;
                return;
            }

            action.payload.uuids.forEach((uuid) => {
                const idx = state.ilmSigningProtocolConfigurations.findIndex((c) => c.uuid === uuid);
                if (idx >= 0) state.ilmSigningProtocolConfigurations.splice(idx, 1);
            });

            if (state.ilmSigningProtocolConfiguration && action.payload.uuids.includes(state.ilmSigningProtocolConfiguration.uuid)) {
                state.ilmSigningProtocolConfiguration = undefined;
            }
        },

        bulkDeleteIlmSigningProtocolConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },

        bulkEnableIlmSigningProtocolConfigurations: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = true;
        },

        bulkEnableIlmSigningProtocolConfigurationsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = false;

            action.payload.uuids.forEach((uuid) => {
                const idx = state.ilmSigningProtocolConfigurations.findIndex((c) => c.uuid === uuid);
                if (idx >= 0) state.ilmSigningProtocolConfigurations[idx].enabled = true;
            });

            if (state.ilmSigningProtocolConfiguration && action.payload.uuids.includes(state.ilmSigningProtocolConfiguration.uuid)) {
                state.ilmSigningProtocolConfiguration.enabled = true;
            }
        },

        bulkEnableIlmSigningProtocolConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkEnabling = false;
        },

        bulkDisableIlmSigningProtocolConfigurations: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = true;
        },

        bulkDisableIlmSigningProtocolConfigurationsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = false;

            action.payload.uuids.forEach((uuid) => {
                const idx = state.ilmSigningProtocolConfigurations.findIndex((c) => c.uuid === uuid);
                if (idx >= 0) state.ilmSigningProtocolConfigurations[idx].enabled = false;
            });

            if (state.ilmSigningProtocolConfiguration && action.payload.uuids.includes(state.ilmSigningProtocolConfiguration.uuid)) {
                state.ilmSigningProtocolConfiguration.enabled = false;
            }
        },

        bulkDisableIlmSigningProtocolConfigurationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDisabling = false;
        },
    },
});

const state = (reduxStore: any): State => reduxStore?.[slice.name];

const ilmSigningProtocolConfiguration = createSelector(state, (state) => state.ilmSigningProtocolConfiguration);
const ilmSigningProtocolConfigurations = createSelector(state, (state) => state.ilmSigningProtocolConfigurations);
const ilmSigningProtocolConfigurationsTotalItems = createSelector(state, (state) => state.ilmSigningProtocolConfigurationsTotalItems);
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
    ilmSigningProtocolConfiguration,
    ilmSigningProtocolConfigurations,
    ilmSigningProtocolConfigurationsTotalItems,
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
