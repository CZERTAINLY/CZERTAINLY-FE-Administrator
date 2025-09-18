import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, Col, Label, Row } from 'reactstrap';
import { actions, selectors } from 'ducks/compliance-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { ComplianceProfileDtoV2, PlatformEnum, Resource } from 'types/openapi';
import CustomTable from 'components/CustomTable';
import { capitalize } from 'cypress/types/lodash';
import WidgetButtons from 'components/WidgetButtons';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

interface Props {
    profile: ComplianceProfileDtoV2;
    selectedEntityDetails: any;
    setSelectedEntityDetails: (entityDetails: any) => void;
    isEntityDetailMenuOpen: boolean;
    setIsEntityDetailMenuOpen: (isEntityDetailMenuOpen: boolean) => void;
}

export default function AssignedRulesAndGroup({
    profile,
    selectedEntityDetails,
    setSelectedEntityDetails,
    isEntityDetailMenuOpen,
    setIsEntityDetailMenuOpen,
}: Props) {
    const { id } = useParams();
    const dispatch = useDispatch();

    const isFetchingRules = useSelector(selectors.isFetchingRules);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const [assignedRulesSource, setAssignedRulesSource] = useState<'Internal' | 'Provider' | null>(null);
    const [assignedResourceType, setAssignedResourceType] = useState<string | null>('All');

    const [assignedRulesAndGroupsList, setAssignedRulesAndGroupsList] = useState<any[]>([]);
    const [assignedRulesAndGroupsResources, setAssignedRulesAndGroupsResources] = useState<any[]>(['All']);
    const [filteredAssignedRulesAndGroupList, setFilteredAssignedRulesAndGroupList] = useState<any[]>([]);
    const [assignedProvidersList, setAssignedProvidersList] = useState<{ label: string; value: string }[]>([]);
    const [selectedAssignedProvider, setSelectedAssignedProvider] = useState<string | null>(null);
    const [assignedKindsList, setAssignedKindsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedAssignedKind, setSelectedAssignedKind] = useState<string | null>(null);

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
                if (ruleOrGroup.entityDetails?.entityType === 'group') {
                    console.log({ ruleOrGroup });
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
                                    disabled: false,
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
                                                        groupUuid: ruleOrGroup.uuid,
                                                        connectorUuid: ruleOrGroup.entityDetails.connectorUuid ?? undefined,
                                                        kind: ruleOrGroup.entityDetails.kind ?? undefined,
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
        [dispatch, filteredAssignedRulesAndGroupList, id, setIsEntityDetailMenuOpen, setSelectedEntityDetails],
    );

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

    return (
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
            <div style={{ display: 'flex', flexWrap: 'wrap', padding: '0 0 10px 0' }}>
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
    );
}
