import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Form as BootstrapForm, Button, Col, Label, Row, ButtonGroup } from 'reactstrap';
import { ComplianceProfileDtoV2, ComplianceRuleListDto, FunctionGroupCode, PlatformEnum, Resource } from 'types/openapi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { actions, selectors, actions as complianceActions } from 'ducks/compliance-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as connectorsActions, selectors as connectorsSelectors } from 'ducks/connectors';
import CustomTable from 'components/CustomTable';
import {
    getAssignedInternalListOfGroupsAndRules,
    getAssignedProviderListOfGroupsAndRules,
    getRulesAndGroupsTableHeaders,
    formatAvailableRulesAndGroups,
    getListOfResources,
    rulesSourceOptions,
    getTypeTableColumn,
} from 'utils/compliance-profile';
import WidgetButtons from 'components/WidgetButtons';
import type { WidgetButtonProps } from 'components/WidgetButtons';
import { ResourceBadges } from 'components/_pages/compliance-profiles/detail/Components/ResourceBadges';
import Dialog from 'components/Dialog';
import AttributeEditor from 'components/Attributes/AttributeEditor';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { Form } from 'react-final-form';
import ProgressButton from 'components/ProgressButton';
import { collectFormAttributes } from 'utils/attributes/attributes';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';
import InternalRuleForm from 'components/_pages/compliance-profiles/detail/InternalRuleForm/InternalRuleForm';
import { LockWidgetNameEnum } from 'types/user-interface';
import { TRuleGroupType } from 'types/complianceProfiles';

interface Props {
    profile: ComplianceProfileDtoV2 | undefined;
    setSelectedEntityDetails: (entityDetails: any) => void;
    setIsEntityDetailMenuOpen: (isEntityDetailMenuOpen: boolean) => void;
    onReset?: (resetFn: () => void) => void;
}

export default function AvailableRulesAndGroups({ profile, setSelectedEntityDetails, setIsEntityDetailMenuOpen, onReset }: Props) {
    const { id } = useParams();
    const dispatch = useDispatch();

    const isFetchingRules = useSelector(selectors.isFetchingRules);
    const isFetchingGroups = useSelector(selectors.isFetchingGroups);

    const rules = useSelector(selectors.rules);
    const groups = useSelector(selectors.groups);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const connectors = useSelector(connectorsSelectors.connectors);

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
    const [isAssigningRule, setIsAssigningRule] = useState<TRuleGroupType | null>(null);
    const [isAddingInternalRule, setIsAddingInternalRule] = useState(false);
    const [deletingInternalRuleId, setDeletingInternalRuleId] = useState<string | null>(null);
    const [editingInternalRule, setEditingInternalRule] = useState<TRuleGroupType | null>(null);

    const handleClearInput = useCallback(() => {
        dispatch(complianceActions.clearRules());
        dispatch(complianceActions.clearGroups());
    }, [dispatch]);

    const resetSelectValues = useCallback(() => {
        setAvailableSelectedRulesSource(null);
        setSelectedAvailableResourceType('All');
        setSelectedAvailableProvider(null);
        setSelectedAvailableKind(null);
        handleClearInput();
    }, [handleClearInput]);

    // Expose reset function to parent component
    useEffect(() => {
        if (onReset) {
            onReset(resetSelectValues);
        }
    }, [onReset, resetSelectValues]);

    //get internal rules or provider data
    useEffect(() => {
        if (availableSelectedRulesSource === 'Internal') {
            dispatch(actions.getListComplianceRules({}));
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
            const allKinds = (connectors.find((connector) => connector.uuid === selectedAvailableProvider)?.functionGroups ?? []).flatMap(
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
                    connectorUuid: selectedAvailableProvider,
                    kind: selectedAvailableKind,
                }),
            );
            dispatch(
                actions.getListComplianceGroups({
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

    const getAvailableRulesAndGroupsWithoutAlreadyAssigned = useCallback(() => {
        if (!groups || !rules) return [];
        const withoutAssignedRulesandGroups = [
            ...formatAvailableRulesAndGroups('group', groups),
            ...formatAvailableRulesAndGroups('rule', rules),
        ].filter((ruleOrGroup) => !alreadyAssignedRulesandGroupUuidList.includes(ruleOrGroup.uuid));
        return withoutAssignedRulesandGroups as TRuleGroupType[];
    }, [groups, rules, alreadyAssignedRulesandGroupUuidList]);

    //get initial available rules and groups list
    useEffect(() => {
        const withoutAssignedRulesandGroups = getAvailableRulesAndGroupsWithoutAlreadyAssigned();
        setFilteredAvailableRulesAndGroupsList(withoutAssignedRulesandGroups);
        setAvailableRulesAndGroupsResources(getListOfResources(withoutAssignedRulesandGroups));
    }, [alreadyAssignedRulesandGroupUuidList, getAvailableRulesAndGroupsWithoutAlreadyAssigned]);

    //get filtered by resource type
    useEffect(() => {
        const filtered = getAvailableRulesAndGroupsWithoutAlreadyAssigned().filter((ruleOrGroup) =>
            selectedAvailableResourceType !== 'All' ? ruleOrGroup.resource === selectedAvailableResourceType : true,
        );
        setFilteredAvailableRulesAndGroupsList(filtered);
    }, [getAvailableRulesAndGroupsWithoutAlreadyAssigned, selectedAvailableResourceType]);

    const onRuleAssign = useCallback(
        (ruleOrGroup: TRuleGroupType) => {
            if (!id) return;
            if (ruleOrGroup?.attributes?.length && ruleOrGroup?.attributes?.length > 0) {
                setIsAddingRuleHasAttribute(true);
                setIsAssigningRule(ruleOrGroup);
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
                dispatch(actions.updateRule(rulePayload));
            }
        },
        [dispatch, id],
    );

    const onGroupAssign = useCallback(
        (ruleOrGroup: TRuleGroupType) => {
            if (!id) return;
            const groupPayload = {
                uuid: id,
                complianceProfileGroupsPatchRequestDto: {
                    removal: false,
                    groupUuid: ruleOrGroup.uuid,
                    connectorUuid: ruleOrGroup.connectorUuid!,
                    kind: ruleOrGroup.kind!,
                },
            };
            dispatch(actions.updateGroup(groupPayload));
        },
        [dispatch, id],
    );

    const deleteInternalRule = useCallback(
        (id: string) => {
            if (!id) return;
            dispatch(actions.deleteComplienceInternalRule({ internalRuleUuid: id }));
            setDeletingInternalRuleId(null);
        },
        [dispatch],
    );

    const tableHeadersAvailableRulesAndGroups = useMemo(() => {
        return getRulesAndGroupsTableHeaders('available');
    }, []);

    const tableDataAvailableRulesAndGroups = useMemo(
        () =>
            filteredAvailableRulesAndGroupsList.map((ruleOrGroup) => {
                return {
                    id: ruleOrGroup.uuid,
                    columns: [
                        getTypeTableColumn(ruleOrGroup, setSelectedEntityDetails, setIsEntityDetailMenuOpen),
                        ruleOrGroup.name,
                        getEnumLabel(resourceEnum, ruleOrGroup.resource),
                        <WidgetButtons
                            key={ruleOrGroup.uuid}
                            justify="start"
                            buttons={[
                                {
                                    icon: 'plus',
                                    disabled: false,
                                    tooltip: 'Add',
                                    onClick: () => {
                                        if (ruleOrGroup.entityDetails?.entityType === 'rule') {
                                            onRuleAssign(ruleOrGroup);
                                        }
                                        if (ruleOrGroup.entityDetails?.entityType === 'group') {
                                            onGroupAssign(ruleOrGroup);
                                        }
                                    },
                                },
                                ...(availableSelectedRulesSource === 'Internal'
                                    ? ([
                                          {
                                              icon: 'trash',
                                              disabled: false,
                                              tooltip: 'Delete',
                                              onClick: () => {
                                                  setDeletingInternalRuleId(ruleOrGroup.uuid);
                                              },
                                          },
                                          {
                                              icon: 'pencil',
                                              disabled: false,
                                              tooltip: 'Edit',
                                              onClick: () => {
                                                  setEditingInternalRule(ruleOrGroup);
                                              },
                                          },
                                      ] as WidgetButtonProps[])
                                    : ([] as WidgetButtonProps[])),
                            ]}
                        />,
                    ],
                };
            }),

        [
            filteredAvailableRulesAndGroupsList,
            resourceEnum,
            availableSelectedRulesSource,
            setSelectedEntityDetails,
            setIsEntityDetailMenuOpen,
            onRuleAssign,
            onGroupAssign,
        ],
    );

    const onSubmit = useCallback(
        (values: any) => {
            if (!isAssigningRule || !id) return;
            const attributes = collectFormAttributes(
                'rule-attributes',
                (isAssigningRule?.attributes ?? []) as AttributeDescriptorModel[],
                values,
            );
            const rulePayload = {
                uuid: id,
                complianceProfileRulesPatchRequestDto: {
                    removal: false,
                    ruleUuid: isAssigningRule.uuid,
                    connectorUuid: isAssigningRule?.connectorUuid ?? undefined,
                    kind: isAssigningRule?.kind ?? undefined,
                    attributes: attributes,
                },
            };
            dispatch(actions.updateRule(rulePayload));
            setIsAddingRuleHasAttribute(false);
            setIsAssigningRule(null);
        },
        [dispatch, id, isAssigningRule],
    );

    return (
        <div>
            <Widget
                title="Available Rules & Groups"
                titleSize="large"
                widgetLockName={LockWidgetNameEnum.ListOfAvailableRulesAndGroups}
                lockSize="large"
                dataTestId="available-rules-and-groups-widget"
            >
                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                    <Col style={{ width: '100%' }}>
                        <Label for="availableRulesSource">Rules Source</Label>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
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
                                    setSelectedAvailableProvider(null);
                                    setSelectedAvailableKind(null);
                                }}
                                isClearable
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        flex: 1,
                                        width: '100%',
                                    }),
                                }}
                            />

                            {availableSelectedRulesSource === 'Internal' && (
                                <Button
                                    data-testid="add-internal-rule-button"
                                    className="btn btn-link"
                                    color="white"
                                    onClick={() => setIsAddingInternalRule(true)}
                                >
                                    <i className="fa fa-plus" />
                                </Button>
                            )}
                        </div>
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
                                    setSelectedAvailableKind(null);
                                    setSelectedAvailableProvider(event?.value || null);
                                    handleClearInput();
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
                        canSearch={true}
                    />
                </Widget>
            </Widget>
            <Dialog
                isOpen={isAddingRuleHasAttribute}
                caption="Attributes"
                body={
                    <div data-testid="attribute-editor-dialog">
                        <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                            {({ handleSubmit, pristine, submitting, valid, form }) => (
                                <BootstrapForm onSubmit={handleSubmit}>
                                    <AttributeEditor
                                        id="rule-attributes"
                                        attributeDescriptors={(isAssigningRule?.attributes ?? []) as AttributeDescriptorModel[]}
                                    />
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
                                                    setIsAssigningRule(null);
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
                    </div>
                }
                toggle={() => setIsAddingRuleHasAttribute(false)}
                buttons={[]}
            />

            <Dialog
                size="xl"
                isOpen={isAddingInternalRule}
                caption="Create Internal Rule"
                body={<InternalRuleForm onCancel={() => setIsAddingInternalRule(false)} />}
                toggle={() => setIsAddingInternalRule(false)}
                buttons={[]}
            />
            <Dialog
                size="xl"
                isOpen={editingInternalRule !== null}
                caption="Edit Internal Rule"
                body={
                    <InternalRuleForm rule={editingInternalRule as ComplianceRuleListDto} onCancel={() => setEditingInternalRule(null)} />
                }
                toggle={() => setEditingInternalRule(null)}
                buttons={[]}
            />
            <Dialog
                isOpen={deletingInternalRuleId !== null}
                caption="Delete Internal Rule"
                body="You are about to delete a Internal Rule. Is this what you want to do?"
                toggle={() => setDeletingInternalRuleId(null)}
                buttons={[
                    { color: 'danger', onClick: () => deleteInternalRule(deletingInternalRuleId!), body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setDeletingInternalRuleId(null), body: 'Cancel' },
                ]}
            />
        </div>
    );
}
