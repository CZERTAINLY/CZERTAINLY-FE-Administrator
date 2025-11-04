import React, { useMemo } from 'react';
import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import { getEnumLabel } from 'ducks/enums';
import { Link } from 'react-router';

import { AttributeResponseModel } from 'types/attributes';
import { ComplianceRuleAvailabilityStatus, EnumItemDto, FilterFieldSource, FilterConditionOperator, PlatformEnum } from 'types/openapi';
import { capitalize } from 'utils/common-utils';
import { getComplianceProfileStatusColor } from 'utils/compliance-profile';
import { renderConditionItems } from 'utils/condition-badges';
import { componentLoadWait } from '../../utils/constants';
import Badge from 'components/Badge';

const RuleDetailMenuTest = () => {
    const mockResourceEnum: { [key: string]: EnumItemDto } = useMemo(
        () => ({
            certificates: { code: 'certificates', label: 'Certificate' },
            keys: { code: 'keys', label: 'Key' },
        }),
        [],
    );

    const platformEnums = {
        [PlatformEnum.Resource]: mockResourceEnum,
        [PlatformEnum.FilterFieldSource]: {
            Property: { code: 'Property', label: 'Property' },
            Data: { code: 'Data', label: 'Data' },
        },
        [PlatformEnum.FilterConditionOperator]: {
            Contains: { code: 'Contains', label: 'Contains' },
            Equals: { code: 'Equals', label: 'Equals' },
        },
    };

    const searchGroupEnum = platformEnums[PlatformEnum.FilterFieldSource];
    const filterConditionOperatorEnum = platformEnums[PlatformEnum.FilterConditionOperator];

    const availableFilters = [
        {
            fieldIdentifier: 'COMMON_NAME',
            fieldLabel: 'Common Name',
            fieldType: 'STRING',
            filterFieldSource: FilterFieldSource.Property,
        },
        {
            fieldIdentifier: 'SERIAL_NUMBER',
            fieldLabel: 'Serial Number',
            fieldType: 'STRING',
            filterFieldSource: FilterFieldSource.Property,
        },
    ];

    const selectedEntityDetails = {
        uuid: '7ed00480-e706-11ec-8fea-0242ac120002',
        name: 'cus_key_length',
        description: 'Public Key length of the certificate should be',
        availabilityStatus: 'available',
        resource: 'certificates',
        type: 'X.509',
        attributes: [
            {
                uuid: '7ed00782-e706-11ec-8fea-0242ac120002',
                name: 'condition',
                label: 'Condition',
                type: 'data',
                contentType: 'string',
                content: [
                    {
                        data: 'Equals',
                    },
                ],
            },
            {
                uuid: '7ed00886-e706-11ec-8fea-0242ac120002',
                name: 'length',
                label: 'Key Length',
                type: 'data',
                contentType: 'integer',
                content: [
                    {
                        data: '1',
                    },
                ],
            },
        ],
        entityDetails: {
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            connectorName: 'X509-Compliance-Provider',
            kind: 'x509',
            entityType: 'rule',
        },
        updatedReason: 'Updated Reason',
        format: 'pkcs7',
        conditionItems: [
            {
                fieldSource: FilterFieldSource.Property,
                fieldIdentifier: 'COMMON_NAME',
                operator: FilterConditionOperator.Contains,
                value: 'test',
            },
            {
                fieldSource: FilterFieldSource.Property,
                fieldIdentifier: 'SERIAL_NUMBER',
                operator: FilterConditionOperator.Contains,
                value: '1',
            },
        ],
    };

    const entityDetailHeaders: TableHeader[] = [
        { id: 'property', content: 'Property' },
        { id: 'value', content: 'Value' },
    ];

    const statusColor = getComplianceProfileStatusColor(selectedEntityDetails?.availabilityStatus as ComplianceRuleAvailabilityStatus);

    const ruleDetailData: TableDataRow[] = [
        { id: 'uuid', columns: ['UUID', selectedEntityDetails?.uuid] },
        { id: 'name', columns: ['Name', selectedEntityDetails?.name] },
        { id: 'description', columns: ['Description', selectedEntityDetails?.description] },
        {
            id: 'status',
            columns: [
                'Status',
                <Badge key={selectedEntityDetails?.uuid} color={statusColor} style={{ background: statusColor }}>
                    {capitalize(selectedEntityDetails?.availabilityStatus || '')}
                </Badge>,
            ],
        },
        ...(selectedEntityDetails?.updatedReason
            ? [{ id: 'updatedReason', columns: ['Updated Reason', selectedEntityDetails?.updatedReason] }]
            : []),
        { id: 'type', columns: ['Type', capitalize(selectedEntityDetails?.type || '')] },
        {
            id: 'resource',
            columns: [
                'Resource',
                <Link key={selectedEntityDetails?.uuid} to={`../../${selectedEntityDetails?.resource}`}>
                    {getEnumLabel(mockResourceEnum, selectedEntityDetails?.resource) || ''}
                </Link>,
            ],
        },
        { id: 'format', columns: ['Format', selectedEntityDetails?.format || ''] },

        ...(selectedEntityDetails?.entityDetails?.connectorName && selectedEntityDetails?.entityDetails?.connectorUuid
            ? [
                  {
                      id: 'provider',
                      columns: [
                          'Provider',
                          <Link
                              key={selectedEntityDetails?.entityDetails?.connectorUuid}
                              to={`../../connectors/detail/${selectedEntityDetails?.entityDetails?.connectorUuid}`}
                          >
                              {selectedEntityDetails?.entityDetails?.connectorName}
                          </Link>,
                      ],
                  },
              ]
            : []),
        ...(selectedEntityDetails?.entityDetails?.kind
            ? [{ id: 'kind', columns: ['Kind', selectedEntityDetails?.entityDetails?.kind || ''] }]
            : []),
    ];

    return (
        <Widget titleSize="larger" busy={false}>
            {selectedEntityDetails?.entityDetails?.entityType === 'rule' && (
                <TabLayout
                    tabs={[
                        {
                            title: 'Details',
                            content: (
                                <>
                                    <CustomTable headers={entityDetailHeaders} data={ruleDetailData} />
                                    {selectedEntityDetails?.conditionItems && selectedEntityDetails?.conditionItems?.length > 0 && (
                                        <>
                                            <p style={{ margin: '0 0 0 5px', fontWeight: '500', fontSize: '16px' }}>Condition Items</p>
                                            {renderConditionItems(
                                                selectedEntityDetails?.conditionItems,
                                                availableFilters,
                                                platformEnums,
                                                searchGroupEnum,
                                                filterConditionOperatorEnum,
                                                '',
                                                'badge',
                                                { margin: '5px' },
                                            )}
                                        </>
                                    )}
                                </>
                            ),
                        },
                        ...(selectedEntityDetails?.attributes?.length > 0
                            ? [
                                  {
                                      title: 'Attributes',
                                      content: (
                                          <AttributeViewer attributes={selectedEntityDetails?.attributes as AttributeResponseModel[]} />
                                      ),
                                  },
                              ]
                            : []),
                    ]}
                />
            )}
        </Widget>
    );
};

describe('RuleDetailMenuTest', () => {
    beforeEach(() => {
        cy.mount(<RuleDetailMenuTest />).wait(componentLoadWait);
    });

    describe('Component Rendering', () => {
        it('should render tab layout with correct tabs', () => {
            cy.get('.nav-tabs').should('exist');
            cy.get('.nav-tabs .nav-link').should('have.length', 2);
            cy.get('.nav-tabs .nav-link').eq(0).should('contain', 'Details');
            cy.get('.nav-tabs .nav-link').eq(1).should('contain', 'Attributes');
        });

        it('should display Details tab content by default', () => {
            cy.get('.nav-tabs .nav-link').eq(0).should('have.class', 'active');
            cy.get('.tab-content').should('be.visible');
        });
    });

    describe('Details Tab Content', () => {
        it('should render the details table with correct headers', () => {
            cy.get('table thead tr').should('have.length', 2);
            cy.get('table thead tr th').eq(0).should('contain', 'Property');
            cy.get('table thead tr th').eq(1).should('contain', 'Value');
        });

        it('should display UUID in the details table', () => {
            cy.get('table tbody tr').contains('UUID').should('exist');
            cy.get('table tbody tr').contains('7ed00480-e706-11ec-8fea-0242ac120002').should('exist');
        });

        it('should display name in the details table', () => {
            cy.get('table tbody tr').contains('Name').should('exist');
            cy.get('table tbody tr').contains('cus_key_length').should('exist');
        });

        it('should display description in the details table', () => {
            cy.get('table tbody tr').contains('Description').should('exist');
            cy.get('table tbody tr').contains('Public Key length of the certificate should be').should('exist');
        });

        it('should display status badge with correct color and text', () => {
            cy.get('table tbody tr').contains('Status').should('exist');
            cy.get('table tbody tr').contains('Available').should('exist');
            cy.get('.badge').should('contain', 'Available');
        });

        it('should display updated reason when present', () => {
            cy.get('table tbody tr').contains('Updated Reason').should('exist');
            cy.get('table tbody tr').contains('Updated Reason').should('exist');
        });

        it('should display type information', () => {
            cy.get('table tbody tr').contains('Type').should('exist');
            cy.get('table tbody tr').contains('X.509').should('exist');
        });

        it('should display resource as a link', () => {
            cy.get('table tbody tr').contains('Resource').should('exist');
            cy.get('table tbody tr').contains('Certificate').should('exist');
            cy.get('a[href*="/certificates"]').should('exist');
        });

        it('should display format information', () => {
            cy.get('table tbody tr').contains('Format').should('exist');
            cy.get('table tbody tr').contains('pkcs7').should('exist');
        });

        it('should display provider information as a link', () => {
            cy.get('table tbody tr').contains('Provider').should('exist');
            cy.get('table tbody tr').contains('X509-Compliance-Provider').should('exist');
            cy.get('a[href*="/connectors/detail/8d8a6610-9623-40d2-b113-444fe59579dd"]').should('exist');
        });

        it('should display kind information', () => {
            cy.get('table tbody tr').contains('Kind').should('exist');
            cy.get('table tbody tr').contains('x509').should('exist');
        });
    });

    describe('Condition Items', () => {
        it('should display condition items section', () => {
            cy.get('p').contains('Condition Items').should('exist');
        });

        it('should render condition items as badges', () => {
            cy.get('.badge').should('have.length.at.least', 1);
        });

        it('should display condition items with correct field identifiers', () => {
            cy.get('.badge').should('contain', 'COMMON_NAME');
            cy.get('.badge').should('contain', 'SERIAL_NUMBER');
        });

        it('should display condition items with correct operators', () => {
            cy.get('.badge').should('contain', 'CONTAINS');
        });

        it('should display condition items with correct values', () => {
            cy.get('.badge').should('contain', 'test');
            cy.get('.badge').should('contain', '1');
        });
    });

    describe('Attributes Tab', () => {
        it('should switch to Attributes tab when clicked', () => {
            cy.get('.nav-tabs .nav-link').eq(1).click();
            cy.get('.nav-tabs .nav-link').eq(1).should('have.class', 'active');
        });

        it('should display AttributeViewer component in Attributes tab', () => {
            cy.get('.nav-tabs .nav-link').eq(1).click();
            cy.get('[data-testid="custom-table"]').should('exist');
        });
    });

    describe('Tab Navigation', () => {
        it('should switch between tabs correctly', () => {
            // Start on Details tab
            cy.get('.nav-tabs .nav-link').eq(0).should('have.class', 'active');

            // Switch to Attributes tab
            cy.get('.nav-tabs .nav-link').eq(1).click();
            cy.get('.nav-tabs .nav-link').eq(1).should('have.class', 'active');
            cy.get('.nav-tabs .nav-link').eq(0).should('not.have.class', 'active');

            // Switch back to Details tab
            cy.get('.nav-tabs .nav-link').eq(0).click();
            cy.get('.nav-tabs .nav-link').eq(0).should('have.class', 'active');
            cy.get('.nav-tabs .nav-link').eq(1).should('not.have.class', 'active');
        });

        it('should maintain tab content when switching', () => {
            // Verify Details tab content
            cy.get('.nav-tabs .nav-link').eq(0).click();
            cy.get('table').should('be.visible');

            // Switch to Attributes and verify content
            cy.get('.nav-tabs .nav-link').eq(1).click();
            cy.get('[data-testid="custom-table"]').should('be.visible');

            // Switch back and verify Details content is still there
            cy.get('.nav-tabs .nav-link').eq(0).click();
            cy.get('table').should('be.visible');
        });
    });

    describe('Data Validation', () => {
        it('should display correct data types for each property', () => {
            cy.get('[data-id="uuid"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'UUID');
                    cy.get('td').eq(1).should('contain', '7ed00480-e706-11ec-8fea-0242ac120002');
                });
            cy.get('[data-id="name"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Name');
                    cy.get('td').eq(1).should('contain', 'cus_key_length');
                });
            cy.get('[data-id="description"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Description');
                    cy.get('td').eq(1).should('contain', 'Public Key length of the certificate should be');
                });
            cy.get('[data-id="status"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Status');
                    cy.get('td').eq(1).should('contain', 'Available');
                });
            cy.get('[data-id="type"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Type');
                    cy.get('td').eq(1).should('contain', 'X.509');
                });
            cy.get('[data-id="resource"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Resource');
                    cy.get('td').eq(1).should('contain', 'Certificate');
                    cy.get('a[href*="/certificates"]').should('exist');
                });
            cy.get('[data-id="format"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Format');
                    cy.get('td').eq(1).should('contain', 'pkcs7');
                });
            cy.get('[data-id="provider"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Provider');
                    cy.get('td').eq(1).should('contain', 'X509-Compliance-Provider');
                    cy.get('a[href*="/connectors/detail/8d8a6610-9623-40d2-b113-444fe59579dd"]').should('exist');
                });
            cy.get('[data-id="kind"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Kind');
                    cy.get('td').eq(1).should('contain', 'x509');
                });
        });
    });
});
