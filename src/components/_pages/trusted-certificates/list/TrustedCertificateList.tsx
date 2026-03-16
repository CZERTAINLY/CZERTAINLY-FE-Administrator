import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/trusted-certificates';
import { Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { formatTrustedCertificateDate, formatTrustedCertificateValue } from '../trustedCertificateHelpers';

export const TrustedCertificatesList = () => {
    const dispatch = useDispatch();

    const trustedCertificates = useSelector(selectors.trustedCertificates);
    const isFetching = useSelector(selectors.isFetchingList);

    const getFreshData = useCallback(() => {
        dispatch(actions.resetState());
        dispatch(actions.listTrustedCertificates());
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const trustedCertificateHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Subject DN',
                sortable: true,
                sort: 'asc',
                id: 'subject',
            },
            {
                content: 'Issuer DN',
                sortable: true,
                id: 'issuer',
            },
            {
                content: 'Valid From',
                sortable: true,
                id: 'notBefore',
            },
            {
                content: 'Expires At',
                sortable: true,
                id: 'notAfter',
            },
            {
                content: 'Serial Number',
                sortable: true,
                id: 'serialNumber',
            },
        ],
        [],
    );

    const trustedCertificatesData: TableDataRow[] = useMemo(
        () =>
            trustedCertificates.map((trustedCertificate) => ({
                id: trustedCertificate.uuid,
                columns: [
                    <Link to={`/${Resource.TrustedCertificates.toLowerCase()}/detail/${trustedCertificate.uuid}`}>
                        {formatTrustedCertificateValue(trustedCertificate.subject, true)}
                    </Link>,
                    formatTrustedCertificateValue(trustedCertificate.issuer),
                    formatTrustedCertificateDate(trustedCertificate.notBefore),
                    formatTrustedCertificateDate(trustedCertificate.notAfter),
                    formatTrustedCertificateValue(trustedCertificate.serialNumber),
                ],
            })),
        [trustedCertificates],
    );

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Settings', href: '/settings' },
                    { label: 'Trusted Certificates', href: `/${Resource.TrustedCertificates.toLowerCase()}` },
                ]}
            />
            <Container>
                <Widget
                    title="Trusted Certificates"
                    busy={isFetching}
                    widgetLockName={LockWidgetNameEnum.ListOfTrustedCertificates}
                    titleSize="large"
                    refreshAction={getFreshData}
                >
                    <CustomTable headers={trustedCertificateHeaders} data={trustedCertificatesData} hasPagination={false} />
                </Widget>
            </Container>
        </div>
    );
};
