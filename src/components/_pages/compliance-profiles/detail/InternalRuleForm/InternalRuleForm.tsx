import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { ComplianceRuleListDto, ConditionItemRequestDto, Resource } from 'types/openapi';
import Select from 'react-select';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { useComplianceProfileResourceOptions } from 'utils/rules';
import { composeValidators, validateLength, validateRequired } from 'utils/validators';
import ProgressButton from 'components/ProgressButton';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { useDispatch, useSelector } from 'react-redux';
import ConditionFormFilter from 'components/ConditionFormFilter';
import { actions as complianceActions, selectors as complianceSelectors } from 'ducks/compliance-profiles';

type Props = {
    rule?: ComplianceRuleListDto | undefined;
    onCancel: () => void;
};

type FormValues = {
    name: string;
    description: string;
    resource: Resource;
    items: ConditionItemRequestDto[];
};

export default function InternalRuleForm({ rule, onCancel }: Props) {
    const dispatch = useDispatch();

    const { resourceOptionsWithComplianceProfile, isFetchingResourcesList } = useComplianceProfileResourceOptions();
    const isCreatingComplienceInternalRule = useSelector(complianceSelectors.isCreatingComplienceInternalRule);
    const isUpdatingComplienceInternalRule = useSelector(complianceSelectors.isUpdatingComplienceInternalRule);
    const isBusy = useMemo(
        () => isFetchingResourcesList || isCreatingComplienceInternalRule || isUpdatingComplienceInternalRule,
        [isFetchingResourcesList, isCreatingComplienceInternalRule, isUpdatingComplienceInternalRule],
    );

    const defaultValues: FormValues = useMemo(() => {
        if (rule) {
            return {
                name: rule.name,
                description: rule.description || '',
                resource: rule.resource,
                items: rule.conditionItems || [],
            };
        }
        return { name: '', description: '', resource: Resource.None, items: [] };
    }, [rule]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (rule) {
                dispatch(
                    complianceActions.updateComplienceInternalRule({
                        internalRuleUuid: rule.uuid,
                        complianceInternalRuleRequestDto: {
                            name: values.name,
                            description: values.description,
                            resource: values.resource,
                            conditionItems: values.items,
                        },
                    }),
                );
            } else {
                dispatch(
                    complianceActions.createComplienceInternalRule({
                        complianceInternalRuleRequestDto: {
                            name: values.name,
                            description: values.description,
                            resource: values.resource,
                            conditionItems: values.items,
                        },
                    }),
                );
            }

            onCancel();
        },
        [dispatch, onCancel, rule],
    );

    useEffect(() => {
        if (rule) {
            dispatch(
                filterActions.setCurrentFilters({
                    currentFilters: rule.conditionItems?.length
                        ? rule.conditionItems?.map((item) => ({
                              fieldSource: item.fieldSource,
                              fieldIdentifier: item.fieldIdentifier,
                              condition: item.operator,
                              value: item.value,
                          }))
                        : [],
                    entity: EntityType.CONDITIONS,
                }),
            );
        }
    }, [dispatch, rule]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    return (
        <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
            {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                <BootstrapForm onSubmit={handleSubmit}>
                    <Field name="name" validate={validateRequired()}>
                        {({ input, meta }) => (
                            <FormGroup>
                                <Label for="name">Internal Rule Name</Label>
                                <Input
                                    {...input}
                                    id="name"
                                    valid={!meta.error && meta.touched}
                                    invalid={!!meta.error && meta.touched}
                                    type="text"
                                    placeholder="Enter the Rule Name"
                                />
                                <FormFeedback>{meta.error}</FormFeedback>
                            </FormGroup>
                        )}
                    </Field>
                    <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                        {({ input, meta }) => (
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input
                                    {...input}
                                    id="description"
                                    valid={!meta.error && meta.touched}
                                    invalid={!!meta.error && meta.touched}
                                    type="text"
                                    placeholder="Enter Description / Comment"
                                />
                                <FormFeedback>{meta.error}</FormFeedback>
                            </FormGroup>
                        )}
                    </Field>
                    <Field name="resource" validate={validateRequired()}>
                        {({ input, meta }) => (
                            <FormGroup>
                                <Label for="resource">Resource</Label>
                                <Select
                                    {...input}
                                    id="resource"
                                    inputId="resourceSelect"
                                    maxMenuHeight={140}
                                    menuPlacement="auto"
                                    options={resourceOptionsWithComplianceProfile}
                                    placeholder="Select Resource"
                                    isClearable
                                    value={resourceOptionsWithComplianceProfile.find((opt) => opt.value === input.value) || null}
                                    onChange={(option) => {
                                        const newValue = option ? option.value : Resource.None;
                                        input.onChange(newValue);
                                        form.change('items', []);
                                        dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
                                    }}
                                    styles={{
                                        control: (provided) =>
                                            meta.touched && meta.invalid
                                                ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                : { ...provided },
                                    }}
                                />
                                {meta.touched && meta.invalid && <FormFeedback className="d-block">{meta.error}</FormFeedback>}
                            </FormGroup>
                        )}
                    </Field>

                    {values?.resource && <ConditionFormFilter formType="conditionItem" resource={values.resource} />}

                    <div className="d-flex justify-content-end">
                        <ButtonGroup>
                            <ProgressButton
                                title={rule ? 'Update' : 'Create'}
                                inProgressTitle={rule ? 'Updating...' : 'Creating...'}
                                inProgress={submitting}
                                disabled={values.resource === Resource.None || submitting || !valid || isBusy}
                            />

                            <Button color="default" onClick={onCancel} disabled={submitting}>
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </div>
                </BootstrapForm>
            )}
        </Form>
    );
}
