import { Props as CustomAttributeWidgetProps } from 'components/Attributes/CustomAttributeWidget';
import { AttributeResponseModel, CustomAttributeDto } from 'types/attributes';
import { AttributeContentType, AttributeType, Resource } from 'types/openapi';

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
                    data: '100',
                },
            ],
        },
    ] as AttributeResponseModel[],
};
