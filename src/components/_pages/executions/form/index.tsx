import Widget from 'components/Widget';
import { selectors as rulesSelectors, actions as rulesActions } from 'ducks/rules';
import { useCallback, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Select from 'components/Select';
import Button from 'components/Button';
import Container from 'components/Container';
import Breadcrumb from 'components/Breadcrumb';
import ConditionFormFilter from 'components/ConditionFormFilter';
import ProgressButton from 'components/ProgressButton';
import TextInput from 'components/TextInput';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { ExecutionType, PlatformEnum, Resource } from 'types/openapi';
import { ExecutionItemRequestModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import { SendNotificationExecutionItems } from 'components/_pages/executions/SendNotificationExecutionItems';

export interface ExecutionFormValues {
    name: string;
    resource: Resource;
    description: string;
    items: ExecutionItemRequestModel[];
    notificationProfileItems: { value: string; label: string }[];
    type: ExecutionType;
}

const ExecutionForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Execution';
    const isCreatingExecution = useSelector(rulesSelectors.isCreatingExecution);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();
    const isBusy = useMemo(() => isCreatingExecution || isFetchingResourcesList, [isCreatingExecution, isFetchingResourcesList]);
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const executionTypeOptions = useMemo(() => {
        return [
            { value: ExecutionType.SetField, label: getEnumLabel(executionTypeEnum, ExecutionType.SetField) },
            { value: ExecutionType.SendNotification, label: getEnumLabel(executionTypeEnum, ExecutionType.SendNotification) },
        ];
    }, [executionTypeEnum]);

    const defaultValues: ExecutionFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            description: '',
            items: [],
            notificationProfileItems: [],
            type: ExecutionType.SetField,
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate('../actions/1');
    }, [navigate]);

    const methods = useForm<ExecutionFormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, isValid },
        setValue,
    } = methods;

    const formValues = useWatch({ control });
    const watchedType = useWatch({
        control,
        name: 'type',
    });

    const watchedResource = useWatch({
        control,
        name: 'resource',
    });

    // Helper function to convert validators for react-hook-form
    const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
        return {
            validate: (value: any) => {
                const composed = composeValidators(...validators);
                return composed(value);
            },
        };
    };

    const onSubmit = useCallback(
        (values: ExecutionFormValues) => {
            switch (values.type) {
                case ExecutionType.SetField:
                    if (values.resource === Resource.None || !values.type) return;
                    dispatch(
                        rulesActions.createExecution({
                            executionRequestModel: {
                                items: values.items,
                                type: values.type,
                                name: values.name,
                                description: values.description,
                                resource: values.resource,
                            },
                        }),
                    );
                    break;
                case ExecutionType.SendNotification:
                    dispatch(
                        rulesActions.createExecution({
                            executionRequestModel: {
                                items:
                                    values.notificationProfileItems?.map((el) => ({
                                        notificationProfileUuid: el.value,
                                    })) ?? [],
                                type: values.type,
                                name: values.name,
                                description: values.description,
                                resource: values.resource,
                            },
                        }),
                    );
                    break;
            }
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: ExecutionFormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [defaultValues],
    );

    return (
        <>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Actions)} Inventory`, href: '/actions/1' },
                    { label: title, href: '' },
                ]}
            />
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Widget title={title} busy={isBusy}>
                        <div className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                rules={buildValidationRules([validateRequired(), validateAlphaNumericWithSpecialChars()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        {...field}
                                        id="name"
                                        type="text"
                                        label="Execution Name"
                                        required
                                        placeholder="Enter the Execution Name"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        {...field}
                                        id="description"
                                        type="text"
                                        label="Description"
                                        placeholder="Enter the Description"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                )}
                            />

                            <div>
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={buildValidationRules([validateRequired()])}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                id="typeSelect"
                                                label="Execution Type"
                                                value={field.value || ''}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    setValue('resource', Resource.Any);
                                                }}
                                                options={executionTypeOptions}
                                                placeholder="Select Execution Type"
                                                isClearable
                                                placement="bottom"
                                            />
                                            {fieldState.error && fieldState.isTouched && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {typeof fieldState.error === 'string'
                                                        ? fieldState.error
                                                        : fieldState.error?.message || 'Invalid value'}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="resource"
                                    control={control}
                                    rules={buildValidationRules([validateRequired()])}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                id="resourceSelect"
                                                label="Resource"
                                                value={field.value || ''}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    setValue('items', []);
                                                }}
                                                options={resourceOptionsWithRuleEvaluator || []}
                                                placeholder="Select Resource"
                                                isClearable
                                                disabled={watchedType === ExecutionType.SendNotification}
                                                placement="bottom"
                                            />
                                            {fieldState.error && fieldState.isTouched && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {typeof fieldState.error === 'string'
                                                        ? fieldState.error
                                                        : fieldState.error?.message || 'Invalid value'}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {watchedType === ExecutionType.SetField && watchedResource && (
                                <ConditionFormFilter formType="executionItem" resource={watchedResource} />
                            )}

                            {watchedType === ExecutionType.SendNotification && (
                                <Controller
                                    name="notificationProfileItems"
                                    control={control}
                                    render={({ field }) => (
                                        <SendNotificationExecutionItems
                                            mode="form"
                                            notificationProfileItems={field.value}
                                            onNotificationProfileItemsChange={(newItems) => {
                                                field.onChange(newItems);
                                            }}
                                        />
                                    )}
                                />
                            )}

                            <Container className="flex-row justify-end mt-4">
                                <ProgressButton
                                    title={submitTitle}
                                    inProgressTitle={inProgressTitle}
                                    inProgress={isSubmitting}
                                    disabled={
                                        areDefaultValuesSame(formValues) ||
                                        (formValues.resource === Resource.None && formValues.type !== ExecutionType.SendNotification) ||
                                        isSubmitting ||
                                        !isValid ||
                                        isBusy ||
                                        (!formValues.items.length && !formValues.notificationProfileItems?.length)
                                    }
                                    type="submit"
                                />

                                <Button variant="outline" onClick={onCancel} disabled={isSubmitting} type="button">
                                    Cancel
                                </Button>
                            </Container>
                        </div>
                    </Widget>
                </form>
            </FormProvider>
        </>
    );
};

export default ExecutionForm;
