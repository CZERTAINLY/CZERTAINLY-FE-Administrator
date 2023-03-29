import { TableDataRow, TableHeader } from "components/CustomTable";

import Widget from "components/Widget";

import { actions, selectors } from "ducks/discoveries";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { dateFormatter } from "utils/dateUtil";
import PagedCustomTable from "../../../CustomTable/PagedCustomTable";
import TabLayout from "../../../Layout/TabLayout";

interface Props {
    id: string;
}

export default function DiscoveryCertificates({ id }: Props) {
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

    const discoveryCertificatesTitle = (
        <h5>
            <span className="fw-semi-bold">Discovered Certificates</span>
        </h5>
    );

    const discoveryCertificatesHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "commonName",
                content: "Common Name",
            },
            {
                id: "serialNumber",
                content: "Serial Number",
            },
            {
                id: "notAfter",
                content: "Not After",
            },
            {
                id: "notBefore",
                content: "Not Before",
            },
            {
                id: "issuerCommonName",
                content: "Issuer Common Name",
            },
            {
                id: "fingerprint",
                content: "Fingerprint",
            },
        ],
        [],
    );

    const discoveryCertificatesData: TableDataRow[] = useMemo(
        () =>
            discoveryCertificates?.certificates.map((r) => ({
                id: r.serialNumber + r.fingerprint,
                columns: [
                    r.inventoryUuid ? <Link to={`../../certificates/detail/${r.inventoryUuid}`}>{r.commonName}</Link> : r.commonName,
                    r.serialNumber,
                    <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(r.notAfter)}</span>,
                    <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(r.notBefore)}</span>,
                    r.issuerCommonName,
                    r.fingerprint,
                ],
            })) ?? [],
        [discoveryCertificates],
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
        <Widget title={discoveryCertificatesTitle} busy={isFetchingDiscoveryCertificates}>
            <br />

            <TabLayout
                tabs={[
                    { title: "All", onClick: () => setNewlyDiscovered(undefined), content: pagedTable },
                    { title: "New", onClick: () => setNewlyDiscovered(true), content: pagedTable },
                    { title: "Existing", onClick: () => setNewlyDiscovered(false), content: pagedTable },
                ]}
                onlyActiveTabContent={true}
            />
        </Widget>
    );
}
