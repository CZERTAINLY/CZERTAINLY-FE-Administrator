import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import Switch from 'components/Switch';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as discoveryActions, selectors as discoverySelectors } from 'ducks/discoveries';
import { actions as rulesActions } from 'ducks/rules';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Select from 'components/Select';
import Button from 'components/Button';
import Container from 'components/Container';
import Label from 'components/Label';
import Cron from 'react-cron-generator';
import { Timer } from 'lucide-react';

import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode, Resource } from 'types/openapi';

import { collectFormAttributes } from 'utils/attributes/attributes';
import { getStrongFromCronExpression } from 'utils/dateUtil';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateQuartzCronExpression, validateRequired } from 'utils/validators';
import TriggerEditorWidget from 'components/TriggerEditorWidget';
import TextInput from 'components/TextInput';

interface DiscoveryFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface FormValues {
    name: string;
    triggers: string[] | undefined;
    discoveryProvider: string | undefined;
    storeKind: string | undefined;
    jobName: string | undefined;
    cronExpression: string | undefined;
    scheduled: boolean;
    oneTime: boolean;
}

export default function DiscoveryForm({ onSuccess, onCancel }: DiscoveryFormProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const discoveryProviders = useSelector(discoverySelectors.discoveryProviders);
    const discoveryProviderAttributeDescriptors = useSelector(discoverySelectors.discoveryProviderAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const isFetchingDiscoveryDetail = useSelector(discoverySelectors.isFetchingDetail);
    const isFetchingDiscoveryProviders = useSelector(discoverySelectors.isFetchingDiscoveryProviders);
    const isFetchingAttributeDescriptors = useSelector(discoverySelectors.isFetchingDiscoveryProviderAttributeDescriptors);
    const isCreating = useSelector(discoverySelectors.isCreating);
    const [init, setInit] = useState(true);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [discoveryProvider, setDiscoveryProvider] = useState<ConnectorResponseModel>();

    const isBusy = useMemo(
        () =>
            isFetchingDiscoveryDetail ||
            isFetchingDiscoveryProviders ||
            isCreating ||
            isFetchingAttributeDescriptors ||
            isFetchingResourceCustomAttributes,
        [
            isFetchingDiscoveryDetail,
            isFetchingDiscoveryProviders,
            isCreating,
            isFetchingAttributeDescriptors,
            isFetchingResourceCustomAttributes,
        ],
    );

    useEffect(() => {
        if (init) {
            dispatch(discoveryActions.resetState());
            setInit(false);
            dispatch(connectorActions.clearCallbackData());
            dispatch(discoveryActions.listDiscoveryProviders());
            dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Discoveries));
            dispatch(rulesActions.listTriggers({ resource: Resource.Certificates }));
        }
    }, [dispatch, init]);

    const onDiscoveryProviderChange = useCallback(
        (providerUuid: string | undefined) => {
            dispatch(discoveryActions.clearDiscoveryProviderAttributeDescriptors());
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);

            if (!providerUuid || !discoveryProviders) return;
            const provider = discoveryProviders.find((p) => p.uuid === providerUuid);

            if (!provider) return;
            setDiscoveryProvider(provider);
        },
        [dispatch, discoveryProviders],
    );

    const onKindChange = useCallback(
        (kind: string | undefined) => {
            if (!kind || !discoveryProvider) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(discoveryActions.getDiscoveryProviderAttributesDescriptors({ uuid: discoveryProvider.uuid, kind }));
        },
        [dispatch, discoveryProvider],
    );

    const onSubmit = useCallback(
        (values: FormValues) => {
            dispatch(
                discoveryActions.createDiscovery({
                    request: {
                        name: values.name,
                        triggers: selectedTriggers.length ? selectedTriggers : undefined,
                        connectorUuid: values.discoveryProvider!,
                        kind: values.storeKind!,
                        attributes: collectFormAttributes(
                            'discovery',
                            [...(discoveryProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                            values,
                        ),
                        customAttributes: collectFormAttributes('customDiscovery', resourceCustomAttributes, values),
                    },
                    scheduled: values.scheduled,
                    jobName: values.jobName,
                    cronExpression: values.cronExpression,
                    oneTime: values.oneTime,
                }),
            );
        },
        [dispatch, discoveryProviderAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes, selectedTriggers],
    );

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    }, [navigate, onCancel]);

    const optionsForDiscoveryProviders = useMemo(
        () =>
            discoveryProviders?.map((provider) => ({
                label: provider.name,
                value: provider.uuid,
            })),
        [discoveryProviders],
    );

    const optionsForKinds = useMemo(
        () =>
            discoveryProvider?.functionGroups
                .find((fg) => fg.functionGroupCode === FunctionGroupCode.DiscoveryProvider)
                ?.kinds.map((kind) => ({
                    label: kind,
                    value: kind,
                })) ?? [],
        [discoveryProvider],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: '',
            triggers: undefined,
            discoveryProvider: undefined,
            storeKind: undefined,
            jobName: undefined,
            cronExpression: undefined,
            scheduled: false,
            oneTime: false,
        }),
        [],
    );

    const methods = useForm<FormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, isValid },
        setValue,
        getValues,
        watch,
    } = methods;

    const watchedScheduled = useWatch({
        control,
        name: 'scheduled',
    });

    const watchedStoreKind = useWatch({
        control,
        name: 'storeKind',
    });

    const watchedCronExpression = useWatch({
        control,
        name: 'cronExpression',
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

    // Clear attributes when discovery provider changes
    useEffect(() => {
        const formValues = getValues();
        Object.keys(formValues).forEach((key) => {
            if (key.startsWith('__attributes__discovery__')) {
                (setValue as any)(key, undefined);
            }
        });
        setValue('storeKind', undefined);
        setValue('triggers', undefined);
    }, [watchedStoreKind, setValue, getValues]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Widget
                    title="Schedule"
                    widgetExtraTopNode={
                        <div className="flex items-start ml-2 w-full">
                            <Controller
                                name="scheduled"
                                control={control}
                                render={({ field }) => <Switch id="scheduled" checked={field.value} onChange={field.onChange} />}
                            />
                        </div>
                    }
                >
                    {watchedScheduled && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="jobName" required>
                                    Job Name
                                </Label>
                                <Controller
                                    name="jobName"
                                    control={control}
                                    rules={buildValidationRules([validateRequired(), validateAlphaNumericWithSpecialChars()])}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            {...field}
                                            id="jobName"
                                            placeholder="Enter Job Name"
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
                            </div>

                            <Controller
                                name="cronExpression"
                                control={control}
                                rules={buildValidationRules([validateRequired(), validateQuartzCronExpression(watchedCronExpression)])}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="relative">
                                            <TextInput
                                                {...field}
                                                id="cronExpression"
                                                type="text"
                                                label="Cron Expression"
                                                required
                                                placeholder="Enter Cron Expression"
                                                invalid={fieldState.error && fieldState.isTouched}
                                                error={
                                                    fieldState.error && fieldState.isTouched
                                                        ? typeof fieldState.error === 'string'
                                                            ? fieldState.error
                                                            : fieldState.error?.message || 'Invalid value'
                                                        : undefined
                                                }
                                                className="pe-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    dispatch(
                                                        userInterfaceActions.showGlobalModal({
                                                            content: (
                                                                <Cron
                                                                    value={field.value}
                                                                    onChange={(e) => {
                                                                        dispatch(
                                                                            userInterfaceActions.setOkButtonCallback(() => {
                                                                                dispatch(userInterfaceActions.hideGlobalModal());
                                                                                setValue('cronExpression', e);
                                                                            }),
                                                                        );
                                                                    }}
                                                                    showResultText={true}
                                                                    showResultCron={true}
                                                                />
                                                            ),
                                                            showCancelButton: true,
                                                            okButtonCallback: () => {
                                                                dispatch(userInterfaceActions.hideGlobalModal());
                                                            },
                                                            showOkButton: true,
                                                            isOpen: true,
                                                            size: 'lg',
                                                            title: 'Select Cron timings',
                                                        }),
                                                    );
                                                }}
                                                className="absolute top-1/2 end-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                                            >
                                                <Timer size={16} />
                                            </button>
                                        </div>
                                        {watchedCronExpression && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                                                {getStrongFromCronExpression(watchedCronExpression)}
                                            </p>
                                        )}
                                    </>
                                )}
                            />

                            <Controller
                                name="oneTime"
                                control={control}
                                render={({ field }) => (
                                    <Switch id="oneTime" checked={field.value} onChange={field.onChange} label="One Time Only" />
                                )}
                            />
                        </div>
                    )}
                </Widget>

                <TriggerEditorWidget
                    resource={Resource.Certificates}
                    selectedTriggers={selectedTriggers}
                    onSelectedTriggersChange={setSelectedTriggers}
                    noteText="Triggers will be executed on newly discovered certificate when handling Certificate Discovered event"
                />

                <Widget title="Add discovery" busy={isBusy}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" required>
                                Discovery Name
                            </Label>
                            <Controller
                                name="name"
                                control={control}
                                rules={buildValidationRules([validateRequired(), validateAlphaNumericWithSpecialChars()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        {...field}
                                        id="name"
                                        placeholder="Enter the Discovery Name"
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
                        </div>

                        <Controller
                            name="discoveryProvider"
                            control={control}
                            rules={buildValidationRules([validateRequired()])}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        id="discoveryProviderSelect"
                                        label="Discovery Provider"
                                        value={field.value || ''}
                                        onChange={(value) => {
                                            const formValues = getValues();
                                            Object.keys(formValues).forEach((key) => {
                                                if (key.startsWith('__attributes__discovery__')) {
                                                    (setValue as any)(key, undefined);
                                                }
                                            });
                                            setValue('storeKind', undefined);
                                            setValue('triggers', undefined);
                                            onDiscoveryProviderChange(value as string);
                                            field.onChange(value);
                                        }}
                                        options={optionsForDiscoveryProviders || []}
                                        placeholder="Select Discovery Provider"
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

                        {discoveryProvider && (
                            <Controller
                                name="storeKind"
                                control={control}
                                rules={buildValidationRules([validateRequired()])}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                            id="storeKindSelect"
                                            label="Kind"
                                            value={field.value || ''}
                                            onChange={(value) => {
                                                onKindChange(value as string);
                                                field.onChange(value);
                                            }}
                                            options={optionsForKinds}
                                            placeholder="Select Kind"
                                            placement="bottom"
                                        />
                                        {fieldState.error && fieldState.isTouched && (
                                            <p className="mt-1 text-sm text-red-600">Required Field</p>
                                        )}
                                    </>
                                )}
                            />
                        )}

                        <TabLayout
                            noBorder
                            tabs={[
                                {
                                    title: 'Connector Attributes',
                                    content:
                                        discoveryProvider &&
                                        watchedStoreKind &&
                                        discoveryProviderAttributeDescriptors &&
                                        discoveryProviderAttributeDescriptors.length > 0 ? (
                                            <AttributeEditor
                                                id="discovery"
                                                attributeDescriptors={discoveryProviderAttributeDescriptors}
                                                connectorUuid={discoveryProvider.uuid}
                                                functionGroupCode={FunctionGroupCode.DiscoveryProvider}
                                                kind={watchedStoreKind}
                                                groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                            />
                                        ) : (
                                            <></>
                                        ),
                                },
                                {
                                    title: 'Custom Attributes',
                                    content: (
                                        <AttributeEditor
                                            id="customDiscovery"
                                            attributeDescriptors={resourceCustomAttributes}
                                            attributes={discoveryProvider?.customAttributes}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>
                </Widget>

                <Container className="flex-row justify-end modal-footer" gap={4}>
                    <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} type="button">
                        Cancel
                    </Button>
                    <ProgressButton
                        title="Create"
                        inProgressTitle="Creating..."
                        inProgress={isSubmitting}
                        disabled={!isDirty || !isValid}
                        type="submit"
                    />
                </Container>
            </form>
        </FormProvider>
    );
}
