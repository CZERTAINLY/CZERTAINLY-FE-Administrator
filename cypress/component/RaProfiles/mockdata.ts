export const mockRaProfile = {
    uuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
    name: 'Custom',
    description: '',
    enabled: false,
    attributes: [],
    customAttributes: [
        {
            uuid: '92de3778-d990-4d31-9b87-b0086882e2b2',
            name: 'textCustomAttrExecution',
            label: 'textCustomAttrExecution',
            type: 'custom',
            contentType: 'text',
            content: [
                {
                    data: 't2',
                },
            ],
        },
    ],
    certificateValidationSettings: {
        usePlatformSettings: true,
        enabled: false,
    },
};

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
        providerGroupsCount: 1,
        internalRulesCount: 3,
        associations: 5,
    },
];

export const mockAvailableComplianceProfileUuids = [
    '5431a4da-8332-479e-8dc9-74a07aebf5c0',
    '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
    '906729b1-cb4d-4c47-bee5-fe8999c8c716',
    '990e2793-fded-4b60-b259-11d29468f9c3',
    'f3cfa081-925a-452b-b503-e2f45ad3a4a0',
];

export const mockAssociatedComplianceProfiles = [
    {
        uuid: '5431a4da-8332-479e-8dc9-74a07aebf5c0',
        name: 'test-cmp-01',
        description: 'test-cmp-01',
        providerRulesCount: 2,
        providerGroupsCount: 3,
        internalRulesCount: 0,
        associations: 4,
    },
];
