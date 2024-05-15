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
import { Container } from 'reactstrap';
import { PlatformEnum, Resource } from 'types/openapi';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import styles from './actionGroupsList.module.scss';

const ActionGroupsList = () => {
    const actionGroups = useSelector(rulesSelectors.actionGroups);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingActionGroups);
    const isDeleting = useSelector(rulesSelectors.isDeletingActionGroup);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isBusy = useMemo(() => isFetchingList || isDeleting, [isFetchingList, isDeleting]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actionGroupsActions.deleteActionGroup({ actionGroupUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshListActionGroups = useCallback(() => {
        dispatch(actionGroupsActions.listActionGroups({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshListActionGroups();
    }, [getFreshListActionGroups]);

    const { resourceOptions, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const conditionGroupsRowHeaders: TableHeader[] = useMemo(
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

    const actionGroupList: TableDataRow[] = useMemo(
        () =>
            actionGroups.map((actionGroup) => {
                return {
                    id: actionGroup.uuid,
                    columns: [
                        <Link to={`./detail/${actionGroup.uuid}`}>{actionGroup.name}</Link>,
                        getEnumLabel(resourceTypeEnum, actionGroup.resource),
                        actionGroup.description || '',
                    ],
                };
            }),
        [actionGroups, resourceTypeEnum],
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
                            options={resourceOptions}
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
                onClick: () => navigate(`./add`),
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [checkedRows, resourceOptions, navigate],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                titleSize="larger"
                title="Action Groups"
                refreshAction={getFreshListActionGroups}
                busy={isBusy}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Action group is named set of actions for selected trigger',
                }}
            >
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={actionGroupList}
                    headers={conditionGroupsRowHeaders}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

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

export default ActionGroupsList;
