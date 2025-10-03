import ComplianceCheckResultWidget from 'components/_pages/certificates/ComplianceCheckResultWidget/ComplianceCheckResultWidget';
import AttributeViewer from 'components/Attributes/AttributeViewer';
import Dialog from 'components/Dialog';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { useState } from 'react';
import { AttributeResponseModel } from 'types/attributes';
import { Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import '../../../src/resources/styles/theme.scss';
import { actions as complianceProfilesActions } from 'ducks/compliance-profiles';
import { mockComplianceCheckResult } from './mock-data';

const CertificateComplianceCheck = () => {
    const [selectedAttributesInfo, setSelectedAttributesInfo] = useState<AttributeResponseModel[] | null>(null);
    return (
        <>
            <ComplianceCheckResultWidget
                objectUuid="dda09fb2-0d15-4b7e-85ed-e7e9f2b61bb9"
                resource={Resource.Certificates}
                widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                setSelectedAttributesInfo={setSelectedAttributesInfo}
            />
            <Dialog
                isOpen={!!selectedAttributesInfo}
                caption="Attributes Info"
                body={<AttributeViewer attributes={selectedAttributesInfo ?? []} />}
                toggle={() => setSelectedAttributesInfo(null)}
                buttons={[]}
                dataTestId="attributes-info-dialog"
            />
        </>
    );
};

describe('Certificate Validation  Component', () => {
    beforeEach(() => {
        cy.mount(<CertificateComplianceCheck />).wait(componentLoadWait);
        cy.dispatchActions();
        cy.window().then((win) => {
            win.store.dispatch(
                complianceProfilesActions.getComplianceCheckResultSuccess({
                    resource: Resource.Certificates,
                    objectUuid: 'dda09fb2-0d15-4b7e-85ed-e7e9f2b61bb9',
                    complianceCheckResult: mockComplianceCheckResult,
                }),
            );
        });
    });

    it('should render compliance status widget with data', () => {
        cy.get('[data-testid="compliance-status-widget"]').should('be.visible');
        cy.contains('Compliance Status').should('be.visible');

        cy.contains('Status:').should('be.visible');
        cy.contains('Checked:').should('be.visible');
        cy.contains('2025-10-01 20:11:20').should('be.visible');

        cy.get('table').should('be.visible');
        cy.contains('Name').should('be.visible');
        cy.contains('Description').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('Provider').should('be.visible');
        cy.contains('Kind').should('be.visible');
        cy.contains('Attributes').should('be.visible');
    });

    it('should render correct rows amount', () => {
        cy.get('table tbody tr').should('have.length', mockComplianceCheckResult.failedRules.length);
    });

    it('should render correct columns amount', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('td').should('have.length', 6);
            });
    });

    it('should render name for each row', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'cus_key_length');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'e_subject_organizational_unit_name_max_length');
            });

        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'e_ext_ian_no_entries');
            });
    });

    it('should render description for each row', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(1).should('contain.text', 'Public Key length of the certificate should be');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td')
                    .eq(1)
                    .should('contain.text', "The 'Organizational Unit Name' field of the subject MUST be less than 65 characters");
            });

        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(1).should('contain.text', 'If present, the IAN extension must contain at least one entry');
            });
    });

    it('should render status for each row', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(2).should('not.be.empty');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(2).should('not.be.empty');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(2).should('not.be.empty');
            });
    });

    it('should render provider for each row', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(3).should('contain.text', 'X509-Compliance-Provider');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(3).should('contain.text', 'X509-Compliance-Provider');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(3).should('contain.text', 'X509-Compliance-Provider');
            });
    });

    it('should render kind for each row', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(4).should('contain.text', 'x509');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(4).should('contain.text', 'x509');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(4).should('contain.text', 'x509');
            });
    });

    it('should render attributes info icon if has attributes', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(5).find('button[title="Attributes"]').should('exist');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(5).find('button[title="Attributes"]').should('not.exist');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(5).find('button[title="Attributes"]').should('not.exist');
            });
    });

    it('should open attributes dialog when clicking info button', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('button[title="Attributes"]').click().wait(clickWait);
            });
        cy.contains('Attributes Info').should('be.visible');
        cy.contains('Condition').should('be.visible');
        cy.contains('Key Length').should('be.visible');
        cy.contains('Equals').should('be.visible');
        cy.contains('1').should('be.visible');
    });

    it('should close attributes dialog when clicking close', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('button[title="Attributes"]').click().wait(clickWait);
            });

        cy.contains('Attributes Info').should('be.visible');
        cy.get('.modal-header .btn-close').click().wait(clickWait);
        cy.contains('Attributes Info').should('not.exist');
    });
    it('should display correct compliance status badges', () => {
        cy.get('table tbody tr').should('have.length', 3);
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(2).should('not.be.empty');
            });
        });
    });

    it('should show refresh button and handle refresh action', () => {
        cy.get('.fa-refresh').should('be.visible');
        cy.get('.fa-refresh').click().wait(clickWait);
        cy.get('[data-testid="compliance-status-widget"]').should('be.visible');
    });
});
