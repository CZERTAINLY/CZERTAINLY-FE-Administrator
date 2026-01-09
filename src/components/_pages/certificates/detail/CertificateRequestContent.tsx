import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Buffer } from 'buffer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import Container from 'components/Container';
import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import ComplianceCheckResultWidget from 'components/_pages/certificates/ComplianceCheckResultWidget/ComplianceCheckResultWidget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { LockWidgetNameEnum } from 'types/user-interface';
import { createWidgetDetailHeaders } from 'utils/widget';
import { formatPEM, downloadFile } from 'utils/certificate';
import { useCopyToClipboard } from 'utils/common-hooks';
import { CertificateDetailResponseModel } from 'types/certificate';
import { PlatformEnum, Resource } from 'types/openapi';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import Asn1Dialog from '../Asn1Dialog/Asn1Dialog';
import { AttributeResponseModel } from 'types/attributes';
import { Download, Copy } from 'lucide-react';

interface Props {
    certificate: CertificateDetailResponseModel | undefined;
    isBusy: boolean;
    getFreshCertificateDetail: () => void;
    setSelectedAttributesInfo: (attributes: AttributeResponseModel[] | null) => void;
}

export default function CertificateRequestContent({ certificate, isBusy, getFreshCertificateDetail, setSelectedAttributesInfo }: Props) {
    const copyToClipboard = useCopyToClipboard();

    const certificateRequestFormatEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateFormat));
    const certificateTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateType));

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const fileNameToDownload = certificate?.commonName + '_' + certificate?.serialNumber;

    const downloadCSRDropDown = useMemo(
        () => (
            <div className="hs-dropdown relative inline-flex">
                <button
                    id="hs-dropdown-custom-icon-trigger"
                    type="button"
                    className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    title="Download"
                >
                    <Download size={16} aria-hidden="true" />
                    <svg
                        className="hs-dropdown-open:rotate-180 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                    aria-labelledby="hs-dropdown-custom-icon-trigger"
                >
                    <div className="flex">
                        <button
                            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                            onClick={() =>
                                downloadFile(
                                    formatPEM(certificate?.certificateRequest?.content ?? '', true),
                                    fileNameToDownload + '_CSR' + '.pem',
                                )
                            }
                        >
                            PEM (.pem)
                        </button>
                        <Copy
                            className="ml-2"
                            size={16}
                            onClick={() => {
                                if (!certificate?.certificateRequest?.content) return;
                                copyToClipboard(
                                    formatPEM(certificate?.certificateRequest?.content ?? '', true),
                                    'Certificate request content was copied to clipboard',
                                    'Failed to copy certificate request content to clipboard',
                                );
                            }}
                        />
                    </div>

                    <button
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        onClick={() =>
                            downloadFile(
                                Buffer.from(certificate?.certificateRequest?.content ?? '', 'base64'),
                                fileNameToDownload + '_CSR' + '.req',
                            )
                        }
                    >
                        REQ (.req)
                    </button>
                </div>
            </div>
        ),
        [certificate, fileNameToDownload, copyToClipboard],
    );

    const buttonsCSR: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'download',
                disabled: false,
                tooltip: 'Download CSR',
                custom: downloadCSRDropDown,
                onClick: () => {},
            },
        ],
        [downloadCSRDropDown],
    );

    const csrPropertiesData: TableDataRow[] = useMemo(() => {
        return certificate?.certificateRequest
            ? ([
                  {
                      id: 'commonName',
                      columns: ['Common Name', certificate?.certificateRequest?.commonName ?? ''],
                  },
                  {
                      id: 'certificateType',
                      columns: [
                          'Certificate Type',
                          certificate?.certificateRequest?.certificateType
                              ? getEnumLabel(certificateTypeEnum, certificate?.certificateRequest?.certificateType)
                              : '',
                      ],
                  },
                  {
                      id: 'certificateRequestFormat',
                      columns: [
                          'Certificate Request Format',
                          certificate?.certificateRequest?.certificateRequestFormat
                              ? getEnumLabel(certificateRequestFormatEnum, certificate?.certificateRequest?.certificateRequestFormat)
                              : '',
                      ],
                  },
                  {
                      id: 'publicKeyAlgorithm',
                      columns: ['Public Key Algorithm', certificate?.certificateRequest?.publicKeyAlgorithm ?? ''],
                  },
                  {
                      id: 'signatureAlgorithm',
                      columns: ['Signature Algorithm', certificate?.certificateRequest?.signatureAlgorithm ?? ''],
                  },
                  certificate.hybridCertificate
                      ? {
                            id: 'altSignatureAlgorithm',
                            columns: ['Alternative Signature Algorithm', certificate?.certificateRequest?.altSignatureAlgorithm ?? ''],
                        }
                      : null,
                  {
                      id: 'subjectDn',
                      columns: ['Subject DN', certificate?.certificateRequest?.subjectDn ?? ''],
                  },
                  {
                      id: 'asn1RequestStructure',
                      columns: [
                          'ASN.1 Structure',
                          certificate?.certificateRequest?.content ? (
                              <Asn1Dialog content={certificate?.certificateRequest?.content} isCSR={true} />
                          ) : (
                              <>n/a</>
                          ),
                      ],
                  },
              ].filter((el) => el !== null) as NonNullable<TableDataRow>[])
            : [];
    }, [certificate, certificateRequestFormatEnum, certificateTypeEnum]);

    return (
        <>
            <Container className="md:grid grid-cols-2 items-start">
                <Widget
                    widgetButtons={buttonsCSR}
                    title="Properties"
                    busy={isBusy}
                    titleSize="large"
                    lockSize="large"
                    refreshAction={getFreshCertificateDetail}
                >
                    <CustomTable headers={detailHeaders} data={csrPropertiesData} />
                </Widget>
                <Container>
                    <Widget title="Request Attributes" busy={isBusy} titleSize="large">
                        <AttributeViewer
                            viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE}
                            attributes={certificate?.certificateRequest?.attributes}
                        />
                    </Widget>

                    <Widget title="Signature Attributes" titleSize="large">
                        <AttributeViewer
                            viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE}
                            attributes={certificate?.certificateRequest?.signatureAttributes}
                        />
                    </Widget>
                </Container>
            </Container>
            <Container marginTop>
                {certificate?.hybridCertificate && (
                    <Widget title="Alternative Signature Attributes" titleSize="large">
                        <br />
                        <AttributeViewer
                            viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE}
                            attributes={certificate?.certificateRequest?.altSignatureAttributes}
                        />
                    </Widget>
                )}
                <ComplianceCheckResultWidget
                    resource={Resource.CertificateRequests}
                    widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                    objectUuid={certificate?.certificateRequest?.uuid ?? ''}
                    setSelectedAttributesInfo={setSelectedAttributesInfo}
                />
            </Container>
        </>
    );
}
