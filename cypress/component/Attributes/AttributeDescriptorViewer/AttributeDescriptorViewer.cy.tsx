import AttributeDescriptorViewer from 'components/Attributes/AttributeDescriptorViewer';
import '../../../../src/resources/styles/theme.scss';
import {
    customAttributeDescriptorProps,
    dataAttributeDescriptorProps,
    groupAttributeDescriptorProps,
    infoAttributeDescriptorProps,
} from './mock-data';

describe('AttributeDescriptorViewer component 1 (Info Attribute Model)', () => {
    it('should render AttributeDescriptorViewer (Info Attribute Model)', () => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={infoAttributeDescriptorProps.attributeDescriptors} />);
    });
});

describe('AttributeDescriptorViewer component 2 (Custom Attribute Model)', () => {
    it('should render AttributeDescriptorViewer (Custom Attribute Model)', () => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={customAttributeDescriptorProps.attributeDescriptors} />);
    });
});

describe('AttributeDescriptorViewer component 3 (Data Attribute Model)', () => {
    it('should render AttributeDescriptorViewer (Data Attribute Model)', () => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={dataAttributeDescriptorProps.attributeDescriptors} />);
    });
});

describe('AttributeDescriptorViewer component 4 (Group Attribute Model)', () => {
    it('should render AttributeDescriptorViewer (Group Attribute Model)', () => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={groupAttributeDescriptorProps.attributeDescriptors} />);
    });
});
