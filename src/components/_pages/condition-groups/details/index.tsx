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
import { Col, Container, Row } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';

const ConditionGroupDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionGroup);

    const [confirmDelete, setConfirmDelete] = useState(false);

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
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, conditionGroupsDetails.resource)],
                      },
                      {
                          id: 'description',
                          columns: ['Description', conditionGroupsDetails.description || ''],
                      },
                  ],
        [conditionGroupsDetails, resourceTypeEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        refreshAction={getFreshDetails}
                        busy={isFetchingConditionGroup}
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
