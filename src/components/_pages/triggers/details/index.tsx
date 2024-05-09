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
import Select from 'react-select';
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

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState<string>(triggerDetails?.description || '');
    const [newActionGroups, setNewActionGroups] = useState<SelectChangeValue[]>([]);

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

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteTrigger({ triggerUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !triggerDetails) return;
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
                },
            }),
        );
        setUpdateDescription(false);
    }, [dispatch, id, triggerDetails, updatedDescription]);

    const onUpdateActionGroupsConfirmed = useCallback(() => {
        if (!id || !triggerDetails) return;

        const newActionGroupsUuids = newActionGroups.map((newActionGroup) => newActionGroup.value);

        const previousAndNewActionGroupsUuid = triggerDetails?.actionGroups.map((actionGroup) => actionGroup.uuid);
        const allActionGroups = [...(previousAndNewActionGroupsUuid || []), ...newActionGroupsUuids];

        dispatch(
            rulesActions.updateTrigger({
                triggerUuid: id,
                trigger: {
                    actions: triggerDetails?.actions || [],
                    actionGroupsUuids: allActionGroups,
                    triggerType: triggerDetails.triggerType,
                },
            }),
        );
        setNewActionGroups([]);
    }, [dispatch, id, triggerDetails, newActionGroups]);

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
                        <CustomTable data={actionGroupsFieldsData} headers={actionGroupFieldsDataHeader} hasDetails />
                        <div className="d-flex">
                            <div className="w-100">
                                <Select
                                    onChange={(event) => {
                                        setNewActionGroups(event.map((e) => e));
                                    }}
                                    isMulti
                                    value={newActionGroups}
                                    options={actionGroupOptions}
                                />
                            </div>
                            <div>
                                {newActionGroups?.length ? (
                                    <ButtonGroup>
                                        <Button
                                            disabled={isUpdatingTrigger}
                                            className="btn btn-link ms-2 mt-2 p-1"
                                            size="sm"
                                            color="secondary"
                                            title="Update Description"
                                            onClick={onUpdateActionGroupsConfirmed}
                                        >
                                            <i className="fa fa-check" />
                                        </Button>
                                    </ButtonGroup>
                                ) : null}
                            </div>
                        </div>
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
