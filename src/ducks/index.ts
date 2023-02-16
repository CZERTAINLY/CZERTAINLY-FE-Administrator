import { ApiClients } from "api";
import { AnyAction, combineReducers } from "redux";
import { combineEpics, Epic } from "redux-observable";
import { initialState as initialAcmeAccountsState, slice as acmeAccountsSlice } from "./acme-accounts";
import acmeAccountsEpics from "./acme-accounts-epics";
import { initialState as initialAcmeProfilesState, slice as acmeProfilesSlice } from "./acme-profiles";
import acmeProfilesEpics from "./acme-profiles-epics";

import { initialState as initialAlertsState, slice as alertsSlice } from "./alerts";
import { initialState as initialAppRedirectState, slice as appRedirectSlice } from "./app-redirect";
import appRedirectEpics from "./app-redirect-epics";
import { initialState as initialAuditLogsState, slice as auditLogsSlice } from "./auditLogs";
import auditLogsEpics from "./auditLogs-epics";
import { initialState as initialAuthState, slice as authSlice } from "./auth";

import authEpics from "./auth-epics";
import { initialState as initialAuthoritiesState, slice as authoritiesSlice } from "./authorities";
import authoritiesEpics from "./authorities-epics";
import { initialState as initialGroupsState, slice as groupsSlice } from "./certificateGroups";
import groupsEpics from "./certificateGroups-epics";
import { initialState as initialCertificatesState, slice as certificatesSlice } from "./certificates";
import certificatesEpics from "./certificates-epics";
import { initialState as initialComplianceProfilesState, slice as initialComplianceProfilesSlice } from "./compliance-profiles";
import complianceProfilesEpics from "./compliance-profiles-epics";
import { initialState as initialConnectorsState, slice as connectorsSlice } from "./connectors";
import connectorsEpics from "./connectors-epic";
import { initialState as initialCredentialsState, slice as initialCredentialsSlice } from "./credentials";
import credentialsEpics from "./credentials-epics";
import { initialState as initialCryptographicKeyAttributesState, slice as cryptographicKeySlice } from "./cryptographic-keys";
import cryptographicKeyEpics from "./cryptographic-keys-epics";
import { initialState as initialCryptographicOperationsAttributesState, slice as cryptographicOperationsSlice } from "./cryptographic-operations";
import cryptographicOperationsEpics from "./cryptographic-operations-epics";
import { initialState as initialCustomAttributesState, slice as customAttributesSlice } from "./customAttributes";
import customAttributesEpics from "./customAttributes-epics";
import { initialState as initialDiscoveriesState, slice as discoveriesSlice } from "./discoveries";
import discoveriesEpics from "./discoveries-epics";
import { initialState as initialEntitiesState, slice as initialEntitiesSlice } from "./entities";
import entitiesEpics from "./entities-epics";
import { initialState as initialLocationsState, slice as initialLocationsSlice } from "./locations";
import locationsEpics from "./locations-epics";
import { initialState as initialRaProfilesState, slice as raProfilesSlice } from "./ra-profiles";
import raProfilesEpics from "./ra-profiles-epics";
import { initialState as initialRolesState, slice as rolesSlice } from "./roles";
import rolesEpics from "./roles-epics";
import startupEpics from "./startup-epics";
import { initialState as initialDashboardState, slice as dashboardSlice } from "./statisticsDashboard";
import dashboardEpics from "./statisticsDashboard-epics";
import { initialState as initialTokenProfileAttributesState, slice as tokenProfileSlice } from "./token-profiles";
import tokenProfileEpics from "./token-profiles-epics";
import { initialState as initialTokenAttributesState, slice as tokenSlice } from "./tokens";
import tokenEpics from "./tokens-epics";
import { initialState as initialUsersState, slice as usersSlice } from "./users";
import usersEpics from "./users-epics";
import { initialState as initialUtilsCertificateState, slice as utilsCertificateSlice } from "./utilsCertificate";
import utilsCertificateEpics from "./utilsCertificate-epics";
import { initialState as initialUtilsOidState, slice as utilsOidSlice } from "./utilsOid";
import utilsOidEpics from "./utilsOid-epics";

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
   [customAttributesSlice.name]: initialCustomAttributesState,
   [tokenSlice.name]: initialTokenAttributesState,
   [tokenProfileSlice.name]: initialTokenProfileAttributesState,
   [cryptographicKeySlice.name]: initialCryptographicKeyAttributesState,
   [cryptographicOperationsSlice.name]: initialCryptographicOperationsAttributesState,
   [utilsOidSlice.name]: initialUtilsOidState,
   [utilsCertificateSlice.name]: initialUtilsCertificateState,
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
   [customAttributesSlice.name]: customAttributesSlice.reducer,
   [tokenSlice.name]: tokenSlice.reducer,
   [tokenProfileSlice.name]: tokenProfileSlice.reducer,
   [cryptographicKeySlice.name]: cryptographicKeySlice.reducer,
   [cryptographicOperationsSlice.name]: cryptographicOperationsSlice.reducer,
   [utilsOidSlice.name]: utilsOidSlice.reducer,
   [utilsCertificateSlice.name]: utilsCertificateSlice.reducer,
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
   ...customAttributesEpics,
   ...tokenEpics,
   ...tokenProfileEpics,
   ...cryptographicKeyEpics,
   ...cryptographicOperationsEpics,
   ...utilsOidEpics,
   ...utilsCertificateEpics,
);
