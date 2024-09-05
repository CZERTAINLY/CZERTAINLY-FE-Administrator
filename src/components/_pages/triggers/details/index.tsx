import cx from 'classnames';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import FlowChart, { CustomNode } from 'components/FlowChart';
import TabLayout from 'components/Layout/TabLayout';
import SwitchWidget from 'components/SwitchWidget';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as alertActions } from 'ducks/alerts';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useTransformTriggerObjectToNodesAndEdges } from 'ducks/transform/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Edge } from 'reactflow';
import { Button, ButtonGroup, Col, Container, Input, Row } from 'reactstrap';
import { PlatformEnum, UpdateTriggerRequestDtoEventEnum } from 'types/openapi';
import { DeviceType, useDeviceType } from 'utils/common-hooks';
import styles from './triggerDetails.module.scss';

interface SelectChangeValue {
    value: string;
    label: string;
}
const TriggerDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const triggerDetails = useSelector(rulesSelectors.triggerDetails);
    const isUpdatingTrigger = useSelector(rulesSelectors.isUpdatingTrigger);
    const eventNameEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const isFetchingTriggerDetail = useSelector(rulesSelectors.isFetchingTriggerDetail);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const actions = useSelector(rulesSelectors.actionsList);
    const rules = useSelector(rulesSelectors.rules);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));
    const [highlight, setHighlight] = useState(false);
    const deviceType = useDeviceType();

    const [triggerNodes, setTriggerNodes] = useState<CustomNode[]>([]);
    const [triggerEdges, setTriggerEdges] = useState<Edge[]>([]);

    const defaultViewport = useMemo(
        () => ({
            zoom: 0.5,
            x: deviceType === DeviceType.Tablet ? -50 : deviceType === DeviceType.Mobile ? -150 : 300,
            y: 0,
        }),
        [deviceType],
    );
    const { nodes, edges } = useTransformTriggerObjectToNodesAndEdges(triggerDetails, rules, actions);

    // useEffect(() => {
    //     if (!triggerDetails) return;
    //     const { nodes, edges } = useTransformTriggerObjectToNodesAndEdges(triggerDetails);
    //     setTriggerNodes(nodes);
    //     setTriggerEdges(edges);
    // }, [triggerDetails]);

    useEffect(() => {
        if (!triggerDetails?.description || triggerDetails.uuid !== id) return;
        setUpdatedDescription(triggerDetails.description);
    }, [triggerDetails, id]);

    const triggerHighlight = useCallback(() => {
        setHighlight(true);
        const timer = setTimeout(() => {
            setHighlight(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getTrigger({ triggerUuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    useEffect(() => {
        dispatch(rulesActions.listActions({ resource: triggerDetails?.resource }));
        dispatch(rulesActions.listRules({ resource: triggerDetails?.resource }));
    }, [triggerDetails, dispatch]);

    const isBusy = useMemo(() => isUpdatingTrigger || isFetchingTriggerDetail, [isUpdatingTrigger, isFetchingTriggerDetail]);

    const actionsOptions = useMemo(() => {
        if (actions === undefined) return [];
        return actions
            .map((execution) => {
                return { value: execution.uuid, label: execution.name };
            })
            .filter((execution) => !triggerDetails?.actions?.map((action) => action.uuid).includes(execution.value));
    }, [actions, triggerDetails]);

    const rulesOptions = useMemo(() => {
        if (triggerDetails === undefined) return [];
        return rules
            .map((rule) => {
                return { value: rule.uuid, label: rule.name };
            })
            .filter((rule) => !triggerDetails?.rules.map((rule) => rule.uuid).includes(rule.value));
    }, [triggerDetails, rules]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteTrigger({ triggerUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !triggerDetails || !updateDescriptionEditEnable) return;

        if (updatedDescription !== triggerDetails.description) {
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        description: updatedDescription,
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        actionsUuids: triggerDetails?.actions.map((action) => action.uuid) || [],
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        eventResource: triggerDetails.eventResource,
                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, triggerDetails, updatedDescription, updateDescriptionEditEnable]);

    const onUpdateActionsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id || !triggerDetails) return;

            const newActionsUuids = newValues.map((newAction) => newAction.value);

            const previousAndNewActionsUuid = triggerDetails?.actions.map((action) => action.uuid);
            const allActionsUuids = [...(previousAndNewActionsUuid || []), ...newActionsUuids];
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        actionsUuids: allActionsUuids,
                        ignoreTrigger: false,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        eventResource: triggerDetails.eventResource,
                        description: triggerDetails.description || '',
                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                    },
                }),
            );
        },
        [dispatch, id, triggerDetails],
    );

    const onUpdateRulesConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id || !triggerDetails) return;

            const newRulesUuids = newValues.map((newRule) => newRule.value);

            const previousAndNewRulesUuid = triggerDetails?.rules.map((rule) => rule.uuid);
            const allRules = [...(previousAndNewRulesUuid || []), ...newRulesUuids];

            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        rulesUuids: allRules,
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        actionsUuids: triggerDetails?.actions.map((action) => action.uuid) || [],
                        eventResource: triggerDetails.eventResource,
                        description: triggerDetails.description || '',
                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                    },
                }),
            );
        },
        [dispatch, id, triggerDetails],
    );

    const onDeleteAction = useCallback(
        (actionUuid: string) => {
            if (!id || !triggerDetails) return;

            const updatedActionsUuid = triggerDetails?.actions.filter((action) => action.uuid !== actionUuid).map((action) => action.uuid);
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        description: triggerDetails?.description || '',
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        actionsUuids: updatedActionsUuid,
                        eventResource: triggerDetails.eventResource,
                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                    },
                }),
            );
        },
        [dispatch, id, triggerDetails],
    );

    const onDeleteRule = useCallback(
        (ruleUuid: string) => {
            if (!id || !triggerDetails) return;

            const updatedRules = triggerDetails?.rules.filter((rule) => rule.uuid !== ruleUuid).map((rule) => rule.uuid);

            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        rulesUuids: updatedRules,
                        description: triggerDetails.description || '',
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        actionsUuids: triggerDetails?.actions.map((action) => action.uuid) || [],
                        eventResource: triggerDetails.eventResource,
                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                    },
                }),
            );
        },
        [dispatch, id, triggerDetails],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'trash',
                disabled: false,
                onClick: () => setConfirmDelete(true),
            },
        ],
        [],
    );

    const triggerDetailHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
            {
                id: 'actions',
                content: 'Actions',
                align: 'center',
            },
        ],
        [],
    );

    const triggerDetailsData: TableDataRow[] = useMemo(
        () =>
            !triggerDetails || isFetchingTriggerDetail
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', triggerDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', triggerDetails.name, ''],
                      },
                      {
                          id: 'ignoreTrigger',
                          columns: [
                              'Ignore Trigger',
                              <SwitchWidget
                                  checked={triggerDetails.ignoreTrigger}
                                  onClick={() => {
                                      if (triggerDetails?.ignoreTrigger) {
                                          dispatch(alertActions.info('Please add actions from the actions table'));
                                          triggerHighlight();
                                      } else {
                                          dispatch(
                                              rulesActions.updateTrigger({
                                                  triggerUuid: triggerDetails.uuid,
                                                  trigger: {
                                                      ignoreTrigger: true,
                                                      description: triggerDetails.description || '',
                                                      rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                                                      resource: triggerDetails.resource,
                                                      type: triggerDetails.type,
                                                      actionsUuids: [],
                                                      eventResource: triggerDetails.eventResource,
                                                      event:
                                                          (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) ||
                                                          undefined,
                                                  },
                                              }),
                                          );
                                      }
                                  }}
                              />,
                              '',
                          ],
                      },
                      {
                          id: 'eventResource',
                          columns: [
                              'Event Resource',
                              triggerDetails?.eventResource ? getEnumLabel(resourceTypeEnum, triggerDetails.eventResource) : '',
                              '',
                          ],
                      },
                      {
                          id: 'triggerType',
                          columns: ['Trigger Type', getEnumLabel(triggerTypeEnum, triggerDetails.type), ''],
                      },
                      {
                          id: 'eventName',
                          columns: ['Event Name', getEnumLabel(eventNameEnum, triggerDetails.event || ''), ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, triggerDetails.resource), ''],
                      },
                      {
                          id: 'description',
                          columns: [
                              'Description',
                              updateDescriptionEditEnable ? (
                                  <Input
                                      value={updatedDescription}
                                      onChange={(e) => setUpdatedDescription(e.target.value)}
                                      placeholder="Enter Description"
                                  />
                              ) : (
                                  triggerDetails.description || ''
                              ),
                              <div>
                                  {updateDescriptionEditEnable ? (
                                      <ButtonGroup>
                                          <Button
                                              className="btn btn-link mx-auto"
                                              size="sm"
                                              color="secondary"
                                              title="Update Description"
                                              onClick={onUpdateDescriptionConfirmed}
                                              disabled={
                                                  isUpdatingTrigger ||
                                                  updatedDescription === triggerDetails.description ||
                                                  updatedDescription === ''
                                              }
                                          >
                                              <i className="fa fa-check" />
                                          </Button>
                                          <Button
                                              className="btn btn-link mx-auto danger"
                                              size="sm"
                                              title="Cancel"
                                              disabled={isUpdatingTrigger}
                                              onClick={() => {
                                                  setUpdateDescription(false);
                                                  setUpdatedDescription(triggerDetails?.description || '');
                                              }}
                                          >
                                              <i className="fa fa-close text-danger" />
                                          </Button>
                                      </ButtonGroup>
                                  ) : (
                                      <Button
                                          className="btn btn-link mx-auto"
                                          size="sm"
                                          color="secondary"
                                          title="Update Description"
                                          onClick={() => {
                                              setUpdateDescription(true);
                                          }}
                                      >
                                          <i className="fa fa-pencil-square-o" />
                                      </Button>
                                  )}
                              </div>,
                          ],
                      },
                  ],
        [
            triggerTypeEnum,
            triggerDetails,
            resourceTypeEnum,
            onUpdateDescriptionConfirmed,
            updateDescriptionEditEnable,
            isUpdatingTrigger,
            updatedDescription,
            eventNameEnum,
            dispatch,
            isFetchingTriggerDetail,
            triggerHighlight,
        ],
    );

    const actionsDataHeader = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
            },
            {
                id: 'description',
                content: 'Description',
            },
            {
                id: 'actions',
                content: 'Actions',
            },
        ],
        [],
    );

    const actionsData: TableDataRow[] = useMemo(() => {
        const isDeleteDisabled = triggerDetails?.actions?.length === 1 || isUpdatingTrigger || isFetchingTriggerDetail;

        const actionsData = !triggerDetails?.actions.length
            ? []
            : triggerDetails?.actions.map((action) => {
                  return {
                      id: action.uuid,
                      columns: [
                          <Link to={`../../actions/detail/${action.uuid}`}>{action.name}</Link> || '',
                          action.description || '',
                          <Button
                              className="btn btn-link text-danger"
                              size="sm"
                              color="danger"
                              title={
                                  isDeleteDisabled
                                      ? 'Cannot delete this action as there are no other actions in the trigger'
                                      : 'Delete Action'
                              }
                              onClick={() => {
                                  onDeleteAction(action.uuid);
                              }}
                              disabled={isDeleteDisabled}
                          >
                              <i className="fa fa-trash" />
                          </Button>,
                      ],
                  };
              });

        return actionsData;
    }, [triggerDetails, onDeleteAction, isUpdatingTrigger, isFetchingTriggerDetail]);

    const rulesHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
            },
            {
                id: 'description',
                content: 'Description',
            },
            {
                id: 'actions',
                content: 'Actions',
            },
        ],
        [],
    );

    const rulesData: TableDataRow[] = useMemo(
        () =>
            !triggerDetails?.rules.length
                ? []
                : triggerDetails?.rules.map((rule, i) => {
                      return {
                          id: rule.uuid,
                          columns: [
                              <Link to={`../../rules/detail/${rule.uuid}`}>{rule.name}</Link> || '',
                              rule.description || '',
                              <Button
                                  className="btn btn-link text-danger"
                                  size="sm"
                                  color="danger"
                                  title="Delete Rule"
                                  onClick={() => {
                                      onDeleteRule(rule.uuid);
                                  }}
                                  disabled={isUpdatingTrigger}
                              >
                                  <i className="fa fa-trash" />
                              </Button>,
                          ],
                      };
                  }),
        [triggerDetails, isUpdatingTrigger, onDeleteRule],
    );

    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'Trigger Details',
                        content: (
                            <Widget>
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Widget
                                            refreshAction={getFreshDetails}
                                            busy={isBusy}
                                            title="Trigger Details"
                                            titleSize="large"
                                            widgetButtons={buttons}
                                        >
                                            <CustomTable data={triggerDetailsData} headers={triggerDetailHeader} />
                                        </Widget>
                                    </Col>
                                    <Col>
                                        <Widget
                                            busy={isBusy}
                                            title="Actions"
                                            titleSize="large"
                                            widgetInfoCard={{
                                                title: 'Information',
                                                description: 'Actions is named set of actions for selected trigger',
                                            }}
                                            className={cx({ [styles.highLightWidget]: highlight === true })}
                                        >
                                            <CustomTable
                                                data={actionsData}
                                                headers={actionsDataHeader}
                                                newRowWidgetProps={{
                                                    isBusy: isUpdatingTrigger,
                                                    newItemsList: actionsOptions,
                                                    onAddClick: onUpdateActionsConfirmed,
                                                }}
                                            />
                                        </Widget>
                                    </Col>
                                </Row>
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Widget busy={isBusy} title="Rules" titleSize="large">
                                            <CustomTable
                                                data={rulesData}
                                                headers={rulesHeader}
                                                newRowWidgetProps={{
                                                    isBusy: isUpdatingTrigger,
                                                    newItemsList: rulesOptions,
                                                    onAddClick: onUpdateRulesConfirmed,
                                                }}
                                            />
                                        </Widget>
                                    </Col>
                                </Row>
                            </Widget>
                        ),
                    },
                    {
                        title: 'Flow',
                        content: (
                            <FlowChart
                                busy={isBusy}
                                flowChartTitle="Trigger Flow"
                                flowChartEdges={edges}
                                flowChartNodes={nodes}
                                defaultViewport={defaultViewport}
                                flowDirection="STAR"
                                legends={[
                                    {
                                        color: '#afbbdb',
                                        icon: 'fa fa-rocket',
                                        label: 'Trigger',
                                    },
                                    {
                                        color: '#1ab394e1',
                                        icon: 'fa fa-bolt',
                                        label: 'Action',
                                    },

                                    {
                                        color: '#7fa2c1',
                                        icon: 'fa fa-book',
                                        label: 'Rule',
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Trigger`}
                body={`You are about to delete a Trigger. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default TriggerDetails;
