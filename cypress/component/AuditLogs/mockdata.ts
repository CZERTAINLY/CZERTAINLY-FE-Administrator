export const mockAuditLogs = [
    //case has object name and uuid
    {
        id: 11462096,
        version: '1.1',
        loggedAt: '2025-09-29T08:46:19.572062Z',
        timestamp: '2025-09-29T08:46:19.567Z',
        module: 'compliance',
        actor: {
            type: 'user',
            authMethod: 'certificate',
            uuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
            name: 'czertainly-admin',
        },
        source: {
            method: 'DELETE',
            path: '/api/v2/complianceProfiles/6db02cd3-71c0-4b3f-be98-97d4bbd8320c/associations/raProfiles/c08e64f5-a98b-49df-908d-b3b26f50c145',
            ipAddress: '31.42.175.148',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
        resource: {
            type: 'complianceProfiles',
            objects: [
                {
                    name: 'test',
                    uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
                },
            ],
        },
        affiliatedResource: {
            type: 'complianceProfiles',
            objects: [
                {
                    name: 'Custom',
                    uuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
                },
            ],
        },
        operation: 'disassociate',
        operationResult: 'success',
        additionalData: {
            uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
            resource: 'raProfiles',
            associationObjectUuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        },
    },
    //case no objects
    {
        id: 21462096,
        version: '1.1',
        loggedAt: '2025-09-29T08:46:19.572062Z',
        timestamp: '2025-09-29T08:46:19.567Z',
        module: 'compliance',
        actor: {
            type: 'user',
            authMethod: 'certificate',
            uuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
            name: 'czertainly-admin',
        },
        source: {
            method: 'DELETE',
            path: '/api/v2/complianceProfiles/6db02cd3-71c0-4b3f-be98-97d4bbd8320c/associations/raProfiles/c08e64f5-a98b-49df-908d-b3b26f50c145',
            ipAddress: '31.42.175.148',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
        resource: {
            type: 'complianceProfiles',
        },
        affiliatedResource: {
            type: 'complianceProfiles',
        },
        operation: 'disassociate',
        operationResult: 'success',
        additionalData: {
            uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
            resource: 'raProfiles',
            associationObjectUuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        },
    },
    //case object - no name
    {
        id: 31462096,
        version: '1.1',
        loggedAt: '2025-09-29T08:46:19.572062Z',
        timestamp: '2025-09-29T08:46:19.567Z',
        module: 'compliance',
        actor: {
            type: 'user',
            authMethod: 'certificate',
            uuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
            name: 'czertainly-admin',
        },
        source: {
            method: 'DELETE',
            path: '/api/v2/complianceProfiles/6db02cd3-71c0-4b3f-be98-97d4bbd8320c/associations/raProfiles/c08e64f5-a98b-49df-908d-b3b26f50c145',
            ipAddress: '31.42.175.148',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
        resource: {
            type: 'complianceProfiles',
            objects: [
                {
                    uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
                },
            ],
        },
        affiliatedResource: {
            type: 'complianceProfiles',
            objects: [
                {
                    uuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
                },
            ],
        },
        operation: 'disassociate',
        operationResult: 'success',
        additionalData: {
            uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
            resource: 'raProfiles',
            associationObjectUuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        },
    },
    //case object - no uuid
    {
        id: 41462096,
        version: '1.1',
        loggedAt: '2025-09-29T08:46:19.572062Z',
        timestamp: '2025-09-29T08:46:19.567Z',
        module: 'compliance',
        actor: {
            type: 'user',
            authMethod: 'certificate',
            uuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
            name: 'czertainly-admin',
        },
        source: {
            method: 'DELETE',
            path: '/api/v2/complianceProfiles/6db02cd3-71c0-4b3f-be98-97d4bbd8320c/associations/raProfiles/c08e64f5-a98b-49df-908d-b3b26f50c145',
            ipAddress: '31.42.175.148',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
        resource: {
            type: 'complianceProfiles',
            objects: [
                {
                    name: 'test',
                },
            ],
        },
        affiliatedResource: {
            type: 'complianceProfiles',
            objects: [
                {
                    name: 'test',
                },
            ],
        },
        operation: 'disassociate',
        operationResult: 'success',
        additionalData: {
            uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
            resource: 'raProfiles',
            associationObjectUuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        },
    },
    // case when no mapping for resource type
    {
        id: 11462096,
        version: '1.1',
        loggedAt: '2025-09-29T08:46:19.572062Z',
        timestamp: '2025-09-29T08:46:19.567Z',
        module: 'compliance',
        actor: {
            type: 'user',
            authMethod: 'certificate',
            uuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
            name: 'czertainly-admin',
        },
        source: {
            method: 'DELETE',
            path: '/api/v2/complianceProfiles/6db02cd3-71c0-4b3f-be98-97d4bbd8320c/associations/raProfiles/c08e64f5-a98b-49df-908d-b3b26f50c145',
            ipAddress: '31.42.175.148',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
        resource: {
            type: 'raProfiles',
            objects: [
                {
                    name: 'test',
                    uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
                },
            ],
        },
        affiliatedResource: {
            type: 'complianceProfiles',
            objects: [
                {
                    name: 'Custom',
                    uuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
                },
            ],
        },
        operation: 'disassociate',
        operationResult: 'success',
        additionalData: {
            uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
            resource: 'raProfiles',
            associationObjectUuid: 'c08e64f5-a98b-49df-908d-b3b26f50c145',
        },
    },
];

export const mockModuleEnum = {
    compliance: {
        code: 'compliance',
        label: 'Compliance',
    },
};
export const mockActorEnum = {
    user: {
        code: 'user',
        label: 'User',
    },
};
export const mockAuthMethodEnum = {};
export const mockResourceEnum = {
    complianceProfiles: {
        code: 'complianceProfiles',
        label: 'Compliance Profile',
    },
    raProfiles: {
        code: 'raProfiles',
        label: 'RA Profile',
    },
};
export const mockOperationEnum = {};
export const mockOperationResultEnum = {
    success: {
        code: 'success',
        label: 'Success',
    },
    failure: {
        code: 'failure',
        label: 'Failure',
    },
};
