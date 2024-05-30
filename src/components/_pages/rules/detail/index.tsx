import { ApiClients } from 'api';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import ConditionsExecutionsList from 'components/ExecutionConditionItemsList';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container, Input, Row } from 'reactstrap';
import { PlatformEnum, Resource } from 'types/openapi';
interface SelectChangeValue {
    value: string;
    label: string;
}
const RuleDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);
    const isFetchingRuleDetails = useSelector(rulesSelectors.isFetchingRuleDetails);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditions = useSelector(rulesSelectors.conditions);
    const conditionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ConditionType));

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');

    useEffect(() => {
        if (!ruleDetails?.description || ruleDetails.uuid !== id) return;
        setUpdatedDescription(ruleDetails.description);
    }, [ruleDetails, id]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getRule({ ruleUuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    useEffect(() => {
        dispatch(rulesActions.listConditions({ resource: ruleDetails?.resource }));
    }, [ruleDetails, dispatch]);

    const isBusy = useMemo(() => isFetchingRuleDetails || isUpdatingRule, [isFetchingRuleDetails, isUpdatingRule]);

    const conditionsOptions = useMemo(() => {
        if (conditions === undefined) return [];
        return conditions
            .map((conditions) => {
                return { value: conditions.uuid, label: conditions.name };
            })
            .filter((conditions) => !ruleDetails?.conditions?.map((condition) => condition.uuid).includes(conditions.value));
    }, [conditions, ruleDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteRule({ ruleUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== ruleDetails?.description) {
            dispatch(
                rulesActions.updateRule({
                    ruleUuid: id,
                    rule: {
                        description: updatedDescription,
                        conditionsUuids: ruleDetails?.conditions?.length ? ruleDetails?.conditions.map((condition) => condition.uuid) : [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, ruleDetails, updatedDescription, updateDescriptionEditEnable]);

    const onUpdateConditionsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id) return;

            const newConditionsUuids = newValues.map((condition) => condition.value);

            const previousAndNewConditionsUuid = ruleDetails?.conditions.map((condition) => condition.uuid);
            const allConditions = [...(previousAndNewConditionsUuid || []), ...newConditionsUuids];

            dispatch(
                rulesActions.updateRule({
                    ruleUuid: id,
                    rule: {
                        description: ruleDetails?.description || '',
                        conditionsUuids: allConditions,
                    },
                }),
            );
        },
        [dispatch, id, ruleDetails],
    );

    const onDeleteCondition = useCallback(
        (conditionUuid: string) => {
            if (!id) return;

            const updatedConditionsUuids = ruleDetails?.conditions
                .filter((condition) => condition.uuid !== conditionUuid)
                .map((condition) => condition.uuid);
            dispatch(
                rulesActions.updateRule({
                    ruleUuid: id,
                    rule: {
                        description: ruleDetails?.description || '',
                        conditionsUuids: updatedConditionsUuids?.length ? updatedConditionsUuids : [],
                    },
                }),
            );
        },
        [dispatch, id, ruleDetails?.conditions, ruleDetails?.description],
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

    const ruleTableHeaders: TableHeader[] = useMemo(
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

    const ruleDetailsData: TableDataRow[] = useMemo(
        () =>
            !ruleDetails || isFetchingRuleDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', ruleDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', ruleDetails.name, ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, ruleDetails.resource), ''],
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
                                  ruleDetails.description || ''
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
                                                  updatedDescription === ruleDetails.description ||
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
                                                  setUpdatedDescription(ruleDetails?.description || '');
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
            ruleDetails,
            resourceTypeEnum,
            onUpdateDescriptionConfirmed,
            updateDescriptionEditEnable,
            isUpdatingRule,
            updatedDescription,
            isFetchingRuleDetails,
        ],
    );

    const conditionsTableHeader = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
            },
            {
                id: 'type',
                content: 'Type',
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

    const conditionsData: TableDataRow[] = useMemo(() => {
        const isDeleteDisabled = ruleDetails?.conditions.length === 1 || isFetchingRuleDetails || isUpdatingRule;
        const conditionsData = !ruleDetails?.conditions.length
            ? []
            : ruleDetails?.conditions.map((condition) => {
                  return {
                      id: condition.uuid,
                      columns: [
                          <Link to={`../../conditions/detail/${condition.uuid}`}>{condition.name}</Link> || '',
                          getEnumLabel(conditionTypeEnum, condition.type),
                          condition.description || '',
                          <Button
                              className="btn btn-link text-danger"
                              size="sm"
                              color="danger"
                              title={
                                  isDeleteDisabled
                                      ? 'Cannot delete this condition as there are no other conditions in the rule'
                                      : 'Delete Condition'
                              }
                              onClick={() => {
                                  onDeleteCondition(condition.uuid);
                              }}
                              disabled={isDeleteDisabled}
                          >
                              <i className="fa fa-trash" />
                          </Button>,
                      ],
                  };
              });

        return conditionsData;
    }, [ruleDetails, isUpdatingRule, onDeleteCondition, isFetchingRuleDetails, conditionTypeEnum]);

    const renderRuleConditions = useMemo(() => {
        return ruleDetails?.conditions.length ? (
            <ConditionsExecutionsList
                listType="conditionsItems"
                ruleConditions={ruleDetails?.conditions}
                getAvailableFiltersApi={(apiClients: ApiClients) =>
                    apiClients.resources.listResourceRuleFilterFields({
                        resource: ruleDetails?.resource || Resource.None,
                    })
                }
            />
        ) : (
            <></>
        );
    }, [ruleDetails]);

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget refreshAction={getFreshDetails} busy={isBusy} title="Rule Details" titleSize="large" widgetButtons={buttons}>
                        <CustomTable data={ruleDetailsData} headers={ruleTableHeaders} />
                    </Widget>
                </Col>
                <Col>
                    <Widget
                        busy={isBusy}
                        title="Conditions"
                        titleSize="large"
                        widgetInfoCard={{
                            title: 'Information',
                            description: 'Conditions is named set of conditions items',
                        }}
                    >
                        <CustomTable
                            data={conditionsData}
                            headers={conditionsTableHeader}
                            newRowWidgetProps={{
                                isBusy: isUpdatingRule,
                                newItemsList: conditionsOptions,
                                onAddClick: onUpdateConditionsConfirmed,
                            }}
                        />
                    </Widget>
                </Col>
            </Row>
            {renderRuleConditions}
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
