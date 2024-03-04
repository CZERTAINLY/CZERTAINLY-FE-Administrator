import { Props as AttributeViewerProps } from 'components/Attributes/AttributeViewer';
import { AttributeResponseModel } from 'types/attributes';
import { MetadataModel } from 'types/locations';
import { AttributeContentType, AttributeType } from 'types/openapi';

export const customAttributeViewerProps: AttributeViewerProps = {
    attributes: [
        {
            contentType: AttributeContentType.String,
            label: 'Test Label 1',
            name: 'test-name-1',
            type: AttributeType.Info,
            uuid: 'test-uuid-1',
            content: [
                {
                    data: 'test-data-1',
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
    ] as AttributeResponseModel[],
    metadata: [
        {
            connectorUuid: '0647b608-00b3-4d3b-a83b-24e3b6718c42',
            connectorName: 'PyADCS-Connector',
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
                    sourceObjectType: 'discoveries',
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
                    sourceObjectType: 'discoveries',
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
                    sourceObjectType: 'discoveries',
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
                    sourceObjectType: 'discoveries',
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
};
