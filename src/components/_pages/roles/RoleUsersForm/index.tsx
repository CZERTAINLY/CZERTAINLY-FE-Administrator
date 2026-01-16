import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'components/Button';
import Container from 'components/Container';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';
import { actions as userActions, selectors as usersSelectors } from 'ducks/users';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

interface RoleUsersFormProps {
    roleId?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

function RoleUsersForm({ roleId, onCancel, onSuccess }: RoleUsersFormProps = {}) {
    const dispatch = useDispatch();

    const roleSelector = useSelector(rolesSelectors.role);
    const usersSelector = useSelector(usersSelectors.users);

    const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
    const isFetchingUsers = useSelector(usersSelectors.isFetchingList);

    const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

    const isUpdatingUsers = useSelector(rolesSelectors.isUpdatingUsers);
    const wasUpdating = useRef(isUpdatingUsers);

    useEffect(() => {
        if (wasUpdating.current && !isUpdatingUsers) {
            if (onSuccess) {
                onSuccess();
            }
        }
        wasUpdating.current = isUpdatingUsers;
    }, [isUpdatingUsers, onSuccess]);

    /* Load all users */

    useEffect(() => {
        if (!roleId) return;
        dispatch(userActions.list());
        dispatch(rolesActions.getDetail({ uuid: roleId }));
    }, [dispatch, roleId]);

    /* Set assigned users */

    useEffect(() => {
        if (!roleSelector || roleSelector.uuid !== roleId) return;
        setAssignedUsers(roleSelector.users.map((user) => user.uuid));
    }, [roleId, roleSelector]);

    const handleSubmit = useCallback(() => {
        if (!roleId) return;
        dispatch(rolesActions.updateUsers({ uuid: roleId, users: assignedUsers }));
    }, [assignedUsers, dispatch, roleId]);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);

    const usersTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'userName',
                content: 'Username',
                sortable: true,
                sort: 'asc',
                width: 'auto',
            },
            {
                id: 'firstName',
                content: 'First Name',
                sortable: true,
            },
            {
                id: 'lastName',
                content: 'Last Name',
                sortable: true,
            },
            {
                id: 'email',
                content: 'Email',
                sortable: true,
            },
        ],
        [],
    );

    const usersTableData: TableDataRow[] = useMemo(
        () =>
            usersSelector.map((user) => ({
                id: user.uuid,

                columns: [user.username, user.firstName || '', user.lastName || '', user.email || ''],
            })),

        [usersSelector],
    );

    return (
        <Widget noBorder busy={isFetchingRoleDetail || isFetchingUsers || isUpdatingUsers}>
            <CustomTable
                headers={usersTableHeader}
                data={usersTableData}
                checkedRows={assignedUsers}
                hasCheckboxes={true}
                hasAllCheckBox={false}
                onCheckedRowsChanged={(rows) => {
                    setAssignedUsers(rows as string[]);
                }}
            />

            <Container className="flex-row justify-end modal-footer" gap={4}>
                <Button variant="outline" onClick={handleCancel} disabled={isUpdatingUsers}>
                    Cancel
                </Button>
                <ProgressButton title="Save" inProgressTitle="Saving..." inProgress={isUpdatingUsers} onClick={handleSubmit} />
            </Container>
        </Widget>
    );
}

export default RoleUsersForm;
