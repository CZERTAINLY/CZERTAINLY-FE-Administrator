import { getEnumLabel } from 'ducks/enums';
import Badge from 'components/Badge';
import { SearchFieldListModel, SearchFieldModel } from 'types/certificate';
import { EnumItemDto } from 'types/enums';
import { AttributeContentType, ConditionItemDto, FilterFieldType } from 'types/openapi';
import { getFormattedDate, getFormattedDateTime } from 'utils/dateUtil';

type RenderVariant = 'badge' | 'small';

export const renderConditionItems = (
    conditionItems: ConditionItemDto[],
    availableFilters: SearchFieldListModel[],
    platformEnums: Record<string, Record<string, { label: string }>>,
    searchGroupEnum: Record<string, EnumItemDto>,
    filterConditionOperatorEnum: Record<string, EnumItemDto>,
    className: string,
    variant: RenderVariant = 'badge',
    style?: React.CSSProperties,
) => {
    const formatSingleValue = (
        v: any,
        field: SearchFieldModel | undefined,
        platformEnums: Record<string, Record<string, { label: string }>>,
    ): string => {
        if (field?.platformEnum) {
            return platformEnums[field.platformEnum][v]?.label ?? v;
        }

        if (field?.attributeContentType === AttributeContentType.Date) {
            return getFormattedDate(v as string);
        }

        if (field?.attributeContentType === AttributeContentType.Datetime) {
            return getFormattedDateTime(v as string);
        }

        if (typeof v === 'object' && v?.name) {
            return v.name;
        }

        return String(v);
    };

    const getConditionValue = (
        condition: ConditionItemDto,
        field: SearchFieldModel | undefined,
        platformEnums: Record<string, Record<string, { label: string }>>,
    ): string => {
        const booleanOptions = [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ];

        if (field?.type === FilterFieldType.Boolean) {
            return `'${booleanOptions.find((b) => !!condition.value === b.value)?.label}'`;
        }

        if (Array.isArray(condition.value)) {
            return condition.value.map((v) => `'${formatSingleValue(v, field, platformEnums)}'`).join(' OR ');
        }

        if (condition.value) {
            return `'${formatSingleValue(condition.value, field, platformEnums)}'`;
        }
        return '';
    };

    return conditionItems.map((condition, i) => {
        const field = availableFilters
            .find((a) => a.filterFieldSource === condition.fieldSource)
            ?.searchFieldData?.find((s) => s.fieldIdentifier === condition.fieldIdentifier);

        const label = field ? field.fieldLabel : condition.fieldIdentifier;
        const value = getConditionValue(condition, field, platformEnums);

        const title = `${getEnumLabel(searchGroupEnum, condition.fieldSource)} ${label} ${getEnumLabel(
            filterConditionOperatorEnum,
            condition.operator,
        )} ${value}`;

        if (variant === 'badge') {
            return (
                <Badge key={condition.fieldIdentifier} title={title} className={className} style={style}>
                    <b>{getEnumLabel(searchGroupEnum, condition.fieldSource)}&nbsp;</b>'{label}'&nbsp;
                    {getEnumLabel(filterConditionOperatorEnum, condition.operator)}&nbsp;
                    {value}
                </Badge>
            );
        }

        return (
            <div key={condition.fieldIdentifier} className="mt-2 me-1" style={style}>
                <span title={title} className={className}>
                    <b>{getEnumLabel(searchGroupEnum, condition.fieldSource)}&nbsp;</b>'{label}'&nbsp;
                    {getEnumLabel(filterConditionOperatorEnum, condition.operator)}&nbsp;
                    {value}
                </span>
            </div>
        );
    });
};
