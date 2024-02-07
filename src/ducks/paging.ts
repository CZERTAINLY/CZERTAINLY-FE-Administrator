import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { createFeatureSelector } from 'utils/ducks';
import { EntityType } from './filters';

export type Paging = {
    entity: EntityType;
    paging: PagingObject;
};

type PagingObject = {
    totalItems: number;
    checkedRows: string[];
    isFetchingList: boolean;
};

export type State = {
    pagings: Paging[];
};

const EMPTY_PAGING: PagingObject = {
    totalItems: 0,
    checkedRows: [],
    isFetchingList: false,
};

export const initialState: State = {
    pagings: [],
};

const updatePagingState = (state: WritableDraft<State>, entity: EntityType, callback: (pagingObject: PagingObject) => void) => {
    const index = state.pagings.findIndex((f) => f.entity === entity);
    const paging = index !== -1 ? state.pagings[index] : { entity, paging: { ...EMPTY_PAGING } };

    callback(paging.paging);

    state.pagings =
        index !== -1 ? [...state.pagings.slice(0, index), paging, ...state.pagings.slice(index + 1)] : [...state.pagings, paging];
};

export const slice = createSlice({
    name: 'pagings',

    initialState,

    reducers: {
        list: (state, action: PayloadAction<EntityType>) => {
            updatePagingState(state, action.payload, (paging) => {
                paging.isFetchingList = true;
            });
        },

        listSuccess: (state, action: PayloadAction<{ entity: EntityType; totalItems: number }>) => {
            updatePagingState(state, action.payload.entity, (paging) => {
                paging.isFetchingList = false;
                paging.totalItems = action.payload.totalItems;
            });
        },

        listFailure: (state, action: PayloadAction<EntityType>) => {
            updatePagingState(state, action.payload, (paging) => {
                paging.isFetchingList = false;
            });
        },

        setCheckedRows: (state, action: PayloadAction<{ entity: EntityType; checkedRows: string[] }>) => {
            updatePagingState(state, action.payload.entity, (paging) => {
                paging.checkedRows = action.payload.checkedRows;
            });
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const totalItems = (entity: EntityType) =>
    createSelector(state, (state) => (state.pagings.find((f) => f.entity === entity)?.paging ?? EMPTY_PAGING).totalItems);
const checkedRows = (entity: EntityType) =>
    createSelector(state, (state) => (state.pagings.find((f) => f.entity === entity)?.paging ?? EMPTY_PAGING).checkedRows);
const isFetchingList = (entity: EntityType) =>
    createSelector(state, (state) => (state.pagings.find((f) => f.entity === entity)?.paging ?? EMPTY_PAGING).isFetchingList);

export const selectors = {
    state,

    totalItems,
    checkedRows,
    isFetchingList,
};

export const actions = slice.actions;

export default slice.reducer;
