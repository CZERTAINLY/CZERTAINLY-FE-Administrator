import { TableDataRow, TableHeader } from "components/CustomTable";

import Widget from "components/Widget";

import { actions, selectors } from "ducks/discoveries";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

import { dateFormatter } from "utils/dateUtil";
import PagedCustomTable from "../../../CustomTable/PagedCustomTable";

interface Props {
    id: string;
}

enum NEWLY_DISCOVERED {
    ALL = "All",
    NEW = "New",
    EXISTING = "Existing"
}

export default function DiscoveryCertificates({id}: Props) {
    const dispatch = useDispatch();

    const discoveryCertificates = useSelector(selectors.discoveryCertificates);
    const isFetchingDiscoveryCertificates = useSelector(selectors.isFetchingDiscoveryCertificates);

    const [newlyDiscovered, setNewlyDiscovered] = useState<boolean | undefined>(undefined);

    const onReloadData = useCallback((pageSize: number, pageNumber: number) => {
        dispatch(actions.getDiscoveryCertificates({uuid: id, itemsPerPage: pageSize, pageNumber: pageNumber, newlyDiscovered: newlyDiscovered}));
    }, [dispatch, id, newlyDiscovered]);

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
        () => discoveryCertificates?.certificates.map(r => (
                {
                    id: r.serialNumber + r.fingerprint,
                    columns: [
                        r.inventoryUuid ? <Link to={`../../certificates/detail/${r.inventoryUuid}`}>{r.commonName}</Link> : r.commonName,
                        r.serialNumber,
                        <span style={{whiteSpace: "nowrap"}}>{dateFormatter(r.notAfter)}</span>,
                        <span style={{whiteSpace: "nowrap"}}>{dateFormatter(r.notBefore)}</span>,
                        r.issuerCommonName,
                        r.fingerprint,
                    ],
                }
            ),
        ) ?? [],
        [discoveryCertificates],
    );

    return (
        <Widget title={discoveryCertificatesTitle} busy={isFetchingDiscoveryCertificates}>

            <br/>

            <FormGroup>
                <Label for="newlyDiscovered">Newly discovered</Label>
                <Row>
                    <Col xs="6" sm="6" md="5" lg="4" xl="3">
                        <Input
                            type="select"
                            id="newlyDiscovered"
                            value={newlyDiscovered === undefined ? NEWLY_DISCOVERED.ALL : newlyDiscovered ? NEWLY_DISCOVERED.NEW : NEWLY_DISCOVERED.EXISTING}
                            onChange={(e) => setNewlyDiscovered(e.target.value === NEWLY_DISCOVERED.ALL ? undefined : e.target.value === NEWLY_DISCOVERED.NEW)}
                        >
                            <option key={NEWLY_DISCOVERED.ALL} value={NEWLY_DISCOVERED.ALL}>{NEWLY_DISCOVERED.ALL}</option>
                            <option key={NEWLY_DISCOVERED.NEW} value={NEWLY_DISCOVERED.NEW}>{NEWLY_DISCOVERED.NEW}</option>
                            <option key={NEWLY_DISCOVERED.EXISTING} value={NEWLY_DISCOVERED.EXISTING}>{NEWLY_DISCOVERED.EXISTING}</option>
                        </Input>
                    </Col>
                </Row>
            </FormGroup>

            <PagedCustomTable
                headers={discoveryCertificatesHeaders}
                data={discoveryCertificatesData}
                totalItems={discoveryCertificates?.totalItems}
                onReloadData={onReloadData}
            />

        </Widget>
    );
}
