import ConditionsViewer from 'components/ConditionsViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container, Input, Row } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
interface SelectChangeValue {
    value: string;
    label: string;
}
const RuleDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const actionDetails = useSelector(rulesSelectors.actionDetails);
    const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);
    const isFetchingRuleDetail = useSelector(rulesSelectors.isFetchingRuleDetail);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditionGroups = useSelector(rulesSelectors.conditions);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');

    useEffect(() => {
        if (!actionDetails?.description || actionDetails.uuid !== id) return;
        setUpdatedDescription(actionDetails.description);
    }, [actionDetails, id]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getAction({ actionUuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    useEffect(() => {
        dispatch(rulesActions.listConditions({ resource: actionDetails?.resource }));
    }, [actionDetails, dispatch]);

    const isBusy = useMemo(() => isFetchingRuleDetail || isUpdatingRule, [isFetchingRuleDetail, isUpdatingRule]);

    const executionsOptions = useMemo(() => {
        if (conditionGroups === undefined) return [];
        return conditionGroups
            .map((conditions) => {
                return { value: conditions.uuid, label: conditions.name };
            })
            .filter((conditions) => !actionDetails?.executions?.map((condition) => condition.uuid).includes(conditions.value));
    }, [conditionGroups, actionDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteRule({ ruleUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== actionDetails?.description) {
            // dispatch(
            //     rulesActions.updateRule({
            //         ruleUuid: id,
            //         rule: {
            //             description: updatedDescription,
            //             // conditionsUuids: actionDetails?.conditions
            //             conditionUuids: actionDetails?.conditionGroups?.length
            //                 ? actionDetails?.conditionGroups.map((conditionGroup) => conditionGroup.uuid)
            //                 : [],
            //         },
            //     }),
            // );
        }
        setUpdateDescription(false);
    }, [dispatch, id, actionDetails, updatedDescription, updateDescriptionEditEnable]);

    const onUpdateConditionGroupsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id) return;

            const newConditionGroupsUuids = newValues.map((conditionGroup) => conditionGroup.value);

            const previousAndNewConditionGroupsUuid = actionDetails?.executions.map((execution) => execution.uuid);
            const allConditionGroups = [...(previousAndNewConditionGroupsUuid || []), ...newConditionGroupsUuids];

            // dispatch(
            //     rulesActions.updateRule({
            //         ruleUuid: id,
            //         rule: {
            //             description: actionDetails?.description || '',
            //             conditions: actionDetails?.conditions || [],
            //             conditionGroupsUuids: allConditionGroups,
            //         },
            //     }),
            // );
        },
        [dispatch, id, actionDetails],
    );

    const onDeleteConditionGroup = useCallback(
        (conditionGroupUuid: string) => {
            if (!id) return;

            // const updatedConditionGroupsUuid = actionDetails?.conditionGroups
            //     .filter((conditionGroup) => conditionGroup.uuid !== conditionGroupUuid)
            //     .map((conditionGroup) => conditionGroup.uuid);
            // dispatch(
            //     rulesActions.updateRule({
            //         ruleUuid: id,
            //         rule: {
            //             conditions: actionDetails?.conditions || [],
            //             description: actionDetails?.description || '',
            //             conditionGroupsUuids: updatedConditionGroupsUuid,
            //         },
            //     }),
            // );
        },
        [
            dispatch,
            id,

            // actionDetails?.conditionGroups,

            actionDetails?.executions,
            actionDetails?.description,
        ],
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

    const tableHeader: TableHeader[] = useMemo(
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

    const conditionGroupsDetailData: TableDataRow[] = useMemo(
        () =>
            !actionDetails || isFetchingRuleDetail
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', actionDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', actionDetails.name, ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, actionDetails.resource), ''],
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
                                  actionDetails.description || ''
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
                                                  isUpdatingRule ||
                                                  updatedDescription === actionDetails.description ||
                                                  updatedDescription === ''
                                              }
                                          >
                                              <i className="fa fa-check" />
                                          </Button>
                                          <Button
                                              className="btn btn-link mx-auto danger"
                                              size="sm"
                                              title="Cancel"
                                              disabled={isUpdatingRule}
                                              onClick={() => {
                                                  setUpdateDescription(false);
                                                  setUpdatedDescription(actionDetails?.description || '');
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
            actionDetails,
            resourceTypeEnum,
            onUpdateDescriptionConfirmed,
            updateDescriptionEditEnable,
            isUpdatingRule,
            updatedDescription,
            isFetchingRuleDetail,
        ],
    );

    // const conditionGroupFieldsDataHeader = useMemo(
    //     () => [
    //         {
    //             id: 'name',
    //             content: 'Name',
    //         },
    //         {
    //             id: 'description',
    //             content: 'Description',
    //         },
    //         {
    //             id: 'actions',
    //             content: 'Actions',
    //         },
    //     ],
    //     [],
    // );

    // const conditionGroupFieldsData: TableDataRow[] = useMemo(() => {
    //     const isDeleteDisabled = actionDetails?.conditions.length === 0 || isFetchingRuleDetail || isUpdatingRule;
    //     const conditionGroupData = !actionDetails?.conditionGroups.length
    //         ? []
    //         : actionDetails?.conditionGroups.map((conditionGroup) => {
    //               return {
    //                   id: conditionGroup.uuid,
    //                   columns: [
    //                       <Link to={`../../conditiongroups/detail/${conditionGroup.uuid}`}>{conditionGroup.name}</Link> || '',
    //                       conditionGroup.description || '',
    //                       <Button
    //                           className="btn btn-link text-danger"
    //                           size="sm"
    //                           color="danger"
    //                           title={
    //                               isDeleteDisabled
    //                                   ? 'Cannot delete this condition group as there are no other conditions in the rule'
    //                                   : 'Delete Condition Group'
    //                           }
    //                           onClick={() => {
    //                               onDeleteConditionGroup(conditionGroup.uuid);
    //                           }}
    //                           disabled={isDeleteDisabled}
    //                       >
    //                           <i className="fa fa-trash" />
    //                       </Button>,
    //                   ],
    //               };
    //           });

    //     return conditionGroupData;
    // }, [actionDetails, isUpdatingRule, onDeleteConditionGroup, isFetchingRuleDetail]);

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget refreshAction={getFreshDetails} busy={isBusy} title="Action Details" titleSize="large" widgetButtons={buttons}>
                        <CustomTable data={conditionGroupsDetailData} headers={tableHeader} />
                    </Widget>
                </Col>
                {/* <Col>
                    <Widget
                        busy={isBusy}
                        title="Condition Groups"
                        titleSize="large"
                        widgetInfoCard={{
                            title: 'Information',
                            description:
                                'Condition is named set of conditions for selected resource that can be reused in rules of same resource',
                        }}
                    >
                        <CustomTable
                            data={conditionGroupFieldsData}
                            headers={conditionGroupFieldsDataHeader}
                            newRowWidgetProps={{
                                isBusy: isUpdatingRule,
                                newItemsList: executionsOptions,
                                onAddClick: onUpdateConditionGroupsConfirmed,
                            }}
                        />
                    </Widget>
                </Col> */}
            </Row>

            <Row>{actionDetails?.resource && <ConditionsViewer resource={actionDetails.resource} formType="rules" />}</Row>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Rule`}
                body={`You are about to delete a Rule. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default RuleDetails;
