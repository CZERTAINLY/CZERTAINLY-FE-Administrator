import LinksGroup from './LinksGroup';
import style from './Sidebar.module.scss';

export default function Sidebar() {
    return (
        <nav className={style.root}>
            <div className={style.nav}>
                <ul>
                    <LinksGroup _key="/dashboard" header="Dashboard" headerLink="/dashboard" />
                    <LinksGroup _key="/certificates" header="Certificates" headerLink="/certificates" />
                    <LinksGroup _key="/keys" header="Keys" headerLink="/keys" />
                    <LinksGroup _key="/discovery" header="Discoveries" headerLink="/discoveries" />
                    <LinksGroup _key="/connectors" header="Connectors" headerLink="/connectors" />

                    <LinksGroup
                        _key="accessControl"
                        header="Access Control"
                        childrenLinks={[
                            { _key: '/users', name: 'Users', link: '/users' },
                            { _key: '/roles', name: 'Roles', link: '/roles' },
                        ]}
                    />

                    <LinksGroup
                        _key="profiles"
                        header="Profiles"
                        childrenLinks={[
                            { _key: '/raprofiles', name: 'RA Profiles', link: '/raprofiles' },
                            { _key: '/tokenprofiles', name: 'Token Profiles', link: '/tokenprofiles' },
                            { _key: '/complianceprofiles', name: 'Compliance Profiles', link: '/complianceprofiles' },
                        ]}
                    />

                    <LinksGroup
                        _key="inventory"
                        header="Inventory"
                        childrenLinks={[
                            { _key: '/credentials', name: 'Credentials', link: '/credentials' },
                            { _key: '/authorities', name: 'Authorities', link: '/authorities' },
                            { _key: '/tokens', name: 'Tokens', link: '/tokens' },
                            { _key: '/groups', name: 'Groups', link: '/groups' },
                            { _key: '/entities', name: 'Entities', link: '/entities' },
                            { _key: '/locations', name: 'Locations', link: '/locations' },
                        ]}
                    />

                    <LinksGroup
                        _key="protocols"
                        header="Protocols"
                        childrenLinks={[
                            { _key: '/acmeaccounts', name: 'ACME Accounts', link: '/acmeaccounts' },
                            { _key: '/acmeprofiles', name: 'ACME Profiles', link: '/acmeprofiles' },
                            { _key: '/cmpprofiles', name: 'CMP Profiles', link: '/cmpprofiles' },
                            { _key: '/scepprofiles', name: 'SCEP Profiles', link: '/scepprofiles' },
                        ]}
                    />

                    <LinksGroup
                        _key="approvals"
                        header="Approvals"
                        childrenLinks={[
                            { _key: '/approvalprofiles', name: 'Approval Profiles', link: '/approvalprofiles' },
                            {
                                _key: '/approvals',
                                name: 'Approval List',
                                link: '/approvals',
                            },
                        ]}
                    />

                    <LinksGroup _key="/jobs" header="Scheduler" headerLink="/jobs" />

                    <LinksGroup
                        _key="settings"
                        header="Settings"
                        childrenLinks={[
                            { _key: '/settings', name: 'Platform', link: '/settings' },
                            { _key: '/customattributes', name: 'Custom Attributes', link: '/customattributes' },
                            { _key: '/globalmetadata', name: 'Global Metadata', link: '/globalmetadata' },
                            { _key: '/notificationsSetting', name: 'Notifications', link: '/notificationssettings' },
                        ]}
                    />

                    <LinksGroup _key="/auditlogs" header="Audit Logs" headerLink="/auditlogs" />
                    <LinksGroup
                        _key="workflows"
                        header="Workflows"
                        childrenLinks={[
                            // { _key: '/conditions', name: 'Conditions', link: '/conditions' },
                            {
                                _key: 'rules',
                                name: 'Rules',
                                link: '/rules',
                            },
                            {
                                _key: 'actions',
                                name: 'Actions',
                                link: '/actions',
                            },
                            {
                                _key: 'triggers',
                                name: 'Triggers',
                                link: '/triggers',
                            },
                        ]}
                    />
                </ul>
            </div>
        </nav>
    );
}
