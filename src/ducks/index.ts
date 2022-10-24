import { combineEpics, Epic } from "redux-observable";
import { AnyAction, combineReducers } from "redux";

import { ApiClients } from "api";

import { initialState as initialAlertsState, slice as alertsSlice } from "./alerts";

import { initialState as initialAuthState, slice as authSlice } from "./auth";
import authEpics from "./auth-epics";
import startupEpics from "./startup-epics";


export interface EpicDependencies {
   apiClients: ApiClients;
}

export type AppState = ReturnType<typeof reducers>;


export type AppEpic = Epic<AnyAction, AnyAction, AppState, EpicDependencies>;


export const initialState = {
   [alertsSlice.name]: initialAlertsState,
   [authSlice.name]: initialAuthState,
};


export const reducers = combineReducers<typeof initialState, any>({
   [alertsSlice.name]: alertsSlice.reducer,
   [authSlice.name]: authSlice.reducer,
});


export const epics = combineEpics(
    ...authEpics,
    ...startupEpics,
);
