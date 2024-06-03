import BooleanBadge from 'components/BooleanBadge/BooleanBadge';
import '../../../src/resources/styles/theme.scss';
import { componentLoadWait } from '../../utils/constants';

describe('Boolean badge component with true value', () => {
    it("should render 'Yes' for true value", () => {
        cy.mount(<BooleanBadge value={true} />).wait(componentLoadWait);
        cy.get('span').should('have.text', 'Yes');
    });
});

describe('Boolean badge component with true value', () => {
    it("should render 'No' for false value", () => {
        cy.mount(<BooleanBadge value={false} />).wait(componentLoadWait);
        cy.get('span').should('have.text', 'No');
    });
});
