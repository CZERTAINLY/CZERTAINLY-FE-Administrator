import { Observable } from "rxjs";
import { combineEpics, Epic } from "redux-observable";
import { AnyAction, combineReducers } from "redux";

import { ApiClients } from "api";

import statupEpics from "./startup-epics";

import { initialState as initialAlertsState, slice as alertsSlice } from "./alerts";

import { initialState as initialAuthState, slice as authSlice } from "./auth";
import authEpics from "./auth-epics";

import { initialState as initialAuditLogsState, slice as auditLogsSlice } from "./audit";
import auditLogsEpics from "./audit-epics";

import { initialState as initialAdministratorsState, slice as administratorsSlice } from "./administrators";
import administratorsEpics from "./administrators-epics";

import { initialState as initialCertificatesState, slice as certificatesSlice } from "./certificates";
import certificatesEpics from "./certificates-epic";

import { initialState as initialClientsState, slice as clientsSlice } from "./clients";
import clientsEpics from "./clients-epics";

import { initialState as initialConnectorsState, slice as connectorsSlice } from "./connectors";
import connectorsEpics from "./connectors-epic";

import { initialState as initialDashboardState, slice as dashboardSlice } from "./dashboard";
import dashboardEpics from "./dashboard-epics";

import { initialState as initialRaProfilesState, slice as raProfilesSlice } from "./ra-profiles";
import raProfilesEpics from "./ra-profiles-epics";

import { initialState as initialCredentialsState, slice as credentialsSlice } from "./credentials";
import credentialsEpics from "./credentials-epics";

import { initialState as initialAcmeAccountsState, slice as acmeAccountsSlice } from "./acme-accounts";
import acmeAccountsEpics from "./acme-accounts-epics";

import { initialState as initialAcmeProfilesState, slice as acmeProfilesSlice } from "./acme-profiles";
import acmeProfilesEpics from "./acme-profiles-epics";

import { initialState as initialAuthoritiesState, slice as authoritiesSlice } from "./authorities";
import authoritiesEpics from "./authorities-epics";

import { initialState as initialEntitiesState, slice as entitiesSlice } from "./entities";
import entitiesEpics from "./entities-epics";

import { initialState as initialGroupState, slice as groupSlice } from "./groups";
import groupEpics from "./groups-epics";

import { initialState as initialDiscoveryState, slice as discoverySlice } from "./discoveries";
import discoveryEpics from "./discoveries-epics";


export interface EpicDependencies {
   apiClients: ApiClients;
}


export type AppState = Observable<ReturnType<typeof reducers>>;


export type AppEpic = Epic<AnyAction, AnyAction, AppState, EpicDependencies>;


export const initialState = {
   [alertsSlice.name]: initialAlertsState,
   [auditLogsSlice.name]: initialAuditLogsState,
   [authSlice.name]: initialAuthState,
   [administratorsSlice.name]: initialAdministratorsState,
   [certificatesSlice.name]: initialCertificatesState,
   [clientsSlice.name]: initialClientsState,
   [connectorsSlice.name]: initialConnectorsState,
   [dashboardSlice.name]: initialDashboardState,
   [raProfilesSlice.name]: initialRaProfilesState,
   [credentialsSlice.name]: initialCredentialsState,
   [acmeAccountsSlice.name]: initialAcmeAccountsState,
   [acmeProfilesSlice.name]: initialAcmeProfilesState,
   [authoritiesSlice.name]: initialAuthoritiesState,
   [entitiesSlice.name]: initialEntitiesState,
   [groupSlice.name]: initialGroupState,
   [discoverySlice.name]: initialDiscoveryState,
};


export const reducers = combineReducers<typeof initialState, any>({
   [alertsSlice.name]: alertsSlice.reducer,
   [auditLogsSlice.name]: auditLogsSlice.reducer,
   [authSlice.name]: authSlice.reducer,
   [certificatesSlice.name]: certificatesSlice.reducer,
   [administratorsSlice.name]: administratorsSlice.reducer,
   [clientsSlice.name]: clientsSlice.reducer,
   [connectorsSlice.name]: connectorsSlice.reducer,
   [dashboardSlice.name]: dashboardSlice.reducer,
   [raProfilesSlice.name]: raProfilesSlice.reducer,
   [credentialsSlice.name]: credentialsSlice.reducer,
   [acmeAccountsSlice.name]: acmeAccountsSlice.reducer,
   [acmeProfilesSlice.name]: acmeProfilesSlice.reducer,
   [authoritiesSlice.name]: authoritiesSlice.reducer,
   [entitiesSlice.name]: entitiesSlice.reducer,
   [groupSlice.name]: groupSlice.reducer,
   [discoverySlice.name]: discoverySlice.reducer,
});


export const epics = combineEpics(
   ...statupEpics,
   ...authEpics,
   ...auditLogsEpics,
   ...certificatesEpics,
   ...administratorsEpics,
   ...clientsEpics,
   ...connectorsEpics,
   ...dashboardEpics,
   ...raProfilesEpics,
   ...credentialsEpics,
   ...acmeAccountsEpics,
   ...acmeProfilesEpics,
   ...authoritiesEpics,
   ...entitiesEpics,
   ...groupEpics,
   ...discoveryEpics,
);
