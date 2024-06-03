import { TableDataRow, TableHeader } from 'components/CustomTable';

import Widget from 'components/Widget';

import { actions, selectors } from 'ducks/discoveries';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { TriggerHistorySummaryModel } from 'types/rules';
import { dateFormatter } from 'utils/dateUtil';
import PagedCustomTable from '../../../CustomTable/PagedCustomTable';
import TabLayout from '../../../Layout/TabLayout';
import TriggerHistorySummaryViewer from './TriggerHistorySummaryViewer';
import styles from './discoveryCertificates.module.scss';
interface Props {
    id: string;
    triggerHistorySummary?: TriggerHistorySummaryModel;
}

export default function DiscoveryCertificates({ id, triggerHistorySummary }: Props) {
    const dispatch = useDispatch();

    const discoveryCertificates = useSelector(selectors.discoveryCertificates);
    const isFetchingDiscoveryCertificates = useSelector(selectors.isFetchingDiscoveryCertificates);

    const [newlyDiscovered, setNewlyDiscovered] = useState<boolean | undefined>(undefined);

    const onReloadData = useCallback(
        (pageSize: number, pageNumber: number) => {
            dispatch(
                actions.getDiscoveryCertificates({
                    uuid: id,
                    itemsPerPage: pageSize,
                    pageNumber: pageNumber,
                    newlyDiscovered: newlyDiscovered,
                }),
            );
        },
        [dispatch, id, newlyDiscovered],
    );

    const discoveryCertificatesHeaders: TableHeader[] = useMemo(() => {
        const discoveryHeaders = [
            {
                id: 'commonName',
                content: 'Common Name',
            },
            {
                id: 'serialNumber',
                content: 'Serial Number',
            },
            {
                id: 'notAfter',
                content: 'Not After',
            },
            {
                id: 'notBefore',
                content: 'Not Before',
            },
            {
                id: 'issuerCommonName',
                content: 'Issuer Common Name',
            },
            {
                id: 'fingerprint',
                content: 'Fingerprint',
            },
        ];

        if (newlyDiscovered === true) {
            discoveryHeaders.push({
                id: 'triggers',
                content: 'Triggers',
            });
        }

        return discoveryHeaders;
    }, [newlyDiscovered]);

    const discoveryCertificatesData: TableDataRow[] = useMemo(
        () =>
            discoveryCertificates?.certificates.map((r) => {
                const certificateColumns = [
                    r.inventoryUuid ? <Link to={`../../certificates/detail/${r.inventoryUuid}`}>{r.commonName}</Link> : r.commonName,
                    <span className={styles.wordWrap}>{r.serialNumber}</span>,
                    <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(r.notAfter)}</span>,
                    <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(r.notBefore)}</span>,
                    r.issuerCommonName,
                    <span className={styles.wordWrap}>{r.fingerprint}</span>,
                ];

                if (newlyDiscovered === true) {
                    const triggerHistoryObjectSummary = triggerHistorySummary?.objects?.find(
                        (summary) => summary.referenceObjectUuid === r.uuid,
                    );
                    certificateColumns.push(
                        triggerHistoryObjectSummary ? (
                            <TriggerHistorySummaryViewer triggerHistoryObjectSummary={triggerHistoryObjectSummary} />
                        ) : (
                            ''
                        ),
                    );
                }
                return {
                    id: r.serialNumber + r.fingerprint,
                    columns: certificateColumns,
                };
            }) ?? [],
        [discoveryCertificates, triggerHistorySummary?.objects, newlyDiscovered],
    );

    const pagedTable = (
        <PagedCustomTable
            headers={discoveryCertificatesHeaders}
            data={discoveryCertificatesData}
            totalItems={discoveryCertificates?.totalItems}
            onReloadData={onReloadData}
        />
    );

    return (
        <Widget title="Discovered Certificates" busy={isFetchingDiscoveryCertificates}>
            <br />

            <TabLayout
                tabs={[
                    { title: 'All', onClick: () => setNewlyDiscovered(undefined), content: pagedTable },
                    { title: 'New', onClick: () => setNewlyDiscovered(true), content: pagedTable },
                    { title: 'Existing', onClick: () => setNewlyDiscovered(false), content: pagedTable },
                ]}
                onlyActiveTabContent={true}
            />
        </Widget>
    );
}
