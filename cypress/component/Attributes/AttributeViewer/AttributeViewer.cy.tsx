import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import '../../../../src/resources/styles/theme.scss';
import { attributeViewerProps } from './mock-data';

describe('AttributeViewer with Metadata', () => {
    it('renders AttributeViewer without Metadata', () => {
        cy.mount(<AttributeViewer attributes={attributeViewerProps.attributes} />);
    });
});

describe('AttributeViewer with Metadata', () => {
    it('renders AttributeViewer with Metadata', () => {
        cy.mount(<AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={attributeViewerProps.metadata} />);
    });
});

describe('AttributeViewer with Metadata and Attributes', () => {
    it('renders AttributeViewer with Metadata and Attributes', () => {
        cy.mount(
            <AttributeViewer
                viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTES_WITH_DESCRIPTORS}
                descriptors={attributeViewerProps.descriptors}
                attributes={attributeViewerProps.attributes}
            />,
        );
    });
});
