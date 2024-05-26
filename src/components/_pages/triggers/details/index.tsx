import ConditionsViewer from 'components/ConditionsViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container, Input, Row } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
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
    const executions = useSelector(rulesSelectors.executions);
    const rules = useSelector(rulesSelectors.rules);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));

    useEffect(() => {
        if (!triggerDetails?.description || triggerDetails.uuid !== id) return;
        setUpdatedDescription(triggerDetails.description);
    }, [triggerDetails, id]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getTrigger({ triggerUuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    useEffect(() => {
        dispatch(rulesActions.listExecutions({ resource: triggerDetails?.resource }));
        dispatch(rulesActions.listRules({ resource: triggerDetails?.resource }));
    }, [triggerDetails, dispatch]);

    const isBusy = useMemo(() => isFetchingTriggerDetail || isUpdatingTrigger, [isFetchingTriggerDetail, isUpdatingTrigger]);

    const actionGroupOptions = useMemo(() => {
        if (executions === undefined) return [];
        return executions
            .map((execution) => {
                return { value: execution.uuid, label: execution.name };
            })
            .filter((execution) => !triggerDetails?.actions?.map((action) => action.uuid).includes(execution.value));
    }, [executions, triggerDetails]);

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
                        // actions: triggerDetails?.actions || [],
                        // actionGroupsUuids: triggerDetails?.actionGroups?.length
                        //     ? triggerDetails?.actionGroups.map((actionGroup) => actionGroup.uuid)
                        //     : [],
                        // triggerType: triggerDetails.triggerType,
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        actionsUuids: triggerDetails?.actions.map((action) => action.uuid) || [],
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        // event: triggerDetails.event,
                        // eventResource: triggerDetails.eventResource,
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, triggerDetails, updatedDescription, updateDescriptionEditEnable]);

    const onUpdateActionGroupsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id || !triggerDetails) return;

            const newActionGroupsUuids = newValues.map((newActionGroup) => newActionGroup.value);

            const previousAndNewActionGroupsUuid = triggerDetails?.actions.map((action) => action.uuid);
            const allActionGroups = [...(previousAndNewActionGroupsUuid || []), ...newActionGroupsUuids];
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        actionsUuids: allActionGroups,
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        description: triggerDetails.description || '',
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
                        // actionsUuids: triggerDetails?.actionsUuids || [],
                        rulesUuids: allRules,
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,

                        // actionGroupsUuids: triggerDetails?.actionGroups?.map((actionGroup) => actionGroup.uuid) || [],
                        // triggerType: triggerDetails.triggerType,
                        description: triggerDetails.description || '',
                    },
                }),
            );
        },
        [dispatch, id, triggerDetails],
    );

    const onDeleteActionGroup = useCallback(
        (actionGroupsUuid: string) => {
            if (!id || !triggerDetails) return;

            const updatedActionGroupsUuid = triggerDetails?.actions
                .filter((actionGroup) => actionGroup.uuid !== actionGroupsUuid)
                .map((actionGroup) => actionGroup.uuid);
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        // actions: triggerDetails?.actions || [],
                        description: triggerDetails?.description || '',
                        // actionUuids: updatedActionGroupsUuid,
                        // triggerType: triggerDetails.triggerType,
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        actionsUuids: updatedActionGroupsUuid,
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
                        // actions: triggerDetails?.actions || [],
                        rulesUuids: updatedRules,
                        // actionGroupsUuids: triggerDetails?.actionGroups?.map((actionGroup) => actionGroup.uuid) || [],
                        // triggerType: triggerDetails.triggerType,
                        description: triggerDetails.description || '',
                        ignoreTrigger: triggerDetails.ignoreTrigger,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
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
                          id: 'triggerResource',
                          columns: [
                              'Trigger Resource',
                              triggerDetails?.eventResource ? getEnumLabel(resourceTypeEnum, triggerDetails.eventResource) : '',
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
            isFetchingTriggerDetail,
        ],
    );

    const actionGroupFieldsDataHeader = useMemo(
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

    const actionGroupsFieldsData: TableDataRow[] = useMemo(() => {
        const isDeleteDisabled = triggerDetails?.actions?.length === 0 || isUpdatingTrigger || isFetchingTriggerDetail;

        const actionGroupData = !triggerDetails?.actions.length
            ? []
            : triggerDetails?.actions.map((action) => {
                  return {
                      id: action.uuid,
                      columns: [
                          <Link to={`../../actiongroups/detail/${action.uuid}`}>{action.name}</Link> || '',
                          action.description || '',
                          <Button
                              className="btn btn-link text-danger"
                              size="sm"
                              color="danger"
                              title={
                                  isDeleteDisabled
                                      ? 'Cannot delete this action group as there are no other actions in the trigger'
                                      : 'Delete Action Group'
                              }
                              onClick={() => {
                                  onDeleteActionGroup(action.uuid);
                              }}
                              disabled={isDeleteDisabled}
                          >
                              <i className="fa fa-trash" />
                          </Button>,
                      ],
                  };
              });

        return actionGroupData;
    }, [triggerDetails, onDeleteActionGroup, isUpdatingTrigger, isFetchingTriggerDetail]);

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
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget refreshAction={getFreshDetails} busy={isBusy} title="Trigger Details" titleSize="large" widgetButtons={buttons}>
                        <CustomTable data={triggerDetailsData} headers={triggerDetailHeader} />
                    </Widget>
                </Col>
                <Col>
                    <Widget
                        busy={isBusy}
                        title="Action Groups"
                        titleSize="large"
                        widgetInfoCard={{
                            title: 'Information',
                            description: 'Action group is named set of actions for selected trigger',
                        }}
                    >
                        <CustomTable
                            data={actionGroupsFieldsData}
                            headers={actionGroupFieldsDataHeader}
                            newRowWidgetProps={{
                                isBusy: isUpdatingTrigger,
                                newItemsList: actionGroupOptions,
                                onAddClick: onUpdateActionGroupsConfirmed,
                            }}
                        />
                    </Widget>
                </Col>
            </Row>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget refreshAction={getFreshDetails} busy={isBusy} title="Rules" titleSize="large">
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

            <Row>{triggerDetails?.resource && <ConditionsViewer resource={triggerDetails.resource} formType="trigger" />}</Row>

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
