import Widget from "components/Widget";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import Select, { MultiValue, SingleValue } from "react-select";
import { Badge, Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { SearchFieldModel, SearchFilterModel } from "types/certificate";
import { SearchableFields, SearchableFieldType, SearchCondition } from "types/openapi";
import styles from "./FilterWidget.module.scss";

const noValue: { [condition in SearchCondition]: boolean } = {
    [SearchCondition.Equals]: false,
    [SearchCondition.NotEquals]: false,
    [SearchCondition.Greater]: false,
    [SearchCondition.Lesser]: false,
    [SearchCondition.Contains]: false,
    [SearchCondition.NotContains]: false,
    [SearchCondition.StartsWith]: false,
    [SearchCondition.EndsWith]: false,
    [SearchCondition.Empty]: true,
    [SearchCondition.NotEmpty]: true,
    [SearchCondition.Success]: true,
    [SearchCondition.Failed]: true,
    [SearchCondition.Unknown]: true,
    [SearchCondition.NotChecked]: true,
};

interface Props {
    title: string;
    onFiltersChanged: (filters: SearchFilterModel[]) => void;
    availableFilters: SearchFieldModel[];
    currentFilters: SearchFilterModel[];
    isFetchingAvailableFilters: boolean;
}

export default function FilterWidget({
                                         title,
                                         onFiltersChanged,
                                         availableFilters,
                                         isFetchingAvailableFilters,
                                         currentFilters,
                                     }: Props) {
    const [selectedFilter, setSelectedFilter] = useState<number>(-1);

    const [filterField, setFilterField] = useState<SingleValue<{ label: string, value: SearchableFields }> | undefined>(undefined);
    const [filterCondition, setFilterCondition] = useState<SingleValue<{ label: string, value: SearchCondition }> | undefined>(undefined);
    const [filterValue, setFilterValue] = useState<object | SingleValue<object | object[] | { label: string, value: object }> | MultiValue<object | object[] | { label: string, value: object }> | undefined>(undefined);

    useEffect(
        () => {
            onFiltersChanged(currentFilters);
        },
        [currentFilters, onFiltersChanged],
    );

    useEffect(
        () => {

            if (selectedFilter >= currentFilters.length) {
                setSelectedFilter(-1);
                return;
            }

            if (selectedFilter === -1) {
                setFilterField(undefined);
                setFilterCondition(undefined);
                setFilterValue(undefined);
                return;
            }

            const field = availableFilters.find(f => f.field === currentFilters[selectedFilter].field);
            if (!field) return;

            setFilterField({label: field.label, value: field.field});
            setFilterCondition({label: currentFilters[selectedFilter].condition, value: currentFilters[selectedFilter].condition});

            if (field.type === SearchableFieldType.String || field.type === SearchableFieldType.Number) {
                setFilterValue(currentFilters[selectedFilter].value);
                return;
            }

            if (field.type === SearchableFieldType.Date) {
                setFilterValue(currentFilters[selectedFilter].value);
                return;
            }

            if (!field.multiValue) {
                setFilterValue({label: currentFilters[selectedFilter].value, value: currentFilters[selectedFilter].value});
                return;
            }

            if (Array.isArray(currentFilters[selectedFilter].value)) {
                setFilterValue((currentFilters[selectedFilter].value as Array<object>).map((v: object) => ({label: v, value: v})));
            }

        },
        [availableFilters, currentFilters, selectedFilter],
    );

    const onUnselectFiltersClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if ((e.target as HTMLDivElement).id === "unselectFilters") {
                setSelectedFilter(-1);
            }
        },
        [setSelectedFilter],
    );

    const onUpdateFilterClick = useCallback(
        () => {
            if (!filterField || !filterCondition /*|| !filterValue*/) {
                return;
            }

            if (selectedFilter >= currentFilters.length) {
                setSelectedFilter(-1);
                return;
            }

            const updatedFilterItem = {
                field: filterField.value,
                condition: filterCondition.value,
                value: filterValue ? typeof filterValue === "string" ? filterValue : Array.isArray(filterValue) ? filterValue.map(v => (v as any).value) : (filterValue as any).value : "",
            };
            const newFilters = selectedFilter === -1 ? [...currentFilters, updatedFilterItem] : [...currentFilters.slice(0, selectedFilter), updatedFilterItem, ...currentFilters.slice(selectedFilter + 1)];
            onFiltersChanged(newFilters);
        },
        [filterField, filterCondition, selectedFilter, currentFilters, filterValue, onFiltersChanged],
    );

    const onRemoveFilterClick = useCallback(
        (index: number) => {
            const newFilters = currentFilters.filter((_, i) => i !== index);
            onFiltersChanged(newFilters);
        },
        [currentFilters, onFiltersChanged],
    );

    const toggleFilter = useCallback(
        (index: number) => {
            setSelectedFilter(selectedFilter === index ? -1 : index);
        },
        [selectedFilter],
    );

    const currentFieldData = useMemo(
        () => availableFilters.find(f => f.field === filterField?.value),
        [availableFilters, filterField],
    );

    return (
        <>
            <Widget title={title} busy={isFetchingAvailableFilters}>
                <div id="unselectFilters" onClick={onUnselectFiltersClick}>
                    <div style={{width: "99%", borderBottom: "solid 1px silver", marginBottom: "1rem"}}>
                        <Row>

                            <Col>
                                <FormGroup>
                                    <Label for="field">Filter Field</Label>
                                    <Select
                                        id="field"
                                        options={availableFilters.map(f => ({label: f.label, value: f.field}))}
                                        onChange={(e) => {
                                            setFilterField(e);
                                            setFilterCondition(undefined);
                                            setFilterValue(undefined);
                                        }}
                                        value={filterField || null}
                                        isClearable={true}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="conditions">Filter Condition</Label>
                                    <Select
                                        id="conditions"
                                        options={filterField ? currentFieldData?.conditions.map(c => ({label: c, value: c})) : undefined}
                                        value={filterCondition || null}
                                        onChange={(e) => {
                                            setFilterCondition(e);
                                            if (e && noValue[e.value]) {
                                                setFilterValue(undefined);
                                            }
                                        }}
                                        isDisabled={!filterField}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="value">Filter Value</Label>
                                    {
                                        currentFieldData?.type === undefined || currentFieldData?.type === "string" || currentFieldData?.type === "date" || currentFieldData?.type === "number"
                                            ? (
                                                <Input
                                                    id="value"
                                                    type={currentFieldData?.type === "date" ? "date" : "text"}
                                                    value={filterValue?.toString() || ""}
                                                    onChange={(e) => {
                                                        setFilterValue(JSON.parse(JSON.stringify(e.target.value)));
                                                    }}
                                                    placeholder="Enter filter value"
                                                    disabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                                />
                                            ) : (
                                                <Select
                                                    id="value"
                                                    options={filterField ? (currentFieldData?.value as string[])?.map(v => ({label: v, value: v})) : undefined}
                                                    value={filterValue || null}
                                                    onChange={(e) => {
                                                        setFilterValue(e);
                                                    }}
                                                    isMulti={availableFilters.find(f => f.field === filterField?.value)?.multiValue}
                                                    isClearable={true}
                                                    isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                                />
                                            )
                                    }
                                </FormGroup>
                            </Col>

                            <Col md="auto">
                                <Button
                                    style={{width: "7em", marginTop: "2em"}}
                                    color="primary"
                                    disabled={!filterField || !filterCondition /*|| !filterValue*/}
                                    onClick={onUpdateFilterClick}
                                >
                                    {selectedFilter === -1 ? "Add" : "Update"}
                                </Button>
                            </Col>

                        </Row>
                    </div>
                    {
                        currentFilters.map(
                            (f, i) => {
                                const available = availableFilters.find(a => a.field === f.field);
                                const label = available ? available.label : f.field;
                                return (
                                    <Badge className={styles.filterBadge} key={f.field + i} onClick={() => toggleFilter(i)}
                                           color={selectedFilter === i ? "primary" : "secondary"}>
                                        '{label}'&nbsp;
                                        {f.condition}&nbsp;
                                        {Array.isArray(f.value) && f.value.length > 1 ? `(${f.value.map(v => `'${v}'`).join(" OR ")})` : f.value ? `'${f.value}'` : ""}
                                        <span className={styles.filterBadgeSpan} onClick={() => onRemoveFilterClick(i)}>&times;</span>
                                    </Badge>
                                )
                            },
                        )
                    }
                </div>
            </Widget>
        </>
    );
}
