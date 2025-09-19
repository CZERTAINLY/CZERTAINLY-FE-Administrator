import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

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

export default function ComplianceProfileDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const profile = useSelector(selectors.complianceProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const isFetchingGroupRules = useSelector(selectors.isFetchingGroupRules);

    const test = [
        {
            uuid: '40f0853b-ddc1-11ec-9eb7-34cff65c6ee3',
            name: 'e_international_dns_name_not_nfc',
            description: 'Internationalized DNSNames must be normalized by Unicode normalization form C',
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            kind: 'x509',
            groupUuid: 'e1d0af6e-ddb3-11ec-9d64-0242ac120002',
            resource: 'certificates',
            attributes: [
                {
                    uuid: '7ed00782-e706-11ec-8fea-0242ac120002',
                    name: 'condition',
                    label: 'Condition',
                    type: 'data',
                    contentType: 'string',
                    content: [
                        {
                            data: 'Greater',
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
                            data: '2048',
                        },
                    ],
                },
            ],
        },
    ];

    const groupRules = useSelector(selectors.groupRules);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [complianceCheck, setComplianceCheck] = useState<boolean>(false);

    const [isEntityDetailMenuOpen, setIsEntityDetailMenuOpen] = useState(false);
    const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);
    const [groupRuleAttributeData, setGroupRuleAttributeData] = useState<{
        ruleName: string;
        attributes: AttributeResponseModel[];
    } | null>(null);

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
    }, [id, dispatch]);

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
                    <Link to={`../../${selectedEntityDetails?.resource}`}>
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
                              <Link to={`../../connectors/detail/${selectedEntityDetails?.entityDetails?.connectorUuid}`}>
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
                                content: <CustomTable headers={entityDetailHeaders} data={ruleDetailData} />,
                            },
                            {
                                title: 'Attributes',
                                content: <AttributeViewer attributes={selectedEntityDetails?.attributes} />,
                            },
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
        entityDetailHeaders,
        selectedEntityDetails,
        groupDetailData,
        ruleDetailData,
        isFetchingGroupRules,
        groupRulesDetailData,
        groupRulesDetailHeaders,
    ]);

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
                    />
                </Col>
                <Col>
                    <AvailableRulesAndGroups
                        profile={profile}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
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
        </Container>
    );
}
