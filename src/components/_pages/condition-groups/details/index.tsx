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

const ConditionGroupDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionGroup);
    const isUpdatingGroupDetails = useSelector(rulesSelectors.isUpdatingConditionGroup);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState(conditionGroupsDetails?.description);

    const isBusy = useMemo(() => isFetchingConditionGroup || isUpdatingGroupDetails, [isFetchingConditionGroup, isUpdatingGroupDetails]);

    useEffect(() => {
        if (!conditionGroupsDetails?.description) return;
        setUpdatedDescription(conditionGroupsDetails.description);
    }, [conditionGroupsDetails?.description]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteConditionGroup({ conditionGroupUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== conditionGroupsDetails?.description) {
            dispatch(
                rulesActions.updateConditionGroup({
                    conditionGroupUuid: id,
                    conditionGroup: {
                        description: updatedDescription,
                        conditions: conditionGroupsDetails?.conditions || [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, conditionGroupsDetails, updatedDescription, updateDescriptionEditEnable]);

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
            !conditionGroupsDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', conditionGroupsDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', conditionGroupsDetails.name, ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, conditionGroupsDetails.resource), ''],
                      },
                      {
                          id: 'description',
                          columns: [
                              'Description',
                              updateDescriptionEditEnable ? (
                                  <Input
                                      onChange={(e) => setUpdatedDescription(e.target.value)}
                                      value={updatedDescription}
                                      placeholder="Enter Description"
                                  />
                              ) : (
                                  conditionGroupsDetails.description || ''
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
                                              disabled={isUpdatingGroupDetails || updatedDescription === conditionGroupsDetails.description}
                                          >
                                              <i className="fa fa-check" />
                                          </Button>
                                          <Button
                                              className="btn btn-link mx-auto danger"
                                              size="sm"
                                              title="Cancel"
                                              onClick={() => {
                                                  setUpdateDescription(false);
                                                  setUpdatedDescription(conditionGroupsDetails.description || '');
                                              }}
                                              disabled={isUpdatingGroupDetails}
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
                                          disabled={isUpdatingGroupDetails}
                                      >
                                          <i className="fa fa-pencil-square-o" />
                                      </Button>
                                  )}
                              </div>,
                          ],
                      },
                  ],
        [
            conditionGroupsDetails,
            resourceTypeEnum,
            setUpdateDescription,
            updateDescriptionEditEnable,
            onUpdateDescriptionConfirmed,
            isUpdatingGroupDetails,
            updatedDescription,
        ],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        refreshAction={getFreshDetails}
                        busy={isBusy}
                        title="Condition Group Details"
                        titleSize="large"
                        widgetButtons={buttons}
                    >
                        <CustomTable data={conditionGroupsDetailData} headers={tableHeader} />
                    </Widget>
                </Col>
            </Row>
            <Row>
                {conditionGroupsDetails?.resource && (
                    <ConditionsViewer resource={conditionGroupsDetails.resource} formType="conditionGroup" />
                )}
            </Row>
            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Condition Group`}
                body={`You are about to delete a Condition Group. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default ConditionGroupDetails;
