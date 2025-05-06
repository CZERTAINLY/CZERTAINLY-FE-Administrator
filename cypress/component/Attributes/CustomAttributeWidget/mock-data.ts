import { AttributeResponseModel, CustomAttributeModel } from 'types/attributes';
import { AttributeContentType, AttributeType, Resource } from 'types/openapi';

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

export const interactionsMockData = {
    resource: Resource.Certificates,
    resourceUuid: 'e0264f92-b3bc-496b-b48c-e687863c8282',
    attributes: [
        {
            uuid: '16cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'String',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            label: 'String',
            content: [
                {
                    data: 'content',
                },
            ],
        },
        {
            uuid: '26cf66eb-5c1e-4edf-8308-617565a5d6b3',
            name: 'Boolean',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            label: 'Boolean',
            content: [
                {
                    data: true,
                },
            ],
        },
        {
            uuid: '36cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'StringSelect',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            label: 'StringSelect',
            content: [
                {
                    data: 'Option1',
                },
            ],
        },
        {
            uuid: '46cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'StringMultiselect',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            label: 'StringMultiselect',
            content: [
                {
                    data: 'Option1',
                },
                {
                    data: 'Option2',
                },
            ],
        },
    ] as AttributeResponseModel[],
    attributeDescriptors: [
        {
            uuid: '16cf66eb-5c1e-4edf-8308-617565a5d6b0',
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
            content: [
                {
                    data: 'default-content',
                },
            ],
        },
        {
            uuid: '26cf66eb-5c1e-4edf-8308-617565a5d6b3',
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
            uuid: '36cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'StringSelect',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'StringSelect',
                list: true,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
            content: [
                {
                    data: 'Option1',
                },
                {
                    data: 'Option2',
                },
            ],
        },
        {
            uuid: '46cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'StringMultiselect',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'StringMultiselect',
                list: true,
                multiSelect: true,
                readOnly: false,
                required: false,
                visible: true,
            },
            content: [
                {
                    data: 'Option1',
                },
                {
                    data: 'Option2',
                },
                {
                    data: 'Option3',
                },
            ],
        },
    ] as CustomAttributeModel[],
};
