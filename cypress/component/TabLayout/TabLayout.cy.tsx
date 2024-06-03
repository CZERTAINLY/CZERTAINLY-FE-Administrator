import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

const TestTabLayout = () => {
    return (
        <TabLayout
            tabs={[
                {
                    title: <span id="tabOneTitle">Tab 1</span>,
                    content: (
                        <Widget>
                            <div id="tabOneContent" className="p-4">
                                Tab 1 content
                            </div>
                        </Widget>
                    ),
                },
                {
                    title: <span id="tabTwoTitle">Tab 2</span>,
                    content: (
                        <Widget>
                            <div id="tabTwoContent" className="p-4">
                                Tab 2 content
                            </div>
                        </Widget>
                    ),
                },
            ]}
        />
    );
};

describe('Tab Layout component', () => {
    it('should render tab layout with 2 tabs', () => {
        cy.mount(<TestTabLayout />).wait(componentLoadWait);
        cy.get('#tabOneContent').should('have.text', 'Tab 1 content');
        cy.get('#tabTwoContent').should('have.text', 'Tab 2 content');
        cy.get('#tabTwoTitle').should('have.text', 'Tab 2').click().wait(clickWait);
        cy.get('#tabOneTitle').should('have.text', 'Tab 1').click().wait(clickWait);
    });
});
