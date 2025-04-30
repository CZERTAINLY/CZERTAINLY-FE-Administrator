import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { actions as certificateActions, selectors as certificateSelectors } from 'ducks/certificates';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { transformAttributeResponseDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';

import { useSelector } from 'react-redux';
import { Resource } from 'types/openapi';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import {
    certificateDetailSuccess,
    customAttributeObj,
    customAttributeWidgetProps,
    dataRenderingMockData,
    successData,
    updateSuccessObj,
} from './mock-data';
import { cySelectors } from '../../../utils/selectors';

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

describe('CustomAttributeWidget for Certificate Resource ', () => {
    beforeEach(() => {
        cy.mount(<CustomAttributeCertificateComponent />).wait(componentLoadWait);
        cy.dispatchActions(
            certificateActions.getCertificateDetailSuccess({ certificate: certificateDetailSuccess }),
            customAttributesActions.listResourceCustomAttributesSuccess(customAttributeObj.map(transformCustomAttributeDtoToModel)),
        );
    });

    it(`Should be able to edit and delete attributes. 
        Edit should be disabled for readonly attributes.
        Delete should be disabled for required attributes.
        Should be able to copy attribute value.
        `, () => {
        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).all(({ rows }) => {
            rows(0).actions('edit').click().wait(clickWait);
            rows(0).input().clear().type('666').wait(clickWait);
            rows(0).actions('save').click().wait(clickWait);
        });

        cy.dispatchActions(
            customAttributesActions.updateCustomAttributeContentSuccess({
                resource: customAttributeWidgetProps.resource,
                resourceUuid: certificateDetailSuccess.uuid,
                customAttributes: updateSuccessObj.map(transformAttributeResponseDtoToModel),
            }),
        );

        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(0).actions('delete').click().wait(clickWait);

        cy.dispatchActions(
            customAttributesActions.updateCustomAttributeContentSuccess({
                resource: customAttributeWidgetProps.resource,
                resourceUuid: certificateDetailSuccess.uuid,
                customAttributes: updateSuccessObj.slice(1).map(transformAttributeResponseDtoToModel),
            }),
        );

        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(0).actions('edit').should('be.disabled');
        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(1).actions('delete').should('be.disabled');

        if (!Cypress.isBrowser('firefox')) {
            cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(0).actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('tempreadonly');
        }
    });
});

describe.only('CustomAttributeWidget: Data Rendering', () => {
    beforeEach(() => {
        cy.mount(
            <CustomAttributeWidget
                resource={dataRenderingMockData.resource}
                resourceUuid={dataRenderingMockData.resourceUuid}
                attributes={dataRenderingMockData.attributes}
            />,
        ).wait(componentLoadWait);
        cy.dispatchActions(customAttributesActions.listResourceCustomAttributesSuccess(dataRenderingMockData.attributeDescriptors));
    });

    it('should render correct number of rows,columns and data elements', () => {
        cySelectors.customAttributeWidget(dataRenderingMockData.resourceUuid).all(({ headers, rows }) => {
            headers().should('have.length', 4);
            rows().should('have.length', 8);
        });
    });

    it('should render correct heading', () => {
        cySelectors.customAttributeWidget(dataRenderingMockData.resourceUuid).all(({ headers }) => {
            headers(0).should('contain.text', 'Name');
            headers(1).should('contain.text', 'Content Type');
            headers(2).should('contain.text', 'Content');
            headers(3).should('contain.text', 'Actions');
        });
    });

    it('Should render correct data for each row', () => {
        cySelectors.customAttributeWidget(dataRenderingMockData.resourceUuid).all(({ rows }) => {
            rows('String').contentType().should('contain.text', 'string');
            rows('String').content().should('contain.text', 'string-content');

            rows('Text').contentType().should('contain.text', 'text');
            rows('Text').content().should('contain.text', 'text-content');

            rows('Integer').contentType().should('contain.text', 'integer');
            rows('Integer').content().should('contain.text', '10');

            rows('Boolean').contentType().should('contain.text', 'boolean');
            rows('Boolean').content().should('contain.text', 'true');

            rows('Float').contentType().should('contain.text', 'float');
            rows('Float').content().should('contain.text', '1.5');

            rows('Date').contentType().should('contain.text', 'date');
            rows('Date').content().should('contain.text', '2022-01-01');

            rows('Time').contentType().should('contain.text', 'time');
            rows('Time').content().should('contain.text', '10:20');

            rows('Datetime').contentType().should('contain.text', 'datetime');
            rows('Datetime').content().should('contain.text', '2022-01-01 10:20:00');
        });
    });

    it('Should sort data correctly', () => {
        cySelectors.customAttributeWidget(dataRenderingMockData.resourceUuid).all(({ rows, headers }) => {
            headers(0).click().wait(clickWait);
            rows(0).name().should('contain.text', 'Boolean');
            headers(0).click().wait(clickWait);
            rows(0).name().should('contain.text', 'Time');

            headers(1).click().wait(clickWait);
            rows(0).contentType().should('contain.text', 'boolean');
            headers(1).click().wait(clickWait);
            rows(0).contentType().should('contain.text', 'time');

            headers(2).click().wait(clickWait);
            rows(0).content().should('contain.text', '1.5');
            headers(2).click().wait(clickWait);
            rows(0).content().should('contain.text', 'true');
        });
    });

    it('Should copy data correctly', () => {
        if (Cypress.isBrowser('firefox')) return;
        cySelectors.customAttributeWidget(dataRenderingMockData.resourceUuid).all(({ rows, headers }) => {
            rows('String').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('string-content');

            rows('Text').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('text-content');

            rows('Integer').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('10');

            rows('Boolean').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('true');

            rows('Float').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('1.5');

            rows('Date').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('2022-01-01');

            rows('Time').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('10:20');

            rows('Datetime').actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('2022-01-01 10:20:00');
        });
    });
});

describe('CustomAttributeWidget: Edit and Delete Interactions', () => {
    beforeEach(() => {
        cy.mount(<CustomAttributeCertificateComponent />).wait(componentLoadWait);
        cy.dispatchActions(
            certificateActions.getCertificateDetailSuccess({ certificate: certificateDetailSuccess }),
            customAttributesActions.listResourceCustomAttributesSuccess(customAttributeObj.map(transformCustomAttributeDtoToModel)),
        );
    });

    it(`Should be able to edit and delete attributes. 
        Edit should be disabled for readonly attributes.
        Delete should be disabled for required attributes.
        Should be able to copy attribute value.
        `, () => {
        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).all(({ rows }) => {
            rows(0).actions('edit').click().wait(clickWait);
            rows(0).input().clear().type('666').wait(clickWait);
            rows(0).actions('save').click().wait(clickWait);
        });

        cy.dispatchActions(
            customAttributesActions.updateCustomAttributeContentSuccess({
                resource: customAttributeWidgetProps.resource,
                resourceUuid: certificateDetailSuccess.uuid,
                customAttributes: updateSuccessObj.map(transformAttributeResponseDtoToModel),
            }),
        );

        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(0).actions('delete').click().wait(clickWait);

        cy.dispatchActions(
            customAttributesActions.updateCustomAttributeContentSuccess({
                resource: customAttributeWidgetProps.resource,
                resourceUuid: certificateDetailSuccess.uuid,
                customAttributes: updateSuccessObj.slice(1).map(transformAttributeResponseDtoToModel),
            }),
        );

        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(0).actions('edit').should('be.disabled');
        cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(1).actions('delete').should('be.disabled');

        if (!Cypress.isBrowser('firefox')) {
            cySelectors.customAttributeWidget(certificateDetailSuccess.uuid).rows(0).actions('copy').click().wait(clickWait);
            cy.assertValueCopiedToClipboard('tempreadonly');
        }
    });
});
