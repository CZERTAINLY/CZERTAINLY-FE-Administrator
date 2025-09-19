import Widget from 'components/Widget';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiClients } from '../../api';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, actions, selectors } from 'ducks/filters';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components, MultiValue, SingleValue } from 'react-select';
import { Badge, Button, Col, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
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
import styles from './FilterWidget.module.scss';
import {
    getInputStringFromIso8601String as getDurationStringFromIso8601String,
    getIso8601StringFromInputString as getIso8601StringFromDurationString,
} from 'utils/duration';
import { validateDuration } from 'utils/validators';
import { parse } from 'regexp-tree';

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
}

export default function FilterWidget({
    onFilterUpdate,
    title,
    entity,
    getAvailableFiltersApi,
    disableBadgeRemove,
    busyBadges,
    extraFilterComponent,
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
        | object
        | SingleValue<object | object[] | { label: string; value: object }>
        | MultiValue<object | object[] | { label: string; value: object }>
        | number
        | undefined
    >(undefined);
    const [regexError, setRegexError] = useState<string>('');

    const validateRegex = useCallback((value: string): string => {
        if (!value) return '';

        try {
            parse(`/${value}/`);
        } catch {
            return 'Invalid regex pattern';
        }

        if (hasUnclosedConstructs(value)) {
            return 'Incomplete regex pattern';
        }

        if (hasIncompleteQuantifier(value)) {
            return 'Incomplete quantifier in regex';
        }

        return '';
    }, []);

    function hasIncompleteQuantifier(regex: string): boolean {
        const quantifierPattern = /\{(\d*,?\d*)?$/;
        return quantifierPattern.test(regex);
    }

    function hasUnclosedConstructs(regex: string): boolean {
        const stack: string[] = [];
        for (let i = 0; i < regex.length; i++) {
            const char = regex[i];

            if (char === '\\') {
                i++;
                continue;
            }

            if (char === '(' || char === '[' || char === '{') {
                stack.push(char);
            } else if (char === ')' || char === ']' || char === '}') {
                const last = stack.pop();
                if (!last) return true; // closing without opening
                if ((char === ')' && last !== '(') || (char === ']' && last !== '[') || (char === '}' && last !== '{')) {
                    return true; // mismatched closing
                }
            }
        }

        // Trailing unclosed backslash
        if (regex.endsWith('\\')) return true;

        return stack.length > 0; // unclosed openings
    }

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
                setFilterValue(JSON.parse(JSON.stringify(dateVal)));
                return;
            }
            if (field.attributeContentType === AttributeContentType.Datetime) {
                const dateTimeVal = getFormattedDateTime(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(JSON.parse(JSON.stringify(dateTimeVal)));
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
                setFilterValue(JSON.parse(JSON.stringify(duration)));
                return;
            }
            if (field.type === FilterFieldType.Datetime) {
                const dateTimeVal = getFormattedDateTime(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(JSON.parse(JSON.stringify(dateTimeVal)));
                return;
            }
            if (field.type === FilterFieldType.Date) {
                const dateVal = getFormattedDate(currentFilters[selectedFilter].value as unknown as string);
                setFilterValue(JSON.parse(JSON.stringify(dateVal)));
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
            const currentValue = currentFilters[selectedFilter].value as Array<object>;
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

        // Check regex validation for COMMON_NAME MATCHES condition
        const isRegex = filterField?.value === 'COMMON_NAME' && filterCondition?.value === 'MATCHES';
        if (isRegex) {
            return !regexError;
        }

        return true;
    }, [filterCondition, filterValue, filterField, regexError]);

    const objectValueOptions: ObjectValueOptions[] = useMemo(
        () => {
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

                const currentValue = currentFilters[selectedFilter].value;
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentField, currentFilters, selectedFilter],
    );

    const getBadgeContent = useCallback(
        (itemNumber: number, fieldSource: string, fieldCondition: string, label: string, value: string) => {
            if (isFetchingAvailableFilters || busyBadges) return <></>;
            return (
                <React.Fragment key={itemNumber}>
                    <b>{getEnumLabel(searchGroupEnum, fieldSource)}&nbsp;</b>'{label}'&nbsp;
                    {getEnumLabel(FilterConditionOperatorEnum, fieldCondition)}&nbsp;
                    {value}
                    {!disableBadgeRemove && (
                        <span
                            data-testid="filter-badge-span"
                            className={styles.filterBadgeSpan}
                            onClick={() => onRemoveFilterClick(itemNumber)}
                        >
                            &times;
                        </span>
                    )}
                </React.Fragment>
            );
        },
        [isFetchingAvailableFilters, FilterConditionOperatorEnum, disableBadgeRemove, onRemoveFilterClick, searchGroupEnum, busyBadges],
    );

    const renderFilterValueInput = useCallback(() => {
        function renderDurationInput() {
            return (
                <>
                    <Input
                        id="valueSelect"
                        type="text"
                        value={filterValue?.toString() ?? ''}
                        onChange={(e) => {
                            setFilterValue(JSON.parse(JSON.stringify(e.target.value)));
                        }}
                        placeholder="eg. 2d 30m"
                    />
                    <FormText>Duration in format: 0d 0h 0m 0s</FormText>
                </>
            );
        }
        function renderTextOrDateInput() {
            const isRegex = filterField?.value === 'COMMON_NAME' && filterCondition?.value === 'MATCHES';
            return (
                <>
                    <Input
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
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilterValue(JSON.parse(JSON.stringify(value)));

                            if (isRegex) {
                                const error = validateRegex(value);
                                setRegexError(error);
                            } else {
                                setRegexError('');
                            }
                        }}
                        placeholder={isRegex ? 'Enter regex value' : 'Enter filter value'}
                        disabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                        invalid={isRegex && !!regexError}
                    />
                    {isRegex && regexError && (
                        <FormText color="danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {regexError}
                        </FormText>
                    )}
                </>
            );
        }
        function renderBooleanInput() {
            return (
                <Select
                    id="value"
                    inputId="valueSelect"
                    options={filterField ? booleanOptions : undefined}
                    value={filterValue ?? null}
                    onChange={(e) => {
                        setFilterValue(e);
                    }}
                    isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                    components={{
                        Menu: (props) => (
                            <components.Menu {...props} innerProps={{ ...props.innerProps, 'data-testid': 'value-menu' } as any} />
                        ),
                    }}
                />
            );
        }
        function renderDefaultInput() {
            return (
                <Select
                    id="value"
                    inputId="valueSelect"
                    options={objectValueOptions}
                    value={filterValue ?? null}
                    onChange={(e) => {
                        setFilterValue(e);
                    }}
                    isMulti={currentField?.multiValue}
                    isClearable={true}
                    isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                    components={{
                        Menu: (props) => (
                            <components.Menu {...props} innerProps={{ ...props.innerProps, 'data-testid': 'value-menu' } as any} />
                        ),
                    }}
                />
            );
        }
        function renderNumberInput() {
            const numericValue = Number(filterValue);
            const displayValue = isNaN(numericValue) ? '' : numericValue;

            return (
                <Input
                    id="valueSelect"
                    type="number"
                    step="1"
                    value={displayValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Only allow integer values
                        if (value === '' || /^\d+$/.test(value)) {
                            setFilterValue(value === '' ? undefined : Number(value));
                        }
                    }}
                    onKeyDown={(e) => {
                        // Prevent decimal point, minus, and other non-integer characters
                        if (['.', '-', 'e', 'E'].includes(e.key)) {
                            e.preventDefault();
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
        validateRegex,
    ]);
    return (
        <>
            <Widget title={title} busy={isFetchingAvailableFilters} titleSize="larger">
                <div id="unselectFilters" onClick={onUnselectFiltersClick}>
                    <div style={{ width: '99%', borderBottom: 'solid 1px silver', marginBottom: '1rem' }}>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="groupSelectInput">Filter Field Source</Label>
                                    <Select
                                        id="group"
                                        inputId="groupSelectInput"
                                        options={availableFilters.map((f) => ({
                                            label: getEnumLabel(searchGroupEnum, f.filterFieldSource),
                                            value: f.filterFieldSource,
                                        }))}
                                        onChange={(e) => {
                                            setFilterGroup(e);
                                            setFilterField(undefined);
                                            setFilterCondition(undefined);
                                            setFilterValue(undefined);
                                            setRegexError('');
                                        }}
                                        value={filterGroup || null}
                                        isClearable={true}
                                        components={{
                                            Menu: (props) => (
                                                <components.Menu
                                                    {...props}
                                                    innerProps={{ ...props.innerProps, 'data-testid': 'group-menu' } as any}
                                                />
                                            ),
                                            Control: (props) => (
                                                <components.Control
                                                    {...props}
                                                    innerProps={{ ...props.innerProps, 'data-testid': 'group-control' } as any}
                                                />
                                            ),
                                        }}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="fieldSelectInput">Filter Field</Label>
                                    <Select
                                        id="field"
                                        inputId="fieldSelectInput"
                                        options={currentFields?.map((f) => ({ label: f.fieldLabel, value: f.fieldIdentifier }))}
                                        onChange={(e) => {
                                            setFilterField(e);
                                            setFilterCondition(undefined);
                                            setFilterValue(undefined);
                                            setRegexError('');
                                        }}
                                        value={filterField || null}
                                        isDisabled={!filterGroup}
                                        isClearable={true}
                                        components={{
                                            Menu: (props) => (
                                                <components.Menu
                                                    {...props}
                                                    innerProps={{ ...props.innerProps, 'data-testid': 'field-menu' } as any}
                                                />
                                            ),
                                            Control: (props) => (
                                                <components.Control
                                                    {...props}
                                                    innerProps={{ ...props.innerProps, 'data-testid': 'field-control' } as any}
                                                />
                                            ),
                                        }}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="conditionsSelectInput">Filter Condition</Label>
                                    <Select
                                        id="conditions"
                                        inputId="conditionsSelectInput"
                                        options={
                                            filterField
                                                ? currentField?.conditions.map((c) => ({
                                                      label: getEnumLabel(FilterConditionOperatorEnum, c),
                                                      value: c,
                                                  }))
                                                : undefined
                                        }
                                        onChange={(e) => {
                                            setFilterCondition(e);
                                            setFilterValue(undefined);
                                            setRegexError('');
                                        }}
                                        value={filterCondition || null}
                                        isDisabled={!filterField}
                                        components={{
                                            Menu: (props) => (
                                                <components.Menu
                                                    {...props}
                                                    innerProps={{ ...props.innerProps, 'data-testid': 'condition-menu' } as any}
                                                />
                                            ),
                                            Control: (props) => (
                                                <components.Control
                                                    {...props}
                                                    innerProps={{ ...props.innerProps, 'data-testid': 'condition-control' } as any}
                                                />
                                            ),
                                        }}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="valueSelect">Filter Value</Label>
                                    {renderFilterValueInput()}
                                </FormGroup>
                            </Col>

                            <Col md="auto">
                                <Button
                                    id="addFilter"
                                    style={{ width: '7em', marginTop: '2em' }}
                                    color="primary"
                                    disabled={
                                        !filterField ||
                                        !filterCondition ||
                                        !isValidValue ||
                                        (!noValue[filterCondition.value] && !filterValue)
                                    }
                                    onClick={onUpdateFilterClick}
                                >
                                    {selectedFilter === -1 ? 'Add' : 'Update'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
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
                                data-testid="filter-badge"
                                className={styles.filterBadge}
                                key={f.fieldIdentifier + i}
                                onClick={() => toggleFilter(i)}
                                color={selectedFilter === i ? 'primary' : 'secondary'}
                            >
                                {!isFetchingAvailableFilters && !busyBadges && getBadgeContent(i, f.fieldSource, f.condition, label, value)}
                            </Badge>
                        );
                    })}
                </div>
                {/* {appendInWidgetContent} */}
                {extraFilterComponent}
            </Widget>
        </>
    );
}
