import { ApiClients } from 'api';
import { AnyAction } from 'redux';
import { Epic, combineEpics } from 'redux-observable';
import acmeAccountsEpics from './acme-accounts-epics';
import acmeProfilesEpics from './acme-profiles-epics';
import cmpProfilesEpics from './cmp-profiles-epics';
import scepProfilesEpics from './scep-profiles-epics';

import appRedirectEpics from './app-redirect-epics';
import auditLogsEpics from './auditLogs-epics';

import profileApprovalEpics from './approval-profiles-epics';

import approvalsEpic from './approvals-epic';

import authEpics from './auth-epics';
import authoritiesEpics from './authorities-epics';
import groupsEpics from './certificateGroups-epics';
import certificatesEpics from './certificates-epics';
import complianceProfilesEpics from './compliance-profiles-epics';
import connectorsEpics from './connectors-epic';
import credentialsEpics from './credentials-epics';
import cryptographicKeyEpics from './cryptographic-keys-epics';
import cryptographicOperationsEpics from './cryptographic-operations-epics';
import customAttributesEpics from './customAttributes-epics';
import discoveriesEpics from './discoveries-epics';
import entitiesEpics from './entities-epics';
import enumsEpics from './enums-epics';
import filtersEpics from './filters-epics';
import globalMetadataEpics from './globalMetadata-epics';
import locationsEpics from './locations-epics';
import notificationsEpics from './notifications-epics';
import raProfilesEpics from './ra-profiles-epics';
import { reducers } from './reducers';
import resourcesEpics from './resource-epics';
import rolesEpics from './roles-epics';
import rulesEpics from './rules-epics';
import schedulerEpics from './scheduler-epics';
import settingsEpics from './settings-epics';
import startupEpics from './startup-epics';
import dashboardEpics from './statisticsDashboard-epics';
import tokenProfileEpics from './token-profiles-epics';
import tokenEpics from './tokens-epics';
import usersEpics from './users-epics';
import utilsActuatorEpics from './utilsActuator-epics';
import utilsCertificateEpics from './utilsCertificate-epics';
import utilsCertificateRequestEpics from './utilsCertificateRequest-epics';
import utilsOidEpics from './utilsOid-epics';

export interface EpicDependencies {
    apiClients: ApiClients;
}

export type AppState = ReturnType<typeof reducers>;

export type AppEpic = Epic<AnyAction, AnyAction, AppState, EpicDependencies>;

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
    ...resourcesEpics,
    ...rulesEpics,
    ...certificatesEpics,
    ...authoritiesEpics,
    ...raProfilesEpics,
    ...acmeAccountsEpics,
    ...acmeProfilesEpics,
    ...cmpProfilesEpics,
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
