import { combineReducers } from 'redux';

import { slice as acmeAccountsSlice } from './acme-accounts';
import { slice as acmeProfilesSlice } from './acme-profiles';
import { slice as cmpProfilesSlice } from './cmp-profiles';
import { slice as scepProfilesSlice } from './scep-profiles';

import { alertsSlice } from './alert-slice';
import { slice as appRedirectSlice } from './app-redirect';
import { slice as auditLogsSlice } from './auditLogs';
import { slice as authSlice } from './auth';
import { slice as userInterfaceSlice } from './user-interface';

import { slice as profileApprovalSlice } from './approval-profiles';

import { slice as approvalSlice } from './approvals';

import { slice as authoritiesSlice } from './authorities';
import { slice as groupsSlice } from './certificateGroups';
import { slice as certificatesSlice } from './certificates';
import { slice as initialComplianceProfilesSlice } from './compliance-profiles';
import { slice as connectorsSlice } from './connectors';
import { slice as initialCredentialsSlice } from './credentials';
import { slice as cryptographicKeySlice } from './cryptographic-keys';
import { slice as cryptographicOperationsSlice } from './cryptographic-operations';
import { slice as customAttributesSlice } from './customAttributes';
import { slice as discoveriesSlice } from './discoveries';
import { slice as initialEntitiesSlice } from './entities';
import { slice as enumsSlice } from './enums';
import { slice as initialFiltersSlice } from './filters';
import { slice as globalMetadataSlice } from './globalMetadata';
import { slice as initialLocationsSlice } from './locations';
import { slice as notificationsSlice } from './notifications';
import { slice as pagingSlice } from './paging';
import { slice as raProfilesSlice } from './ra-profiles';
// import { reducers } from "./reducers";
import { slice as resourceSlice } from './resource';
import { slice as rolesSlice } from './roles';
import { slice as rulesSlice } from './rules';
import { slice as schedulerSlice } from './scheduler';
import { slice as settingsSlice } from './settings';
import { slice as dashboardSlice } from './statisticsDashboard';
import { slice as tokenProfileSlice } from './token-profiles';
import { slice as tokenSlice } from './tokens';
import { slice as usersSlice } from './users';
import { slice as utilsActuatorSlice } from './utilsActuator';
import { slice as utilsCertificateSlice } from './utilsCertificate';
import { slice as utilsCertificateRequestSlice } from './utilsCertificateRequest';
import { slice as utilsOidSlice } from './utilsOid';
export const reducers = combineReducers({
    [alertsSlice.name]: alertsSlice.reducer,
    [userInterfaceSlice.name]: userInterfaceSlice.reducer,
    [appRedirectSlice.name]: appRedirectSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [dashboardSlice.name]: dashboardSlice.reducer,
    [groupsSlice.name]: groupsSlice.reducer,
    [connectorsSlice.name]: connectorsSlice.reducer,
    [discoveriesSlice.name]: discoveriesSlice.reducer,
    [pagingSlice.name]: pagingSlice.reducer,
    [usersSlice.name]: usersSlice.reducer,
    [rolesSlice.name]: rolesSlice.reducer,
    [resourceSlice.name]: resourceSlice.reducer,
    [rulesSlice.name]: rulesSlice.reducer,
    [certificatesSlice.name]: certificatesSlice.reducer,
    [authoritiesSlice.name]: authoritiesSlice.reducer,
    [raProfilesSlice.name]: raProfilesSlice.reducer,
    [acmeAccountsSlice.name]: acmeAccountsSlice.reducer,
    [acmeProfilesSlice.name]: acmeProfilesSlice.reducer,
    [scepProfilesSlice.name]: scepProfilesSlice.reducer,
    [cmpProfilesSlice.name]: cmpProfilesSlice.reducer,
    [initialComplianceProfilesSlice.name]: initialComplianceProfilesSlice.reducer,
    [initialCredentialsSlice.name]: initialCredentialsSlice.reducer,
    [initialEntitiesSlice.name]: initialEntitiesSlice.reducer,
    [initialFiltersSlice.name]: initialFiltersSlice.reducer,
    [initialLocationsSlice.name]: initialLocationsSlice.reducer,
    [auditLogsSlice.name]: auditLogsSlice.reducer,
    [customAttributesSlice.name]: customAttributesSlice.reducer,
    [globalMetadataSlice.name]: globalMetadataSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [schedulerSlice.name]: schedulerSlice.reducer,
    [profileApprovalSlice.name]: profileApprovalSlice.reducer,
    [approvalSlice.name]: approvalSlice.reducer,
    [notificationsSlice.name]: notificationsSlice.reducer,
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
