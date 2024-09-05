import Widget from 'components/Widget';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiClients } from 'api';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, actions as filterActions, selectors } from 'ducks/filters';
import { useDispatch, useSelector } from 'react-redux';
import Select, { MultiValue, SingleValue } from 'react-select';
import { Badge, Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { Observable } from 'rxjs';
import { SearchFieldListModel } from 'types/certificate';
import { AttributeContentType, FilterFieldSource, FilterFieldType, PlatformEnum } from 'types/openapi';
import { ExecutionItemModel, ExecutionItemRequestModel } from 'types/rules';
import { getFormTypeFromAttributeContentType, getFormTypeFromFilterFieldType, getStepValue } from 'utils/common-utils';
import {
    checkIfFieldAttributeTypeIsDate,
    getFormattedDate,
    getFormattedDateByType,
    getFormattedDateTime,
    getFormattedUtc,
} from 'utils/dateUtil';
import styles from './FilterWidgetRuleAction.module.scss';

interface CurrentActionOptions {
    label: string;
    value: string | any;
}

interface Props {
    title: string;
    entity: EntityType;
    getAvailableFiltersApi: (apiClients: ApiClients) => Observable<Array<SearchFieldListModel>>;
    onActionsUpdate?: (actionRuleRequests: ExecutionItemModel[]) => void;
    ExecutionsList?: ExecutionItemModel[];
    includeIgnoreAction?: boolean;
    disableBadgeRemove?: boolean;
    busyBadges?: boolean;
}

export default function FilterWidgetRuleAction({
    ExecutionsList,
    onActionsUpdate,
    title,
    entity,
    getAvailableFiltersApi,
    includeIgnoreAction,
    disableBadgeRemove,
    busyBadges,
}: Props) {
    const dispatch = useDispatch();

    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));
    const [actions, setActions] = useState<ExecutionItemRequestModel[]>([]);

    const platformEnums = useSelector(enumSelectors.platformEnums);

    const availableFilters = useSelector(selectors.availableFilters(entity));
    const isFetchingAvailableFilters = useSelector(selectors.isFetchingFilters(entity));

    const [selectedFilter, setSelectedFilter] = useState<{ filterNumber: number; isEditEnabled: boolean }>({
        filterNumber: -1,
        isEditEnabled: false,
    });

    const [fieldSource, setFieldSource] = useState<SingleValue<{ label: string; value: FilterFieldSource }> | undefined>(undefined);

    const [filterField, setFilterField] = useState<SingleValue<{ label: string; value: string }> | undefined>(undefined);

    const [filterValue, setFilterValue] = useState<
        | string
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
        dispatch(filterActions.getAvailableFilters({ entity, getAvailableFiltersApi }));
    }, [dispatch, entity, getAvailableFiltersApi]);

    const onUnselectFiltersClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if ((e.target as HTMLDivElement).id === 'unselectFilters') {
                setSelectedFilter({ filterNumber: -1, isEditEnabled: false });
            }
        },
        [setSelectedFilter],
    );

    const currentFields = useMemo(
        () => availableFilters.find((f) => f.filterFieldSource === fieldSource?.value)?.searchFieldData,
        [availableFilters, fieldSource],
    );

    const currentField = useMemo(() => currentFields?.find((f) => f.fieldIdentifier === filterField?.value), [filterField, currentFields]);

    const onUpdateClick = useCallback(() => {
        if (!fieldSource?.value) return;
        if (!filterField?.value) return;
        if (!filterValue) return;

        const newExecution: ExecutionItemRequestModel = {
            fieldSource: fieldSource?.value,
            fieldIdentifier: filterField?.value,
            data: filterValue
                ? typeof filterValue === 'string'
                    ? filterValue
                    : Array.isArray(filterValue)
                      ? filterValue.map((v) => (v as any).value)
                      : (filterValue as any).value
                : undefined,
        };
        setFieldSource(undefined);
        setFilterField(undefined);
        setFilterValue(undefined);

        if (selectedFilter.filterNumber === -1) {
            let updatedActions = [];

            updatedActions = [...actions, newExecution];
            setActions(updatedActions);
            const updatedActionDataActions = updatedActions.map((a) => {
                const fieldOfAction = availableFilters
                    .find((f) => f.filterFieldSource === a.fieldSource)
                    ?.searchFieldData?.find((s) => s.fieldIdentifier === a.fieldIdentifier);
                return {
                    fieldSource: a.fieldSource,
                    fieldIdentifier: a.fieldIdentifier,
                    data: Array.isArray(a.data)
                        ? a.data.map((v) => {
                              if (typeof v === 'object' && v.hasOwnProperty('uuid')) {
                                  return v.uuid;
                              }
                              if (fieldOfAction?.attributeContentType && fieldOfAction && checkIfFieldAttributeTypeIsDate(fieldOfAction)) {
                                  if (v.hasOwnProperty('value')) {
                                      return getFormattedUtc(fieldOfAction.attributeContentType, v.value);
                                  }

                                  return getFormattedUtc(fieldOfAction.attributeContentType, v);
                              }
                              return v;
                          })
                        : fieldOfAction?.attributeContentType && fieldOfAction && checkIfFieldAttributeTypeIsDate(fieldOfAction)
                          ? [getFormattedUtc(fieldOfAction.attributeContentType, a.data as unknown as string) as Object]
                          : a.data,
                };
            });

            onActionsUpdate && onActionsUpdate(updatedActionDataActions);
            setSelectedFilter({ filterNumber: -1, isEditEnabled: false });
        } else {
            const updatedActions = actions.map((a, i) => (i === selectedFilter.filterNumber ? newExecution : a));
            setActions(updatedActions);
            const updatedActionDataActions = updatedActions.map((a) => {
                const fieldOfAction = availableFilters
                    .find((f) => f.filterFieldSource === a.fieldSource)
                    ?.searchFieldData?.find((s) => s.fieldIdentifier === a.fieldIdentifier);
                return {
                    fieldSource: a.fieldSource,
                    fieldIdentifier: a.fieldIdentifier,
                    data: Array.isArray(a.data)
                        ? a.data.map((v) => {
                              if (typeof v === 'object' && v.hasOwnProperty('uuid')) {
                                  return v.uuid;
                              }
                              if (fieldOfAction?.attributeContentType && fieldOfAction && checkIfFieldAttributeTypeIsDate(fieldOfAction)) {
                                  if (v.hasOwnProperty('value')) {
                                      return getFormattedUtc(fieldOfAction.attributeContentType, v.value);
                                  }
                                  return getFormattedUtc(fieldOfAction.attributeContentType, v);
                              }
                              return v;
                          })
                        : fieldOfAction?.attributeContentType && fieldOfAction && checkIfFieldAttributeTypeIsDate(fieldOfAction)
                          ? [getFormattedUtc(fieldOfAction.attributeContentType, a.data as unknown as string) as Object]
                          : a.data,
                };
            });
            onActionsUpdate && onActionsUpdate(updatedActionDataActions);
            setSelectedFilter({ filterNumber: -1, isEditEnabled: false });
        }
    }, [
        fieldSource,
        filterField,
        filterValue,
        setFieldSource,
        setFilterField,
        setFilterValue,
        actions,
        setActions,
        onActionsUpdate,
        selectedFilter,
        availableFilters,
    ]);

    useEffect(() => {
        if (selectedFilter.filterNumber === -1) {
            setFieldSource(undefined);
            setFilterField(undefined);
            setFilterValue(undefined);
        }
    }, [selectedFilter]);

    const onRemoveFilterClick = useCallback(
        (index: number) => {
            const newActions = actions.filter((_, i) => i !== index);
            setActions(newActions);
            if (onActionsUpdate) {
                const actionsWithItemsUuids = newActions.map((a) => {
                    const fieldOfAction = availableFilters
                        .find((f) => f.filterFieldSource === a.fieldSource)
                        ?.searchFieldData?.find((s) => s.fieldIdentifier === a.fieldIdentifier);
                    return {
                        fieldSource: a.fieldSource,
                        fieldIdentifier: a.fieldIdentifier,
                        data: Array.isArray(a.data)
                            ? a.data.map((v) => {
                                  if (typeof v === 'object' && v.hasOwnProperty('uuid')) {
                                      return v.uuid;
                                  }
                                  if (
                                      fieldOfAction?.attributeContentType &&
                                      fieldOfAction &&
                                      checkIfFieldAttributeTypeIsDate(fieldOfAction)
                                  ) {
                                      return getFormattedUtc(fieldOfAction.attributeContentType, v);
                                  }
                                  return v;
                              })
                            : fieldOfAction?.attributeContentType && fieldOfAction && checkIfFieldAttributeTypeIsDate(fieldOfAction)
                              ? [getFormattedUtc(fieldOfAction.attributeContentType, a.data as unknown as string) as Object]
                              : a.data,
                    };
                });
                onActionsUpdate(actionsWithItemsUuids);
                setSelectedFilter({ filterNumber: -1, isEditEnabled: false });
            }
        },
        [actions, onActionsUpdate, availableFilters],
    );

    const toggleFilter = useCallback(
        (index: number) => {
            setSelectedFilter({
                filterNumber: selectedFilter.filterNumber === index ? -1 : index,
                isEditEnabled: false,
            });
        },
        [selectedFilter],
    );

    const objectValueOptions: CurrentActionOptions[] = useMemo(() => {
        if (!currentField) return [];

        if (Array.isArray(currentField?.value)) {
            const objectOptions = currentField?.value?.map((v, i) => {
                let label = '';
                let value = '';
                if (typeof v === 'string') {
                    if (checkIfFieldAttributeTypeIsDate(currentField)) {
                        label = getFormattedDateTime(v);
                    } else {
                        label = v;
                    }
                    value = v;
                } else {
                    if (checkIfFieldAttributeTypeIsDate(currentField)) {
                        label = v.label;
                        value = v.value;
                    } else {
                        label = v?.name || JSON.stringify(v);
                        value = v;
                    }
                }

                return { label, value };
            });
            if (selectedFilter.filterNumber === -1) return objectOptions;
            const currentActionData = actions[selectedFilter.filterNumber]?.data;

            if (currentActionData === undefined) return objectOptions;
            const filteredOptions = objectOptions.filter((o) => {
                if (Array.isArray(currentActionData)) {
                    return !currentActionData.some((a) => a?.name === o?.label);
                } else {
                    return (currentActionData as unknown as string) !== o?.value;
                }
            });

            if (checkIfFieldAttributeTypeIsDate(currentField)) {
                const currentActionLabel = getFormattedDateTime(currentActionData as unknown as string);

                if (Array.isArray(currentActionData)) {
                    // return filteredOptions;
                    const dateFilteredOptions = objectOptions.filter((o) => {
                        return !currentActionData.some((a) => currentActionLabel === o?.label);
                    });

                    return dateFilteredOptions;
                } else {
                    const dateFilteredOptions = objectOptions.filter((o) => {
                        return currentActionLabel !== o?.label;
                    });

                    return dateFilteredOptions;
                }
            } else {
                return filteredOptions;
            }
        }

        return [];
    }, [currentField, actions, selectedFilter]);
    const updateFilterValueDateTime = useCallback(() => {
        const currentActionData = actions[selectedFilter.filterNumber]?.data;
        const currentFieldThis = currentFields?.find((f) => f.fieldIdentifier === actions[selectedFilter.filterNumber]?.fieldIdentifier);
        if (currentFieldThis && currentFieldThis.attributeContentType && checkIfFieldAttributeTypeIsDate(currentFieldThis)) {
            if (currentFieldThis.type === 'list') {
                if (Array.isArray(currentActionData)) {
                    const newFilterValue = currentActionData.map((v: any) => {
                        let label = '';
                        let value = '';
                        if (typeof v === 'string') {
                            if (checkIfFieldAttributeTypeIsDate(currentFieldThis)) {
                                label = getFormattedDateTime(v);
                            } else {
                                label = v;
                            }
                            value = v;
                        } else {
                            if (checkIfFieldAttributeTypeIsDate(currentFieldThis)) {
                                label = v.label;
                                value = v.value;
                            } else {
                                label = v?.name || JSON.stringify(v);
                                value = v;
                            }
                        }

                        return { label, value };
                    });
                    setFilterValue(newFilterValue);
                    setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
                    return;
                } else {
                    const value = currentActionData;
                    const label = getFormattedDateTime(value as unknown as string);

                    setFilterValue({ label, value });
                    setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
                    return;
                }
            } else {
                const value = currentActionData;
                const label = getFormattedDateTime(value as unknown as string);
                const formattedDate = getFormattedDateByType(value as unknown as string, currentFieldThis.attributeContentType);
                setFilterValue(formattedDate);

                setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
                return;
            }
        }
    }, [actions, selectedFilter, currentFields]);
    useEffect(() => {
        // this effect is for updating dropdowns when a filter is selected

        if (selectedFilter.filterNumber >= actions.length) {
            setSelectedFilter({ filterNumber: -1, isEditEnabled: false });
            return;
        }

        if (selectedFilter.filterNumber === -1) {
            return;
        }

        // if edit is enabled that means the values are already set
        if (selectedFilter.isEditEnabled) {
            return;
        }

        const field = actions[selectedFilter.filterNumber].fieldSource;
        if (!field) {
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
            return;
        }

        setFieldSource({ label: getEnumLabel(searchGroupEnum, field), value: field });

        const fieldIdentifier = actions[selectedFilter.filterNumber].fieldIdentifier;
        const fieldIdentifierSelected = currentFields?.find((cf) => cf.fieldIdentifier === fieldIdentifier);
        if (!fieldIdentifier) {
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
            return;
        }

        if (fieldIdentifierSelected) {
            setFilterField({
                label: fieldIdentifierSelected.fieldLabel,
                value: fieldIdentifier,
            });
        } else {
            setFilterField({
                label: fieldIdentifier,
                value: fieldIdentifier,
            });
        }

        const currentActionData = actions[selectedFilter.filterNumber].data;
        if (currentActionData === undefined) return;

        const thisCurrentField = currentFields?.find((f) => f.fieldIdentifier === fieldIdentifier);

        if (thisCurrentField?.type === FilterFieldType.String || thisCurrentField?.type === FilterFieldType.Number) {
            setFilterValue(currentActionData);
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
            return;
        }

        if (thisCurrentField?.type === FilterFieldType.Boolean) {
            setFilterValue(booleanOptions.find((f) => !!currentActionData === f.value));
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });

            return;
        }

        if (thisCurrentField && thisCurrentField.attributeContentType && checkIfFieldAttributeTypeIsDate(thisCurrentField)) {
            updateFilterValueDateTime();
        }

        if (thisCurrentField && !thisCurrentField?.multiValue && !checkIfFieldAttributeTypeIsDate(thisCurrentField)) {
            const value = currentActionData;
            const label = thisCurrentField.platformEnum
                ? platformEnums[thisCurrentField.platformEnum][value as unknown as string].label
                : value;
            setFilterValue({ label, value });
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });

            return;
        }

        if (thisCurrentField && thisCurrentField?.multiValue && !checkIfFieldAttributeTypeIsDate(thisCurrentField)) {
            const value = currentActionData;
            const label = thisCurrentField.platformEnum
                ? platformEnums[thisCurrentField.platformEnum][value as unknown as string].label
                : value;
            setFilterValue({ label, value });
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
        }

        if (thisCurrentField && Array.isArray(currentActionData) && !checkIfFieldAttributeTypeIsDate(thisCurrentField)) {
            const newFilterValue = currentActionData.map((v: any) => {
                let label = '';
                let value = '';
                if (typeof v === 'string') {
                    label = v;
                    value = v;
                } else {
                    label = v?.name || v?.label || JSON.stringify(v);
                    value = v?.value || v;
                }

                return { label, value };
            });

            setFilterValue(newFilterValue);
            setSelectedFilter({ filterNumber: selectedFilter.filterNumber, isEditEnabled: true });
        }
    }, [
        selectedFilter,
        actions,
        currentFields,
        // executionTypeEnum,
        updateFilterValueDateTime,
        booleanOptions,
        // currentField,
        platformEnums,
        searchGroupEnum,
    ]);

    useEffect(() => {
        // this effect is for updating the actions when the ExecutionsList is passed
        if (!ExecutionsList) return;

        const isActionDataObject = ExecutionsList.some((a) => typeof a.data === 'object');
        if (!isActionDataObject) {
            setActions(ExecutionsList);
            return;
        }

        const updatedActions = ExecutionsList.map((action) => {
            if (!(typeof action.data === 'object')) return action;

            if (Array.isArray(action.data) && action.data.every((v) => typeof v === 'string')) {
                const thisCurrentFields = availableFilters.find((f) => f.filterFieldSource === action.fieldSource)?.searchFieldData;
                if (!thisCurrentFields) return action;
                const thisCurrentField = thisCurrentFields.find((f) => f.fieldIdentifier === action.fieldIdentifier);

                if (!thisCurrentField || !Array.isArray(thisCurrentField.value)) return action;

                const updatedActionData = action.data.map((v) => {
                    const value = (thisCurrentField.value as Array<any>)?.find((f) => f.uuid === v);

                    return value ? { uuid: value.uuid, name: value.name } : { label: v, value: v };
                });

                return {
                    ...action,
                    data: updatedActionData,
                };
            } else return action;
        });

        setActions(updatedActions);
    }, [ExecutionsList, availableFilters]);

    const renderObjectValueSelector = useMemo(
        () => (
            <Select
                id="value"
                options={objectValueOptions}
                value={filterValue}
                onChange={(e) => {
                    setFilterValue(e);
                }}
                isMulti={currentField?.multiValue}
                placeholder="Select filter value from options"
            />
        ),
        [objectValueOptions, filterValue, currentField],
    );

    const renderBadgeContent = useCallback(
        (itemNumber: number, value: string, label?: string, fieldSource?: string) => {
            if (isFetchingAvailableFilters || busyBadges) return <></>;
            return (
                <React.Fragment key={itemNumber}>
                    {/* {getEnumLabel(executionTypeEnum, actionType)}&nbsp; */}
                    <b>{fieldSource && getEnumLabel(searchGroupEnum, fieldSource)}&nbsp;</b>'{label}
                    '&nbsp;to&nbsp;
                    {value}
                    {!disableBadgeRemove && (
                        <span className={styles.filterBadgeSpan} onClick={() => onRemoveFilterClick(itemNumber)}>
                            &times;
                        </span>
                    )}
                </React.Fragment>
            );
        },
        [isFetchingAvailableFilters, onRemoveFilterClick, searchGroupEnum, disableBadgeRemove, busyBadges],
    );

    const isUpdateButtonDisabled = useMemo(() => !filterField || !fieldSource || !filterValue, [filterField, fieldSource, filterValue]);

    return (
        <>
            <Widget title={title} busy={isFetchingAvailableFilters} titleSize="larger">
                <div id="unselectFilters" onClick={onUnselectFiltersClick}>
                    <div style={{ width: '99%', borderBottom: 'solid 1px silver', marginBottom: '1rem' }}>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="groupSelect">Field Source</Label>
                                    <Select
                                        id="group"
                                        inputId="groupSelect"
                                        options={availableFilters.map((f) => ({
                                            label: getEnumLabel(searchGroupEnum, f.filterFieldSource),
                                            value: f.filterFieldSource,
                                        }))}
                                        onChange={(e) => {
                                            setFieldSource(e);
                                            setFilterField(undefined);
                                            setFilterValue(undefined);
                                        }}
                                        value={fieldSource || null}
                                        isClearable={true}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="fieldSelect">Field</Label>
                                    <Select
                                        id="field"
                                        inputId="fieldSelect"
                                        options={currentFields?.map((f) => ({ label: f.fieldLabel, value: f.fieldIdentifier }))}
                                        onChange={(e) => {
                                            setFilterField(e);
                                            setFilterValue(undefined);
                                        }}
                                        value={filterField || null}
                                        isDisabled={!fieldSource}
                                        isClearable={true}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="valueSelect">Value</Label>
                                    {currentField?.type === undefined ||
                                    currentField?.type === FilterFieldType.String ||
                                    currentField?.type === FilterFieldType.Date ||
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
                                                    : undefined
                                            }
                                            value={filterValue?.toString() || ''}
                                            onChange={(e) => {
                                                setFilterValue(JSON.parse(JSON.stringify(e.target.value)));
                                            }}
                                            placeholder="Enter filter value"
                                            disabled={!filterField}
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
                                            isDisabled={!filterField}
                                        />
                                    ) : (
                                        renderObjectValueSelector
                                    )}
                                </FormGroup>
                            </Col>

                            <Col md="auto">
                                <Button
                                    style={{ width: '7em', marginTop: '2em' }}
                                    color="primary"
                                    onClick={onUpdateClick}
                                    disabled={isUpdateButtonDisabled}
                                >
                                    {selectedFilter.filterNumber === -1 ? 'Add' : 'Update'}
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {actions.map((f, i) => {
                        const field = availableFilters
                            .find((a) => a.filterFieldSource === f.fieldSource)
                            ?.searchFieldData?.find((s) => s.fieldIdentifier === f.fieldIdentifier);
                        const label = field ? field.fieldLabel : f.fieldIdentifier;
                        const value =
                            field && field.type === FilterFieldType.Boolean
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
                                                          : field && checkIfFieldAttributeTypeIsDate(field)
                                                            ? v?.label
                                                                ? getFormattedDateTime(v?.label)
                                                                : getFormattedDateTime(v)
                                                            : v?.label
                                                              ? v.label
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
                            <Badge
                                className={styles.filterBadge}
                                key={i}
                                onClick={() => toggleFilter(i)}
                                color={selectedFilter.filterNumber === i ? 'primary' : 'secondary'}
                            >
                                {!isFetchingAvailableFilters && !busyBadges && <>{renderBadgeContent(i, value, label, f.fieldSource)}</>}
                            </Badge>
                        );
                    })}
                </div>
            </Widget>
        </>
    );
}
