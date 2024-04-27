import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import cx from 'classnames';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Container } from 'reactstrap';
import { PlatformEnum, Resource } from 'types/openapi';
import styles from './conditionGroupsList.module.scss';

const ConditionGroups = () => {
    const conditionGroups = useSelector(rulesSelectors.conditionRuleGroups);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingConditionGroups);
    const isDeleting = useSelector(rulesSelectors.isDeletingConditionGroup);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isBusy = useMemo(() => isFetchingList || isDeleting, [isFetchingList, isDeleting]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteConditionGroup({ conditionGroupUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshListConditionGroups = useCallback(() => {
        dispatch(rulesActions.listConditionGroups({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshListConditionGroups();
    }, [getFreshListConditionGroups]);

    const resourceOptions = useMemo(() => {
        if (resourceTypeEnum === undefined) return [];
        const resourceTypeArray = Object.entries(resourceTypeEnum)
            .map(([key, value]) => {
                return { value: value.code, label: value.label };
            })
            .filter((resource) => resource.value !== Resource.None)
            .sort((a, b) => a.label.localeCompare(b.label));

        return resourceTypeArray;
    }, [resourceTypeEnum]);

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

    const conditionGroupList: TableDataRow[] = useMemo(
        () =>
            conditionGroups.map((conditionGroup) => {
                return {
                    id: conditionGroup.uuid,
                    columns: [
                        <Link to={`./detail/${conditionGroup.uuid}`}>{conditionGroup.name}</Link>,
                        getEnumLabel(resourceTypeEnum, conditionGroup.resource),
                        conditionGroup.description || '',
                    ],
                };
            }),
        [conditionGroups, resourceTypeEnum],
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

            {
                icon: 'info',
                disabled: false,
                onClick: () => {},
                custom: (
                    <i
                        className={cx('fa fa-info', styles.infoIcon)}
                        title="Condition Group is a set of conditions that are applicable to a rule"
                    />
                ),
            },
        ],
        [checkedRows, resourceOptions, navigate],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                titleSize="larger"
                title="Condition Groups"
                refreshAction={getFreshListConditionGroups}
                busy={isBusy}
                widgetButtons={buttons}
            >
                <br />
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={conditionGroupList}
                    headers={conditionGroupsRowHeaders}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

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

export default ConditionGroups;
