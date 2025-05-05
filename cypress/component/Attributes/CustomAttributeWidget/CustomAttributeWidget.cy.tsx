import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { actions as customAttributesActions, slice } from 'ducks/customAttributes';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import { dataRenderingMockData, interactionsMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';
import { AttributeResponseModel } from 'types/attributes';

describe('CustomAttributeWidget: Data Rendering', () => {
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
        cySelectors.customAttributeWidget(dataRenderingMockData.resourceUuid).all(({ rows }) => {
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

describe('CustomAttributeWidget: Add, Edit and Delete Interactions', () => {
    let savedCurrentAttributes: AttributeResponseModel[] = [];
    function dispatchUpdateAttributesValueAction(
        type: 'add' | 'edit' | 'delete',
        attributeName: string,
        content?: AttributeResponseModel['content'],
    ) {
        const descriptor = interactionsMockData.attributeDescriptors.find((el) => el.name === attributeName)!;

        switch (type) {
            case 'add':
                savedCurrentAttributes = [
                    ...savedCurrentAttributes,
                    {
                        uuid: descriptor.uuid,
                        name: descriptor.name,
                        type: descriptor.type,
                        label: descriptor.properties.label,
                        contentType: descriptor.contentType,
                        content,
                    },
                ];
                break;
            case 'edit':
                savedCurrentAttributes = savedCurrentAttributes.map((el) => {
                    if (el.name === attributeName) return { ...el, content };
                    return el;
                });
                break;
            case 'delete':
                savedCurrentAttributes = savedCurrentAttributes.filter((el) => el.name !== attributeName);
                cy.dispatchActions(
                    customAttributesActions.removeCustomAttributeContentSuccess({
                        resource: interactionsMockData.resource,
                        resourceUuid: interactionsMockData.resourceUuid,
                        customAttributes: savedCurrentAttributes,
                    }),
                );
                return;
        }
        cy.dispatchActions(
            customAttributesActions.updateCustomAttributeContentSuccess({
                resource: interactionsMockData.resource,
                resourceUuid: interactionsMockData.resourceUuid,
                customAttributes: savedCurrentAttributes,
            }),
        ).wait(reduxActionWait);
    }
    beforeEach(() => {
        savedCurrentAttributes = JSON.parse(JSON.stringify(interactionsMockData.attributes));
        cy.mount(
            <CustomAttributeWidget
                resource={interactionsMockData.resource}
                resourceUuid={interactionsMockData.resourceUuid}
                attributes={savedCurrentAttributes}
            />,
        ).wait(componentLoadWait);
        cy.dispatchActions(customAttributesActions.listResourceCustomAttributesSuccess(interactionsMockData.attributeDescriptors));
    });

    it(`Should be able to edit boolean, text-based, select, multiselect attributes
        Should render current value in the input field if it exists`, () => {
        cySelectors.customAttributeWidget(interactionsMockData.resourceUuid).all(({ rows }) => {
            rows('String').content().should('contain.text', 'content');
            rows('String').actions('edit').click().wait(clickWait);
            rows('String').input().input().should('have.value', 'content');
            rows('String').input().input().clear().type('new-content');
            cy.expectActionAfter(
                () => rows('String').actions('save').click().wait(clickWait),
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => dispatchUpdateAttributesValueAction('edit', 'String', payload.content),
            );
            rows('String').content().should('contain.text', 'new-content');

            rows('Boolean').content().should('contain.text', 'true');
            rows('Boolean').actions('edit').click().wait(clickWait);
            rows('Boolean').input().input().should('be.checked');
            rows('Boolean').input().input().uncheck();

            cy.expectActionAfter(
                () => rows('Boolean').actions('save').click().wait(clickWait),
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => dispatchUpdateAttributesValueAction('edit', 'Boolean', payload.content),
            );
            rows('Boolean').content().should('contain.text', false);

            rows('StringSelect').content().should('contain.text', 'Option1');
            rows('StringSelect').actions('edit').click().wait(clickWait);
            cySelectors.selectInput('StringSelect').all(({ value, selectOption }) => {
                value().should('contain.text', 'Option1');
                selectOption('Option2').click().wait(clickWait);
            });
            cy.expectActionAfter(
                () => rows('StringSelect').actions('save').click().wait(clickWait),
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => dispatchUpdateAttributesValueAction('edit', 'StringSelect', payload.content),
            );
            rows('StringSelect').content().should('contain.text', 'Option2');

            rows('StringMultiselect').content().should('contain.text', 'Option1, Option2');
            rows('StringMultiselect').actions('edit').click().wait(clickWait);
            cySelectors.selectInput('StringMultiselect', 'multi').all(({ values, selectOption }) => {
                values('Option1').delete().click().wait(clickWait);
                values('Option2').value().should('exist');
                selectOption('Option3').click().wait(clickWait);
            });
            cy.expectActionAfter(
                () => rows('StringMultiselect').actions('save').click().wait(clickWait),
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => dispatchUpdateAttributesValueAction('edit', 'StringMultiselect', payload.content),
            );
            rows('StringMultiselect').content().should('contain.text', 'Option2, Option3');
        });
    });
    it(`Should render the old value if the changes are unsaved`, () => {
        cySelectors.customAttributeWidget(interactionsMockData.resourceUuid).all(({ rows }) => {
            rows('String').actions('edit').click().wait(clickWait);
            rows('String').input().input().clear().type('new-content');
            rows('String').actions('cancel').click().wait(clickWait);
            rows('String').content().should('contain.text', 'content');
        });
    });
    it(`Should be able to delete attributes`, () => {
        cySelectors.customAttributeWidget(interactionsMockData.resourceUuid).all(({ rows }) => {
            rows('Boolean').name().should('exist');
            cy.expectActionAfter(
                () => rows('Boolean').actions('delete').click().wait(clickWait),
                slice.actions.removeCustomAttributeContent.match,
                () => dispatchUpdateAttributesValueAction('delete', 'Boolean'),
            );
            rows().should('not.contain.text', 'Boolean');
            rows('StringMultiselect').name().should('exist');
            cy.expectActionAfter(
                () => rows('StringMultiselect').actions('delete').click().wait(clickWait),
                slice.actions.removeCustomAttributeContent.match,
                () => dispatchUpdateAttributesValueAction('delete', 'StringMultiselect'),
            );
            rows().should('not.contain.text', 'StringMultiselect');
        });
    });
    it(`Should be able to delete attribute from edit mode`, () => {
        cySelectors.customAttributeWidget(interactionsMockData.resourceUuid).all(({ rows }) => {
            rows('Boolean').name().should('exist');
            rows('Boolean').actions('edit').click().wait(clickWait);
            cy.expectActionAfter(
                () => rows('Boolean').actions('delete').click().wait(clickWait),
                slice.actions.removeCustomAttributeContent.match,
                () => dispatchUpdateAttributesValueAction('delete', 'Boolean'),
            );
            rows().should('not.contain.text', 'Boolean');
        });
    });

    it(`Attribute selector should not be visible when all attributes have value
        Should be able to add attributes of different types        
        Default value is set when the attribute is selected
        `, () => {
        cySelectors.customAttributeWidget(interactionsMockData.resourceUuid).all(({ rows }) => {
            cySelectors.selectInput('selectCustomAttribute').input().should('not.exist');

            dispatchUpdateAttributesValueAction('delete', 'String');
            dispatchUpdateAttributesValueAction('delete', 'Boolean');
            dispatchUpdateAttributesValueAction('delete', 'StringSelect');
            dispatchUpdateAttributesValueAction('delete', 'StringMultiselect');

            cySelectors.selectInput('selectCustomAttribute').selectOption('String').click().wait(clickWait);
            cy.expectActionAfter(
                () => {
                    cySelectors.input('String').input().should('have.value', 'default-content').clear().type('new-content');
                    cySelectors.input('String').groupButton('save').click().wait(clickWait);
                },
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => {
                    dispatchUpdateAttributesValueAction('add', 'String', payload.content);
                },
            );

            rows('String').content().should('contain.text', 'new-content');

            cySelectors.selectInput('selectCustomAttribute').selectOption('Boolean').click().wait(clickWait);

            cy.expectActionAfter(
                () => {
                    cySelectors.input('Boolean').input().check();
                    cySelectors.input('Boolean').groupButton('save').click().wait(clickWait);
                },
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => {
                    dispatchUpdateAttributesValueAction('add', 'Boolean', payload.content);
                },
            );
            rows('Boolean').content().should('contain.text', 'true');

            cySelectors.selectInput('selectCustomAttribute').selectOption('StringSelect').click().wait(clickWait);
            cy.expectActionAfter(
                () => {
                    cySelectors.selectInput('StringSelect').selectOption('Option1').click().wait(clickWait);
                    cySelectors.selectInput('StringSelect').groupButton('save').click().wait(clickWait);
                },
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => {
                    dispatchUpdateAttributesValueAction('add', 'StringSelect', payload.content);
                },
            );
            rows('StringSelect').content().should('contain.text', 'Option1');

            cySelectors.selectInput('selectCustomAttribute').selectOption('StringMultiselect').click().wait(clickWait);
            cy.expectActionAfter(
                () => {
                    cySelectors.selectInput('StringMultiselect', 'multi').selectOption('Option1').click().wait(clickWait);
                    cySelectors.selectInput('StringMultiselect', 'multi').selectOption('Option2').click().wait(clickWait);
                    cySelectors.selectInput('StringMultiselect', 'multi').groupButton('save').click().wait(clickWait);
                },
                slice.actions.updateCustomAttributeContent.match,
                ({ payload }) => {
                    dispatchUpdateAttributesValueAction('add', 'StringMultiselect', payload.content);
                },
            );
            rows('StringMultiselect').content().should('contain.text', 'Option1, Option2');
        });
    });
});
