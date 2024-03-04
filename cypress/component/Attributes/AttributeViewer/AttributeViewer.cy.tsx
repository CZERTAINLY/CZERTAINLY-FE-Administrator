import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import '../../../../src/resources/styles/theme.scss';
import { customAttributeViewerProps } from './mock-data';

describe('AttributeViewer with Metadata', () => {
    it('renders AttributeViewer without Metadata', () => {
        cy.mount(<AttributeViewer attributes={customAttributeViewerProps.attributes} />);
    });
});

describe('AttributeViewer with Metadata', () => {
    it('renders AttributeViewer with Metadata', () => {
        cy.mount(<AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={customAttributeViewerProps.metadata} />);
    });
});
