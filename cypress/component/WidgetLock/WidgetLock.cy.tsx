import WidgetLock from 'components/WidgetLock/index';
import '../../../src/resources/styles/theme.scss';

describe('Widget Lock component', () => {
    it("should render widget lock with lock title 'Test Lock' & lock text 'Test lock text", () => {
        cy.mount(<WidgetLock lockTitle="Test lock" lockText="Test lock text" />);
        cy.get('h5').should('have.text', 'Test lock');
        cy.get('p').should('have.text', 'Test lock text');
    });
});
