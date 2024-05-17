import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { actions, selectors } from 'ducks/users';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function UsersList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.usersListCheckedRows);
    const users = useSelector(selectors.users);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);

    const isBusy = isFetching || isDeleting || isUpdating || isEnabling || isDisabling;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const getFreshData = useCallback(() => {
        dispatch(actions.resetState());
        dispatch(actions.setUserListCheckedRows({ checkedRows: [] }));
        dispatch(actions.list());
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

    const onEnableClick = useCallback(() => {
        checkedRows.forEach((uuid) => dispatch(actions.enable({ uuid })));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        checkedRows.forEach((uuid) => dispatch(actions.disable({ uuid })));
    }, [checkedRows, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        setConfirmDelete(false);

        checkedRows.forEach((uuid) => dispatch(actions.deleteUser({ uuid })));
    }, [checkedRows, dispatch]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setUserListCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const isSystemUserSelected = useMemo(() => {
        return checkedRows.some((uuid) => {
            const user = users.find((user) => user.uuid === uuid);
            return user && user.systemUser;
        });
    }, [checkedRows, users]);

    const canEnable: boolean = useMemo(() => {
        if (checkedRows.length === 0) return false;
        if (checkedRows.length > 1) return true;
        const user = users.find((user) => user.uuid === checkedRows[0]);
        if (user && !user.enabled) return true;
        return false;
    }, [checkedRows, users]);

    const canDisable: boolean = useMemo(() => {
        if (checkedRows.length > 1) return true;
        const user = users.find((user) => user.uuid === checkedRows[0]);
        return (user && user.enabled) || false;
    }, [checkedRows, users]);

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
                disabled: checkedRows.length === 0 || isSystemUserSelected,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: isSystemUserSelected || !canEnable,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: isSystemUserSelected || !canDisable,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [checkedRows.length, isSystemUserSelected, canEnable, canDisable, onAddClick, onEnableClick, onDisableClick],
    );

    const userTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'username',
                content: 'Username',
                sortable: true,
                sort: 'asc',
                width: '10%',
            },
            {
                id: 'group',
                content: 'Group',
                sortable: true,
            },
            {
                id: 'description',
                content: 'Description',
                sortable: true,
                width: '5%',
            },
            {
                id: 'firstName',
                content: 'First name',
                sortable: true,
                width: '5%',
            },
            {
                id: 'lastName',
                content: 'Last name',
                sortable: true,
                width: '5%',
            },
            {
                id: 'email',
                content: 'Email',
                sortable: true,
            },
            {
                id: 'systemUser',
                content: 'System user',
                align: 'center',
                sortable: true,
                width: '7%',
            },
            {
                id: 'userStatus',
                content: 'Status',
                align: 'center',
                sortable: true,
                width: '7%',
            },
        ],
        [],
    );

    const userTableData: TableDataRow[] = useMemo(
        () =>
            users.map((user) => ({
                id: user.uuid,

                columns: [
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${user.uuid}`}>{user.username}</Link>
                    </span>,

                    <Fragment>
                        {user?.groups?.length
                            ? user?.groups.map((group, i) => (
                                  <Fragment key={group.uuid}>
                                      <Link to={`../../groups/detail/${group.uuid}`}>{group.name}</Link>
                                      {user?.groups?.length && i !== user.groups.length - 1 ? `, ` : ``}
                                  </Fragment>
                              ))
                            : 'Unassigned'}
                    </Fragment>,

                    <span style={{ whiteSpace: 'nowrap' }}>{user.description || ''}</span>,

                    <span style={{ whiteSpace: 'nowrap' }}>{user.firstName || ''}</span>,

                    <span style={{ whiteSpace: 'nowrap' }}>{user.lastName || ''}</span>,

                    <span style={{ whiteSpace: 'nowrap' }}>{user.email || ''}</span>,

                    <Badge color={!user.systemUser ? 'success' : 'danger'}>{user.systemUser ? 'Yes' : 'No'}</Badge>,

                    <StatusBadge enabled={user.enabled} />,
                ],
            })),
        [users],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of Users"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfUsers}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <br />
                <CustomTable
                    headers={userTableHeader}
                    data={userTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'Users' : 'an User'}`}
                body={`You are about to delete ${checkedRows.length > 1 ? 'Users' : 'an User'}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
