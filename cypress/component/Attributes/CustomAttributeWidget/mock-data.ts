import { Props as CustomAttributeWidgetProps } from 'components/Attributes/CustomAttributeWidget';
import { AttributeDescriptorModel, AttributeResponseModel, CustomAttributeDto, CustomAttributeModel } from 'types/attributes';
import { CertificateDetailResponseModel } from 'types/certificate';
import { AttributeContentType, AttributeType, CertificateSubjectType, Resource, ResponseAttributeDto } from 'types/openapi';

export const successData = [
    {
        uuid: 'test-uuid-1',
        name: 'Test',
        description: '',
        content: [
            {
                data: 'Test content',
            },
        ],
        type: AttributeType.Custom,
        contentType: AttributeContentType.String,
        properties: {
            label: 'Test',
            visible: true,
            group: '',
            required: false,
            readOnly: false,
            list: false,
            multiSelect: false,
        },
    },
    {
        uuid: 'test-uuid-2',
        name: 'Distribution method',
        description: 'te2',
        content: [
            {
                data: 'Printer',
            },
            {
                data: 'Disk',
            },
        ],

        type: AttributeType.Custom,
        contentType: AttributeContentType.String,
        properties: {
            label: 'Distribution method',
            visible: true,
            group: 'Test',
            required: false,
            readOnly: false,
            list: true,
            multiSelect: false,
        },
    },
] as CustomAttributeDto[];

export const customAttributeWidgetProps: CustomAttributeWidgetProps = {
    resource: Resource.Certificates,
    resourceUuid: 'e0264f92-b3bc-496b-b48c-e687863c8288',
    attributes: [
        {
            uuid: 'tuuid-1',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            content: [
                {
                    data: 'Disk',
                },
            ],
        },
        {
            uuid: 'tuuid-2',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            content: [
                {
                    data: 'Default content',
                },
            ],
        },
        {
            uuid: 'tuuid-3',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            content: [
                {
                    data: 'true',
                },
            ],
        },
        {
            uuid: 'tuuid-4',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            content: [
                {
                    data: '1002',
                },
            ],
            properties: {
                label: 'Test',
                visible: true,
                group: '',
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'tuuid-5',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Float,
            content: [
                {
                    data: '10.02',
                },
            ],
            properties: {
                label: 'Test',
                visible: true,
                group: '',
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },

        {
            uuid: 'tuuid-6',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Date,
            content: [
                {
                    data: '2022-02-02',
                },
            ],
            properties: {
                label: 'Test',
                visible: true,
                group: '',
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },

        {
            uuid: 'tuuid-7',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Datetime,
            content: [
                {
                    data: '2022-02-02T12:00:00',
                },
            ],
            properties: {
                label: 'Test',
                visible: true,
                group: '',
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'tuuid-8',
            name: 'Test',
            label: 'Test',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Time,
            content: [
                {
                    data: '12:00:00',
                },
            ],
            properties: {
                label: 'Test',
                visible: true,
                group: '',
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },
    ] as AttributeResponseModel[],
};

export const certificateDetailSuccess = {
    uuid: '1c82f2ed-404e-4898-a15b-de429aa9461e',
    commonName: '*.google.com',
    serialNumber: '123',
    issuerCommonName: 'GTS CA 1C3',
    issuerDn: 'CN',
    subjectDn: 'CN=*.google.com',
    notBefore: '2024-02-19T08:03:54.000+00:00',
    notAfter: '2024-05-13T08:03:53.000+00:00',
    publicKeyAlgorithm: 'ECDSA',
    signatureAlgorithm: 'SHA256withRSA',
    keySize: 256,
    state: 'issued',
    validationStatus: 'invalid',
    fingerprint: 'abcd',
    certificateType: 'X.509',
    issuerSerialNumber: '123',
    complianceStatus: 'not_checked',
    issuerCertificateUuid: '123',
    privateKeyAvailability: false,
    extendedKeyUsage: ['1.2'],
    keyUsage: ['digitalSignature'],
    basicConstraints: 'Subject Type=End Entity',
    subjectType: CertificateSubjectType.EndEntity,
    metadata: [
        {
            connectorUuid: '11fa486c-3638-4c3e-99f5-9561d9700030',
            connectorName: 'Network-Discovery-Provider',
            items: [
                {
                    uuid: '000043aa-6022-11ed-9b6a-0242ac120002',
                    name: 'discoverySource',
                    label: 'Discovery Source',
                    type: 'meta',
                    contentType: 'string',
                    content: [
                        {
                            reference: 'https://google.com',
                            data: 'https://google.com',
                        },
                    ],
                    sourceObjectType: 'discoveries',
                    sourceObjects: [],
                },
            ],
        },
    ],
    certificateContent: '',
    subjectAlternativeNames: {
        registeredID: [],
        ediPartyName: [],
        iPAddress: [],
        x400Address: [],
        rfc822Name: [],
        otherName: [],
        dNSName: [],
        uniformResourceIdentifier: [],
        directoryName: [],
    },
    customAttributes: [
        {
            uuid: '57feb749-4150-415f-8cd7-44ce27b03de4',
            name: 'SomeCustom',
            label: 'SomeCustom',
            type: 'custom',
            contentType: 'integer',
            content: [
                {
                    data: '66',
                },
            ],
        },
        {
            uuid: '1dbe8543-3006-458a-9620-36e3bd23c457',
            name: 'tempreadonly',
            label: 'tempreadonly',
            type: 'custom',
            contentType: 'text',
            content: [
                {
                    data: 'tempreadonly',
                },
            ],
        },
        {
            uuid: 'ada1bdb1-3fdd-4798-a5d4-953e9fafedc9',
            name: 'tempreqqwe',
            label: 'tempreqqwe',
            type: 'custom',
            contentType: 'string',
            content: [
                {
                    data: 'tempreqqwe',
                },
            ],
        },
        {
            uuid: '66a05f21-7cbb-4152-a748-b757e15b6a49',
            name: 'Test Date',
            label: 'Test Date',
            type: 'custom',
            contentType: 'date',
            content: [
                {
                    data: '2024-01-01',
                },
            ],
        },
    ],
    issueAttributes: [],
    revokeAttributes: [],
    relatedCertificates: [],
    trustedCa: true,
} as CertificateDetailResponseModel;

export const customAttributeObj = [
    {
        uuid: 'c189d9fd-6671-4b84-8e9e-f9c91d81982f',
        name: 'Test',
        description: '',
        content: [
            {
                data: 'Default content',
            },
        ],
        type: 'custom',
        contentType: 'string',
        properties: {
            label: 'Test',
            visible: true,
            group: '',
            required: false,
            readOnly: false,
            list: false,
            multiSelect: false,
        },
    },
    {
        uuid: '4b42fe2c-2d59-4a62-8880-38a47d2c7db2',
        name: 'Distribution method',
        description: 'te2',
        content: [
            {
                data: 'Printer',
            },
            {
                data: 'Disk',
            },
        ],
        type: 'custom',
        contentType: 'string',
        properties: {
            label: 'Distribution method',
            visible: true,
            group: 'Test',
            required: false,
            readOnly: false,
            list: true,
            multiSelect: false,
        },
    },
    {
        uuid: '66a05f21-7cbb-4152-a748-b757e15b6a49',
        name: 'Test Date',
        description: 'Test Date',
        content: [
            {
                data: '2024-01-03',
            },
        ],
        type: 'custom',
        contentType: 'date',
        properties: {
            label: 'Test Date',
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
        type: 'custom',
        contentType: 'integer',
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
    {
        uuid: 'ada1bdb1-3fdd-4798-a5d4-953e9fafedc9',
        name: 'tempreqqwe',
        description: 'tempreqqwe',
        content: [
            {
                data: 'tempreqqwe',
            },
        ],
        type: 'custom',
        contentType: 'string',
        properties: {
            label: 'tempreqqwe',
            visible: true,
            group: 'sd',
            required: true,
            readOnly: false,
            list: false,
            multiSelect: false,
        },
    },
    {
        uuid: '1dbe8543-3006-458a-9620-36e3bd23c457',
        name: 'tempreadonly',
        description: 'tempreadonly',
        content: [
            {
                data: 'tempreadonly',
            },
        ],
        type: 'custom',
        contentType: 'text',
        properties: {
            label: 'tempreadonly',
            visible: true,
            group: 'tempreadonly',
            required: false,
            readOnly: true,
            list: false,
            multiSelect: false,
        },
    },
] as CustomAttributeDto[];

export const updateSuccessObj = [
    {
        uuid: '57feb749-4150-415f-8cd7-44ce27b03de4',
        name: 'SomeCustom',
        label: 'SomeCustom',
        type: 'custom',
        contentType: 'integer',
        content: [
            {
                data: '666',
            },
        ],
    },
    {
        uuid: '1dbe8543-3006-458a-9620-36e3bd23c457',
        name: 'tempreadonly',
        label: 'tempreadonly',
        type: 'custom',
        contentType: 'text',
        content: [
            {
                data: 'tempreadonly',
            },
        ],
    },
    {
        uuid: 'ada1bdb1-3fdd-4798-a5d4-953e9fafedc9',
        name: 'tempreqqwe',
        label: 'tempreqqwe',
        type: 'custom',
        contentType: 'string',
        content: [
            {
                data: 'tempreqqwe',
            },
        ],
    },
    {
        uuid: '66a05f21-7cbb-4152-a748-b757e15b6a49',
        name: 'Test Date',
        label: 'Test Date',
        type: 'custom',
        contentType: 'date',
        content: [
            {
                data: '2024-01-01',
            },
        ],
    },
] as ResponseAttributeDto[];

export const dataRenderingMockData = {
    resource: Resource.Certificates,
    resourceUuid: 'e0264f92-b3bc-496b-b48c-e687863c8281',
    attributes: [
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'String',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            label: 'String',
            content: [{ data: 'string-content' }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b1',
            name: 'Text',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            label: 'Text',
            content: [{ data: 'text-content' }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b2',
            name: 'Integer',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            label: 'Integer',
            content: [{ data: 10 }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b3',
            name: 'Boolean',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            label: 'Boolean',
            content: [{ data: true }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b4',
            name: 'Float',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Float,
            label: 'Float',
            content: [{ data: 1.5 }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b5',
            name: 'Date',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Date,
            label: 'Date',
            content: [{ data: '2022-01-01' }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b6',
            name: 'Time',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Time,
            label: 'Time',
            content: [{ data: '10:20' }],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d67',
            name: 'Datetime',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Datetime,
            label: 'Datetime',
            content: [{ data: '2022-01-01T10:20' }],
        },
    ] as AttributeResponseModel[],
    attributeDescriptors: [
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'String',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'String',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b1',
            name: 'Text',
            content: [],
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'Text',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b2',
            name: 'Integer',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'Integer',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b3',
            name: 'Boolean',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'Boolean',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b4',
            name: 'Float',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Float,
            properties: {
                label: 'Float',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b5',
            name: 'Date',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Date,
            properties: {
                label: 'Date',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b6',
            name: 'Time',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Time,
            properties: {
                label: 'Time',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d67',
            name: 'Datetime',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Datetime,
            properties: {
                label: 'Datetime',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
        },
    ] as CustomAttributeModel[],
};
