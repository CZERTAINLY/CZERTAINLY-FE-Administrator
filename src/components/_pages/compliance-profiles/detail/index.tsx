import ComplianceRuleAttributeViewer from 'components/Attributes/ComplianceRuleAttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';

import Widget from 'components/Widget';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/compliance-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';

import { Badge, Button, Col, Container, Label, Row } from 'reactstrap';
import {
    ComplianceProfileGroupListResponseGroupModel,
    ComplianceProfileResponseGroupGroupModel,
    ComplianceProfileResponseRuleRuleModel,
    ComplianceProfileRuleListResponseRuleModel,
} from 'types/complianceProfiles';
import { LockWidgetNameEnum } from 'types/user-interface';
import { Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import AddRuleWithAttributesDialogBody from '../form/AddRuleWithAttributesDialogBody/index.';
import AssociateRaProfileDialogBody from '../form/AssociateRaProfileDialogBody/AssociateRaProfileDialogBody';

export default function ComplianceProfileDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const profile = useSelector(selectors.complianceProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isFetchingGroups = useSelector(selectors.isFetchingGroups);
    const isFetchingRules = useSelector(selectors.isFetchingRules);
    const rules = useSelector(selectors.rules);

    const groups = useSelector(selectors.groups);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const [addRaProfile, setAddRaProfile] = useState<boolean>(false);
    const [addRuleWithAttributes, setAddRuleWithAttributes] = useState<boolean>(false);
    const [addAttributeRuleDetails, setAddAttributeRuleDetails] = useState<any>();

    const [alreadyAssociatedRuleUuids, setAlreadyAssociatedRuleUuids] = useState<string[]>([]);
    const [alreadyAssociatedGroupUuids, setAlreadyAssociatedGroupUuids] = useState<string[]>([]);

    const [complianceCheck, setComplianceCheck] = useState<boolean>(false);

    const [groupRuleMapping, setGroupRuleMapping] = useState<{ [key: string]: ComplianceProfileRuleListResponseRuleModel[] }>();

    const [currentGroupUuidForDisplay, setCurrentGroupUuidForDisplay] = useState<string>();

    const [selectionFilter, setSelectionFilter] = useState<string>('Selected');
    const [objectFilter, setObjectFilter] = useState<string>('Groups & Rules');

    const getFreshComplianceProfileDetails = useCallback(() => {
        if (!id) return;

        dispatch(actions.resetState());
        dispatch(actions.getComplianceProfile({ uuid: id }));
        dispatch(actions.listComplianceRules());
        dispatch(actions.listComplianceGroups());
    }, [id, dispatch]);

    const getComplianceRulesAndGroups = useCallback(() => {
        dispatch(actions.listComplianceRules());
        dispatch(actions.listComplianceGroups());
    }, [dispatch]);

    useEffect(() => {
        getFreshComplianceProfileDetails();
    }, [id, getFreshComplianceProfileDetails]);

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

    const onDeleteConfirmed = useCallback(() => {
        if (!profile) return;

        dispatch(actions.deleteComplianceProfile({ uuid: profile.uuid }));

        setConfirmDelete(false);
    }, [profile, dispatch]);

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

    const onDissociateRaProfile = useCallback(
        (raProfileUuid: string) => {
            if (!profile) return;

            dispatch(actions.dissociateRaProfile({ uuid: profile.uuid, raProfileUuids: [raProfileUuid] }));
        },
        [profile, dispatch],
    );

    const onComplianceCheck = useCallback(() => {
        setComplianceCheck(false);

        if (!profile?.uuid) return;

        dispatch(actions.checkCompliance({ uuids: [profile.uuid] }));
    }, [dispatch, profile]);

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

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

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

    const raProfileHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'raProfileName',
                content: 'Name',
            },
            {
                id: 'status',
                content: 'Status',
            },
            {
                id: 'action',
                content: 'Action',
            },
        ],
        [],
    );

    const raProfileData: TableDataRow[] = useMemo(
        () =>
            !profile || !profile.raProfiles
                ? []
                : profile.raProfiles.map((raProfile) => ({
                      id: raProfile.uuid,
                      columns: [
                          <Link to={`../../raprofiles/detail/${raProfile.authorityInstanceUuid}/${raProfile!.uuid}`}>
                              {raProfile!.name}
                          </Link>,

                          <StatusBadge enabled={raProfile.enabled} />,

                          <WidgetButtons
                              buttons={[
                                  {
                                      icon: 'minus-square',
                                      disabled: false,
                                      tooltip: 'Remove',
                                      onClick: () => {
                                          onDissociateRaProfile(raProfile.uuid);
                                      },
                                  },
                              ]}
                          />,
                      ],
                  })),
        [profile, onDissociateRaProfile],
    );

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

    const optionFilterData = ['Groups & Rules', 'Rules', 'Groups'].map((input) => ({ label: input, value: input })) || [];

    return (
        <Container className="themed-container" fluid>
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
                        title="Associated RA Profiles"
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

            <Widget
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
            </Widget>

            <Dialog
                isOpen={currentGroupUuidForDisplay !== undefined}
                caption="Rules"
                size="lg"
                body={<CustomTable headers={ruleHeader} data={ruleData} hasPagination={true} hasDetails={true} />}
                toggle={onCloseGroupRuleDetail}
                buttons={[{ color: 'secondary', onClick: () => onCloseGroupRuleDetail(), body: 'Cancel' }]}
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
                isOpen={addRaProfile}
                caption="Associate RA Profile"
                body={AssociateRaProfileDialogBody({
                    visible: addRaProfile,
                    onClose: () => setAddRaProfile(false),
                    complianceProfileUuid: profile?.uuid,
                    availableRaProfileUuids: profile?.raProfiles?.map((e) => e.uuid),
                })}
                toggle={() => setAddRaProfile(false)}
                buttons={[]}
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
        </Container>
    );
}
