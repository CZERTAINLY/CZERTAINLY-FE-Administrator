import Widget from 'components/Widget';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as enumSelectors } from 'ducks/enums';
import { actions as rulesActions } from 'ducks/rules';
import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import Select from 'react-select';
import { FilterConditionOperator, FilterFieldSource, PlatformEnum, Resource } from 'types/openapi';
import { ConditionRuleRequestModel } from 'types/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import ConditionGroupFormFilter from '../ConditionGroupFormFilter';

// interface CredentialFormProps {
//     usesGlobalModal?: boolean;
// }

interface SelectChangeValue {
    value: string;
    label: string;
}

interface FormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource | '';
    description: string;
    conditions: ConditionRuleRequestModel[];
}

const ConditionGroupForm = () => {
    const { id } = useParams();
    console.log('id', id);
    const dispatch = useDispatch();
    const title = id ? 'Edit Condition Group' : 'Create Condition Group';
    const isBusy = false;
    const editMode = useMemo(() => !!id, [id]);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    // const enumLabel = getEnumLabel(resourceTypeEnum, Resource.Discoveries);
    const resourceOptions = useMemo(() => {
        if (resourceTypeEnum === undefined) return [];
        const resourceTypeArray = Object.entries(resourceTypeEnum)
            .map(([key, value]) => {
                return { value: value.code, label: value.label };
            })
            .filter((resource) => resource.value !== Resource.None)
            .sort((a, b) => a.label.localeCompare(b.label));

        return resourceTypeArray;
    }, [resourceTypeEnum]);

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? 'e,' : '',
            resource: '',
            selectedResource: editMode
                ? {
                      value: '',
                      label: '',
                  }
                : {
                      value: '',
                      label: '',
                  },
            description: editMode ? 'e' : '',
            conditions: editMode ? [] : [],
        }),
        [editMode],
    );

    const onSubmit = useCallback((values: FormValues) => {
        if (editMode) {
            console.log('edit submit', values);
        } else {
            if (values.resource === '') return;
            // if(values.resource === Resource.None ) return;
            dispatch(
                rulesActions.createConditionGroup({
                    ruleConditionGroupRequest: {
                        conditions: values.conditions,
                        name: values.name,
                        resource: values.resource,
                        description: values.description,
                    },
                }),
            );
        }
    }, []);

    // const renderFilter = useMemo((v: Resource) => {
    //     return (
    //         <div>
    //             <FilterWidget
    //                 entity={EntityType.RESOURCE}
    //                 title={'Condition Group'}
    //                 getAvailableFiltersApi={(apiClients: ApiClients) =>
    //                     apiClients.resources.listResourceRuleFilterFields({
    //                         resource: v,
    //                     })
    //                 }
    //             />
    //         </div>
    //     );
    // }, []);

    const onClickCreateConditionGroup = useCallback(() => {
        // dispatch(
        //     filterActions.getAvailableFilters({
        //         entity: EntityType.CONDITION_GROUPS,
        //         getAvailableFiltersApi: (apiClients: ApiClients) => apiClients.discoveries.getSearchableFieldInformation3(),
        //     }),
        // );

        console.log('create condition group');
        dispatch(
            rulesActions.createConditionGroup({
                ruleConditionGroupRequest: {
                    conditions: [
                        {
                            fieldIdentifier: 'test',
                            fieldSource: FilterFieldSource.Custom,
                            operator: FilterConditionOperator.Contains,
                            value: {},
                        },
                    ],
                    name: 'Condition Group test',
                    resource: Resource.Discoveries,
                    description: 'Condition Group test',
                },
            }),
        );
    }, []);

    // const renderFilter = useMemo(() => {
    //     if (!resourceValue) return <></>;

    //     return (
    //         <div>
    //             <ConditionGroupFormFilter resource={resourceValue} />
    //         </div>
    //     );
    // }, [resourceValue]);

    return (
        <Widget title={title} busy={isBusy}>
            <button onClick={onClickCreateConditionGroup}>create condition group</button>

            <Form
                // subscription={{ submitting: true, pristine: true }}

                initialValues={defaultValues}
                onSubmit={onSubmit}
                mutators={{ ...mutators<FormValues>() }}
            >
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Condition Group Name</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Condition Group Name"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="selectedResource" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="resource">Resource</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceOptions || []}
                                        placeholder="Select Resource"
                                        onChange={(event) => {
                                            input.onChange(event);
                                            form.change('resource', event.value);
                                            // setResourceValue(event.value as Resource);
                                        }}
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="description" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Description</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Description"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        {/* {values?.selectedResource?.value !== '' && (
                            <ConditionGroupFormFilter resource={values?.selectedResource?.value as Resource} />
                        )} */}
                        {/* {values.resource.value !== '' && renderFilter(values.resource.value as Resource)} */}
                        {/* {values.resource.value !== '' && (
                            <RuleManagementFormFilter
                                label="Condition Group"
                                name="conditions"
                                value={values.resource.value as Resource}
                                // onChange={() => {
                                //     console.log('onChange');
                                // }}
                            />
                        )} */}
                        {values?.resource && <ConditionGroupFormFilter resource={values.resource} />}

                        {/* {renderFilter} */}

                        <Button className="mb-4 mx-auto" color="primary" type="submit" disabled={pristine || submitting || !valid}>
                            Save
                        </Button>
                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
};

export default ConditionGroupForm;
