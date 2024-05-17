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
const RuleDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);
    const isFetchingRuleDetail = useSelector(rulesSelectors.isFetchingRuleDetail);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditionGroups = useSelector(rulesSelectors.conditionRuleGroups);

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
        dispatch(rulesActions.listConditionGroups({ resource: ruleDetails?.resource }));
    }, [ruleDetails, dispatch]);

    const isBusy = useMemo(() => isFetchingRuleDetail || isUpdatingRule, [isFetchingRuleDetail, isUpdatingRule]);

    const conditionGroupsOptions = useMemo(() => {
        if (conditionGroups === undefined) return [];
        return conditionGroups
            .map((conditionGroup) => {
                return { value: conditionGroup.uuid, label: conditionGroup.name };
            })
            .filter(
                (conditionGroup) =>
                    !ruleDetails?.conditionGroups?.map((conditionGroup) => conditionGroup.uuid).includes(conditionGroup.value),
            );
    }, [conditionGroups, ruleDetails]);

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
                        conditions: ruleDetails?.conditions || [],
                        conditionGroupsUuids: ruleDetails?.conditionGroups?.length
                            ? ruleDetails?.conditionGroups.map((conditionGroup) => conditionGroup.uuid)
                            : [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, ruleDetails, updatedDescription, updateDescriptionEditEnable]);

    const onUpdateConditionGroupsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id) return;

            const newConditionGroupsUuids = newValues.map((conditionGroup) => conditionGroup.value);

            const previousAndNewConditionGroupsUuid = ruleDetails?.conditionGroups.map((conditionGroup) => conditionGroup.uuid);
            const allConditionGroups = [...(previousAndNewConditionGroupsUuid || []), ...newConditionGroupsUuids];

            dispatch(
                rulesActions.updateRule({
                    ruleUuid: id,
                    rule: {
                        description: ruleDetails?.description || '',
                        conditions: ruleDetails?.conditions || [],
                        conditionGroupsUuids: allConditionGroups,
                    },
                }),
            );
        },
        [dispatch, id, ruleDetails],
    );

    const onDeleteConditionGroup = useCallback(
        (conditionGroupUuid: string) => {
            if (!id) return;

            const updatedConditionGroupsUuid = ruleDetails?.conditionGroups
                .filter((conditionGroup) => conditionGroup.uuid !== conditionGroupUuid)
                .map((conditionGroup) => conditionGroup.uuid);
            dispatch(
                rulesActions.updateRule({
                    ruleUuid: id,
                    rule: {
                        conditions: ruleDetails?.conditions || [],
                        description: ruleDetails?.description || '',
                        conditionGroupsUuids: updatedConditionGroupsUuid,
                    },
                }),
            );
        },
        [dispatch, id, ruleDetails?.conditionGroups, ruleDetails?.conditions, ruleDetails?.description],
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
            !ruleDetails || isFetchingRuleDetail
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
            isFetchingRuleDetail,
        ],
    );

    const conditionGroupFieldsDataHeader = useMemo(
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

    const conditionGroupFieldsData: TableDataRow[] = useMemo(
        () =>
            !ruleDetails?.conditionGroups.length
                ? []
                : ruleDetails?.conditionGroups.map((conditionGroup) => {
                      return {
                          id: conditionGroup.uuid,
                          columns: [
                              <Link to={`../../conditiongroups/detail/${conditionGroup.uuid}`}>{conditionGroup.name}</Link> || '',
                              conditionGroup.description || '',
                              <Button
                                  className="btn btn-link text-danger"
                                  size="sm"
                                  color="danger"
                                  title="Delete Condition Group"
                                  onClick={() => {
                                      onDeleteConditionGroup(conditionGroup.uuid);
                                  }}
                                  disabled={isUpdatingRule}
                              >
                                  <i className="fa fa-trash" />
                              </Button>,
                          ],
                      };
                  }),
        [ruleDetails, isUpdatingRule, onDeleteConditionGroup],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget refreshAction={getFreshDetails} busy={isBusy} title="Rule Details" titleSize="large" widgetButtons={buttons}>
                        <CustomTable data={conditionGroupsDetailData} headers={tableHeader} />
                    </Widget>
                </Col>
                <Col>
                    <Widget
                        busy={isBusy}
                        title="Condition Groups"
                        titleSize="large"
                        widgetInfoCard={{
                            title: 'Information',
                            description:
                                'Condition group is named set of conditions for selected resource that can be reused in rules of same resource',
                        }}
                    >
                        <CustomTable
                            data={conditionGroupFieldsData}
                            headers={conditionGroupFieldsDataHeader}
                            newRowWidgetProps={{
                                isBusy: isUpdatingRule,
                                newItemsList: conditionGroupsOptions,
                                onAddClick: onUpdateConditionGroupsConfirmed,
                            }}
                        />
                    </Widget>
                </Col>
            </Row>

            <Row>{ruleDetails?.resource && <ConditionsViewer resource={ruleDetails.resource} formType="rules" />}</Row>

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
