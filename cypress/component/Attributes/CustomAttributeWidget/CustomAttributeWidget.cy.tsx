import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { actions as certificateActions, selectors as certificateSelectors } from 'ducks/certificates';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { transformAttributeResponseDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';

import { useSelector } from 'react-redux';
import { Resource } from 'types/openapi';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import { certificateDetailSuccess, customAttributeObj, customAttributeWidgetProps, successData, updateSuccessObj } from './mock-data';

describe('CustomAttributeWidget', () => {
    beforeEach(() => {
        cy.mount(
            <CustomAttributeWidget
                resource={customAttributeWidgetProps.resource}
                resourceUuid={customAttributeWidgetProps.resourceUuid}
                attributes={customAttributeWidgetProps.attributes}
            />,
        )
            .wait(componentLoadWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(successData.map(transformCustomAttributeDtoToModel)),
            )
            .wait(reduxActionWait);
    });

    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 4);
        cy.get('tr').should('have.length', 9);
        cy.get('td').should('have.length', 32);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(0).should('contain.text', 'Name');
        cy.get('th').eq(1).should('contain.text', 'Content Type');
        cy.get('th').eq(2).should('contain.text', 'Content');
        cy.get('th').eq(3).should('contain.text', 'Actions');
    });

    it('should render correct data', () => {
        cy.get('td').eq(0).should('contain.text', 'Test');
        cy.get('td').eq(1).should('contain.text', 'string');
        cy.get('td').eq(2).should('contain.text', 'Disk');
        cy.get('td').eq(3).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(4).should('contain.text', 'Test');
        cy.get('td').eq(5).should('contain.text', 'string');
        cy.get('td').eq(6).should('contain.text', 'Default content');
        cy.get('td').eq(7).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(8).should('contain.text', 'Test');
        cy.get('td').eq(9).should('contain.text', 'boolean');
        cy.get('td').eq(10).should('contain.text', 'true');
        cy.get('td').eq(11).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(12).should('contain.text', 'Test');
        cy.get('td').eq(13).should('contain.text', 'integer');
        cy.get('td').eq(14).should('contain.text', '100');
        cy.get('td').eq(15).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(16).should('contain.text', 'Test');
        cy.get('td').eq(17).should('contain.text', 'float');
        cy.get('td').eq(18).should('contain.text', '10.02');
        cy.get('td').eq(19).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(20).should('contain.text', 'Test');
        cy.get('td').eq(21).should('contain.text', 'date');
        cy.get('td').eq(22).should('contain.text', '2022-02-02');
        cy.get('td').eq(23).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(24).should('contain.text', 'Test');
        cy.get('td').eq(25).should('contain.text', 'datetime');
        cy.get('td').eq(26).should('contain.text', '2022-02-02 12:00:00');
        cy.get('td').eq(27).should('contain.html', 'fa-pencil-square-o', 'fa-trash');

        cy.get('td').eq(28).should('contain.text', 'Test');
        cy.get('td').eq(29).should('contain.text', 'time');
        cy.get('td').eq(30).should('contain.text', '12:00:00');
        cy.get('td').eq(31).should('contain.html', 'fa-pencil-square-o', 'fa-trash');
    });
});

const CustomAttributeCertificateComponent = () => {
    const certificate = useSelector(certificateSelectors.certificateDetail);
    return (
        <CustomAttributeWidget
            resource={Resource.Certificates}
            resourceUuid={certificate?.uuid || ''}
            attributes={certificate?.customAttributes || []}
        />
    );
};

describe('CustomAttributeCertificateComponent with certificate custom attributes', () => {
    beforeEach(() => {
        cy.mount(<CustomAttributeCertificateComponent />).wait(componentLoadWait);
        cy.wait(reduxActionWait)
            .window()
            .wait(componentLoadWait)
            .its('store')
            .invoke('dispatch', certificateActions.getCertificateDetailSuccess({ certificate: certificateDetailSuccess }))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(customAttributeObj.map(transformCustomAttributeDtoToModel)),
            )
            .wait(reduxActionWait);
    });

    it(`should render correct number of rows,columns and data elements
        🟢 it should click edit for the first row
        🟢 update the value to 666
        🟢 click add for the first row
        🟢 click delete for the first row
        🟢 first row edit should be disabled
        🟢 second row delete should be disabled`, () => {
        cy.get('th').should('have.length', 4);
        cy.get('tr').should('have.length', 5);
        cy.get('td').should('have.length', 16);

        cy.get('.fa-pencil-square-o').eq(0).click().wait(clickWait);
        cy.get('input').eq(0).clear().type('666').wait(clickWait);
        cy.get('.fa-plus').eq(0).click().wait(clickWait);
        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.updateCustomAttributeContentSuccess({
                    resource: customAttributeWidgetProps.resource,
                    customAttributes: updateSuccessObj.map(transformAttributeResponseDtoToModel),
                    resourceUuid: '1c82f2ed-404e-4898-a15b-de429aa9461e',
                }),
            )
            .wait(reduxActionWait);

        cy.get('.fa-trash').eq(0).click().wait(clickWait);

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.updateCustomAttributeContentSuccess({
                    resource: customAttributeWidgetProps.resource,
                    customAttributes: updateSuccessObj.slice(1).map(transformAttributeResponseDtoToModel),
                    resourceUuid: '1c82f2ed-404e-4898-a15b-de429aa9461e',
                }),
            )
            .wait(reduxActionWait);
        cy.get('button').eq(1).should('be.disabled');
        cy.get('button').eq(5).should('be.disabled');

        if (!Cypress.isBrowser('firefox')) {
            cy.get('button').eq(0).find('i.fa.fa-copy').should('exist').click().wait(clickWait);
        }
    });
});
