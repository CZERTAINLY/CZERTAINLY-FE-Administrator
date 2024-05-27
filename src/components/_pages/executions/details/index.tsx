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

const ExecutionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));
    const executionDetails = useSelector(rulesSelectors.executionDetails);
    const isFetchingDetails = useSelector(rulesSelectors.isFetchingExecutionDetails);
    const isUpdatingDetails = useSelector(rulesSelectors.isUpdatingExecution);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');

    const isBusy = useMemo(() => isFetchingDetails || isUpdatingDetails, [isFetchingDetails, isUpdatingDetails]);

    useEffect(() => {
        if (!executionDetails?.description || executionDetails.uuid !== id) return;
        setUpdatedDescription(executionDetails.description);
    }, [executionDetails, id]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getExecution({ executionUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteExecution({ executionUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== executionDetails?.description) {
            dispatch(
                rulesActions.updateExecution({
                    executionUuid: id,
                    execution: {
                        description: updatedDescription,
                        items: executionDetails?.items || [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, executionDetails, updatedDescription, updateDescriptionEditEnable]);

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

    const executionTableHeaders: TableHeader[] = useMemo(
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

    const executionDetailsData: TableDataRow[] = useMemo(
        () =>
            !executionDetails || isFetchingDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', executionDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', executionDetails.name, ''],
                      },
                      {
                          id: 'type',
                          columns: ['Type', getEnumLabel(executionTypeEnum, executionDetails.type), ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, executionDetails.resource), ''],
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
                                  executionDetails.description || ''
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
                                                  isUpdatingDetails ||
                                                  updatedDescription === executionDetails.description ||
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
                                                  setUpdatedDescription(executionDetails?.description || '');
                                              }}
                                              disabled={isUpdatingDetails}
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
                                          disabled={isUpdatingDetails}
                                      >
                                          <i className="fa fa-pencil-square-o" />
                                      </Button>
                                  )}
                              </div>,
                          ],
                      },
                  ],
        [
            executionDetails,
            executionTypeEnum,
            resourceTypeEnum,
            setUpdateDescription,
            updateDescriptionEditEnable,
            onUpdateDescriptionConfirmed,
            isUpdatingDetails,
            updatedDescription,
            isFetchingDetails,
        ],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        refreshAction={getFreshDetails}
                        busy={isBusy}
                        title="Execution Details"
                        titleSize="large"
                        widgetButtons={buttons}
                    >
                        <CustomTable data={executionDetailsData} headers={executionTableHeaders} />
                    </Widget>
                </Col>
            </Row>
            <Row>
                {executionDetails?.resource && (
                    <ConditionAndExecutionItemsViewer resource={executionDetails.resource} formType="executionItems" />
                )}
            </Row>
            <Dialog
                isOpen={confirmDelete}
                caption={`Delete an Execution`}
                body={`You are about to delete an Execution. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default ExecutionDetails;
