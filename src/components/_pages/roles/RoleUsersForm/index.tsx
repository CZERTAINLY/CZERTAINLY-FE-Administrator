import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, ButtonGroup, Container } from 'reactstrap';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';
import { actions as userActions, selectors as usersSelectors } from 'ducks/users';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

function RoleForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const roleSelector = useSelector(rolesSelectors.role);
    const usersSelector = useSelector(usersSelectors.users);

    const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
    const isFetchingUsers = useSelector(usersSelectors.isFetchingList);
    const isUpdatingUsers = useSelector(rolesSelectors.isUpdatingUsers);

    const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

    /* Load all users */

    useEffect(() => {
        if (!id) return;
        dispatch(userActions.list());
        dispatch(rolesActions.getDetail({ uuid: id }));
    }, [dispatch, id]);

    /* Set assigned users */

    useEffect(() => {
        if (!roleSelector || roleSelector.uuid !== id) return;
        setAssignedUsers(roleSelector.users.map((user) => user.uuid));
    }, [id, roleSelector]);

    const onSubmit = useCallback(() => {
        if (!id) return;
        dispatch(rolesActions.updateUsers({ uuid: id, users: assignedUsers }));
    }, [assignedUsers, dispatch, id]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

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
        <Container className="themed-container" fluid>
            <Widget title={`${roleSelector?.name || ''} Role Users `} busy={isFetchingRoleDetail || isFetchingUsers || isUpdatingUsers}>
                <br />

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

                <div className="d-flex justify-content-end">
                    <ButtonGroup>
                        <ProgressButton title="Save" inProgressTitle="Saving..." inProgress={isUpdatingUsers} onClick={onSubmit} />

                        <Button color="default" onClick={onCancel} disabled={isUpdatingUsers}>
                            Cancel
                        </Button>
                    </ButtonGroup>
                </div>
            </Widget>
        </Container>
    );
}

export default RoleForm;
