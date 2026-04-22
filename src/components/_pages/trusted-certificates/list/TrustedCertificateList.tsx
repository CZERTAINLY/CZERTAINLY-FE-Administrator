import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';
import CustomTable, { type TableDataRow, type TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import CertificateUploadDialog from 'components/_pages/certificates/CertificateUploadDialog';
import type { WidgetButtonProps } from 'components/WidgetButtons';
import { actions, selectors } from 'ducks/trusted-certificates';
import { Resource } from 'types/openapi';
import { formatTrustedCertificateDate, formatTrustedCertificateValue } from 'utils/trusted-certificate';
import { LockWidgetNameEnum } from 'types/user-interface';

export const TrustedCertificatesList = () => {
    const dispatch = useDispatch();

    const trustedCertificates = useSelector(selectors.trustedCertificates);
    const isFetching = useSelector(selectors.isFetchingList);
    const isCreating = useSelector(selectors.isCreating);

    const [upload, setUpload] = useState<boolean>(false);

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
                    <Link to={`/${Resource.TrustedCertificates.toLowerCase()}/detail/${trustedCertificate.uuid}`} key="subject">
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

    const onUploadClick = useCallback(
        (data: { fileContent: string }) => {
            if (data.fileContent) {
                dispatch(
                    actions.createTrustedCertificate({
                        trustedCertificate: {
                            certificateContent: data.fileContent,
                        },
                    }),
                );
            }

            setUpload(false);
        },
        [dispatch],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'upload',
                disabled: false,
                tooltip: 'Upload Trusted Certificate',
                onClick: () => {
                    setUpload(true);
                },
                id: 'upload-trusted-certificate',
            },
        ],
        [],
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
                    busy={isFetching || isCreating}
                    widgetLockName={LockWidgetNameEnum.ListOfTrustedCertificates}
                    titleSize="large"
                    refreshAction={getFreshData}
                    widgetButtons={buttons}
                >
                    <CustomTable headers={trustedCertificateHeaders} data={trustedCertificatesData} hasPagination={false} />
                </Widget>
            </Container>

            <Dialog
                isOpen={upload}
                caption="Upload Trusted Certificate"
                body={
                    <CertificateUploadDialog
                        onCancel={() => setUpload(false)}
                        onUpload={(data) => onUploadClick(data)}
                        showCustomAttributes={false}
                    />
                }
                toggle={() => setUpload(false)}
                buttons={[]}
                size="xl"
                icon="upload"
            />
        </div>
    );
};
