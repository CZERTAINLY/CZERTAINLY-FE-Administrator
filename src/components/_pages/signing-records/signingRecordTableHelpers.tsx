import { Link } from 'react-router';
import type { CellRegistry } from 'components/CustomTable/columns';
import type { EnumItemModel } from 'types/enums';
import { FilterFieldSource, FilterFieldType, Resource, type SigningRecordListDto } from 'types/openapi';
import type { ColumnDefinition } from 'types/tableColumns';

type PlatformEnumMap = { [key: string]: EnumItemModel } | undefined;

export interface BuildSigningRecordCellsOpts {
    signingProtocolEnum: PlatformEnumMap;
    getEnumLabel: (enumMap: PlatformEnumMap, key: string) => string;
    dateFormatter: (date: string | Date) => string;
}

/** The platform default column set for the signing records inventory: what the page shipped before the picker. */
export const SIGNING_RECORD_COLUMNS: ColumnDefinition[] = [
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'SIGNING_RECORD_NAME',
        catalogueLabel: 'Name',
        type: FilterFieldType.String,
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'SIGNING_RECORD_SIGNING_PROFILE',
        catalogueLabel: 'Signing Profile',
        type: FilterFieldType.List,
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'SIGNING_RECORD_SIGNING_TIME',
        catalogueLabel: 'Signing Time',
        type: FilterFieldType.Date,
    },
    {
        fieldSource: FilterFieldSource.Property,
        fieldIdentifier: 'SIGNING_RECORD_CREATED',
        catalogueLabel: 'Created At',
        type: FilterFieldType.Date,
    },
];

/**
 * `SIGNING_RECORD_SIGNED_DOCUMENT_RETRIEVED_AT` is catalogued but absent from `SigningRecordListDto`, so no renderer
 * is registered for it and the picker does not offer it.
 */
export function buildSigningRecordCellRegistry({
    signingProtocolEnum,
    getEnumLabel,
    dateFormatter,
}: BuildSigningRecordCellsOpts): CellRegistry<SigningRecordListDto> {
    return {
        'property:SIGNING_RECORD_NAME': (record) => <Link to={`./detail/${record.uuid}`}>{record.name}</Link>,
        'property:SIGNING_RECORD_SIGNING_PROFILE': (record) =>
            record.signingProfile ? (
                <Link to={`/${Resource.SigningProfiles.toLowerCase()}/detail/${record.signingProfile.uuid}`}>
                    {record.signingProfile.name} (v{record.signingProfile.version})
                </Link>
            ) : null,
        'property:SIGNING_RECORD_SIGNING_TIME': (record) =>
            record.signingTime ? <span className="whitespace-nowrap">{dateFormatter(record.signingTime)}</span> : null,
        'property:SIGNING_RECORD_CREATED': (record) =>
            record.createdAt ? <span className="whitespace-nowrap">{dateFormatter(record.createdAt)}</span> : null,
        // Beyond the default set: catalogued and renderable, so the picker offers them.
        'property:SIGNING_RECORD_PROTOCOL': (record) => (record.protocol ? getEnumLabel(signingProtocolEnum, record.protocol) : null),
        'property:SIGNING_RECORD_SIGNING_PROFILE_VERSION': (record) => record.signingProfile?.version?.toString(),
    };
}
