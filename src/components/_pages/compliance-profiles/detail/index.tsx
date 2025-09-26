import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import { ApiClients } from '../../../../api';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/compliance-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';

import { Badge, Button, Col, Container, Row } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import { createWidgetDetailHeaders } from 'utils/widget';
import GoBackButton from 'components/GoBackButton';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { capitalize } from 'utils/common-utils';
import TabLayout from 'components/Layout/TabLayout';
import AttributeViewer from 'components/Attributes/AttributeViewer';
import { AttributeResponseModel } from 'types/attributes';
import AssignedRulesAndGroup from 'components/_pages/compliance-profiles/detail/AssignedRulesAndGroup/AssignedRulesAndGroup';
import AvailableRulesAndGroups from 'components/_pages/compliance-profiles/detail/AvailableRulesAndGroups/AvailableRulesAndGroups';
import { getComplianceProfileStatusColor } from 'utils/compliance-profile';
import ProfileAssociations from 'components/_pages/compliance-profiles/detail/ProfileAssociations/ProfileAssociations';
import { EntityType, selectors as filtersSelectors, actions as filterActions } from 'ducks/filters';
import { renderConditionItems } from 'utils/condition-badges';

export default function ComplianceProfileDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const profile = useSelector(selectors.complianceProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const isFetchingGroupRules = useSelector(selectors.isFetchingGroupRules);
    const groupRules = useSelector(selectors.groupRules);
    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const platformEnums = useSelector(enumSelectors.platformEnums);
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const filterConditionOperatorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterConditionOperator));
    const availableFilters = useSelector(filtersSelectors.availableFilters(EntityType.CONDITIONS));

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
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
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
                detailColumns: [<></>, <></>, <CustomTable data={ruleDetailData} headers={entityDetailHeaders} />],
            };
        });
    }, [groupRules, resourceEnum, entityDetailHeaders]);

    const EntityDetailMenu = useCallback(() => {
        return (
            <Widget titleSize="larger" busy={selectedEntityDetails?.entityDetails?.entityType === 'group' ? isFetchingGroupRules : false}>
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
        availableFilters,
        platformEnums,
        searchGroupEnum,
        filterConditionOperatorEnum,
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
        if (selectedEntityDetails?.entityDetails?.entityType === 'rule') {
            dispatch(
                filterActions.getAvailableFilters({
                    entity: EntityType.CONDITIONS,
                    getAvailableFiltersApi: (apiClients: ApiClients) =>
                        apiClients.resources.listResourceRuleFilterFields({
                            resource: selectedEntityDetails?.resource,
                        }),
                }),
            );
        }
    }, [selectedEntityDetails, dispatch]);

    const onForceDeleteComplianceProfile = useCallback(() => {
        if (!profile) return;
        dispatch(actions.bulkForceDeleteComplianceProfiles({ uuids: [profile.uuid], redirect: `../../complianceprofiles` }));
    }, [profile, dispatch]);

    return (
        <Container className="themed-container" fluid>
            <GoBackButton
                style={{ marginBottom: '10px' }}
                forcedPath="/complianceprofiles"
                text={`${getEnumLabel(resourceEnum, Resource.ComplianceProfiles)} Inventory`}
            />
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
                isOpen={confirmDelete}
                caption="Delete Compliance Profile"
                body="You are about to delete a Compliance Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
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
            />

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
            />
        </Container>
    );
}
