import Dialog from 'components/Dialog/index';
import { useState } from 'react';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

const TestDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };

    const buttons = [
        {
            color: 'danger',
            onClick: () => setIsOpen(false),
            body: 'Yes',
        },
        {
            color: 'secondary',
            onClick: toggleDialog,
            body: 'Cancel',
        },
    ];

    return (
        <div>
            <button onClick={toggleDialog}>Open Dialog</button>
            <Dialog isOpen={isOpen} caption="Test Dialog" body="You have opened a test dialog" toggle={toggleDialog} buttons={buttons} />
        </div>
    );
};

describe('Dialog component', () => {
    it('should open and close the test dialog', () => {
        cy.mount(<TestDialog />).wait(componentLoadWait);
        cy.contains('Open Dialog').click().wait(clickWait);
        cy.contains('Test Dialog');
        cy.contains('Cancel').click().wait(clickWait);
        cy.contains('Open Dialog').click().wait(clickWait);
        cy.contains('Yes').click().wait(clickWait);
    });
});
