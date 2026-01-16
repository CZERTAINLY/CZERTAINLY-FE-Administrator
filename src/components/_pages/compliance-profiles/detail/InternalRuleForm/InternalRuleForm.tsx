import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { ComplianceRuleListDto, ConditionItemRequestDto, Resource } from 'types/openapi';
import Select from 'components/Select';
import Button from 'components/Button';
import { useComplianceProfileResourceOptions } from 'utils/rules';
import { composeValidators, validateLength, validateRequired } from 'utils/validators';
import { buildValidationRules } from 'utils/validators-helper';
import ProgressButton from 'components/ProgressButton';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { useDispatch, useSelector } from 'react-redux';
import ConditionFormFilter from 'components/ConditionFormFilter';
import { actions as complianceActions, selectors as complianceSelectors } from 'ducks/compliance-profiles';
import cn from 'classnames';
import Label from 'components/Label';
import Container from 'components/Container';

type Props = {
    rule?: ComplianceRuleListDto;
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
                    complianceActions.createComplianceInternalRule({
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

    const methods = useForm<FormValues>({
        mode: 'onTouched',
        defaultValues,
    });

    const { control, handleSubmit, setValue, formState } = methods;
    const watchedResource = useWatch({ control, name: 'resource' });

    const selectOptions = useMemo(
        () =>
            resourceOptionsWithComplianceProfile.map((opt) => ({
                value: opt.value,
                label: opt.label,
            })),
        [resourceOptionsWithComplianceProfile],
    );

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    rules={buildValidationRules([validateRequired()])}
                    render={({ field, fieldState }) => (
                        <div className="mb-4">
                            <Label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                Internal Rule Name
                            </Label>
                            <input
                                {...field}
                                id="name"
                                type="text"
                                placeholder="Enter the Rule Name"
                                className={cn(
                                    'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                    {
                                        'border-red-500 focus:border-red-500 focus:ring-red-500': fieldState.error && fieldState.isTouched,
                                    },
                                )}
                            />
                            {fieldState.error && fieldState.isTouched && (
                                <p className="mt-1 text-sm text-red-600">
                                    {typeof fieldState.error === 'string' ? fieldState.error : fieldState.error?.message || 'Invalid value'}
                                </p>
                            )}
                        </div>
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    rules={buildValidationRules([composeValidators(validateLength(0, 300))])}
                    render={({ field, fieldState }) => (
                        <div className="mb-4">
                            <Label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                Description
                            </Label>
                            <input
                                {...field}
                                id="description"
                                type="text"
                                placeholder="Enter Description / Comment"
                                className={cn(
                                    'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                    {
                                        'border-red-500 focus:border-red-500 focus:ring-red-500': fieldState.error && fieldState.isTouched,
                                    },
                                )}
                            />
                            {fieldState.error && fieldState.isTouched && (
                                <p className="mt-1 text-sm text-red-600">
                                    {typeof fieldState.error === 'string' ? fieldState.error : fieldState.error?.message || 'Invalid value'}
                                </p>
                            )}
                        </div>
                    )}
                />
                <Controller
                    name="resource"
                    control={control}
                    rules={buildValidationRules([validateRequired()])}
                    render={({ field, fieldState }) => (
                        <div className="mb-4">
                            <Label htmlFor="resource" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                Resource
                            </Label>
                            <Select
                                id="resourceSelect"
                                options={selectOptions}
                                value={field.value}
                                onChange={(value) => {
                                    const newValue = (value as Resource) || Resource.None;
                                    field.onChange(newValue);
                                    setValue('items', []);
                                    dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
                                }}
                                placeholder="Select Resource"
                                isClearable
                                className={cn({
                                    'border-red-500': fieldState.error && fieldState.isTouched,
                                })}
                            />
                            {fieldState.error && fieldState.isTouched && (
                                <p className="mt-1 text-sm text-red-600">
                                    {typeof fieldState.error === 'string' ? fieldState.error : fieldState.error?.message || 'Invalid value'}
                                </p>
                            )}
                        </div>
                    )}
                />

                {watchedResource && watchedResource !== Resource.None && (
                    <ConditionFormFilter formType="conditionItem" resource={watchedResource} />
                )}

                <Container className="flex-row justify-end modal-footer" gap={4}>
                    <ProgressButton
                        title={rule ? 'Update' : 'Create'}
                        inProgressTitle={rule ? 'Updating...' : 'Creating...'}
                        inProgress={formState.isSubmitting}
                        disabled={watchedResource === Resource.None || formState.isSubmitting || !formState.isValid || isBusy}
                    />

                    <Button variant="outline" color="secondary" onClick={onCancel} disabled={formState.isSubmitting} type="button">
                        Cancel
                    </Button>
                </Container>
            </form>
        </FormProvider>
    );
}
