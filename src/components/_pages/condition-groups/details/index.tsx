import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

const ConditionGroupDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionGroup);

    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!id) return;
        dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
    }, [id, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteConditionGroup({ conditionGroupUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                onClick: () => navigate(`../conditiongroups/edit/${id}`),
            },
            {
                icon: 'trash',
                disabled: false,
                onClick: () => setConfirmDelete(true),
            },
        ],
        [navigate, id],
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
                          columns: ['UUID', conditionGroupsDetails.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', conditionGroupsDetails.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', conditionGroupsDetails.description || ''],
                      },
                      {
                          id: 'retryInterval',
                          columns: ['Retry Interval', conditionGroupsDetails.resource || 'N/A'],
                      },
                  ],
        [conditionGroupsDetails],
    );

    const conditionGroupFieldsDataHeader = useMemo(
        () => [
            {
                id: 'uuid',
                content: 'UUID',
            },
            {
                id: 'fieldSource',
                content: 'Field Source',
            },
            {
                id: 'operator',
                content: 'Operator',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const conditionGroupFieldsData: TableDataRow[] = useMemo(
        () =>
            !conditionGroupsDetails?.conditions.length
                ? []
                : conditionGroupsDetails?.conditions.map((condition) => {
                      return {
                          id: condition.uuid,
                          columns: [
                              condition.uuid,
                              condition.fieldSource || '',
                              condition.operator || '',
                              typeof condition.value === 'string' ? (
                                  condition.value
                              ) : condition.value === undefined ? (
                                  ''
                              ) : (
                                  <>
                                      <p
                                          className="pt-2"
                                          style={{
                                              whiteSpace: 'pre-wrap',
                                              wordBreak: 'break-all',
                                          }}
                                      >
                                          {JSON.stringify(condition.value)}
                                      </p>
                                  </>
                              ),
                          ],
                      };
                  }),
        [conditionGroupsDetails],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget busy={isFetchingConditionGroup}>
                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                    <Col>
                        <Widget title="Condition Group Details" titleSize="large" widgetButtons={buttons}>
                            <CustomTable data={conditionGroupsDetailData} headers={tableHeader} />
                        </Widget>
                    </Col>
                    <Col>
                        <Widget title="Condition Group Fields" titleSize="large">
                            <CustomTable data={conditionGroupFieldsData} headers={conditionGroupFieldsDataHeader} />
                        </Widget>
                    </Col>
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
            </Widget>
        </Container>
    );
};

export default ConditionGroupDetails;
