import { combineEpics, Epic } from "redux-observable";
import { AnyAction, combineReducers } from "redux";

import { ApiClients } from "api";

import { initialState as initialAlertsState, slice as alertsSlice } from "./alerts";
import { initialState as initialAppRedirectState, slice as appRedirectSlice } from "./app-redirect";
import { initialState as initialAuthState, slice as authSlice } from "./auth";
import { initialState as initialDashboardState, slice as dashboardSlice } from "./dashboard";
import { initialState as initialGroupsState, slice as groupsSlice } from "./groups";
import { initialState as initialConnectorsState, slice as connectorsSlice } from "./connectors";

import authEpics from "./auth-epics";
import appRedirectEpics from "./app-redirect-epics";
import startupEpics from "./startup-epics";
import dashboardEpics from "./dashboard-epics";
import groupsEpics from "./groups-epics";
import connectorsEpics from "./connectors-epic";


export interface EpicDependencies {
   apiClients: ApiClients;
}

export type AppState = ReturnType<typeof reducers>;


export type AppEpic = Epic<AnyAction, AnyAction, AppState, EpicDependencies>;


export const initialState = {
   [alertsSlice.name]: initialAlertsState,
   [appRedirectSlice.name]: initialAppRedirectState,
   [authSlice.name]: initialAuthState,
   [dashboardSlice.name]: initialDashboardState,
   [groupsSlice.name]: initialGroupsState,
   [connectorsSlice.name]: initialConnectorsState,
};


export const reducers = combineReducers<typeof initialState, any>({
   [alertsSlice.name]: alertsSlice.reducer,
   [appRedirectSlice.name]: appRedirectSlice.reducer,
   [authSlice.name]: authSlice.reducer,
   [dashboardSlice.name]: dashboardSlice.reducer,
   [groupsSlice.name]: groupsSlice.reducer,
   [connectorsSlice.name]: connectorsSlice.reducer,
});


export const epics = combineEpics(
   ...startupEpics,
   ...authEpics,
   ...appRedirectEpics,
   ...dashboardEpics,
   ...groupsEpics,
   ...connectorsEpics,
);
