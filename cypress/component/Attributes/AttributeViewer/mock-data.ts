import { Props as AttributeViewerProps } from 'components/Attributes/AttributeViewer';
import { AttributeResponseModel, DataAttributeModel } from 'types/attributes';
import { MetadataModel } from 'types/locations';
import { AttributeContentType, AttributeType, Resource } from 'types/openapi';

export const attributeViewerProps: AttributeViewerProps = {
    attributes: [
        {
            contentType: AttributeContentType.String,
            label: 'Test Label 1',
            name: 'test-name-1',
            type: AttributeType.Info,
            uuid: 'test-uuid-1',
            content: [
                {
                    data: 'test-attribute-data-1',
                    reference: 'test-reference-1',
                },
            ],
        },
        {
            contentType: AttributeContentType.Boolean,
            label: 'Test Label 2',
            name: 'test-name-2',
            type: AttributeType.Info,
            uuid: 'test-uuid-2',
            content: [
                {
                    data: true,
                    reference: 'test-reference-2',
                },
            ],
        },

        {
            contentType: AttributeContentType.Codeblock,
            label: 'Test Label 3',
            name: 'test-name-3',
            type: AttributeType.Data,
            uuid: 'test-uuid-3',
            content: [
                {
                    data: {
                        code: 'PGgxPk9EUE9WRcSOPC9oMT4KPGRpdj5Qb8SNw610YW1lIGtvxL5rbyBjZXJ0aWZpa8OhdG92IHR1IGplLjwvZGl2PgoKPHVsPgogIDxsaT5TdWJqZWN0OiAke25vdGlmaWNhdGlvbkRhdGEuc3ViamVjdERufTwvbGk+CiAgPGxpPlNlcmlhbCBOdW1iZXI6ICR7bm90aWZpY2F0aW9uRGF0YS5zZXJpYWxOdW1iZXJ9PC9saT4KICA8bGk+SXNzdWVyOiAke25vdGlmaWNhdGlvbkRhdGEuaXNzdWVyRG59PC9saT4KPC91bD4=',
                        language: 'html',
                    },
                },
            ],
        },
    ] as AttributeResponseModel[],
    metadata: [
        {
            connectorUuid: '0647b608-00b3-4d3b-a83b-24e3b6718c42',
            connectorName: 'PyADCS-Connector',
            sourceObjectType: 'discoveries',
            items: [
                {
                    uuid: '8dbc74f1-32e7-427a-9764-046b6400c054',
                    name: 'ca_name_metadata',
                    label: 'CA Name',
                    type: AttributeType.Meta,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            reference: 'Demo MS Sub CA',
                            data: 'Demo MS Sub CA',
                        },
                    ],
                    sourceObjects: [
                        {
                            uuid: '1edec51f-5a15-4aab-80ef-b3c0f4dc83b0',
                            name: '000_test3',
                        },
                        {
                            uuid: 'a8ca2100-5c3f-4d95-af48-c88564867c7e',
                            name: 'a8ca2100-5c3f-4d95-af48-c88564867c7e',
                        },
                        {
                            uuid: '0cb5e53b-ed3f-46da-afda-ff8080897450',
                            name: '0cb5e53b-ed3f-46da-afda-ff8080897450',
                        },
                        {
                            uuid: '24e2f9f9-b34d-48b2-af20-71a53c614a90',
                            name: '24e2f9f9-b34d-48b2-af20-71a53c614a90',
                        },
                        {
                            uuid: 'edaf513f-5489-465e-8c30-ae244fea6533',
                            name: 'edaf513f-5489-465e-8c30-ae244fea6533',
                        },
                        {
                            uuid: '60a00ab8-d7fb-4fae-8803-767988324fce',
                            name: '60a00ab8-d7fb-4fae-8803-767988324fce',
                        },
                        {
                            uuid: 'e11fec4c-1651-4462-90aa-04d07adea3b4',
                            name: 'e11fec4c-1651-4462-90aa-04d07adea3b4',
                        },
                        {
                            uuid: '8db66aec-97cf-4437-92b5-cb0635b2bfb7',
                            name: '8db66aec-97cf-4437-92b5-cb0635b2bfb7',
                        },
                    ],
                },
                {
                    uuid: 'a1a9946c-190e-4e6d-9090-718ec9c99625',
                    name: 'template_name_metadata',
                    label: 'Certificate Template Name',

                    type: AttributeType.Meta,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            reference: 'WebServer',
                            data: 'WebServer',
                        },
                    ],
                    sourceObjectType: Resource.Discoveries,
                    sourceObjects: [
                        {
                            uuid: '1edec51f-5a15-4aab-80ef-b3c0f4dc83b0',
                            name: '000_test3',
                        },
                        {
                            uuid: 'a8ca2100-5c3f-4d95-af48-c88564867c7e',
                            name: 'a8ca2100-5c3f-4d95-af48-c88564867c7e',
                        },
                        {
                            uuid: '0cb5e53b-ed3f-46da-afda-ff8080897450',
                            name: '0cb5e53b-ed3f-46da-afda-ff8080897450',
                        },
                        {
                            uuid: '24e2f9f9-b34d-48b2-af20-71a53c614a90',
                            name: '24e2f9f9-b34d-48b2-af20-71a53c614a90',
                        },
                        {
                            uuid: 'edaf513f-5489-465e-8c30-ae244fea6533',
                            name: 'edaf513f-5489-465e-8c30-ae244fea6533',
                        },
                        {
                            uuid: '60a00ab8-d7fb-4fae-8803-767988324fce',
                            name: '60a00ab8-d7fb-4fae-8803-767988324fce',
                        },
                        {
                            uuid: 'e11fec4c-1651-4462-90aa-04d07adea3b4',
                            name: 'e11fec4c-1651-4462-90aa-04d07adea3b4',
                        },
                        {
                            uuid: '8db66aec-97cf-4437-92b5-cb0635b2bfb7',
                            name: '8db66aec-97cf-4437-92b5-cb0635b2bfb7',
                        },
                    ],
                },
            ],
        },
        {
            connectorUuid: '5dcd1aa6-91b7-4d12-9495-c38d43993326',
            connectorName: 'MS-ADCS-Connector',
            items: [
                {
                    uuid: 'f0d0e4ea-6105-11ed-9b6a-0242ac120002',
                    name: 'discoverySource',
                    label: 'Discovery Source',

                    type: AttributeType.Meta,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            reference: 'ADCS-through-proxy',
                            data: 'ADCS-through-proxy',
                        },
                    ],
                    sourceObjectType: Resource.Discoveries,
                    sourceObjects: [
                        {
                            uuid: '783c8a99-03e4-4e77-a8e9-dcac4b5da78f',
                            name: 'test000011111',
                        },
                    ],
                },
                {
                    uuid: 'f0d0e7f6-6105-11ed-9b6a-0242ac120002',
                    name: 'Template Name',
                    label: 'Discovery Source',

                    type: AttributeType.Meta,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            reference: 'WebServer',
                            data: 'WebServer',
                        },
                    ],
                    sourceObjectType: Resource.Discoveries,
                    sourceObjects: [
                        {
                            uuid: '783c8a99-03e4-4e77-a8e9-dcac4b5da78f',
                            name: 'test000011111',
                        },
                    ],
                },
            ],
        },
    ] as MetadataModel[],
    descriptors: [
        {
            content: [{ data: 'test-descriptor-data-1', reference: 'test-descriptor-reference-1' }],
            contentType: AttributeContentType.String,
            description: 'test-descriptor-1',
            name: 'test-name-1',
            type: AttributeType.Data,
            uuid: 'test-uuid-1',
            properties: {
                label: 'Test Label 1',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [{ data: 'test-descriptor-data-2', reference: 'test-descriptor-reference-2' }],
            contentType: AttributeContentType.String,
            description: 'test-descriptor-2',
            name: 'test-descriptor-name-2',
            type: AttributeType.Data,
            uuid: 'test-uuid-2',
            properties: {
                label: 'Test Label 2',
                visible: true,
                group: 'test-group-2',
            },
        },
    ] as DataAttributeModel[],
};
