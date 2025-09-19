import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, Col, Label, Row, Tooltip, UncontrolledTooltip } from 'reactstrap';
import { actions, selectors } from 'ducks/compliance-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { ComplianceProfileDtoV2, PlatformEnum, Resource } from 'types/openapi';
import CustomTable from 'components/CustomTable';
import WidgetButtons from 'components/WidgetButtons';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { capitalize } from 'utils/common-utils';
import {
    getAssignedInternalListOfGroupsAndRules,
    getAssignedProviderListOfGroupsAndRules,
    getComplianceProfileStatusColor,
    getRulesAndGroupsTableHeaders,
    getListOfResources as getListOfResourcesUtil,
    truncateText,
    rulesSourceOptions,
} from 'utils/compliance-profile';
import { ResourceBadges } from 'components/_pages/compliance-profiles/detail/Components/ResourceBadges';

interface Props {
    profile: ComplianceProfileDtoV2 | undefined;
    setSelectedEntityDetails: (entityDetails: any) => void;
    setIsEntityDetailMenuOpen: (isEntityDetailMenuOpen: boolean) => void;
}

export default function AssignedRulesAndGroup({ profile, setSelectedEntityDetails, setIsEntityDetailMenuOpen }: Props) {
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

    const tableHeadersAssignedRulesAndGroups = useMemo(() => {
        return getRulesAndGroupsTableHeaders('assigned');
    }, []);

    const tableDataAssignedRulesAndGroups = useMemo(
        () =>
            filteredAssignedRulesAndGroupList.map((ruleOrGroup) => {
                const statusColor = getComplianceProfileStatusColor(ruleOrGroup.availabilityStatus);
                return {
                    id: ruleOrGroup.uuid,
                    columns: [
                        <div>
                            <Badge
                                id={`status-${ruleOrGroup.uuid.replace(/-/g, '_')}`}
                                color={statusColor}
                                style={{ background: statusColor }}
                            >
                                {capitalize(ruleOrGroup.availabilityStatus)}
                            </Badge>
                            {ruleOrGroup.updatedReason && (
                                <UncontrolledTooltip target={`status-${ruleOrGroup.uuid.replace(/-/g, '_')}`}>
                                    {truncateText(capitalize(ruleOrGroup.updatedReason), 100)}
                                </UncontrolledTooltip>
                            )}
                        </div>,

                        ruleOrGroup.name,
                        ruleOrGroup.resource,
                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                            const rulePayload = {
                                                uuid: id,
                                                complianceProfileRulesPatchRequestDto: {
                                                    removal: true,
                                                    ruleUuid: ruleOrGroup.uuid,
                                                    connectorUuid: ruleOrGroup?.entityDetails?.connectorUuid ?? undefined,
                                                    kind: ruleOrGroup?.entityDetails?.kind ?? undefined,
                                                },
                                            };
                                            console.log(rulePayload);

                                            dispatch(actions.updateRule(rulePayload));
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
            return getAssignedInternalListOfGroupsAndRules(profile, resource);
        },
        [profile],
    );

    const getProviderListOfGroupsAndRules = useCallback(
        (resource?: Resource, providerUuid?: string | null, kind?: string | null) => {
            if (!profile) return [];
            return getAssignedProviderListOfGroupsAndRules(profile, resource, providerUuid, kind);
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
        (rulesAndGroupsList: any[]): string[] => {
            if (!profile) return [];
            return getListOfResourcesUtil(rulesAndGroupsList);
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
                selectedAssignedKind,
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
        selectedAssignedKind,
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
                        options={rulesSourceOptions}
                        value={rulesSourceOptions.find((opt) => opt.value === assignedRulesSource) || null}
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
            <ResourceBadges
                resources={assignedRulesAndGroupsResources}
                selected={assignedResourceType}
                onSelect={setAssignedResourceType}
                getLabel={(resource) => getEnumLabel(resourceEnum, resource)}
            />
            <Widget titleSize="large" busy={isFetchingRules}>
                <CustomTable
                    headers={tableHeadersAssignedRulesAndGroups}
                    data={tableDataAssignedRulesAndGroups}
                    hasPagination={true}
                    hasDetails={true}
                    canSearch={true}
                />
            </Widget>
        </Widget>
    );
}
