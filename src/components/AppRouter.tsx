import { selectors } from 'ducks/auth';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AcmeAccountDetail from './_pages/acme-accounts/detail';

import AcmeAccountsList from './_pages/acme-accounts/list';
import AcmeProfileDetail from './_pages/acme-profiles/detail';
import AcmeProfileEdit from './_pages/acme-profiles/form';

import AcmeProfilesList from './_pages/acme-profiles/list';
import AuditLogs from './_pages/auditLogs';
import AuthorityDetail from './_pages/authorities/detail';
import AuthorityEdit from './_pages/authorities/form';

import AuthoritiesList from './_pages/authorities/list';
import CertificateDetail from './_pages/certificates/detail';
import CertificateEdit from './_pages/certificates/form';

import CertificatesList from './_pages/certificates/list';
import ComplianceProfileDetail from './_pages/compliance-profiles/detail';
import ComplianceProfileEdit from './_pages/compliance-profiles/form';

import ComplianceProfilesList from './_pages/compliance-profiles/list';
import ConnectorDetail from './_pages/connectors/detail';
import ConnectorEdit from './_pages/connectors/form';

import ApprovalProfileDetails from './_pages/approval-profiles/detail';
import ApprovalProfilesForm from './_pages/approval-profiles/form';
import ApprovalProfiles from './_pages/approval-profiles/list';

import ApprovalDetails from './_pages/approvals/details';
import ApprovalsList from './_pages/approvals/list';

import ConnectorsList from './_pages/connectors/list';
import CredentialDetail from './_pages/credentials/detail';
import CredentialEdit from './_pages/credentials/form';

import CredentialsList from './_pages/credentials/list';
import CryptographicKeyDetail from './_pages/cryptographic-keys/detail';
import CryptographicKeyForm from './_pages/cryptographic-keys/form';
import CryptographicKeyList from './_pages/cryptographic-keys/list';
import CustomAttributesDetail from './_pages/custom-attributes/detail';
import CustomAttributesEdit from './_pages/custom-attributes/form';

import CustomAttributesList from './_pages/custom-attributes/list';
import Dashboard from './_pages/dashboard';
import DiscoveryDetail from './_pages/discoveries/detail';
import DiscoveryEdit from './_pages/discoveries/form';

import DiscoveriesList from './_pages/discoveries/list';
import EntityDetail from './_pages/entities/detail';
import EntityEdit from './_pages/entities/form';

import EntitiesList from './_pages/entities/list';
import GlobalMetadataDetail from './_pages/global-metadata/detail';
import GlobalMetadataEdit from './_pages/global-metadata/form';

import ScepProfileDetail from './_pages/scep-profiles/detail';
import ScepProfileEdit from './_pages/scep-profiles/form';

import ScepProfilesList from './_pages/scep-profiles/list';

import CmpProfileDetails from './_pages/cmp-profiles/details';
import CmpProfileEdit from './_pages/cmp-profiles/form';
import CmpProfilesList from './_pages/cmp-profiles/list';

import GlobalMetadataList from './_pages/global-metadata/list';
import GroupDetail from './_pages/group/detail';
import GroupEdit from './_pages/group/form';

import GroupList from './_pages/group/list';

import LocationDetail from './_pages/locations/detail';
import LocationEdit from './_pages/locations/form';

import LocationsList from './_pages/locations/list';
import RaProfileDetail from './_pages/ra-profiles/detail';
import RaProfileEdit from './_pages/ra-profiles/form';

import RaProfilesList from './_pages/ra-profiles/list';
import RoleDetail from './_pages/roles/detail';

import PlatformSettingsDetail from './_pages/platform-settings/detail';
import PlatformSettingsEdit from './_pages/platform-settings/form';
import RolesList from './_pages/roles/list';
import RoleEdit from './_pages/roles/RoleForm';
import RolePermissions from './_pages/roles/RolePermissionsForm';
import RoleUsers from './_pages/roles/RoleUsersForm';
import TokenProfileDetail from './_pages/token-profiles/detail';
import TokenProfileForm from './_pages/token-profiles/form';
import TokenProfileList from './_pages/token-profiles/list';
import TokenDetail from './_pages/tokens/detail';
import TokenEdit from './_pages/tokens/form';

import TokenList from './_pages/tokens/list';

import UserProfileDetail from './_pages/user-profile/detail';
import UserProfileEdit from './_pages/user-profile/form';
import UserDetail from './_pages/users/detail';
import UserEdit from './_pages/users/form';

import UsersList from './_pages/users/list';
import AppLogin from './AppLogin/AppLogin';

import AppRedirect from './AppRedirect';

import { Resource } from 'types/openapi';

import NotificationsList from './_pages/notifications/list';
import NotificationInstanceDetail from './_pages/notifications/notification-instance-details';
import NotificationInstanceForm from './_pages/notifications/notification-instance-form';
import NotificationsSetting from './_pages/notifications/notifications-setting';

import ConditionDetails from './_pages/conditions/details';
import ConditionForm from './_pages/conditions/form';

import ExecutionDetails from './_pages/executions/details';
import ExecutionForm from './_pages/executions/form';

import ActionDetails from './_pages/actions/detail';
import ActionForm from './_pages/actions/form';
import ActionsList from './_pages/actions/list';

import TriggerDetails from './_pages/triggers/details';
import TriggerForm from './_pages/triggers/form';
import TriggerList from './_pages/triggers/list';

import RuleDetails from './_pages/rules/detail';
import RulesForm from './_pages/rules/form';
import RulesList from './_pages/rules/list';

import SchedulerJobDetail from './_pages/scheduler/detail';
import SchedulerJobsList from './_pages/scheduler/list';
import Layout from './Layout';
import Spinner from './Spinner';

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
                    <Route path={`/${Resource.Users.toLowerCase()}/add`} element={<UserEdit />} />
                    <Route path={`/${Resource.Users.toLowerCase()}/edit/:id`} element={<UserEdit />} />

                    <Route path={`/${Resource.Roles.toLowerCase()}`} element={<RolesList />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Roles.toLowerCase()}`} />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/detail/:id`} element={<RoleDetail />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/add`} element={<RoleEdit />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/edit/:id`} element={<RoleEdit />} />
                    <Route path={`/${Resource.Roles.toLowerCase()}/users/:id`} element={<RoleUsers />} />
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
                    <Route path={`/${Resource.Connectors.toLowerCase()}/add`} element={<ConnectorEdit />} />
                    <Route path={`/${Resource.Connectors.toLowerCase()}/edit/:id`} element={<ConnectorEdit />} />

                    <Route path={`/${Resource.Discoveries.toLowerCase()}`} element={<DiscoveriesList />} />
                    <Route
                        path={`/${Resource.Discoveries.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Discoveries.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Discoveries.toLowerCase()}/detail/:id`} element={<DiscoveryDetail />} />
                    <Route path={`/${Resource.Discoveries.toLowerCase()}/add`} element={<DiscoveryEdit />} />

                    <Route path={`/${Resource.Authorities.toLowerCase()}`} element={<AuthoritiesList />} />
                    <Route
                        path={`/${Resource.Authorities.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Authorities.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Authorities.toLowerCase()}/detail/:id`} element={<AuthorityDetail />} />
                    <Route path={`/${Resource.Authorities.toLowerCase()}/add`} element={<AuthorityEdit />} />
                    <Route path={`/${Resource.Authorities.toLowerCase()}/edit/:id`} element={<AuthorityEdit />} />

                    <Route path={`/${Resource.RaProfiles.toLowerCase()}`} element={<RaProfilesList />} />
                    <Route
                        path={`/${Resource.RaProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.RaProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.RaProfiles.toLowerCase()}/detail/:authorityId/:id`} element={<RaProfileDetail />} />
                    <Route path={`/${Resource.RaProfiles.toLowerCase()}/add`} element={<RaProfileEdit />} />
                    <Route path={`/${Resource.RaProfiles.toLowerCase()}/edit/:authorityId/:id`} element={<RaProfileEdit />} />

                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}`} element={<ApprovalProfiles />} />
                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}/add`} element={<ApprovalProfilesForm />} />
                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}/detail/:id`} element={<ApprovalProfileDetails />} />
                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}/detail/:id/:version`} element={<ApprovalProfileDetails />} />
                    <Route path={`/${Resource.ApprovalProfiles.toLowerCase()}/edit/:id`} element={<ApprovalProfilesForm />} />

                    <Route path={`/${Resource.Approvals.toLowerCase()}`} element={<ApprovalsList />} />
                    <Route path={`/${Resource.Approvals.toLowerCase()}/detail/:id`} element={<ApprovalDetails />} />

                    <Route path={`/${Resource.ComplianceProfiles.toLowerCase()}`} element={<ComplianceProfilesList />} />
                    <Route
                        path={`/${Resource.ComplianceProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.ComplianceProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.ComplianceProfiles.toLowerCase()}/detail/:id`} element={<ComplianceProfileDetail />} />
                    <Route path={`/${Resource.ComplianceProfiles.toLowerCase()}/add`} element={<ComplianceProfileEdit />} />

                    <Route path={`/${Resource.AcmeProfiles.toLowerCase()}`} element={<AcmeProfilesList />} />
                    <Route
                        path={`/${Resource.AcmeProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.AcmeProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.AcmeProfiles.toLowerCase()}/detail/:id`} element={<AcmeProfileDetail />} />
                    <Route path={`/${Resource.AcmeProfiles.toLowerCase()}/edit/:id`} element={<AcmeProfileEdit />} />
                    <Route path={`/${Resource.AcmeProfiles.toLowerCase()}/add`} element={<AcmeProfileEdit />} />

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
                    <Route path={`/${Resource.ScepProfiles.toLowerCase()}/edit/:id`} element={<ScepProfileEdit />} />
                    <Route path={`/${Resource.ScepProfiles.toLowerCase()}/add`} element={<ScepProfileEdit />} />

                    <Route path={`/${Resource.CmpProfiles.toLowerCase()}`} element={<CmpProfilesList />} />
                    <Route
                        path={`/${Resource.CmpProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.CmpProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.CmpProfiles.toLowerCase()}/detail/:id`} element={<CmpProfileDetails />} />
                    <Route path={`/${Resource.CmpProfiles.toLowerCase()}/edit/:id`} element={<CmpProfileEdit />} />
                    <Route path={`/${Resource.CmpProfiles.toLowerCase()}/add`} element={<CmpProfileEdit />} />

                    <Route path={`/${Resource.Groups.toLowerCase()}`} element={<GroupList />} />
                    <Route
                        path={`/${Resource.Groups.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Groups.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Groups.toLowerCase()}/detail/:id`} element={<GroupDetail />} />
                    <Route path={`/${Resource.Groups.toLowerCase()}/add`} element={<GroupEdit />} />
                    <Route path={`/${Resource.Groups.toLowerCase()}/edit/:id`} element={<GroupEdit />} />

                    <Route path={`/${Resource.Credentials.toLowerCase()}`} element={<CredentialsList />} />
                    <Route
                        path={`/${Resource.Credentials.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Credentials.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Credentials.toLowerCase()}/detail/:id`} element={<CredentialDetail />} />
                    <Route path={`/${Resource.Credentials.toLowerCase()}/add`} element={<CredentialEdit />} />
                    <Route path={`/${Resource.Credentials.toLowerCase()}/edit/:id`} element={<CredentialEdit />} />

                    <Route path={`/${Resource.Entities.toLowerCase()}`} element={<EntitiesList />} />
                    <Route
                        path={`/${Resource.Entities.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Entities.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Entities.toLowerCase()}/detail/:id`} element={<EntityDetail />} />
                    <Route path={`/${Resource.Entities.toLowerCase()}/add`} element={<EntityEdit />} />
                    <Route path={`/${Resource.Entities.toLowerCase()}/edit/:id`} element={<EntityEdit />} />

                    <Route path={`/${Resource.Locations.toLowerCase()}`} element={<LocationsList />} />
                    <Route
                        path={`/${Resource.Locations.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Locations.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Locations.toLowerCase()}/detail/:entityId/:id`} element={<LocationDetail />} />
                    <Route path={`/${Resource.Locations.toLowerCase()}/add`} element={<LocationEdit />} />
                    <Route path={`/${Resource.Locations.toLowerCase()}/edit/:entityId/:id`} element={<LocationEdit />} />

                    <Route path={`/userprofile`} element={<UserProfileDetail />} />
                    <Route path={`/userprofile/edit`} element={<UserProfileEdit />} />

                    <Route path={`/${Resource.AuditLogs.toLowerCase()}`} element={<AuditLogs />} />

                    <Route path={`/customattributes`} element={<CustomAttributesList />} />
                    <Route path={`/customattributes/list`} element={<Navigate to={`/customattributes`} />} />
                    <Route path={`/customattributes/detail/:id`} element={<CustomAttributesDetail />} />
                    <Route path={`/customattributes/add`} element={<CustomAttributesEdit />} />
                    <Route path={`/customattributes/edit/:id`} element={<CustomAttributesEdit />} />

                    <Route path={`/globalmetadata`} element={<GlobalMetadataList />} />
                    <Route path={`/globalmetadata/list`} element={<Navigate to={`/globalmetadata`} />} />
                    <Route path={`/globalmetadata/detail/:id`} element={<GlobalMetadataDetail />} />
                    <Route path={`/globalmetadata/add`} element={<GlobalMetadataEdit />} />
                    <Route path={`/globalmetadata/edit/:id`} element={<GlobalMetadataEdit />} />

                    <Route path={`/${Resource.Tokens.toLowerCase()}`} element={<TokenList />} />
                    <Route
                        path={`/${Resource.Tokens.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.Tokens.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.Tokens.toLowerCase()}/detail/:id`} element={<TokenDetail />} />
                    <Route path={`/${Resource.Tokens.toLowerCase()}/add`} element={<TokenEdit />} />
                    <Route path={`/${Resource.Tokens.toLowerCase()}/edit/:id`} element={<TokenEdit />} />

                    <Route path={`/${Resource.TokenProfiles.toLowerCase()}`} element={<TokenProfileList />} />
                    <Route
                        path={`/${Resource.TokenProfiles.toLowerCase()}/list`}
                        element={<Navigate to={`/${Resource.TokenProfiles.toLowerCase()}`} />}
                    />
                    <Route path={`/${Resource.TokenProfiles.toLowerCase()}/detail/:tokenId/:id`} element={<TokenProfileDetail />} />
                    <Route path={`/${Resource.TokenProfiles.toLowerCase()}/add`} element={<TokenProfileForm />} />
                    <Route path={`/${Resource.TokenProfiles.toLowerCase()}/edit/:tokenId/:id`} element={<TokenProfileForm />} />

                    <Route path={`/${Resource.Keys.toLowerCase()}`} element={<CryptographicKeyList />} />
                    <Route path={`/${Resource.Keys.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Keys.toLowerCase()}`} />} />
                    <Route
                        path={`/${Resource.Keys.toLowerCase()}/detail/:tokenId/:id/:keyItemUuid?`}
                        element={<CryptographicKeyDetail />}
                    />
                    <Route path={`/${Resource.Keys.toLowerCase()}/add`} element={<CryptographicKeyForm />} />
                    <Route path={`/${Resource.Keys.toLowerCase()}/edit/:tokenId/:id`} element={<CryptographicKeyForm />} />

                    <Route path={`/${Resource.Settings.toLowerCase()}`} element={<PlatformSettingsDetail />} />
                    <Route path={`/${Resource.Settings.toLowerCase()}/edit`} element={<PlatformSettingsEdit />} />

                    <Route path={`/${Resource.Jobs.toLowerCase()}`} element={<SchedulerJobsList />} />
                    <Route path={`/${Resource.Jobs.toLowerCase()}/list`} element={<Navigate to={`/${Resource.Jobs.toLowerCase()}`} />} />
                    <Route path={`/${Resource.Jobs.toLowerCase()}/detail/:id`} element={<SchedulerJobDetail />} />

                    <Route path={`/notifications`} element={<NotificationsList />} />
                    <Route path={`/notificationssettings`} element={<NotificationsSetting />} />
                    <Route path={`/notificationinstances/detail/:id`} element={<NotificationInstanceDetail />} />
                    <Route path={`/notificationinstances/add`} element={<NotificationInstanceForm />} />
                    <Route path={`/notificationinstances/edit/:id`} element={<NotificationInstanceForm />} />

                    <Route path={`/conditions/add`} element={<ConditionForm />} />
                    <Route path={`/conditions/detail/:id`} element={<ConditionDetails />} />

                    <Route path={`/rules/add`} element={<RulesForm />} />
                    <Route path={`/rules/:tabIndex?`} element={<RulesList />} />
                    <Route path={`/rules/detail/:id`} element={<RuleDetails />} />

                    <Route path={`/executions/add`} element={<ExecutionForm />} />
                    <Route path={`/executions/detail/:id`} element={<ExecutionDetails />} />

                    <Route path={`/actions/add`} element={<ActionForm />} />
                    <Route path={`/actions/:tabIndex?`} element={<ActionsList />} />
                    <Route path={`/actions/detail/:id`} element={<ActionDetails />} />

                    <Route path={`/triggers/add`} element={<TriggerForm />} />
                    <Route path={`/triggers`} element={<TriggerList />} />
                    <Route path={`/triggers/detail/:id`} element={<TriggerDetails />} />

                    <Route path={`/approvals`} element={<ApprovalsList />} />
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
                <Route path="/login" element={<AppLogin />} />

                {profile ? appRoutes : <Route path="*" element={<Spinner active={true} />} />}
            </Routes>
        </HashRouter>
    );
}
