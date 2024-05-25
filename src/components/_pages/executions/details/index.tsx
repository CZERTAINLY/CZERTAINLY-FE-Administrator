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

const ExecutionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const ExecutionDetails = useSelector(rulesSelectors.ExecutionDetails);
    const isFetchingDetails = useSelector(rulesSelectors.isFetchingExecutionDetails);
    const isUpdatingDetails = useSelector(rulesSelectors.isUpdatingExecution);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');

    const isBusy = useMemo(() => isFetchingDetails || isUpdatingDetails, [isFetchingDetails, isUpdatingDetails]);

    useEffect(() => {
        if (!ExecutionDetails?.description || ExecutionDetails.uuid !== id) return;
        setUpdatedDescription(ExecutionDetails.description);
    }, [ExecutionDetails, id]);

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
        if (updatedDescription !== ExecutionDetails?.description) {
            dispatch(
                rulesActions.updateExecution({
                    executionUuid: id,
                    execution: {
                        description: updatedDescription,
                        // actions: ExecutionDetails?.actions || [],
                        items: ExecutionDetails?.items || [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, ExecutionDetails, updatedDescription, updateDescriptionEditEnable]);

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

    const actionGroupsDetailData: TableDataRow[] = useMemo(
        () =>
            !ExecutionDetails || isFetchingDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', ExecutionDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', ExecutionDetails.name, ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, ExecutionDetails.resource), ''],
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
                                  ExecutionDetails.description || ''
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
                                                  updatedDescription === ExecutionDetails.description ||
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
                                                  setUpdatedDescription(ExecutionDetails?.description || '');
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
            ExecutionDetails,
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
                        <CustomTable data={actionGroupsDetailData} headers={tableHeader} />
                    </Widget>
                </Col>
            </Row>
            <Row>{ExecutionDetails?.resource && <ConditionsViewer resource={ExecutionDetails.resource} formType="actionGroup" />}</Row>
            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Action Group`}
                body={`You are about to delete a Action Group. Is this what you want to do?`}
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
