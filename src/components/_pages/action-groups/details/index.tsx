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

const ActionGroupDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const actionGroupDetails = useSelector(rulesSelectors.actionGroupDetails);
    const isFetchingDetails = useSelector(rulesSelectors.isFetchingActionGroup);
    const isUpdatingDetails = useSelector(rulesSelectors.isupdatingActionGroup);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState(actionGroupDetails?.description);

    const isBusy = useMemo(() => isFetchingDetails || isUpdatingDetails, [isFetchingDetails, isUpdatingDetails]);

    useEffect(() => {
        if (!actionGroupDetails?.description) return;
        setUpdatedDescription(actionGroupDetails.description);
    }, [actionGroupDetails?.description]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getActionGroup({ actionGroupUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteActionGroup({ actionGroupUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== actionGroupDetails?.description) {
            dispatch(
                rulesActions.updateActionGroup({
                    actionGroupUuid: id,
                    actionGroup: {
                        description: updatedDescription,
                        actions: actionGroupDetails?.actions || [],
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, actionGroupDetails, updatedDescription, updateDescriptionEditEnable]);

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
            !actionGroupDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', actionGroupDetails.uuid, ''],
                      },
                      {
                          id: 'name',
                          columns: ['Name', actionGroupDetails.name, ''],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, actionGroupDetails.resource), ''],
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
                                  actionGroupDetails.description || ''
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
                                              disabled={isUpdatingDetails || updatedDescription === actionGroupDetails.description}
                                          >
                                              <i className="fa fa-check" />
                                          </Button>
                                          <Button
                                              className="btn btn-link mx-auto danger"
                                              size="sm"
                                              title="Cancel"
                                              onClick={() => {
                                                  setUpdateDescription(false);
                                                  setUpdatedDescription(actionGroupDetails.description || '');
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
            actionGroupDetails,
            resourceTypeEnum,
            setUpdateDescription,
            updateDescriptionEditEnable,
            onUpdateDescriptionConfirmed,
            isUpdatingDetails,
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
                        title="Action Group Details"
                        titleSize="large"
                        widgetButtons={buttons}
                    >
                        <CustomTable data={actionGroupsDetailData} headers={tableHeader} />
                    </Widget>
                </Col>
            </Row>
            <Row>{actionGroupDetails?.resource && <ConditionsViewer resource={actionGroupDetails.resource} formType="actionGroup" />}</Row>
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

export default ActionGroupDetails;
