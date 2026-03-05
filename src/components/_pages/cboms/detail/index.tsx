import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Button from 'components/Button';
import { Copy, Download } from 'lucide-react';
import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import JsonViewer from 'components/JsonViewer';
import Select from 'components/Select';
import DonutChart from 'components/_pages/dashboard/DashboardItem/DonutChart';
import Spinner from 'components/Spinner';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import { EntityType } from 'ducks/filters';
import { actions, selectors } from 'ducks/cbom';
import { actions as alertActions } from 'ducks/alerts';
import { DashboardDict } from 'types/statisticsDashboard';
import { dateFormatter } from 'utils/dateUtil';
import { getDonutChartColorsByRandomNumberOfOptions } from 'utils/dashboard';

type CbomComponent = {
    name?: string;
    bomRef?: string;
    'bom-ref'?: string;
    type?: string;
    version?: string;
    evidence?: {
        occurrences?: {
            location?: string;
            [key: string]: unknown;
        }[];
    };
    cryptoProperties?: {
        assetType?: string;
        algorithmProperties?: {
            cryptoFunctions?: string[] | string;
            primitive?: string[] | string;
        };
        relatedCryptoMaterialProperties?: {
            type?: string;
        };
    };
};

type GenericObject = Record<string, unknown>;

type LocationModalState = {
    asset: string;
    location: string;
    rawJson: string;
};

const VERSION_HISTORY_OPTION_VALUE = '__CBOM_VIEW_VERSION_HISTORY__';

const toArray = <T,>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

const ASSET_TYPE_LABELS: Record<string, string> = {
    algorithm: 'Algorithm',
    certificate: 'Certificate',
    'related-crypto-material': 'Related Crypto Material',
};

const PRIMITIVE_LABELS: Record<string, string> = {
    signature: 'Signature',
    hash: 'Hash',
    mac: 'MAC',
    'stream-cipher': 'Stream Cipher',
    'block-cipher': 'Block Cipher',
    'key-agreement': 'Key Agreement',
    'key-derivation': 'Key Derivation',
    'public-key-encryption': 'Public-key Encryption',
};

const toDisplayName = (value?: string, labels?: Record<string, string>): string => {
    if (!value) return '-';
    const normalized = value.trim().toLowerCase();
    if (labels?.[normalized]) return labels[normalized];

    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const toChartRows = (map: Map<string, number>): TableDataRow[] =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ id: `${name}-${count}`, columns: [name, count] }));

const toDashboardDict = (rows: TableDataRow[]): DashboardDict =>
    rows.reduce<DashboardDict>((acc, row) => {
        const [label, value] = row.columns;
        const key = String(label ?? 'Unknown');
        const count = Number(value ?? 0);
        acc[key] = Number.isFinite(count) ? count : 0;
        return acc;
    }, {});

const isRecord = (value: unknown): value is GenericObject => typeof value === 'object' && value !== null;

const getPathValue = (source: unknown, path: string): unknown => {
    if (!isRecord(source)) return undefined;

    const normalizedPath = path.replace(/^\//, '');

    if (path in source) return source[path];
    if (`/${normalizedPath}` in source) return source[`/${normalizedPath}`];
    if (normalizedPath in source) return source[normalizedPath];

    return normalizedPath.split('/').reduce<unknown>((acc, segment) => {
        if (!segment || !isRecord(acc)) return undefined;
        return acc[segment];
    }, source);
};

const getMetadataPropertyValue = (source: unknown, propertyName: string): unknown => {
    const properties = getPathValue(source, 'properties');
    if (!Array.isArray(properties)) return undefined;

    const property = properties.find((item) => isRecord(item) && item.name === propertyName);
    if (!isRecord(property)) return undefined;

    return property.value;
};

const toCellValue = (value: unknown): string | number => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
};

type HandleLocationClick = (assetName: string, location: string, locationData: unknown) => void;

const buildComponentRows = (
    components: CbomComponent[],
    handleLocationClick: HandleLocationClick,
    view: 'assets' | 'overview',
): TableDataRow[] =>
    components.map((c, i: number) => {
        const assetName = c?.name ?? c?.['bom-ref'] ?? '-';
        const occurrences = toArray(c?.evidence?.occurrences);

        const locationsColumn =
            occurrences.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {occurrences.map((occurrence, index) => {
                        const location = occurrence?.location || '-';
                        const key = `${String(assetName)}-${location}-${index}`;

                        return (
                            <Button
                                key={key}
                                variant="transparent"
                                color="secondary"
                                type="button"
                                className="!p-0 !border-0 !inline text-blue-600 hover:!bg-transparent hover:underline focus:!bg-transparent w-fit"
                                onClick={() => handleLocationClick(String(assetName), location, occurrence)}
                            >
                                {location}
                            </Button>
                        );
                    })}
                </div>
            ) : (
                '-'
            );

        const assetType = toDisplayName(c?.cryptoProperties?.assetType ?? c?.type, ASSET_TYPE_LABELS);
        const primitive =
            toArray(c?.cryptoProperties?.algorithmProperties?.primitive)
                .map((p) => toDisplayName(p, PRIMITIVE_LABELS))
                .join(', ') || '-';

        return {
            id: c?.bomRef ?? c?.['bom-ref'] ?? (view === 'overview' ? `overview-${i}` : i),
            columns:
                view === 'overview'
                    ? [assetName, assetType, primitive, locationsColumn]
                    : [assetName, locationsColumn, assetType, primitive],
        };
    });

export default function CbomDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id = '' } = useParams();

    const detail = useSelector(selectors.selectCbomDetail);
    const cbomVersions = useSelector(selectors.selectCbomVersions);
    const isFetching = useSelector(selectors.selectIsFetchingDetail);
    const isFetchingVersions = useSelector(selectors.selectIsFetchingVersions);
    const [locationModalData, setLocationModalData] = useState<LocationModalState>();
    const [selectedVersionUuid, setSelectedVersionUuid] = useState(id);

    const getFreshCbomDetail = useCallback(() => {
        if (!selectedVersionUuid || selectedVersionUuid === VERSION_HISTORY_OPTION_VALUE) return;
        dispatch(actions.clearCbomDetail());
        dispatch(actions.getCbomDetail({ uuid: selectedVersionUuid }));
    }, [dispatch, selectedVersionUuid]);

    useEffect(() => {
        setSelectedVersionUuid(id);
    }, [id]);

    useEffect(() => {
        getFreshCbomDetail();
    }, [getFreshCbomDetail]);

    useEffect(() => {
        if (!id) return;
        dispatch(actions.listCbomVersions({ uuid: id }));
    }, [dispatch, id]);

    const components = useMemo(() => {
        const content = detail?.content;
        if (!content) return [] as CbomComponent[];

        const contentComponents = content.components;
        if (Array.isArray(contentComponents)) return contentComponents as CbomComponent[];

        return [] as CbomComponent[];
    }, [detail]);

    const rawJsonText = useMemo(() => JSON.stringify(detail?.content ?? {}, null, 2), [detail]);

    const handleCopyRawJson = useCallback(() => {
        void navigator.clipboard.writeText(rawJsonText);
    }, [rawJsonText]);

    const handleDownloadRawJson = useCallback(() => {
        const blob = new Blob([rawJsonText], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `cbom-${detail?.serialNumber ?? id}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }, [rawJsonText, detail, id]);

    const assetsByCategoryRows: TableDataRow[] = useMemo(() => {
        if (!detail) return [];

        return [
            { id: 'algorithms', columns: ['Algorithms', detail.algorithms ?? 0] },
            { id: 'certificates', columns: ['Certificates', detail.certificates ?? 0] },
            { id: 'protocols', columns: ['Protocols', detail.protocols ?? 0] },
            { id: 'cryptoMaterial', columns: ['Related Crypto Material', detail.cryptoMaterial ?? 0] },
            { id: 'totalAssets', columns: ['Total Assets', detail.totalAssets ?? 0] },
        ];
    }, [detail]);

    const algorithmsByNameRows = useMemo(() => {
        const map = new Map<string, number>();
        for (const c of components) {
            if (c?.cryptoProperties?.assetType === 'algorithm') {
                map.set(c?.name ?? 'Unknown', (map.get(c?.name ?? 'Unknown') ?? 0) + 1);
            }
        }
        return toChartRows(map);
    }, [components]);

    const cryptoFunctionsRows = useMemo(() => {
        const map = new Map<string, number>();
        for (const c of components) {
            const vals = toArray<string>(c?.cryptoProperties?.algorithmProperties?.cryptoFunctions);
            for (const v of vals) map.set(v, (map.get(v) ?? 0) + 1);
        }
        return toChartRows(map);
    }, [components]);

    const cryptoPrimitivesRows = useMemo(() => {
        const map = new Map<string, number>();
        for (const c of components) {
            const vals = toArray<string>(c?.cryptoProperties?.algorithmProperties?.primitive);
            for (const v of vals) map.set(v, (map.get(v) ?? 0) + 1);
        }
        return toChartRows(map);
    }, [components]);

    const relatedMaterialTypesRows = useMemo(() => {
        const map = new Map<string, number>();
        for (const c of components) {
            if (c?.cryptoProperties?.assetType !== 'related-crypto-material') continue;
            const type = c?.cryptoProperties?.relatedCryptoMaterialProperties?.type ?? 'Unknown';
            map.set(type, (map.get(type) ?? 0) + 1);
        }
        return toChartRows(map);
    }, [components]);

    const assetsByCategoryChartData = useMemo(() => toDashboardDict(assetsByCategoryRows), [assetsByCategoryRows]);
    const algorithmsByNameChartData = useMemo(() => toDashboardDict(algorithmsByNameRows), [algorithmsByNameRows]);
    const cryptoFunctionsChartData = useMemo(() => toDashboardDict(cryptoFunctionsRows), [cryptoFunctionsRows]);
    const cryptoPrimitivesChartData = useMemo(() => toDashboardDict(cryptoPrimitivesRows), [cryptoPrimitivesRows]);
    const relatedMaterialTypesChartData = useMemo(() => toDashboardDict(relatedMaterialTypesRows), [relatedMaterialTypesRows]);

    const metadata = useMemo(() => {
        const content = detail?.content;
        if (!isRecord(content)) return undefined;
        return isRecord(content.metadata) ? content.metadata : undefined;
    }, [detail]);

    const keyValueHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'attribute', content: 'ATTRIBUTE' },
            { id: 'value', content: 'VALUE' },
        ],
        [],
    );

    const basicDetailsRows: TableDataRow[] = useMemo(
        () => [
            { id: 'serial-number', columns: ['Serial Number', toCellValue(detail?.serialNumber)] },
            { id: 'version', columns: ['Version', toCellValue(detail?.version)] },
            { id: 'spec-version', columns: ['Spec version', toCellValue(detail?.specVersion)] },
            { id: 'source', columns: ['Source', toCellValue(detail?.source)] },
            { id: 'total-assets', columns: ['Total assets', toCellValue(detail?.totalAssets)] },
        ],
        [detail],
    );

    const metadataSummaryRows: TableDataRow[] = useMemo(
        () => [
            {
                id: 'timestamp',
                columns: ['Timestamp', toCellValue(detail?.timestamp ?? getPathValue(metadata, 'timestamp'))],
            },
            {
                id: 'type',
                columns: [
                    'Type',
                    toCellValue(
                        getPathValue(metadata, 'component/type') ?? getPathValue(metadata, 'type') ?? getPathValue(detail?.content, 'type'),
                    ),
                ],
            },
            {
                id: 'manufacturer',
                columns: [
                    'Manufacturer',
                    toCellValue(
                        getPathValue(metadata, 'component/manufacturer/name') ??
                            getPathValue(metadata, 'manufacturer/name') ??
                            getPathValue(metadata, 'manufacturer'),
                    ),
                ],
            },
            {
                id: 'cbom-lens-files-total',
                columns: ['/cbom-lens/files/total', toCellValue(getMetadataPropertyValue(metadata, '/cbom-lens/files/total'))],
            },
            {
                id: 'cbom-lens-ports-total',
                columns: ['/cbom-lens/ports/total', toCellValue(getMetadataPropertyValue(metadata, '/cbom-lens/ports/total'))],
            },
            {
                id: 'cbom-lens-containers-total',
                columns: ['/cbom-lens/containers/total', toCellValue(getMetadataPropertyValue(metadata, '/cbom-lens/containers/total'))],
            },
        ],
        [detail, metadata],
    );

    const componentHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'assets', content: 'Crypto asset' },
            { id: 'location', content: 'Location' },
            { id: 'type', content: 'Asset Type' },
            { id: 'primitive', content: 'Primitive' },
        ],
        [],
    );

    const overviewComponentHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'assets', content: 'Crypto asset' },
            { id: 'type', content: 'Asset Type' },
            { id: 'primitive', content: 'Primitive' },
            { id: 'location', content: 'Location' },
        ],
        [],
    );

    const handleLocationClick = useCallback((assetName: string, location: string, locationData: unknown) => {
        setLocationModalData({
            asset: assetName,
            location,
            rawJson: JSON.stringify(locationData ?? { location }, null, 2),
        });
    }, []);

    const componentRows: TableDataRow[] = useMemo(
        () => buildComponentRows(components, handleLocationClick, 'assets'),
        [components, handleLocationClick],
    );

    const handleCloseLocationModal = useCallback(() => {
        setLocationModalData(undefined);
    }, []);

    const handleCopyLocationExcerpt = useCallback(() => {
        const textToCopy = locationModalData?.rawJson ?? '';
        void navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                dispatch(alertActions.success('Excerpt copied to clipboard.'));
            })
            .catch(() => {
                dispatch(alertActions.error('Failed to copy excerpt to clipboard.'));
            });
    }, [locationModalData, dispatch]);

    const versionSelectOptions = useMemo(() => {
        const latestVersionNumber = cbomVersions.length ? Math.max(...cbomVersions.map((version) => version.version)) : undefined;
        const originalVersionNumber = cbomVersions.length ? Math.min(...cbomVersions.map((version) => version.version)) : undefined;

        const versionOptions = [...cbomVersions]
            .sort((a, b) => b.version - a.version)
            .map((version) => {
                const suffix =
                    version.version === latestVersionNumber ? ' (Latest)' : version.version === originalVersionNumber ? ' (Original)' : '';

                return {
                    value: version.uuid,
                    label: `Version ${version.version}${suffix}`,
                    description: dateFormatter(version.timestamp || version.createdAt),
                };
            });

        return [
            ...versionOptions,
            {
                value: VERSION_HISTORY_OPTION_VALUE,
                label: 'View Version History',
                description: `${cbomVersions.length} versions`,
            },
        ];
    }, [cbomVersions]);

    const handleVersionSelect = useCallback(
        (value: string | number | object | { value: string | number | object; label: string }) => {
            const selectedValue =
                typeof value === 'string' || typeof value === 'number'
                    ? String(value)
                    : typeof value === 'object' && value !== null && 'value' in value
                      ? String(value.value)
                      : '';

            if (!selectedValue || !id) return;

            if (selectedValue === VERSION_HISTORY_OPTION_VALUE) {
                navigate(`/cboms/detail/${id}/versions`);
                return;
            }

            setSelectedVersionUuid(selectedValue);
        },
        [navigate, id],
    );

    const overviewComponentRows: TableDataRow[] = useMemo(
        () => buildComponentRows(components, handleLocationClick, 'overview'),
        [components, handleLocationClick],
    );

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'CBOM Inventory', href: '/cboms' },
                    { label: detail ? `${detail.serialNumber} / ${detail.version}` : 'CBOM Detail', href: '' },
                ]}
                rightContent={
                    <div className="w-full md:w-72">
                        <Select
                            id="cbom-version-history-select"
                            placeholder="Select version"
                            value={selectedVersionUuid}
                            onChange={handleVersionSelect}
                            options={versionSelectOptions}
                            disabled={isFetchingVersions || versionSelectOptions.length === 0}
                            colorizeVersionLabel
                            showOptionDescriptionInDropdown
                        />
                    </div>
                }
            />

            <Spinner active={isFetching} />

            <TabLayout
                tabs={[
                    {
                        title: 'Overview',
                        content: (
                            <Container>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
                                    <Widget title="Basic details" titleSize="large">
                                        <CustomTable headers={keyValueHeaders} data={basicDetailsRows} />
                                    </Widget>
                                    <Widget title="Metadata summary" titleSize="large">
                                        <CustomTable headers={keyValueHeaders} data={metadataSummaryRows} />
                                    </Widget>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                                    {Object.keys(assetsByCategoryChartData).length > 0 && (
                                        <DonutChart
                                            title="Assets by category"
                                            data={assetsByCategoryChartData}
                                            colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                                                Object.keys(assetsByCategoryChartData).length,
                                            )}
                                            entity={EntityType.CBOM}
                                            onSetFilter={() => []}
                                            redirect="../cboms"
                                            showValuesInLegend
                                            interactiveLegend={false}
                                        />
                                    )}
                                    {Object.keys(algorithmsByNameChartData).length > 0 && (
                                        <DonutChart
                                            title="Algorithms by name"
                                            data={algorithmsByNameChartData}
                                            colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                                                Object.keys(algorithmsByNameChartData).length,
                                            )}
                                            entity={EntityType.CBOM}
                                            onSetFilter={() => []}
                                            redirect="../cboms"
                                            showValuesInLegend
                                            interactiveLegend={false}
                                        />
                                    )}
                                    {Object.keys(cryptoFunctionsChartData).length > 0 && (
                                        <DonutChart
                                            title="Crypto functions"
                                            data={cryptoFunctionsChartData}
                                            colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                                                Object.keys(cryptoFunctionsChartData).length,
                                            )}
                                            entity={EntityType.CBOM}
                                            onSetFilter={() => []}
                                            redirect="../cboms"
                                            showValuesInLegend
                                            interactiveLegend={false}
                                        />
                                    )}
                                    {Object.keys(cryptoPrimitivesChartData).length > 0 && (
                                        <DonutChart
                                            title="Crypto primitives"
                                            data={cryptoPrimitivesChartData}
                                            colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                                                Object.keys(cryptoPrimitivesChartData).length,
                                            )}
                                            entity={EntityType.CBOM}
                                            onSetFilter={() => []}
                                            redirect="../cboms"
                                            showValuesInLegend
                                            interactiveLegend={false}
                                        />
                                    )}
                                    {Object.keys(relatedMaterialTypesChartData).length > 0 && (
                                        <DonutChart
                                            title="Crypto related material types"
                                            data={relatedMaterialTypesChartData}
                                            colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                                                Object.keys(relatedMaterialTypesChartData).length,
                                            )}
                                            entity={EntityType.CBOM}
                                            onSetFilter={() => []}
                                            redirect="../cboms"
                                            showValuesInLegend
                                            interactiveLegend={false}
                                        />
                                    )}
                                </div>
                                <div className="mt-4 md:mt-8">
                                    <Widget title="Assets" titleSize="large">
                                        <CustomTable headers={overviewComponentHeaders} data={overviewComponentRows} hasPagination />
                                    </Widget>
                                </div>
                            </Container>
                        ),
                    },
                    {
                        title: 'Assets',
                        content: (
                            <Container>
                                <Widget titleSize="large">
                                    <CustomTable headers={componentHeaders} data={componentRows} hasPagination />
                                </Widget>
                            </Container>
                        ),
                    },

                    {
                        title: 'Raw JSON',
                        content: (
                            <Container>
                                <Widget titleSize="large">
                                    <div className="relative">
                                        <div className="absolute top-3 right-5 flex gap-2 z-10">
                                            <Button
                                                variant="transparent"
                                                color="secondary"
                                                type="button"
                                                title="Copy"
                                                onClick={handleCopyRawJson}
                                                className="!text-white hover:!bg-white/10 focus:!bg-white/10"
                                            >
                                                <Copy size={18} aria-hidden="true" />
                                            </Button>
                                            <Button
                                                variant="transparent"
                                                color="secondary"
                                                type="button"
                                                title="Download"
                                                onClick={handleDownloadRawJson}
                                                className="!text-white hover:!bg-white/10 focus:!bg-white/10"
                                            >
                                                <Download size={18} aria-hidden="true" />
                                            </Button>
                                        </div>
                                        <JsonViewer value={rawJsonText} height={900} paddingTop={44} />
                                    </div>
                                </Widget>
                            </Container>
                        ),
                    },
                ]}
            />

            <Dialog
                isOpen={!!locationModalData}
                toggle={handleCloseLocationModal}
                caption="Asset JSON excerpt"
                size="xl"
                noBorder
                body={
                    <div className="flex flex-col gap-4 pb-6">
                        <div className="flex flex-row items-center gap-5">
                            <div className="flex flex-row items-center gap-1 font-medium">
                                <div className="text-gray-500">Asset:</div>
                                <div className="text-[var(--dark-gray-color)] break-all">{locationModalData?.asset ?? '-'}</div>
                            </div>
                            <div className="flex flex-row items-center gap-1 font-medium">
                                <div className="text-gray-500">Location:</div>
                                <div className="text-[var(--dark-gray-color)] break-all">{locationModalData?.location ?? '-'}</div>
                            </div>
                        </div>

                        <JsonViewer value={locationModalData?.rawJson ?? ''} height={278} />

                        <div className="flex items-center justify-between pt-2">
                            <Button type="button" color="primary" onClick={handleCopyLocationExcerpt}>
                                Copy Excerpt
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                color="secondary"
                                onClick={handleCloseLocationModal}
                                className="text-black"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
