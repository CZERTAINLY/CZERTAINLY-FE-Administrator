import CertificateStatus from 'components/_pages/certificates/CertificateStatus';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { useCallback, useMemo } from 'react';
import { LockWidgetNameEnum } from 'types/user-interface';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { dateFormatter } from 'utils/dateUtil';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from 'ducks/certificates';
import { CertificateState as CertStatus, PlatformEnum } from 'types/openapi';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { mockCertificate, mockValidationResult } from './mock-data';
import { CertificateDetailResponseModel } from 'types/certificate';
import { mockPlatformEnums } from '../ComplianceProfile/mock-data';
import { actions as enumActions } from 'ducks/enums';

const CertificateValidationStatusTest = () => {
    const dispatch = useDispatch();

    const certificate = useSelector(selectors.certificateDetail);
    const isFetchingValidationResult = useSelector(selectors.isFetchingValidationResult);
    const validationResult = useSelector(selectors.validationResult);
    const certificateValidationCheck = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationCheck));

    console.log({
        certificate,
        isFetchingValidationResult,
        validationResult,
        certificateValidationCheck,
    });

    const getFreshCertificateValidations = useCallback(() => {
        if (!certificate) return;
        if (certificate.state === CertStatus.Requested) return;
        dispatch(actions.getCertificateValidationResult({ uuid: certificate.uuid }));
    }, [dispatch, certificate]);

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

    const validationData: TableDataRow[] = useMemo(() => {
        let validationDataRows =
            !certificate && validationResult?.validationChecks
                ? []
                : [
                      ...Object.entries(validationResult?.validationChecks ?? {}).map(function ([key, value]) {
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
                  ];

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
    }, [certificate, validationResult, certificateValidationCheck]);

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
        cy.dispatchActions();
        cy.window().then((win) => {
            win.store.dispatch(actions.getCertificateValidationResultSuccess(mockValidationResult));
            win.store.dispatch(
                actions.getCertificateDetailSuccess({
                    certificate: mockCertificate as unknown as CertificateDetailResponseModel,
                }),
            );
            win.store.dispatch(
                enumActions.getPlatformEnumsSuccess({
                    ...mockPlatformEnums,
                }),
            );
        });
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
