import { actions as groupActions } from 'ducks/certificateGroups';
import { actions as certificateActions } from 'ducks/certificates';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { actions as rolesActions } from 'ducks/roles';
import { actions as userActions } from 'ducks/users';
import { Route, Routes } from 'react-router-dom';

import UserEdit from '../../../../../src/components/_pages/users/form';
import '../../../../../src/resources/styles/theme.scss';
import { clickWait, reduxActionWait } from '../../../../utils/constants';
import { userFormMockData } from './mock-data';

describe('UserForm component - Add User', () => {
    beforeEach(() => {
        cy.mount(<UserEdit />);
        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.listResourceCustomAttributesSuccess(userFormMockData.resourceCustomAttributes));
        cy.wait(reduxActionWait).window().its('store').invoke('dispatch', rolesActions.listSuccess(userFormMockData.rolesListPayload));

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', groupActions.listGroupsSuccess(userFormMockData.groupListPayload));

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', certificateActions.listCertificatesSuccess(userFormMockData.certificateListPayload));
    });

    it(`🟢 Check all inputs and labels"
        🟢 First label should be Enabled and input must be a checkbox
        🟢 Second label and input placeholder should be Username
        🟢 Third label should be Groups and input must be of type select with placeholder Select Groups
        🟢 Fourth label and input placeholder should be Description
        🟢 Fifth label and input placeholder should be First Name
        🟢 Sixth label and input placeholder should be Second Name
        🟢 Seventh label should be Email and placeholder should be Email address
        🟢 Eighth label should be Input Type and selected value should be Choose Existing Certificate
        🟢 Ninth label should be Certificate and input must be of type select with placeholder Select Certificate
        🟢 At the end there should be a indication for choosing User Roles
        🟢 A table should be present with headings Name, Role description, System role 
        `, () => {
        cy.get('label').eq(0).should('contain.text', 'Enabled');
        cy.get('input').eq(0).should('have.attr', 'type', 'checkbox');
        cy.get('label').eq(1).should('contain.text', 'Username');
        cy.get('input').eq(1).should('have.attr', 'placeholder', 'Username');
        cy.get('label').eq(2).should('contain.text', 'Groups');
        cy.get('#react-select-2-placeholder').should('contain.text', 'Select Groups');
        cy.get('label').eq(3).should('contain.text', 'Description');
        cy.get('input').eq(4).should('have.attr', 'placeholder', 'Description');
        cy.get('label').eq(4).should('contain.text', 'First Name');
        cy.get('input').eq(5).should('have.attr', 'placeholder', 'First Name');
        cy.get('label').eq(5).should('contain.text', 'Last Name');
        cy.get('input').eq(6).should('have.attr', 'placeholder', 'Last name');
        cy.get('label').eq(6).should('contain.text', 'Email');
        cy.get('input').eq(7).should('have.attr', 'placeholder', 'Email address');
        cy.get('label').eq(7).should('contain.text', 'Input Type');
        cy.get('#react-select-3-live-region')
            .siblings('div')
            .eq(0)
            .click()
            .should('exist')
            .then(($select) => {
                cy.wait(500); // wait for 500ms
                cy.wrap($select).parent().parent().find('div[class*="singleValue"]').should('contain.text', 'Choose Existing Certificate');
            });

        cy.get('label').eq(8).should('contain.text', 'Certificate');
        cy.get('#react-select-4-placeholder').should('contain.text', 'Select Certificate');
        cy.get('p').eq(0).should('contain.text', 'Assigned User Roles');
        cy.get('table').should('exist');
        cy.get('th').eq(1).should('contain.text', 'Name');
        cy.get('th').eq(2).should('contain.text', 'Role description');
        cy.get('th').eq(3).should('contain.text', 'System role');
    });

    it(`🟢 Enter all form values`, () => {
        cy.get('input').eq(1).type('testUser');
        cy.get('#react-select-6-live-region').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-6-option-0').should('exist').click();
        cy.get('input').eq(4).type('Test description');
        cy.get('input').eq(5).type('Test First Name');
        cy.get('input').eq(6).type('Test Last Name');
        cy.get('input').eq(7).type('test@email.com');
        cy.get('#react-select-7-live-region').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-7-option-1').should('exist').click();
        cy.get('td').eq(1).should('exist').click();
    });
});
describe('UserForm component - Edit User', () => {
    it('should render UserEdit with the correct id', () => {
        cy.mount(
            <Routes>
                <Route path="/users/edit/:id" element={<UserEdit />} />
            </Routes>,
            {},
            `/users/edit/${userFormMockData.userDetailsPayload.user.uuid}`,
        );

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', userActions.getDetailSuccess({ ...userFormMockData.userDetailsPayload }));
        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.listResourceCustomAttributesSuccess(userFormMockData.resourceCustomAttributes));
        cy.wait(reduxActionWait).window().its('store').invoke('dispatch', rolesActions.listSuccess(userFormMockData.rolesListPayload));
        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', certificateActions.getCertificateDetailSuccess(userFormMockData.certificateDetailsPayload));
        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', groupActions.listGroupsSuccess(userFormMockData.groupListPayload));

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', certificateActions.listCertificatesSuccess(userFormMockData.certificateListPayload));
    });
});
