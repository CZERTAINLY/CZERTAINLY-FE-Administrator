import cx from "classnames";
import styles from "./CertificateInventoryFilter.module.scss";

import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectors, actions } from "ducks/certificates"

import Select, { MultiValue, SingleValue } from "react-select";

import Widget from "components/Widget";
import { CertificateListQueryFilterModel } from "models/certificate";
import Dialog from "components/Dialog";
import { Badge, Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { CertificateFilterCondition } from "types/certificate";

const empty: CertificateListQueryFilterModel[] = [];

const noValue: { [condition in CertificateFilterCondition]: boolean } = {
   "EQUALS": false,
   "NOT_EQUALS": false,
   "GREATER": false,
   "LESSER": false,
   "CONTAINS": false,
   "NOT_CONTAINS": false,
   "STARTS_WITH": false,
   "ENDS_WITH": false,
   "EMPTY": true,
   "NOT_EMPTY": true,
   "SUCCESS": true,
   "FAILED": true,
   "UNKNOWN": true,
   "NOT_CHECKED": true
}

interface Props {
   onFiltersChanged: (filters: CertificateListQueryFilterModel[]) => void;
}


export default function CertificateInventoryFilter({
   onFiltersChanged
}: Props) {

   const dispatch = useDispatch();

   const availableFilters = useSelector(selectors.availableCertificateFilters);
   const filters = useSelector(selectors.currentCertificateFilters);

   const isFetchingAvailableFilters = useSelector(selectors.isFetchingAvailablFilters);

   const [selectedFilter, setSelectedFilter] = useState<number>(-1);

   const [confirmClear, setConfirmClear] = useState(false);

   const [filterField, setFilterField] = useState<SingleValue<{ label: string, value: string }> | undefined>(undefined);
   const [filterCondition, setFilterCondition] = useState<SingleValue<{ label: string, value: CertificateFilterCondition }> | undefined>(undefined);
   const [filterValue, setFilterValue] = useState<string | SingleValue<string | string[] | { label: string, value: string }> | MultiValue<string | string[] | { label: string, value: string }> | undefined>(undefined);


   useEffect(
      () => {
         dispatch(actions.getAvailableCertificateFilters());
      },
      [dispatch]
   );


   useEffect(

      () => {
         onFiltersChanged(filters);
      },
      [filters, onFiltersChanged]

   );


   useEffect(

      () => {

         if (selectedFilter >= filters.length) {
            setSelectedFilter(-1);
            return;
         }

         if (selectedFilter === -1) {
            setFilterField(undefined);
            setFilterCondition(undefined);
            setFilterValue(undefined);
            return;
         }

         const field = availableFilters.find(f => f.field === filters[selectedFilter].field);
         if (!field) return;

         setFilterField({ label: field.label, value: field.field });
         setFilterCondition({ label: filters[selectedFilter].condition, value: filters[selectedFilter].condition });

         if (field.type === "string") {
            setFilterValue(filters[selectedFilter].value);
            return;
         }

         if (field.type === "date") {
            setFilterValue(filters[selectedFilter].value);
            return;
         }

         if (!field.multiValue) {
            setFilterValue({ label: filters[selectedFilter].value, value: filters[selectedFilter].value });
            return;
         }

         if (Array.isArray(filters[selectedFilter].value)) {
            setFilterValue(filters[selectedFilter].value.map((v: string) => ({ label: v, value: v })));
         }

      },
      [availableFilters, filters, selectedFilter]

   );


   const onUnselectFiltersClick = useCallback(

      (e: MouseEvent<HTMLDivElement>) => {
         if (e.currentTarget.id === "unselectFilters") { setSelectedFilter(-1) }
      },
      [setSelectedFilter]

   );


   const onUpdateFilterClick = useCallback(

      () => {

         if (!filterField || !filterCondition /*|| !filterValue*/) return;

         if (selectedFilter >= filters.length) {
            setSelectedFilter(-1);
            return;
         }

         if (selectedFilter === -1) {

            const newFilters = [...filters, {
               field: filterField.value,
               condition: filterCondition.value,
               value: filterValue ? typeof filterValue === "string" ? filterValue : Array.isArray(filterValue) ? filterValue.map(v => (v as any).value) : (filterValue as any).value : ""
            }]

            dispatch(actions.setCurrentFilters({ currentFilters: newFilters }));

            onFiltersChanged(newFilters);

         } else {

            const newFilters = [...filters.slice(0, selectedFilter), {
               field: filterField.value,
               condition: filterCondition.value,
               value: filterValue ? typeof filterValue === "string" ? filterValue : Array.isArray(filterValue) ? filterValue.map(v => (v as any).value) : (filterValue as any).value : ""
            }, ...filters.slice(selectedFilter + 1)]


            dispatch(actions.setCurrentFilters({ currentFilters: newFilters }));

            onFiltersChanged(newFilters);

         }

      },
      [filterField, filterCondition, selectedFilter, filters, filterValue, dispatch, onFiltersChanged]

   )


   const onRemoveFilterClick = useCallback(

      (index: number) => {

         const newFilters = filters.filter((_, i) => i !== index);
         dispatch(actions.setCurrentFilters({ currentFilters: newFilters }));

      },
      [dispatch, filters]

   )


   const toggleFilter = useCallback(

      (index: number) => {

         setSelectedFilter(selectedFilter === index ? -1 : index);

      },
      [selectedFilter]

   )


   const currentFieldData = useMemo(
      () => availableFilters.find(f => f.field === filterField?.value),
      [availableFilters, filterField]
   );


   return (

      <>

         <Widget title="Certificate Inventory Filter" busy={isFetchingAvailableFilters}>

            <div id="unselectFilters" onClick={onUnselectFiltersClick}>

               <div style={{ width: "99%", borderBottom: "solid 1px silver", marginBottom: "1rem" }}>
                  <Row>

                     <Col>

                        <FormGroup>

                           <Label for="field">Filter Field</Label>
                           <Select
                              id="field"
                              options={availableFilters.map(f => ({ label: f.label, value: f.field }))}
                              onChange={(e) => {
                                 setFilterField(e); setFilterCondition(undefined); setFilterValue(undefined)
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
                              options={filterField ? currentFieldData?.conditions.map(c => ({ label: c, value: c })) : undefined}
                              value={filterCondition || null}
                              onChange={(e) => { setFilterCondition(e); if (e && noValue[e.value]) { setFilterValue(undefined) } }}
                              isDisabled={!filterField}
                           />

                        </FormGroup>

                     </Col>

                     <Col>

                        <FormGroup>

                           <Label for="value">Filter Value</Label>

                           {
                              currentFieldData?.type === undefined || currentFieldData?.type === "string" || currentFieldData?.type === "date"
                                 ? (
                                    <Input
                                       id="value"
                                       type={currentFieldData?.type === "date" ? "date" : "text"}
                                       value={filterValue as string || ""}
                                       onChange={(e) => { setFilterValue(e.target.value) }}
                                       placeholder="Enter filter value"
                                       disabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                    />
                                 ) : (
                                    <Select
                                       id="value"
                                       options={filterField ? (currentFieldData?.value as string[])?.map(v => ({ label: v, value: v })) : undefined}
                                       value={filterValue || null}
                                       onChange={(e) => { setFilterValue(e); }}
                                       isMulti={availableFilters.find(f => f.field === filterField?.value)?.multiValue}
                                       isClearable={true}
                                       isDisabled={!filterField || !filterCondition || noValue[filterCondition.value]}
                                    />
                                 )
                           }

                        </FormGroup>

                     </Col>

                     <Col md={0.1}>

                        <Label>&nbsp;</Label>

                        <Button
                           style={{ width: "100%" }}
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
                  filters.map(
                     (f, i) => (

                        <Badge key={f.field + i} className={cx(styles.filterBadge)} onClick={() => toggleFilter(i)} data-selected={selectedFilter === i ? "true" : "false"}>
                           '{f.field}'&nbsp;
                           {f.condition}&nbsp;
                           {Array.isArray(f.value) && f.value.length > 1 ? `(${f.value.map(v => `'${v}'`).join(" OR ")})` : f.value ? `'${f.value}'` : ""}

                           <span
                              className={cx(styles.filterBadgeSpan)}
                              onClick={() => onRemoveFilterClick(i)}
                           >
                              &times;
                           </span>

                        </Badge>

                     )
                  )
               }

            </div>

         </Widget>

         <Dialog
            isOpen={confirmClear}
            caption="Clear Certificate Inventory Filters"
            body={`You are about to clear Certificate Inventory Filters. Is this what you want to do?`}
            toggle={() => setConfirmClear(false)}
            buttons={[
               { color: "danger", onClick: () => { dispatch(actions.setCurrentFilters({ currentFilters: empty })); setConfirmClear(false) }, body: "Yes, clear" },
               { color: "secondary", onClick: () => setConfirmClear(false), body: "Cancel" },
            ]}

         />

      </>

   )
}
