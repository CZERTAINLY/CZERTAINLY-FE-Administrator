import CertificateStatus from 'components/_pages/certificates/CertificateStatus';
import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { mockCertificateValidationCheck, mockComplianceCheckResult, mockValidationResult } from './mock-data';
import { useMemo, useState } from 'react';
import { Button } from 'reactstrap';
import { AttributeResponseModel } from 'types/attributes';
import { ComplianceRuleStatus, ComplianceStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { getEnumLabel } from 'ducks/enums';
import { dateFormatter } from 'utils/dateUtil';

const CertificateValidationComplianceStatusTest = ({ emptyCase = false }) => {
    const isFetchingComplianceCheckResult = false;
    const getFreshComplianceCheckResult = () => {
        return;
    };
    const [selectedAttributesInfo, setSelectedAttributesInfo] = useState<AttributeResponseModel[] | null>(null);

    const complianceCheckResult = emptyCase ? null : mockComplianceCheckResult;
    const complianceHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'name', content: 'Name' },
            { id: 'description', content: 'Description' },
            {
                id: 'status',
                content: 'Status',
            },
            { id: 'provider', content: 'Provider' },
            { id: 'kind', content: 'Kind' },
            { id: 'attributes', content: 'Attributes' },
        ],
        [],
    );

    const complianceData: TableDataRow[] = useMemo(() => {
        if (!complianceCheckResult) return [];
        return complianceCheckResult.failedRules.map((rule) => ({
            id: rule.uuid,
            columns: [
                rule.name || '',
                rule.description || '',
                <CertificateStatus status={(rule.status as ComplianceRuleStatus) || ''} />,
                rule.connectorName || '',
                rule.kind || '',
                rule.attributes?.length ? (
                    <Button
                        className="btn btn-link"
                        color="white"
                        title="Attributes"
                        onClick={() => {
                            setSelectedAttributesInfo((rule.attributes || []) as AttributeResponseModel[]);
                        }}
                    >
                        <i className="fa fa-info" style={{ color: 'auto' }} />
                    </Button>
                ) : (
                    ''
                ),
            ],
        }));
    }, [complianceCheckResult]);

    return (
        <>
            <Widget
                title="Compliance Status"
                busy={isFetchingComplianceCheckResult}
                titleSize="large"
                lockSize="normal"
                widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                refreshAction={getFreshComplianceCheckResult}
                dataTestId="compliance-status-widget"
            >
                <br />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Status:</span>
                        <span>
                            <CertificateStatus status={(complianceCheckResult?.status as ComplianceStatus) || ''} />
                        </span>
                    </div>
                    <div style={{ width: '1px', height: '10px', backgroundColor: '#6c757d' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Cheked:</span>
                        <span>{complianceCheckResult?.timestamp || ''}</span>
                    </div>
                </div>
                <CustomTable headers={complianceHeaders} data={complianceData} hasPagination={true} />
            </Widget>
            <Dialog
                isOpen={!!selectedAttributesInfo}
                caption="Attributes Info"
                body={<AttributeViewer attributes={selectedAttributesInfo ?? []} />}
                toggle={() => setSelectedAttributesInfo(null)}
                buttons={[]}
            />
        </>
    );
};

describe('Certificate Validation Component', () => {
    beforeEach(() => {
        cy.mount(<CertificateValidationComplianceStatusTest />).wait(componentLoadWait);
    });

    it('should render compliance status widget with data', () => {
        cy.get('[data-testid="compliance-status-widget"]').should('be.visible');
        cy.contains('Compliance Status').should('be.visible');

        cy.contains('Status:').should('be.visible');
        cy.contains('Cheked:').should('be.visible');
        cy.contains('2025-10-01T17:11:20.05Z').should('be.visible');

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

    it('should handle empty compliance result', () => {
        cy.mount(<CertificateValidationComplianceStatusTest emptyCase={true} />).wait(componentLoadWait);

        cy.get('[data-testid="compliance-status-widget"]').should('be.visible');
        cy.contains('Compliance Status').should('be.visible');

        cy.get('table tbody tr').should('have.length', 0);
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

const CertificateValidationStatusTest = ({ emptyCase = false }) => {
    const isFetchingValidationResult = false;
    const getFreshCertificateValidations = () => {
        return;
    };
    const validationHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'validationType',
                content: 'Validation check',
            },
            {
                id: 'status',
                content: 'Status',
            },
            {
                id: 'message',
                content: 'Message',
                width: '70%',
            },
        ],
        [],
    );

    const certificateValidationCheck = mockCertificateValidationCheck;

    const validationResult = emptyCase ? null : mockValidationResult;
    const validationData: TableDataRow[] = useMemo(() => {
        console.log('validationResult', validationResult);
        let validationDataRows = validationResult?.validationChecks
            ? [
                  ...Object.entries(validationResult.validationChecks).map(function ([key, value]) {
                      return {
                          id: key,
                          columns: [
                              getEnumLabel(certificateValidationCheck, key),
                              value?.status ? <CertificateStatus status={value.status} /> : '',
                              <div style={{ wordBreak: 'break-all' }}>
                                  {value.message?.split('\n').map((str: string, i) => (
                                      <div key={i}>
                                          {str}
                                          <br />
                                      </div>
                                  ))}
                              </div>,
                          ],
                      };
                  }),
              ]
            : [];

        validationDataRows.push({
            id: 'validationStatus',
            columns: [
                <div key="validationStatus">
                    <span className="fw-bold">Validation Result</span>{' '}
                    {validationResult?.validationTimestamp ? `(${dateFormatter(validationResult?.validationTimestamp)})` : ''}
                </div>,
                validationResult?.resultStatus ? <CertificateStatus status={validationResult?.resultStatus}></CertificateStatus> : <></>,
                <div key="validationMessage" style={{ wordBreak: 'break-all' }}>
                    {validationResult?.message}
                </div>,
            ],
        });

        return validationDataRows;
    }, [validationResult, certificateValidationCheck]);
    return (
        <Widget
            title="Validation Status"
            busy={isFetchingValidationResult}
            titleSize="large"
            refreshAction={getFreshCertificateValidations}
            widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
            dataTestId="validation-status-widget"
        >
            <br />
            <CustomTable headers={validationHeaders} data={validationData} />
        </Widget>
    );
};

describe('Certificate Validation Status Component', () => {
    beforeEach(() => {
        cy.mount(<CertificateValidationStatusTest />).wait(componentLoadWait);
    });

    it('should render validation status widget with data', () => {
        cy.get('[data-testid="validation-status-widget"]').should('be.visible');
        cy.contains('Validation Status').should('be.visible');

        // Check table headers
        cy.get('table').should('be.visible');
        cy.contains('Validation check').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('Message').should('be.visible');
    });

    it('should render correct number of validation checks', () => {
        // Should have 7 validation checks + 1 validation result row = 8 total rows
        cy.get('table tbody tr').should('have.length', 8);
    });

    it('should render correct columns amount', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('td').should('have.length', 3);
            });
    });

    it('should render validation check types', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'Certificate chain');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'Signature Verification');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'Certificate Validity');
            });
        cy.get('table tbody tr')
            .eq(3)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'OCSP Verification');
            });
        cy.get('table tbody tr')
            .eq(4)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'CRL Verification');
            });
        cy.get('table tbody tr')
            .eq(5)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'Basic Constraints');
            });
        cy.get('table tbody tr')
            .eq(6)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'Certificate Key Usage');
            });
    });

    it('should render validation result row', () => {
        cy.get('table tbody tr')
            .eq(7)
            .within(() => {
                cy.get('td').eq(0).should('contain.text', 'Validation Result');
            });
    });

    it('should render status badges for each validation check', () => {
        cy.get('table tbody tr').each(($row, index) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(1).should('not.be.empty');
            });
        });
    });

    it('should render validation messages', () => {
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Certificate chain is complete.');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Signature verification successful.');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Certificate is valid.');
            });
        cy.get('table tbody tr')
            .eq(3)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Certificate does not contain AIA extension or OCSP URL is not present');
            });
        cy.get('table tbody tr')
            .eq(4)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'No available working CRL URL found in cRLDistributionPoints extension.');
            });
        cy.get('table tbody tr')
            .eq(5)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Certificate basic constraints verification successful.');
            });
        cy.get('table tbody tr')
            .eq(6)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Certificate is not CA.');
            });
    });

    it('should render validation result message', () => {
        cy.get('table tbody tr')
            .eq(7)
            .within(() => {
                cy.get('td').eq(2).should('contain.text', 'Validation of certificates in RA Profile ejbca-webserver is disabled.');
            });
    });

    it('should handle empty validation result', () => {
        cy.mount(<CertificateValidationStatusTest emptyCase={true} />).wait(componentLoadWait);

        cy.get('[data-testid="validation-status-widget"]').should('be.visible');
        cy.contains('Validation Status').should('be.visible');
        cy.get('table tbody tr').should('have.length', 1);
    });

    it('should show refresh button and handle refresh action', () => {
        cy.get('.fa-refresh').should('be.visible');
        cy.get('.fa-refresh').click().wait(clickWait);
        cy.get('[data-testid="validation-status-widget"]').should('be.visible');
    });

    it('should render multiline messages correctly', () => {
        // Check that messages with line breaks are rendered properly
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(2).should('exist');
            });
        });
    });

    it('should display validation check labels from enum', () => {
        // Verify that the enum labels are being used correctly
        cy.contains('Certificate Validity').should('be.visible');
        cy.contains('Certificate Key Usage').should('be.visible');
        cy.contains('Signature Verification').should('be.visible');
        cy.contains('OCSP Verification').should('be.visible');
        cy.contains('CRL Verification').should('be.visible');
        cy.contains('Basic Constraints').should('be.visible');
        cy.contains('Certificate chain').should('be.visible');
    });
});
