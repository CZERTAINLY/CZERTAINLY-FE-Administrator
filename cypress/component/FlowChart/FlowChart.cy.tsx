import FlowChart from 'components/FlowChart';
import '../../../src/resources/styles/theme.scss';
import { componentLoadWait } from '../../utils/constants';
import { edges, nodes } from './mock-data';

const TestFlowChart = () => {
    return (
        <div>
            <FlowChart flowChartTitle="Test Flow Chart" flowChartNodes={nodes} flowChartEdges={edges} />
        </div>
    );
};

describe('FlowChart', () => {
    it('should render', () => {
        cy.mount(<TestFlowChart />).wait(componentLoadWait);
        cy.get('h5').should('contain', 'Test Flow Chart');
        cy.get('.react-flow__node').should('have.length', nodes.length);
        cy.get('.react-flow__edge').should('have.length', edges.length);
    });
});
