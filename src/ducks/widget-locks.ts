import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { AjaxError } from "rxjs/ajax";
import { LockWidgetNameEnum, WidgetLockModel } from "types/widget-locks";
import { createFeatureSelector } from "utils/ducks";
import { getErrorMessageObject } from "utils/net";

export type State = {
    widgetLocks: WidgetLockModel[];
};

export const initialState: State = {
    widgetLocks: [],
};

export const slice = createSlice({
    name: "widgetLocks",

    initialState,

    reducers: {
        insertWidgetLock: {
            prepare: (error: AjaxError, lockWidgetName: LockWidgetNameEnum) => {
                console.log("error", error);

                //TODO: add a check in response object is present or do the following
                const errorMessageObjet = getErrorMessageObject(error);
                let payload: WidgetLockModel = {
                    widgetName: lockWidgetName,
                    ...errorMessageObjet,
                };
                return { payload };
            },
            reducer: (state, action: PayloadAction<WidgetLockModel>) => {
                if (state.widgetLocks.some((lock) => lock.widgetName === action.payload.widgetName)) return;
                state.widgetLocks.push(action.payload);
            },
        },
        removeWidgetLock: (state, action: PayloadAction<LockWidgetNameEnum>) => {
            state.widgetLocks = state.widgetLocks.filter((widgetLock) => widgetLock.widgetName !== action.payload);
        },
    },
});

const selectState = createFeatureSelector<State>(slice.name);

const selectWidgetLocks = createSelector(selectState, (state) => state.widgetLocks);

export const selectors = {
    selectState,
    selectWidgetLocks,
};

export const actions = slice.actions;

export default slice.reducer;
