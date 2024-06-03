import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiClients } from 'api';
import { WritableDraft } from 'immer/dist/internal';
import { Observable } from 'rxjs';
import { SearchFieldListModel, SearchFilterModel } from 'types/certificate';
import { createFeatureSelector } from 'utils/ducks';

export const enum EntityType {
    ENTITY,
    LOCATION,
    CERTIFICATE,
    KEY,
    DISCOVERY,
    NOTIFICATIONS,
    SCHEDULER,
    SCHEDULER_HISTORY,
    APPROVAL_PROFILES,
    CONDITIONS,
    ACTIONS,
}

export type Filter = {
    entity: EntityType;
    filter: FilterObject;
};

type FilterObject = {
    availableFilters: SearchFieldListModel[];
    currentFilters: SearchFilterModel[];
    isFetchingFilters: boolean;
};

export type State = {
    filters: Filter[];
};

const EMPTY_FILTER: FilterObject = {
    availableFilters: [],
    currentFilters: [],
    isFetchingFilters: false,
};

export const initialState: State = {
    filters: [],
};

const updateFilterState = (state: WritableDraft<State>, entity: EntityType, callback: (filterObject: FilterObject) => void) => {
    const index = state.filters.findIndex((f) => f.entity === entity);
    const filter = index !== -1 ? state.filters[index] : { entity, filter: { ...EMPTY_FILTER } };

    callback(filter.filter);

    state.filters =
        index !== -1 ? [...state.filters.slice(0, index), filter, ...state.filters.slice(index + 1)] : [...state.filters, filter];
};

export const slice = createSlice({
    name: 'filters',

    initialState,

    reducers: {
        setCurrentFilters: (state, action: PayloadAction<{ entity: EntityType; currentFilters: SearchFilterModel[] }>) => {
            updateFilterState(state, action.payload.entity, (filter) => {
                filter.currentFilters = action.payload.currentFilters;
            });
        },

        getAvailableFilters: (
            state,
            action: PayloadAction<{
                entity: EntityType;
                getAvailableFiltersApi: (apiClients: ApiClients) => Observable<Array<SearchFieldListModel>>;
            }>,
        ) => {
            updateFilterState(state, action.payload.entity, (filter) => {
                filter.availableFilters = [];
                filter.isFetchingFilters = true;
            });
        },

        getAvailableFiltersSuccess: (state, action: PayloadAction<{ entity: EntityType; availableFilters: SearchFieldListModel[] }>) => {
            updateFilterState(state, action.payload.entity, (filter) => {
                filter.availableFilters = action.payload.availableFilters;
                filter.isFetchingFilters = false;
            });
        },

        getAvailableFiltersFailure: (state, action: PayloadAction<{ entity: EntityType; error: string | undefined }>) => {
            updateFilterState(state, action.payload.entity, (filter) => {
                filter.isFetchingFilters = false;
            });
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const availableFilters = (entity: EntityType) =>
    createSelector(state, (state) => (state.filters.find((f) => f.entity === entity)?.filter ?? EMPTY_FILTER).availableFilters);
const currentFilters = (entity: EntityType) =>
    createSelector(state, (state) => (state.filters.find((f) => f.entity === entity)?.filter ?? EMPTY_FILTER).currentFilters);
const isFetchingFilters = (entity: EntityType) =>
    createSelector(state, (state) => (state.filters.find((f) => f.entity === entity)?.filter ?? EMPTY_FILTER).isFetchingFilters);

export const selectors = {
    state,

    availableFilters,
    currentFilters,
    isFetchingFilters,
};

export const actions = slice.actions;

export default slice.reducer;
