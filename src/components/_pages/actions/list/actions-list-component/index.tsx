import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { PlatformEnum, Resource } from 'types/openapi';

import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import styles from './ruleList.module.scss';

const ActionsList = () => {
    const actionsList = useSelector(rulesSelectors.actionsList);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingActions);
    const isDeleting = useSelector(rulesSelectors.isDeletingAction);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(
        () => isFetchingList || isDeleting || isFetchingResourcesList,
        [isFetchingList, isDeleting, isFetchingResourcesList],
    );

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteAction({ actionUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshList = useCallback(() => {
        dispatch(rulesActions.listActions({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshList();
    }, [getFreshList]);

    const rulesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                align: 'left',
                id: 'name',
                width: '10%',
                sortable: true,
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

    const rulesList: TableDataRow[] = useMemo(
        () =>
            actionsList.map((rule) => {
                return {
                    id: rule.uuid,
                    columns: [
                        <Link to={`../actions/detail/${rule.uuid}`}>{rule.name}</Link>,
                        getEnumLabel(resourceTypeEnum, rule.resource),
                        rule.description || '',
                    ],
                };
            }),
        [actionsList, resourceTypeEnum],
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
                onClick: () => navigate(`../actions/add`),
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
                title="Actions"
                busy={isBusy}
                refreshAction={getFreshList}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Actions are combination of Executions',
                }}
            >
                <br />
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={rulesList}
                    headers={rulesTableHeader}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete an Action`}
                body={`You are about to delete an Action. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </>
    );
};

export default ActionsList;
