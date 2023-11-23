import { ApiClients } from "api";
import { AnyAction } from "redux";
import { Epic, combineEpics } from "redux-observable";
import acmeAccountsEpics from "./acme-accounts-epics";
import acmeProfilesEpics from "./acme-profiles-epics";
import scepProfilesEpics from "./scep-profiles-epics";

import appRedirectEpics from "./app-redirect-epics";
import auditLogsEpics from "./auditLogs-epics";

import profileApprovalEpics from "./approval-profiles-epics";

import approvalsEpic from "./approvals-epic";

import authEpics from "./auth-epics";
import authoritiesEpics from "./authorities-epics";
import groupsEpics from "./certificateGroups-epics";
import certificatesEpics from "./certificates-epics";
import complianceProfilesEpics from "./compliance-profiles-epics";
import connectorsEpics from "./connectors-epic";
import credentialsEpics from "./credentials-epics";
import cryptographicKeyEpics from "./cryptographic-keys-epics";
import cryptographicOperationsEpics from "./cryptographic-operations-epics";
import customAttributesEpics from "./customAttributes-epics";
import discoveriesEpics from "./discoveries-epics";
import entitiesEpics from "./entities-epics";
import enumsEpics from "./enums-epics";
import filtersEpics from "./filters-epics";
import globalMetadataEpics from "./globalMetadata-epics";
import locationsEpics from "./locations-epics";
import notificationsEpics from "./notifications-epics";
import raProfilesEpics from "./ra-profiles-epics";
import { reducers } from "./reducers";
import rolesEpics from "./roles-epics";
import schedulerEpics from "./scheduler-epics";
import settingsEpics from "./settings-epics";
import startupEpics from "./startup-epics";
import dashboardEpics from "./statisticsDashboard-epics";
import tokenProfileEpics from "./token-profiles-epics";
import tokenEpics from "./tokens-epics";
import usersEpics from "./users-epics";
import utilsActuatorEpics from "./utilsActuator-epics";
import utilsCertificateEpics from "./utilsCertificate-epics";
import utilsCertificateRequestEpics from "./utilsCertificateRequest-epics";
import utilsOidEpics from "./utilsOid-epics";

export interface EpicDependencies {
    apiClients: ApiClients;
}

export type AppState = ReturnType<typeof reducers>;

export type AppEpic = Epic<AnyAction, AnyAction, AppState, EpicDependencies>;

// export const initialState = {
//     [alertsSlice.name]: initialAlertsState,
//     [widgetLockSlice.name]: initialWidgetLockState,
//     [appRedirectSlice.name]: initialAppRedirectState,
//     [authSlice.name]: initialAuthState,
//     [dashboardSlice.name]: initialDashboardState,
//     [groupsSlice.name]: initialGroupsState,
//     [connectorsSlice.name]: initialConnectorsState,
//     [discoveriesSlice.name]: initialDiscoveriesState,
//     [pagingSlice.name]: initialPagingState,
//     [usersSlice.name]: initialUsersState,
//     [rolesSlice.name]: initialRolesState,
//     [certificatesSlice.name]: initialCertificatesState,
//     [authoritiesSlice.name]: initialAuthoritiesState,
//     [raProfilesSlice.name]: initialRaProfilesState,
//     [acmeAccountsSlice.name]: initialAcmeAccountsState,
//     [acmeProfilesSlice.name]: initialAcmeProfilesState,
//     [scepProfilesSlice.name]: initialScepProfilesState,
//     [initialComplianceProfilesSlice.name]: initialComplianceProfilesState,
//     [initialCredentialsSlice.name]: initialCredentialsState,
//     [initialEntitiesSlice.name]: initialEntitiesState,
//     [initialFiltersSlice.name]: initialFiltersState,
//     [initialLocationsSlice.name]: initialLocationsState,
//     [auditLogsSlice.name]: initialAuditLogsState,
//     [customAttributesSlice.name]: initialCustomAttributesState,
//     [globalMetadataSlice.name]: initialGlobalMetadataState,
//     [settingsSlice.name]: initialSettingsState,
//     [schedulerSlice.name]: initialSchedulerState,
//     [profileApprovalSlice.name]: initialProfileApprovalState,
//     [approvalSlice.name]: initialApprovalState,
//     [notificationsSlice.name]: initialNotificationsState,
//     [enumsSlice.name]: initialEnumsState,
//     [tokenSlice.name]: initialTokenAttributesState,
//     [tokenProfileSlice.name]: initialTokenProfileAttributesState,
//     [cryptographicKeySlice.name]: initialCryptographicKeyAttributesState,
//     [cryptographicOperationsSlice.name]: initialCryptographicOperationsAttributesState,
//     [utilsOidSlice.name]: initialUtilsOidState,
//     [utilsCertificateSlice.name]: initialUtilsCertificateState,
//     [utilsCertificateRequestSlice.name]: initialUtilsCertificateRequestState,
//     [utilsActuatorSlice.name]: initialUtilsActuatorState,
// };

// export const reducers = combineReducers<typeof initialState, any>({
//     [alertsSlice.name]: alertsSlice.reducer,
//     [widgetLockSlice.name]: widgetLockSlice.reducer,
//     [appRedirectSlice.name]: appRedirectSlice.reducer,
//     [authSlice.name]: authSlice.reducer,
//     [dashboardSlice.name]: dashboardSlice.reducer,
//     [groupsSlice.name]: groupsSlice.reducer,
//     [connectorsSlice.name]: connectorsSlice.reducer,
//     [discoveriesSlice.name]: discoveriesSlice.reducer,
//     [pagingSlice.name]: pagingSlice.reducer,
//     [usersSlice.name]: usersSlice.reducer,
//     [rolesSlice.name]: rolesSlice.reducer,
//     [certificatesSlice.name]: certificatesSlice.reducer,
//     [authoritiesSlice.name]: authoritiesSlice.reducer,
//     [raProfilesSlice.name]: raProfilesSlice.reducer,
//     [acmeAccountsSlice.name]: acmeAccountsSlice.reducer,
//     [acmeProfilesSlice.name]: acmeProfilesSlice.reducer,
//     [scepProfilesSlice.name]: scepProfilesSlice.reducer,
//     [initialComplianceProfilesSlice.name]: initialComplianceProfilesSlice.reducer,
//     [initialCredentialsSlice.name]: initialCredentialsSlice.reducer,
//     [initialEntitiesSlice.name]: initialEntitiesSlice.reducer,
//     [initialFiltersSlice.name]: initialFiltersSlice.reducer,
//     [initialLocationsSlice.name]: initialLocationsSlice.reducer,
//     [auditLogsSlice.name]: auditLogsSlice.reducer,
//     [customAttributesSlice.name]: customAttributesSlice.reducer,
//     [globalMetadataSlice.name]: globalMetadataSlice.reducer,
//     [settingsSlice.name]: settingsSlice.reducer,
//     [schedulerSlice.name]: schedulerSlice.reducer,
//     [profileApprovalSlice.name]: profileApprovalSlice.reducer,
//     [approvalSlice.name]: approvalSlice.reducer,
//     [notificationsSlice.name]: notificationsSlice.reducer,
//     [enumsSlice.name]: enumsSlice.reducer,
//     [tokenSlice.name]: tokenSlice.reducer,
//     [tokenProfileSlice.name]: tokenProfileSlice.reducer,
//     [cryptographicKeySlice.name]: cryptographicKeySlice.reducer,
//     [cryptographicOperationsSlice.name]: cryptographicOperationsSlice.reducer,
//     [utilsOidSlice.name]: utilsOidSlice.reducer,
//     [utilsCertificateSlice.name]: utilsCertificateSlice.reducer,
//     [utilsCertificateRequestSlice.name]: utilsCertificateRequestSlice.reducer,
//     [utilsActuatorSlice.name]: utilsActuatorSlice.reducer,
// });

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
    ...schedulerEpics,
    ...profileApprovalEpics,
    ...approvalsEpic,
    ...notificationsEpics,
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
