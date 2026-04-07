import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import Container from 'components/Container';
import Dialog from 'components/Dialog';
import ForceDeleteErrorTable from 'components/ForceDeleteErrorTable';
import StatusBadge from 'components/StatusBadge';
import PagedList from 'components/PagedList/PagedList';
import { TableDataRow, TableHeader } from 'components/CustomTable';

import { actions, selectors } from 'ducks/signing-profiles';
import { selectors as pagingSelectors } from 'ducks/paging';
import { EntityType } from 'ducks/filters';
import { Resource, SigningWorkflowType } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { SearchRequestModel } from 'types/certificate';

const workflowTypeLabels: Record<SigningWorkflowType, string> = {
    [SigningWorkflowType.Timestamping]: 'Timestamping',
    [SigningWorkflowType.DocumentSigning]: 'Document Signing',
    [SigningWorkflowType.CodeBinarySigning]: 'Code & Binary Signing',
    [SigningWorkflowType.RawSigning]: 'Raw Signing',
};

export default function SigningProfilesList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.SIGNING_PROFILE));
    const signingProfiles = useSelector(selectors.signingProfiles);
    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isBulkEnabling = useSelector(selectors.isBulkEnabling);
    const isBulkDisabling = useSelector(selectors.isBulkDisabling);

    const isBusy = isBulkDeleting || isBulkEnabling || isBulkDisabling;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [showDeleteErrors, setShowDeleteErrors] = useState<boolean>(false);

    useEffect(() => {
        if (bulkDeleteErrorMessages.length > 0) {
            setShowDeleteErrors(true);
        }
    }, [bulkDeleteErrorMessages]);

    const onListCallback = useCallback(
        (filters: SearchRequestModel) => {
            dispatch(actions.listSigningProfiles(filters));
        },
        [dispatch],
    );

    const onEnableClick = useCallback(() => {
        dispatch(actions.bulkEnableSigningProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        dispatch(actions.bulkDisableSigningProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteSigningProfiles({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const onCloseDeleteErrors = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        setShowDeleteErrors(false);
    }, [dispatch]);

    const tableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: '25%',
            },
            {
                id: 'description',
                content: 'Description',
                sortable: false,
                width: '35%',
            },
            {
                id: 'workflowType',
                content: 'Workflow Type',
                align: 'center',
                sortable: true,
                width: '20%',
            },
            {
                id: 'version',
                content: 'Version',
                align: 'center',
                sortable: true,
                width: '10%',
            },
            {
                id: 'status',
                content: 'Status',
                align: 'center',
                sortable: true,
                width: '10%',
            },
        ],
        [],
    );

    const tableData: TableDataRow[] = useMemo(
        () =>
            signingProfiles.map((profile) => ({
                id: profile.uuid,
                columns: [
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${profile.uuid}`}>{profile.name}</Link>
                    </span>,
                    <span>{profile.description || ''}</span>,
                    <span>{workflowTypeLabels[profile.signingWorkflowType] ?? profile.signingWorkflowType}</span>,
                    <span>{profile.version}</span>,
                    <StatusBadge enabled={profile.enabled} />,
                ],
            })),
        [signingProfiles],
    );

    return (
        <Container>
            <PagedList
                entity={EntityType.SIGNING_PROFILE}
                title="List of Signing Profiles"
                headers={tableHeader}
                data={tableData}
                isBusy={isBusy}
                onListCallback={onListCallback}
                pageWidgetLockName={LockWidgetNameEnum.ListOfSigningProfiles}
                onDeleteCallback={(uuids) => {
                    dispatch(actions.bulkDeleteSigningProfiles({ uuids }));
                }}
                additionalButtons={[
                    {
                        icon: 'check',
                        disabled: checkedRows.length === 0,
                        tooltip: 'Enable',
                        onClick: onEnableClick,
                    },
                    {
                        icon: 'times',
                        disabled: checkedRows.length === 0,
                        tooltip: 'Disable',
                        onClick: onDisableClick,
                    },
                ]}
                entityNameSingular="a Signing Profile"
                entityNamePlural="Signing Profiles"
                hasCheckboxes
            />

            <Dialog
                isOpen={showDeleteErrors}
                caption="Delete Signing Profiles"
                body={
                    <ForceDeleteErrorTable
                        items={bulkDeleteErrorMessages}
                        entityNameSingular="a Signing Profile"
                        entityNamePlural="Signing Profiles"
                        itemsCount={checkedRows.length}
                    />
                }
                toggle={onCloseDeleteErrors}
                buttons={[{ color: 'secondary', variant: 'outline', onClick: onCloseDeleteErrors, body: 'Close' }]}
            />
        </Container>
    );
}
