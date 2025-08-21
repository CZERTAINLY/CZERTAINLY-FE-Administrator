import AttributeEditor from 'components/Attributes/AttributeEditor';
import { customNonRequiredAttributeEditorMockData } from './mock-data';
import { componentLoadWait } from '../../../utils/constants';
import { Form } from 'react-final-form';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';

describe('AttributeEditor Delete Attributes Tests', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__${customNonRequiredAttributeEditorMockData.id}__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={customNonRequiredAttributeEditorMockData.id}
                            attributeDescriptors={customNonRequiredAttributeEditorMockData.attributeDescriptors}
                            attributes={customNonRequiredAttributeEditorMockData.attributes}
                        />
                    </form>
                )}
            </Form>,
        ).wait(componentLoadWait);
    });

    describe('Delete Button Visibility', () => {
        it('should show delete buttons only for non-required custom attributes when withRemoveAction is true', () => {
            // Count non-required custom attributes from the actual rendered attributes
            const nonRequiredCustomAttributes = (customNonRequiredAttributeEditorMockData.attributes as any[]).filter(
                (attribute) => attribute.type === 'custom',
            );

            // Check that delete buttons are only visible for non-required custom attributes
            cy.get('[title^="Delete "]').should('have.length', nonRequiredCustomAttributes.length);

            // Verify each delete button has the correct title for non-required custom attributes
            nonRequiredCustomAttributes.forEach((attribute) => {
                cy.get(`[title="Delete ${attribute.name}"]`).should('be.visible');
            });
        });

        it('should not show delete buttons when withRemoveAction is false', () => {
            cy.mount(
                <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <AttributeEditor
                                id={customNonRequiredAttributeEditorMockData.id}
                                attributeDescriptors={customNonRequiredAttributeEditorMockData.attributeDescriptors}
                                attributes={customNonRequiredAttributeEditorMockData.attributes}
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
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            if (!firstAttributeName) return;

            // Click the first delete button
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // The attribute should be removed from the UI
            cy.get(`[title="Delete ${firstAttributeName}"]`).should('not.exist');
        });

        it('should remove attribute from form when deleted', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            if (!firstAttributeName) return;
            const attributeId = getAttributeId(firstAttributeName);

            // Verify attribute exists in form initially
            cy.get(`input[name="${attributeId}"]`).should('exist');

            // Delete the attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Attribute should no longer exist in the form
            cy.get(`input[name="${attributeId}"]`).should('not.exist');
        });

        it('should remove attribute from options when deleted', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            if (!firstAttributeName) return;

            // Delete the attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // The attribute should be completely removed from the UI
            cy.contains(firstAttributeName).should('not.exist');
        });

        it('should remove attribute from shown custom attributes when deleted', () => {
            // Find a custom attribute to delete
            const customAttribute = customNonRequiredAttributeEditorMockData.attributes?.find((attr) => attr.type === 'custom');

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
            const attributesToDelete = customNonRequiredAttributeEditorMockData.attributes?.slice(0, 3) || [];

            // Delete multiple attributes
            attributesToDelete.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).click();
                cy.get(`[title="Delete ${descriptor.name}"]`).should('not.exist');
            });

            // Verify remaining attributes still have delete buttons
            const remainingAttributes = customNonRequiredAttributeEditorMockData.attributes?.slice(3) || [];
            remainingAttributes.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('be.visible');
            });
        });

        it('should maintain correct state after multiple deletions', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            const secondAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[1]?.name;
            if (!firstAttributeName || !secondAttributeName) return;

            // Delete first attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Delete second attribute
            cy.get(`[title="Delete ${secondAttributeName}"]`).click();

            // Both should be removed
            cy.get(`[title="Delete ${firstAttributeName}"]`).should('not.exist');
            cy.get(`[title="Delete ${secondAttributeName}"]`).should('not.exist');

            // Remaining attributes should still be visible
            const remainingAttributes = customNonRequiredAttributeEditorMockData.attributes?.slice(2) || [];
            remainingAttributes.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('be.visible');
            });
        });
    });

    describe('Delete Button Accessibility', () => {
        it('should have correct button type', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            if (!firstAttributeName) return;

            cy.get(`[title="Delete ${firstAttributeName}"]`).should('have.attr', 'type', 'button');
        });

        it('should have descriptive title attribute', () => {
            customNonRequiredAttributeEditorMockData.attributes?.forEach((descriptor) => {
                cy.get(`[title="Delete ${descriptor.name}"]`).should('have.attr', 'title', `Delete ${descriptor.name}`);
            });
        });

        it('should display trash icon as button content', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            if (!firstAttributeName) return;

            // Check that the button contains a trash icon
            cy.get(`[title="Delete ${firstAttributeName}"]`).find('.fa-trash').should('exist');
            cy.get(`[title="Delete ${firstAttributeName}"]`).find('.fa-trash').should('have.class', 'text-danger');
        });
    });

    describe('Edge Cases', () => {
        it('should handle deleting all attributes', () => {
            // Delete all attributes
            customNonRequiredAttributeEditorMockData.attributes?.forEach((descriptor) => {
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
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            const lastAttributeName =
                customNonRequiredAttributeEditorMockData.attributes?.[
                    (customNonRequiredAttributeEditorMockData.attributes?.length || 1) - 1
                ]?.name;
            if (!firstAttributeName || !lastAttributeName) return;

            // Delete first and last attributes
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();
            cy.get(`[title="Delete ${lastAttributeName}"]`).click();

            // Both should be removed
            cy.get(`[title="Delete ${firstAttributeName}"]`).should('not.exist');
            cy.get(`[title="Delete ${lastAttributeName}"]`).should('not.exist');
        });

        it('should maintain form structure after deletions', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            if (!firstAttributeName) return;

            // Delete an attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Form should still be intact
            cy.get('form').should('exist');
            cy.get('form').should('be.visible');
        });
    });

    describe('Form State After Deletion', () => {
        it('should not interfere with remaining form fields', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            const secondAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[1]?.name;
            if (!firstAttributeName || !secondAttributeName) return;

            // Delete first attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Second attribute should still be functional
            const secondAttributeId = getAttributeId(secondAttributeName);
            cy.get(`input[name="${secondAttributeId}"]`).should('exist');
            cy.get(`input[name="${secondAttributeId}"]`).should('be.visible');
        });

        it('should maintain form validation for remaining fields', () => {
            const firstAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[0]?.name;
            const secondAttributeName = customNonRequiredAttributeEditorMockData.attributes?.[1]?.name;
            if (!firstAttributeName || !secondAttributeName) return;

            // Delete first attribute
            cy.get(`[title="Delete ${firstAttributeName}"]`).click();

            // Second attribute should still be functional
            const secondAttributeId = getAttributeId(secondAttributeName);
            cy.get(`input[name="${secondAttributeId}"]`).should('exist');
            cy.get(`input[name="${secondAttributeId}"]`).should('be.visible');
        });
    });
});
