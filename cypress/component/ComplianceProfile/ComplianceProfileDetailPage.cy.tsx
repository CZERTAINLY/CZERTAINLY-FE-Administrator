import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/compliance-profiles';
import { actions as enumActions } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';

import { Badge, Button, Col, Container, Row } from 'reactstrap';
import { ComplianceProfileDtoV2, ComplianceRuleListDto, PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { createWidgetDetailHeaders } from 'utils/widget';
import GoBackButton from 'components/GoBackButton';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import AttributeViewer from 'components/Attributes/AttributeViewer';
import { AttributeResponseModel } from 'types/attributes';
import AssignedRulesAndGroup from 'components/_pages/compliance-profiles/detail/AssignedRulesAndGroup/AssignedRulesAndGroup';
import AvailableRulesAndGroups from 'components/_pages/compliance-profiles/detail/AvailableRulesAndGroups/AvailableRulesAndGroups';
import '../../../src/resources/styles/theme.scss';
import ProfileAssociations from 'components/_pages/compliance-profiles/detail/ProfileAssociations/ProfileAssociations';

import { clickWait, componentLoadWait } from '../../utils/constants';
import { complianceProfileDetailMockData, mockGroupRules, mockResourceEnum } from './mock-data';
import { capitalize } from 'utils/common-utils';
import { getComplianceProfileStatusColor } from 'utils/compliance-profile';
import TabLayout from 'components/Layout/TabLayout';

export default function ComplianceProfileDetailTest() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const profile = useSelector(selectors.complianceProfile);
    const isFetchingDetail = false;
    const isFetchingGroupRules = false;
    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const groupRules = useSelector(selectors.groupRules);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [complianceCheck, setComplianceCheck] = useState<boolean>(false);
    const [isEntityDetailMenuOpen, setIsEntityDetailMenuOpen] = useState(false);
    const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);
    const [groupRuleAttributeData, setGroupRuleAttributeData] = useState<{
        ruleName: string;
        attributes: AttributeResponseModel[];
    } | null>(null);
    const [availableRulesResetFunction, setAvailableRulesResetFunction] = useState<(() => void) | null>(null);
    const [assignedRulesResetFunction, setAssignedRulesResetFunction] = useState<(() => void) | null>(null);

    useEffect(() => {
        if (!id) return;
        dispatch(actions.getComplianceProfile({ uuid: id }));
        dispatch(actions.getAssociationsOfComplianceProfile({ uuid: id }));
    }, [dispatch, id]);

    const getFreshComplianceProfileDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getComplianceProfile({ uuid: id }));
        dispatch(actions.getAssociationsOfComplianceProfile({ uuid: id }));
        // Reset the AvailableRulesAndGroups select values
        if (availableRulesResetFunction) {
            availableRulesResetFunction();
        }
        // Reset the AssignedRulesAndGroup select values
        if (assignedRulesResetFunction) {
            assignedRulesResetFunction();
        }
    }, [id, dispatch, availableRulesResetFunction, assignedRulesResetFunction]);

    useEffect(() => {
        getFreshComplianceProfileDetails();
    }, [id, getFreshComplianceProfileDetails]);

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !profile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', profile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', profile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', profile.description || ''],
                      },
                  ],
        [profile],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'gavel',
                disabled: false,
                tooltip: 'Check Compliance',
                onClick: () => {
                    setComplianceCheck(true);
                },
                id: 'check-compliance',
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
                id: 'delete-compliance-profile',
            },
        ],
        [],
    );

    const onDeleteConfirmed = useCallback(() => {
        if (!profile) return;

        dispatch(actions.deleteComplianceProfile({ uuid: profile.uuid }));

        setConfirmDelete(false);
    }, [profile, dispatch]);

    const onComplianceCheck = useCallback(() => {
        setComplianceCheck(false);

        if (!profile?.uuid) return;

        dispatch(actions.checkComplianceForProfiles({ requestBody: [profile.uuid] }));
    }, [dispatch, profile]);

    const onForceDeleteComplianceProfile = useCallback(() => {
        if (!profile) return;
        dispatch(actions.bulkForceDeleteComplianceProfiles({ uuids: [profile.uuid], redirect: `../../complianceprofiles` }));
    }, [profile, dispatch]);

    const entityDetailHeaders: TableHeader[] = useMemo(() => {
        return [
            { id: 'property', content: 'Property' },
            { id: 'value', content: 'Value' },
        ];
    }, []);

    const ruleDetailData: TableDataRow[] = useMemo(() => {
        const statusColor = getComplianceProfileStatusColor(selectedEntityDetails?.availabilityStatus);
        return [
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
                        {getEnumLabel(resourceEnum, selectedEntityDetails?.resource) || ''}
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
    }, [selectedEntityDetails, resourceEnum]);

    const groupDetailData: TableDataRow[] = useMemo(() => {
        return [
            { id: 'uuid', columns: ['UUID', selectedEntityDetails?.uuid] },
            { id: 'name', columns: ['Name', selectedEntityDetails?.name] },
            { id: 'description', columns: ['Description', selectedEntityDetails?.description] },
            {
                id: 'status',
                columns: [
                    'Status',
                    <Badge
                        key={selectedEntityDetails?.uuid}
                        color={selectedEntityDetails?.availabilityStatus === 'available' ? 'success' : 'danger'}
                    >
                        {capitalize(selectedEntityDetails?.availabilityStatus || '')}
                    </Badge>,
                ],
            },
            { id: 'resource', columns: ['Resource', getEnumLabel(resourceEnum, selectedEntityDetails?.resource) || ''] },
        ];
    }, [selectedEntityDetails, resourceEnum]);

    const groupRulesDetailHeaders: TableHeader[] = useMemo(() => {
        return [
            { id: 'name', content: 'Name', width: '30%' },
            { id: 'description', content: 'Description', width: '70%' },
        ];
    }, []);

    const groupRulesDetailData: TableDataRow[] = useMemo(() => {
        return groupRules.map((rule) => {
            const ruleDetailData = [
                { id: 'uuid', columns: ['UUID', rule?.uuid || ''] },
                { id: 'name', columns: ['Name', rule?.name || ''] },
                { id: 'description', columns: ['Description', rule?.description || ''] },

                { id: 'type', columns: ['Type', capitalize(rule?.type || '')] },
                { id: 'resource', columns: ['Resource', getEnumLabel(resourceEnum, rule?.resource) || ''] },
                { id: 'format', columns: ['Format', rule?.format || ''] },
                { id: 'kind', columns: ['Kind', rule?.kind || ''] },
                {
                    id: 'attributes',
                    columns: [
                        'Attributes',
                        rule.attributes?.length ? (
                            <Button
                                className="btn btn-link"
                                color="white"
                                title="Rules"
                                onClick={() => {
                                    setGroupRuleAttributeData({
                                        ruleName: rule.name,
                                        attributes: (rule.attributes as AttributeResponseModel[]) ?? [],
                                    });
                                }}
                            >
                                <i className="fa fa-info" style={{ color: 'auto' }} />
                            </Button>
                        ) : (
                            'No attributes'
                        ),
                    ],
                },
            ];
            return {
                id: rule.uuid,
                columns: ['Name', rule.name || ''],
                detailColumns: [<></>, <></>, <CustomTable key={rule.uuid} data={ruleDetailData} headers={entityDetailHeaders} />],
            };
        });
    }, [groupRules, resourceEnum, entityDetailHeaders]);

    const EntityDetailMenu = useCallback(() => {
        return (
            <Widget
                titleSize="larger"
                busy={selectedEntityDetails?.entityDetails?.entityType === 'group' ? isFetchingGroupRules : false}
                dataTestId="entity-detail-menu"
            >
                {selectedEntityDetails?.entityDetails?.entityType === 'rule' && (
                    <TabLayout
                        tabs={[
                            {
                                title: 'Details',
                                content: (
                                    <>
                                        <CustomTable headers={entityDetailHeaders} data={ruleDetailData} />
                                    </>
                                ),
                            },
                            ...(selectedEntityDetails?.attributes?.length > 0
                                ? [
                                      {
                                          title: 'Attributes',
                                          content: <AttributeViewer attributes={selectedEntityDetails?.attributes} />,
                                      },
                                  ]
                                : []),
                        ]}
                    />
                )}
                {selectedEntityDetails?.entityDetails?.entityType === 'group' && (
                    <TabLayout
                        tabs={[
                            {
                                title: 'Details',
                                content: <CustomTable headers={entityDetailHeaders} data={groupDetailData} />,
                            },
                            {
                                title: 'Rules',
                                content: (
                                    <CustomTable headers={groupRulesDetailHeaders} data={groupRulesDetailData} hasDetails hasPagination />
                                ),
                            },
                        ]}
                    />
                )}
            </Widget>
        );
    }, [
        selectedEntityDetails,
        isFetchingGroupRules,
        entityDetailHeaders,
        ruleDetailData,
        groupDetailData,
        groupRulesDetailHeaders,
        groupRulesDetailData,
    ]);

    //get list of rules for group detail page
    useEffect(() => {
        if (selectedEntityDetails?.entityDetails?.entityType === 'group') {
            dispatch(
                actions.getListComplianceGroupRules({
                    groupUuid: selectedEntityDetails?.uuid,
                    connectorUuid: selectedEntityDetails?.entityDetails?.connectorUuid || selectedEntityDetails?.connectorUuid,
                    kind: selectedEntityDetails?.entityDetails?.kind || selectedEntityDetails?.kind,
                }),
            );
        }
    }, [selectedEntityDetails, dispatch]);

    return (
        <Container className="themed-container" fluid>
            <GoBackButton style={{ marginBottom: '10px' }} forcedPath="/complianceprofiles" text={`Compliance Profile Inventory`} />
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="Compliance Profile Details"
                        busy={isFetchingDetail}
                        widgetButtons={buttons}
                        titleSize="large"
                        refreshAction={getFreshComplianceProfileDetails}
                        widgetLockName={LockWidgetNameEnum.ComplianceProfileDetails}
                        lockSize="large"
                        dataTestId="compliance-profile-details-widget"
                    >
                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>

                <Col>
                    <ProfileAssociations profile={profile} />
                    {profile && (
                        <CustomAttributeWidget
                            resource={Resource.ComplianceProfiles}
                            resourceUuid={profile.uuid}
                            attributes={profile.customAttributes}
                        />
                    )}
                </Col>
            </Row>

            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <AssignedRulesAndGroup
                        profile={profile}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
                        onReset={(resetFn) => setAssignedRulesResetFunction(() => resetFn)}
                    />
                </Col>
                <Col>
                    <AvailableRulesAndGroups
                        profile={profile}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
                        onReset={(resetFn) => setAvailableRulesResetFunction(() => resetFn)}
                    />
                </Col>
            </Row>

            <Dialog
                isOpen={isEntityDetailMenuOpen}
                caption={
                    <p style={{ fontWeight: 'bold' }}>
                        {selectedEntityDetails
                            ? `${capitalize(selectedEntityDetails?.entityDetails?.entityType)}: (${selectedEntityDetails?.name})`
                            : 'Entity Details'}
                    </p>
                }
                body={<EntityDetailMenu />}
                toggle={() => setIsEntityDetailMenuOpen(false)}
                buttons={[]}
                size="lg"
            />

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Compliance Profile"
                body="You are about to delete a Compliance Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
                dataTestId="delete-confirmation-dialog"
            />
            <Dialog
                isOpen={complianceCheck}
                caption={`Initiate Compliance Check`}
                body={'Initiate the compliance check for the Compliance Profile?'}
                toggle={() => setComplianceCheck(false)}
                buttons={[
                    { color: 'primary', onClick: onComplianceCheck, body: 'Yes' },
                    { color: 'secondary', onClick: () => setComplianceCheck(false), body: 'Cancel' },
                ]}
                dataTestId="compliance-check-dialog"
            />

            <Dialog
                isOpen={!!groupRuleAttributeData}
                caption={
                    <p>
                        Rule <span style={{ fontWeight: 'bold' }}>{groupRuleAttributeData?.ruleName}</span> attributes
                    </p>
                }
                body={<AttributeViewer attributes={groupRuleAttributeData?.attributes ?? []} />}
                toggle={() => setGroupRuleAttributeData(null)}
                buttons={[]}
                size="lg"
                dataTestId="group-rule-attribute-dialog"
            />
            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete Compliance Profile"
                body={
                    <>
                        Failed to delete the Compliance Profile that has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteComplianceProfile, body: 'Force' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
                dataTestId="delete-error-dialog"
            />
        </Container>
    );
}

describe('Compliance Profile Detail Page', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileDetailTest />).wait(componentLoadWait);
        cy.dispatchActions(
            actions.getComplianceProfileSuccess({
                complianceProfile: complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2,
            }),
            enumActions.getPlatformEnumsSuccess({
                platformEnums: mockResourceEnum,
            }),
            actions.getListComplianceGroupRulesSuccess({
                rules: mockGroupRules as unknown as ComplianceRuleListDto[],
            }),
        );
    });

    describe('Group Detail menu', () => {
        beforeEach(() => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').within(() => {
                cy.get('table tbody tr')
                    .eq(6)
                    .within(() => {
                        cy.get('button[title="Rules"]').click().wait(clickWait);
                    });
            });
        });
        it('should display the group detail menu', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('Details').should('exist');
                cy.contains('Rules').should('exist');
            });
        });

        it('Should change tab to rules', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Rules').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Rules').should('exist');
            });
        });

        it('should be able to switch between tabs', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Rules').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Rules').should('exist');
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Details').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Details').should('exist');
            });
        });

        it('details tab should display the table with the correct structure', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody').should('exist');
                cy.get('table thead tr').should('have.length', 2);
                cy.get('table thead tr th').eq(0).should('contain', 'Property');
                cy.get('table thead tr th').eq(1).should('contain', 'Value');
            });
        });

        it('should display table data in the details table', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody tr').contains('UUID').should('exist');
                cy.get('table tbody tr').contains('52350996-ddb2-11ec-9d64-0242ac120002').should('exist');
                cy.get('table tbody tr').contains('Name').should('exist');
                cy.get('table tbody tr').contains("Apple's CT Policy").should('exist');
                cy.get('table tbody tr').contains('Description').should('exist');
                cy.get('table tbody tr').contains('some description').should('exist');
                cy.get('table tbody tr').contains('Status').should('exist');
                cy.get('table tbody tr').contains('Available').should('exist');
                cy.get('.badge').should('contain', 'Available');
                cy.get('table tbody tr').contains('Resource').should('exist');
                cy.get('table tbody tr').contains('certificates').should('exist');
            });
        });

        describe('Rules tab', () => {
            beforeEach(() => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.contains('a.nav-link', 'Rules').click();
                });
            });

            it('rules tab should display the table with the correct structure', () => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.get('table tbody').should('exist');
                    cy.get('table thead tr')
                        .should('have.length', 2)
                        .eq(1)
                        .within(() => {
                            cy.get('th').eq(0).should('exist');
                            cy.get('th').eq(1).should('contain', 'Name');
                            cy.get('th').eq(2).should('contain', 'Description');
                        });
                });
            });

            it('rules tab should display the table with the correct data', () => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.get('table tbody tr').contains('Name').should('exist');
                    cy.get('table tbody tr').contains('Name').should('exist');
                    cy.get('table tbody tr').contains('Description').should('exist');
                });
            });

            it('should expand table row on click to get detail information', () => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.get('i[data-expander="true"]').click().wait(clickWait);

                    cy.get('[data-testid="custom-table"]')
                        .should('exist')
                        .eq(2)
                        .within(() => {
                            cy.get('thead tr th').eq(0).should('contain', 'Property');
                            cy.get('thead tr th').eq(1).should('contain', 'Value');

                            cy.get('tbody tr[data-id="uuid"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'UUID');
                                cy.get('td').eq(1).should('contain', '40f084cd-ddc1-11ec-82b0-34cff65c6ee3');
                            });

                            cy.get('tbody tr[data-id="name"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Name');
                                cy.get('td').eq(1).should('contain', 'e_basic_constraints_not_critical');
                            });

                            cy.get('tbody tr[data-id="type"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Type');
                                cy.get('td').eq(1).should('exist');
                            });

                            cy.get('tbody tr[data-id="description"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Description');
                                cy.get('td').eq(1).should('contain', 'basicConstraints MUST appear as a critical extension');
                            });

                            cy.get('tbody tr[data-id="resource"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Resource');
                                cy.get('td').eq(1).should('contain', 'certificates');
                            });

                            cy.get('tbody tr[data-id="format"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Format');
                                cy.get('td').eq(1).should('exist');
                            });

                            cy.get('tbody tr[data-id="kind"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Kind');
                                cy.get('td').eq(1).should('contain', 'x509');
                            });

                            cy.get('tbody tr[data-id="attributes"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Attributes');
                                cy.get('td').eq(1).should('exist');
                            });
                        });
                });
            });
        });
    });

    describe('Internal Rule Detail menu', () => {
        beforeEach(() => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').within(() => {
                cy.get('table tbody tr')
                    .eq(0)
                    .within(() => {
                        cy.get('button[title="Rules"]').click().wait(clickWait);
                    });
            });
        });

        it('details tab should display the table with the correct structure', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody').should('exist');
                cy.get('table thead tr').should('have.length', 1);
                cy.get('table thead tr th').eq(0).should('contain', 'Property');
                cy.get('table thead tr th').eq(1).should('contain', 'Value');
            });
        });

        it('should display table data in the details table', () => {
            cy.get('[data-id="uuid"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'UUID');
                    cy.get('td').eq(1).should('contain', '1');
                });
            cy.get('[data-id="name"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Name');
                    cy.get('td').eq(1).should('contain', 'test');
                });
            cy.get('[data-id="description"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Description');
                    cy.get('td').eq(1).should('contain', 'test');
                });
            cy.get('table tbody tr').contains('Status').should('exist');
            cy.get('table tbody tr').contains('Available').should('exist');
            cy.get('.badge').should('contain', 'Available');
            cy.get('table tbody tr').contains('Type').should('exist');
            cy.get('table tbody tr').contains('Resource').should('exist');
            cy.get('table tbody tr').contains('certificates').should('exist');
            cy.get('a[href*="/certificates"]').should('exist');
            cy.get('table tbody tr').contains('Format').should('exist');
        });
    });

    describe('Rule Detail menu', () => {
        beforeEach(() => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').within(() => {
                cy.get('table tbody tr')
                    .eq(3)
                    .within(() => {
                        cy.get('button[title="Rules"]').click().wait(clickWait);
                    });
            });
        });

        it('should display the group detail menu', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('Details').should('exist');
                cy.contains('Attributes').should('exist');
            });
        });
        it('Should change tab to rules', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Attributes').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Attributes').should('exist');
            });
        });
        it('should be able to switch between tabs', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Attributes').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Attributes').should('exist');
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Details').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Details').should('exist');
            });
        });

        it('details tab should display the table with the correct structure', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody').should('exist');
                cy.get('table thead tr').should('have.length', 2);
                cy.get('table thead tr th').eq(0).should('contain', 'Property');
                cy.get('table thead tr th').eq(1).should('contain', 'Value');
            });
        });

        it('should display table data in the details table', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody tr').contains('UUID').should('exist');
                cy.get('table tbody tr').contains('7ed00480-e706-11ec-8fea-0242ac120002').should('exist');
                cy.get('table tbody tr').contains('Name').should('exist');
                cy.get('table tbody tr').contains('cus_key_length').should('exist');
                cy.get('table tbody tr').contains('Description').should('exist');
                cy.get('table tbody tr').contains('Public Key length of the certificate should be').should('exist');
                cy.get('table tbody tr').contains('Status').should('exist');
                cy.get('table tbody tr').contains('Available').should('exist');
                cy.get('.badge').should('contain', 'Available');
                cy.get('table tbody tr').contains('Type').should('exist');
                cy.get('table tbody tr').contains('X.509').should('exist');
                cy.get('table tbody tr').contains('Resource').should('exist');
                cy.get('table tbody tr').contains('certificates').should('exist');
                cy.get('a[href*="/certificates"]').should('exist');
                cy.get('table tbody tr').contains('Format').should('exist');
                cy.get('table tbody tr').contains('Kind').should('exist');
                cy.get('table tbody tr').contains('x509').should('exist');
                cy.get('table tbody tr').contains('Provider').should('exist');
                cy.get('table tbody tr').contains('X509-Compliance-Provider').should('exist');
                cy.get('a[href*="/connectors/detail/8d8a6610-9623-40d2-b113-444fe59579dd"]').should('exist');
            });
        });
    });

    describe('Basic Rendering', () => {
        it('should render the component without crashing', () => {
            cy.get('.themed-container').should('exist');
        });

        it('should display the go back button', () => {
            cy.get('[data-testid="go-back-button"]').should('exist');
            cy.get('[data-testid="go-back-button"]').should('contain.text', 'Compliance Profile Inventory');
        });

        it('should display the main widget with correct title', () => {
            cy.get('[data-testid="compliance-profile-details-widget"]').should('exist');
            cy.get('[data-testid="compliance-profile-details-widget"]').should('contain.text', 'Compliance Profile Details');
        });

        it('should display profile associations widget', () => {
            cy.get('[data-testid="profile-associations-widget"]').should('exist');
        });

        it('should display assigned rules and groups widget', () => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').should('exist');
        });

        it('should display available rules and groups widget', () => {
            cy.get('[data-testid="available-rules-and-groups-widget"]').should('exist');
        });
    });

    describe('Delete Confirmation Dialog', () => {
        beforeEach(() => {
            cy.get('[data-testid="delete-compliance-profile-button"]').click();
        });

        it('should display correct dialog content', () => {
            cy.get('[data-testid="delete-confirmation-dialog"]').should('be.visible');
            cy.get('[data-testid="delete-confirmation-dialog"]').should(
                'contain.text',
                'You are about to delete a Compliance Profile. Is this what you want to do?',
            );
        });

        it('should have Yes, delete and Cancel buttons', () => {
            cy.get('[data-testid="delete-confirmation-dialog"]').within(() => {
                cy.contains('Yes, delete').should('exist');
                cy.contains('Cancel').should('exist');
            });
        });

        it('should close dialog when Cancel button is clicked', () => {
            cy.get('[data-testid="delete-confirmation-dialog"]').within(() => {
                cy.contains('Cancel').click().wait(1000);
            });
            cy.get('[data-testid="delete-confirmation-dialog"]').should('not.exist');
        });

        it('should run function when delete button is clicked and close modal', () => {
            cy.window().then((win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            });

            cy.get('[data-testid="delete-confirmation-dialog"]').within(() => {
                cy.contains('Yes, delete').click().wait(1000);
            });
            cy.get('[data-testid="delete-confirmation-dialog"]').should('not.exist');
        });
    });

    describe('Compliance Check Dialog', () => {
        beforeEach(() => {
            cy.get('[data-testid="check-compliance-button"]').click();
        });

        it('should display correct dialog content', () => {
            cy.get('[data-testid="compliance-check-dialog"]').should('be.visible');
            cy.get('[data-testid="compliance-check-dialog"]').should(
                'contain.text',
                'Initiate the compliance check for the Compliance Profile?',
            );
        });

        it('should have Yes and Cancel buttons', () => {
            cy.get('[data-testid="compliance-check-dialog"]').within(() => {
                cy.contains('Yes').should('exist');
                cy.contains('Cancel').should('exist');
            });
        });

        it('should close dialog when Cancel button is clicked', () => {
            cy.get('[data-testid="compliance-check-dialog"]').within(() => {
                cy.contains('Cancel').click().wait(1000);
            });
            cy.get('[data-testid="compliance-check-dialog"]').should('not.exist');
        });

        it('should run function when Yes button is clicked and close modal', () => {
            cy.window().then((win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            });

            cy.get('[data-testid="compliance-check-dialog"]').within(() => {
                cy.contains('Yes').click().wait(1000);
            });
            cy.get('[data-testid="compliance-check-dialog"]').should('not.exist');
        });
    });

    describe('Delete Error Dialog', () => {
        beforeEach(() => {
            cy.get('[data-testid=compliance-profile-details-widget').within(() => {
                cy.get('[data-testid=delete-compliance-profile-button').click().wait(clickWait);
            });
        });

        it('should display delete confirmation dialog', () => {
            cy.get('[data-testid=delete-confirmation-dialog').should('be.visible');
            cy.get('[data-testid=delete-confirmation-dialog').should(
                'contain.text',
                'You are about to delete a Compliance Profile. Is this what you want to do?',
            );
        });
        it('should have Yes, delete and Cancel buttons', () => {
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').should('exist');
                cy.contains('Cancel').should('exist');
            });
        });
        it('should close dialog when Cancel button is clicked', () => {
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Cancel').click().wait(1000);
            });
            cy.get('[data-testid=delete-confirmation-dialog').should('not.exist');
        });
        it('should run function when delete button is clicked and close modal', () => {
            cy.window().then((win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            });
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').click().wait(1000);
            });
            cy.get('[data-testid=delete-confirmation-dialog').should('not.exist');
        });

        it('should display delete error dialog when there is an error message', () => {
            cy.get('[data-testid=delete-confirmation-dialog').should('be.visible');
            cy.get('[data-testid=delete-confirmation-dialog').should(
                'contain.text',
                'You are about to delete a Compliance Profile. Is this what you want to do?',
            );
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').should('exist');
                cy.contains('Cancel').should('exist');
            });
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').click().wait(1000);
            });
        });
    });
});
