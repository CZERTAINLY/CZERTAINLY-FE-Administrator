import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as actionGroupsActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { PlatformEnum, Resource } from 'types/openapi';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import styles from './actionGroupsList.module.scss';

const ExecutionsList = () => {
    const executions = useSelector(rulesSelectors.executions);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingExecutions);
    const isDeleting = useSelector(rulesSelectors.isDeletingExecution);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isBusy = useMemo(() => isFetchingList || isDeleting, [isFetchingList, isDeleting]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actionGroupsActions.deleteExecution({ executionUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshListActionGroups = useCallback(() => {
        dispatch(actionGroupsActions.listExecutions({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshListActionGroups();
    }, [getFreshListActionGroups]);

    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const executionsDataHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                align: 'left',
                id: 'name',
                width: '25%',
                sortable: true,
            },
            {
                content: 'Type',
                align: 'left',
                id: 'type',
                width: '25%',
                sortable: true,
            },
            {
                content: 'Resource',
                align: 'left',
                id: 'resource',
                width: '25%',
                sortable: true,
            },
            {
                content: 'Description',
                align: 'left',
                id: 'description',
                width: '25%',
            },
        ],
        [],
    );

    const executionsData: TableDataRow[] = useMemo(
        () =>
            executions.map((execution) => {
                return {
                    id: execution.uuid,
                    columns: [
                        <Link to={`../executions/detail/${execution.uuid}`}>{execution.name}</Link>,
                        getEnumLabel(executionTypeEnum, execution.type),
                        getEnumLabel(resourceTypeEnum, execution.resource),
                        execution.description || '',
                    ],
                };
            }),
        [executions, resourceTypeEnum, executionTypeEnum],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'search',
                disabled: false,
                tooltip: 'Select Resource',
                onClick: () => {},
                custom: (
                    <div className={styles.listSelectContainer}>
                        <Select
                            isClearable
                            maxMenuHeight={140}
                            menuPlacement="auto"
                            options={resourceOptionsWithRuleEvaluator}
                            placeholder="Select Resource"
                            onChange={(event) => {
                                setSelectedResource(event?.value as Resource);
                            }}
                        />
                    </div>
                ),
            },
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: () => navigate(`../executions/add`),
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [checkedRows, resourceOptionsWithRuleEvaluator, navigate],
    );

    return (
        <>
            <Widget
                titleSize="larger"
                title="Executions"
                refreshAction={getFreshListActionGroups}
                busy={isBusy}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Executions is named set of execution items',
                }}
            >
                <br />
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={executionsData}
                    headers={executionsDataHeaders}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete an Execution`}
                body={`You are about to delete a Execution. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </>
    );
};

export default ExecutionsList;
