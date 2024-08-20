import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { actions, selectors } from 'ducks/token-profiles';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import TokenStatusBadge from 'components/_pages/tokens/TokenStatusBadge';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import Select from 'react-select';
import { KeyUsage, PlatformEnum } from 'types/openapi';
import { TokenProfileResponseModel } from 'types/token-profiles';
import { LockWidgetNameEnum } from 'types/user-interface';

function TokenProfileList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const tokenProfiles = useSelector(selectors.tokenProfiles);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isUpdating = useSelector(selectors.isUpdating);
    const isEnabling = useSelector(selectors.isEnabling);
    const isBulkEnabling = useSelector(selectors.isBulkEnabling);
    const isBulkDisabling = useSelector(selectors.isBulkDisabling);
    const isBulkUpdatingKeyUsage = useSelector(selectors.isBulkUpdatingKeyUsage);
    const keyUsageEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyUsage));

    const isBusy =
        isFetching ||
        isDeleting ||
        isUpdating ||
        isBulkDeleting ||
        isEnabling ||
        isBulkEnabling ||
        isBulkDisabling ||
        isBulkUpdatingKeyUsage;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const [keyUsageUpdate, setKeyUsageUpdate] = useState<boolean>(false);

    const [keyUsages, setKeyUsages] = useState<KeyUsage[]>([]);

    const getFreshData = useCallback(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
        dispatch(actions.listTokenProfiles({}));
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

    const onEnableClick = useCallback(() => {
        dispatch(actions.bulkEnableTokenProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        dispatch(actions.bulkDisableTokenProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteTokenProfiles({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const onUpdateKeyUsageConfirmed = useCallback(() => {
        dispatch(actions.bulkUpdateKeyUsage({ usage: { usage: keyUsages, uuids: checkedRows } }));
        setKeyUsageUpdate(false);
    }, [checkedRows, dispatch, keyUsages]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: () => {
                    onAddClick();
                },
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: checkedRows.length === 0,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
            {
                icon: 'key',
                disabled: checkedRows.length === 0,
                tooltip: 'Update Key Usage',
                onClick: () => {
                    setKeyUsageUpdate(true);
                },
            },
        ],
        [checkedRows, onAddClick, onEnableClick, onDisableClick, setKeyUsageUpdate],
    );

    const keyUsageOptions = () => {
        let options = [];
        for (const suit in KeyUsage) {
            options.push({
                label: getEnumLabel(keyUsageEnum, KeyUsage[suit as keyof typeof KeyUsage]),
                value: KeyUsage[suit as keyof typeof KeyUsage],
            });
        }
        return options;
    };

    const keyUsageBody = (
        <div>
            <div className="form-group">
                <label className="form-label">Key Usage</label>
                <Select
                    isMulti={true}
                    id="field"
                    options={keyUsageOptions()}
                    onChange={(e) => {
                        setKeyUsages(e.map((item) => item.value));
                    }}
                    isClearable={true}
                />
            </div>
        </div>
    );

    const tokenProfilesTableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: '15%',
            },
            {
                id: 'description',
                content: 'Description',
                sortable: true,
            },
            {
                id: 'usages',
                align: 'center',
                content: 'Usages',
            },
            {
                id: 'token',
                align: 'center',
                content: 'Token',
                sortable: true,
                width: '15%',
            },
            {
                id: 'tokenStatus',
                align: 'center',
                content: 'Token Status',
                sortable: true,
                width: '15%',
            },
            {
                id: 'status',
                align: 'center',
                content: 'Status',
                sortable: true,
                width: '7%',
            },
        ],
        [],
    );

    const getTokenProfileUsages = (tokenProfile: TokenProfileResponseModel) => {
        return tokenProfile.usages.map((keyUsage, i) => {
            return (
                <React.Fragment key={keyUsage + i}>
                    &nbsp;
                    <Badge color="secondary" key={keyUsage}>
                        {keyUsage}
                    </Badge>
                </React.Fragment>
            );
        });
    };

    const profilesTableData: TableDataRow[] = useMemo(
        () =>
            tokenProfiles.map((tokenProfile) => ({
                id: tokenProfile.uuid,

                columns: [
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${tokenProfile.tokenInstanceUuid || 'unknown'}/${tokenProfile.uuid}`}>{tokenProfile.name}</Link>
                    </span>,

                    <span style={{ whiteSpace: 'nowrap' }}>{tokenProfile.description || ''}</span>,

                    <>{getTokenProfileUsages(tokenProfile)}</>,

                    tokenProfile.tokenInstanceName ? (
                        <Link to={`../tokens/detail/${tokenProfile.tokenInstanceUuid}`}>
                            {tokenProfile.tokenInstanceName ?? 'Unassigned'}
                        </Link>
                    ) : (
                        (tokenProfile.tokenInstanceName ?? 'Unassigned')
                    ),

                    <TokenStatusBadge status={tokenProfile.tokenInstanceStatus} />,

                    <StatusBadge enabled={tokenProfile.enabled} />,
                ],
            })),
        [tokenProfiles],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of Token Profiles"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfTokenProfiles}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <br />
                <CustomTable
                    headers={tokenProfilesTableHeaders}
                    data={profilesTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete Token ${checkedRows.length > 1 ? 'Profiles' : 'Profile'}`}
                body={`You are about to delete ${
                    checkedRows.length > 1 ? 'a Token Profile' : 'Token Profiles'
                }. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={keyUsageUpdate}
                caption={`Update Key Usage`}
                body={keyUsageBody}
                toggle={() => setKeyUsageUpdate(false)}
                buttons={[
                    { color: 'primary', onClick: onUpdateKeyUsageConfirmed, body: 'Update' },
                    { color: 'secondary', onClick: () => setKeyUsageUpdate(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}

export default TokenProfileList;
