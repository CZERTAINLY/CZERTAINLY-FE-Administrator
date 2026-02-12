import Widget from 'components/Widget';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiClients } from '../../api';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as alertActions } from 'ducks/alerts';
import { EntityType, actions, selectors } from 'ducks/filters';
import { useDispatch, useSelector } from 'react-redux';
import Select, { SingleValue, MultiValue } from 'components/Select';
import TextInput from 'components/TextInput';
import { Observable } from 'rxjs';
import { SearchFieldListModel, SearchFilterModel } from 'types/certificate';
import {
    AttributeContentType,
    FilterConditionOperator,
    FilterFieldSource,
    FilterFieldType,
    PlatformEnum,
    SearchFilterRequestDto,
} from 'types/openapi';
import { getFormTypeFromAttributeContentType, getFormTypeFromFilterFieldType, getStepValue } from 'utils/common-utils';
import {
    checkIfFieldAttributeTypeIsDate,
    checkIfFieldOperatorIsInterval,
    checkIfFieldTypeIsDate,
    getFormattedDate,
    getFormattedDateTime,
    getFormattedUtc,
} from 'utils/dateUtil';

import {
    getInputStringFromIso8601String as getDurationStringFromIso8601String,
    getIso8601StringFromInputString as getIso8601StringFromDurationString,
} from 'utils/duration';
import Button from 'components/Button';
import Badge from 'components/Badge';
import { validateDuration, validatePostgresPosixRegex } from 'utils/validators';
import Label from 'components/Label';

const deepCopy = <T,>(value: T): T => (value == null ? value : JSON.parse(JSON.stringify(value)));

const noValue: { [condition in FilterConditionOperator]: boolean } = {
    [FilterConditionOperator.Equals]: false,
    [FilterConditionOperator.NotEquals]: false,
    [FilterConditionOperator.Greater]: false,
    [FilterConditionOperator.GreaterOrEqual]: false,
    [FilterConditionOperator.Lesser]: false,
    [FilterConditionOperator.LesserOrEqual]: false,
    [FilterConditionOperator.Contains]: false,
    [FilterConditionOperator.NotContains]: false,
    [FilterConditionOperator.StartsWith]: false,
    [FilterConditionOperator.EndsWith]: false,
    [FilterConditionOperator.InNext]: false,
    [FilterConditionOperator.InPast]: false,
    [FilterConditionOperator.Matches]: false,
    [FilterConditionOperator.NotMatches]: false,
    [FilterConditionOperator.Empty]: true,
    [FilterConditionOperator.NotEmpty]: true,
    [FilterConditionOperator.Success]: true,
    [FilterConditionOperator.Failed]: true,
    [FilterConditionOperator.Unknown]: true,
    [FilterConditionOperator.NotChecked]: true,
};

interface ObjectValueOptions {
    label: string;
    value: string | any;
}

interface Props {
    title: string;
    entity: EntityType;
    getAvailableFiltersApi: (apiClients: ApiClients) => Observable<Array<SearchFieldListModel>>;
    onFilterUpdate?: (currentFilters: SearchFilterModel[]) => void;
    disableBadgeRemove?: boolean;
    busyBadges?: boolean;
    extraFilterComponent?: React.ReactNode;
    filterGridCols?: 2 | 4;
}

export default function FilterWidget({
    onFilterUpdate,
    title,
    entity,
    getAvailableFiltersApi,
    disableBadgeRemove,
    busyBadges,
    extraFilterComponent,
    filterGridCols = 4,
}: Props) {
    const dispatch = useDispatch();

    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const FilterConditionOperatorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterConditionOperator));
    const platformEnums = useSelector(enumSelectors.platformEnums);

    const availableFilters = useSelector(selectors.availableFilters(entity));
    const currentFilters = useSelector(selectors.currentFilters(entity));
    const isFetchingAvailableFilters = useSelector(selectors.isFetchingFilters(entity));

    const [selectedFilter, setSelectedFilter] = useState<number>(-1);

    const [filterGroup, setFilterGroup] = useState<SingleValue<{ label: string; value: FilterFieldSource }> | undefined>(undefined);
    const [filterField, setFilterField] = useState<SingleValue<{ label: string; value: string }> | undefined>(undefined);
    const [filterCondition, setFilterCondition] = useState<SingleValue<{ label: string; value: FilterConditionOperator }> | undefined>(
        undefined,
    );
    const [filterValue, setFilterValue] = useState<
        | string
        | number
        | object
        | SingleValue<object | object[] | { label: string; value: object }>
        | MultiValue<object | object[] | { label: string; value: object }>
        | undefined
    >(undefined);
    const [regexError, setRegexError] = useState<string>('');

    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
    );

    const filterConditionsRequiredNumberInput = useMemo(
        () => [
            FilterConditionOperatorEnum?.COUNT_LESS_THAN.code,
            FilterConditionOperatorEnum?.COUNT_GREATER_THAN.code,
            FilterConditionOperatorEnum?.COUNT_EQUAL.code,
            FilterConditionOperatorEnum?.COUNT_NOT_EQUAL.code,
        ],
        [FilterConditionOperatorEnum],
    );

    useEffect(() => {
        dispatch(actions.getAvailableFilters({ entity, getAvailableFiltersApi }));
    }, [dispatch, entity, getAvailableFiltersApi]);

    useEffect(() => {
        if (selectedFilter >= currentFilters.length) {
            setSelectedFilter(-1);
            return;
        }

        if (selectedFilter === -1) {
            setFilterGroup(undefined);
            setFilterField(undefined);
            setFilterCondition(undefined);
            setFilterValue(undefined);
            return;
        }

        const field = availableFilters
            .find((f) => f.filterFieldSource === currentFilters[selectedFilter].fieldSource)
            ?.searchFieldData?.find((f) => f.fieldIdentifier === currentFilters[selectedFilter].fieldIdentifier);
        if (!field) return;

        setFilterGroup({
            label: getEnumLabel(searchGroupEnum, currentFilters[selectedFilter].fieldSource),
            value: currentFilters[selectedFilter].fieldSource,
        });
        setFilterField({ label: field.fieldLabel, value: field.fieldIdentifier });
        setFilterCondition({
            label: getEnumLabel(FilterConditionOperatorEnum, currentFilters[selectedFilter].condition),
            value: currentFilters[selectedFilter].condition,
        });

        if (filterConditionsRequiredNumberInput.includes(currentFilters[selectedFilter].condition)) {
            setFilterValue(currentFilters[selectedFilter].value);
            return;
        }

        if (checkIfFieldAttributeTypeIsDate(field)) {
            if (field.attributeContentType === AttributeContentType.Date) {
                const dateVal = getFormattedDate(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(deepCopy(dateVal));
                return;
            }
            if (field.attributeContentType === AttributeContentType.Datetime) {
                const dateTimeVal = getFormattedDateTime(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(deepCopy(dateTimeVal));
                return;
            }
        }

        if (
            field.type === FilterFieldType.String ||
            field.type === FilterFieldType.Number ||
            field.type === FilterFieldType.Date ||
            field.type === FilterFieldType.Datetime
        ) {
            if (checkIfFieldOperatorIsInterval(currentFilters[selectedFilter].condition)) {
                const duration = getDurationStringFromIso8601String(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(deepCopy(duration));
                return;
            }
            if (field.type === FilterFieldType.Datetime) {
                const dateTimeVal = getFormattedDateTime(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(deepCopy(dateTimeVal));
                return;
            }
            if (field.type === FilterFieldType.Date) {
                const dateVal = getFormattedDate(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(deepCopy(dateVal));
                return;
            }
            setFilterValue(currentFilters[selectedFilter].value);

            return;
        }

        if (field.type === FilterFieldType.Boolean) {
            setFilterValue(booleanOptions.find((f) => !!currentFilters[selectedFilter].value === f.value));
            return;
        }

        if (!field.multiValue) {
            const value = currentFilters[selectedFilter].value;
            const label = field.platformEnum
                ? platformEnums[field.platformEnum][(value ?? '') as string].label
                : checkIfFieldAttributeTypeIsDate(field)
                  ? getFormattedDateTime(value as unknown as string)
                  : value;
            setFilterValue({ label, value });
            return;
        }

        if (Array.isArray(currentFilters[selectedFilter].value)) {
            const currentValue = currentFilters[selectedFilter]?.value as Array<object>;
            const newFilterValue = currentValue.map((v: any) => {
                let label = '';
                let value = '';
                if (typeof v === 'string') {
                    if (checkIfFieldAttributeTypeIsDate(field)) {
                        label = getFormattedDateTime(v);
                    } else {
                        label = field.platformEnum ? getEnumLabel(platformEnums[field.platformEnum], v) : v;
                    }
                    value = v;
                } else {
                    label = v?.name || JSON.stringify(v);
                    value = v;
                }

                return { label, value };
            });

            setFilterValue(newFilterValue);
        }
    }, [
        availableFilters,
        currentFilters,
        selectedFilter,
        booleanOptions,
        platformEnums,
        FilterConditionOperatorEnum,
        searchGroupEnum,
        filterConditionsRequiredNumberInput,
    ]);

    const onUnselectFiltersClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if ((e.target as HTMLDivElement).id === 'unselectFilters') {
                setSelectedFilter(-1);
            }
        },
        [setSelectedFilter],
    );

    const onUpdateFilterClick = useCallback(() => {
        if (!filterGroup || !filterField || !filterCondition) {
            return;
        }

        if (selectedFilter >= currentFilters.length) {
            setSelectedFilter(-1);
            return;
        }

        const isDuplicate = currentFilters.some(
            (f, i) =>
                i !== selectedFilter &&
                f.fieldSource === filterGroup.value &&
                f.fieldIdentifier === filterField.value &&
                f.condition === filterCondition.value,
        );
        if (isDuplicate) {
            dispatch(alertActions.error('A filter with the same field and condition already exists'));
            return;
        }

        const field = availableFilters
            .find((f) => f?.filterFieldSource === filterGroup.value)
            ?.searchFieldData?.find((f) => f?.fieldIdentifier === filterField.value);

        let value = undefined;
        if (filterValue) {
            if (typeof filterValue === 'number') {
                value = filterValue;
            } else if (typeof filterValue === 'string') {
                if (field?.type && checkIfFieldTypeIsDate(field.type) && checkIfFieldOperatorIsInterval(filterCondition.value)) {
                    value = getIso8601StringFromDurationString(filterValue);
                } else if (field?.attributeContentType && checkIfFieldAttributeTypeIsDate(field)) {
                    value = getFormattedUtc(field.attributeContentType, filterValue);
                } else {
                    value = field?.type && checkIfFieldTypeIsDate(field.type) ? getFormattedUtc(field.type, filterValue) : filterValue;
                }
            } else {
                value = Array.isArray(filterValue) ? filterValue.map((v) => v.value) : (filterValue as any).value;
            }
        }

        const updatedFilterItem: SearchFilterModel = {
            fieldSource: filterGroup.value,
            fieldIdentifier: filterField.value,
            condition: filterCondition.value,
            value: value,
        };

        const newFilters =
            selectedFilter === -1
                ? [...currentFilters, updatedFilterItem]
                : [...currentFilters.slice(0, selectedFilter), updatedFilterItem, ...currentFilters.slice(selectedFilter + 1)];

        dispatch(actions.setCurrentFilters({ entity, currentFilters: newFilters }));
        if (onFilterUpdate) {
            const filtersWithItemNames: SearchFilterRequestDto[] = newFilters.map((f) => {
                return {
                    fieldSource: f.fieldSource,
                    fieldIdentifier: f.fieldIdentifier,
                    condition: f.condition,
                    value: Array.isArray(f.value)
                        ? f.value.map((v) => {
                              if (typeof v === 'object' && v.hasOwnProperty('name')) {
                                  return v.name;
                              }
                              return v;
                          })
                        : f.value,
                };
            });
            onFilterUpdate(filtersWithItemNames);
            setSelectedFilter(-1);
        }
    }, [
        availableFilters,
        filterGroup,
        filterField,
        filterCondition,
        selectedFilter,
        currentFilters,
        filterValue,
        dispatch,
        entity,
        onFilterUpdate,
    ]);

    const onRemoveFilterClick = useCallback(
        (index: number) => {
            const newFilters = currentFilters.filter((_, i) => i !== index);
            if (newFilters.length === 0) {
                dispatch(actions.setCurrentFilters({ entity, currentFilters: [] }));
                dispatch(actions.setPreservedFilters({ entity, preservedFilters: [] }));
            } else {
                dispatch(actions.setCurrentFilters({ entity, currentFilters: newFilters }));
            }
            setSelectedFilter(-1);
            if (onFilterUpdate) {
                const filtersWithItemNames: SearchFilterRequestDto[] = newFilters.map((f) => {
                    return {
                        fieldSource: f.fieldSource,
                        fieldIdentifier: f.fieldIdentifier,
                        condition: f.condition,
                        value: Array.isArray(f.value)
                            ? f.value.map((v) => {
                                  if (typeof v === 'object' && v.hasOwnProperty('name')) {
                                      return v.name;
                                  }
                                  return v;
                              })
                            : f.value,
                    };
                });
                onFilterUpdate(filtersWithItemNames);
            }
        },
        [currentFilters, dispatch, entity, onFilterUpdate],
    );

    const toggleFilter = useCallback(
        (index: number) => {
            setSelectedFilter(selectedFilter === index ? -1 : index);
        },
        [selectedFilter],
    );

    const currentFields = useMemo(
        () => availableFilters?.find((f) => f.filterFieldSource === filterGroup?.value)?.searchFieldData,
        [availableFilters, filterGroup],
    );

    const currentField = useMemo(() => currentFields?.find((f) => f.fieldIdentifier === filterField?.value), [filterField, currentFields]);

    const isValidValue = useMemo(() => {
        if (checkIfFieldOperatorIsInterval(filterCondition?.value)) return !validateDuration()(filterValue as unknown as string);

        // Check regex validation for MATCHES or NOT_MATCHES condition
        const isRegex = filterCondition?.value === 'MATCHES' || filterCondition?.value === 'NOT_MATCHES';
        if (isRegex) {
            return !regexError;
        }

        return true;
    }, [filterCondition, filterValue, regexError]);

    const objectValueOptions: ObjectValueOptions[] = useMemo(() => {
        if (!currentField) return [];

        if (Array.isArray(currentField?.value)) {
            const objectOptions = currentField?.value?.map((v, i) => {
                let label = '';
                let value = '';
                if (typeof v === 'string') {
                    if (checkIfFieldAttributeTypeIsDate(currentField)) {
                        label = getFormattedDateTime(v);
                    } else {
                        label = currentField?.platformEnum ? getEnumLabel(platformEnums[currentField.platformEnum], v) : v;
                    }
                    value = v;
                } else {
                    label = v?.name || JSON.stringify(v);
                    value = v;
                }

                return { label, value };
            });

            if (selectedFilter === -1) return objectOptions;

            const currentValue = currentFilters[selectedFilter]?.value;

            const filteredOptions = objectOptions.filter((o) => {
                if (Array.isArray(currentValue)) {
                    return !currentValue.some((a) => a?.name === o?.label);
                } else {
                    return JSON.stringify(currentValue) !== o?.value;
                }
            });

            return filteredOptions;
        }

        return [];
    }, [currentField, currentFilters, selectedFilter, platformEnums]);

    const getBadgeContent = useCallback(
        (itemNumber: number, fieldSource: string, fieldCondition: string, label: string, value: string) => {
            if (isFetchingAvailableFilters || busyBadges) return <></>;
            return (
                <React.Fragment key={itemNumber}>
                    <b>{getEnumLabel(searchGroupEnum, fieldSource)}&nbsp;</b>'{label}'&nbsp;
                    {getEnumLabel(FilterConditionOperatorEnum, fieldCondition)}&nbsp;
                    {value}
                </React.Fragment>
            );
        },
        [isFetchingAvailableFilters, FilterConditionOperatorEnum, searchGroupEnum, busyBadges],
    );

    const renderFilterValueInput = useCallback(() => {
        function renderDurationInput() {
            return (
                <>
                    <TextInput
                        id="valueSelect"
                        type="text"
                        value={filterValue?.toString() ?? ''}
                        onChange={(value) => {
                            setFilterValue(deepCopy(value));
                        }}
                        placeholder="eg. 2d 30m"
                    />
                    <p className="mt-1 text-sm text-gray-600">Duration in format: 0d 0h 0m 0s</p>
                </>
            );
        }
        function renderTextOrDateInput() {
            const isRegex = filterCondition?.value === 'MATCHES' || filterCondition?.value === 'NOT_MATCHES';
            return (
                <>
                    <TextInput
                        id="valueSelect"
                        type={
                            currentField?.attributeContentType && checkIfFieldAttributeTypeIsDate(currentField)
                                ? getFormTypeFromAttributeContentType(currentField?.attributeContentType)
                                : currentField?.type
                                  ? getFormTypeFromFilterFieldType(currentField?.type)
                                  : 'text'
                        }
                        step={
                            currentField?.attributeContentType
                                ? getStepValue(currentField?.attributeContentType)
                                : currentField?.type
                                  ? getStepValue(currentField?.type)
                                  : undefined
                        }
                        value={filterValue?.toString() ?? ''}
                        onChange={(value: string) => {
                            setFilterValue(deepCopy(value));

                            if (isRegex) {
                                const error = validatePostgresPosixRegex(value);
                                setRegexError(error);
                            } else {
                                setRegexError('');
                            }
                        }}
                        placeholder={isRegex ? 'Enter regex value' : 'Enter filter value'}
                        disabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                        invalid={isRegex && !!regexError}
                    />
                    {isRegex && regexError && <p className="mt-1 text-sm text-red-600">{regexError}</p>}
                </>
            );
        }
        function renderBooleanInput() {
            return (
                <Select
                    id="valueSelect"
                    options={filterField ? booleanOptions : []}
                    value={filterValue ?? null}
                    onChange={(e) => {
                        setFilterValue({ label: e, value: e });
                    }}
                    isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                    isSearchable
                />
            );
        }
        function renderDefaultInput() {
            const isLongValue = objectValueOptions.some((o) => o.label.length > 50);
            return (
                <Select
                    id="valueSelect"
                    options={objectValueOptions}
                    value={filterValue ?? null}
                    onChange={(e) => {
                        setFilterValue(e);
                    }}
                    isMulti={currentField?.multiValue}
                    isClearable
                    isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                    isSearchable
                    dropdownWidth={isLongValue ? 400 : undefined}
                />
            );
        }
        function renderNumberInput() {
            const numericValue = Number(filterValue);
            const displayValue = isNaN(numericValue) ? '' : numericValue;

            return (
                <TextInput
                    id="valueSelect"
                    type="number"
                    value={displayValue.toString()}
                    onChange={(value) => {
                        // Only allow integer values
                        if (value === '' || /^\d+$/.test(value)) {
                            setFilterValue(value === '' ? undefined : Number(value));
                        }
                    }}
                    placeholder="Enter filter value"
                />
            );
        }

        if (filterConditionsRequiredNumberInput.includes(filterCondition?.value as string)) {
            return renderNumberInput();
        }
        if (checkIfFieldOperatorIsInterval(filterCondition?.value) && checkIfFieldTypeIsDate(currentField?.type)) {
            return renderDurationInput();
        }
        if (
            currentField?.type === undefined ||
            currentField?.type === FilterFieldType.String ||
            currentField?.type === FilterFieldType.Date ||
            currentField?.type === FilterFieldType.Datetime ||
            currentField?.type === FilterFieldType.Number
        ) {
            return renderTextOrDateInput();
        }
        if (currentField?.type === FilterFieldType.Boolean) {
            return renderBooleanInput();
        }

        return renderDefaultInput();
    }, [
        booleanOptions,
        currentField,
        filterCondition,
        filterConditionsRequiredNumberInput,
        filterField,
        filterValue,
        objectValueOptions,
        regexError,
    ]);

    return (
        <>
            <Widget title={title} busy={isFetchingAvailableFilters} titleSize="large">
                <div id="unselectFilters" onClick={onUnselectFiltersClick}>
                    <div className="flex flex-row gap-2 mb-4 items-end">
                        <div className={`grid w-full ${filterGridCols === 2 ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-2'}`}>
                            <Select
                                id="group"
                                label="Filter Field Source"
                                options={availableFilters.map((f) => ({
                                    label: getEnumLabel(searchGroupEnum, f.filterFieldSource),
                                    value: f.filterFieldSource,
                                }))}
                                onChange={(e) => {
                                    setFilterGroup({ label: e, value: e });
                                    setFilterField(undefined);
                                    setFilterCondition(undefined);
                                    setFilterValue(undefined);
                                    setRegexError('');
                                }}
                                value={filterGroup || null}
                                // isClearable
                            />
                            <Select
                                label="Filter Field"
                                id="field"
                                options={currentFields?.map((f) => ({ label: f.fieldLabel, value: f.fieldIdentifier })) || []}
                                onChange={(e) => {
                                    setFilterField({ label: e, value: e });
                                    setFilterCondition(undefined);
                                    setFilterValue(undefined);
                                    setRegexError('');
                                }}
                                value={filterField || null}
                                isDisabled={!filterGroup}
                                isSearchable
                                // isClearable
                            />

                            <Select
                                id="conditions"
                                label="Filter Condition"
                                options={
                                    filterField
                                        ? currentField?.conditions.map((c) => ({
                                              label: getEnumLabel(FilterConditionOperatorEnum, c),
                                              value: c,
                                          }))
                                        : []
                                }
                                onChange={(e) => {
                                    setFilterCondition({ label: e, value: e });
                                    setFilterValue(undefined);
                                    setRegexError('');
                                }}
                                value={filterCondition || null}
                                isDisabled={!filterField}
                                isSearchable
                            />

                            <div>
                                <Label htmlFor="valueSelect">Filter Value</Label>
                                {renderFilterValueInput()}
                            </div>
                        </div>
                        <Button
                            id="addFilter"
                            disabled={
                                !filterField || !filterCondition || !isValidValue || (!noValue[filterCondition.value] && !filterValue)
                            }
                            onClick={onUpdateFilterClick}
                            className="py-3 min-w-[62px]"
                        >
                            {selectedFilter === -1 ? 'Add' : 'Update'}
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {currentFilters.map((f, i) => {
                            const field = availableFilters
                                .find((a) => a.filterFieldSource === f.fieldSource)
                                ?.searchFieldData?.find((s) => s.fieldIdentifier === f.fieldIdentifier);
                            const label = field ? field.fieldLabel : f.fieldIdentifier;
                            let value = '';

                            function mapArrayValue(v: any) {
                                if (field?.platformEnum) {
                                    return platformEnums[field.platformEnum][v]?.label;
                                }
                                if (v?.name) return v.name;
                                if (field?.type && checkIfFieldTypeIsDate(field.type) && checkIfFieldOperatorIsInterval(f.condition))
                                    return getIso8601StringFromDurationString(v as string);
                                if (field && field?.attributeContentType === AttributeContentType.Date) return getFormattedDate(v);
                                if (field && field?.attributeContentType === AttributeContentType.Datetime) return getFormattedDateTime(v);
                                return v;
                            }

                            function mapValue() {
                                if (!f.value) {
                                    return '';
                                }
                                if (typeof f.value === 'number') {
                                    return f.value;
                                }
                                if (field?.type && checkIfFieldTypeIsDate(field.type) && checkIfFieldOperatorIsInterval(f.condition)) {
                                    return getDurationStringFromIso8601String(f.value as unknown as string);
                                }
                                if (field?.platformEnum) {
                                    return platformEnums[field.platformEnum][f.value as unknown as string]?.label;
                                }
                                if (
                                    (field && field?.attributeContentType === AttributeContentType.Date) ||
                                    (field?.type === FilterFieldType.Date && field?.attributeContentType !== AttributeContentType.Datetime)
                                ) {
                                    return getFormattedDate(f.value as unknown as string);
                                }
                                if (
                                    (field && field?.attributeContentType === AttributeContentType.Datetime) ||
                                    field?.type === FilterFieldType.Datetime
                                ) {
                                    return getFormattedDateTime(f.value as unknown as string);
                                }
                                return f.value;
                            }
                            if (field && field.type === FilterFieldType.Boolean) {
                                value = `'${booleanOptions.find((b) => !!f.value === b.value)?.label}'`;
                            } else if (Array.isArray(f.value)) {
                                value = `'${f.value.map((v) => mapArrayValue(v)).join(' OR ')}'`;
                            } else {
                                value = `'${mapValue()}'`;
                            }
                            return (
                                <Badge
                                    key={f.fieldIdentifier + i}
                                    onClick={() => toggleFilter(i)}
                                    color={selectedFilter === i ? 'primary' : 'secondary'}
                                    onRemove={() => {
                                        if (disableBadgeRemove) return;
                                        onRemoveFilterClick(i);
                                    }}
                                    size="medium"
                                >
                                    {!isFetchingAvailableFilters &&
                                        !busyBadges &&
                                        getBadgeContent(i, f.fieldSource, f.condition, label, value)}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
                {extraFilterComponent && (
                    <>
                        <div className="border-t border-gray-200 my-4"></div>
                        <div className="mt-4">{extraFilterComponent}</div>
                    </>
                )}
            </Widget>
        </>
    );
}
