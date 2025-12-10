import { Resource } from 'types/openapi';
import { useMemo, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useLocalStorage } from 'usehooks-ts';
import cx from 'classnames';
import {
    Award,
    ChevronDown,
    HomeIcon,
    KeyRound,
    SearchCheck,
    Link,
    CircleUser,
    Users,
    Table,
    ListChecks,
    CircleCheckBig,
    Calendar,
    Settings,
    FileJson2,
    Split,
    ArrowRightToLine,
} from 'lucide-react';
import Button from 'components/Button';
import SimpleBar from 'simplebar-react';

type MenuItemMapping = {
    _key: string;
    icon?: React.ReactNode;
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
        icon: <HomeIcon size={16} strokeWidth={1.5} />,
        header: 'Dashboard',
        headerLink: '/dashboard',
        requiredResources: [Resource.Certificates, Resource.RaProfiles, Resource.Discoveries, Resource.Groups],
    },
    {
        _key: '/certificates',
        icon: <Award size={16} strokeWidth={1.5} />,
        header: 'Certificates',
        headerLink: '/certificates',
        requiredResources: [Resource.Certificates],
    },
    {
        _key: '/keys',
        icon: <KeyRound size={16} strokeWidth={1.5} />,
        header: 'Keys',
        headerLink: '/keys',
        requiredResources: [Resource.Keys],
    },
    {
        _key: '/discovery',
        icon: <SearchCheck size={16} strokeWidth={1.5} />,
        header: 'Discoveries',
        headerLink: '/discoveries',
        requiredResources: [Resource.Discoveries],
    },
    {
        _key: '/connectors',
        icon: <Link size={16} strokeWidth={1.5} />,
        header: 'Connectors',
        headerLink: '/connectors',
        requiredResources: [Resource.Connectors],
    },

    {
        _key: 'accessControl',
        icon: <CircleUser size={16} strokeWidth={1.5} />,
        header: 'Access Control',
        children: [
            { _key: '/users', name: 'Users', link: '/users', requiredResources: [Resource.Users] },
            { _key: '/roles', name: 'Roles', link: '/roles', requiredResources: [Resource.Roles] },
        ],
    },
    {
        _key: 'profiles',
        icon: <Users size={16} strokeWidth={1.5} />,
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
        icon: <Table size={16} strokeWidth={1.5} />,
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
        icon: <ListChecks size={16} strokeWidth={1.5} />,
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
        icon: <CircleCheckBig size={16} strokeWidth={1.5} />,
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

    {
        _key: '/jobs',
        icon: <Calendar size={16} strokeWidth={1.5} />,
        header: 'Scheduler',
        headerLink: '/jobs',
        requiredResources: [Resource.Jobs],
    },

    {
        _key: 'settings',
        icon: <Settings size={16} strokeWidth={1.5} />,
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

    {
        _key: '/auditlogs',
        icon: <FileJson2 size={16} strokeWidth={1.5} />,
        header: 'Audit Logs',
        headerLink: '/auditlogs',
        requiredResources: [Resource.AuditLogs],
    },
    {
        _key: 'workflows',
        icon: <Split size={16} strokeWidth={1.5} />,
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
    const [defaultMenuSize, setDefaultMenuSize] = useLocalStorage<'small' | 'large'>('menu-size', 'small');
    const [menuSize, setMenuSize] = useState<'small' | 'large' | 'flying'>(defaultMenuSize);
    const location = useLocation();

    const allowedMenuItems = useMemo(() => getAllowedMenuItems(allowedResources), [allowedResources]);
    const [openMenuItems, setOpenMenuItems] = useState<string[]>([]);

    useEffect(() => {
        if (menuSize === 'flying') return;
        document.documentElement.style.setProperty('--sidebar-width', menuSize === 'small' ? '84px' : '260px');
    }, [menuSize]);

    function toggleMenuSize() {
        const newMenuSize = menuSize === 'small' ? 'large' : 'small';
        setMenuSize(newMenuSize);
        setOpenMenuItems([]);
        setDefaultMenuSize(newMenuSize);
    }

    function renderMenuItem(mapping: MenuItemMapping) {
        if ('children' in mapping) {
            const childrenKeys = mapping.children.map((child) => child.link);
            const activePage = location.pathname;
            const isChildActive = childrenKeys.some((child) => child === activePage);
            const isActive = openMenuItems.includes(mapping._key);
            return (
                <li key={mapping.header} className={cx('flex justify-center', { 'flex-col': menuSize != 'small' })}>
                    <Button
                        variant="transparent"
                        className={cx('!px-4 !py-2 border-none justify-between h-[38px]', {
                            'flex w-full items-center': menuSize != 'small',
                        })}
                        onClick={() => {
                            if (menuSize === 'small') {
                                setMenuSize('flying');
                            }
                            setOpenMenuItems((prev) => (isActive ? prev.filter((item) => item !== mapping._key) : [...prev, mapping._key]));
                        }}
                        aria-expanded={isActive}
                        aria-controls={mapping._key}
                    >
                        <div className={cx('flex items-center gap-x-2', { 'text-blue-600': isChildActive })}>
                            {mapping.icon}
                            <span className={cx('text-sm', { 'sr-only': menuSize === 'small' })}>{mapping.header}</span>
                        </div>
                        {menuSize != 'small' && <ChevronDown strokeWidth={1.5} size={16} className={cx({ isActive: 'rotate-180' })} />}
                    </Button>
                    <ul
                        className={cx(
                            `transition-[max-height] duration-300 ease-in-out overflow-hidden relative before:content-[''] before:absolute before:left-6 before:top-0 before:h-full before:w-0.5 before:bg-gray-200`,
                            {
                                'w-0': !isActive,
                            },
                        )}
                        style={{
                            maxHeight: isActive ? `${38 * mapping.children.length}px` : 0,
                        }}
                        id={mapping._key}
                    >
                        {mapping.children.map((child, index) => (
                            <li key={child.name} className={cx({ 'mb-2': index === mapping.children.length - 1 })}>
                                <NavLink
                                    to={child.link}
                                    className={({ isActive }) =>
                                        cx(
                                            'block px-4 ml-8 py-2 no-underline hover:bg-gray-200 rounded-lg h-[38px] items-center',
                                            isActive && 'text-blue-600',
                                        )
                                    }
                                >
                                    {child.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </li>
            );
        }
        return (
            <li key={mapping._key} className="flex justify-center">
                <NavLink
                    to={mapping.headerLink}
                    onClick={() => {
                        if (menuSize === 'flying') {
                            setMenuSize('small');
                            setOpenMenuItems([]);
                        }
                    }}
                    className={({ isActive }) =>
                        cx('flex px-4 py-2 no-underline hover:bg-gray-200 rounded-lg h-[38px] items-center dark:text-white', {
                            'text-blue-600': isActive,
                            'w-full gap-x-2': menuSize !== 'small',
                        })
                    }
                >
                    {mapping.icon}
                    <span className={cx('text-sm', { 'sr-only': menuSize === 'small' })}>{mapping.header}</span>
                </NavLink>
            </li>
        );
    }
    return (
        <SimpleBar
            forceVisible="y"
            style={{
                height: 'calc(100vh - var(--header-height))',
                width: 'var(--sidebar-width)',
                position: 'sticky',
                top: 'var(--header-height)',
                zIndex: 10,
            }}
        >
            <div className="p-4 w-full h-full dark:bg-neutral-900">
                <nav className="pb-4">
                    <ul className="list-none m-0 flex flex-col gap-y-1">{allowedMenuItems.map((item) => renderMenuItem(item))}</ul>
                </nav>
                <hr className="border-gray-200" />
                <div className="flex justify-center pt-4">
                    <Button
                        variant="transparent"
                        className={cx('inline-flex px-4 py-2 border-none', {
                            'w-full gap-x-2': menuSize !== 'small',
                        })}
                        onClick={() => toggleMenuSize()}
                    >
                        <ArrowRightToLine strokeWidth={1} size={24} className={cx(menuSize === 'large' && 'rotate-180')} />
                        <span className={cx({ 'sr-only': menuSize === 'small' })}>Collapse</span>
                    </Button>
                </div>
            </div>
        </SimpleBar>
    );
}
