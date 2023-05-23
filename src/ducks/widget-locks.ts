import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { AjaxError } from "rxjs/ajax";
import { LockWidgetNameEnum, WidgetLockModel } from "types/widget-locks";
import { createFeatureSelector } from "utils/ducks";
import { getErrorMessageObject } from "utils/httpErrorMessage";

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
            const lockIndex = state.widgetLocks.findIndex((lock) => lock.widgetName === action.payload);
            if (lockIndex === -1) return;
            let currentState = state.widgetLocks;
            currentState.splice(lockIndex, 1);
            state.widgetLocks = currentState.length ? currentState : [];
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

// setInterval(() => {
//     const alerts = store.getState().alerts;
//     alerts.messages.forEach((message) => {
//         if (Date.now() - message.time > 17000) {
//             store.dispatch(actions.hide(message.id));
//         }

//         if (Date.now() - message.time > 20000) {
//             store.dispatch(actions.dismiss(message.id));
//         }
//     });
// }, 1000);

export default slice.reducer;
