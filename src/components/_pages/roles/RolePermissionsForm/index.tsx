import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { Button, ButtonGroup, Container } from 'reactstrap';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as authActions, selectors as authSelectors } from 'ducks/auth';
import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';

import { SubjectPermissionsModel } from 'types/roles';
import RolePermissionsEditor from '../RolePermissionsEditor';

import style from './style.module.scss';

function RoleForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const roleSelector = useSelector(rolesSelectors.role);
    const rolePermissionsSelector = useSelector(rolesSelectors.permissions);
    const resourcesSelector = useSelector(authSelectors.resources);

    const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
    const isFetchingPermissions = useSelector(rolesSelectors.isFetchingPermissions);
    const isFetchingResources = useSelector(authSelectors.isFetchingResources);

    const isCreatingRole = useSelector(rolesSelectors.isCreating);
    const isUpdatingRole = useSelector(rolesSelectors.isUpdating);

    const isUpdatingRolePermissions = useSelector(rolesSelectors.isUpdatingPermissions);

    const [permissions, setPermissions] = useState<SubjectPermissionsModel>();

    /* Load all users, resources and objects */

    useEffect(() => {
        dispatch(rolesActions.resetState());
        dispatch(authActions.clearResources());
        dispatch(authActions.getAuthResources());
    }, [dispatch]);

    /* Load role && role permissions */

    useEffect(() => {
        if (!id || (roleSelector && roleSelector.uuid === id)) return;

        dispatch(rolesActions.getDetail({ uuid: id }));
        dispatch(rolesActions.getPermissions({ uuid: id }));
    }, [dispatch, id, roleSelector]);

    /* Set role permissions */

    useEffect(() => {
        if (!rolePermissionsSelector || rolePermissionsSelector.uuid !== id) return;
        setPermissions(rolePermissionsSelector.permissions);
    }, [id, rolePermissionsSelector]);

    const patchPermissions = useCallback(
        (outPerms: SubjectPermissionsModel) => {
            const perms = JSON.parse(JSON.stringify(outPerms));

            const inPerms: SubjectPermissionsModel = rolePermissionsSelector?.permissions || {
                allowAllResources: false,
                resources: [],
            };

            for (let i = 0; i < perms.resources.length; i++) {
                const outRes = perms.resources[i];
                const inRes = inPerms.resources.find((res) => res.name === outRes.name);

                if (!outRes.objects) continue;

                if (outRes.objects?.length === 0 && (!inRes || (inRes.objects && inRes.objects.length === 0))) {
                    delete perms.objects;
                    continue;
                }
            }

            return perms;
        },
        [rolePermissionsSelector],
    );

    const onSubmit = useCallback(() => {
        if (!id) return;
        const perms = patchPermissions(permissions!);
        dispatch(rolesActions.updatePermissions({ uuid: id, permissions: perms }));
    }, [dispatch, id, patchPermissions, permissions]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <Container className="themed-container fixed-screen-height-container" fluid>
            <Widget
                title={`${roleSelector?.name || ''} Role Permissions`}
                busy={isFetchingRoleDetail || isFetchingPermissions || isFetchingResources || isUpdatingRolePermissions}
                className={style.widget}
                innerContainerProps={{
                    className: style.innerContainer,
                }}
            >
                <RolePermissionsEditor
                    resources={resourcesSelector}
                    permissions={permissions}
                    disabled={roleSelector?.systemRole}
                    onPermissionsChanged={(perms) => {
                        setPermissions(perms);
                    }}
                    submitButtonsGroup={
                        <ButtonGroup>
                            <ProgressButton
                                title="Save"
                                inProgressTitle="Saving..."
                                inProgress={isCreatingRole || isUpdatingRole || isUpdatingRolePermissions}
                                disabled={isCreatingRole || isUpdatingRole || roleSelector?.systemRole}
                                onClick={onSubmit}
                            />

                            <Button color="default" onClick={onCancel} disabled={isCreatingRole || isUpdatingRole}>
                                Cancel
                            </Button>
                        </ButtonGroup>
                    }
                />
            </Widget>
        </Container>
    );
}

export default RoleForm;
