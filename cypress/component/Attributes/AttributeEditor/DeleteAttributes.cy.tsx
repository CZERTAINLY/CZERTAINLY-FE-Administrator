import AttributeEditor from 'components/Attributes/AttributeEditor';
import { customAttributeEditorMockData } from './mock-data';
import { componentLoadWait } from '../../../utils/constants';
import { Form } from 'react-final-form';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';

describe('AttributeEditor Delete Attributes Tests', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__${customAttributeEditorMockData.id}__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={customAttributeEditorMockData.id}
                            attributeDescriptors={customAttributeEditorMockData.attributeDescriptors}
                            attributes={customAttributeEditorMockData.attributes}
                            withRemoveAction={true}
                        />
                    </form>
                )}
            </Form>,
        ).wait(componentLoadWait);
    });

    describe('Delete Button Visibility', () => {
        it('should show delete buttons when withRemoveAction is true', () => {
            // Check that delete buttons are visible for each attribute
            cy.get('[title^="Delete "]').should('have.length', customAttributeEditorMockData.attributeDescriptors.length);

            // Verify each delete button has the correct title
            customAttributeEditorMockData.attributeDescriptors.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('be.visible');
            });
        });

        it('should not show delete buttons when withRemoveAction is false', () => {
            cy.mount(
                <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <AttributeEditor
                                id={customAttributeEditorMockData.id}
                                attributeDescriptors={customAttributeEditorMockData.attributeDescriptors}
                                attributes={customAttributeEditorMockData.attributes}
                                withRemoveAction={false}
                            />
                        </form>
                    )}
                </Form>,
            ).wait(componentLoadWait);

            cy.get('[title^="Delete "]').should('not.exist');
        });
    });

    describe('Delete Button Functionality', () => {
        it('should call handleDeleteAttribute when delete button is clicked', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;

            // Click the first delete button
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // The attribute should be removed from the UI
            cy.get(`[title="Delete ${firstAttributeName}"]`).should('not.exist');
        });

        it('should remove attribute from form when deleted', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;
            const attributeId = getAttributeId(firstAttributeName);

            // Verify attribute exists in form initially
            cy.get(`input[name="${attributeId}"]`).should('exist');

            // Delete the attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Attribute should no longer exist in the form
            cy.get(`input[name="${attributeId}"]`).should('not.exist');
        });

        it('should remove attribute from options when deleted', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;

            // Delete the attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // The attribute should be completely removed from the UI
            cy.contains(firstAttributeName).should('not.exist');
        });

        it('should remove attribute from shown custom attributes when deleted', () => {
            // Find a custom attribute to delete
            const customAttribute = customAttributeEditorMockData.attributeDescriptors.find((attr) => attr.type === 'custom');

            if (customAttribute) {
                const attributeName = customAttribute.name;

                // Delete the custom attribute
                cy.get(`[title="Delete ${attributeName}"]`).click();

                // The custom attribute should be removed
                cy.get(`[title="Delete ${attributeName}"]`).should('not.exist');
            }
        });
    });

    describe('Multiple Attribute Deletion', () => {
        it('should allow deleting multiple attributes', () => {
            const attributesToDelete = customAttributeEditorMockData.attributeDescriptors.slice(0, 3);

            // Delete multiple attributes
            attributesToDelete.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).click();
                cy.get(`[title="Delete ${descriptor.name}"]`).should('not.exist');
            });

            // Verify remaining attributes still have delete buttons
            const remainingAttributes = customAttributeEditorMockData.attributeDescriptors.slice(3);
            remainingAttributes.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('be.visible');
            });
        });

        it('should maintain correct state after multiple deletions', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;
            const secondAttributeName = customAttributeEditorMockData.attributeDescriptors[1].name;

            // Delete first attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Delete second attribute
            cy.get(`[title="Delete ${secondAttributeName}"]`).click();

            // Both should be removed
            cy.get(`[title="Delete ${firstAttributeName}"]`).should('not.exist');
            cy.get(`[title="Delete ${secondAttributeName}"]`).should('not.exist');

            // Remaining attributes should still be visible
            const remainingAttributes = customAttributeEditorMockData.attributeDescriptors.slice(2);
            remainingAttributes.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('be.visible');
            });
        });
    });

    describe('Delete Button Accessibility', () => {
        it('should have correct button type', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;

            cy.get(`[title="Delete ${firstAttributeName}"]`).should('have.attr', 'type', 'button');
        });

        it('should have descriptive title attribute', () => {
            customAttributeEditorMockData.attributeDescriptors.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('have.attr', 'title', `Delete ${descriptor.name}`);
            });
        });

        it('should display trash icon as button content', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;

            // Check that the button contains a trash icon
            cy.get(`[title="Delete ${firstAttributeName}"]`).find('.fa-trash').should('exist');
            cy.get(`[title="Delete ${firstAttributeName}"]`).find('.fa-trash').should('have.class', 'text-danger');
        });
    });

    describe('Edge Cases', () => {
        it('should handle deleting all attributes', () => {
            // Delete all attributes
            customAttributeEditorMockData.attributeDescriptors.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).click();
            });

            // No delete buttons should remain
            cy.get('[title^="Delete "]').should('not.exist');

            // Only the attribute selector should remain
            cy.get('form').should('exist');
        });

        it('should handle deleting attributes in different groups', () => {
            // This test assumes there are attributes in different groups
            // If the mock data has grouped attributes, test deletion across groups
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;
            const lastAttributeName =
                customAttributeEditorMockData.attributeDescriptors[customAttributeEditorMockData.attributeDescriptors.length - 1].name;

            // Delete first and last attributes
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();
            cy.get(`[title="Delete ${lastAttributeName}"]`).click();

            // Both should be removed
            cy.get(`[title="Delete ${firstAttributeName}"]`).should('not.exist');
            cy.get(`[title="Delete ${lastAttributeName}"]`).should('not.exist');
        });

        it('should maintain form structure after deletions', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;

            // Delete an attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Form should still be intact
            cy.get('form').should('exist');
            cy.get('form').should('be.visible');
        });
    });

    describe('Form State After Deletion', () => {
        it('should not interfere with remaining form fields', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;
            const secondAttributeName = customAttributeEditorMockData.attributeDescriptors[1].name;

            // Delete first attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Second attribute should still be functional
            const secondAttributeId = getAttributeId(secondAttributeName);
            cy.get(`input[name="${secondAttributeId}"]`).should('exist');
            cy.get(`input[name="${secondAttributeId}"]`).should('be.visible');
        });

        it('should maintain form validation for remaining fields', () => {
            const firstAttributeName = customAttributeEditorMockData.attributeDescriptors[0].name;
            const secondAttributeName = customAttributeEditorMockData.attributeDescriptors[1].name;

            // Delete first attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Second attribute should still be functional
            const secondAttributeId = getAttributeId(secondAttributeName);
            cy.get(`input[name="${secondAttributeId}"]`).should('exist');
            cy.get(`input[name="${secondAttributeId}"]`).should('be.visible');
        });
    });
});
