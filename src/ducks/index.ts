import { ApiClients } from "api";
import { AnyAction, combineReducers } from "redux";
import { Epic, combineEpics } from "redux-observable";
import { slice as acmeAccountsSlice, initialState as initialAcmeAccountsState } from "./acme-accounts";
import acmeAccountsEpics from "./acme-accounts-epics";
import { slice as acmeProfilesSlice, initialState as initialAcmeProfilesState } from "./acme-profiles";
import acmeProfilesEpics from "./acme-profiles-epics";
import { initialState as initialScepProfilesState, slice as scepProfilesSlice } from "./scep-profiles";
import scepProfilesEpics from "./scep-profiles-epics";

import { slice as alertsSlice, initialState as initialAlertsState } from "./alerts";
import { slice as appRedirectSlice, initialState as initialAppRedirectState } from "./app-redirect";
import appRedirectEpics from "./app-redirect-epics";
import { slice as auditLogsSlice, initialState as initialAuditLogsState } from "./auditLogs";
import auditLogsEpics from "./auditLogs-epics";
import { slice as authSlice, initialState as initialAuthState } from "./auth";

import authEpics from "./auth-epics";
import { slice as authoritiesSlice, initialState as initialAuthoritiesState } from "./authorities";
import authoritiesEpics from "./authorities-epics";
import { slice as groupsSlice, initialState as initialGroupsState } from "./certificateGroups";
import groupsEpics from "./certificateGroups-epics";
import { slice as certificatesSlice, initialState as initialCertificatesState } from "./certificates";
import certificatesEpics from "./certificates-epics";
import { slice as initialComplianceProfilesSlice, initialState as initialComplianceProfilesState } from "./compliance-profiles";
import complianceProfilesEpics from "./compliance-profiles-epics";
import { slice as connectorsSlice, initialState as initialConnectorsState } from "./connectors";
import connectorsEpics from "./connectors-epic";
import { slice as initialCredentialsSlice, initialState as initialCredentialsState } from "./credentials";
import credentialsEpics from "./credentials-epics";
import { slice as cryptographicKeySlice, initialState as initialCryptographicKeyAttributesState } from "./cryptographic-keys";
import cryptographicKeyEpics from "./cryptographic-keys-epics";
import {
    slice as cryptographicOperationsSlice,
    initialState as initialCryptographicOperationsAttributesState,
} from "./cryptographic-operations";
import cryptographicOperationsEpics from "./cryptographic-operations-epics";
import { slice as customAttributesSlice, initialState as initialCustomAttributesState } from "./customAttributes";
import customAttributesEpics from "./customAttributes-epics";
import { slice as discoveriesSlice, initialState as initialDiscoveriesState } from "./discoveries";
import discoveriesEpics from "./discoveries-epics";
import { slice as initialEntitiesSlice, initialState as initialEntitiesState } from "./entities";
import entitiesEpics from "./entities-epics";
import { slice as enumsSlice, initialState as initialEnumsState } from "./enums";
import enumsEpics from "./enums-epics";
import { slice as initialFiltersSlice, initialState as initialFiltersState } from "./filters";
import filtersEpics from "./filters-epics";
import { slice as globalMetadataSlice, initialState as initialGlobalMetadataState } from "./globalMetadata";
import globalMetadataEpics from "./globalMetadata-epics";
import { slice as initialLocationsSlice, initialState as initialLocationsState } from "./locations";
import locationsEpics from "./locations-epics";
import { initialState as initialPagingState, slice as pagingSlice } from "./paging";
import { initialState as initialRaProfilesState, slice as raProfilesSlice } from "./ra-profiles";
import raProfilesEpics from "./ra-profiles-epics";
import { initialState as initialRolesState, slice as rolesSlice } from "./roles";
import rolesEpics from "./roles-epics";
import { initialState as initialSettingsState, slice as settingsSlice } from "./settings";
import settingsEpics from "./settings-epics";
import startupEpics from "./startup-epics";
import { slice as dashboardSlice, initialState as initialDashboardState } from "./statisticsDashboard";
import dashboardEpics from "./statisticsDashboard-epics";
import { initialState as initialTokenProfileAttributesState, slice as tokenProfileSlice } from "./token-profiles";
import tokenProfileEpics from "./token-profiles-epics";
import { initialState as initialTokenAttributesState, slice as tokenSlice } from "./tokens";
import tokenEpics from "./tokens-epics";
import { initialState as initialUsersState, slice as usersSlice } from "./users";
import usersEpics from "./users-epics";
import { initialState as initialUtilsActuatorState, slice as utilsActuatorSlice } from "./utilsActuator";
import utilsActuatorEpics from "./utilsActuator-epics";
import { initialState as initialUtilsCertificateState, slice as utilsCertificateSlice } from "./utilsCertificate";
import utilsCertificateEpics from "./utilsCertificate-epics";
import { initialState as initialUtilsCertificateRequestState, slice as utilsCertificateRequestSlice } from "./utilsCertificateRequest";
import utilsCertificateRequestEpics from "./utilsCertificateRequest-epics";
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
    [pagingSlice.name]: initialPagingState,
    [usersSlice.name]: initialUsersState,
    [rolesSlice.name]: initialRolesState,
    [certificatesSlice.name]: initialCertificatesState,
    [authoritiesSlice.name]: initialAuthoritiesState,
    [raProfilesSlice.name]: initialRaProfilesState,
    [acmeAccountsSlice.name]: initialAcmeAccountsState,
    [acmeProfilesSlice.name]: initialAcmeProfilesState,
    [scepProfilesSlice.name]: initialScepProfilesState,
    [initialComplianceProfilesSlice.name]: initialComplianceProfilesState,
    [initialCredentialsSlice.name]: initialCredentialsState,
    [initialEntitiesSlice.name]: initialEntitiesState,
    [initialFiltersSlice.name]: initialFiltersState,
    [initialLocationsSlice.name]: initialLocationsState,
    [auditLogsSlice.name]: initialAuditLogsState,
    [customAttributesSlice.name]: initialCustomAttributesState,
    [globalMetadataSlice.name]: initialGlobalMetadataState,
    [settingsSlice.name]: initialSettingsState,
    [enumsSlice.name]: initialEnumsState,
    [tokenSlice.name]: initialTokenAttributesState,
    [tokenProfileSlice.name]: initialTokenProfileAttributesState,
    [cryptographicKeySlice.name]: initialCryptographicKeyAttributesState,
    [cryptographicOperationsSlice.name]: initialCryptographicOperationsAttributesState,
    [utilsOidSlice.name]: initialUtilsOidState,
    [utilsCertificateSlice.name]: initialUtilsCertificateState,
    [utilsCertificateRequestSlice.name]: initialUtilsCertificateRequestState,
    [utilsActuatorSlice.name]: initialUtilsActuatorState,
};

export const reducers = combineReducers<typeof initialState, any>({
    [alertsSlice.name]: alertsSlice.reducer,
    [appRedirectSlice.name]: appRedirectSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [dashboardSlice.name]: dashboardSlice.reducer,
    [groupsSlice.name]: groupsSlice.reducer,
    [connectorsSlice.name]: connectorsSlice.reducer,
    [discoveriesSlice.name]: discoveriesSlice.reducer,
    [pagingSlice.name]: pagingSlice.reducer,
    [usersSlice.name]: usersSlice.reducer,
    [rolesSlice.name]: rolesSlice.reducer,
    [certificatesSlice.name]: certificatesSlice.reducer,
    [authoritiesSlice.name]: authoritiesSlice.reducer,
    [raProfilesSlice.name]: raProfilesSlice.reducer,
    [acmeAccountsSlice.name]: acmeAccountsSlice.reducer,
    [acmeProfilesSlice.name]: acmeProfilesSlice.reducer,
    [scepProfilesSlice.name]: scepProfilesSlice.reducer,
    [initialComplianceProfilesSlice.name]: initialComplianceProfilesSlice.reducer,
    [initialCredentialsSlice.name]: initialCredentialsSlice.reducer,
    [initialEntitiesSlice.name]: initialEntitiesSlice.reducer,
    [initialFiltersSlice.name]: initialFiltersSlice.reducer,
    [initialLocationsSlice.name]: initialLocationsSlice.reducer,
    [auditLogsSlice.name]: auditLogsSlice.reducer,
    [customAttributesSlice.name]: customAttributesSlice.reducer,
    [globalMetadataSlice.name]: globalMetadataSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [enumsSlice.name]: enumsSlice.reducer,
    [tokenSlice.name]: tokenSlice.reducer,
    [tokenProfileSlice.name]: tokenProfileSlice.reducer,
    [cryptographicKeySlice.name]: cryptographicKeySlice.reducer,
    [cryptographicOperationsSlice.name]: cryptographicOperationsSlice.reducer,
    [utilsOidSlice.name]: utilsOidSlice.reducer,
    [utilsCertificateSlice.name]: utilsCertificateSlice.reducer,
    [utilsCertificateRequestSlice.name]: utilsCertificateRequestSlice.reducer,
    [utilsActuatorSlice.name]: utilsActuatorSlice.reducer,
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
    ...scepProfilesEpics,
    ...complianceProfilesEpics,
    ...credentialsEpics,
    ...entitiesEpics,
    ...filtersEpics,
    ...locationsEpics,
    ...auditLogsEpics,
    ...customAttributesEpics,
    ...globalMetadataEpics,
    ...settingsEpics,
    ...enumsEpics,
    ...tokenEpics,
    ...tokenProfileEpics,
    ...cryptographicKeyEpics,
    ...cryptographicOperationsEpics,
    ...utilsOidEpics,
    ...utilsCertificateEpics,
    ...utilsCertificateRequestEpics,
    ...utilsActuatorEpics,
);
