import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { AjaxError } from "rxjs/ajax";
import { GloablModalModel, LockWidgetNameEnum, WidgetLockErrorModel, WidgetLockModel } from "types/user-interface";
import { createFeatureSelector } from "utils/ducks";
import { getLockWidgetObject } from "utils/net";

export type State = {
    widgetLocks: WidgetLockModel[];
    globalModal: GloablModalModel;
    initiateAttributeCallback: boolean;
};

export const initialState: State = {
    widgetLocks: [],
    globalModal: {
        title: undefined,
        size: "sm",
        content: undefined,
        type: undefined,
        isOpen: false,
    },
    initiateAttributeCallback: false,
};

export const slice = createSlice({
    name: "userInterface",

    initialState,

    reducers: {
        insertWidgetLock: {
            prepare: (error: AjaxError | WidgetLockErrorModel, lockWidgetName: LockWidgetNameEnum) => {
                let payload;
                if (error instanceof AjaxError) {
                    const widgetLockObject = getLockWidgetObject(error);
                    payload = {
                        widgetName: lockWidgetName,
                        ...widgetLockObject,
                    };
                } else {
                    payload = {
                        widgetName: lockWidgetName,
                        ...error,
                    };
                }
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

        showGlobalModal: (state, action: PayloadAction<GloablModalModel>) => {
            state.globalModal = action.payload;
        },

        hideGlobalModal: (state) => {
            state.globalModal = initialState.globalModal;
        },

        setInitiateAttributeCallback: (state, action: PayloadAction<boolean>) => {
            state.initiateAttributeCallback = action.payload;
        },
    },
});

const selectState = createFeatureSelector<State>(slice.name);

const selectWidgetLocks = createSelector(selectState, (state) => state.widgetLocks);
const selectGlobalModal = createSelector(selectState, (state) => state.globalModal);
const selectInitiateAttributeCallback = createSelector(selectState, (state) => state.initiateAttributeCallback);

export const selectors = {
    selectState,
    selectWidgetLocks,
    selectGlobalModal,
    selectInitiateAttributeCallback,
};

export const actions = slice.actions;

export default slice.reducer;
