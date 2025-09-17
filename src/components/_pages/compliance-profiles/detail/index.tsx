import ComplianceRuleAttributeViewer from 'components/Attributes/ComplianceRuleAttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';

import Widget from 'components/Widget';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/compliance-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';
import Select from 'react-select';

import { Badge, Button, Col, Container, Label, Row } from 'reactstrap';
import {
    ComplianceProfileGroupListResponseGroupModel,
    ComplianceProfileResponseGroupGroupModel,
    ComplianceProfileResponseRuleRuleModel,
    ComplianceProfileRuleListResponseRuleModel,
} from 'types/complianceProfiles';
import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import AddRuleWithAttributesDialogBody from '../form/AddRuleWithAttributesDialogBody/index.';
import AssociateRaProfileDialogBody from '../form/AssociateRaProfileDialogBody/AssociateRaProfileDialogBody';
import { createWidgetDetailHeaders } from 'utils/widget';
import GoBackButton from 'components/GoBackButton';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { capitalize } from 'utils/common-utils';
import TabLayout from 'components/Layout/TabLayout';
import AttributeViewer from 'components/Attributes/AttributeViewer';

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
                    availabilityStatus: 'available',
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
                    availabilityStatus: 'available',
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

    const profile = /* prof;  */ useSelector(selectors.complianceProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const associationsOfComplianceProfile = useSelector(selectors.associationsOfComplianceProfile);
    const rules = useSelector(selectors.rules);
    const groups = useSelector(selectors.groups);
    const isFetchingGroups = useSelector(selectors.isFetchingGroups);
    const isFetchingRules = useSelector(selectors.isFetchingRules);

    const [addRaProfile, setAddRaProfile] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [complianceCheck, setComplianceCheck] = useState<boolean>(false);

    // ==========================for assigned rules and groups
    const [assignedRulesSource, setAssignedRulesSource] = useState<'Internal' | 'Provider' | null>(null);
    const [assignedResourceType, setAssignedResourceType] = useState<string | null>('All');

    const [assignedRulesAndGroupsList, setAssignedRulesAndGroupsList] = useState<any[]>([]);
    const [assignedRulesAndGroupsResources, setAssignedRulesAndGroupsResources] = useState<any[]>(['All']);
    const [filteredAssignedRulesAndGroupList, setFilteredAssignedRulesAndGroupList] = useState<any[]>([]);
    const [assignedProvidersList, setAssignedProvidersList] = useState<{ label: string; value: string }[]>([]);
    const [selectedAssignedProvider, setSelectedAssignedProvider] = useState<string | null>(null);
    const [assignedKindsList, setAssignedKindsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedAssignedKind, setSelectedAssignedKind] = useState<string | null>(null);
    const [assignedListOfGroupsUuids, setAssignedListOfGroupsUuids] = useState<string[]>([]);

    //for assigned rules and groups ==========================//
    const [isEntityDetailMenuOpen, setIsEntityDetailMenuOpen] = useState(false);
    const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);

    //TODO: delete
    useEffect(() => {
        if (!id) return;
        dispatch(actions.getComplianceProfile({ uuid: id }));
        dispatch(actions.getAssociationsOfComplianceProfile({ uuid: id }));
    }, [dispatch, id]);

    const getFreshComplianceProfileDetails = useCallback(() => {
        if (!id) return;

        dispatch(actions.resetState());
        dispatch(actions.getComplianceProfile({ uuid: id }));
        /* dispatch(actions.getListComplianceGroupRules({ uuid: id })); */
        /*  dispatch(actions.getListComplianceRules({ resource: Resource.ComplianceProfiles }));
        dispatch(actions.getListComplianceGroups({ connectorUuid: '', kind: '', resource: Resource.ComplianceProfiles })); */
    }, [id, dispatch]);

    useEffect(() => {
        getFreshComplianceProfileDetails();
    }, [id, getFreshComplianceProfileDetails]);

    console.log({ profile });

    /* console.log({ associationsOfComplianceProfile, rules, groups }); */
    console.log({ filteredAssignedRulesAndGroupList });

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

    const assignedRulesAndGroupsHeaders = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                width: '20%',
                sortable: true,
            },
            {
                id: 'resource',
                content: 'Resource',
                width: '20%',
                sortable: true,
            },
            {
                id: 'type',
                content: 'Type',
                width: '20%',
                sortable: true,
            },
            /* {
                id: 'description',
                content: 'Description',
                width: '50%',
            }, */
            {
                id: 'action',
                content: 'Action',
                width: '10%',
            },
        ],
        [],
    );

    const assignedRulesAndGroupsData = useMemo(
        () =>
            filteredAssignedRulesAndGroupList.map((ruleOrGroup) => {
                const isDisabled =
                    ruleOrGroup.entityDetails?.entityType === 'rule' ? assignedListOfGroupsUuids.includes(ruleOrGroup.groupUuid) : false;
                if (ruleOrGroup.entityDetails?.entityType === 'rule') {
                    console.log(ruleOrGroup.groupUuid, {
                        assignedListOfGroupsUuids,
                    });
                }
                return {
                    id: ruleOrGroup.uuid,
                    columns: [
                        ruleOrGroup.name,
                        ruleOrGroup.resource,
                        <div>
                            <Badge color="secondary">{capitalize(ruleOrGroup?.entityDetails?.entityType)} </Badge>
                            <Button
                                className="btn btn-link"
                                color="white"
                                title="Rules"
                                onClick={() => {
                                    setSelectedEntityDetails(ruleOrGroup);
                                    setIsEntityDetailMenuOpen(true);
                                }}
                            >
                                <i className="fa fa-info" style={{ color: 'auto' }} />
                            </Button>
                        </div>,

                        /* ruleOrGroup.description, */
                        <WidgetButtons
                            justify="start"
                            buttons={[
                                {
                                    icon: 'minus-square',
                                    disabled: isDisabled,
                                    tooltip: 'Remove',
                                    onClick: () => {
                                        if (!id) return;
                                        if (ruleOrGroup.entityDetails?.entityType === 'rule') {
                                            dispatch(
                                                actions.updateRule({
                                                    uuid: id,
                                                    complianceProfileRulesPatchRequestDto: {
                                                        removal: true,
                                                        ruleUuid: ruleOrGroup.uuid,
                                                        connectorUuid: ruleOrGroup?.connectorUuid ?? undefined,
                                                        kind: ruleOrGroup?.kind ?? undefined,
                                                    },
                                                }),
                                            );
                                        }
                                        if (ruleOrGroup.entityDetails?.entityType === 'group') {
                                            dispatch(
                                                actions.updateGroup({
                                                    uuid: id,
                                                    complianceProfileGroupsPatchRequestDto: {
                                                        removal: true,
                                                        groupUuid: ruleOrGroup.groupUuid,
                                                        connectorUuid: ruleOrGroup?.connectorUuid ?? undefined,
                                                        kind: ruleOrGroup?.kind ?? undefined,
                                                    },
                                                }),
                                            );
                                        }
                                    },
                                },
                            ]}
                        />,
                    ],
                };
            }),
        [assignedListOfGroupsUuids, dispatch, filteredAssignedRulesAndGroupList, id],
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

    const entityDetailHeaders: TableHeader[] = useMemo(() => {
        return [
            { id: 'Property', content: 'Property' },
            { id: 'Value', content: 'Value' },
        ];
    }, []);

    const entityDetailData: TableDataRow[] = useMemo(() => {
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
            { id: 'type', columns: ['Type', capitalize(selectedEntityDetails?.type || '')] },
            { id: 'resource', columns: ['Resource', getEnumLabel(resourceEnum, selectedEntityDetails?.resource) || ''] },
            { id: 'format', columns: ['Format', selectedEntityDetails?.format || ''] },
            { id: 'provider', columns: ['Provider', selectedEntityDetails?.entityDetails?.connectorName || ''] },
            { id: 'kind', columns: ['Kind', selectedEntityDetails?.entityDetails?.kind || ''] },
        ];
    }, [selectedEntityDetails, resourceEnum]);

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

    /*    
    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    
    const [addRuleWithAttributes, setAddRuleWithAttributes] = useState<boolean>(false);
    const [addAttributeRuleDetails, setAddAttributeRuleDetails] = useState<any>();

    const [alreadyAssociatedRuleUuids, setAlreadyAssociatedRuleUuids] = useState<string[]>([]);
    const [alreadyAssociatedGroupUuids, setAlreadyAssociatedGroupUuids] = useState<string[]>([]);

    

    const [groupRuleMapping, setGroupRuleMapping] = useState<{ [key: string]: ComplianceProfileRuleListResponseRuleModel[] }>();

    const [currentGroupUuidForDisplay, setCurrentGroupUuidForDisplay] = useState<string>();

    const [selectionFilter, setSelectionFilter] = useState<string>('Selected');
    const [objectFilter, setObjectFilter] = useState<string>('Groups & Rules');

    

    const getComplianceRulesAndGroups = useCallback(() => {
        dispatch(actions.listComplianceRules());
        dispatch(actions.listComplianceGroups());
    }, [dispatch]);

    

    useEffect(() => {
        if (!id) return;

        let groupRuleMapping: { [key: string]: ComplianceProfileRuleListResponseRuleModel[] } = {};

        for (let connector of rules) {
            for (let rule of connector.rules) {
                const keyString =
                    (rule.groupUuid || 'unknown') + ':#' + connector.connectorUuid + ':#' + connector.kind + ':#' + connector.connectorName;

                if (groupRuleMapping[keyString]) {
                    groupRuleMapping[keyString].push(rule);
                } else {
                    groupRuleMapping[keyString] = [rule];
                }
            }
        }

        setGroupRuleMapping(groupRuleMapping);
    }, [rules, groups, id]);

    useEffect(() => {
        if (!id) return;

        let alreadyAssociatedRuleUuidsLcl: string[] = [];
        let alreadyAssociatedGroupUuidsLcl: string[] = [];

        for (let connector of profile?.rules || []) {
            if (connector.rules) {
                for (let rule of connector.rules) {
                    alreadyAssociatedRuleUuidsLcl.push(rule.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind);
                }
            }
        }

        for (let connector of profile?.groups || []) {
            if (connector.groups) {
                for (let group of connector.groups) {
                    alreadyAssociatedGroupUuidsLcl.push(group.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind);
                }
            }
        }

        setAlreadyAssociatedRuleUuids(alreadyAssociatedRuleUuidsLcl);
        setAlreadyAssociatedGroupUuids(alreadyAssociatedGroupUuidsLcl);
    }, [profile, id]);

    const onCloseGroupRuleDetail = useCallback(() => {
        setCurrentGroupUuidForDisplay(undefined);
    }, []);

    

    const onForceDeleteComplianceProfile = useCallback(() => {
        if (!profile) return;

        dispatch(actions.bulkForceDeleteComplianceProfiles({ uuids: [profile.uuid], redirect: `../complianceprofiles` }));
    }, [profile, dispatch]);

    const onAddRule = useCallback(
        (connectorUuid: string, kind: string, rule: ComplianceProfileRuleListResponseRuleModel, attributes?: any) => {
            if (!profile) return;

            dispatch(
                actions.addRule({
                    uuid: profile.uuid,
                    addRequest: {
                        connectorUuid: connectorUuid,
                        kind: kind,
                        ruleUuid: rule.uuid,
                        attributes: attributes,
                    },
                }),
            );
        },
        [profile, dispatch],
    );

    const onAddGroup = useCallback(
        (connectorUuid: string, connectorName: string, kind: string, group: ComplianceProfileGroupListResponseGroupModel) => {
            if (!profile) return;

            dispatch(
                actions.addGroup({
                    uuid: profile.uuid,
                    connectorName: connectorName,
                    connectorUuid: connectorUuid,
                    kind: kind,
                    groupUuid: group.uuid,
                    groupName: group.name,
                    description: group.description || '',
                    addRequest: { groupUuid: group.uuid, connectorUuid: connectorUuid, kind: kind },
                }),
            );
        },
        [profile, dispatch],
    );

    const onDeleteRule = useCallback(
        (connectorUuid: string, kind: string, rule: ComplianceProfileResponseRuleRuleModel) => {
            if (!profile) return;

            dispatch(
                actions.deleteRule({
                    uuid: profile.uuid,
                    deleteRequest: { connectorUuid: connectorUuid, kind: kind, ruleUuid: rule.uuid },
                }),
            );
        },
        [profile, dispatch],
    );

    const onDeleteGroup = useCallback(
        (connectorUuid: string, kind: string, group: ComplianceProfileResponseGroupGroupModel) => {
            if (!profile) return;

            dispatch(
                actions.deleteGroup({
                    uuid: profile.uuid,
                    deleteRequest: { connectorUuid: connectorUuid, kind: kind, groupUuid: group.uuid },
                }),
            );
        },
        [profile, dispatch],
    );

    const onAddRuleWithAttributes = useCallback(
        (connectorUuid: string, connectorName: string, kind: string, rule: ComplianceProfileRuleListResponseRuleModel) => {
            setAddAttributeRuleDetails({
                connectorUuid: connectorUuid,
                connectorName: connectorName,
                kind: kind,
                rule: rule,
            });

            setAddRuleWithAttributes(true);
        },
        [],
    );

    const ruleGroupHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'type',
                content: 'Type',
                width: '10%',
            },
            {
                id: 'action',
                content: 'Action',
                width: '10%',
            },
            {
                id: 'description',
                content: 'Description',
                width: '50%',
            },
        ],
        [],
    );

    

    const getRuleMoreData = useCallback((rule: ComplianceProfileRuleListResponseRuleModel, connectorName: string, kind: string) => {
        return [
            {
                id: 'connectorName',
                columns: ['Connector Name', connectorName],
            },
            {
                id: 'connectorKind',
                columns: ['Kind', kind],
            },
            {
                id: 'uuid',
                columns: ['UUID', rule.uuid],
            },
            {
                id: 'name',
                columns: ['Name', rule.name],
            },
            {
                id: 'description',
                columns: ['Description', rule.description || ''],
            },
            {
                id: 'groupUuid',
                columns: ['Group UUID', rule.groupUuid || ''],
            },
            {
                id: 'certificateType',
                columns: ['Certificate Type', rule.certificateType || ''],
            },
            {
                id: 'attributes',
                columns: [
                    'Attributes',
                    rule.attributes ? <ComplianceRuleAttributeViewer descriptorAttributes={rule.attributes} /> : <>No attributes</>,
                ],
            },
        ];
    }, []);

    const getRuleMoreDataRule = useCallback((rule: ComplianceProfileResponseRuleRuleModel, connectorName: string, kind: string) => {
        return [
            {
                id: 'connectorName',
                columns: ['Connector Name', connectorName],
            },
            {
                id: 'connectorKind',
                columns: ['Kind', kind],
            },
            {
                id: 'uuid',
                columns: ['UUID', rule.uuid],
            },
            {
                id: 'name',
                columns: ['Name', rule.name],
            },
            {
                id: 'description',
                columns: ['Description', rule.description || ''],
            },
            {
                id: 'groupUuid',
                columns: ['Group UUID', ''],
            },
            {
                id: 'certificateType',
                columns: ['Certificate Type', rule.certificateType || ''],
            },
            {
                id: 'attributes',
                columns: [
                    'Attributes',
                    rule.attributes ? <ComplianceRuleAttributeViewer attributes={rule.attributes} /> : <>No attributes</>,
                ],
            },
        ];
    }, []);

    const ruleHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
            },
            {
                id: 'description',
                content: 'Description',
            },
        ],
        [],
    );

    const ruleData: TableDataRow[] = useMemo(() => {
        if (!profile) return [];
        if (!profile.rules) return [];
        if (!currentGroupUuidForDisplay) return [];

        let data: TableDataRow[] = [];
        let dataSplit = currentGroupUuidForDisplay.split(':#');

        for (const rule of (groupRuleMapping && groupRuleMapping[currentGroupUuidForDisplay || '']) ?? []) {
            data.push({
                id: `${rule.uuid}-${dataSplit[1]}`,
                columns: [rule.name, rule.description || ''],
                detailColumns: [
                    <></>,
                    <></>,
                    <CustomTable data={getRuleMoreData(rule, dataSplit[3], dataSplit[2])} headers={detailHeaders} />,
                ],
            });
        }

        return data;
    }, [profile, currentGroupUuidForDisplay, groupRuleMapping, getRuleMoreData, detailHeaders]);

    

    const getGroupMoreData = useCallback((group: ComplianceProfileResponseGroupGroupModel, connectorName: string, kind: string) => {
        return [
            {
                id: 'connectorName',
                columns: ['Connector Name', connectorName],
            },
            {
                id: 'connectorKind',
                columns: ['Kind', kind],
            },
            {
                id: 'uuid',
                columns: ['UUID', group.uuid],
            },
            {
                id: 'name',
                columns: ['Name', group.name],
            },
            {
                id: 'description',
                columns: ['Description', group.description || ''],
            },
        ];
    }, []);

    const ruleGroupData: TableDataRow[] = useMemo(() => {
        if (!profile) return [];
        if (!profile.rules) return [];

        let data: TableDataRow[] = [];

        if (['Selected', 'All'].includes(selectionFilter) && ['Groups & Rules', 'Groups'].includes(objectFilter)) {
            for (const connector of profile.groups) {
                if (connector.groups && connector.connectorUuid && connector.kind && connector.connectorName) {
                    for (const group of connector.groups) {
                        const keyString =
                            group.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind + ':#' + connector.connectorName;

                        data.push({
                            id: `${group.uuid}-${connector.connectorUuid}`,

                            columns: [
                                <Badge color="secondary">Group</Badge>,

                                <div>
                                    <Button
                                        className="btn btn-link p-0"
                                        color="white"
                                        title="Remove"
                                        onClick={() => {
                                            onDeleteGroup(connector.connectorUuid!, connector.kind!, group);
                                        }}
                                    >
                                        <i className="fa fa-times" style={{ color: 'red' }} />
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button
                                        className="btn btn-link p-0"
                                        color="white"
                                        title="Edit"
                                        onClick={() => {
                                            setCurrentGroupUuidForDisplay(keyString);
                                        }}
                                    >
                                        <i className="fa fa-info" style={{ color: 'auto' }} />
                                    </Button>
                                </div>,

                                group.name,
                            ],

                            detailColumns: [
                                <></>,

                                <></>,

                                <></>,

                                <CustomTable
                                    data={getGroupMoreData(group, connector.connectorName!, connector.kind)}
                                    headers={detailHeaders}
                                />,
                            ],
                        });
                    }
                }
            }
        }

        if (['Selected', 'All'].includes(selectionFilter) && ['Groups & Rules', 'Rules'].includes(objectFilter)) {
            for (const connector of profile.rules) {
                if (connector.rules && connector.connectorUuid && connector.kind && connector.connectorName) {
                    for (const rule of connector.rules) {
                        data.push({
                            id: `${rule.uuid}-${connector.connectorUuid}`,

                            columns: [
                                <Badge color="secondary">Rule</Badge>,

                                <>
                                    <Button
                                        className="btn btn-link p-0"
                                        color="white"
                                        title="Remove"
                                        onClick={() => {
                                            onDeleteRule(connector.connectorUuid!, connector.kind!, rule);
                                        }}
                                    >
                                        <i className="fa fa-times" style={{ color: 'red' }} />
                                    </Button>
                                </>,
                                rule.description || rule.name,
                            ],

                            detailColumns: [
                                <></>,
                                <></>,
                                <></>,
                                <CustomTable
                                    data={getRuleMoreDataRule(rule, connector.connectorName, connector.kind)}
                                    headers={detailHeaders}
                                />,
                            ],
                        });
                    }
                }
            }

            for (const connector of profile.groups) {
                if (connector.groups && connector.connectorName && connector.kind) {
                    for (const group of connector.groups) {
                        const keyString =
                            group.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind + ':#' + connector.connectorName;

                        if (!groupRuleMapping) continue;

                        for (const rule of groupRuleMapping[keyString] || []) {
                            data.push({
                                id: `${rule.uuid}-${connector.connectorUuid}`,

                                columns: [
                                    <Badge color="secondary">Rule</Badge>,

                                    <>
                                        <Button
                                            className="btn btn-link p-0"
                                            color="white"
                                            title={`Rule is part of the group '${group.name}' and cannot be removed separately`}
                                        >
                                            <i className="fa fa-times" style={{ color: 'grey' }} />
                                        </Button>
                                    </>,

                                    rule.description || rule.name,
                                ],

                                detailColumns: [
                                    <></>,
                                    <></>,
                                    <></>,
                                    <CustomTable
                                        data={getRuleMoreData(rule, connector.connectorName, connector.kind)}
                                        headers={detailHeaders}
                                    />,
                                ],
                            });
                        }
                    }
                }
            }
        }

        if (['Unselected', 'All'].includes(selectionFilter) && ['Groups & Rules', 'Groups'].includes(objectFilter)) {
            for (const connector of groups) {
                for (const group of connector.groups) {
                    if (alreadyAssociatedGroupUuids.includes(group.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind)) continue;

                    const keyString = group.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind + ':#' + connector.connectorName;

                    data.push({
                        id: `${group.uuid}-${connector.connectorUuid}`,

                        columns: [
                            <Badge color="secondary">Group</Badge>,

                            <div>
                                <Button
                                    className="btn btn-link p-0"
                                    color="white"
                                    title="Add"
                                    onClick={() => {
                                        onAddGroup(connector.connectorUuid, connector.connectorName, connector.kind, group);
                                    }}
                                >
                                    <i className="fa fa-plus" style={{ color: 'auto' }} />
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button
                                    className="btn btn-link p-0"
                                    color="white"
                                    title="Rules"
                                    onClick={() => {
                                        setCurrentGroupUuidForDisplay(keyString);
                                    }}
                                >
                                    <i className="fa fa-info" style={{ color: 'auto' }} />
                                </Button>
                            </div>,

                            group.name,
                        ],

                        detailColumns: [
                            <></>,
                            <></>,
                            <></>,
                            <CustomTable data={getGroupMoreData(group, connector.connectorName, connector.kind)} headers={detailHeaders} />,
                        ],
                    });
                }
            }
        }

        if (['Unselected', 'All'].includes(selectionFilter) && ['Groups & Rules', 'Rules'].includes(objectFilter)) {
            for (const connector of rules) {
                for (const rule of connector.rules) {
                    if (alreadyAssociatedRuleUuids.includes(rule.uuid + ':#' + connector.connectorUuid + ':#' + connector.kind)) continue;

                    data.push({
                        id: `${rule.uuid}-${connector.connectorUuid}`,
                        columns: [
                            <Badge color="secondary">Rule</Badge>,

                            <>
                                <Button
                                    className="btn btn-link p-0"
                                    color="white"
                                    title="Add"
                                    onClick={() => {
                                        rule.attributes
                                            ? onAddRuleWithAttributes(
                                                  connector.connectorUuid,
                                                  connector.connectorName,
                                                  connector.kind,
                                                  rule,
                                              )
                                            : onAddRule(connector.connectorUuid, connector.kind, rule);
                                    }}
                                >
                                    <i className="fa fa-plus" style={{ color: 'auto' }} />
                                </Button>
                            </>,
                            rule.description || rule.name,
                        ],
                        detailColumns: [
                            <></>,
                            <></>,
                            <></>,
                            <CustomTable data={getRuleMoreData(rule, connector.connectorName, connector.kind)} headers={detailHeaders} />,
                        ],
                    });
                }
            }
        }

        return data;
    }, [
        profile,
        selectionFilter,
        objectFilter,
        getGroupMoreData,
        detailHeaders,
        onDeleteGroup,
        getRuleMoreDataRule,
        onDeleteRule,
        groupRuleMapping,
        getRuleMoreData,
        groups,
        alreadyAssociatedGroupUuids,
        onAddGroup,
        rules,
        alreadyAssociatedRuleUuids,
        onAddRuleWithAttributes,
        onAddRule,
    ]);

    const selectionFilterData =
        ['Selected', 'All', 'Unselected'].map((input) => ({
            label: input,
            value: input,
        })) || [];

    const optionFilterData = ['Groups & Rules', 'Rules', 'Groups'].map((input) => ({ label: input, value: input })) || []; */

    const getInternalListOfGroupsAndRules = useCallback(
        (resource?: Resource) => {
            if (!profile) return [];
            const internalRules = profile.internalRules
                .filter((rule) => (resource ? rule.resource === resource : true))
                .map((rule) => ({
                    ...rule,
                    entityDetails: {
                        entityType: 'rule',
                    },
                }));
            return internalRules;
        },
        [profile],
    );

    const getProviderListOfGroupsAndRules = useCallback(
        (resource?: Resource, providerUuid?: string | null) => {
            if (!profile) return [];
            const providerRulesAndGroupsList = profile.providerRules
                .filter((providerRule) => (providerUuid ? providerRule.connectorUuid === providerUuid : true))
                .map((providerRule) => {
                    return [
                        ...providerRule.rules
                            .filter((rule) => (resource ? rule.resource === resource : true))
                            .map((rule) => ({
                                ...rule,
                                entityDetails: {
                                    connectorUuid: providerRule.connectorUuid,
                                    connectorName: providerRule.connectorName,
                                    kind: providerRule.kind,
                                    entityType: 'rule',
                                },
                            })),
                        ...providerRule.groups
                            .filter((group) => (resource ? group.resource === resource : true))
                            .map((group) => ({
                                ...group,
                                entityDetails: {
                                    connectorUuid: providerRule.connectorUuid,
                                    connectorName: providerRule.connectorName,
                                    kind: providerRule.kind,
                                    entityType: 'group',
                                },
                            })),
                    ];
                })
                .flat();
            return providerRulesAndGroupsList;
        },
        [profile],
    );

    const getGroupsUuids = useCallback(() => {
        return profile?.providerRules.map((providerRule) => providerRule.groups.map((group) => group.uuid)).flat();
    }, [profile]);

    useEffect(() => {
        if (!profile) return;
        setAssignedListOfGroupsUuids(getGroupsUuids() || []);
    }, [getGroupsUuids, profile]);
    console.log({ assignedListOfGroupsUuids });

    const getInitialListOfGroupsAndRules = useCallback(
        (resource?: Resource) => {
            if (!profile) return [];

            return [...getInternalListOfGroupsAndRules(resource), ...getProviderListOfGroupsAndRules(resource)];
        },
        [getInternalListOfGroupsAndRules, getProviderListOfGroupsAndRules, profile],
    );

    const getListOfResources = useCallback(
        (rulesAndGroupsList: any[]) => {
            if (!profile) return [];
            const resourcesList = Array.from(new Set(rulesAndGroupsList.map((ruleOrGroup) => ruleOrGroup.resource)));
            return ['All', ...resourcesList];
        },
        [profile],
    );

    const filterRulesAndGroupsList = useCallback(() => {
        let filteredRulesAndGroupsList = [];
        let resourcesList = [];
        if (assignedRulesSource === 'Internal') {
            filteredRulesAndGroupsList = getInternalListOfGroupsAndRules(
                assignedResourceType === 'All' || assignedResourceType === null ? undefined : (assignedResourceType as Resource),
            );
            resourcesList = getListOfResources(getInternalListOfGroupsAndRules());
        } else if (assignedRulesSource === 'Provider') {
            filteredRulesAndGroupsList = getProviderListOfGroupsAndRules(
                assignedResourceType === 'All' || assignedResourceType === null ? undefined : (assignedResourceType as Resource),
                selectedAssignedProvider,
            );
            resourcesList = getListOfResources(getProviderListOfGroupsAndRules(undefined, selectedAssignedProvider));
        } else {
            filteredRulesAndGroupsList = getInitialListOfGroupsAndRules(
                assignedResourceType === 'All' || assignedResourceType === null ? undefined : (assignedResourceType as Resource),
            );
            resourcesList = getListOfResources(getInitialListOfGroupsAndRules());
        }
        setFilteredAssignedRulesAndGroupList(filteredRulesAndGroupsList);
        setAssignedRulesAndGroupsResources(resourcesList);
    }, [
        assignedRulesSource,
        getInternalListOfGroupsAndRules,
        assignedResourceType,
        getListOfResources,
        getProviderListOfGroupsAndRules,
        selectedAssignedProvider,
        getInitialListOfGroupsAndRules,
    ]);

    useEffect(() => {
        setAssignedRulesAndGroupsList(getInitialListOfGroupsAndRules());
    }, [getInitialListOfGroupsAndRules]);

    useEffect(() => {
        setAssignedRulesAndGroupsResources(getListOfResources(assignedRulesAndGroupsList));
    }, [assignedRulesAndGroupsList, getListOfResources]);

    useEffect(() => {
        filterRulesAndGroupsList();
    }, [assignedRulesSource, assignedResourceType, filterRulesAndGroupsList]);

    const getListOfProviders = useCallback(() => {
        return profile?.providerRules
            .filter((providerRule) => (selectedAssignedKind ? providerRule.kind === selectedAssignedKind : true))
            .map((providerRule) => ({
                label: providerRule.connectorName,
                value: providerRule.connectorUuid,
            }));
    }, [profile, selectedAssignedKind]);

    useEffect(() => {
        if (assignedRulesSource === 'Provider') {
            setAssignedProvidersList(getListOfProviders() || []);
        }
    }, [assignedRulesSource, getListOfProviders]);

    const getListOfKinds = useCallback(() => {
        return profile?.providerRules
            .filter((providerRule) => (selectedAssignedProvider ? providerRule.connectorUuid === selectedAssignedProvider : true))
            .map((providerRule) => ({
                label: providerRule.kind,
                value: providerRule.kind,
            }));
    }, [profile, selectedAssignedProvider]);

    useEffect(() => {
        if (assignedRulesSource === 'Provider') {
            setAssignedKindsList(getListOfKinds() || []);
        }
    }, [assignedRulesSource, getListOfKinds]);

    const EntityDetailMenu = useCallback(() => {
        return (
            <Widget
                /* title={`${capitalize(selectedEntityDetails?.entityDetails?.entityType)}: ${selectedEntityDetails?.name}`} */
                titleSize="large"
            >
                {selectedEntityDetails?.entityDetails?.entityType === 'rule' && (
                    <TabLayout
                        tabs={[
                            {
                                title: 'Details',
                                content: <CustomTable headers={entityDetailHeaders} data={entityDetailData} />,
                            },
                            {
                                title: 'Attributes',
                                content: <AttributeViewer attributes={selectedEntityDetails?.attributes} />,
                            },
                        ]}
                    />
                )}
                {selectedEntityDetails?.entityDetails?.entityType === 'group' && (
                    <div>
                        <Label>Group Details</Label>
                    </div>
                )}
            </Widget>
        );
    }, [entityDetailHeaders, selectedEntityDetails, entityDetailData]);

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
                    <Widget title="Assigned Rules & Groups" busy={isFetchingRules} titleSize="large">
                        <Row xs="1" sm="1" md="2" lg="2" xl="2">
                            <Col>
                                <Label for="assignedRulesSource">Rules Source</Label>
                                <Select
                                    id="assignedRulesSource"
                                    inputId="assignedRulesSource"
                                    placeholder="Select..."
                                    maxMenuHeight={140}
                                    options={assignedRulesSourceOptions}
                                    value={assignedRulesSourceOptions.find((opt) => opt.value === assignedRulesSource) || null}
                                    menuPlacement="auto"
                                    onChange={(event) => {
                                        setAssignedResourceType('All');
                                        setAssignedRulesSource((event?.value as 'Internal' | 'Provider') || null);
                                    }}
                                    isClearable
                                />
                            </Col>
                        </Row>
                        {assignedRulesSource === 'Provider' && (
                            <Row xs="1" sm="1" md="2" lg="2" xl="2" style={{ marginTop: '10px' }}>
                                <Col>
                                    <Label for="assignedProvider">Provider</Label>
                                    <Select
                                        id="assignedProvider"
                                        inputId="assignedProvider"
                                        placeholder="Select..."
                                        maxMenuHeight={140}
                                        options={assignedProvidersList}
                                        value={assignedProvidersList.find((opt) => opt.value === selectedAssignedProvider) || null}
                                        menuPlacement="auto"
                                        onChange={(event) => {
                                            setSelectedAssignedProvider(event?.value || null);
                                        }}
                                        isClearable
                                    />
                                </Col>
                                <Col>
                                    <Label for="assignedKind">Kind</Label>
                                    <Select
                                        id="assignedKind"
                                        inputId="assignedKind"
                                        placeholder="Select..."
                                        maxMenuHeight={140}
                                        options={assignedKindsList}
                                        value={assignedKindsList.find((opt) => opt.value === selectedAssignedKind) || null}
                                        onChange={(event) => {
                                            setSelectedAssignedKind(event?.value || null);
                                        }}
                                        menuPlacement="auto"
                                        isClearable
                                    />
                                </Col>
                            </Row>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px 0 10px 0' }}>
                            {assignedRulesAndGroupsResources.map((resource) => (
                                <Badge
                                    color={assignedResourceType === resource ? 'primary' : 'light'}
                                    onClick={() => setAssignedResourceType(resource)}
                                    style={{ cursor: 'pointer', margin: '10px 4px 0 4px', fontSize: '14px' }}
                                >
                                    {getEnumLabel(resourceEnum, resource)}
                                </Badge>
                            ))}
                        </div>
                        <Widget titleSize="large">
                            <CustomTable
                                headers={assignedRulesAndGroupsHeaders}
                                data={assignedRulesAndGroupsData}
                                hasPagination={true}
                                hasDetails={true}
                                canSearch={true}
                            />
                        </Widget>
                    </Widget>
                </Col>
                <Col>
                    {' '}
                    <Widget title="Available Rules & Groups" busy={isFetchingGroups} titleSize="large">
                        {/*  <CustomTable headers={groupHeaders} data={groupData} /> */}
                    </Widget>
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
                    selectedEntityDetails
                        ? `${capitalize(selectedEntityDetails?.entityDetails?.entityType)}: ${selectedEntityDetails?.name}`
                        : 'Entity Details'
                }
                body={<EntityDetailMenu />}
                toggle={() => setIsEntityDetailMenuOpen(false)}
                buttons={[]}
            />

            {/*  <Widget
                title="Rules & Groups"
                busy={isFetchingGroups || isFetchingRules}
                titleSize="large"
                refreshAction={profile && getComplianceRulesAndGroups}
                widgetLockName={LockWidgetNameEnum.ComplianceProfileDetails}
            >
                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                    <Col>
                        <Label>Filter by Selection</Label>
                        <Select
                            maxMenuHeight={140}
                            options={selectionFilterData}
                            value={{ label: selectionFilter || 'Selected', value: selectionFilter || 'Selected' }}
                            menuPlacement="auto"
                            onChange={(event) => setSelectionFilter(event?.value || '')}
                        />
                    </Col>
                    <Col>
                        <Label>Filter by Object</Label>
                        <Select
                            maxMenuHeight={140}
                            options={optionFilterData}
                            value={{ label: objectFilter || 'Groups & Rules', value: objectFilter || 'Groups & Rules' }}
                            menuPlacement="auto"
                            onChange={(event) => setObjectFilter(event?.value || '')}
                        />
                    </Col>
                </Row>
                <hr />

                <CustomTable headers={ruleGroupHeader} data={ruleGroupData} hasPagination={true} hasDetails={true} canSearch={true} />
            </Widget> */}

            {/* <Dialog
                isOpen={currentGroupUuidForDisplay !== undefined}
                caption="Rules"
                size="lg"
                body={<CustomTable headers={ruleHeader} data={ruleData} hasPagination={true} hasDetails={true} />}
                toggle={onCloseGroupRuleDetail}
                buttons={[{ color: 'secondary', onClick: () => onCloseGroupRuleDetail(), body: 'Cancel' }]}
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
