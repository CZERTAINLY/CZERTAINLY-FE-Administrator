import Widget from 'components/Widget';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiClients } from 'api';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, actions, selectors } from 'ducks/filters';
import { useDispatch, useSelector } from 'react-redux';
import Select, { MultiValue, SingleValue } from 'react-select';
import { Badge, Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
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
    checkIfFieldTypeIsDate,
    getFormattedDate,
    getFormattedDateTime,
    getFormattedUtc,
} from 'utils/dateUtil';
import styles from './FilterWidget.module.scss';

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
}

export default function FilterWidget({ onFilterUpdate, title, entity, getAvailableFiltersApi, disableBadgeRemove, busyBadges }: Props) {
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
        | undefined
    >(undefined);

    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
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
                        label = currentField?.platformEnum ? getEnumLabel(platformEnums[currentField.platformEnum], v) : v;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableFilters, currentFilters, selectedFilter, booleanOptions, platformEnums, FilterConditionOperatorEnum, searchGroupEnum]);

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

        const updatedFilterItem: SearchFilterModel = {
            fieldSource: filterGroup.value,
            fieldIdentifier: filterField.value,
            condition: filterCondition.value,
            value: filterValue
                ? typeof filterValue === 'string'
                    ? field?.attributeContentType && checkIfFieldAttributeTypeIsDate(field)
                        ? getFormattedUtc(field.attributeContentType, filterValue)
                        : field?.type && checkIfFieldTypeIsDate(field.type)
                          ? getFormattedUtc(field.type, filterValue)
                          : filterValue
                    : Array.isArray(filterValue)
                      ? filterValue.map((v) => (v as any).value)
                      : (filterValue as any).value
                : undefined,
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
        () => availableFilters.find((f) => f.filterFieldSource === filterGroup?.value)?.searchFieldData,
        [availableFilters, filterGroup],
    );

    const currentField = useMemo(() => currentFields?.find((f) => f.fieldIdentifier === filterField?.value), [filterField, currentFields]);

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
                        <span className={styles.filterBadgeSpan} onClick={() => onRemoveFilterClick(itemNumber)}>
                            &times;
                        </span>
                    )}
                </React.Fragment>
            );
        },
        [isFetchingAvailableFilters, FilterConditionOperatorEnum, disableBadgeRemove, onRemoveFilterClick, searchGroupEnum, busyBadges],
    );

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
                                        }}
                                        value={filterGroup || null}
                                        isClearable={true}
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
                                        }}
                                        value={filterField || null}
                                        isDisabled={!filterGroup}
                                        isClearable={true}
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
                                        }}
                                        value={filterCondition || null}
                                        isDisabled={!filterField}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="valueSelect">Filter Value</Label>
                                    {currentField?.type === undefined ||
                                    currentField?.type === FilterFieldType.String ||
                                    currentField?.type === FilterFieldType.Date ||
                                    currentField?.type === FilterFieldType.Datetime ||
                                    currentField?.type === FilterFieldType.Number ? (
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
                                            value={filterValue?.toString() || ''}
                                            onChange={(e) => {
                                                setFilterValue(JSON.parse(JSON.stringify(e.target.value)));
                                            }}
                                            placeholder="Enter filter value"
                                            disabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                        />
                                    ) : currentField?.type === FilterFieldType.Boolean ? (
                                        <Select
                                            id="value"
                                            inputId="valueSelect"
                                            options={filterField ? booleanOptions : undefined}
                                            value={filterValue || null}
                                            onChange={(e) => {
                                                setFilterValue(e);
                                            }}
                                            isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                        />
                                    ) : (
                                        <Select
                                            id="value"
                                            inputId="valueSelect"
                                            options={objectValueOptions}
                                            value={filterValue || null}
                                            onChange={(e) => {
                                                setFilterValue(e);
                                            }}
                                            isMulti={currentField?.multiValue}
                                            isClearable={true}
                                            isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                        />
                                    )}
                                </FormGroup>
                            </Col>

                            <Col md="auto">
                                <Button
                                    style={{ width: '7em', marginTop: '2em' }}
                                    color="primary"
                                    disabled={!filterField || !filterCondition || (!noValue[filterCondition.value] && !filterValue)}
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
                        const value =
                            field && field.type === FilterFieldType.Boolean
                                ? `'${booleanOptions.find((b) => !!f.value === b.value)?.label}'`
                                : Array.isArray(f.value)
                                  ? `${f.value
                                        .map(
                                            (v) =>
                                                `'${
                                                    field?.platformEnum
                                                        ? platformEnums[field.platformEnum][v]?.label
                                                        : v?.name
                                                          ? v.name
                                                          : field && field?.attributeContentType === AttributeContentType.Date
                                                            ? getFormattedDate(v)
                                                            : field && field?.attributeContentType === AttributeContentType.Datetime
                                                              ? getFormattedDateTime(v)
                                                              : v
                                                }'`,
                                        )
                                        .join(' OR ')}`
                                  : f.value
                                    ? `'${
                                          field?.platformEnum
                                              ? platformEnums[field.platformEnum][f.value as unknown as string]?.label
                                              : (field && field?.attributeContentType === AttributeContentType.Date) ||
                                                  (field?.type === FilterFieldType.Date &&
                                                      field?.attributeContentType !== AttributeContentType.Datetime)
                                                ? getFormattedDate(f.value as unknown as string)
                                                : (field && field?.attributeContentType === AttributeContentType.Datetime) ||
                                                    field?.type === FilterFieldType.Datetime
                                                  ? getFormattedDateTime(f.value as unknown as string)
                                                  : f.value
                                      }'`
                                    : '';
                        return (
                            <Badge
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
            </Widget>
        </>
    );
}
