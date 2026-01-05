import { selectors } from 'ducks/auth';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router';

import AuditLogs from './_pages/auditLogs';
import Dashboard from './_pages/dashboard';
import AuthenticationSettings from './_pages/auth-settings';
import OAuth2ProviderDetail from './_pages/auth-settings/detail';

import LoggingSettings from './_pages/logging-settings';

import AcmeAccountDetail from './_pages/acme-accounts/detail';
import AcmeAccountsList from './_pages/acme-accounts/list';

import AcmeProfileDetail from './_pages/acme-profiles/detail';
import AcmeProfilesList from './_pages/acme-profiles/list';

import AuthorityDetail from './_pages/authorities/detail';
import AuthoritiesList from './_pages/authorities/list';
import AuthorityForm from './_pages/authorities/form';

import CertificateDetail from './_pages/certificates/detail';
import CertificateEdit from './_pages/certificates/form';
import CertificatesList from './_pages/certificates/list';

import ComplianceProfileDetail from './_pages/compliance-profiles/detail';
import ComplianceProfilesList from './_pages/compliance-profiles/list';

import ConnectorDetail from './_pages/connectors/detail';
import ConnectorsList from './_pages/connectors/list';

import ApprovalProfileDetails from './_pages/approval-profiles/detail';
import ApprovalProfiles from './_pages/approval-profiles/list';

import ApprovalDetails from './_pages/approvals/details';
import ApprovalsList from './_pages/approvals/list';

import CredentialDetail from './_pages/credentials/detail';
import CredentialsList from './_pages/credentials/list';

import CryptographicKeyDetail from './_pages/cryptographic-keys/detail';
import CryptographicKeyList from './_pages/cryptographic-keys/list';

import CustomAttributesDetail from './_pages/custom-attributes/detail';
import CustomAttributesList from './_pages/custom-attributes/list';

import DiscoveryDetail from './_pages/discoveries/detail';
import DiscoveriesList from './_pages/discoveries/list';

import EntityDetail from './_pages/entities/detail';
import EntitiesList from './_pages/entities/list';

import ScepProfileDetail from './_pages/scep-profiles/detail';
import ScepProfilesList from './_pages/scep-profiles/list';

import CmpProfileDetails from './_pages/cmp-profiles/details';
import CmpProfilesList from './_pages/cmp-profiles/list';

import GlobalMetadataDetail from './_pages/global-metadata/detail';
import GlobalMetadataList from './_pages/global-metadata/list';

import GroupDetail from './_pages/group/detail';
import GroupList from './_pages/group/list';

import LocationDetail from './_pages/locations/detail';
import LocationsList from './_pages/locations/list';

import RaProfileDetail from './_pages/ra-profiles/detail';
import RaProfilesList from './_pages/ra-profiles/list';

import PlatformSettingsDetail from './_pages/platform-settings/detail';

import RoleDetail from './_pages/roles/detail';
import RolesList from './_pages/roles/list';
import RolePermissions from './_pages/roles/RolePermissionsForm';

import TokenProfileDetail from './_pages/token-profiles/detail';
import TokenProfileList from './_pages/token-profiles/list';

import TokenDetail from './_pages/tokens/detail';
import TokenList from './_pages/tokens/list';

import UserProfileDetail from './_pages/user-profile/detail';

import UserDetail from './_pages/users/detail';
import UsersList from './_pages/users/list';

import NotificationsList from './_pages/notifications/list';
import NotificationInstanceDetail from './_pages/notifications/notification-instance-details';
import EventsSettings from './_pages/notifications/events-settings';

import NotificationProfileDetail from './_pages/notifications/notification-profiles/detail';
import NotificationProfilesList from './_pages/notifications/notification-profiles/list';

import ConditionDetails from './_pages/conditions/details';

import ExecutionDetails from './_pages/executions/details';
import ExecutionForm from './_pages/executions/form';

import ActionDetails from './_pages/actions/detail';
import ActionsList from './_pages/actions/list';

import TriggerDetails from './_pages/triggers/details';
import TriggerList from './_pages/triggers/list';

import RuleDetails from './_pages/rules/detail';
import RulesList from './_pages/rules/list';

import SchedulerJobDetail from './_pages/scheduler/detail';
import SchedulerJobsList from './_pages/scheduler/list';

import AppRedirect from './AppRedirect';
import Layout from './Layout';
// import Spinner from './Spinner';

import { Resource } from 'types/openapi';
import CustomOIDList from 'components/_pages/custom-oid/list';
import CustomOIDDetail from 'components/_pages/custom-oid/detail';
import Login from './_pages/login';

export default function AppRouter() {
    const profile = useSelector(selectors.profile);

    const appRoutes = useMemo(
        () => (
            <>
                <Route element={<Layout />}>
                    <Route path="" element={<Navigate to={`/${Resource.Dashboard.toLowerCase()}`} />} />
                    <Route path={`/`} element={<Navigate to={`/${Resource.Dashboard.toLowerCase()}`} />} />

                    <Route path={`/${Resource.Dashboard.toLowerCase()}`} element={<Dashboard />} />

                    <Route path={`/${Resource.Users.toLowerCase()}`} element={<UsersList />} />
                    <Route path={`/${Resource.Users.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Users.toLowerCase()}`} />} />
                    <Route path={`/${Resource.Users.toLowerCase()}/detail/:id`} element={<UserDetail />} />

                    <Route path={`/${Resource.Roles.toLowerCase()}`} element={<RolesList />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Roles.toLowerCase()}`} />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/detail/:id`} element={<RoleDetail />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/permissions/:id`} element={<RolePermissions />} />

                    <Route path={`/${Resource.Certificates.toLowerCase()}`} element={<CertificatesList />} />
                    <Route
                        path={`/${Resource.Certificates.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Certificates.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Certificates.toLowerCase()}/detail/:id`} element={<CertificateDetail />} />
                    <Route path={`/${Resource.Certificates.toLowerCase()}/add`} element={<CertificateEdit />} />

                    <Route path={`/${Resource.Connectors.toLowerCase()}`} element={<ConnectorsList />} />
                    <Route
                        path={`/${Resource.Connectors.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Connectors.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Connectors.toLowerCase()}/detail/:id`} element={<ConnectorDetail />} />

                    <Route path={`/${Resource.Discoveries.toLowerCase()}`} element={<DiscoveriesList />} />
                    <Route
                        path={`/${Resource.Discoveries.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Discoveries.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Discoveries.toLowerCase()}/detail/:id`} element={<DiscoveryDetail />} />

                    <Route path={`/${Resource.Authorities.toLowerCase()}`} element={<AuthoritiesList />} />
                    <Route
                        path={`/${Resource.Authorities.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Authorities.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Authorities.toLowerCase()}/detail/:id`} element={<AuthorityDetail />} />
                    <Route path={`/${Resource.Authorities.toLowerCase()}/add`} element={<AuthorityForm />} />
                    <Route path={`/${Resource.Authorities.toLowerCase()}/edit/:id`} element={<AuthorityForm />} />

                    <Route path={`/${Resource.RaProfiles.toLowerCase()}`} element={<RaProfilesList />} />
                    <Route
                        path={`/${Resource.RaProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.RaProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.RaProfiles.toLowerCase()}/detail/:authorityId/:id`} element={<RaProfileDetail />} />

                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}`} element={<ApprovalProfiles />} />
                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}/detail/:id`} element={<ApprovalProfileDetails />} />
                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}/detail/:id/:version`} element={<ApprovalProfileDetails />} />

                    <Route path={`/${Resource.Approvals.toLowerCase()}`} element={<ApprovalsList />} />
                    <Route path={`/${Resource.Approvals.toLowerCase()}/detail/:id`} element={<ApprovalDetails />} />

                    <Route path={`/${Resource.ComplianceProfiles.toLowerCase()}`} element={<ComplianceProfilesList />} />
                    <Route
                        path={`/${Resource.ComplianceProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.ComplianceProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.ComplianceProfiles.toLowerCase()}/detail/:id`} element={<ComplianceProfileDetail />} />

                    <Route path={`/${Resource.AcmeProfiles.toLowerCase()}`} element={<AcmeProfilesList />} />
                    <Route
                        path={`/${Resource.AcmeProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.AcmeProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.AcmeProfiles.toLowerCase()}/detail/:id`} element={<AcmeProfileDetail />} />

                    <Route path={`/${Resource.AcmeAccounts.toLowerCase()}`} element={<AcmeAccountsList />} />
                    <Route
                        path={`/${Resource.AcmeAccounts.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.AcmeAccounts.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.AcmeAccounts.toLowerCase()}/detail/:acmeProfileId/:id`} element={<AcmeAccountDetail />} />

                    <Route path={`/${Resource.ScepProfiles.toLowerCase()}`} element={<ScepProfilesList />} />
                    <Route
                        path={`/${Resource.ScepProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.ScepProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.ScepProfiles.toLowerCase()}/detail/:id`} element={<ScepProfileDetail />} />

                    <Route path={`/${Resource.CmpProfiles.toLowerCase()}`} element={<CmpProfilesList />} />
                    <Route
                        path={`/${Resource.CmpProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.CmpProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.CmpProfiles.toLowerCase()}/detail/:id`} element={<CmpProfileDetails />} />

                    <Route path={`/${Resource.Groups.toLowerCase()}`} element={<GroupList />} />
                    <Route
                        path={`/${Resource.Groups.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Groups.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Groups.toLowerCase()}/detail/:id`} element={<GroupDetail />} />

                    <Route path={`/${Resource.Credentials.toLowerCase()}`} element={<CredentialsList />} />
                    <Route
                        path={`/${Resource.Credentials.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Credentials.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Credentials.toLowerCase()}/detail/:id`} element={<CredentialDetail />} />

                    <Route path={`/${Resource.Entities.toLowerCase()}`} element={<EntitiesList />} />
                    <Route
                        path={`/${Resource.Entities.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Entities.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Entities.toLowerCase()}/detail/:id`} element={<EntityDetail />} />

                    <Route path={`/${Resource.Locations.toLowerCase()}`} element={<LocationsList />} />
                    <Route
                        path={`/${Resource.Locations.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Locations.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Locations.toLowerCase()}/detail/:entityId/:id`} element={<LocationDetail />} />

                    <Route path={`/userprofile`} element={<UserProfileDetail />} />

                    <Route path={`/${Resource.AuditLogs.toLowerCase()}`} element={<AuditLogs />} />

                    <Route path={`/customattributes`} element={<CustomAttributesList />} />
                    <Route path={`/customattributes/list`} element={<Navigate to={`/customattributes`} />} />
                    <Route path={`/customattributes/detail/:id`} element={<CustomAttributesDetail />} />

                    <Route path={`/globalmetadata`} element={<GlobalMetadataList />} />
                    <Route path={`/globalmetadata/list`} element={<Navigate to={`/globalmetadata`} />} />
                    <Route path={`/globalmetadata/detail/:id`} element={<GlobalMetadataDetail />} />

                    <Route path={`/authenticationsettings`} element={<AuthenticationSettings />} />
                    <Route path={`/authenticationsettings/detail/:providerName`} element={<OAuth2ProviderDetail />} />

                    <Route path={`/${Resource.Tokens.toLowerCase()}`} element={<TokenList />} />
                    <Route
                        path={`/${Resource.Tokens.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Tokens.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Tokens.toLowerCase()}/detail/:id`} element={<TokenDetail />} />

                    <Route path={`/${Resource.TokenProfiles.toLowerCase()}`} element={<TokenProfileList />} />
                    <Route
                        path={`/${Resource.TokenProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.TokenProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.TokenProfiles.toLowerCase()}/detail/:tokenId/:id`} element={<TokenProfileDetail />} />

                    <Route path={`/${Resource.Keys.toLowerCase()}`} element={<CryptographicKeyList />} />
                    <Route path={`/${Resource.Keys.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Keys.toLowerCase()}`} />} />

                    <Route path={`/${Resource.Keys.toLowerCase()}/detail/:id/:keyItemUuid?`} element={<CryptographicKeyDetail />} />

                    <Route path={`/${Resource.Settings.toLowerCase()}`} element={<PlatformSettingsDetail />} />

                    <Route path={`/${Resource.Jobs.toLowerCase()}`} element={<SchedulerJobsList />} />
                    <Route path={`/${Resource.Jobs.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Jobs.toLowerCase()}`} />} />
                    <Route path={`/${Resource.Jobs.toLowerCase()}/detail/:id`} element={<SchedulerJobDetail />} />

                    <Route path={`/notifications`} element={<NotificationsList />} />
                    <Route path={`/events`} element={<EventsSettings />} />
                    <Route path={`/notificationinstances/detail/:id`} element={<NotificationInstanceDetail />} />

                    <Route path={`/notificationprofiles`} element={<NotificationProfilesList />} />
                    <Route path={`/notificationprofiles/detail/:id/:version`} element={<NotificationProfileDetail />} />

                    <Route path={`/loggingsettings`} element={<LoggingSettings />} />

                    <Route path={`/conditions/detail/:id`} element={<ConditionDetails />} />

                    <Route path={`/rules/:tabIndex?`} element={<RulesList />} />
                    <Route path={`/rules/detail/:id`} element={<RuleDetails />} />

                    <Route path={`/executions/add`} element={<ExecutionForm />} />
                    <Route path={`/executions/detail/:id`} element={<ExecutionDetails />} />

                    <Route path={`/actions/:tabIndex?`} element={<ActionsList />} />
                    <Route path={`/actions/detail/:id`} element={<ActionDetails />} />

                    <Route path={`/triggers`} element={<TriggerList />} />
                    <Route path={`/triggers/detail/:id`} element={<TriggerDetails />} />

                    <Route path={`/approvals`} element={<ApprovalsList />} />
                    <Route path={'/custom-oids'} element={<CustomOIDList />} />
                    <Route path={'/custom-oids/detail/:id'} element={<CustomOIDDetail />} />
                </Route>

                {/*
               Please keep this remarked until migration is finished
               <Route path="*" element={<Navigate to={`/home`/>}/>
               */}
                <Route path="*" element={<h1>404</h1>} />
            </>
        ),
        [],
    );

    return (
        <HashRouter>
            <AppRedirect />

            <Routes>
                <Route path="/login" element={<Login />} />
                {profile ? appRoutes : <Route path="*" element={null} />}
            </Routes>
        </HashRouter>
    );
}
