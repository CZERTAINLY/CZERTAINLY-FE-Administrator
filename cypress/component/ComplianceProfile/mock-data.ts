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
                    description:
                        "https://support.apple.com/en-us/HT205280#:~:text=Apple's%20policy%20requires%20at%20least,extension%20or%20OCSP%20Stapling%3B%20or",
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
