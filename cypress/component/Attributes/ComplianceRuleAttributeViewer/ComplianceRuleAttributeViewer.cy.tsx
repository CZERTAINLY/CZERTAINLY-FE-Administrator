import ComplianceRuleAttributeViewer from 'components/Attributes/ComplianceRuleAttributeViewer';
import '../../../../src/resources/styles/theme.scss';
import { complianceRuleAttributeViewerProps } from './mock-data';

describe('Compliance Attribute Viewer', () => {
    it('should render ComplianceRuleAttributeViewer without descriptors', () => {
        cy.mount(<ComplianceRuleAttributeViewer attributes={complianceRuleAttributeViewerProps.attributes} />);
    });
});

describe('Compliance Attribute Viewer with descriptors', () => {
    it('should render ComplianceRuleAttributeViewer with descriptors', () => {
        cy.mount(
            <ComplianceRuleAttributeViewer
                attributes={complianceRuleAttributeViewerProps.attributes}
                descriptorAttributes={complianceRuleAttributeViewerProps.descriptorAttributes}
            />,
        );
    });
});
