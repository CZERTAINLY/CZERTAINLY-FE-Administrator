import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LoginMethod {
    name: string;
    loginUrl: string;
}

export type State = {
    loginMethods?: LoginMethod[];
    isFetching: boolean;
    error?: string;
};

export const initialState: State = {
    isFetching: false,
};

export const slice = createSlice({
    name: 'login',

    initialState,

    reducers: {
        getLoginMethods(state, action: PayloadAction<{ redirect?: string }>) {
            state.isFetching = true;
            state.error = undefined;
        },

        getLoginMethodsSuccess(state, action: PayloadAction<{ loginMethods: LoginMethod[] }>) {
            state.isFetching = false;
            state.loginMethods = action.payload.loginMethods;
        },

        getLoginMethodsFailure(state, action: PayloadAction<{ error: string }>) {
            state.isFetching = false;
            state.error = action.payload.error;
        },

        resetState(state, action: PayloadAction<void>) {
            Object.keys(state).forEach((key) => {
                if (!Object.hasOwn(initialState, key)) (state as any)[key] = undefined;
            });
            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },
    },
});

const selectState = (reduxStore: any): State => reduxStore?.[slice.name];

export const selectors = {
    loginMethods: createSelector(selectState, (state) => state.loginMethods),
    isFetching: createSelector(selectState, (state) => state.isFetching),
    error: createSelector(selectState, (state) => state.error),
};

export const actions = slice.actions;

export default slice.reducer;
