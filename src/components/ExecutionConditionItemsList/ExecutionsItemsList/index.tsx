import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'components/Spinner';
import Badge from 'components/Badge';
import { AttributeContentType, ExecutionType, FilterFieldType, PlatformEnum } from 'types/openapi';
import { ExecutionItemModel } from 'types/rules';
import { getFormattedDate, getFormattedDateTime } from 'utils/dateUtil';

interface ExecutionsItemsListProps {
    executionItems: ExecutionItemModel[];
    executionName: string;
    executionType: ExecutionType;
    executionUuid: string;
    smallerBadges?: boolean;
}

const ExecutionsItemsList = ({
    executionItems = [],
    executionName,
    executionType,
    executionUuid,
    smallerBadges,
}: ExecutionsItemsListProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.ACTIONS));
    const platformEnums = useSelector(enumSelectors.platformEnums);

    const isFetchingConditionDetails = useSelector(rulesSelectors.isFetchingConditionDetails);
    const isFetchingAvailableFiltersConditions = useSelector(selectors.isFetchingFilters(EntityType.ACTIONS));

    const isLoading = useMemo(
        () => isFetchingAvailableFiltersConditions || isFetchingConditionDetails,
        [isFetchingAvailableFiltersConditions, isFetchingConditionDetails],
    );

    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
    );

    const renderSetFieldActionBadges = useCallback(() => {
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
                <Badge key={i.toString() + label + value}>
                    <>
                        <b>{f?.fieldSource && getEnumLabel(searchGroupEnum, f?.fieldSource)}&nbsp;</b>'{label}
                        '&nbsp;to&nbsp;
                        {value}
                    </>
                </Badge>
            );
        });
    }, [executionItems, availableFilters, searchGroupEnum, booleanOptions, platformEnums]);

    const renderSendNotificationActionBadges = useCallback(() => {
        if (!executionItems) return null;
        return executionItems.map((f, i) => {
            return (
                <Badge key={i.toString() + f.notificationProfileUuid}>
                    <span>Send notifications to:&nbsp;</span>
                    <b>{f.notificationProfileName}&nbsp;</b>
                </Badge>
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executionItems, availableFilters, searchGroupEnum, booleanOptions, platformEnums]);

    const renderActionBadges = useCallback(() => {
        switch (executionType) {
            case ExecutionType.SetField:
                return renderSetFieldActionBadges();
            case ExecutionType.SendNotification:
                return renderSendNotificationActionBadges();
        }
    }, [executionType, renderSetFieldActionBadges, renderSendNotificationActionBadges]);

    const renderSmallerSetFieldExecutionsBadges = useCallback(() => {
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
                <div key={i.toString() + label + value} className="mt-2 mr-1">
                    <span>
                        <b>{f?.fieldSource && getEnumLabel(searchGroupEnum, f?.fieldSource)}&nbsp;</b>'{label}
                        '&nbsp;to&nbsp;
                        {value}
                    </span>
                </div>
            );
        });
    }, [executionItems, availableFilters, searchGroupEnum, booleanOptions, platformEnums]);

    const renderSmallerSendNotificationExecutionsBadges = useCallback(() => {
        return executionItems.map((f, i) => {
            return (
                <div key={i} className="mt-2 mr-1">
                    <span>
                        <span>Send notifications to:&nbsp;</span>
                        <b>{f.notificationProfileName}&nbsp;</b>
                    </span>
                </div>
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executionItems, availableFilters, searchGroupEnum, booleanOptions, platformEnums]);

    const renderSmallerExecutionsBadges = useCallback(() => {
        switch (executionType) {
            case ExecutionType.SetField:
                return renderSmallerSetFieldExecutionsBadges();
            case ExecutionType.SendNotification:
                return renderSmallerSendNotificationExecutionsBadges();
        }
    }, [executionType, renderSmallerSendNotificationExecutionsBadges, renderSmallerSetFieldExecutionsBadges]);

    if (isLoading) return <Spinner color="gray" active={isFetchingConditionDetails} />;

    return smallerBadges ? (
        <div>
            <h6 className="text-gray-500">{`${executionName}'s Execution Items`}</h6>
            <div className="flex flex-wrap">{renderSmallerExecutionsBadges()}</div>
        </div>
    ) : (
        <div key={executionUuid}>
            <h6 className="text-gray-500">{`${executionName}`}</h6>
            <div className="ml-3">{renderActionBadges()}</div>
        </div>
    );
};

export default ExecutionsItemsList;
