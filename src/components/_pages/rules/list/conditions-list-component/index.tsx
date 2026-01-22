import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import Select from 'components/Select';
import { PlatformEnum, Resource } from 'types/openapi';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import ConditionForm from '../../../conditions/form';

const ConditionsList = () => {
    const conditions = useSelector(rulesSelectors.conditions);

    const dispatch = useDispatch();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const conditionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ConditionType));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingConditions);
    const isDeleting = useSelector(rulesSelectors.isDeletingCondition);
    const isCreatingCondition = useSelector(rulesSelectors.isCreatingCondition);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(
        () => isFetchingList || isDeleting || isFetchingResourcesList,
        [isFetchingList, isDeleting, isFetchingResourcesList],
    );

    const wasCreating = useRef(isCreatingCondition);
    const getFreshListConditionGroups = useCallback(() => {
        dispatch(rulesActions.listConditions({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        if (wasCreating.current && !isCreatingCondition) {
            setIsAddModalOpen(false);
            getFreshListConditionGroups();
        }
        wasCreating.current = isCreatingCondition;
    }, [isCreatingCondition, getFreshListConditionGroups]);

    const handleOpenAddModal = useCallback(() => {
        setIsAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setIsAddModalOpen(false);
    }, []);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteCondition({ conditionUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    useEffect(() => {
        getFreshListConditionGroups();
    }, [getFreshListConditionGroups]);

    const conditionDataHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                align: 'left',
                id: 'name',
                width: '40%',
                sortable: true,
            },
            {
                content: 'Type',
                align: 'left',
                id: 'type',
                width: '20%',
            },
            {
                content: 'Resource',
                align: 'left',
                id: 'resource',
                width: '20%',
                sortable: true,
            },
            {
                content: 'Description',
                align: 'left',
                id: 'description',
                width: '20%',
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
                        minWidth={165}
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
                onClick: handleOpenAddModal,
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [checkedRows, resourceOptionsWithRuleEvaluator, selectedResource, handleOpenAddModal],
    );

    return (
        <>
            <Widget
                noBorder
                titleSize="large"
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
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={isAddModalOpen}
                toggle={handleCloseAddModal}
                caption="Create Condition"
                size="xl"
                body={<ConditionForm onCancel={handleCloseAddModal} onSuccess={handleCloseAddModal} />}
                noBorder
            />
        </>
    );
};

export default ConditionsList;
