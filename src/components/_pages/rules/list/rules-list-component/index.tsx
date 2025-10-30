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
import styles from './ruleList.module.scss';

const RulesList = () => {
    const rules = useSelector(rulesSelectors.rules);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingRulesList);
    const isDeleting = useSelector(rulesSelectors.isDeletingRule);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(
        () => isFetchingList || isDeleting || isFetchingResourcesList,
        [isFetchingList, isDeleting, isFetchingResourcesList],
    );

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteRule({ ruleUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshList = useCallback(() => {
        dispatch(rulesActions.listRules({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshList();
    }, [getFreshList]);

    const rulesHeader: TableHeader[] = useMemo(
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

    const rulesData: TableDataRow[] = useMemo(
        () =>
            rules.map((rule) => {
                return {
                    id: rule.uuid,
                    columns: [
                        <Link to={`../rules/detail/${rule.uuid}`}>{rule.name}</Link>,
                        getEnumLabel(resourceTypeEnum, rule.resource),
                        rule.description || '',
                    ],
                };
            }),
        [rules, resourceTypeEnum],
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
                onClick: () => navigate(`../rules/add`),
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
                title="Rules"
                refreshAction={getFreshList}
                busy={isBusy}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Rules contain set of conditions',
                }}
            >
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={rulesData}
                    headers={rulesHeader}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Rule`}
                body={`You are about to delete a Rule. Is this what you want to do?`}
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

export default RulesList;
