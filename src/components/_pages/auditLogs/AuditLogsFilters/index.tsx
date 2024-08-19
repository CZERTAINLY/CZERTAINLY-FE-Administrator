import { FormApi } from 'final-form';
import createDecorator from 'final-form-calculate';
import { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup, Input, Label } from 'reactstrap';

import { AuditLogFilterModel } from 'types/auditLogs';
import styles from './auditLogsFilters.module.scss';

interface Props {
    operations: string[];
    operationStates: string[];
    objects: string[];
    onClear?: () => void;
    onFilters?: (filters: AuditLogFilterModel) => void;
}

const dateCalculator = createDecorator(
    {
        field: 'createdFrom',
        updates: {
            createdTo: (createdFromValue: string | undefined, allValues) => {
                const dateTo = (allValues as AuditLogFilterModel).createdTo;
                if (!createdFromValue) {
                    return undefined;
                } else if (!dateTo || new Date(dateTo).valueOf() < new Date(createdFromValue).valueOf()) {
                    return createdFromValue;
                }

                return dateTo;
            },
        },
    },
    {
        field: 'createdTo',
        updates: {
            createdFrom: (createdToValue: string | undefined, allValues) => {
                const dateFrom = (allValues as AuditLogFilterModel).createdFrom;
                if (!createdToValue) {
                    return undefined;
                } else if (!dateFrom || new Date(dateFrom).valueOf() > new Date(createdToValue).valueOf()) {
                    return createdToValue;
                }

                return dateFrom;
            },
        },
    },
);

const normalizeAllValue = (value?: string) => (value === '- All -' ? undefined : value);

function AuditLogsFilters({ objects, operationStates, operations, onClear, onFilters }: Props) {
    const submitCallback = useCallback(
        (values: AuditLogFilterModel) => {
            if (onFilters) {
                onFilters(values);
            }
        },
        [onFilters],
    );
    const clearCallback = (form: FormApi<AuditLogFilterModel>) => {
        form.reset();
        if (onClear) {
            onClear();
        }
    };

    return (
        <Form onSubmit={submitCallback} decorators={[dateCalculator]}>
            {({ form, handleSubmit, submitting }) => (
                <BootstrapForm onSubmit={handleSubmit}>
                    <div className={styles.filtersForm}>
                        <div className={styles.formLine}>
                            <Field name="author">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="author">Author</Label>
                                        <Input {...input} type="text" placeholder="Author name" disabled={submitting} id="author" />
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="createdFrom">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="createdFrom">Created between</Label>
                                        <Input {...input} type="date" placeholder="Created from" disabled={submitting} id="createdFrom" />
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="createdTo">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="createdTp">and</Label>
                                        <Input {...input} type="date" placeholder="Created to" disabled={submitting} id="createdTp" />
                                    </FormGroup>
                                )}
                            </Field>
                        </div>
                        <div className={styles.formLine}>
                            <Field name="affected" parse={normalizeAllValue}>
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="affected">Affected Data</Label>
                                        <Input {...input} type="select" disabled={submitting} id="affected">
                                            <option>- All -</option>
                                            {objects.map((op) => (
                                                <option key={op} value={op}>
                                                    {op}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="operation" parse={normalizeAllValue}>
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="operation">Operation</Label>
                                        <Input {...input} type="select" disabled={submitting} id="operation">
                                            <option>- All -</option>
                                            {operations.map((op) => (
                                                <option key={op} value={op}>
                                                    {op}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="operationStatus" parse={normalizeAllValue}>
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="operationStatus">Operation Status</Label>
                                        <Input {...input} type="select" disabled={submitting} id="operationStatus">
                                            <option>- All -</option>
                                            {operationStates.map((op) => (
                                                <option key={op} value={op}>
                                                    {op}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="origination" parse={normalizeAllValue}>
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="origination">Origination</Label>
                                        <Input {...input} type="select" disabled={submitting} id="origination">
                                            <option>- All -</option>
                                            {objects.map((op) => (
                                                <option key={op} value={op}>
                                                    {op}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="objectIdentifier">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="objectIdentifier">Object Identifier</Label>
                                        <Input
                                            {...input}
                                            type="text"
                                            placeholder="Object identifier"
                                            disabled={submitting}
                                            id="objectIdentifier"
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <ButtonGroup>
                            <Button type="reset" color="default" onClick={() => clearCallback(form)}>
                                Clear Filters
                            </Button>
                            <Button type="submit" color="primary">
                                Apply Filters
                            </Button>
                        </ButtonGroup>
                    </div>
                </BootstrapForm>
            )}
        </Form>
    );
}

export default AuditLogsFilters;
