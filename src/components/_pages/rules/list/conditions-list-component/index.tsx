import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Select from 'components/Select';
import { PlatformEnum, Resource } from 'types/openapi';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';

const ConditionsList = () => {
    const conditions = useSelector(rulesSelectors.conditions);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ConditionType));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingConditions);
    const isDeleting = useSelector(rulesSelectors.isDeletingCondition);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(
        () => isFetchingList || isDeleting || isFetchingResourcesList,
        [isFetchingList, isDeleting, isFetchingResourcesList],
    );

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteCondition({ conditionUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshListConditionGroups = useCallback(() => {
        dispatch(rulesActions.listConditions({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshListConditionGroups();
    }, [getFreshListConditionGroups]);

    const conditionDataHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                align: 'left',
                id: 'name',
                width: '10%',
                sortable: true,
            },
            {
                content: 'Type',
                align: 'left',
                id: 'type',
                width: '10%',
            },
            {
                content: 'Resource',
                align: 'left',
                id: 'resource',
                width: '10%',
                sortable: true,
            },
            {
                content: 'Description',
                align: 'left',
                id: 'description',
                width: '10%',
            },
        ],
        [],
    );

    const conditionsData: TableDataRow[] = useMemo(
        () =>
            conditions.map((condition) => {
                return {
                    id: condition.uuid,
                    columns: [
                        <Link to={`../conditions/detail/${condition.uuid}`}>{condition.name}</Link>,
                        getEnumLabel(conditionTypeEnum, condition.type),
                        getEnumLabel(resourceTypeEnum, condition.resource),
                        condition.description || '',
                    ],
                };
            }),
        [conditions, resourceTypeEnum, conditionTypeEnum],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'search',
                disabled: false,
                tooltip: 'Select Resource',
                onClick: () => {},
                custom: (
                    <Select
                        placeholder="Select Resource"
                        id="resource"
                        options={resourceOptionsWithRuleEvaluator}
                        value={selectedResource || 'Select Resource'}
                        onChange={(value) => {
                            setSelectedResource(value as Resource);
                        }}
                    />
                ),
            },
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: () => navigate(`../conditions/add`),
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [checkedRows, resourceOptionsWithRuleEvaluator, navigate, selectedResource],
    );

    return (
        <>
            <Widget
                titleSize="larger"
                title="Conditions"
                refreshAction={getFreshListConditionGroups}
                busy={isBusy}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Condition is named set of conditions items',
                }}
            >
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={conditionsData}
                    headers={conditionDataHeaders}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Condition`}
                body={`You are about to delete a Condition. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', type: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </>
    );
};

export default ConditionsList;
