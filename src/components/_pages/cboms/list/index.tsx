import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { firstValueFrom } from 'rxjs';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';
import Dialog from 'components/Dialog';
import { useCopyToClipboard, useRunOnFinished } from 'utils/common-hooks';
import CbomUploadDialog from '../CbomUploadDialog';
import { actions as alertActions } from 'ducks/alerts';
import { actions, selectors } from 'ducks/cbom';
import PagedList from 'components/PagedList/PagedList';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import { LockWidgetNameEnum } from 'types/user-interface';
import { SearchRequestModel } from 'types/certificate';
import { ApiClients, backendClient } from '../../../../api';
import { EntityType } from 'ducks/filters';
import { CbomDetailDto } from 'types/openapi';

function CbomsList() {
    const dispatch = useDispatch();

    const cboms = useSelector(selectors.selectCbomList);
    const isFetching = useSelector(selectors.selectIsFetchingList);

    const headers: TableHeader[] = useMemo(
        () => [
            { content: 'Serial number', sortable: true, id: 'serial' },
            { content: 'Ver.', sortable: true, id: 'version', align: 'center' },
            { content: 'Alg.', sortable: true, id: 'algorithm', align: 'center' },
            { content: 'Certs', sortable: true, id: 'certificates', align: 'center' },
            { content: 'Proto.', sortable: true, id: 'protocol', align: 'center' },
            { content: 'Material', sortable: true, id: 'material', align: 'center' },
            { content: 'Assets', sortable: true, id: 'assets', align: 'center' },
            { content: 'Action', sortable: false, id: 'action', align: 'center' },
        ],
        [],
    );

    const copyToClipboard = useCopyToClipboard();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const additionalButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'upload',
                disabled: false,
                tooltip: 'Upload CBOM',
                onClick: () => setIsUploadOpen(true),
            },
        ],
        [],
    );

    const getCbomJson = useCallback(async (uuid: string): Promise<string> => {
        const cbomDetail = (await firstValueFrom(backendClient.cbomManagement.getCbomDetail({ uuid }))) as CbomDetailDto;
        return JSON.stringify(cbomDetail.content ?? {}, null, 2);
    }, []);

    const handleCopyCbomJson = useCallback(
        async (uuid: string) => {
            try {
                const json = await getCbomJson(uuid);
                copyToClipboard(json, 'CBOM JSON copied', 'Failed to copy CBOM JSON');
            } catch {
                dispatch(alertActions.error('Failed to copy CBOM JSON'));
            }
        },
        [copyToClipboard, dispatch, getCbomJson],
    );

    const handleDownloadCbomJson = useCallback(
        async (uuid: string, serialNumber: string, version: number) => {
            try {
                const json = await getCbomJson(uuid);
                const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `cbom-${serialNumber}-v${version}.json`;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                URL.revokeObjectURL(url);
            } catch {
                dispatch(alertActions.error('Failed to download CBOM JSON'));
            }
        },
        [dispatch, getCbomJson],
    );

    const rows: TableDataRow[] = useMemo(
        () =>
            cboms.map((c) => ({
                id: c.uuid,
                columns: [
                    <Link key="serial" to={`./detail/${c.uuid}`}>
                        {c.serialNumber}
                    </Link>,
                    c.version,
                    c.algorithms,
                    c.certificates,
                    c.protocols,
                    c.cryptoMaterial,
                    c.totalAssets,
                    <WidgetButtons
                        key={`actions-${c.uuid}`}
                        buttons={
                            [
                                {
                                    icon: 'copy',
                                    disabled: false,
                                    tooltip: 'Copy JSON',
                                    onClick: (e) => {
                                        e.stopPropagation();
                                        void handleCopyCbomJson(c.uuid);
                                    },
                                },
                                {
                                    icon: 'download',
                                    disabled: false,
                                    tooltip: 'Download JSON',
                                    onClick: (e) => {
                                        e.stopPropagation();
                                        void handleDownloadCbomJson(c.uuid, c.serialNumber, c.version);
                                    },
                                },
                            ] as WidgetButtonProps[]
                        }
                    />,
                ],
            })),
        [cboms, handleCopyCbomJson, handleDownloadCbomJson],
    );

    const onList = useCallback((filters: SearchRequestModel) => dispatch(actions.listCboms(filters)), [dispatch]);

    const isUploading = useSelector(selectors.selectIsUploading);

    useRunOnFinished(isUploading, () => {
        setIsUploadOpen(false);
        onList({ itemsPerPage: 10, pageNumber: 1, filters: [] });
    });

    return (
        <>
            <PagedList
                entity={EntityType.CBOM}
                onListCallback={onList}
                getAvailableFiltersApi={useCallback(
                    (apiClients: ApiClients) => apiClients.cbomManagement.getSearchableFieldInformation5(),
                    [],
                )}
                filterTitle="CBOMs Filter"
                headers={headers}
                data={rows}
                isBusy={isFetching}
                title="CBOMs"
                addHidden
                additionalButtons={additionalButtons}
                pageWidgetLockName={LockWidgetNameEnum.ListOfCboms}
            />

            <Dialog
                isOpen={isUploadOpen}
                caption="Upload CBOM"
                body={
                    <CbomUploadDialog
                        onCancel={() => setIsUploadOpen(false)}
                        onUpload={(data) => dispatch(actions.uploadCbom({ content: data.content }))}
                    />
                }
                toggle={() => setIsUploadOpen(false)}
                buttons={[]}
                size="xl"
                icon="upload"
            />
        </>
    );
}

export default CbomsList;
