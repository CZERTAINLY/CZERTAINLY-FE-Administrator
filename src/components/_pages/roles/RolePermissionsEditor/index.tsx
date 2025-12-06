import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import Checkbox from 'components/Checkbox';

import { actions as authActions, selectors as authSelectors } from 'ducks/auth';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthResourceModel } from 'types/auth';
import { ObjectPermissionsResponseModel, ResourcePermissionsResponseModel, SubjectPermissionsModel } from 'types/roles';

interface Props {
    submitButtonsGroup: React.ReactNode;
    resources?: AuthResourceModel[];
    permissions?: SubjectPermissionsModel;
    disabled?: boolean;
    onPermissionsChanged?: (permissions: SubjectPermissionsModel) => void;
}

function RolePermissionsEditor({
    submitButtonsGroup,
    resources,
    permissions = { allowAllResources: false, resources: [] },
    disabled = false,
    onPermissionsChanged,
}: Props) {
    const dispatch = useDispatch();

    const objects = useSelector(authSelectors.objects);
    const isFetchingObjects = useSelector(authSelectors.isFetchingObjects);

    const [currentResource, setCurrentResource] = useState<AuthResourceModel>();

    const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
    const [objectsToAdd, setObjectsToAdd] = useState<string[]>([]);

    const [objectListDialog, setObjectListDialog] = useState<boolean>(false);

    const isBusy = isFetchingObjects;

    const getPermissions = useCallback(
        (resource: AuthResourceModel) => {
            if (permissions.allowAllResources) return 'All actions allowed';

            const perms = permissions?.resources.find((r) => r.name === resource.name);

            if (perms?.allowAllActions) return 'All actions allowed';

            const actions = perms?.actions
                .map((actionName) => resource.actions.find((el) => el.name === actionName)?.displayName)
                .filter((el) => el)
                .join(', ');

            return actions ? actions : 'No permissions assigned';
        },
        [permissions],
    );

    const clonePerms = useCallback(() => JSON.parse(JSON.stringify(permissions)) as SubjectPermissionsModel, [permissions]);

    const onResourceSelected = useCallback(
        (resource: AuthResourceModel) => {
            setObjectsToAdd([]);
            if (resource.listObjectsEndpoint) dispatch(authActions.getObjectsForResource({ resource: resource.name }));
            setCurrentResource(resource);
        },
        [dispatch],
    );

    const allowAllActions = useCallback(
        (resource: AuthResourceModel, enable: boolean) => {
            const newPermissions: SubjectPermissionsModel = clonePerms();

            const resourcePermissions = newPermissions.resources.find((r) => r.name === resource.name);

            if (resourcePermissions) {
                resourcePermissions.allowAllActions = enable;
                resourcePermissions.actions = enable ? currentResource?.actions.map((a) => a.name) || [] : [];
            } else {
                newPermissions.resources.push({
                    name: resource.name,
                    allowAllActions: enable,
                    actions: enable ? currentResource?.actions.map((a) => a.name) || [] : [],
                    objects: [],
                });
            }

            onPermissionsChanged?.(newPermissions);
        },
        [clonePerms, currentResource?.actions, onPermissionsChanged],
    );

    const allowAction = useCallback(
        (resource: AuthResourceModel, action: string, enable: boolean) => {
            const newPermissions: SubjectPermissionsModel = clonePerms();

            const resourcePermissions = newPermissions.resources.find((r) => r.name === resource.name);

            if (resourcePermissions) {
                if (enable) {
                    resourcePermissions.actions.push(action);
                } else {
                    resourcePermissions.actions = resourcePermissions.actions.filter((a) => a !== action);
                }
            } else {
                newPermissions.resources.push({
                    name: resource.name,
                    allowAllActions: false,
                    actions: [action],
                    objects: [],
                });
            }

            onPermissionsChanged?.(newPermissions);
        },
        [clonePerms, onPermissionsChanged],
    );

    const setExistingOLP = useCallback(
        (
            resourcePermissions: ResourcePermissionsResponseModel,
            objectUuid: string,
            objectName: string,
            action: string,
            permissions: 'allow' | 'deny',
        ) => {
            const handleExistingObjectPermissions = (objectPermissions: ObjectPermissionsResponseModel) => {
                if (permissions === 'allow') {
                    if (!objectPermissions.allow.includes(action)) objectPermissions.allow.push(action);
                    if (objectPermissions.deny.includes(action))
                        objectPermissions.deny = objectPermissions.deny.filter((a) => a !== action);
                } else if (permissions === 'deny') {
                    if (!objectPermissions.deny.includes(action)) objectPermissions.deny.push(action);
                    if (objectPermissions.allow.includes(action))
                        objectPermissions.allow = objectPermissions.allow.filter((a) => a !== action);
                }
            };
            const handleNewObjectPermissions = () => {
                if (!resourcePermissions.objects) resourcePermissions.objects = [];

                resourcePermissions.objects.push({
                    uuid: objectUuid,
                    name: objectName,
                    allow: permissions === 'allow' ? [action] : [],
                    deny: permissions === 'deny' ? [action] : [],
                });
            };

            const objectPermissions = resourcePermissions.objects?.find((o) => o.uuid === objectUuid);

            if (objectPermissions) {
                handleExistingObjectPermissions(objectPermissions);
            } else {
                handleNewObjectPermissions();
            }
        },
        [],
    );
    const setOLP = useCallback(
        (resourceUuid: string, objectUuid: string, objectName: string, action: string, permissions: 'allow' | 'deny') => {
            const resource = resources?.find((r) => r.uuid === resourceUuid);
            if (!resource) return;

            const newPermissions: SubjectPermissionsModel = clonePerms();

            const resourcePermissions = newPermissions.resources.find((r) => r.name === resource.name);

            if (resourcePermissions) {
                setExistingOLP(resourcePermissions, objectUuid, objectName, action, permissions);
            } else {
                newPermissions.resources.push({
                    name: resource.name,
                    allowAllActions: false,
                    actions: [],
                    objects: [
                        {
                            uuid: objectUuid,
                            name: objectName,
                            allow: permissions === 'allow' ? [action] : [],
                            deny: permissions === 'deny' ? [action] : [],
                        },
                    ],
                });
            }

            onPermissionsChanged?.(newPermissions);
        },
        [clonePerms, onPermissionsChanged, resources, setExistingOLP],
    );

    const resourceList = useMemo(
        () =>
            resources?.map((resource) => (
                <button key={resource.uuid} data-selected={currentResource === resource} onClick={() => onResourceSelected(resource)}>
                    {resource.displayName}
                    <br />
                    <sup>{getPermissions(resource)}</sup>
                </button>
            )),
        [currentResource, getPermissions, onResourceSelected, resources],
    );

    const permissionsList = useMemo(
        () =>
            !currentResource ? (
                <></>
            ) : (
                <Widget title="Resource Action Permissions" busy={isBusy}>
                    <label htmlFor="allPermissions">
                        <input
                            id="allPermissions"
                            type="checkbox"
                            checked={permissions?.resources.find((r) => r.name === currentResource.name)?.allowAllActions || false}
                            disabled={disabled || permissions.allowAllResources}
                            onChange={(e) => allowAllActions(currentResource, e.target.checked)}
                        />
                        &nbsp;&nbsp;&nbsp;Allow All Permissions
                    </label>

                    <div>
                        {currentResource.actions.map((action) => (
                            <label key={action.uuid}>
                                <input
                                    type="checkbox"
                                    checked={
                                        permissions?.resources
                                            .find((r) => r.name === currentResource.name)
                                            ?.actions.includes(action.name) || false
                                    }
                                    disabled={
                                        disabled ||
                                        permissions?.allowAllResources ||
                                        permissions?.resources.find((r) => r.name === currentResource.name)?.allowAllActions
                                    }
                                    onChange={(e) => allowAction(currentResource, action.name, e.target.checked)}
                                />
                                &nbsp;&nbsp;&nbsp;{action.displayName}
                            </label>
                        ))}
                    </div>
                </Widget>
            ),
        [allowAction, allowAllActions, currentResource, disabled, isBusy, permissions],
    );

    const objectHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'objectName',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                align: 'left',
            },

            ...(currentResource?.actions.map(
                (action) =>
                    ({
                        id: action.name,
                        content: action.displayName,
                        sortable: false,
                        align: 'center',
                        width: '5em',
                    }) as TableHeader,
            ) || []),
        ],
        [currentResource],
    );

    const getObjectRowActions = useCallback(
        (object: ObjectPermissionsResponseModel): React.ReactNode[] =>
            currentResource?.actions.map((action) => (
                <div
                    key={`${object.uuid}_${action.name}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    // Add onKeyDown handler to satisfy typescript:S1082 SQ Quality Check.
                    onKeyDown={() => {}}
                >
                    <Checkbox
                        id={`${object.uuid}_${action.name}`}
                        checked={object.allow.includes(action.name)}
                        disabled={disabled}
                        onChange={(checked) =>
                            setOLP(currentResource.uuid, object.uuid, object.name, action.name, checked ? 'allow' : 'deny')
                        }
                    />
                </div>
            )) || [],
        [currentResource, disabled, setOLP],
    );

    const objectRows: TableDataRow[] = useMemo(
        () =>
            permissions.resources
                .find((r) => r.name === currentResource?.name)
                ?.objects?.map((object) => ({
                    id: object.uuid,
                    columns: [
                        <span key="name" style={{ whiteSpace: 'nowrap' }}>
                            {object.name}
                        </span>,
                        ...getObjectRowActions(object),
                    ],
                })) || [],

        [currentResource?.name, permissions.resources, getObjectRowActions],
    );

    const onAddClick = useCallback(() => {
        setObjectListDialog(true);
    }, []);

    const onRemoveClick = useCallback(() => {
        const newPermissions = clonePerms();

        const resourcePermissions = newPermissions.resources.find((r) => r.name === currentResource?.name);

        if (resourcePermissions) {
            resourcePermissions.objects = resourcePermissions.objects?.filter((o) => !selectedObjects.includes(o.uuid));

            onPermissionsChanged?.(newPermissions);
        }
    }, [clonePerms, currentResource?.name, onPermissionsChanged, selectedObjects]);

    const onAllowAllClick = useCallback(() => {
        const newPermissions = clonePerms();

        const resourcePermissions = newPermissions.resources.find((r) => r.name === currentResource?.name);

        if (resourcePermissions) {
            resourcePermissions.objects = resourcePermissions.objects?.map((o) => {
                if (selectedObjects.includes(o.uuid)) {
                    return {
                        ...o,
                        allow: currentResource?.actions.map((a) => a.name) || [],
                        deny: [],
                    };
                }

                return o;
            });

            onPermissionsChanged?.(newPermissions);
        }
    }, [clonePerms, currentResource?.actions, currentResource?.name, onPermissionsChanged, selectedObjects]);

    const onDenyAllClick = useCallback(() => {
        const newPermissions = clonePerms();

        const resourcePermissions = newPermissions.resources.find((r) => r.name === currentResource?.name);

        if (resourcePermissions) {
            resourcePermissions.objects = resourcePermissions.objects?.map((o) => {
                if (selectedObjects.includes(o.uuid)) {
                    return {
                        ...o,
                        allow: [],
                        deny: currentResource?.actions.map((a) => a.name) || [],
                    };
                }

                return o;
            });

            onPermissionsChanged?.(newPermissions);
        }
    }, [clonePerms, currentResource?.actions, currentResource?.name, onPermissionsChanged, selectedObjects]);

    const addSelectedObjects = useCallback(() => {
        const newPermissions = clonePerms();
        let perms = newPermissions.resources.find((r) => r.name === currentResource?.name);

        if (!perms) {
            perms = {
                name: currentResource?.name || '',
                allowAllActions: false,
                actions: [],
                objects: [],
            };

            newPermissions.resources.push(perms);
        }

        perms.objects = perms.objects || [];

        objectsToAdd.forEach((uuid) => {
            const object = objects?.find((o) => o.uuid === uuid);

            if (!object || !perms) {
                console.error('Unexpected error!');
                return;
            }

            perms.objects!.push({
                uuid: object.uuid,
                name: object.name,
                allow: perms.allowAllActions ? currentResource?.actions.map((a) => a.name) || [] : perms.actions,
                deny: [],
            });
        });

        onPermissionsChanged?.(newPermissions);
        setObjectListDialog(false);
    }, [clonePerms, currentResource, objects, objectsToAdd, onPermissionsChanged]);

    const buttons: WidgetButtonProps[] = useMemo(() => {
        return [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Add object',
                onClick: () => {
                    onAddClick();
                },
            },
            {
                icon: 'trash',
                disabled: selectedObjects.length === 0,
                tooltip: 'Remove objects',
                onClick: () => {
                    onRemoveClick();
                },
            },
            {
                icon: 'check',
                disabled: selectedObjects.length === 0,
                tooltip: 'Allow all actions',
                onClick: () => {
                    onAllowAllClick();
                },
            },
            {
                icon: 'times',
                disabled: selectedObjects.length === 0,
                tooltip: 'Deny all actions',
                onClick: () => {
                    onDenyAllClick();
                },
            },
        ];
    }, [onAddClick, onAllowAllClick, onDenyAllClick, onRemoveClick, selectedObjects.length]);

    const objectsToSelect: TableHeader[] = useMemo(
        () => [
            {
                id: 'objectName',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                align: 'left',
            },
        ],
        [],
    );

    const objectsToSelectRows: TableDataRow[] = useMemo(
        () =>
            objects
                ?.filter(
                    (o) => !permissions.resources.find((r) => r.name === currentResource?.name)?.objects?.find((oo) => oo.uuid === o.uuid),
                )
                .map((object) => ({
                    id: object.uuid,

                    columns: [<span style={{ whiteSpace: 'nowrap' }}>{object.name}</span>],
                })) || [],
        [currentResource, objects, permissions],
    );

    return (
        <>
            <label htmlFor="allResources">
                <input
                    id="allResources"
                    type="checkbox"
                    checked={permissions?.allowAllResources || false}
                    disabled={disabled}
                    onChange={(e) => {
                        if (onPermissionsChanged && permissions)
                            onPermissionsChanged({ ...permissions, allowAllResources: e.target.checked });
                    }}
                />
                &nbsp;&nbsp;&nbsp;Allow All Actions for All Resources
            </label>
            <div>
                <div>{resourceList}</div>
                <div>
                    <div>
                        {permissionsList}
                        {!currentResource?.objectAccess ? (
                            <></>
                        ) : (
                            <Widget title="Object Action Permissions" busy={isFetchingObjects} widgetButtons={buttons}>
                                <br />

                                <CustomTable
                                    hasCheckboxes={true}
                                    headers={objectHeaders}
                                    data={objectRows}
                                    onCheckedRowsChanged={(rows) => setSelectedObjects(rows as string[])}
                                />
                            </Widget>
                        )}
                    </div>

                    {resources !== undefined && <div className="flex justify-end">{submitButtonsGroup}</div>}
                </div>
            </div>
            <Dialog
                isOpen={objectListDialog}
                caption="Edit Object Level Permissions"
                body={
                    <div>
                        Select objects to add:
                        <br />
                        <br />
                        <CustomTable
                            hasCheckboxes={true}
                            headers={objectsToSelect}
                            data={objectsToSelectRows}
                            onCheckedRowsChanged={(rows) => setObjectsToAdd(rows as string[])}
                        />
                    </div>
                }
                toggle={() => setObjectListDialog(false)}
                size="lg"
                buttons={[
                    { disabled: objectsToAdd.length === 0, color: 'primary', onClick: () => addSelectedObjects(), body: 'Ok' },
                    { color: 'secondary', variant: 'outline', onClick: () => setObjectListDialog(false), body: 'Close' },
                ]}
            />
        </>
    );
}

export default RolePermissionsEditor;
