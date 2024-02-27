import CustomAttributeWidget, { Props as CustomAttributeWidgetProps } from 'components/Attributes/CustomAttributeWidget';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { CustomAttributeModel } from 'types/attributes';
import { AttributeContentType, AttributeType, Resource } from 'types/openapi';
import '../../../../src/resources/styles/theme.scss';

const successData = [
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
] as CustomAttributeModel[];

const infoAttributeEditorProps: CustomAttributeWidgetProps = {
    resource: Resource.Certificates,
    resourceUuid: 'e0264f92-b3bc-496b-b48c-e687863c8288',
    attributes: [
        {
            uuid: '4b42fe2c-2d59-4a62-8880-38a47d2c7db2',
            name: 'Distribution method',
            label: 'Distribution method',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            content: [
                {
                    data: 'Disk',
                },
            ],
        },
        {
            uuid: 'c189d9fd-6671-4b84-8e9e-f9c91d81982f',
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
    ],
    // attributes: [
    //     {
    //         contentType: AttributeContentType.String,
    //         label: 'Test Label 1',
    //         name: 'test-name-1',
    //         type: AttributeType.Info,
    //         uuid: 'test-uuid-1',
    //         content: [
    //             {
    //                 data: 'test-data-1',
    //                 reference: 'test-reference-1',
    //             },
    //         ],
    //     },
    //     {
    //         contentType: AttributeContentType.Boolean,
    //         label: 'Test Label 2',
    //         name: 'test-name-2',
    //         type: AttributeType.Info,
    //         uuid: 'test-uuid-2',
    //         content: [
    //             {
    //                 data: true,
    //                 reference: 'test-reference-2',
    //             },
    //         ],
    //     },
    // ] as AttributeResponseModel[],
};
describe('CustomAttributeWidget', () => {
    it('should render info attribute editor', () => {
        cy.mount(<></>);
        cy.mount(
            <CustomAttributeWidget
                resource={infoAttributeEditorProps.resource}
                resourceUuid={infoAttributeEditorProps.resourceUuid}
                attributes={infoAttributeEditorProps.attributes}
            />,
        )
            .wait(1000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(successData.map(transformCustomAttributeDtoToModel)),
            );

        cy.window()
            .its('store')
            .invoke('getState')
            .then((state) => {
                console.log('store', state);
            });
    });
});
