import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import AttributeEditor from 'components/Attributes/AttributeEditor';
import Breadcrumb from 'components/Breadcrumb';
import Button from 'components/Button';
import Container from 'components/Container';
import ProgressButton from 'components/ProgressButton';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import Widget from 'components/Widget';

import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as signingProfileActions, selectors as signingProfileSelectors } from 'ducks/signing-profiles';
import { actions as tspActions, selectors as tspSelectors } from 'ducks/tsp-configurations';

import { PlatformEnum, Resource } from 'types/openapi';
import { collectFormAttributes, mapProfileAttribute, transformAttributes } from 'utils/attributes/attributes';
import { validateAlphaNumericWithoutAccents, validateLength, validateRequired } from 'utils/validators';
import { buildValidationRules, getFieldErrorMessage } from 'utils/validators-helper';
import { deepEqual } from 'utils/deep-equal';

interface FormValues {
    name: string;
    description: string;
    defaultSigningProfile: string;
}

export const TspConfigurationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const tspConfiguration = useSelector(tspSelectors.tspConfiguration);
    const isFetchingDetail = useSelector(tspSelectors.isFetchingDetail);
    const isCreating = useSelector(tspSelectors.isCreating);
    const isUpdating = useSelector(tspSelectors.isUpdating);

    const signingProfiles = useSelector(signingProfileSelectors.signingProfiles);
    const isFetchingSigningProfiles = useSelector(signingProfileSelectors.isFetchingList);

    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const multipleResourceCustomAttributes = useSelector(
        customAttributesSelectors.multipleResourceCustomAttributes([Resource.TspConfigurations]),
    );

    const isBusy = useMemo(
        () => isFetchingDetail || isCreating || isUpdating || isFetchingSigningProfiles || isFetchingResourceCustomAttributes,
        [isFetchingDetail, isCreating, isUpdating, isFetchingSigningProfiles, isFetchingResourceCustomAttributes],
    );

    useEffect(() => {
        dispatch(signingProfileActions.listSigningProfiles());
        dispatch(
            customAttributesActions.loadMultipleResourceCustomAttributes([{ resource: Resource.TspConfigurations, customAttributes: [] }]),
        );
    }, [dispatch]);

    useEffect(() => {
        if (editMode && id) {
            dispatch(tspActions.getTspConfiguration({ uuid: id }));
        }
    }, [dispatch, editMode, id]);

    const optionsForSigningProfiles = useMemo(
        () =>
            signingProfiles.map((sp) => ({
                value: sp.uuid,
                label: sp.name,
            })),
        [signingProfiles],
    );

    const initialCustomAttributes = useMemo(
        () =>
            mapProfileAttribute(
                tspConfiguration,
                multipleResourceCustomAttributes,
                Resource.TspConfigurations,
                'customAttributes',
                '__attributes__customTspConfiguration__',
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const defaultValues = useMemo<FormValues>(
        () => ({
            name: '',
            description: '',
            defaultSigningProfile: '',
            ...transformAttributes(initialCustomAttributes ?? []),
        }),
        [initialCustomAttributes],
    );

    const methods = useForm<FormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting, isValid },
        reset,
    } = methods;

    const lastResetIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (editMode && id && tspConfiguration && tspConfiguration.uuid === id && !isFetchingDetail) {
            if (lastResetIdRef.current !== id) {
                const attributeInitialValues = mapProfileAttribute(
                    tspConfiguration,
                    multipleResourceCustomAttributes,
                    Resource.TspConfigurations,
                    'customAttributes',
                    '__attributes__customTspConfiguration__',
                );

                reset(
                    {
                        name: tspConfiguration.name || '',
                        description: tspConfiguration.description || '',
                        defaultSigningProfile:
                            optionsForSigningProfiles.find((opt) => opt.value === tspConfiguration.defaultSigningProfile?.uuid)?.value ||
                            '',
                        ...transformAttributes(attributeInitialValues ?? []),
                    },
                    { keepDefaultValues: false },
                );

                lastResetIdRef.current = id;
            }
        }
    }, [editMode, id, tspConfiguration, isFetchingDetail, optionsForSigningProfiles, multipleResourceCustomAttributes, reset]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const requestDto = {
                name: values.name,
                description: values.description || undefined,
                defaultSigningProfileUuid: values.defaultSigningProfile || undefined,
                customAttributes: collectFormAttributes(
                    'customTspConfiguration',
                    multipleResourceCustomAttributes[Resource.TspConfigurations],
                    values,
                ),
            };

            if (editMode && id) {
                dispatch(tspActions.updateTspConfiguration({ uuid: id, tspConfigurationRequestDto: requestDto }));
            } else {
                dispatch(tspActions.createTspConfiguration({ tspConfigurationRequestDto: requestDto }));
            }
        },
        [dispatch, editMode, id, multipleResourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const allFormValues = useWatch({ control });
    const isEqual = useMemo(
        () => deepEqual(defaultValues as unknown as Record<string, unknown>, allFormValues as unknown as Record<string, unknown>),
        [defaultValues, allFormValues],
    );

    return (
        <Container>
            <Breadcrumb
                items={[
                    {
                        label: `${getEnumLabel(resourceEnum, Resource.TspConfigurations)} Inventory`,
                        href: `/${Resource.TspConfigurations.toLowerCase()}`,
                    },
                    {
                        label: editMode ? tspConfiguration?.name || 'Edit TSP Configuration' : 'Create TSP Configuration',
                        href: '',
                    },
                ]}
            />

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Widget title={editMode ? 'Edit TSP Configuration' : 'Create TSP Configuration'} busy={isBusy} titleSize="large">
                        <div className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                rules={buildValidationRules([validateRequired(), validateAlphaNumericWithoutAccents()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        {...field}
                                        id="name"
                                        type="text"
                                        label="TSP Configuration Name"
                                        required
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={getFieldErrorMessage(fieldState)}
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                rules={buildValidationRules([validateLength(0, 300)])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        {...field}
                                        id="description"
                                        type="text"
                                        label="Description"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={getFieldErrorMessage(fieldState)}
                                    />
                                )}
                            />

                            <Controller
                                name="defaultSigningProfile"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="defaultSigningProfileSelect"
                                        label="Default Signing Profile"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        options={optionsForSigningProfiles}
                                        placeholder="Select a Signing Profile (optional)"
                                        isClearable
                                        placement="bottom"
                                    />
                                )}
                            />

                            <Widget title="Custom Attributes" noBorder busy={isFetchingResourceCustomAttributes}>
                                <AttributeEditor
                                    id="customTspConfiguration"
                                    attributeDescriptors={multipleResourceCustomAttributes[Resource.TspConfigurations] || []}
                                    attributes={editMode ? tspConfiguration?.customAttributes : undefined}
                                />
                            </Widget>

                            <Container className="flex-row justify-end" gap={4}>
                                <Button variant="outline" onClick={onCancel} disabled={isSubmitting} type="button">
                                    Cancel
                                </Button>
                                <ProgressButton
                                    title={editMode ? 'Update' : 'Create'}
                                    inProgressTitle={editMode ? 'Updating...' : 'Creating...'}
                                    inProgress={isSubmitting || isCreating || isUpdating}
                                    disabled={isEqual || isSubmitting || !isValid}
                                    type="submit"
                                />
                            </Container>
                        </div>
                    </Widget>
                </form>
            </FormProvider>
        </Container>
    );
};
