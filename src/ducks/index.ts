import { combineEpics, Epic } from "redux-observable";
import { AnyAction, combineReducers } from "redux";

import { ApiClients } from "api";

import { initialState as initialAlertsState, slice as alertsSlice } from "./alerts";
import { initialState as initialAppRedirectState, slice as appRedirectSlice } from "./app-redirect";
import { initialState as initialAuthState, slice as authSlice } from "./auth";
import { initialState as initialDashboardState, slice as dashboardSlice } from "./dashboard";
import { initialState as initialGroupsState, slice as groupsSlice } from "./groups";
import { initialState as initialConnectorsState, slice as connectorsSlice } from "./connectors";
import { initialState as initialDiscoveriesState, slice as discoveriesSlice } from "./discoveries";
import { initialState as initialUsersState, slice as usersSlice } from "./users";
import { initialState as initialRolesState, slice as rolesSlice } from "./roles";
import { initialState as initialCertificatesState, slice as certificatesSlice } from "./certificates";
import { initialState as initialAuthoritiesState, slice as authoritiesSlice } from "./authorities";
import { initialState as initialRaProfilesState, slice as raProfilesSlice } from "./ra-profiles";
import { initialState as initialAcmeAccountsState, slice as acmeAccountsSlice } from "./acme-accounts";
import { initialState as initialAcmeProfilesState, slice as acmeProfilesSlice } from "./acme-profiles";
import { initialState as initialComplianceProfilesState, slice as initialComplianceProfilesSlice } from "./compliance-profiles";
import { initialState as initialCredentialsState, slice as initialCredentialsSlice } from "./credentials";
import { initialState as initialEntitiesState, slice as initialEntitiesSlice } from "./entities";
import { initialState as initialLocationsState, slice as initialLocationsSlice } from "./locations";
import { initialState as initialAuditLogsState, slice as auditLogsSlice } from "./audit";

import authEpics from "./auth-epics";
import appRedirectEpics from "./app-redirect-epics";
import startupEpics from "./startup-epics";
import dashboardEpics from "./dashboard-epics";
import groupsEpics from "./groups-epics";
import connectorsEpics from "./connectors-epic";
import discoveriesEpics from "./discoveries-epics";
import usersEpics from "./users-epics";
import rolesEpics from "./roles-epics";
import certificatesEpics from "./certificates-epics";
import authoritiesEpics from "./authorities-epics";
import raProfilesEpics from "./ra-profiles-epics";
import acmeAccountsEpics from "./acme-accounts-epics";
import acmeProfilesEpics from "./acme-profiles-epics";
import complianceProfilesEpics from "./compliance-profiles-epics";
import credentialsEpics from "./credentials-epics";
import entitiesEpics from "./entities-epics";
import locationsEpics from "./locations-epics";
import auditLogsEpics from "./audit-epics";


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
   [discoveriesSlice.name]: initialDiscoveriesState,
   [usersSlice.name]: initialUsersState,
   [rolesSlice.name]: initialRolesState,
   [certificatesSlice.name]: initialCertificatesState,
   [authoritiesSlice.name]: initialAuthoritiesState,
   [raProfilesSlice.name]: initialRaProfilesState,
   [acmeAccountsSlice.name]: initialAcmeAccountsState,
   [acmeProfilesSlice.name]: initialAcmeProfilesState,
   [initialComplianceProfilesSlice.name]: initialComplianceProfilesState,
   [initialCredentialsSlice.name]: initialCredentialsState,
   [initialEntitiesSlice.name]: initialEntitiesState,
   [initialLocationsSlice.name]: initialLocationsState,
   [auditLogsSlice.name]: initialAuditLogsState,
};


export const reducers = combineReducers<typeof initialState, any>({
   [alertsSlice.name]: alertsSlice.reducer,
   [appRedirectSlice.name]: appRedirectSlice.reducer,
   [authSlice.name]: authSlice.reducer,
   [dashboardSlice.name]: dashboardSlice.reducer,
   [groupsSlice.name]: groupsSlice.reducer,
   [connectorsSlice.name]: connectorsSlice.reducer,
   [discoveriesSlice.name]: discoveriesSlice.reducer,
   [usersSlice.name]: usersSlice.reducer,
   [rolesSlice.name]: rolesSlice.reducer,
   [certificatesSlice.name]: certificatesSlice.reducer,
   [authoritiesSlice.name]: authoritiesSlice.reducer,
   [raProfilesSlice.name]: raProfilesSlice.reducer,
   [acmeAccountsSlice.name]: acmeAccountsSlice.reducer,
   [acmeProfilesSlice.name]: acmeProfilesSlice.reducer,
   [initialComplianceProfilesSlice.name]: initialComplianceProfilesSlice.reducer,
   [initialCredentialsSlice.name]: initialCredentialsSlice.reducer,
   [initialEntitiesSlice.name]: initialEntitiesSlice.reducer,
   [initialLocationsSlice.name]: initialLocationsSlice.reducer,
   [auditLogsSlice.name]: auditLogsSlice.reducer,
});


export const epics = combineEpics(
   ...startupEpics,
   ...authEpics,
   ...appRedirectEpics,
   ...dashboardEpics,
   ...groupsEpics,
   ...connectorsEpics,
   ...discoveriesEpics,
   ...usersEpics,
   ...rolesEpics,
   ...certificatesEpics,
   ...authoritiesEpics,
   ...raProfilesEpics,
   ...acmeAccountsEpics,
   ...acmeProfilesEpics,
   ...complianceProfilesEpics,
   ...credentialsEpics,
   ...entitiesEpics,
   ...locationsEpics,
    ...auditLogsEpics,
);
