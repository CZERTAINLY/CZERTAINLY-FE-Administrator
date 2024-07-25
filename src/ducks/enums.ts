import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumItemModel, PlatformEnumModel } from 'types/enums';
import { PlatformEnum } from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    platformEnums: PlatformEnumModel;
};

export const initialState: State = {
    platformEnums: {},
};

export const slice = createSlice({
    name: 'enums',
    initialState,
    reducers: {
        getPlatformEnums: (state, action: PayloadAction<void>) => {
            state.platformEnums = {};
        },

        getPlatformEnumsSuccess: (state, action: PayloadAction<PlatformEnumModel>) => {
            state.platformEnums = action.payload;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const platformEnums = createSelector(state, (state: State) => state.platformEnums);

const platformEnum = (platformEnum: PlatformEnum) => createSelector(platformEnums, (platformEnums) => platformEnums[platformEnum]);

export const getEnumLabel = (platformEnum: { [key: string]: EnumItemModel } | undefined, enumItemKey: string): string =>
    platformEnum ? (platformEnum[enumItemKey]?.label ?? enumItemKey) : enumItemKey;

export const selectors = {
    state,
    platformEnums,
    platformEnum,
};

export const actions = slice.actions;

export default slice.reducer;
