import cx from 'classnames';
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

    const isFetchingTriggerDetail = useSelector(rulesSelectors.isFetchingTriggerDetail);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const actionGroups = useSelector(rulesSelectors.actionGroups);
    const rules = useSelector(rulesSelectors.rules);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState<string>(triggerDetails?.description || '');
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RuleTriggerType));

    useEffect(() => {
        if (!triggerDetails?.description) return;
        setUpdatedDescription(triggerDetails.description);
    }, [triggerDetails?.description]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getTrigger({ triggerUuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    useEffect(() => {
        dispatch(rulesActions.listActionGroups({ resource: triggerDetails?.resource }));
        dispatch(rulesActions.listRules({ resource: triggerDetails?.resource }));
    }, [triggerDetails, dispatch]);

    const isBusy = useMemo(() => isFetchingTriggerDetail || isUpdatingTrigger, [isFetchingTriggerDetail, isUpdatingTrigger]);

    const actionGroupOptions = useMemo(() => {
        if (actionGroups === undefined) return [];
        return actionGroups
            .map((actionGroup) => {
                return { value: actionGroup.uuid, label: actionGroup.name };
            })
            .filter((actionGroup) => !triggerDetails?.actionGroups?.map((actionGroup) => actionGroup.uuid).includes(actionGroup.value));
    }, [actionGroups, triggerDetails]);

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
                        actions: triggerDetails?.actions || [],
                        actionGroupsUuids: triggerDetails?.actionGroups?.length
                            ? triggerDetails?.actionGroups.map((actionGroup) => actionGroup.uuid)
                            : [],
                        triggerType: triggerDetails.triggerType,
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, triggerDetails, updatedDescription]);

    const onUpdateActionGroupsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id || !triggerDetails) return;

            const newActionGroupsUuids = newValues.map((newActionGroup) => newActionGroup.value);

            const previousAndNewActionGroupsUuid = triggerDetails?.actionGroups.map((actionGroup) => actionGroup.uuid);
            const allActionGroups = [...(previousAndNewActionGroupsUuid || []), ...newActionGroupsUuids];

            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        actions: triggerDetails?.actions || [],
                        actionGroupsUuids: allActionGroups,
                        triggerType: triggerDetails.triggerType,
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
                        actions: triggerDetails?.actions || [],
                        rulesUuids: allRules,
                        actionGroupsUuids: triggerDetails?.actionGroups?.map((actionGroup) => actionGroup.uuid) || [],
                        triggerType: triggerDetails.triggerType,
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

            const updatedActionGroupsUuid = triggerDetails?.actionGroups
                .filter((actionGroup) => actionGroup.uuid !== actionGroupsUuid)
                .map((actionGroup) => actionGroup.uuid);
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        actions: triggerDetails?.actions || [],
                        description: triggerDetails?.description || '',
                        actionGroupsUuids: updatedActionGroupsUuid,
                        triggerType: triggerDetails.triggerType,
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
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
                        actions: triggerDetails?.actions || [],
                        rulesUuids: updatedRules,
                        actionGroupsUuids: triggerDetails?.actionGroups?.map((actionGroup) => actionGroup.uuid) || [],
                        triggerType: triggerDetails.triggerType,
                        description: triggerDetails.description || '',
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

    const actionGroupsButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'info',
                disabled: false,
                onClick: () => {},
                custom: (
                    <i className={cx('fa fa-info', styles.infoIcon)} title="Action group is named set of actions for selected trigger" />
                ),
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
            },
        ],
        [],
    );

    const triggerDetailsData: TableDataRow[] = useMemo(
        () =>
            !triggerDetails
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
                          columns: ['Trigger Resource', triggerDetails.triggerResource || ''],
                      },
                      {
                          id: 'triggerType',
                          columns: ['Trigger Type', getEnumLabel(triggerTypeEnum, triggerDetails.triggerType), ''],
                      },
                      {
                          id: 'eventName',
                          columns: ['Event Name', triggerDetails.eventName || '', ''],
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
                                              disabled={isUpdatingTrigger}
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
                                                  setUpdatedDescription(triggerDetails.description || '');
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
            triggerDetails,
            resourceTypeEnum,
            onUpdateDescriptionConfirmed,
            updateDescriptionEditEnable,
            isUpdatingTrigger,
            updatedDescription,
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

    const actionGroupsFieldsData: TableDataRow[] = useMemo(
        () =>
            !triggerDetails?.actionGroups.length
                ? []
                : triggerDetails?.actionGroups.map((actionGroup) => {
                      return {
                          id: actionGroup.uuid,
                          columns: [
                              <Link to={`../../actiongroups/detail/${actionGroup.uuid}`}>{actionGroup.name}</Link> || '',
                              actionGroup.description || '',
                              <Button
                                  className="btn btn-link text-danger"
                                  size="sm"
                                  color="danger"
                                  title="Delete Action Group"
                                  onClick={() => {
                                      onDeleteActionGroup(actionGroup.uuid);
                                  }}
                                  disabled={isUpdatingTrigger}
                              >
                                  <i className="fa fa-trash" />
                              </Button>,
                          ],
                      };
                  }),
        [triggerDetails, isUpdatingTrigger, onDeleteActionGroup],
    );

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
                    <Widget widgetButtons={actionGroupsButtons} busy={isBusy} title="Action Groups" titleSize="large">
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
