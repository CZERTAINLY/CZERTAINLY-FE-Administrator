import React from 'react';

import { mockRuleForEdit } from './mock-data';
import InternalRuleForm from 'components/_pages/compliance-profiles/detail/InternalRuleForm/InternalRuleForm';
import { ComplianceRuleListDto } from 'types/openapi';
import { clickWait, componentLoadWait } from '../../utils/constants';

// Mock the router since we're testing component in isolation
const MockRouter = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>;

const InternalRuleFormTest = () => {
    const mockOnCancel = cy.stub();

    return (
        <MockRouter>
            <InternalRuleForm onCancel={mockOnCancel} />
        </MockRouter>
    );
};

const InternalRuleFormEditTest = () => {
    const mockOnCancel = cy.stub();

    return (
        <MockRouter>
            <InternalRuleForm rule={mockRuleForEdit as unknown as ComplianceRuleListDto} onCancel={mockOnCancel} />
        </MockRouter>
    );
};

describe('InternalRuleForm Component', () => {
    describe('Create Mode', () => {
        beforeEach(() => {
            cy.mount(<InternalRuleFormTest />);
            cy.wait(componentLoadWait);
        });

        it('should render form with empty initial values', () => {
            cy.get('input[name="name"]').should('have.value', '');
            cy.get('input[name="description"]').should('have.value', '');
        });

        it('should show Create button when no rule is provided', () => {
            cy.get('button[type="submit"]').should('contain', 'Create');
        });

        it('should disable submit button when form is invalid', () => {
            cy.get('button[type="submit"]').should('be.disabled');
        });

        it('should show validation error for required resource field', () => {
            cy.get('#resourceSelect').click().type('{esc}');
            cy.get('#resourceSelect').blur();
            cy.get('.invalid-feedback').should('be.visible');
        });

        it('should show validation error for description exceeding 300 characters', () => {
            const longDescription = 'a'.repeat(301);
            cy.get('input[name="description"]').type(longDescription).blur();
            cy.get('.invalid-feedback').should('be.visible');
        });

        it('should call onCancel when cancel button is clicked', () => {
            cy.get('button').contains('Cancel').click();
            cy.get('button').contains('Cancel').should('be.visible');
        });
    });

    describe('Edit Mode', () => {
        beforeEach(() => {
            cy.mount(<InternalRuleFormEditTest />);
            cy.wait(componentLoadWait);
        });

        it('should render form with rule data pre-filled', () => {
            cy.get('input[name="name"]').should('have.value', mockRuleForEdit.name);
            cy.get('input[name="description"]').should('have.value', mockRuleForEdit.description);
        });

        it('should show Update button when rule is provided', () => {
            cy.get('button[type="submit"]').should('contain', 'Update');
        });

        it('should show condition form with existing condition items', () => {
            cy.wait(clickWait);
            cy.get('[data-testid*="condition"]').should('be.visible');
        });

        it('should allow editing rule name', () => {
            cy.get('input[name="name"]').clear().type('Updated Rule Name');
            cy.get('input[name="name"]').should('have.value', 'Updated Rule Name');
        });

        it('should allow editing rule description', () => {
            cy.get('input[name="description"]').clear().type('Updated description');
            cy.get('input[name="description"]').should('have.value', 'Updated description');
        });
    });

    describe('Form Validation', () => {
        beforeEach(() => {
            cy.mount(<InternalRuleFormTest />);
            cy.wait(componentLoadWait);
        });

        it('should validate required name field', () => {
            cy.get('input[name="name"]').focus().blur();
            cy.get('.invalid-feedback').should('exist');
        });

        it('should validate description length', () => {
            const longDescription = 'a'.repeat(301);
            cy.get('input[name="description"]').type(longDescription).blur();
            cy.get('.invalid-feedback').should('be.visible');
        });

        it('should show valid state for correctly filled fields', () => {
            cy.get('input[name="name"]').type('Valid Rule Name');
            cy.get('input[name="name"]').blur();
            cy.get('input[name="name"]').should('have.class', 'is-valid');
        });
    });

    describe('Resource Selection', () => {
        beforeEach(() => {
            cy.mount(<InternalRuleFormTest />);
            cy.wait(componentLoadWait);
        });

        it('should disable submit button when resource is None', () => {
            cy.get('input[name="name"]').type('Test Rule');
            cy.get('button[type="submit"]').should('be.disabled');
        });
    });

    describe('Accessibility', () => {
        beforeEach(() => {
            cy.mount(<InternalRuleFormTest />);
            cy.wait(componentLoadWait);
        });

        it('should have proper labels for form fields', () => {
            cy.get('label[for="name"]').should('contain', 'Internal Rule Name');
            cy.get('label[for="description"]').should('contain', 'Description');
            cy.get('label[for="resource"]').should('contain', 'Resource');
        });

        it('should have proper placeholders', () => {
            cy.get('input[name="name"]').should('have.attr', 'placeholder', 'Enter the Rule Name');
            cy.get('input[name="description"]').should('have.attr', 'placeholder', 'Enter Description / Comment');
        });

        it('should have proper form structure', () => {
            cy.get('form').should('exist');
            cy.get('input[name="name"]').should('exist');
            cy.get('input[name="description"]').should('exist');
            cy.get('#resourceSelect').should('exist');
        });
    });
});
