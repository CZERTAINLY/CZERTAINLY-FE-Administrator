import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'components/Button';
import Container from 'components/Container';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as authActions, selectors as authSelectors } from 'ducks/auth';
import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';

import { SubjectPermissionsModel } from 'types/roles';
import RolePermissionsEditor from '../RolePermissionsEditor';

interface RolePermissionsFormProps {
    roleId?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

function RolePermissionsForm({ roleId, onCancel, onSuccess }: RolePermissionsFormProps = {}) {
    const dispatch = useDispatch();

    const roleSelector = useSelector(rolesSelectors.role);
    const rolePermissionsSelector = useSelector(rolesSelectors.permissions);
    const resourcesSelector = useSelector(authSelectors.resources);

    const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
    const isFetchingPermissions = useSelector(rolesSelectors.isFetchingPermissions);
    const isFetchingResources = useSelector(authSelectors.isFetchingResources);

    const isCreatingRole = useSelector(rolesSelectors.isCreating);
    const isUpdatingRole = useSelector(rolesSelectors.isUpdating);

    const [permissions, setPermissions] = useState<SubjectPermissionsModel>();

    /* Load all users, resources and objects */

    useEffect(() => {
        dispatch(rolesActions.resetState());
        dispatch(authActions.clearResources());
        dispatch(authActions.getAuthResources());
    }, [dispatch]);

    const isUpdatingRolePermissions = useSelector(rolesSelectors.isUpdatingPermissions);
    const wasUpdating = useRef(isUpdatingRolePermissions);

    useEffect(() => {
        if (wasUpdating.current && !isUpdatingRolePermissions) {
            if (onSuccess) {
                onSuccess();
            }
        }
        wasUpdating.current = isUpdatingRolePermissions;
    }, [isUpdatingRolePermissions, onSuccess]);

    /* Load role && role permissions */

    useEffect(() => {
        if (!roleId || (roleSelector && roleSelector.uuid === roleId)) return;

        dispatch(rolesActions.getDetail({ uuid: roleId }));
        dispatch(rolesActions.getPermissions({ uuid: roleId }));
    }, [dispatch, roleId, roleSelector]);

    /* Set role permissions */

    useEffect(() => {
        if (!rolePermissionsSelector || rolePermissionsSelector.uuid !== roleId) return;
        setPermissions(rolePermissionsSelector.permissions);
    }, [roleId, rolePermissionsSelector]);

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

    const handleSubmit = useCallback(() => {
        if (!roleId) return;
        const perms = patchPermissions(permissions!);
        dispatch(rolesActions.updatePermissions({ uuid: roleId, permissions: perms }));
    }, [dispatch, roleId, patchPermissions, permissions]);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);

    return (
        <Container className="fixed-screen-height-container">
            <Widget
                title={`${roleSelector?.name || ''} Role Permissions`}
                busy={isFetchingRoleDetail || isFetchingPermissions || isFetchingResources || isUpdatingRolePermissions}
            >
                <RolePermissionsEditor
                    resources={resourcesSelector}
                    permissions={permissions}
                    disabled={roleSelector?.systemRole}
                    onPermissionsChanged={(perms) => {
                        setPermissions(perms);
                    }}
                    submitButtonsGroup={
                        <div className="flex gap-2">
                            <ProgressButton
                                title="Save"
                                inProgressTitle="Saving..."
                                inProgress={isCreatingRole || isUpdatingRole || isUpdatingRolePermissions}
                                disabled={isCreatingRole || isUpdatingRole || roleSelector?.systemRole}
                                onClick={handleSubmit}
                            />

                            <Button variant="outline" onClick={handleCancel} disabled={isCreatingRole || isUpdatingRole}>
                                Cancel
                            </Button>
                        </div>
                    }
                />
            </Widget>
        </Container>
    );
}

export default RolePermissionsForm;
