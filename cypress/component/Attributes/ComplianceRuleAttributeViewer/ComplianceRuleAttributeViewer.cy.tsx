import ComplianceRuleAttributeViewer, {
    Props as ComplianceRuleAttributeViewerProps,
} from 'components/Attributes/ComplianceRuleAttributeViewer';
import { AttributeResponseModel } from 'types/attributes';
import { AttributeContentType, AttributeType } from 'types/openapi';
import '../../../../src/resources/styles/theme.scss';

const complianceRuleAttributeViewerProps: ComplianceRuleAttributeViewerProps = {
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
};

describe('Compliance Attribute Viewer (InfoAttributeModel)', () => {
    it('should render info attribute editor', () => {
        cy.mount(<ComplianceRuleAttributeViewer attributes={complianceRuleAttributeViewerProps.attributes} />);
    });
});
