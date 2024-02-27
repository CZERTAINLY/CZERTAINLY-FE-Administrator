import ComplianceRuleAttributeViewer, {
    Props as ComplianceRuleAttributeViewerProps,
} from 'components/Attributes/ComplianceRuleAttributeViewer';
import { AttributeResponseModel, InfoAttributeModel } from 'types/attributes';
import { AttributeContentType, AttributeType } from 'types/openapi';
import '../../../../src/resources/styles/theme.scss';

const infoAttributeEditorProps: ComplianceRuleAttributeViewerProps = {
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

    descriptorAttributes: [
        {
            content: [{ data: 'test-data-1', reference: 'test-reference-1' }],
            contentType: 'string',
            description: 'test-description-1',
            name: 'test-name-1',
            type: 'info',
            uuid: 'test-uuid-1',
            properties: {
                label: 'Test Label 1',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [{ data: 'test-data-2', reference: 'test-reference-2' }],
            contentType: 'string',
            description: 'test-description-2',
            name: 'test-name-2',
            type: 'info',
            uuid: 'test-uuid-2',
            properties: {
                label: 'Test Label 2',
                visible: true,
                group: 'test-group-2',
            },
        },
    ] as InfoAttributeModel[],
};
describe('AttributeDescriptorViewer', () => {
    it('should render info attribute editor', () => {
        cy.mount(<ComplianceRuleAttributeViewer attributes={infoAttributeEditorProps.attributes} />);
    });
});
