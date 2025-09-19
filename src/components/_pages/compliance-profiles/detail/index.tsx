import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

import Widget from 'components/Widget';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/compliance-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';

import { Badge, Button, Col, Container, Row } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import AssociateRaProfileDialogBody from '../form/AssociateRaProfileDialogBody/AssociateRaProfileDialogBody';
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

const prof = {
    uuid: '6db02cd3-71c0-4b3f-be98-97d4bbd8320c',
    name: 'test',
    description: 'test',
    internalRules: [
        {
            uuid: '095be615-a8ad-4c33-8e9c-c7612fbf6c9f',
            name: 'string',
            description: 'Sample rule description',
            groupUuid: '166b5cf52-63f2-11ec-90d6-0242ac120003',
            availabilityStatus: 'available',
            updatedReason: 'string',
            resource: 'NONE',
            type: 'X.509',
            format: 'pkcs7',
            attributes: [],
        },
        {
            uuid: '2095be615-a8ad-4c33-8e9c-c7612fbf6c9f',
            name: 'string2',
            description: 'Sample rule description',
            groupUuid: '166b5cf52-63f2-11ec-90d6-0242ac120003',
            availabilityStatus: 'available',
            updatedReason: 'string',
            resource: 'authorities',
            type: 'X.509',
            format: 'pkcs7',
            attributes: [],
        },
    ],
    providerRules: [
        {
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            connectorName: 'X509-Compliance-Provider',
            kind: 'x520',
            rules: [
                {
                    uuid: '40f084cc-ddc1-11ec-9d7f-34cff65c6ee3',
                    name: 'e_algorithm_identifier_improper_encoding',
                    description:
                        'Encoded AlgorithmObjectIdentifier objects inside a SubjectPublicKeyInfo field MUST comply with specified byte sequences.',
                    groupUuid: '5235104e-ddb2-11ec-9d64-0242ac120002',
                    availabilityStatus: 'not_available',
                    resource: 'authorities',
                    type: 'X.509',
                    attributes: [],
                },
                {
                    uuid: '40f084cd-ddc1-11ec-82b0-34cff65c6ee3',
                    name: 'e_basic_constraints_not_critical',
                    description: 'basicConstraints MUST appear as a critical extension',
                    groupUuid: '523513dc-ddb2-11ec-9d64-0242ac120002',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                    type: 'X.509',
                    attributes: [],
                },
                {
                    uuid: '40f084cf-ddc1-11ec-b4e7-34cff65c6ee3',
                    name: 'e_ca_common_name_missing',
                    description: 'CA Certificates common name MUST be included.',
                    groupUuid: '5235104e-ddb2-11ec-9d64-0242ac120002',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                    type: 'X.509',
                    attributes: [],
                },
                {
                    uuid: '40f084d1-ddc1-11ec-97de-34cff65c6ee3',
                    name: 'e_ca_country_name_missing',
                    description: 'Root and Subordinate CA certificates MUST have a countryName present in subject information',
                    groupUuid: '5235104e-ddb2-11ec-9d64-0242ac120002',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                    type: 'X.509',
                    attributes: [],
                },
            ],
            groups: [
                {
                    uuid: '523513dc-ddb2-11ec-9d64-0242ac120002',
                    name: 'RFC 5280',
                    description: 'https://datatracker.ietf.org/doc/html/rfc5280',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                },
                {
                    uuid: 'e1d0af6e-ddb3-11ec-9d64-0242ac120002',
                    name: 'RFC 5891',
                    description: 'https://datatracker.ietf.org/doc/html/rfc5891',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                },
                {
                    uuid: 'e1d0ad66-ddb3-11ec-9d64-0242ac120002',
                    name: 'RFC 5480',
                    description: 'https://datatracker.ietf.org/doc/html/rfc5480',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                },
            ],
        },
        {
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd22',
            connectorName: 'test-X509-Compliance-Provider',
            kind: 'x509',
            rules: [
                {
                    uuid: '240f084cc-ddc1-11ec-9d7f-34cff65c6ee3',
                    name: 'e_algorithm_identifier_improper_encoding',
                    description:
                        'Encoded AlgorithmObjectIdentifier objects inside a SubjectPublicKeyInfo field MUST comply with specified byte sequences.',
                    groupUuid: '5235104e-ddb2-11ec-9d64-0242ac120002',
                    availabilityStatus: 'updated',
                    updatedReason:
                        'some updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reasonsome updated reason ',
                    resource: 'certificates',
                    type: 'X.509',
                    attributes: [],
                },
            ],
            groups: [
                {
                    uuid: '2523513dc-ddb2-11ec-9d64-0242ac120002',
                    name: 'RFC 5280',
                    description: 'https://datatracker.ietf.org/doc/html/rfc5280',
                    availabilityStatus: 'available',
                    resource: 'certificates',
                },
            ],
        },
    ],
    customAttributes: [
        {
            uuid: '92de3778-d990-4d31-9b87-b0086882e2b2',
            name: 'textCustomAttrExecution',
            label: 'textCustomAttrExecution',
            type: 'custom',
            contentType: 'text',
            content: [
                {
                    data: 't1',
                },
            ],
        },
    ],
};

const resourcesList = [
    'dashboard',
    'settings',
    'auditLogs',
    'credentials',
    'connectors',
    'attributes',
    'jobs',
    'users',
    'roles',
    'acmeAccounts',
    'acmeProfiles',
    'scepProfiles',
    'cmpProfiles',
    'authorities',
    'raProfiles',
    'certificates',
    'certificateRequests',
    'groups',
    'complianceProfiles',
    'discoveries',
    'oids',
    'entities',
    'locations',
    'tokenProfiles',
    'tokens',
    'keys',
    'approvalProfiles',
    'approvals',
    'notificationProfiles',
    'notificationInstances',
    'rules',
    'actions',
    'triggers',
    'resources',
    'resourceEvents',
    'searchFilters',
    'keyItems',
    'platformEnums',
    'notifications',
    'conditions',
    'executions',
    'complianceRules',
    'complianceGroups',
    'customAttributes',
    'globalMetadata',
    'acmeOrders',
    'acmeAuthorizations',
    'acmeChallenges',
    'cmpTransactions',
    'endEntityProfiles',
    'authenticationProviders',
];

const assignedRulesSourceOptions = [
    {
        label: 'Provider',
        value: 'Provider',
    },
    {
        label: 'Internal',
        value: 'Internal',
    },
];

export default function ComplianceProfileDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const profile = /*  prof; */ useSelector(selectors.complianceProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const associationsOfComplianceProfile = useSelector(selectors.associationsOfComplianceProfile);
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

    const groupRules = /* test; */ useSelector(selectors.groupRules);

    const [addRaProfile, setAddRaProfile] = useState<boolean>(false);
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

    console.log({ profile });

    const onDissociateRaProfile = useCallback(
        (resource: Resource, associatedProfileUuid: string) => {
            if (!profile) return;

            dispatch(
                actions.dissociateComplianceProfile({
                    uuid: profile.uuid,
                    resource: resource,
                    associationObjectUuid: associatedProfileUuid,
                }),
            );
        },
        [profile, dispatch],
    );

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

    const raProfileHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'raProfileName',
                content: 'Name',
            },
            { id: 'resource', content: 'Resource' },
            { id: 'object', content: 'Object' },
            {
                id: 'action',
                content: 'Action',
            },
        ],
        [],
    );

    const raProfileData: TableDataRow[] = useMemo(
        () =>
            !associationsOfComplianceProfile || !profile
                ? []
                : associationsOfComplianceProfile.map((associatedProfile) => ({
                      id: associatedProfile.objectUuid,
                      columns: [
                          <Link to={`../../raprofiles/detail/${profile.uuid}/${associatedProfile.objectUuid}`}>
                              {associatedProfile!.name}
                          </Link>,

                          associatedProfile.resource,
                          associatedProfile.objectUuid,
                          <WidgetButtons
                              justify="start"
                              buttons={[
                                  {
                                      icon: 'minus-square',
                                      disabled: false,
                                      tooltip: 'Remove',
                                      onClick: () => {
                                          onDissociateRaProfile(associatedProfile.resource, associatedProfile.objectUuid);
                                      },
                                  },
                              ]}
                          />,
                      ],
                  })),
        [associationsOfComplianceProfile, profile, onDissociateRaProfile],
    );

    const raProfileButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Associate RA Profile',
                onClick: () => {
                    setAddRaProfile(true);
                },
            },
        ],
        [],
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
                    <Widget
                        title="Associations"
                        busy={isFetchingDetail}
                        widgetButtons={raProfileButtons}
                        titleSize="large"
                        widgetLockName={LockWidgetNameEnum.ComplianceProfileDetails}
                        lockSize="large"
                    >
                        <CustomTable headers={raProfileHeaders} data={raProfileData} />
                    </Widget>

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
                isOpen={addRaProfile}
                caption="Associate RA Profile"
                body={AssociateRaProfileDialogBody({
                    visible: addRaProfile,
                    onClose: () => setAddRaProfile(false),
                    complianceProfileUuid: profile?.uuid,
                    availableRaProfileUuids: associationsOfComplianceProfile?.map((e) => e.objectUuid),
                })}
                toggle={() => setAddRaProfile(false)}
                buttons={[]}
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

            {/*  
            

            <Dialog
                isOpen={addRuleWithAttributes}
                caption="Attributes"
                body={AddRuleWithAttributesDialogBody({
                    onClose: () => setAddRuleWithAttributes(false),
                    complianceProfileUuid: profile?.uuid,
                    connectorUuid: addAttributeRuleDetails?.connectorUuid,
                    connectorName: addAttributeRuleDetails?.connectorName,
                    kind: addAttributeRuleDetails?.kind,
                    ruleUuid: addAttributeRuleDetails?.rule.uuid,
                    ruleName: addAttributeRuleDetails?.rule.name,
                    ruleDescription: addAttributeRuleDetails?.rule?.description,
                    groupUuid: addAttributeRuleDetails?.rule?.groupUuid,
                    attributes: addAttributeRuleDetails?.rule?.attributes,
                })}
                toggle={() => setAddRuleWithAttributes(false)}
                buttons={[]}
            />

            */}
        </Container>
    );
}
