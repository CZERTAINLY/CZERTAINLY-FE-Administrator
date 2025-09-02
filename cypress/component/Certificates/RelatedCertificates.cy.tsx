import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'ducks/reducers';
import CertificateDetail from 'components/_pages/certificates/detail';
import { mockCertificate, mockCertificateRelations, mockCertificates } from './mock-data';

// Mock the router since we're testing component in isolation
const MockRouter = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>;

// Mock the certificate detail component to focus on related certificates
const RelatedCertificatesTest = () => {
    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            certificates: {
                certificateDetail: mockCertificate,
                certificateRelations: mockCertificateRelations,
                certificates: mockCertificates,
                isFetchingDetail: false,
                isAssociating: false,
                isDeassociating: false,
                isFetchingRelations: false,
                deleteErrorMessage: '',
                issuanceAttributes: {},
                revocationAttributes: [],
                isFetchingValidationResult: false,
                isFetchingHistory: false,
                isFetchingLocations: false,
                isFetchingApprovals: false,
                isFetchingCertificateChain: false,
                isFetchingCertificateDownloadContent: false,
                isFetchingCertificateChainDownloadContent: false,
                isIssuing: false,
                isRevoking: false,
                isRenewing: false,
                isRekeying: false,
                isDeleting: false,
                isBulkDeleting: false,
                isUpdatingGroup: false,
                isUpdatingRaProfile: false,
                isUpdatingOwner: false,
                isUpdatingTrustedStatus: false,
                isBulkUpdatingGroup: false,
                isBulkUpdatingRaProfile: false,
                isBulkUpdatingOwner: false,
                isUploading: false,
                isFetchingIssuanceAttributes: false,
                isFetchingRevocationAttributes: false,
                isCheckingCompliance: false,
                isFetchingCsrAttributes: false,
                csrAttributeDescriptors: [],
                isFetchingContents: false,
                isIncludeArchived: false,
                isArchiving: false,
                isBulkArchiving: false,
                isBulkUnarchiving: false,
            },
        },
    });

    return (
        <Provider store={store}>
            <MockRouter>
                <CertificateDetail />
            </MockRouter>
        </Provider>
    );
};

describe('Related Certificates Component', () => {
    beforeEach(() => {
        cy.mount(<RelatedCertificatesTest />);
    });

    it('should render related certificates section', () => {
        cy.contains('Related Certificates').should('be.visible');
    });

    it('should show add and remove buttons', () => {
        cy.get('[title="Add related certificate"]').should('be.visible');
        cy.get('[data-testid="remove_related_certificate-button"]').should('be.visible');
    });

    it('should disable remove button when no certificates are selected', () => {
        cy.get('[data-testid="remove_related_certificate-button"]').should('be.disabled');
    });

    it('should enable remove button when certificate is selected', () => {
        // Mock certificate with relations by updating the store directly
        cy.window().then((win) => {
            win.store.dispatch({
                type: 'certificates/getCertificateDetailSuccess',
                payload: {
                    certificate: {
                        ...mockCertificate,
                        relatedCertificates: [
                            {
                                uuid: 'related-cert-456',
                                commonName: 'Related Certificate',
                                serialNumber: '987654321',
                                state: 'ISSUED',
                                validationStatus: 'VALID',
                            },
                        ],
                    },
                },
            });
        });

        // Select a 1st certificate
        cy.get('#ebcd4e0f-a3a2-4080-beac-6c9ea3972768__checkbox__').check();
        // Verify remove button is enabled
        cy.get('[data-testid="remove_related_certificate-button"]').should('not.be.disabled');
    });

    it('should open add dialog when plus button is clicked', () => {
        cy.get('[data-testid="add_related_certificate-button"]').click();
        cy.contains('h5', 'Add Related Certificate').should('be.visible');
    });

    it('should close add dialog when cancel is clicked', () => {
        cy.get('[data-testid="add_related_certificate-button"]').click();
        cy.contains('Add Related Certificate').should('be.visible');

        cy.contains('Cancel').click();
        cy.contains('Add Related Certificate').should('not.exist');
    });

    it('should show confirmation dialog when remove is clicked', () => {
        // Mock certificate relations by updating the store directly
        cy.window().then((win) => {
            win.store.dispatch({
                type: 'certificates/getCertificateRelationsSuccess',
                payload: {
                    certificateRelations: {
                        certificateUuid: mockCertificate.uuid,
                        predecessorCertificates: [
                            {
                                uuid: 'related-cert-456',
                                commonName: 'Related Certificate',
                                serialNumber: '987654321',
                                state: 'Issued',
                                certificateType: 'X509',
                                publicKeyAlgorithm: 'RSA',
                                subjectDn: 'CN=Related Certificate',
                                relationType: 'predecessor',
                            },
                        ],
                        successorCertificates: [],
                    },
                },
            });
        });

        // Select a 1st certificate
        cy.get('#ebcd4e0f-a3a2-4080-beac-6c9ea3972768__checkbox__').check();

        // Click remove button
        cy.get('[data-testid="remove_related_certificate-button"]').click();

        // Verify confirmation dialog is shown
        cy.contains('Delete Related Certificate').should('be.visible');
    });

    it('should close confirmation dialog when cancel is clicked', () => {
        // Mock certificate relations by updating the store directly
        cy.window().then((win) => {
            win.store.dispatch({
                type: 'certificates/getCertificateRelationsSuccess',
                payload: {
                    certificateRelations: {
                        certificateUuid: mockCertificate.uuid,
                        predecessorCertificates: [
                            {
                                uuid: 'related-cert-456',
                                commonName: 'Related Certificate',
                                serialNumber: '987654321',
                                state: 'Issued',
                                certificateType: 'X509',
                                publicKeyAlgorithm: 'RSA',
                                subjectDn: 'CN=Related Certificate',
                                relationType: 'predecessor',
                            },
                        ],
                        successorCertificates: [],
                    },
                },
            });
        });

        // Select a 1st certificate
        cy.get('#ebcd4e0f-a3a2-4080-beac-6c9ea3972768__checkbox__').check();

        // Click remove button
        cy.get('[data-testid="remove_related_certificate-button"]').click();

        // Verify confirmation dialog is shown
        cy.contains('Delete Related Certificate').should('be.visible');

        // Click cancel
        cy.contains('Cancel').click();

        // Verify confirmation dialog is closed
        cy.contains('Delete Related Certificate').should('not.exist');
    });
});
