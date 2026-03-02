import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Check, X } from 'lucide-react';

import Breadcrumb from 'components/Breadcrumb';
import Button from 'components/Button';
import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import EditIcon from 'components/icons/EditIcon';
import { InstallationInstructions } from 'components/InstallationInstructions/InstallationInstructions';
import TextInput from 'components/TextInput';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as proxiesActions, selectors as proxiesSelectors } from 'ducks/proxies';
import { getEnumLabel, selectors as enumSelectors } from 'ducks/enums';
import { PlatformEnum, Resource } from 'types/openapi';
import { ProxyStatusBadge } from '../ProxyStatusBadge';

export const ProxyDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const proxyDetails = useSelector(proxiesSelectors.proxy);
    const proxyInstructions = useSelector(proxiesSelectors.proxyInstructions);
    const isFetchingProxy = useSelector(proxiesSelectors.isFetchingDetail);
    const isFetchingInstructions = useSelector(proxiesSelectors.isFetchingInstructions);
    const isUpdatingProxy = useSelector(proxiesSelectors.isUpdating);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateDescriptionEditEnable, setUpdateDescription] = useState<boolean>(false);
    const [updatedDescription, setUpdatedDescription] = useState('');

    const isBusy = useMemo(() => isFetchingProxy || isUpdatingProxy, [isFetchingProxy, isUpdatingProxy]);

    const installationInstructions = useMemo(() => {
        if (isFetchingInstructions) {
            return 'Loading installation instructions...';
        }
        if (proxyInstructions && proxyInstructions.trim().length > 0) {
            return proxyInstructions;
        }
        return 'No installation instructions available.';
    }, [isFetchingInstructions, proxyInstructions]);

    useEffect(() => {
        if (!proxyDetails || proxyDetails.uuid !== id) return;
        setUpdatedDescription(proxyDetails.description || '');
    }, [proxyDetails, id]);

    const getFreshDetails = useCallback(() => {
        if (!id) return;
        dispatch(proxiesActions.getProxyDetail({ uuid: id }));
        dispatch(proxiesActions.getProxyInstructions({ uuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!id) return;
        dispatch(proxiesActions.deleteProxy({ uuid: id }));
        setConfirmDelete(false);
    }, [dispatch, id]);

    const onUpdateDescriptionConfirmed = useCallback(() => {
        if (!id || !updateDescriptionEditEnable) return;
        if (updatedDescription !== proxyDetails?.description) {
            dispatch(
                proxiesActions.updateProxy({
                    uuid: id,
                    proxyUpdateRequest: {
                        description: updatedDescription,
                    },
                }),
            );
        }
        setUpdateDescription(false);
    }, [dispatch, id, proxyDetails, updatedDescription, updateDescriptionEditEnable]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'trash',
                disabled: false,
                onClick: () => setConfirmDelete(true),
            },
        ],
        [],
    );

    const tableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
            {
                id: 'actions',
                content: 'Actions',
                align: 'center',
            },
        ],
        [],
    );

    const proxyDetailData: TableDataRow[] = useMemo(() => {
        if (!proxyDetails || isFetchingProxy) {
            return [];
        }
        return [
            {
                id: 'name',
                columns: ['Name', proxyDetails.name, ''],
            },
            {
                id: 'status',
                columns: ['Status', <ProxyStatusBadge status={proxyDetails.status} />, ''],
            },
            {
                id: 'description',
                columns: [
                    'Description',
                    updateDescriptionEditEnable ? (
                        <TextInput
                            onChange={(value) => setUpdatedDescription(value)}
                            value={updatedDescription}
                            placeholder="Enter Description"
                        />
                    ) : (
                        proxyDetails.description || ''
                    ),
                    <div>
                        {updateDescriptionEditEnable ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="transparent"
                                    color="secondary"
                                    title="Update Description"
                                    onClick={onUpdateDescriptionConfirmed}
                                    disabled={isUpdatingProxy || updatedDescription === proxyDetails.description}
                                >
                                    <Check size={16} />
                                </Button>
                                <Button
                                    variant="transparent"
                                    color="danger"
                                    title="Cancel"
                                    onClick={() => {
                                        setUpdateDescription(false);
                                        setUpdatedDescription(proxyDetails?.description || '');
                                    }}
                                    disabled={isUpdatingProxy}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="transparent"
                                color="secondary"
                                title="Update Description"
                                onClick={() => {
                                    setUpdateDescription(true);
                                }}
                                disabled={isUpdatingProxy}
                            >
                                <EditIcon size={16} />
                            </Button>
                        )}
                    </div>,
                ],
            },
            {
                id: 'lastActivity',
                columns: ['Last Activity', proxyDetails.lastActivity || '-', ''],
            },
            {
                id: 'code',
                columns: ['Code', proxyDetails.code, ''],
            },
        ];
    }, [
        proxyDetails,
        setUpdateDescription,
        updateDescriptionEditEnable,
        onUpdateDescriptionConfirmed,
        isUpdatingProxy,
        updatedDescription,
        isFetchingProxy,
    ]);

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Proxies)} Inventory`, href: '/proxies' },
                    { label: proxyDetails?.name || 'Proxy Details', href: '' },
                ]}
            />
            <Container>
                <Widget refreshAction={getFreshDetails} busy={isBusy} title="Proxy Details" titleSize="large" widgetButtons={buttons}>
                    <CustomTable data={proxyDetailData} headers={tableHeader} />
                </Widget>
                <InstallationInstructions title={'Installation instructions'} instructions={installationInstructions} />
            </Container>
            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Proxy`}
                body={`You are about to delete a Proxy. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </div>
    );
};
