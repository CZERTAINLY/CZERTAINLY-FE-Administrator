import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Form as BootstrapForm, Badge, Button, Col, Label, Row, ButtonGroup } from 'reactstrap';
import {
    BaseAttributeDto,
    ComplianceProfileDtoV2,
    ComplianceProfileRulesPatchRequestDto,
    FunctionGroupCode,
    PlatformEnum,
    Resource,
} from 'types/openapi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { actions, selectors } from 'ducks/compliance-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as connectorsActions, selectors as connectorsSelectors } from 'ducks/connectors';
import { actions as complianceActions } from 'ducks/compliance-profiles';
import CustomTable from 'components/CustomTable';
import {
    getAssignedInternalListOfGroupsAndRules,
    getAssignedProviderListOfGroupsAndRules,
    getRulesAndGroupsTableHeaders,
    formatAvailableRulesAndGroups,
    getListOfResources,
    rulesSourceOptions,
} from 'utils/compliance-profile';
import { capitalize } from 'utils/common-utils';
import WidgetButtons from 'components/WidgetButtons';
import { ResourceBadges } from 'components/_pages/compliance-profiles/detail/Components/ResourceBadges';
import AttributeViewer from 'components/Attributes/AttributeViewer';
import Dialog from 'components/Dialog';
import AttributeEditor from 'components/Attributes/AttributeEditor';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { Field, Form } from 'react-final-form';
import ProgressButton from 'components/ProgressButton';
import { selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { collectFormAttributes } from 'utils/attributes/attributes';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';

interface Props {
    profile: ComplianceProfileDtoV2 | undefined;
    setSelectedEntityDetails: (entityDetails: any) => void;
    setIsEntityDetailMenuOpen: (isEntityDetailMenuOpen: boolean) => void;
}

type TRuleGroupType = {
    uuid: string;
    name: string;
    description?: string;
    connectorUuid?: string;
    kind?: string;
    resource: string;
    entityDetails: {
        entityType: string;
    };
    attributes?: AttributeDescriptorModel[];
};

export default function AvailableRulesAndGroups({ profile, setSelectedEntityDetails, setIsEntityDetailMenuOpen }: Props) {
    const { id } = useParams();
    const dispatch = useDispatch();

    const isFetchingRules = useSelector(selectors.isFetchingRules);
    const isFetchingGroups = useSelector(selectors.isFetchingGroups);

    const rules = useSelector(selectors.rules);
    const groups = useSelector(selectors.groups);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const connectors = useSelector(connectorsSelectors.connectors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const [availableSelectedRulesSource, setAvailableSelectedRulesSource] = useState<'Internal' | 'Provider' | null>(null);
    const [selectedAvailableResourceType, setSelectedAvailableResourceType] = useState<string | null>('All');
    const [selectedAvailableProvider, setSelectedAvailableProvider] = useState<string | null>(null);
    const [selectedAvailableKind, setSelectedAvailableKind] = useState<string | null>(null);
    const [availableProviderOptions, setAvailableProviderOptions] = useState<{ label: string; value: string }[]>([]);
    const [availableKindOptions, setAvailableKindOptions] = useState<{ label: string; value: string }[]>([]);
    const [availableRulesAndGroupsResources, setAvailableRulesAndGroupsResources] = useState<(Resource | 'All')[]>(['All']);
    const [filteredAvailableRulesAndGroupsList, setFilteredAvailableRulesAndGroupsList] = useState<TRuleGroupType[]>([]);
    const [alreadyAssignedRulesandGroupUuidList, setAlreadyAssignedRulesandGroupUuidList] = useState<string[]>([]);
    const [isAddingRuleHasAttribute, setIsAddingRuleHasAttribute] = useState(false);
    const [addingRule, setAddingRule] = useState<TRuleGroupType | null>(null);

    const handleClearInput = () => {
        dispatch(complianceActions.clearRules());
        dispatch(complianceActions.clearGroups());
    };

    const getAvailableRulesAndGroupsWithoutAlreadyAssigned = useCallback(() => {
        if (!groups || !rules) return [];
        const withoutAssignedRulesandGroups = [
            ...formatAvailableRulesAndGroups('group', groups),
            ...formatAvailableRulesAndGroups('rule', rules),
        ].filter((ruleOrGroup) => !alreadyAssignedRulesandGroupUuidList.includes(ruleOrGroup.uuid));
        return withoutAssignedRulesandGroups as TRuleGroupType[];
    }, [groups, rules, alreadyAssignedRulesandGroupUuidList]);

    //get internal rules or provider data
    useEffect(() => {
        //TODO: change to 'All' when backend is updated
        if (availableSelectedRulesSource === 'Internal') {
            dispatch(actions.getListComplianceRules({ resource: Resource.ComplianceProfiles }));
        }
        if (availableSelectedRulesSource === 'Provider') {
            dispatch(connectorsActions.listConnectorsMerge({ functionGroup: FunctionGroupCode.ComplianceProvider }));
            dispatch(connectorsActions.listConnectorsMerge({ functionGroup: FunctionGroupCode.ComplianceProviderV2 }));
        }
    }, [availableSelectedRulesSource, dispatch]);

    //get provider options
    useEffect(() => {
        if (availableSelectedRulesSource === 'Provider') {
            setAvailableProviderOptions(connectors.map((connector) => ({ label: connector.name, value: connector.uuid })));
        }
    }, [availableSelectedRulesSource, connectors]);

    //get kind options
    useEffect(() => {
        if (availableSelectedRulesSource === 'Provider' && selectedAvailableProvider) {
            const allKinds = (connectors.find((connector) => connector.uuid === selectedAvailableProvider)?.functionGroups || []).flatMap(
                (fg) => fg.kinds || [],
            );
            const kindOptions = Array.from(new Set(allKinds)).map((kind) => ({ label: kind, value: kind }));
            setAvailableKindOptions(kindOptions);
        }
    }, [availableSelectedRulesSource, connectors, selectedAvailableProvider]);

    //get provider rules and groups
    useEffect(() => {
        if (availableSelectedRulesSource === 'Provider' && selectedAvailableProvider && selectedAvailableKind) {
            dispatch(
                actions.getListComplianceRules({
                    resource: Resource.Certificates,
                    connectorUuid: selectedAvailableProvider,
                    kind: selectedAvailableKind,
                }),
            );
            dispatch(
                actions.getListComplianceGroups({
                    resource: Resource.Certificates,
                    connectorUuid: selectedAvailableProvider,
                    kind: selectedAvailableKind,
                }),
            );
        }
    }, [availableSelectedRulesSource, selectedAvailableProvider, selectedAvailableKind, dispatch]);

    //get already assigned rules and groups uuid list
    useEffect(() => {
        const alreadyAssignedRulesandGroups = [
            ...getAssignedInternalListOfGroupsAndRules(profile),
            ...getAssignedProviderListOfGroupsAndRules(profile),
        ];
        setAlreadyAssignedRulesandGroupUuidList(alreadyAssignedRulesandGroups.map((ruleOrGroup) => ruleOrGroup.uuid));
    }, [profile]);

    //get initial available rules and groups list
    useEffect(() => {
        if (!groups || !rules) return;

        const withoutAssignedRulesandGroups = getAvailableRulesAndGroupsWithoutAlreadyAssigned();
        setFilteredAvailableRulesAndGroupsList(withoutAssignedRulesandGroups);
        setAvailableRulesAndGroupsResources(getListOfResources(withoutAssignedRulesandGroups));
    }, [groups, rules, alreadyAssignedRulesandGroupUuidList, getAvailableRulesAndGroupsWithoutAlreadyAssigned]);

    //get filtered by resource type
    useEffect(() => {
        const filtered = getAvailableRulesAndGroupsWithoutAlreadyAssigned().filter((ruleOrGroup) =>
            selectedAvailableResourceType !== 'All' ? ruleOrGroup.resource === selectedAvailableResourceType : true,
        );
        setFilteredAvailableRulesAndGroupsList(filtered);
    }, [getAvailableRulesAndGroupsWithoutAlreadyAssigned, selectedAvailableResourceType]);

    const tableHeadersAvailableRulesAndGroups = useMemo(() => {
        return getRulesAndGroupsTableHeaders('available');
    }, []);

    const tableDataAvailableRulesAndGroups = useMemo(
        () =>
            filteredAvailableRulesAndGroupsList.map((ruleOrGroup) => {
                return {
                    id: ruleOrGroup.uuid,
                    columns: [
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
                                    icon: 'plus',
                                    disabled: false,
                                    tooltip: 'Add',
                                    onClick: () => {
                                        if (!id) return;
                                        if (ruleOrGroup.entityDetails?.entityType === 'rule') {
                                            if (ruleOrGroup?.attributes?.length && ruleOrGroup?.attributes?.length > 0) {
                                                console.log({ ruleOrGroup });

                                                setIsAddingRuleHasAttribute(true);
                                                setAddingRule(ruleOrGroup);
                                            } else {
                                                const rulePayload = {
                                                    uuid: id,
                                                    complianceProfileRulesPatchRequestDto: {
                                                        removal: false,
                                                        ruleUuid: ruleOrGroup.uuid,
                                                        connectorUuid: ruleOrGroup?.connectorUuid ?? undefined,
                                                        kind: ruleOrGroup?.kind ?? undefined,
                                                        attributes: (ruleOrGroup?.attributes as AttributeRequestModel[]) ?? undefined,
                                                    },
                                                };
                                                console.log(rulePayload);

                                                dispatch(actions.updateRule(rulePayload));
                                            }
                                        }
                                        if (ruleOrGroup.entityDetails?.entityType === 'group') {
                                            const groupPayload = {
                                                uuid: id,
                                                complianceProfileGroupsPatchRequestDto: {
                                                    removal: false,
                                                    groupUuid: ruleOrGroup.uuid,
                                                    connectorUuid: ruleOrGroup.connectorUuid!,
                                                    kind: ruleOrGroup.kind!,
                                                },
                                            };
                                            console.log(groupPayload);

                                            dispatch(actions.updateGroup(groupPayload));
                                        }
                                    },
                                },
                            ]}
                        />,
                    ],
                };
            }),
        [dispatch, filteredAvailableRulesAndGroupsList, id, setIsEntityDetailMenuOpen, setSelectedEntityDetails],
    );

    function onSubmit(values: any) {
        if (!addingRule || !id) return;
        const attributes = collectFormAttributes('rule-attributes', addingRule?.attributes ?? [], values);
        const rulePayload = {
            uuid: id,
            complianceProfileRulesPatchRequestDto: {
                removal: false,
                ruleUuid: addingRule.uuid,
                connectorUuid: addingRule?.connectorUuid ?? undefined,
                kind: addingRule?.kind ?? undefined,
                attributes: attributes,
            },
        };
        dispatch(actions.updateRule(rulePayload));
        setIsAddingRuleHasAttribute(false);
        setAddingRule(null);
    }

    return (
        <>
            <Widget title="Available Rules & Groups" titleSize="large">
                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                    <Col>
                        <Label for="availableRulesSource">Rules Source</Label>
                        <Select
                            id="availableRulesSource"
                            inputId="availableRulesSource"
                            placeholder="Select..."
                            maxMenuHeight={140}
                            options={rulesSourceOptions}
                            value={rulesSourceOptions.find((opt) => opt.value === availableSelectedRulesSource) || null}
                            menuPlacement="auto"
                            onChange={(event) => {
                                setSelectedAvailableResourceType('All');
                                handleClearInput();
                                setAvailableSelectedRulesSource((event?.value as 'Internal' | 'Provider') || null);
                            }}
                            isClearable
                        />
                    </Col>
                </Row>
                {availableSelectedRulesSource === 'Provider' && (
                    <Row xs="1" sm="1" md="2" lg="2" xl="2" style={{ marginTop: '10px' }}>
                        <Col>
                            <Label for="availableProvider">Provider</Label>
                            <Select
                                id="availableProvider"
                                inputId="availableProvider"
                                placeholder="Select..."
                                maxMenuHeight={140}
                                options={availableProviderOptions}
                                value={availableProviderOptions.find((opt) => opt.value === selectedAvailableProvider) || null}
                                menuPlacement="auto"
                                onChange={(event) => {
                                    if (!event) {
                                        setSelectedAvailableKind(null);
                                        handleClearInput();
                                    }
                                    setSelectedAvailableProvider(event?.value || null);
                                }}
                                isClearable
                            />
                        </Col>
                        <Col>
                            <Label for="availableKind">Kind</Label>
                            <Select
                                id="availableKind"
                                inputId="availableKind"
                                placeholder="Select..."
                                maxMenuHeight={140}
                                options={availableKindOptions}
                                value={availableKindOptions.find((opt) => opt.value === selectedAvailableKind) || null}
                                onChange={(event) => {
                                    if (!event) {
                                        handleClearInput();
                                    }
                                    setSelectedAvailableKind(event?.value || null);
                                }}
                                menuPlacement="auto"
                                isClearable
                            />
                        </Col>
                    </Row>
                )}
                <ResourceBadges
                    resources={availableRulesAndGroupsResources}
                    selected={selectedAvailableResourceType}
                    onSelect={setSelectedAvailableResourceType}
                    getLabel={(resource) => getEnumLabel(resourceEnum, resource)}
                />
                <Widget titleSize="large" busy={isFetchingRules || isFetchingGroups}>
                    <CustomTable
                        headers={tableHeadersAvailableRulesAndGroups}
                        data={tableDataAvailableRulesAndGroups}
                        hasPagination={true}
                        hasDetails={true}
                        canSearch={true}
                    />
                </Widget>
            </Widget>
            <Dialog
                isOpen={isAddingRuleHasAttribute}
                caption="Attributes"
                body={
                    <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                        {({ handleSubmit, pristine, submitting, valid, form }) => (
                            <BootstrapForm onSubmit={handleSubmit}>
                                <AttributeEditor id="rule-attributes" attributeDescriptors={addingRule?.attributes ?? []} />
                                <div className="d-flex justify-content-end">
                                    <ButtonGroup>
                                        <ProgressButton
                                            title={'Add rule'}
                                            inProgressTitle={'Adding...'}
                                            inProgress={submitting}
                                            disabled={pristine || submitting || !valid}
                                        />

                                        <Button
                                            color="default"
                                            onClick={() => {
                                                setIsAddingRuleHasAttribute(false);
                                                setAddingRule(null);
                                            }}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </BootstrapForm>
                        )}
                    </Form>
                }
                toggle={() => setIsAddingRuleHasAttribute(false)}
                buttons={[]}
            />
        </>
    );
}
