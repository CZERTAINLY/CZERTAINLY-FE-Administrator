import {
    AttributeContentType,
    AttributeType,
    CertificateState,
    CertificateType,
    CertificateValidationStatus,
    ComplianceStatus,
} from 'types/openapi';

const userFormMockData = {
    resourceCustomAttributes: [
        {
            uuid: '35617cc3-4b77-4bd3-ad62-d6051b92f5e9',
            name: 'DepartmentAssociation',
            description: '',
            content: [
                {
                    data: 'IT',
                },
                {
                    data: 'HR',
                },
                {
                    data: 'Sales',
                },
            ],
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'Department',
                visible: true,
                group: 'Test',
                required: false,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
        },
        {
            uuid: '38164377-9c87-4c7a-8594-1f4eb83b4e93',
            name: 'Text Me',
            description: '',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'Text Me',
                visible: true,
                group: '',
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: '57feb749-4150-415f-8cd7-44ce27b03de4',
            name: 'SomeCustom',
            description: 'SomeCustom',
            content: [
                {
                    data: '0',
                },
            ],
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'SomeCustom',
                visible: true,
                group: '',
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
    ],
    rolesListPayload: {
        roles: [
            {
                uuid: '44013f84-ef99-4d82-bbb0-340e767d0111',
                name: 'RB_web_admin_team1',
                description: '',
                email: 'katerina.bzatkova@3key.company',
                systemRole: false,
            },
            {
                uuid: '463b03ee-43da-4978-ac62-c14db4d81609',
                name: 'test-role',
                description: 'Test role',
                systemRole: false,
            },
        ],
    },
    groupListPayload: {
        groups: [
            {
                uuid: '080714e4-fd31-47f6-87f5-fafb6e1ae510',
                name: 'RB team 1',
                description: '',
                email: 'katerina.bzatkova@3key.company',
            },
            {
                uuid: '2a495644-27e3-4ecb-a8bb-f1e50ac630cb',
                name: 'RB Division1',
                description: '',
                email: 'katerina.bzatkova@3key.company',
            },
        ],
    },

    certificateListPayload: [
        {
            uuid: 'c1d5c601-4343-4ed6-800b-9a4f742c60a5',
            commonName: 'keitaro.io',
            serialNumber: '47ca2bafd4c818f2532eb53f59ee50bebdb',
            issuerCommonName: 'R3',
            issuerDn: "CN=R3, O=Let's Encrypt, C=US",
            subjectDn: 'CN=keitaro.io',
            notBefore: '2024-03-31T10:05:38.000+00:00',
            notAfter: '2024-06-29T10:05:37.000+00:00',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA256withRSA',
            keySize: 2048,
            state: CertificateState.Issued,
            validationStatus: CertificateValidationStatus.Valid,
            fingerprint: '1630ef6e2d8f412931fbafa9e8c6e5d4be3f20ce6fc2841cf40f19f84e18ae14',
            groups: [],
            certificateType: CertificateType.X509,
            issuerSerialNumber: '912b084acf0c18a753f6d62e25a75f5a',
            complianceStatus: ComplianceStatus.NotChecked,
            issuerCertificateUuid: 'f8f51f0e-52f9-4c34-a73e-9aa4c7009aec',
            privateKeyAvailability: false,
            trustedCa: true,
        },
    ],
};

export { userFormMockData };
