import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { PlatformEnum, Resource } from 'types/openapi';

import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import { useResourceFilterButtons } from '../../../rules/list/useResourceFilterButtons';
import ActionsForm from '../../form';

const ActionsList = () => {
    const actionsList = useSelector(rulesSelectors.actionsList);

    const dispatch = useDispatch();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingActions);
    const isDeleting = useSelector(rulesSelectors.isDeletingAction);
    const isCreatingAction = useSelector(rulesSelectors.isCreatingAction);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(
        () => isFetchingList || isDeleting || isFetchingResourcesList,
        [isFetchingList, isDeleting, isFetchingResourcesList],
    );

    const wasCreating = useRef(isCreatingAction);
    const getFreshList = useCallback(() => {
        dispatch(rulesActions.listActions({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        if (wasCreating.current && !isCreatingAction) {
            setIsAddModalOpen(false);
            getFreshList();
        }
        wasCreating.current = isCreatingAction;
    }, [isCreatingAction, getFreshList]);

    const handleOpenAddModal = useCallback(() => {
        setIsAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setIsAddModalOpen(false);
    }, []);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteAction({ actionUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    useEffect(() => {
        getFreshList();
    }, [getFreshList]);

    const rulesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                align: 'left',
                id: 'name',
                width: '40%',
                sortable: true,
            },
            {
                content: 'Resource',
                align: 'left',
                id: 'resource',
                width: '30%',
                sortable: true,
            },
            {
                content: 'Description',
                align: 'left',
                id: 'description',
                width: '30%',
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

    const buttons = useResourceFilterButtons({
        resourceOptionsWithRuleEvaluator,
        selectedResource,
        setSelectedResource,
        checkedRows,
        handleOpenAddModal,
        setConfirmDelete,
    });

    return (
        <>
            <Widget
                titleSize="large"
                title="Actions"
                busy={isBusy}
                refreshAction={getFreshList}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Actions are combination of Executions',
                }}
                noBorder
            >
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
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={isAddModalOpen}
                toggle={handleCloseAddModal}
                caption="Create Action"
                size="xl"
                body={<ActionsForm onCancel={handleCloseAddModal} onSuccess={handleCloseAddModal} />}
                noBorder
            />
        </>
    );
};

export default ActionsList;
