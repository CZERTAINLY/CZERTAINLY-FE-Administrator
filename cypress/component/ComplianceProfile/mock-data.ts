import { getEnumLabel } from 'ducks/enums';
import { Resource, ComplianceRuleAvailabilityStatus } from 'types/openapi/models';

export const complianceProfileDetailMockData = {
    uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
    name: 'test',
    description: 'test',
    internalRules: [
        {
            uuid: '1',
            name: 'test',
            description: 'test',
            availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
            resource: Resource.Certificates,
            attributes: [],
            conditionItems: [
                {
                    fieldSource: 'property',
                    fieldIdentifier: 'COMMON_NAME',
                    operator: 'CONTAINS',
                    value: 'test',
                },
                {
                    fieldSource: 'property',
                    fieldIdentifier: 'SERIAL_NUMBER',
                    operator: 'CONTAINS',
                    value: '1',
                },
            ],
        },
        {
            uuid: '2',
            name: 'test2',
            description: 'test2',
            availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
            resource: Resource.Keys,
            attributes: [],
            conditionItems: [
                {
                    fieldSource: 'property',
                    fieldIdentifier: 'CKI_NAME',
                    operator: 'CONTAINS',
                    value: 'test',
                },
            ],
        },
        {
            uuid: '3',
            name: 'test3',
            description: 'test3',
            availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
            resource: Resource.Keys,
            attributes: [],
            conditionItems: [
                {
                    fieldSource: 'property',
                    fieldIdentifier: 'CKI_NAME',
                    operator: 'CONTAINS',
                    value: 'test',
                },
            ],
        },
    ],
    providerRules: [
        {
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            connectorName: 'X509-Compliance-Provider',
            kind: 'x509',
            rules: [
                {
                    uuid: '7ed00480-e706-11ec-8fea-0242ac120002',
                    name: 'cus_key_length',
                    description: 'Public Key length of the certificate should be',
                    availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
                    resource: Resource.Certificates,
                    type: 'X.509',
                    attributes: [
                        {
                            uuid: '7ed00782-e706-11ec-8fea-0242ac120002',
                            name: 'condition',
                            label: 'Condition',
                            type: 'data',
                            contentType: 'string',
                            content: [
                                {
                                    data: 'Equals',
                                },
                            ],
                        },
                        {
                            uuid: '7ed00886-e706-11ec-8fea-0242ac120002',
                            name: 'length',
                            label: 'Key Length',
                            type: 'data',
                            contentType: 'integer',
                            content: [
                                {
                                    data: '1',
                                },
                            ],
                        },
                    ],
                },
                {
                    uuid: '40f084cf-ddc1-11ec-b4e7-34cff65c6ee3',
                    name: 'e_ca_common_name_missing',
                    description: 'CA Certificates common name MUST be included.',
                    groupUuid: '5235104e-ddb2-11ec-9d64-0242ac120002',
                    availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
                    resource: Resource.Certificates,
                    type: 'X.509',
                    attributes: [],
                },
            ],
            groups: [
                {
                    uuid: '523513dc-ddb2-11ec-9d64-0242ac120002',
                    name: 'RFC 5280',
                    description: 'https://datatracker.ietf.org/doc/html/rfc5280',
                    availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
                    resource: Resource.Certificates,
                },
                {
                    uuid: '52350996-ddb2-11ec-9d64-0242ac120002',
                    name: "Apple's CT Policy",
                    description: 'some description',
                    availabilityStatus: ComplianceRuleAvailabilityStatus.Available,
                    resource: Resource.Certificates,
                },
            ],
        },
    ],
    customAttributes: [
        {
            uuid: '92de3778-d990-4d31-9b87-b0086882e2b2',
            name: 'textCustomAttrExecution',
            label: 'textCustomAttrExecution',
            type: 'custom',
            contentType: 'text',
            content: [
                {
                    data: 't1',
                },
            ],
        },
    ],
};

export const mockAssociations = [
    {
        resource: 'raProfiles',
        objectUuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        name: 'Custom',
    },
];

export const mockRaProfiles = [
    {
        uuid: '0be45e19-7392-4edf-9ac7-ecd0f9a7c7c0',
        name: 'SemikACME',
        description: '',
        authorityInstanceUuid: 'd1392319-f68e-4cd9-aad1-06ef6f10d6aa',
        authorityInstanceName: 'ejbca.3key.company',
        enabled: true,
        attributes: [],
        enabledProtocols: ['ACME'],
        certificateValidationSettings: {
            usePlatformSettings: true,
            enabled: false,
        },
    },
    {
        uuid: '0bddee3a-8206-4a1a-a5ec-ee0d25445ab3',
        name: 'czertainly',
        description: '',
        authorityInstanceUuid: '7e8fd404-921d-4d9a-a92a-920e196a5112',
        authorityInstanceName: 'adcs-lab02',
        enabled: true,
        attributes: [],
        enabledProtocols: ['ACME', 'CMP'],
        certificateValidationSettings: {
            usePlatformSettings: true,
            enabled: false,
        },
    },
];

export const mockTokenProfiles = [
    {
        uuid: '0f442b85-a97c-41de-9ebe-75bae7176984',
        name: 'new-token-profile-from-2-15',
        description: '',
        tokenInstanceUuid: '94a09e50-b103-4077-9967-4582ca60e732',
        tokenInstanceName: 'test-token-1',
        tokenInstanceStatus: 'Deactivated',
        enabled: false,
        usages: [],
    },
    {
        uuid: '2f3cbd30-92f6-496b-aff7-c563e0364a9d',
        name: 'TestPQCTokenProfile',
        description: '',
        tokenInstanceUuid: '284f7065-669b-434d-9109-61319a52d2cb',
        tokenInstanceName: 'TestPQCToken',
        tokenInstanceStatus: 'Activated',
        enabled: true,
        usages: ['sign', 'verify', 'encrypt', 'decrypt', 'wrap', 'unwrap'],
    },
    {
        uuid: '3662053d-f5c3-43bd-80b1-02789fe1b713',
        name: 'test-token-profile-1',
        description: 'test-token-profile-1',
        tokenInstanceUuid: '550428d8-6fbf-4489-9f47-0510a7fba3e5',
        tokenInstanceName: 'DummyCorePublicKeysToken',
        tokenInstanceStatus: 'Activated',
        enabled: false,
        usages: ['verify', 'encrypt', 'wrap', 'unwrap'],
    },
];

export const mockRuleForEdit = {
    uuid: 'ae320422-7e43-47e6-86db-26faf4b9f336',
    name: 'test2',
    description: 'test2',
    resource: Resource.CertificateRequests,
    conditionItems: [
        {
            fieldSource: 'data',
            fieldIdentifier: 'commonName|STRING',
            operator: 'CONTAINS',
            value: 'test',
        },
    ],
    entityDetails: {
        entityType: 'rule',
    },
};

export const mockResourceOptionsWithComplianceProfile = [
    {
        value: 'certificates',
        label: 'Certificate',
    },
    {
        value: 'certificateRequests',
        label: 'Certificate Request',
    },
    {
        value: 'keys',
        label: 'Key',
    },
];

export const mockComplianceProfiles = [
    {
        uuid: '5431a4da-8332-479e-8dc9-74a07aebf5c0',
        name: 'test-cmp-01',
        description: 'test-cmp-01',
        providerRulesCount: 2,
        providerGroupsCount: 3,
        internalRulesCount: 0,
        associations: 4,
    },
    {
        uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
        name: 'test',
        description: 'test',
        providerRulesCount: 4,
        providerGroupsCount: 2,
        internalRulesCount: 3,
        associations: 5,
    },
    {
        uuid: '906729b1-cb4d-4c47-bee5-fe8999c8c716',
        name: 'archived',
        providerRulesCount: 0,
        providerGroupsCount: 1,
        internalRulesCount: 0,
        associations: 1,
    },
];

export const mockGroupRules = [
    {
        uuid: '40f084cd-ddc1-11ec-82b0-34cff65c6ee3',
        name: 'e_basic_constraints_not_critical',
        description: 'basicConstraints MUST appear as a critical extension',
        connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
        kind: 'x509',
        groupUuid: '523513dc-ddb2-11ec-9d64-0242ac120002',
        resource: 'certificates',
    },
];

export const mockInternalRules = [
    {
        uuid: '481cef16-38d3-4852-be50-cccbd7007097ewqeqwes',
        name: 'test3',
        description: 'test3',
        resource: 'keys',
        conditionItems: [
            {
                fieldSource: 'property',
                fieldIdentifier: 'CKI_NAME',
                operator: 'CONTAINS',
                value: 'test',
            },
        ],
    },
    {
        uuid: 'd0e4f96e-bc69-444c-b115-afcbfb81d96b',
        name: 'test5',
        description: 'test5',
        resource: 'certificates',
        conditionItems: [
            {
                fieldSource: 'property',
                fieldIdentifier: 'CKI_NAME',
                operator: 'CONTAINS',
                value: 'test',
            },
        ],
    },
];

export const mockProviderRules = [
    {
        uuid: '7ed00480-e706-11ec-8fea-0242ac120002wewq',
        name: 'cus_key_length',
        description: 'Public Key length of the certificate should be',
        connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
        kind: 'x509',
        resource: 'certificates',
        attributes: [
            {
                version: 2,
                uuid: '7ed00782-e706-11ec-8fea-0242ac120002',
                name: 'condition',
                description: 'Select the condition to apply',
                content: [
                    {
                        data: 'Equals',
                    },
                    {
                        data: 'NotEquals',
                    },
                    {
                        data: 'Greater',
                    },
                    {
                        data: 'Lesser',
                    },
                ],
                type: 'data',
                contentType: 'string',
                properties: {
                    label: 'Condition',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                version: 2,
                uuid: '7ed00886-e706-11ec-8fea-0242ac120002',
                name: 'length',
                description: 'Enter the key size of the certificate to be checked',
                type: 'data',
                contentType: 'integer',
                properties: {
                    label: 'Key Length',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: false,
                    multiSelect: false,
                },
            },
        ],
    },
];

export const mockProviderGroups = [
    {
        uuid: '52350996-ddb2-11ec-9d64-0242ac120002dsdsadsa',
        name: "Apple's CT Policy",
        description: 'some description',
        connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
        kind: 'x509',
        resource: 'certificates',
    },
];

export const mockConnectors = [
    {
        uuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
        name: 'X509-Compliance-Provider',
        functionGroups: [
            {
                functionGroupCode: 'complianceProvider',
                kinds: ['x509'],
                endPoints: [
                    {
                        uuid: '7bd77d90-e7d7-11ec-8fea-0242ac120002',
                        name: 'listRules',
                        context: '/v1/complianceProvider/{kind}/rules',
                        method: 'GET',
                        required: true,
                    },
                    {
                        uuid: '7bd77f34-e7d7-11ec-8fea-0242ac120002',
                        name: 'listGroups',
                        context: '/v1/complianceProvider/{kind}/groups',
                        method: 'GET',
                        required: true,
                    },
                    {
                        uuid: '7bd78038-e7d7-11ec-8fea-0242ac120002',
                        name: 'listGroupDetails',
                        context: '/v1/complianceProvider/{kind}/groups/{uuid}',
                        method: 'GET',
                        required: true,
                    },
                    {
                        uuid: '7bd7811e-e7d7-11ec-8fea-0242ac120002',
                        name: 'checkCompliance',
                        context: '/v1/complianceProvider/{kind}/compliance',
                        method: 'POST',
                        required: true,
                    },
                ],
                uuid: '7bd77d90-f7d7-11ec-8fea-0242ac120002',
                name: 'complianceProvider',
            },
        ],
        url: 'http://x509-compliance-provider-service:8080',
        authType: 'none',
        authAttributes: [],
        status: 'connected',
    },
];

export const mockSearchGroupEnum = {
    data: {
        code: 'data',
        label: 'Data attribute',
    },
    meta: {
        code: 'meta',
        label: 'Metadata',
    },
    custom: {
        code: 'custom',
        label: 'Custom attribute',
    },
    property: {
        code: 'property',
        label: 'Property',
    },
};

export const mockResourceEnum = {
    connectors: {
        code: 'connectors',
        label: 'Connector',
    },
    raProfiles: {
        code: 'raProfiles',
        label: 'RA Profile',
    },
    keyItems: {
        code: 'keyItems',
        label: 'Key item',
    },
    rules: {
        code: 'rules',
        label: 'Rule',
    },
    resourceEvents: {
        code: 'resourceEvents',
        label: 'Resource Event',
    },
    cmpProfiles: {
        code: 'cmpProfiles',
        label: 'CMP Profile',
    },
    notificationProfiles: {
        code: 'notificationProfiles',
        label: 'Notification profile',
    },
    approvals: {
        code: 'approvals',
        label: 'Approval',
    },
    complianceGroups: {
        code: 'complianceGroups',
        label: 'Compliance Group',
    },
    NONE: {
        code: 'NONE',
        label: 'None',
    },
    dashboard: {
        code: 'dashboard',
        label: 'Dashboard',
    },
    settings: {
        code: 'settings',
        label: 'Settings',
    },
    globalMetadata: {
        code: 'globalMetadata',
        label: 'Global Metadata',
    },
    notificationInstances: {
        code: 'notificationInstances',
        label: 'Notification instance',
    },
    approvalProfiles: {
        code: 'approvalProfiles',
        label: 'Approval profile',
    },
    triggers: {
        code: 'triggers',
        label: 'Trigger',
    },
    endEntityProfiles: {
        code: 'endEntityProfiles',
        label: 'End entity profile',
    },
    users: {
        code: 'users',
        label: 'User',
    },
    authorities: {
        code: 'authorities',
        label: 'Authority',
    },
    certificateRequests: {
        code: 'certificateRequests',
        label: 'Certificate Request',
    },
    certificates: {
        code: 'certificates',
        label: 'Certificate',
    },
    complianceProfiles: {
        code: 'complianceProfiles',
        label: 'Compliance Profile',
    },
    searchFilters: {
        code: 'searchFilters',
        label: 'Search Filter',
    },
    conditions: {
        code: 'conditions',
        label: 'Condition',
    },
    acmeAccounts: {
        code: 'acmeAccounts',
        label: 'ACME Account',
    },
    actions: {
        code: 'actions',
        label: 'Action',
    },
    notifications: {
        code: 'notifications',
        label: 'Notification',
    },
    customAttributes: {
        code: 'customAttributes',
        label: 'Custom Attribute',
    },
    scepProfiles: {
        code: 'scepProfiles',
        label: 'SCEP Profile',
    },
    credentials: {
        code: 'credentials',
        label: 'Credential',
    },
    keys: {
        code: 'keys',
        label: 'Key',
    },
    roles: {
        code: 'roles',
        label: 'Role',
    },
    acmeAuthorizations: {
        code: 'acmeAuthorizations',
        label: 'ACME Authorization',
    },
    ANY: {
        code: 'ANY',
        label: 'Any',
    },
    auditLogs: {
        code: 'auditLogs',
        label: 'Audit logs',
    },
    acmeChallenges: {
        code: 'acmeChallenges',
        label: 'ACME Challenge',
    },
    authenticationProviders: {
        code: 'authenticationProviders',
        label: 'Authentication Provider',
    },
    tokens: {
        code: 'tokens',
        label: 'Token',
    },
    cmpTransactions: {
        code: 'cmpTransactions',
        label: 'CMP Transaction',
    },
    oids: {
        code: 'oids',
        label: 'OID',
    },
    acmeProfiles: {
        code: 'acmeProfiles',
        label: 'ACME Profile',
    },
    jobs: {
        code: 'jobs',
        label: 'Scheduled job',
    },
    groups: {
        code: 'groups',
        label: 'Group',
    },
    resources: {
        code: 'resources',
        label: 'Resource',
    },
    complianceRules: {
        code: 'complianceRules',
        label: 'Compliance Rule',
    },
    executions: {
        code: 'executions',
        label: 'Execution',
    },
    discoveries: {
        code: 'discoveries',
        label: 'Discovery',
    },
    entities: {
        code: 'entities',
        label: 'Entity',
    },
    tokenProfiles: {
        code: 'tokenProfiles',
        label: 'Token Profile',
    },
    attributes: {
        code: 'attributes',
        label: 'Attribute',
    },
    locations: {
        code: 'locations',
        label: 'Location',
    },
    acmeOrders: {
        code: 'acmeOrders',
        label: 'ACME Order',
    },
    platformEnums: {
        code: 'platformEnums',
        label: 'Platform enumerator',
    },
};

export const mockPlatformEnums = {
    Resource: {
        connectors: {
            code: 'connectors',
            label: 'Connector',
        },
        raProfiles: {
            code: 'raProfiles',
            label: 'RA Profile',
        },
        keyItems: {
            code: 'keyItems',
            label: 'Key item',
        },
        rules: {
            code: 'rules',
            label: 'Rule',
        },
        resourceEvents: {
            code: 'resourceEvents',
            label: 'Resource Event',
        },
        cmpProfiles: {
            code: 'cmpProfiles',
            label: 'CMP Profile',
        },
        notificationProfiles: {
            code: 'notificationProfiles',
            label: 'Notification profile',
        },
        approvals: {
            code: 'approvals',
            label: 'Approval',
        },
        complianceGroups: {
            code: 'complianceGroups',
            label: 'Compliance Group',
        },
        NONE: {
            code: 'NONE',
            label: 'None',
        },
        dashboard: {
            code: 'dashboard',
            label: 'Dashboard',
        },
        settings: {
            code: 'settings',
            label: 'Settings',
        },
        globalMetadata: {
            code: 'globalMetadata',
            label: 'Global Metadata',
        },
        notificationInstances: {
            code: 'notificationInstances',
            label: 'Notification instance',
        },
        approvalProfiles: {
            code: 'approvalProfiles',
            label: 'Approval profile',
        },
        triggers: {
            code: 'triggers',
            label: 'Trigger',
        },
        endEntityProfiles: {
            code: 'endEntityProfiles',
            label: 'End entity profile',
        },
        users: {
            code: 'users',
            label: 'User',
        },
        authorities: {
            code: 'authorities',
            label: 'Authority',
        },
        certificateRequests: {
            code: 'certificateRequests',
            label: 'Certificate Request',
        },
        certificates: {
            code: 'certificates',
            label: 'Certificate',
        },
        complianceProfiles: {
            code: 'complianceProfiles',
            label: 'Compliance Profile',
        },
        searchFilters: {
            code: 'searchFilters',
            label: 'Search Filter',
        },
        conditions: {
            code: 'conditions',
            label: 'Condition',
        },
        acmeAccounts: {
            code: 'acmeAccounts',
            label: 'ACME Account',
        },
        actions: {
            code: 'actions',
            label: 'Action',
        },
        notifications: {
            code: 'notifications',
            label: 'Notification',
        },
        customAttributes: {
            code: 'customAttributes',
            label: 'Custom Attribute',
        },
        scepProfiles: {
            code: 'scepProfiles',
            label: 'SCEP Profile',
        },
        credentials: {
            code: 'credentials',
            label: 'Credential',
        },
        keys: {
            code: 'keys',
            label: 'Key',
        },
        roles: {
            code: 'roles',
            label: 'Role',
        },
        acmeAuthorizations: {
            code: 'acmeAuthorizations',
            label: 'ACME Authorization',
        },
        ANY: {
            code: 'ANY',
            label: 'Any',
        },
        auditLogs: {
            code: 'auditLogs',
            label: 'Audit logs',
        },
        acmeChallenges: {
            code: 'acmeChallenges',
            label: 'ACME Challenge',
        },
        authenticationProviders: {
            code: 'authenticationProviders',
            label: 'Authentication Provider',
        },
        tokens: {
            code: 'tokens',
            label: 'Token',
        },
        cmpTransactions: {
            code: 'cmpTransactions',
            label: 'CMP Transaction',
        },
        oids: {
            code: 'oids',
            label: 'OID',
        },
        acmeProfiles: {
            code: 'acmeProfiles',
            label: 'ACME Profile',
        },
        jobs: {
            code: 'jobs',
            label: 'Scheduled job',
        },
        groups: {
            code: 'groups',
            label: 'Group',
        },
        resources: {
            code: 'resources',
            label: 'Resource',
        },
        complianceRules: {
            code: 'complianceRules',
            label: 'Compliance Rule',
        },
        executions: {
            code: 'executions',
            label: 'Execution',
        },
        discoveries: {
            code: 'discoveries',
            label: 'Discovery',
        },
        entities: {
            code: 'entities',
            label: 'Entity',
        },
        tokenProfiles: {
            code: 'tokenProfiles',
            label: 'Token Profile',
        },
        attributes: {
            code: 'attributes',
            label: 'Attribute',
        },
        locations: {
            code: 'locations',
            label: 'Location',
        },
        acmeOrders: {
            code: 'acmeOrders',
            label: 'ACME Order',
        },
        platformEnums: {
            code: 'platformEnums',
            label: 'Platform enumerator',
        },
    },
    ResourceAction: {
        issue: {
            code: 'issue',
            label: '',
            description: '',
        },
        sign: {
            code: 'sign',
            label: '',
            description: '',
        },
        update: {
            code: 'update',
            label: '',
            description: '',
        },
        revoke: {
            code: 'revoke',
            label: '',
            description: '',
        },
        archive: {
            code: 'archive',
            label: '',
            description: '',
        },
        ANY: {
            code: 'ANY',
            label: '',
            description: '',
        },
        list: {
            code: 'list',
            label: '',
            description: '',
        },
        activateAcme: {
            code: 'activateAcme',
            label: '',
            description: '',
        },
        delete: {
            code: 'delete',
            label: '',
            description: '',
        },
        checkCompliance: {
            code: 'checkCompliance',
            label: '',
            description: '',
        },
        enable: {
            code: 'enable',
            label: '',
            description: '',
        },
        approve: {
            code: 'approve',
            label: '',
            description: '',
        },
        encrypt: {
            code: 'encrypt',
            label: '',
            description: '',
        },
        members: {
            code: 'members',
            label: '',
            description: '',
        },
        activate: {
            code: 'activate',
            label: '',
            description: '',
        },
        create: {
            code: 'create',
            label: '',
            description: '',
        },
        rekey: {
            code: 'rekey',
            label: '',
            description: '',
        },
        verify: {
            code: 'verify',
            label: '',
            description: '',
        },
        detail: {
            code: 'detail',
            label: '',
            description: '',
        },
        renew: {
            code: 'renew',
            label: '',
            description: '',
        },
        NONE: {
            code: 'NONE',
            label: '',
            description: '',
        },
        decrypt: {
            code: 'decrypt',
            label: '',
            description: '',
        },
        export: {
            code: 'export',
            label: '',
            description: '',
        },
        connect: {
            code: 'connect',
            label: '',
            description: '',
        },
    },
    FilterConditionOperator: {
        NOT_MATCHES: {
            code: 'NOT_MATCHES',
            label: 'not matches',
        },
        COUNT_LESS_THAN: {
            code: 'COUNT_LESS_THAN',
            label: 'count less than',
        },
        SUCCESS: {
            code: 'SUCCESS',
            label: 'success',
        },
        EQUALS: {
            code: 'EQUALS',
            label: 'equals',
        },
        STARTS_WITH: {
            code: 'STARTS_WITH',
            label: 'starts with',
        },
        COUNT_NOT_EQUAL: {
            code: 'COUNT_NOT_EQUAL',
            label: 'count not equals',
        },
        LESSER: {
            code: 'LESSER',
            label: 'lesser than',
        },
        NOT_EQUALS: {
            code: 'NOT_EQUALS',
            label: 'not equals',
        },
        GREATER: {
            code: 'GREATER',
            label: 'greater than',
        },
        LESSER_OR_EQUAL: {
            code: 'LESSER_OR_EQUAL',
            label: 'lesser than or equal',
        },
        CONTAINS: {
            code: 'CONTAINS',
            label: 'contains',
        },
        IN_PAST: {
            code: 'IN_PAST',
            label: 'in past',
        },
        COUNT_GREATER_THAN: {
            code: 'COUNT_GREATER_THAN',
            label: 'count greater than',
        },
        IN_NEXT: {
            code: 'IN_NEXT',
            label: 'in next',
        },
        NOT_CONTAINS: {
            code: 'NOT_CONTAINS',
            label: 'not contains',
        },
        NOT_EMPTY: {
            code: 'NOT_EMPTY',
            label: 'not empty',
        },
        GREATER_OR_EQUAL: {
            code: 'GREATER_OR_EQUAL',
            label: 'greater than or equal',
        },
        FAILED: {
            code: 'FAILED',
            label: 'failed',
        },
        ENDS_WITH: {
            code: 'ENDS_WITH',
            label: 'ends with',
        },
        COUNT_EQUAL: {
            code: 'COUNT_EQUAL',
            label: 'count equals',
        },
        MATCHES: {
            code: 'MATCHES',
            label: 'matches',
        },
        UNKNOWN: {
            code: 'UNKNOWN',
            label: 'unknown',
        },
        EMPTY: {
            code: 'EMPTY',
            label: 'empty',
        },
        NOT_CHECKED: {
            code: 'NOT_CHECKED',
            label: 'not checked',
        },
    },
    FilterFieldType: {
        date: {
            code: 'date',
            label: 'Date',
        },
        number: {
            code: 'number',
            label: 'Number',
        },
        datetime: {
            code: 'datetime',
            label: 'DateTime',
        },
        boolean: {
            code: 'boolean',
            label: 'Boolean',
        },
        string: {
            code: 'string',
            label: 'String',
        },
        list: {
            code: 'list',
            label: 'List',
        },
    },
    FilterFieldSource: {
        data: {
            code: 'data',
            label: 'Data attribute',
        },
        meta: {
            code: 'meta',
            label: 'Metadata',
        },
        custom: {
            code: 'custom',
            label: 'Custom attribute',
        },
        property: {
            code: 'property',
            label: 'Property',
        },
    },
    SettingsSection: {
        logging: {
            code: 'logging',
            label: 'Logging',
            description: 'CZERTAINLY logging settings',
        },
        platform: {
            code: 'platform',
            label: 'Platform',
            description: 'CZERTAINLY platform settings',
        },
        events: {
            code: 'events',
            label: 'Events',
            description: 'CZERTAINLY events settings',
        },
        authentication: {
            code: 'authentication',
            label: 'Authentication',
            description: 'CZERTAINLY authentication settings',
        },
    },
    AuthType: {
        apiKey: {
            code: 'apiKey',
            label: 'API Key',
        },
        jwt: {
            code: 'jwt',
            label: 'JWT token',
        },
        certificate: {
            code: 'certificate',
            label: 'Certificate',
        },
        none: {
            code: 'none',
            label: 'None',
        },
        basic: {
            code: 'basic',
            label: 'Basic',
        },
    },
    HealthStatus: {
        nok: {
            code: 'nok',
            label: 'OFF',
        },
        ok: {
            code: 'ok',
            label: 'ON',
        },
        unknown: {
            code: 'unknown',
            label: 'Unknown',
        },
    },
    ConnectorStatus: {
        connected: {
            code: 'connected',
            label: 'Connected',
        },
        offline: {
            code: 'offline',
            label: 'Offline',
        },
        waitingForApproval: {
            code: 'waitingForApproval',
            label: 'Waiting for approval',
        },
        failed: {
            code: 'failed',
            label: 'Failed',
        },
    },
    FunctionGroupCode: {
        authorityProvider: {
            code: 'authorityProvider',
            label: 'Authority Provider',
        },
        entityProvider: {
            code: 'entityProvider',
            label: 'Entity Provider',
        },
        credentialProvider: {
            code: 'credentialProvider',
            label: 'Credential Provider',
        },
        complianceProviderV2: {
            code: 'complianceProviderV2',
            label: 'Compliance Provider V2',
        },
        legacyAuthorityProvider: {
            code: 'legacyAuthorityProvider',
            label: 'Legacy Authority Provider',
        },
        cryptographyProvider: {
            code: 'cryptographyProvider',
            label: 'Cryptography Provider',
        },
        discoveryProvider: {
            code: 'discoveryProvider',
            label: 'Discovery Provider',
        },
        notificationProvider: {
            code: 'notificationProvider',
            label: 'Notification Provider',
        },
        complianceProvider: {
            code: 'complianceProvider',
            label: 'Compliance Provider',
        },
    },
    CertificateType: {
        'X.509': {
            code: 'X.509',
            label: 'X.509',
        },
        SSH: {
            code: 'SSH',
            label: 'SSH',
        },
    },
    CertificateState: {
        requested: {
            code: 'requested',
            label: 'Requested',
        },
        rejected: {
            code: 'rejected',
            label: 'Rejected',
        },
        failed: {
            code: 'failed',
            label: 'Failed',
            description: 'Issue action failed',
        },
        issued: {
            code: 'issued',
            label: 'Issued',
        },
        revoked: {
            code: 'revoked',
            label: 'Revoked',
        },
        pending_issue: {
            code: 'pending_issue',
            label: 'Pending issue',
            description: 'Issue action pending (CA approval)',
        },
        pending_revoke: {
            code: 'pending_revoke',
            label: 'Pending revoke',
            description: 'Revoke action pending (CA approval)',
        },
        pending_approval: {
            code: 'pending_approval',
            label: 'Pending approval',
        },
    },
    CertificateValidationStatus: {
        valid: {
            code: 'valid',
            label: 'Valid',
        },
        expiring: {
            code: 'expiring',
            label: 'Expiring',
        },
        inactive: {
            code: 'inactive',
            label: 'Inactive',
        },
        expired: {
            code: 'expired',
            label: 'Expired',
        },
        not_checked: {
            code: 'not_checked',
            label: 'Not checked',
        },
        invalid: {
            code: 'invalid',
            label: 'Invalid',
        },
        failed: {
            code: 'failed',
            label: 'Failed',
        },
        revoked: {
            code: 'revoked',
            label: 'Revoked',
        },
    },
    CertificateFormat: {
        pkcs7: {
            code: 'pkcs7',
            label: 'PKCS#7',
            description: 'PKCS#7 certificate format',
        },
        raw: {
            code: 'raw',
            label: 'Raw',
            description: 'Raw certificate format, extension based on encoding',
        },
    },
    CertificateFormatEncoding: {
        der: {
            code: 'der',
            label: 'DER',
            description: 'DER certificate format encoding',
        },
        pem: {
            code: 'pem',
            label: 'PEM',
            description: 'PEM certificate format encoding',
        },
    },
    CertificateValidationCheck: {
        certificate_validity: {
            code: 'certificate_validity',
            label: 'Certificate Validity',
        },
        key_usage: {
            code: 'key_usage',
            label: 'Certificate Key Usage',
        },
        signature: {
            code: 'signature',
            label: 'Signature Verification',
        },
        ocsp_verification: {
            code: 'ocsp_verification',
            label: 'OCSP Verification',
        },
        crl_verification: {
            code: 'crl_verification',
            label: 'CRL Verification',
        },
        basic_constraints: {
            code: 'basic_constraints',
            label: 'Basic Constraints',
        },
        certificate_chain: {
            code: 'certificate_chain',
            label: 'Certificate chain',
        },
    },
    CertificateRevocationReason: {
        keyCompromise: {
            code: 'keyCompromise',
            label: 'Key compromise',
        },
        cACompromise: {
            code: 'cACompromise',
            label: 'CA compromise',
        },
        unspecified: {
            code: 'unspecified',
            label: 'Unspecified',
        },
        affiliationChanged: {
            code: 'affiliationChanged',
            label: 'Affiliation changed',
        },
        cessationOfOperation: {
            code: 'cessationOfOperation',
            label: 'Cessation of operation',
        },
        superseded: {
            code: 'superseded',
            label: 'Superseded',
        },
        privilegeWithdrawn: {
            code: 'privilegeWithdrawn',
            label: 'Privilege withdrawn',
        },
        aACompromise: {
            code: 'aACompromise',
            label: 'AA compromise',
        },
        certificateHold: {
            code: 'certificateHold',
            label: 'Certificate hold',
        },
    },
    CertificateRequestFormat: {
        crmf: {
            code: 'crmf',
            label: 'CRMF',
            description: 'Certificate Request Message Format',
        },
        pkcs10: {
            code: 'pkcs10',
            label: 'PKCS#10',
            description: 'PKCS#10 Certificate Request',
        },
    },
    DiscoveryStatus: {
        inProgress: {
            code: 'inProgress',
            label: 'In Progress',
        },
        processing: {
            code: 'processing',
            label: 'Processing',
        },
        warning: {
            code: 'warning',
            label: 'Warning',
        },
        failed: {
            code: 'failed',
            label: 'Failed',
        },
        completed: {
            code: 'completed',
            label: 'Completed',
        },
    },
    CertificateProtocol: {
        acme: {
            code: 'acme',
            label: 'ACME Protocol',
        },
        cmp: {
            code: 'cmp',
            label: 'CMP Protocol',
        },
        scep: {
            code: 'scep',
            label: 'SCEP Protocol',
        },
    },
    CertificateSubjectType: {
        selfSignedEndEntity: {
            code: 'selfSignedEndEntity',
            label: 'Self-signed End Entity',
            description: 'Certificate signed by itself, not issued by certificate authority.',
        },
        intermediateCa: {
            code: 'intermediateCa',
            label: 'Intermediate CA',
            description:
                'Certificate of certificate authority that is used to issue end entity certificate and isn’t the top of the chain authority.',
        },
        rootCa: {
            code: 'rootCa',
            label: 'Root CA',
            description: 'Certificate of the top of the chain certificate authority.',
        },
        endEntity: {
            code: 'endEntity',
            label: 'End Entity',
            description: 'Certificate issued by a Certificate Authority.',
        },
    },
    CertificateKeyUsage: {
        keyEncipherment: {
            code: 'keyEncipherment',
            label: 'Key Encipherment',
            description: '',
        },
        decipherOnly: {
            code: 'decipherOnly',
            label: 'Decipher Only',
            description: '',
        },
        nonRepudiation: {
            code: 'nonRepudiation',
            label: 'Non Repudiation',
            description: '',
        },
        encipherOnly: {
            code: 'encipherOnly',
            label: 'Encipher Only',
            description: '',
        },
        digitalSignature: {
            code: 'digitalSignature',
            label: 'Digital Signature',
            description: '',
        },
        cRLSign: {
            code: 'cRLSign',
            label: 'CRL Sign',
            description: '',
        },
        keyAgreement: {
            code: 'keyAgreement',
            label: 'Key Agreement',
            description: '',
        },
        dataEncipherment: {
            code: 'dataEncipherment',
            label: 'Data Encipherment',
            description: '',
        },
        keyCertSign: {
            code: 'keyCertSign',
            label: 'Key Cert Sign',
            description: '',
        },
    },
    CertificateRelationType: {
        renewal: {
            code: 'renewal',
            label: 'Renewal',
            description: 'Successor certificate is renewal of predecessor certificate',
        },
        pending: {
            code: 'pending',
            label: 'Pending',
            description: 'The relation type is to be decided after successor certificate is issued',
        },
        rekey: {
            code: 'rekey',
            label: 'Rekey',
            description: 'Successor certificate is rekey of predecessor certificate',
        },
        replacement: {
            code: 'replacement',
            label: 'Replacement',
            description: 'Successor certificate is replacement of predecessor certificate',
        },
    },
    OidCategory: {
        extendedKeyUsage: {
            code: 'extendedKeyUsage',
            label: 'Extended Key Usage',
            description: 'OID specifying key purpose in Extended Key Usage extension',
        },
        rdnAttributeType: {
            code: 'rdnAttributeType',
            label: 'RDN Attribute Type',
            description: 'OID for a type of attribute that can appear in DN',
        },
        generic: {
            code: 'generic',
            label: 'Generic',
            description: 'Generic OID for general use',
        },
    },
    KeyAlgorithm: {
        RSA: {
            code: 'RSA',
            label: 'RSA',
            description: 'Rivest–Shamir–Adleman',
        },
        'SPHINCS+': {
            code: 'SPHINCS+',
            label: 'SPHINCS+',
            description: 'Post-quantum stateless hash-based signature scheme',
        },
        Unknown: {
            code: 'Unknown',
            label: 'Unknown',
            description: 'Key algorithm not recognized',
        },
        'SLH-DSA': {
            code: 'SLH-DSA',
            label: 'SLH-DSA',
            description: 'Post-quantum stateless hash-based digital signature scheme standardized by NIST, also known as SPHINCS+',
        },
        'CRYSTALS-Dilithium': {
            code: 'CRYSTALS-Dilithium',
            label: 'CRYSTALS-Dilithium',
            description: 'Post-quantum lattice-based signature scheme',
        },
        FALCON: {
            code: 'FALCON',
            label: 'FALCON',
            description: 'Fast Fourier lattice-based compact signatures over NTRU',
        },
        'ML-KEM': {
            code: 'ML-KEM',
            label: 'ML-KEM',
            description:
                'Post-quantum Module-Lattice-Based Key-Encapsulation mechanism and the primary KEM standardized by NIST, also known as CRYSTALS-Kyber',
        },
        'ML-DSA': {
            code: 'ML-DSA',
            label: 'ML-DSA',
            description:
                'Post-quantum Module-Lattice-Based digital signature algorithm standardized by NIST, also known as CRYSTALS-Dilithium',
        },
        ECDSA: {
            code: 'ECDSA',
            label: 'ECDSA',
            description: 'Elliptic Curve Digital Signature Algorithm',
        },
    },
    KeyFormat: {
        Raw: {
            code: 'Raw',
            label: 'Raw',
            description: 'Encoded key in raw format',
        },
        EncryptedPrivateKeyInfo: {
            code: 'EncryptedPrivateKeyInfo',
            label: 'EncryptedPrivateKeyInfo',
            description: 'DER-encoded ASN.1 EncryptedPrivateKeyInfo of the private key',
        },
        Custom: {
            code: 'Custom',
            label: 'Custom',
            description: 'Custom, external, specific data',
        },
        SubjectPublicKeyInfo: {
            code: 'SubjectPublicKeyInfo',
            label: 'SubjectPublicKeyInfo',
            description: 'DER-encoded ASN.1 SubjectPublicKeyInfo of the public key',
        },
        PrivateKeyInfo: {
            code: 'PrivateKeyInfo',
            label: 'PrivateKeyInfo',
            description: 'DER-encoded ASN.1 PrivateKeyInfo of the private key',
        },
    },
    KeyState: {
        destroyed: {
            code: 'destroyed',
            label: 'Destroyed',
        },
        'pre-active': {
            code: 'pre-active',
            label: 'Pre-active',
        },
        active: {
            code: 'active',
            label: 'Active',
        },
        compromised: {
            code: 'compromised',
            label: 'Compromised',
        },
        deactivated: {
            code: 'deactivated',
            label: 'Deactivated',
        },
        destroyedCompromised: {
            code: 'destroyedCompromised',
            label: 'Destroyed Compromised',
        },
    },
    KeyType: {
        Secret: {
            code: 'Secret',
            label: 'Secret key',
            description: 'Symmetric secret key',
        },
        Private: {
            code: 'Private',
            label: 'Private key',
            description: 'Asymmetric private key',
        },
        Public: {
            code: 'Public',
            label: 'Public key',
            description: 'Asymmetric public key',
        },
        Split: {
            code: 'Split',
            label: 'Split key',
            description: 'Secret or private key split into parts',
        },
    },
    KeyUsage: {
        encrypt: {
            code: 'encrypt',
            label: 'Encrypt',
            description:
                'Allow for encryption. Applies to Encrypt operation. Valid for PGP Key, Private Key, Public Key and Symmetric Key. Encryption for the purpose of wrapping is separate Wrap Key value.',
        },
        sign: {
            code: 'sign',
            label: 'Sign',
            description: 'Allow for signing. Applies to Sign operation. Valid for PGP Key, Private Key',
        },
        verify: {
            code: 'verify',
            label: 'Verify',
            description:
                'Allow for signature verification. Applies to Signature Verify and Validate operations. Valid for PGP Key, Certificate and Public Key.',
        },
        decrypt: {
            code: 'decrypt',
            label: 'Decrypt',
            description:
                'Allow for decryption. Applies to Decrypt operation. Valid for PGP Key, Private Key, Public Key and Symmetric Key. Decryption for the purpose of unwrapping is separate Unwrap Key value.',
        },
        wrap: {
            code: 'wrap',
            label: 'Wrap key',
            description:
                'Allow for key wrapping. Applies to Get operation when wrapping is required by Wrapping Specification is provided on the object used to Wrap. Valid for PGP Key, Private Key and Symmetric Key. Note: even if the underlying wrapping mechanism is encryption, this value is logically separate.',
        },
        unwrap: {
            code: 'unwrap',
            label: 'Unwrap key',
            description:
                'Allow for key unwrapping. Applies to Get operation when unwrapping is required on the object used to Unwrap.  Valid for PGP Key, Private Key, Public Key and Symmetric Key. Not interchangeable with Decrypt. Note: even if the underlying unwrapping mechanism is decryption, this value is logically separate.',
        },
    },
    KeyRequestType: {
        keyPair: {
            code: 'keyPair',
            label: 'Key pair',
        },
        secret: {
            code: 'secret',
            label: 'Secret key',
        },
    },
    KeyCompromiseReason: {
        disclosure: {
            code: 'disclosure',
            label: 'Unauthorized disclosure',
        },
        substitution: {
            code: 'substitution',
            label: 'Unauthorized substitution',
        },
        modification: {
            code: 'modification',
            label: 'Unauthorized modification',
        },
        use_of_sensitive_data: {
            code: 'use_of_sensitive_data',
            label: 'Unauthorized use of sensitive data',
        },
    },
    TokenInstanceStatus: {
        Activated: {
            code: 'Activated',
            label: 'Activated',
        },
        Warning: {
            code: 'Warning',
            label: 'Warning',
        },
        Unknown: {
            code: 'Unknown',
            label: 'Unknown',
        },
        Connected: {
            code: 'Connected',
            label: 'Connected',
        },
        Deactivated: {
            code: 'Deactivated',
            label: 'Deactivated',
        },
        Disconnected: {
            code: 'Disconnected',
            label: 'Disconnected',
        },
    },
    DigestAlgorithm: {
        'SHA3-512': {
            code: 'SHA3-512',
            label: 'SHA3-512',
            description: 'Secure hash algorithm 3 with digest length of 512 bits',
        },
        'SHA-1': {
            code: 'SHA-1',
            label: 'SHA-1',
            description: 'Secure hash algorithm 1',
        },
        'SHA-384': {
            code: 'SHA-384',
            label: 'SHA-384',
            description: 'Secure hash algorithm 2 with digest length of 384 bits',
        },
        'SHA-224': {
            code: 'SHA-224',
            label: 'SHA-224',
            description: 'Secure hash algorithm 2 with digest length of 224 bits',
        },
        'SHA3-384': {
            code: 'SHA3-384',
            label: 'SHA3-384',
            description: 'Secure hash algorithm 3 with digest length of 384 bits',
        },
        'SHA-256': {
            code: 'SHA-256',
            label: 'SHA-256',
            description: 'Secure hash algorithm 2 with digest length of 256 bits',
        },
        'SHA3-256': {
            code: 'SHA3-256',
            label: 'SHA3-256',
            description: 'Secure hash algorithm 3 with digest length of 256 bits',
        },
        'SHA-512': {
            code: 'SHA-512',
            label: 'SHA-512',
            description: 'Secure hash algorithm 2 with digest length of 512 bits',
        },
        MD5: {
            code: 'MD5',
            label: 'MD5',
            description: 'Message Digest algorithm',
        },
    },
    RsaSignatureScheme: {
        PSS: {
            code: 'PSS',
            label: 'PSS',
            description: 'Probabilistic RSA signature scheme',
        },
        'PKCS1-v1_5': {
            code: 'PKCS1-v1_5',
            label: 'PKCS#1 v1.5',
            description: 'Deterministic RSA signature scheme',
        },
    },
    RsaEncryptionScheme: {
        'PKCS1-v1_5': {
            code: 'PKCS1-v1_5',
            label: 'PKCS#1 v1.5',
            description: 'Deterministic RSA encryption scheme',
        },
        OAEP: {
            code: 'OAEP',
            label: 'OAEP',
            description: 'Optimal Asymmetric Encryption Padding',
        },
    },
    ComplianceStatus: {
        na: {
            code: 'na',
            label: 'Not Applicable',
        },
        not_checked: {
            code: 'not_checked',
            label: 'Not checked',
        },
        nok: {
            code: 'nok',
            label: 'Not Compliant',
        },
        failed: {
            code: 'failed',
            label: 'Failed',
        },
        ok: {
            code: 'ok',
            label: 'Compliant',
        },
    },
    ComplianceRuleStatus: {
        na: {
            code: 'na',
            label: 'Not Applicable',
        },
        not_available: {
            code: 'not_available',
            label: 'Not Available',
        },
        nok: {
            code: 'nok',
            label: 'Not Compliant',
        },
        ok: {
            code: 'ok',
            label: 'Compliant',
        },
    },
    AccountStatus: {
        valid: {
            code: 'valid',
            label: 'Valid',
        },
        revoked: {
            code: 'revoked',
            label: 'Revoked',
        },
        deactivated: {
            code: 'deactivated',
            label: 'Deactivated',
        },
    },
    ProtectionMethod: {
        signature: {
            code: 'signature',
            label: 'Signature',
        },
        sharedSecret: {
            code: 'sharedSecret',
            label: 'Shared Secret',
        },
    },
    CmpProfileVariant: {
        v2_3gpp: {
            code: 'v2_3gpp',
            label: 'CMPv2 3GPP',
            description: '3GPP implementation based on CMPv2',
        },
        v2: {
            code: 'v2',
            label: 'CMPv2',
            description: 'Implementation of RFC 4210 and RFC 4211 (CMP version 2)',
        },
        v3: {
            code: 'v3',
            label: 'CMPv3',
            description: 'Implementation of RFC 9483 (lightweight cmp protocol, CMP version 3)',
        },
    },
    AttributeType: {
        data: {
            code: 'data',
            label: 'Data',
        },
        meta: {
            code: 'meta',
            label: 'Metadata',
        },
        custom: {
            code: 'custom',
            label: 'Custom',
        },
        group: {
            code: 'group',
            label: 'Group',
        },
        info: {
            code: 'info',
            label: 'Info',
        },
    },
    AttributeContentType: {
        date: {
            code: 'date',
            label: 'Date',
        },
        string: {
            code: 'string',
            label: 'String',
        },
        integer: {
            code: 'integer',
            label: 'Integer number',
        },
        secret: {
            code: 'secret',
            label: 'Secret',
        },
        float: {
            code: 'float',
            label: 'Decimal number',
        },
        datetime: {
            code: 'datetime',
            label: 'DateTime',
        },
        boolean: {
            code: 'boolean',
            label: 'Boolean',
        },
        file: {
            code: 'file',
            label: 'File',
        },
        credential: {
            code: 'credential',
            label: 'Credential',
        },
        codeblock: {
            code: 'codeblock',
            label: 'Code block',
        },
        text: {
            code: 'text',
            label: 'Text',
        },
        time: {
            code: 'time',
            label: 'Time',
        },
        object: {
            code: 'object',
            label: 'Object',
        },
    },
    AttributeConstraintType: {
        dateTime: {
            code: 'dateTime',
            label: 'DateTime Range',
        },
        range: {
            code: 'range',
            label: 'Integer Range',
        },
        regExp: {
            code: 'regExp',
            label: 'Regular Expression',
        },
    },
    AttributeValueTarget: {
        pathVariable: {
            code: 'pathVariable',
            label: 'Path variable',
        },
        requestParameter: {
            code: 'requestParameter',
            label: 'Request parameter',
        },
        body: {
            code: 'body',
            label: 'Body property',
        },
    },
    ProgrammingLanguageEnum: {
        css: {
            code: 'css',
            label: 'CSS',
        },
        latex: {
            code: 'latex',
            label: 'LaTeX',
        },
        docker: {
            code: 'docker',
            label: 'Dockerfile',
        },
        sql: {
            code: 'sql',
            label: 'SQL',
        },
        rust: {
            code: 'rust',
            label: 'Rust',
        },
        csharp: {
            code: 'csharp',
            label: 'C#',
        },
        git: {
            code: 'git',
            label: 'Git',
        },
        java: {
            code: 'java',
            label: 'Java',
        },
        xml: {
            code: 'xml',
            label: 'XML',
        },
        fsharp: {
            code: 'fsharp',
            label: 'F#',
        },
        powershell: {
            code: 'powershell',
            label: 'PowerShell',
        },
        makefile: {
            code: 'makefile',
            label: 'Makefile',
        },
        markdown: {
            code: 'markdown',
            label: 'Markdown',
        },
        json: {
            code: 'json',
            label: 'JSON',
        },
        html: {
            code: 'html',
            label: 'HTML',
        },
        perl: {
            code: 'perl',
            label: 'Perl',
        },
        typescript: {
            code: 'typescript',
            label: 'TypeScript',
        },
        gherkin: {
            code: 'gherkin',
            label: 'Gherkin',
        },
        graphql: {
            code: 'graphql',
            label: 'GraphQL',
        },
        vbnet: {
            code: 'vbnet',
            label: 'VB.NET',
        },
        yaml: {
            code: 'yaml',
            label: 'YAML',
        },
        matlab: {
            code: 'matlab',
            label: 'Matlab',
        },
        cpp: {
            code: 'cpp',
            label: 'C++',
        },
        python: {
            code: 'python',
            label: 'Python',
        },
        c: {
            code: 'c',
            label: 'C',
        },
        nginx: {
            code: 'nginx',
            label: 'Nginx conf',
        },
        xquery: {
            code: 'xquery',
            label: 'XQuery',
        },
        ini: {
            code: 'ini',
            label: 'Ini',
        },
        apacheconf: {
            code: 'apacheconf',
            label: 'ApacheConf',
        },
        go: {
            code: 'go',
            label: 'Go',
        },
        kotlin: {
            code: 'kotlin',
            label: 'Kotlin',
        },
        lisp: {
            code: 'lisp',
            label: 'Lisp',
        },
        objectivec: {
            code: 'objectivec',
            label: 'Objective C',
        },
        javascript: {
            code: 'javascript',
            label: 'JavaScript',
        },
        ruby: {
            code: 'ruby',
            label: 'Ruby',
        },
        http: {
            code: 'http',
            label: 'HTTP',
        },
        php: {
            code: 'php',
            label: 'PHP',
        },
        bash: {
            code: 'bash',
            label: 'Bash',
        },
        basic: {
            code: 'basic',
            label: 'Basic',
        },
        properties: {
            code: 'properties',
            label: 'Properties',
        },
        smalltalk: {
            code: 'smalltalk',
            label: 'Smalltalk',
        },
    },
    SchedulerJobExecutionStatus: {
        started: {
            code: 'started',
            label: 'Started',
        },
        failed: {
            code: 'failed',
            label: 'Failed',
        },
        succeeded: {
            code: 'succeeded',
            label: 'Succeeded',
        },
    },
    RecipientType: {
        owner: {
            code: 'owner',
            label: 'Owner',
            description: 'Recipient is user that is associated as owner of resource object that is connected with notification',
        },
        default: {
            code: 'default',
            label: 'Default',
            description: 'Default recipients are defined by context, e.g. by event and/or resource that is connected with notification',
        },
        role: {
            code: 'role',
            label: 'Role',
            description: 'Recipient is registered role',
        },
        none: {
            code: 'none',
            label: 'None',
            description: 'None recipient type describes that no specific recipient is required when used',
        },
        user: {
            code: 'user',
            label: 'User',
            description: 'Recipient is registered user',
        },
        group: {
            code: 'group',
            label: 'Group',
            description: 'Recipient is group from inventory',
        },
    },
    TriggerType: {
        event: {
            code: 'event',
            label: 'Event',
        },
        manual: {
            code: 'manual',
            label: 'Manual',
        },
    },
    ConditionType: {
        checkField: {
            code: 'checkField',
            label: 'Check Field',
        },
    },
    ExecutionType: {
        setField: {
            code: 'setField',
            label: 'Set field',
            description: 'Set a field of the resource',
        },
        sendNotification: {
            code: 'sendNotification',
            label: 'Send notification',
            description: 'Send a notification based on notification profile',
        },
    },
    ResourceEvent: {
        approval_requested: {
            code: 'approval_requested',
            label: 'Approval requested',
            description: 'Event about requesting approval on specific operation defined by current approval step',
        },
        scheduled_job_finished: {
            code: 'scheduled_job_finished',
            label: 'Scheduled job finished',
            description: 'Notification about scheduled job execution finished with result and detail of its execution',
        },
        certificate_status_changed: {
            code: 'certificate_status_changed',
            label: 'Certificate validation status changed',
            description: 'Event when the certificate changes validation status with detail about the certificate',
        },
        approval_closed: {
            code: 'approval_closed',
            label: 'Approval closed',
            description: 'Event after approval was closed informing about the result of approval process',
        },
        certificate_action_performed: {
            code: 'certificate_action_performed',
            label: 'Certificate action performed',
            description:
                'Event after certificate action (e.g.: issue, renew, rekey, revoke, etc.) was completed with detail about its execution',
        },
        certificate_expiring: {
            code: 'certificate_expiring',
            label: 'Certificate expiring',
            description: 'Event to trigger actions associated with expiring certificates without renewal',
        },
        discovery_finished: {
            code: 'discovery_finished',
            label: 'Discovery Finished',
            description: 'Event when discovery has been finished.',
        },
        certificate_discovered: {
            code: 'certificate_discovered',
            label: 'Certificate discovered',
            description: 'Event when the certificate has been newly discovered by some discovery',
        },
    },
    Module: {
        scheduler: {
            code: 'scheduler',
            label: 'Scheduler',
            description: 'Scheduled jobs and tasks',
        },
        core: {
            code: 'core',
            label: 'Core',
            description: 'Core functionality including connectors, credentials and attributes',
        },
        certificates: {
            code: 'certificates',
            label: 'Certificates',
            description: 'Certificates management and operations',
        },
        auth: {
            code: 'auth',
            label: 'Auth',
            description: 'Authentication and authorization module',
        },
        entities: {
            code: 'entities',
            label: 'Entities',
            description: 'Entities and locations management',
        },
        keys: {
            code: 'keys',
            label: 'Cryptographic keys',
            description: 'Cryptographic keys management and operations',
        },
        compliance: {
            code: 'compliance',
            label: 'Compliance',
        },
        discovery: {
            code: 'discovery',
            label: 'Discovery',
            description: 'Discovery of different resources',
        },
        approvals: {
            code: 'approvals',
            label: 'Approvals',
        },
        workflows: {
            code: 'workflows',
            label: 'Workflows',
            description: 'Workflows management',
        },
        protocols: {
            code: 'protocols',
            label: 'Protocols',
            description: 'Protocols management and operations',
        },
    },
    ActorType: {
        core: {
            code: 'core',
            label: 'Core',
        },
        protocol: {
            code: 'protocol',
            label: 'Protocol',
        },
        connector: {
            code: 'connector',
            label: 'Connector',
        },
        anonymous: {
            code: 'anonymous',
            label: 'Anonymous',
        },
        user: {
            code: 'user',
            label: 'User',
        },
    },
    AuthMethod: {
        apiKey: {
            code: 'apiKey',
            label: 'API Key',
        },
        session: {
            code: 'session',
            label: 'Session',
        },
        certificate: {
            code: 'certificate',
            label: 'Certificate',
        },
        none: {
            code: 'none',
            label: 'None',
        },
        userProxy: {
            code: 'userProxy',
            label: 'User proxy',
        },
        token: {
            code: 'token',
            label: 'Token',
        },
    },
    Operation: {
        upload: {
            code: 'upload',
            label: 'Upload',
        },
        pushToLocation: {
            code: 'pushToLocation',
            label: 'Push to location',
        },
        sign: {
            code: 'sign',
            label: 'Sign',
        },
        checkValidation: {
            code: 'checkValidation',
            label: 'Check validation',
        },
        getStatus: {
            code: 'getStatus',
            label: 'Get status',
        },
        renewInLocation: {
            code: 'renewInLocation',
            label: 'Renew in location',
        },
        associate: {
            code: 'associate',
            label: 'Associate',
        },
        deactivate: {
            code: 'deactivate',
            label: 'Deactivate',
        },
        markAsRead: {
            code: 'markAsRead',
            label: 'Mark as read',
        },
        listCas: {
            code: 'listCas',
            label: 'List CAs',
        },
        download: {
            code: 'download',
            label: 'Download',
        },
        logout: {
            code: 'logout',
            label: 'Logout',
        },
        rejectOverride: {
            code: 'rejectOverride',
            label: 'Reject override',
        },
        removeFromLocation: {
            code: 'removeFromLocation',
            label: 'Remove from location',
        },
        enable: {
            code: 'enable',
            label: 'Enable',
        },
        acmeDirectory: {
            code: 'acmeDirectory',
            label: 'ACME directory',
        },
        create: {
            code: 'create',
            label: 'Create',
        },
        scepCaCapabilities: {
            code: 'scepCaCapabilities',
            label: 'SCEP CA Capabilities',
        },
        export: {
            code: 'export',
            label: 'Export',
        },
        add: {
            code: 'add',
            label: 'Add',
        },
        promoteMetadata: {
            code: 'promoteMetadata',
            label: 'Promote metadata',
        },
        issue: {
            code: 'issue',
            label: 'Issue',
        },
        updateAttributeContent: {
            code: 'updateAttributeContent',
            label: 'Update attribute content',
        },
        getPermissions: {
            code: 'getPermissions',
            label: 'Get permissions',
        },
        destroy: {
            code: 'destroy',
            label: 'Destroy',
        },
        listAttributes: {
            code: 'listAttributes',
            label: 'List attributes',
        },
        validateAttributes: {
            code: 'validateAttributes',
            label: 'Validate attributes',
        },
        listRules: {
            code: 'listRules',
            label: 'List rules',
        },
        archive: {
            code: 'archive',
            label: 'Archive certificate',
        },
        history: {
            code: 'history',
            label: 'History',
        },
        checkHealth: {
            code: 'checkHealth',
            label: 'Check health',
        },
        list: {
            code: 'list',
            label: 'List',
        },
        sync: {
            code: 'sync',
            label: 'Sync',
        },
        listCertificateProfiles: {
            code: 'listCertificateProfiles',
            label: 'List Certificate profiles',
        },
        getComplianceResult: {
            code: 'getComplianceResult',
            label: 'Get compliance result',
        },
        acmeKeyRollover: {
            code: 'acmeKeyRollover',
            label: 'ACME key rollover',
        },
        updateAttributeResources: {
            code: 'updateAttributeResources',
            label: 'Update attribute resources',
        },
        acmeNonce: {
            code: 'acmeNonce',
            label: 'ACME nonce',
        },
        approveOverride: {
            code: 'approveOverride',
            label: 'Approve override',
        },
        activate: {
            code: 'activate',
            label: 'Activate',
        },
        rekey: {
            code: 'rekey',
            label: 'Rekey',
        },
        activateProtocol: {
            code: 'activateProtocol',
            label: 'Activate protocol',
        },
        updateObjectPermissions: {
            code: 'updateObjectPermissions',
            label: 'Update object permissions',
        },
        detail: {
            code: 'detail',
            label: 'Detail',
        },
        getObjectPermissions: {
            code: 'getObjectPermissions',
            label: 'Get object permissions',
        },
        acmeFinalize: {
            code: 'acmeFinalize',
            label: 'ACME finalize',
        },
        deactivateProtocol: {
            code: 'deactivateProtocol',
            label: 'Deactivate protocol',
        },
        request: {
            code: 'request',
            label: 'Request',
        },
        updateKeyUsage: {
            code: 'updateKeyUsage',
            label: 'Update key usage',
        },
        attributeCallback: {
            code: 'attributeCallback',
            label: 'Attribute callback',
        },
        getContent: {
            code: 'getContent',
            label: 'Get content',
        },
        update: {
            code: 'update',
            label: 'Update',
        },
        revoke: {
            code: 'revoke',
            label: 'Revoke',
        },
        getChain: {
            code: 'getChain',
            label: 'Get chain',
        },
        login: {
            code: 'login',
            label: 'Login',
        },
        deleteAttributeContent: {
            code: 'deleteAttributeContent',
            label: 'Delete attribute content',
        },
        delete: {
            code: 'delete',
            label: 'Delete',
        },
        getAssociations: {
            code: 'getAssociations',
            label: 'Get associations',
        },
        remove: {
            code: 'remove',
            label: 'Remove',
        },
        getUserProfile: {
            code: 'getUserProfile',
            label: 'Get user profile',
        },
        unknown: {
            code: 'unknown',
            label: 'Unknown',
        },
        downloadChain: {
            code: 'downloadChain',
            label: 'Download chain',
        },
        randomData: {
            code: 'randomData',
            label: 'Generate random data',
        },
        scepCertificatePoll: {
            code: 'scepCertificatePoll',
            label: 'SCEP Certificate Poll',
        },
        forceDelete: {
            code: 'forceDelete',
            label: 'Force delete',
        },
        reconnect: {
            code: 'reconnect',
            label: 'Reconnect',
        },
        encrypt: {
            code: 'encrypt',
            label: 'Encrypt',
        },
        reject: {
            code: 'reject',
            label: 'Reject',
        },
        acmeValidate: {
            code: 'acmeValidate',
            label: 'ACME validate',
        },
        verify: {
            code: 'verify',
            label: 'Verify',
        },
        issueInLocation: {
            code: 'issueInLocation',
            label: 'Issue in location',
        },
        getProtocolInfo: {
            code: 'getProtocolInfo',
            label: 'Get protocol info',
        },
        connect: {
            code: 'connect',
            label: 'Connect',
        },
        listProtocolCertificates: {
            code: 'listProtocolCertificates',
            label: 'List protocol certificates',
        },
        authentication: {
            code: 'authentication',
            label: 'Authentication',
        },
        updatePermissions: {
            code: 'updatePermissions',
            label: 'Update permissions',
        },
        summary: {
            code: 'summary',
            label: 'Summary',
        },
        scepTransactionCheck: {
            code: 'scepTransactionCheck',
            label: 'SCEP Transaction check',
        },
        identify: {
            code: 'identify',
            label: 'Identify',
        },
        checkCompliance: {
            code: 'checkCompliance',
            label: 'Check compliance',
        },
        cmpConfirm: {
            code: 'cmpConfirm',
            label: 'CMP confirm',
        },
        disassociate: {
            code: 'disassociate',
            label: 'Disassociate',
        },
        schedule: {
            code: 'schedule',
            label: 'Schedule',
        },
        updateUserProfile: {
            code: 'updateUserProfile',
            label: 'Update user profile',
        },
        disable: {
            code: 'disable',
            label: 'Disable',
        },
        listAssociations: {
            code: 'listAssociations',
            label: 'List associations',
        },
        approve: {
            code: 'approve',
            label: 'Approve',
        },
        unarchive: {
            code: 'unarchive',
            label: 'Unarchive certificate',
        },
        renew: {
            code: 'renew',
            label: 'Renew',
        },
        updateProtocolIssueProfile: {
            code: 'updateProtocolIssueProfile',
            label: 'Update protocol issue profile',
        },
        decrypt: {
            code: 'decrypt',
            label: 'Decrypt',
        },
        compromise: {
            code: 'compromise',
            label: 'Compromise',
        },
        register: {
            code: 'register',
            label: 'Register',
        },
        statistics: {
            code: 'statistics',
            label: 'Statistics',
        },
    },
    OperationResult: {
        success: {
            code: 'success',
            label: 'Success',
        },
        failure: {
            code: 'failure',
            label: 'Failure',
        },
    },
    ApprovalStatusEnum: {
        Approved: {
            code: 'Approved',
            label: 'Approved',
            description: '',
        },
        Expired: {
            code: 'Expired',
            label: 'Expired',
            description: '',
        },
        Rejected: {
            code: 'Rejected',
            label: 'Rejected',
            description: '',
        },
        Pending: {
            code: 'Pending',
            label: 'Pending',
            description: '',
        },
    },
};
export const mockResourceList = [
    { resource: getEnumLabel(mockResourceEnum, 'raProfiles'), hasComplianceProfiles: true },
    { resource: getEnumLabel(mockResourceEnum, 'tokenProfiles'), hasComplianceProfiles: true },
];

export const mockRaProfilesList = [
    {
        uuid: '0be45e19-7392-4edf-9ac7-ecd0f9a7c7c0',
        name: 'SemikACME',
        description: '',
        authorityInstanceUuid: 'd1392319-f68e-4cd9-aad1-06ef6f10d6aa',
        authorityInstanceName: 'ejbca.3key.company',
        enabled: true,
        attributes: [],
        enabledProtocols: ['ACME'],
        certificateValidationSettings: {
            usePlatformSettings: true,
            enabled: false,
        },
    },
    {
        uuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        name: 'Custom',
        description: '',
        authorityInstanceName: 'adcs-lab02',
        enabled: false,
        attributes: [],
        enabledProtocols: ['ACME'],
        certificateValidationSettings: {
            usePlatformSettings: true,
            enabled: false,
        },
    },
];

export const mockTokenProfilesList = [
    {
        uuid: '0f442b85-a97c-41de-9ebe-75bae7176984',
        name: 'new-token-profile-from-2-15',
        description: '',
        tokenInstanceUuid: '94a09e50-b103-4077-9967-4582ca60e732',
        tokenInstanceName: 'test-token-1',
        tokenInstanceStatus: 'Deactivated',
        enabled: false,
        usages: [],
    },
    {
        uuid: '2f3cbd30-92f6-496b-aff7-c563e0364a9d',
        name: 'TestPQCTokenProfile',
        description: '',
        tokenInstanceUuid: '284f7065-669b-434d-9109-61319a52d2cb',
        tokenInstanceName: 'TestPQCToken',
        tokenInstanceStatus: 'Activated',
        enabled: true,
        usages: ['sign', 'verify', 'encrypt', 'decrypt', 'wrap', 'unwrap'],
    },
];
