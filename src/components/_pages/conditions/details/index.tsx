import ConditionAndExecutionItemsViewer from 'components/ConditionAndExecutionItemsViewer';
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

const ConditionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ConditionType));
    const conditionDetails = useSelector(rulesSelectors.conditionDetails);
    const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionDetails);
    const isUpdatingGroupDetails = useSelector(rulesSelectors.isUpdatingCondition);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');

    const isBusy = useMemo(() => isFetchingConditionGroup || isUpdatingGroupDetails, [isFetchingConditionGroup, isUpdatingGroupDetails]);

    useEffect(() => {
        if (!conditionDetails?.description || conditionDetails.uuid !== id) return;
        setUpdatedDescription(conditionDetails.description);
    }, [conditionDetails, id]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getCondition({ conditionUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteCondition({ conditionUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== conditionDetails?.description) {
            dispatch(
                rulesActions.updateCondition({
                    conditionUuid: id,
                    condition: {
                        description: updatedDescription,
                        items: conditionDetails?.items || [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, conditionDetails, updatedDescription, updateDescriptionEditEnable]);

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
                align: 'center',
            },
        ],
        [],
    );

    const conditionGroupsDetailData: TableDataRow[] = useMemo(
        () =>
            !conditionDetails || isFetchingConditionGroup
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', conditionDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', conditionDetails.name, ''],
                      },
                      {
                          id: 'type',
                          columns: ['Type', getEnumLabel(conditionTypeEnum, conditionDetails.type), ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, conditionDetails.resource), ''],
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
                                  conditionDetails.description || ''
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
                                                  isUpdatingGroupDetails ||
                                                  updatedDescription === conditionDetails.description ||
                                                  updatedDescription === ''
                                              }
                                          >
                                              <i className="fa fa-check" />
                                          </Button>
                                          <Button
                                              className="btn btn-link mx-auto danger"
                                              size="sm"
                                              title="Cancel"
                                              onClick={() => {
                                                  setUpdateDescription(false);
                                                  setUpdatedDescription(conditionDetails?.description || '');
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
            conditionDetails,
            conditionTypeEnum,
            resourceTypeEnum,
            setUpdateDescription,
            updateDescriptionEditEnable,
            onUpdateDescriptionConfirmed,
            isUpdatingGroupDetails,
            updatedDescription,
            isFetchingConditionGroup,
        ],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        refreshAction={getFreshDetails}
                        busy={isBusy}
                        title="Condition Details"
                        titleSize="large"
                        widgetButtons={buttons}
                    >
                        <CustomTable data={conditionGroupsDetailData} headers={tableHeader} />
                    </Widget>
                </Col>
            </Row>
            <Row>
                {conditionDetails?.resource && (
                    <ConditionAndExecutionItemsViewer resource={conditionDetails.resource} formType="condtionItems" />
                )}
            </Row>
            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Condition`}
                body={`You are about to delete a Condition. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default ConditionDetails;
