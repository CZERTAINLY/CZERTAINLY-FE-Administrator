import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';
import { AttributeContentType, FilterFieldType, PlatformEnum, SearchFieldDataDto } from 'types/openapi';
import { ExecutionItemModel } from 'types/rules';
import { getFormattedDate, getFormattedDateTime } from 'utils/dateUtil';
import styles from './executionsItemsList.module.scss';

interface ExecutionsItemsListProps {
    executionItems: ExecutionItemModel[];
    executionName: string;
    executionUuid: string;
}

const ExecutionsItemsList = ({ executionItems = [], executionName, executionUuid }: ExecutionsItemsListProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.ACTIONS));
    const platformEnums = useSelector(enumSelectors.platformEnums);

    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
    );

    const checkIfFieldIsDate = useCallback((field: SearchFieldDataDto) => {
        if (
            field.attributeContentType === AttributeContentType.Date ||
            field.attributeContentType === AttributeContentType.Time ||
            field.attributeContentType === AttributeContentType.Datetime
        ) {
            return true;
        } else {
            return false;
        }
    }, []);
    const renderActionBadges = useMemo(() => {
        if (!executionItems) return null;
        return executionItems.map((f, i) => {
            const field = availableFilters
                .find((a) => a.filterFieldSource === f.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === f.fieldIdentifier);

            const label = field ? field.fieldLabel : f.fieldIdentifier;
            let value = '';
            let coincideValueToShow = '';
            if (Array.isArray(field?.value)) {
                if (Array.isArray(f.data)) {
                    const actionDataValues = f.data as string[];
                    const coincideValues = field?.value.filter((v) => actionDataValues.includes(v.uuid));

                    if (coincideValues?.length) coincideValueToShow = coincideValues?.map((v) => v.name).join(', ');
                }
            }

            value = coincideValueToShow?.length
                ? coincideValueToShow
                : field && field.type === FilterFieldType.Boolean
                  ? `'${booleanOptions.find((b) => !!f.data === b.value)?.label}'`
                  : Array.isArray(f.data)
                    ? `${f.data
                          .map(
                              (v) =>
                                  `'${
                                      field?.platformEnum
                                          ? platformEnums[field.platformEnum][v]?.label
                                          : v?.name
                                            ? v.name
                                            : field && field.attributeContentType === AttributeContentType.Date
                                              ? getFormattedDate(v as unknown as string)
                                              : field && field.attributeContentType === AttributeContentType.Datetime
                                                ? getFormattedDateTime(v as unknown as string)
                                                : v
                                  }'`,
                          )
                          .join(', ')}`
                    : f.data
                      ? `'${
                            field?.platformEnum
                                ? platformEnums[field.platformEnum][f.data as unknown as string]?.label
                                : field && field.attributeContentType === AttributeContentType.Date
                                  ? getFormattedDate(f.data as unknown as string)
                                  : field && field.attributeContentType === AttributeContentType.Datetime
                                    ? getFormattedDateTime(f.data as unknown as string)
                                    : f.data
                        }'`
                      : '';

            return (
                <Badge className={styles.groupConditionBadge} key={i}>
                    <>
                        <b>{f?.fieldSource && getEnumLabel(searchGroupEnum, f?.fieldSource)}&nbsp;</b>'{label}
                        '&nbsp;to&nbsp;
                        {value}
                    </>
                </Badge>
            );
        });
    }, [executionItems, availableFilters, searchGroupEnum, booleanOptions, platformEnums]);

    return (
        <div className={styles.groupConditionContainerDiv} key={executionUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${executionName}`}</h6>
            <div className="ms-3">{renderActionBadges}</div>
        </div>
    );
};

export default ExecutionsItemsList;
