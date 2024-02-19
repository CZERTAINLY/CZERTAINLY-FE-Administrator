import CertificateAttributes from 'components/CertificateAttributes';
import Widget from 'components/Widget';
import '../../../src/resources/styles/theme.scss';
import cert from './mock-data';

const TestCertificateAttributes = () => {
    return (
        <Widget title="Certificate Attributes">
            <CertificateAttributes certificate={cert} />
        </Widget>
    );
};

describe('CertificateAttributes component', () => {
    it('should render certificate attributes', () => {
        cy.mount(<TestCertificateAttributes />);
        cy.get('h5').should('have.text', 'Certificate Attributes');
        cy.wait(500);
    });
});
