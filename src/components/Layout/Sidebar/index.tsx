import LinksGroup from './LinksGroup';
import style from './Sidebar.module.scss';
import { Resource } from 'types/openapi';
import { useMemo } from 'react';

type MenuItemMapping = {
    _key: string;
    header: string;
    requiredResources?: Resource[];
} & (
    | {
          headerLink?: never;
          children: Array<{
              _key: string;
              name: string;
              link: string;
              requiredResources?: Resource[];
          }>;
      }
    | {
          headerLink: string;
          requiredResources?: Resource[];
      }
);

const menuItemMappings: MenuItemMapping[] = [
    {
        _key: '/dashboard',
        header: 'Dashboard',
        headerLink: '/dashboard',
        requiredResources: [Resource.Certificates, Resource.RaProfiles, Resource.Discoveries, Resource.Groups],
    },
    { _key: '/certificates', header: 'Certificates', headerLink: '/certificates', requiredResources: [Resource.Certificates] },
    { _key: '/keys', header: 'Keys', headerLink: '/keys', requiredResources: [Resource.Keys] },
    { _key: '/discovery', header: 'Discoveries', headerLink: '/discoveries', requiredResources: [Resource.Discoveries] },
    { _key: '/connectors', header: 'Connectors', headerLink: '/connectors', requiredResources: [Resource.Connectors] },

    {
        _key: 'accessControl',
        header: 'Access Control',
        children: [
            { _key: '/users', name: 'Users', link: '/users', requiredResources: [Resource.Users] },
            { _key: '/roles', name: 'Roles', link: '/roles', requiredResources: [Resource.Roles] },
        ],
    },
    {
        _key: 'profiles',
        header: 'Profiles',
        children: [
            {
                _key: '/raprofiles',
                name: 'RA Profiles',
                link: '/raprofiles',
                requiredResources: [Resource.RaProfiles],
            },
            {
                _key: '/tokenprofiles',
                name: 'Token Profiles',
                link: '/tokenprofiles',
                requiredResources: [Resource.TokenProfiles],
            },
            {
                _key: '/complianceprofiles',
                name: 'Compliance Profiles',
                link: '/complianceprofiles',
                requiredResources: [Resource.ComplianceProfiles],
            },
            {
                _key: '/notificationProfiles',
                name: 'Notification Profiles',
                link: '/notificationprofiles',
                requiredResources: [Resource.NotificationProfiles],
            },
        ],
    },

    {
        _key: 'inventory',
        header: 'Inventory',
        children: [
            { _key: '/credentials', name: 'Credentials', link: '/credentials', requiredResources: [Resource.Credentials] },
            { _key: '/authorities', name: 'Authorities', link: '/authorities', requiredResources: [Resource.Authorities] },
            { _key: '/tokens', name: 'Tokens', link: '/tokens', requiredResources: [Resource.Tokens] },
            { _key: '/groups', name: 'Groups', link: '/groups', requiredResources: [Resource.Groups] },
            { _key: '/entities', name: 'Entities', link: '/entities', requiredResources: [Resource.Entities] },
            { _key: '/locations', name: 'Locations', link: '/locations', requiredResources: [Resource.Locations] },
        ],
    },

    {
        _key: 'protocols',
        header: 'Protocols',
        children: [
            {
                _key: '/acmeaccounts',
                name: 'ACME Accounts',
                link: '/acmeaccounts',
                requiredResources: [Resource.AcmeAccounts],
            },
            { _key: '/acmeprofiles', name: 'ACME Profiles', link: '/acmeprofiles', requiredResources: [Resource.AcmeProfiles] },
            { _key: '/cmpprofiles', name: 'CMP Profiles', link: '/cmpprofiles', requiredResources: [Resource.CmpProfiles] },
            { _key: '/scepprofiles', name: 'SCEP Profiles', link: '/scepprofiles', requiredResources: [Resource.ScepProfiles] },
        ],
    },

    {
        _key: 'approvals',
        header: 'Approvals',
        children: [
            {
                _key: '/approvalprofiles',
                name: 'Approval Profiles',
                link: '/approvalprofiles',
                requiredResources: [Resource.ApprovalProfiles],
            },
            {
                _key: '/approvals',
                name: 'Approval List',
                link: '/approvals',
                requiredResources: [Resource.Approvals],
            },
        ],
    },

    { _key: '/jobs', header: 'Scheduler', headerLink: '/jobs', requiredResources: [Resource.Jobs] },

    {
        _key: 'settings',
        header: 'Settings',
        children: [
            { _key: '/settings', name: 'Platform', link: '/settings', requiredResources: [Resource.Settings] },
            {
                _key: '/customattributes',
                name: 'Custom Attributes',
                link: '/customattributes',
                requiredResources: [Resource.Attributes],
            },
            { _key: '/globalmetadata', name: 'Global Metadata', link: '/globalmetadata', requiredResources: [Resource.Attributes] },
            {
                _key: '/events',
                name: 'Events',
                link: '/events',
                requiredResources: [Resource.NotificationInstances, Resource.Settings],
            },
            { _key: '/loggingSettings', name: 'Logging', link: '/loggingsettings', requiredResources: [Resource.Settings] },
            {
                _key: '/authenticationSettings',
                name: 'Authentication',
                link: '/authenticationsettings',
                requiredResources: [Resource.Settings],
            },
            { _key: '/custom-oids', name: 'Custom OIDs', link: '/custom-oids', requiredResources: [Resource.Settings] },
        ],
    },

    { _key: '/auditlogs', header: 'Audit Logs', headerLink: '/auditlogs', requiredResources: [Resource.AuditLogs] },
    {
        _key: 'workflows',
        header: 'Workflows',
        children: [
            // { _key: '/conditions', name: 'Conditions', link: '/conditions' },
            {
                _key: 'rules',
                name: 'Rules',
                link: '/rules',
                requiredResources: [Resource.Rules],
            },
            {
                _key: 'actions',
                name: 'Actions',
                link: '/actions',
                requiredResources: [Resource.Actions],
            },
            {
                _key: 'triggers',
                name: 'Triggers',
                link: '/triggers',
                requiredResources: [Resource.Triggers],
            },
        ],
    },
];

function getAllowedMenuItems(allowedResources?: Resource[]): MenuItemMapping[] {
    if (!allowedResources) return [];
    const allowedLinks: MenuItemMapping[] = [];

    // Filters menu items based on associated resources and allowed resources.
    // Menu item is shown if:
    // 1. It doesn't have children, and doesn't have associated resources array.
    // 2. It doesn't have children, and associated resources array contains item which is present in allowedResources.
    // 3. It has a child, which is shown based on rules 1 and 2.
    for (const mapping of menuItemMappings) {
        if ('children' in mapping) {
            mapping.children = mapping.children.filter((el) => {
                return !!el.requiredResources?.some((resource) => allowedResources.includes(resource));
            });
            if (mapping.children.length > 0) {
                allowedLinks.push(mapping);
            }
            continue;
        }
        if (
            mapping.requiredResources === undefined ||
            mapping.requiredResources.length === 0 ||
            mapping.requiredResources.find((resource) => allowedResources.includes(resource))
        ) {
            allowedLinks.push(mapping);
        }
    }

    return allowedLinks;
}

type Props = {
    allowedResources?: Resource[];
};
export default function Sidebar({ allowedResources }: Props) {
    const allowedMenuItems = useMemo(() => getAllowedMenuItems(allowedResources), [allowedResources]);

    function renderMenuItem(mapping: MenuItemMapping) {
        if ('children' in mapping) {
            return <LinksGroup key={mapping._key} header={mapping.header} childrenLinks={mapping.children} />;
        }
        return <LinksGroup key={mapping._key} header={mapping.header} headerLink={mapping.headerLink} />;
    }
    return (
        <nav className={style.root}>
            <div className={style.nav}>
                <ul>{allowedMenuItems.map((item) => renderMenuItem(item))}</ul>
            </div>
        </nav>
    );
}
