import ConditionsViewer from 'components/ConditionsViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';

const RuleDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);
    const isFetchingRuleDetail = useSelector(rulesSelectors.isFetchingRuleDetail);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getRule({ ruleUuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const isBusy = useMemo(() => isFetchingRuleDetail || isUpdatingRule, [isFetchingRuleDetail, isUpdatingRule]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.deleteRule({ ruleUuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                onClick: () => navigate(`../rules/edit/${id}`),
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
            !ruleDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', ruleDetails.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', ruleDetails.name],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', getEnumLabel(resourceTypeEnum, ruleDetails.resource)],
                      },
                      {
                          id: 'description',
                          columns: ['Description', ruleDetails.description || ''],
                      },
                  ],
        [ruleDetails, resourceTypeEnum],
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
        ],
        [],
    );

    const conditionGroupFieldsData: TableDataRow[] = useMemo(
        () =>
            !ruleDetails?.conditions.length
                ? []
                : ruleDetails?.conditionGroups.map((conditionGroup) => {
                      return {
                          id: conditionGroup.uuid,
                          columns: [
                              <Link to={`../../conditiongroups/detail/${conditionGroup.uuid}`}>{conditionGroup.name}</Link> || '',
                              conditionGroup.description || 'N/A',
                          ],
                      };
                  }),
        [ruleDetails],
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
                    <Widget busy={isBusy} title="Condition Groups" titleSize="large">
                        <CustomTable data={conditionGroupFieldsData} headers={conditionGroupFieldsDataHeader} hasDetails />
                    </Widget>
                </Col>
            </Row>

            <Row>{ruleDetails?.resource && <ConditionsViewer resource={ruleDetails.resource} formType="rules" />}</Row>

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

export default RuleDetails;
