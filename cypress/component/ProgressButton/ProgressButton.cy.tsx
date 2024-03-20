import ProgressButton from 'components/ProgressButton/index';
import { useState } from 'react';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

const TestProgressButton = () => {
    const [inProgress, setInProgress] = useState(false);

    const toggleProgress = () => {
        setInProgress(!inProgress);

        setTimeout(() => {
            setInProgress(false);
        }, 750);
    };

    return <ProgressButton inProgressTitle="Loading" title="Test Progress Button" inProgress={inProgress} onClick={toggleProgress} />;
};

describe('Progress Button component', () => {
    it("should render progress button with text 'Test Progress Button'", () => {
        cy.mount(<TestProgressButton />).wait(componentLoadWait);
        cy.get('button').should('have.text', 'Test Progress Button');
        cy.get('button').click().wait(clickWait);
    });
});
