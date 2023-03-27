import Widget from "components/Widget";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import Select, { MultiValue, SingleValue } from "react-select";
import { Badge, Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { SearchFieldListModel, SearchFilterModel } from "types/certificate";
import { SearchableFieldType, SearchCondition } from "types/openapi";
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
    availableFilters: SearchFieldListModel[];
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

    const [filterGroup, setFilterGroup] = useState<SingleValue<{ label: string, value: string }> | undefined>(undefined);
    const [filterField, setFilterField] = useState<SingleValue<{ label: string, value: string }> | undefined>(undefined);
    const [filterCondition, setFilterCondition] = useState<SingleValue<{ label: string, value: SearchCondition }> | undefined>(undefined);
    const [filterValue, setFilterValue] = useState<object | SingleValue<object | object[] | { label: string, value: object }> | MultiValue<object | object[] | { label: string, value: object }> | undefined>(undefined);

    const booleanOptions = useMemo(() => [{ label: "True", value: true }, { label: "False", value: false }], []);

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
                setFilterGroup(undefined);
                setFilterField(undefined);
                setFilterCondition(undefined);
                setFilterValue(undefined);
                return;
            }

            const field = availableFilters.find(f => f.groupName === currentFilters[selectedFilter].groupName)?.searchFieldData?.find(f => f.fieldIdentifier === currentFilters[selectedFilter].fieldIdentifier);
            if (!field) return;

            setFilterGroup({ label: currentFilters[selectedFilter].groupName, value: currentFilters[selectedFilter].groupName });
            setFilterField({ label: field.fieldLabel, value: field.fieldIdentifier + "^|^" + field.fieldLabel });
            setFilterCondition({ label: currentFilters[selectedFilter].condition, value: currentFilters[selectedFilter].condition });

            if (field.type === SearchableFieldType.String || field.type === SearchableFieldType.Number || field.type === SearchableFieldType.Date) {
                setFilterValue(currentFilters[selectedFilter].value);
                return;
            }

            if (field.type === SearchableFieldType.Boolean) {
                setFilterValue(booleanOptions.find(f => !!currentFilters[selectedFilter].value === f.value));
                return;
            }

            if (!field.multiValue) {
                setFilterValue({ label: currentFilters[selectedFilter].value, value: currentFilters[selectedFilter].value });
                return;
            }

            if (Array.isArray(currentFilters[selectedFilter].value)) {
                setFilterValue((currentFilters[selectedFilter].value as Array<object>).map((v: object) => ({ label: v, value: v })));
            }

        },
        [availableFilters, currentFilters, selectedFilter, booleanOptions],
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
            if (!filterField || !filterCondition) {
                return;
            }

            if (selectedFilter >= currentFilters.length) {
                setSelectedFilter(-1);
                return;
            }

            const updatedFilterItem: SearchFilterModel = {
                groupName: filterGroup?.value ?? "",
                fieldIdentifier: filterField.value.split("^|^")[0],
                condition: filterCondition.value,
                value: filterValue ? typeof filterValue === "string" ? filterValue : Array.isArray(filterValue) ? filterValue.map(v => (v as any).value) : (filterValue as any).value : "",
            };
            const newFilters = selectedFilter === -1 ? [...currentFilters, updatedFilterItem] : [...currentFilters.slice(0, selectedFilter), updatedFilterItem, ...currentFilters.slice(selectedFilter + 1)];
            onFiltersChanged(newFilters);
        },
        [filterGroup, filterField, filterCondition, selectedFilter, currentFilters, filterValue, onFiltersChanged],
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

    const currentFields = useMemo(
        () => availableFilters.find(f => f.groupName === filterGroup?.value)?.searchFieldData,
        [availableFilters, filterGroup],
    );

    const currentField = useMemo(
        () => currentFields?.find(f => f.fieldIdentifier === filterField?.value.split("^|^")[0]),
        [filterField, currentFields],
    );

    const isFilterGroupAvailable = useMemo(() => availableFilters.some(a => a.groupName !== undefined), [availableFilters]);

    return (
        <>
            <Widget title={title} busy={isFetchingAvailableFilters}>
                <div id="unselectFilters" onClick={onUnselectFiltersClick}>
                    <div style={{ width: "99%", borderBottom: "solid 1px silver", marginBottom: "1rem" }}>
                        <Row>

                            {isFilterGroupAvailable &&
                                <Col>
                                    <FormGroup>
                                        <Label for="group">Filter Field Source</Label>
                                        <Select
                                            id="group"
                                            options={availableFilters.map(f => ({ label: f.groupName ?? "", value: f.groupName ?? "" }))}
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
                            }

                            <Col>
                                <FormGroup>
                                    <Label for="field">Filter Field</Label>
                                    <Select
                                        id="field"
                                        options={currentFields?.map(f => ({ label: f.fieldLabel, value: f.fieldIdentifier  + "^|^" + f.fieldLabel }))}
                                        onChange={(e) => {
                                            setFilterField(e);
                                            setFilterCondition(undefined);
                                            setFilterValue(undefined);
                                        }}
                                        value={filterField || null}
                                        isDisabled={isFilterGroupAvailable && !filterGroup}
                                        isClearable={true}
                                    />
                                </FormGroup>
                            </Col>

                            <Col>
                                <FormGroup>
                                    <Label for="conditions">Filter Condition</Label>
                                    <Select
                                        id="conditions"
                                        options={filterField ? currentField?.conditions.map(c => ({ label: c, value: c })) : undefined}
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
                                    <Label for="value">Filter Value</Label>
                                    {
                                        currentField?.type === undefined || currentField?.type === SearchableFieldType.String || currentField?.type === SearchableFieldType.Date || currentField?.type === SearchableFieldType.Number
                                            ? (
                                                <Input
                                                    id="value"
                                                    type={currentField?.type === SearchableFieldType.Date ? "date" : "text"}
                                                    value={filterValue?.toString() || ""}
                                                    onChange={(e) => {
                                                        setFilterValue(JSON.parse(JSON.stringify(e.target.value)));
                                                    }}
                                                    placeholder="Enter filter value"
                                                    disabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                                />
                                            ) : currentField?.type === SearchableFieldType.Boolean ? (
                                                <Select
                                                    id="value"
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
                                                    options={filterField ? (currentField?.value as string[])?.map(v => ({ label: v, value: v })) : undefined}
                                                    value={filterValue || null}
                                                    onChange={(e) => {
                                                        setFilterValue(e);
                                                    }}
                                                    isMulti={currentField?.multiValue}
                                                    isClearable={true}
                                                    isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                                />
                                            )
                                    }
                                </FormGroup>
                            </Col>

                            <Col md="auto">
                                <Button
                                    style={{ width: "7em", marginTop: "2em" }}
                                    color="primary"
                                    disabled={!filterField || !filterCondition || (!noValue[filterCondition.value] && !filterValue)}
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
                                const field = availableFilters.find(a => a.groupName === f.groupName)?.searchFieldData?.find(s => s.fieldIdentifier === f.fieldIdentifier)
                                const label = field ? field.fieldLabel : f.fieldIdentifier;
                                const value = (field && field.type === SearchableFieldType.Boolean ?
                                    `'${booleanOptions.find(b => !!f.value === b.value)?.label}'` :
                                    Array.isArray(f.value) && f.value.length > 1 ?
                                        `(${f.value.map(v => `'${v}'`).join(" OR ")})` :
                                        f.value ?
                                            `'${f.value}'` :
                                            "");
                                return (
                                    <Badge className={styles.filterBadge} key={f.fieldIdentifier + i} onClick={() => toggleFilter(i)}
                                        color={selectedFilter === i ? "primary" : "secondary"}>
                                        {isFilterGroupAvailable && <b>{f.groupName}&nbsp;</b>}
                                        '{label}'&nbsp;
                                        {f.condition}&nbsp;
                                        {value}
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
