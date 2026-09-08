import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { CellRegistry } from 'components/CustomTable/columns';
import type { EnumItemModel } from 'types/enums';
import type { CbomDto } from 'types/openapi';
import { FilterFieldSource, FilterFieldType } from 'types/openapi';
import type { ColumnDefinition } from 'types/tableColumns';

type PlatformEnumMap = { [key: string]: EnumItemModel } | undefined;

export interface BuildCbomCellsOpts {
    assetSyncStateEnum: PlatformEnumMap;
    getEnumLabel: (enumMap: PlatformEnumMap, key: string) => string;
    dateFormatter: (date: string | Date) => string;
    renderActions: (cbom: CbomDto) => ReactNode;
}

/** A count the API may send as null or a non-number, rendered as a number either way. */
export function toFiniteNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

/** The platform default column set for the CBOM inventory: what the page shipped before the picker. */
export const CBOM_COLUMNS: ColumnDefinition[] = [
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_SERIAL_NUMBER',
        catalogueLabel: 'Serial Number',
        label: 'Serial number',
        type: FilterFieldType.String,
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_VERSION',
        catalogueLabel: 'Version',
        label: 'Ver.',
        type: FilterFieldType.Number,
        align: 'center',
    },
    { fieldSource: FilterFieldSource.Property, fieldIdentifier: 'CBOM_SOURCE', catalogueLabel: 'Source', type: FilterFieldType.String },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_ALGORITHMS_COUNT',
        catalogueLabel: 'Algorithms Count',
        label: 'Alg.',
        type: FilterFieldType.Number,
        align: 'center',
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_CERTIFICATES_COUNT',
        catalogueLabel: 'Certificates Count',
        label: 'Certs',
        type: FilterFieldType.Number,
        align: 'center',
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_PROTOCOLS_COUNT',
        catalogueLabel: 'Protocols Count',
        label: 'Proto.',
        type: FilterFieldType.Number,
        align: 'center',
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_CRYPTO_MATERIAL_COUNT',
        catalogueLabel: 'Crypto Material Count',
        label: 'Material',
        type: FilterFieldType.Number,
        align: 'center',
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'CBOM_TOTAL_ASSETS_COUNT',
        catalogueLabel: 'Total Assets Count',
        label: 'Assets',
        type: FilterFieldType.Number,
        align: 'center',
    },
];

export function buildCbomCellRegistry({
    assetSyncStateEnum,
    getEnumLabel,
    dateFormatter,
    renderActions,
}: BuildCbomCellsOpts): CellRegistry<CbomDto> {
    return {
        // The row actions ride in this cell rather than a column of their own: an uncatalogued column is stripped
        // from a saved view on write and the picker cannot offer it back, which would leave every view without them.
        'property:CBOM_SERIAL_NUMBER': (cbom) => (
            <span className="flex items-center gap-2 whitespace-nowrap">
                <Link to={`./detail/${cbom.uuid}`}>{cbom.serialNumber}</Link>
                {renderActions(cbom)}
            </span>
        ),
        'property:CBOM_VERSION': (cbom) => toFiniteNumber(cbom.version),
        'property:CBOM_SOURCE': (cbom) => cbom.source,
        'property:CBOM_ALGORITHMS_COUNT': (cbom) => toFiniteNumber(cbom.algorithms),
        'property:CBOM_CERTIFICATES_COUNT': (cbom) => toFiniteNumber(cbom.certificates),
        'property:CBOM_PROTOCOLS_COUNT': (cbom) => toFiniteNumber(cbom.protocols),
        'property:CBOM_CRYPTO_MATERIAL_COUNT': (cbom) => toFiniteNumber(cbom.cryptoMaterial),
        'property:CBOM_TOTAL_ASSETS_COUNT': (cbom) => toFiniteNumber(cbom.totalAssets),
        // Beyond the default set: catalogued and renderable, so the picker offers them.
        'property:CBOM_TIMESTAMP': (cbom) =>
            cbom.timestamp ? <span className="whitespace-nowrap">{dateFormatter(cbom.timestamp)}</span> : null,
        'property:CBOM_ASSET_SYNC_STATE': (cbom) => (cbom.assetSyncState ? getEnumLabel(assetSyncStateEnum, cbom.assetSyncState) : null),
        'property:CBOM_ASSETS_SYNCED_AT': (cbom) =>
            cbom.assetSyncedAt ? <span className="whitespace-nowrap">{dateFormatter(cbom.assetSyncedAt)}</span> : null,
    };
}
