import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import TabLayout from 'components/Layout/TabLayout';

import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as connectorActions, selectors as connectorSelectors } from 'ducks/connectors';
import { actions as signingProfileActions, selectors as signingProfileSelectors } from 'ducks/signing-profiles';

import {
    DigestAlgorithm,
    ManagedSigningType,
    PlatformEnum,
    Resource,
    SigningScheme,
    SigningWorkflowType,
    TimestampingWorkflowRequestDto,
    StaticKeyManagedSigningRequestDto,
} from 'types/openapi';
import { collectFormAttributes, mapProfileAttribute, transformAttributes } from 'utils/attributes/attributes';
import { validateAlphaNumericWithoutAccents, validateLength, validateRequired } from 'utils/validators';
import { buildValidationRules, getFieldErrorMessage } from 'utils/validators-helper';
import { deepEqual } from 'utils/deep-equal';

// ─── Label Helpers ────────────────────────────────────────────────────────────

const workflowTypeLabels: Record<SigningWorkflowType, string> = {
    [SigningWorkflowType.Timestamping]: 'Timestamping',
    [SigningWorkflowType.DocumentSigning]: 'Document Signing (coming soon)',
    [SigningWorkflowType.CodeBinarySigning]: 'Code & Binary Signing (coming soon)',
    [SigningWorkflowType.RawSigning]: 'Raw Signing (coming soon)',
};

const signingSchemeLabels: Record<SigningScheme, string> = {
    [SigningScheme.Managed]: 'Managed (ILM holds the key)',
    [SigningScheme.Delegated]: 'Delegated (coming soon)',
};

const managedSigningTypeLabels: Record<ManagedSigningType, string> = {
    [ManagedSigningType.StaticKey]: 'Static Key — use an existing certificate',
    [ManagedSigningType.OneTimeKey]: 'One-Time Key (coming soon)',
};

const digestAlgorithmOptions = Object.values(DigestAlgorithm).map((v) => ({ value: v, label: v }));

// ─── Form Values ──────────────────────────────────────────────────────────────

interface AllowedPolicyIdEntry {
    id: number;
    value: string;
}

interface FormValues {
    name: string;
    description: string;
    // Tab 2 – Timestamping workflow
    signatureFormatterConnectorUuid: string;
    qualifiedTimestamp: boolean;
    timeQualityConfigurationUuid: string;
    defaultPolicyId: string;
    allowedDigestAlgorithms: { value: DigestAlgorithm; label: string }[];
    // Tab 3 – Signing scheme
    certificateUuid: string;
    // Tab 4 – custom attributes are handled by AttributeEditor / collectFormAttributes
    [key: string]: unknown;
}

const WORKFLOW_TYPE = SigningWorkflowType.Timestamping;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SigningProfileForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);

    // ── Selectors ──────────────────────────────────────────────────────────────

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const signingProfile = useSelector(signingProfileSelectors.signingProfile);
    const isFetchingDetail = useSelector(signingProfileSelectors.isFetchingDetail);
    const isCreating = useSelector(signingProfileSelectors.isCreating);
    const isUpdating = useSelector(signingProfileSelectors.isUpdating);

    const connectors = useSelector(connectorSelectors.connectors);
    const isFetchingConnectors = useSelector(connectorSelectors.isFetchingList);

    const signingCertificates = useSelector(signingProfileSelectors.signingCertificates);
    const isFetchingSigningCertificates = useSelector(signingProfileSelectors.isFetchingSigningCertificates);

    const signingOperationAttributeDescriptors = useSelector(signingProfileSelectors.signingOperationAttributeDescriptors);
    const isFetchingSignatureAttributes = useSelector(signingProfileSelectors.isFetchingSignatureAttributes);

    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const multipleResourceCustomAttributes = useSelector(
        customAttributesSelectors.multipleResourceCustomAttributes([Resource.SigningProfiles]),
    );

    // ── Local State ────────────────────────────────────────────────────────────

    const [activeTab, setActiveTab] = useState(0);
    const [signingScheme, setSigningScheme] = useState<SigningScheme>(SigningScheme.Managed);
    const [managedSigningType, setManagedSigningType] = useState<ManagedSigningType>(ManagedSigningType.StaticKey);
    const [allowedPolicyIds, setAllowedPolicyIds] = useState<AllowedPolicyIdEntry[]>([]);
    const [policyIdInput, setPolicyIdInput] = useState('');
    const nextPolicyIdKey = useRef(0);

    // ── Busy ───────────────────────────────────────────────────────────────────

    const isBusy = useMemo(
        () =>
            isFetchingDetail ||
            isCreating ||
            isUpdating ||
            isFetchingConnectors ||
            isFetchingSigningCertificates ||
            isFetchingSignatureAttributes ||
            isFetchingResourceCustomAttributes,
        [
            isFetchingDetail,
            isCreating,
            isUpdating,
            isFetchingConnectors,
            isFetchingSigningCertificates,
            isFetchingSignatureAttributes,
            isFetchingResourceCustomAttributes,
        ],
    );

    // ── Load data on mount ────────────────────────────────────────────────────

    useEffect(() => {
        dispatch(connectorActions.listConnectorsMerge({}));
        dispatch(signingProfileActions.listSigningCertificates({ workflowType: WORKFLOW_TYPE }));
        dispatch(signingProfileActions.listSupportedProtocols({ workflowType: WORKFLOW_TYPE }));
        dispatch(
            customAttributesActions.loadMultipleResourceCustomAttributes([{ resource: Resource.SigningProfiles, customAttributes: [] }]),
        );
    }, [dispatch]);

    useEffect(() => {
        if (editMode && id) {
            dispatch(signingProfileActions.getSigningProfile({ uuid: id }));
        }
    }, [dispatch, editMode, id]);

    // ── Option lists ──────────────────────────────────────────────────────────

    const connectorOptions = useMemo(
        () =>
            connectors.map((c) => ({
                value: c.uuid,
                label: c.name,
            })),
        [connectors],
    );

    const certificateOptions = useMemo(
        () =>
            signingCertificates.map((cert) => ({
                value: cert.uuid,
                label: cert.commonName ? `${cert.commonName} (${cert.serialNumber || cert.fingerprint || cert.uuid})` : cert.uuid,
            })),
        [signingCertificates],
    );

    // ── Custom attribute initial values ───────────────────────────────────────

    const initialCustomAttributes = useMemo(
        () =>
            mapProfileAttribute(
                editMode ? signingProfile : undefined,
                multipleResourceCustomAttributes,
                Resource.SigningProfiles,
                'customAttributes',
                '__attributes__customSigningProfile__',
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // ── Default form values ───────────────────────────────────────────────────

    const defaultValues = useMemo<FormValues>(
        () => ({
            name: '',
            description: '',
            signatureFormatterConnectorUuid: '',
            qualifiedTimestamp: false,
            timeQualityConfigurationUuid: '',
            defaultPolicyId: '',
            allowedDigestAlgorithms: [],
            certificateUuid: '',
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
        setValue,
        watch,
    } = methods;

    const qualifiedTimestampValue = useWatch({ control, name: 'qualifiedTimestamp' });
    const certificateUuidValue = useWatch({ control, name: 'certificateUuid' });

    // ── Populate form in edit mode ────────────────────────────────────────────

    const lastResetIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!editMode || !id || !signingProfile || signingProfile.uuid !== id || isFetchingDetail) return;
        if (lastResetIdRef.current === id) return;

        const wf = signingProfile.workflow as TimestampingWorkflowRequestDto | undefined;
        const sc = signingProfile.signingScheme as StaticKeyManagedSigningRequestDto | undefined;

        const attrInitial = mapProfileAttribute(
            signingProfile,
            multipleResourceCustomAttributes,
            Resource.SigningProfiles,
            'customAttributes',
            '__attributes__customSigningProfile__',
        );

        reset(
            {
                name: signingProfile.name || '',
                description: signingProfile.description || '',
                signatureFormatterConnectorUuid: (wf as any)?.signatureFormatterConnectorUuid || '',
                qualifiedTimestamp: (wf as any)?.qualifiedTimestamp ?? false,
                timeQualityConfigurationUuid: (wf as any)?.timeQualityConfigurationUuid || '',
                defaultPolicyId: (wf as any)?.defaultPolicyId || '',
                allowedDigestAlgorithms: (wf as any)?.allowedDigestAlgorithms?.map((d: DigestAlgorithm) => ({ value: d, label: d })) ?? [],
                certificateUuid: (sc as any)?.certificateUuid || (sc as any)?.certificate?.uuid || '',
                ...transformAttributes(attrInitial ?? []),
            },
            { keepDefaultValues: false },
        );

        // Restore policy IDs
        const existingPolicies: string[] = (wf as any)?.allowedPolicyIds ?? [];
        setAllowedPolicyIds(existingPolicies.map((p) => ({ id: nextPolicyIdKey.current++, value: p })));

        // Restore signing scheme selections
        if ((sc as any)?.signingScheme) setSigningScheme((sc as any).signingScheme);
        if ((sc as any)?.managedSigningType) setManagedSigningType((sc as any).managedSigningType);

        lastResetIdRef.current = id;
    }, [editMode, id, signingProfile, isFetchingDetail, multipleResourceCustomAttributes, reset]);

    // ── Fetch signature attribute descriptors when certificate changes ─────────

    useEffect(() => {
        if (!certificateUuidValue) return;
        dispatch(signingProfileActions.listSignatureAttributesForCertificate({ certificateUuid: certificateUuidValue }));
    }, [dispatch, certificateUuidValue]);

    // ── Policy ID helpers ─────────────────────────────────────────────────────

    const addPolicyId = useCallback(() => {
        const trimmed = policyIdInput.trim();
        if (!trimmed) return;
        setAllowedPolicyIds((prev) => [...prev, { id: nextPolicyIdKey.current++, value: trimmed }]);
        setPolicyIdInput('');
    }, [policyIdInput]);

    const removePolicyId = useCallback((id: number) => {
        setAllowedPolicyIds((prev) => prev.filter((p) => p.id !== id));
    }, []);

    // ── Submit ────────────────────────────────────────────────────────────────

    const onSubmit = useCallback(
        (values: FormValues) => {
            const customAttrs = collectFormAttributes(
                'customSigningProfile',
                multipleResourceCustomAttributes[Resource.SigningProfiles],
                values,
            );

            const signingOpAttrs = collectFormAttributes('signingOperationAttrs', signingOperationAttributeDescriptors as any, values);

            const workflowRequest: TimestampingWorkflowRequestDto = {
                type: WORKFLOW_TYPE,
                signatureFormatterConnectorUuid: values.signatureFormatterConnectorUuid || undefined,
                signatureFormatterConnectorAttributes: [],
                qualifiedTimestamp: values.qualifiedTimestamp,
                timeQualityConfigurationUuid: values.timeQualityConfigurationUuid || undefined,
                defaultPolicyId: values.defaultPolicyId || undefined,
                allowedPolicyIds: allowedPolicyIds.map((p) => p.value),
                allowedDigestAlgorithms: values.allowedDigestAlgorithms.map((d) => d.value),
            };

            const schemeRequest: StaticKeyManagedSigningRequestDto = {
                signingScheme: SigningScheme.Managed,
                managedSigningType: ManagedSigningType.StaticKey,
                certificateUuid: values.certificateUuid,
                signingOperationAttributes: signingOpAttrs,
            };

            const requestDto = {
                name: values.name,
                description: values.description || undefined,
                workflow: workflowRequest,
                signingScheme: schemeRequest,
                customAttributes: customAttrs,
            };

            if (editMode && id) {
                dispatch(signingProfileActions.updateSigningProfile({ uuid: id, signingProfileRequestDto: requestDto }));
            } else {
                dispatch(signingProfileActions.createSigningProfile({ signingProfileRequestDto: requestDto }));
            }
        },
        [dispatch, editMode, id, allowedPolicyIds, multipleResourceCustomAttributes, signingOperationAttributeDescriptors],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const allFormValues = useWatch({ control });
    const isEqual = useMemo(
        () => deepEqual(defaultValues as unknown as Record<string, unknown>, allFormValues as unknown as Record<string, unknown>),
        [defaultValues, allFormValues],
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Tab content
    // ─────────────────────────────────────────────────────────────────────────

    // Tab 1 ── General & Workflow Type
    const tab1Content = (
        <div className="space-y-4">
            <Controller
                name="name"
                control={control}
                rules={buildValidationRules([validateRequired(), validateAlphaNumericWithoutAccents(), validateLength(1, 255)])}
                render={({ field, fieldState }) => (
                    <TextInput
                        {...field}
                        id="signingProfileName"
                        type="text"
                        label="Signing Profile Name"
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

            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                    Signing Workflow Type <span className="text-red-500">*</span>
                </p>
                <div className="space-y-2">
                    {Object.values(SigningWorkflowType).map((wt) => {
                        const isSupported = wt === SigningWorkflowType.Timestamping;
                        return (
                            <label
                                key={wt}
                                className={`flex items-center gap-x-3 p-3 border rounded-lg cursor-pointer ${
                                    isSupported
                                        ? 'border-blue-300 bg-blue-50 text-gray-900'
                                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="workflowType"
                                    value={wt}
                                    defaultChecked={wt === WORKFLOW_TYPE}
                                    disabled={!isSupported}
                                    className="accent-blue-600"
                                    readOnly
                                />
                                <span className="text-sm font-medium">{workflowTypeLabels[wt]}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // Tab 2 ── Timestamping Workflow Properties
    const tab2Content = (
        <div className="space-y-4">
            <Controller
                name="signatureFormatterConnectorUuid"
                control={control}
                render={({ field }) => (
                    <Select
                        id="signatureFormatterConnector"
                        label="Signature Formatter Connector"
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={connectorOptions}
                        placeholder="Select a connector (optional)"
                        isClearable
                        isLoading={isFetchingConnectors}
                        placement="bottom"
                    />
                )}
            />

            <p className="text-xs text-gray-500 mt-1">
                Connector attribute configuration will be available once Signature Formatter connectors are registered with the required
                interface and feature flag.
            </p>

            <div className="flex items-center gap-x-3 mt-2">
                <Controller
                    name="qualifiedTimestamp"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="checkbox"
                            id="qualifiedTimestamp"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="accent-blue-600 w-4 h-4"
                        />
                    )}
                />
                <label htmlFor="qualifiedTimestamp" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Qualified Timestamp (ETSI EN 319 421)
                </label>
            </div>

            {qualifiedTimestampValue && (
                <Controller
                    name="timeQualityConfigurationUuid"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            id="timeQualityConfigurationUuid"
                            type="text"
                            label="Time Quality Configuration UUID"
                            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                            invalid={fieldState.error && fieldState.isTouched}
                            error={getFieldErrorMessage(fieldState)}
                        />
                    )}
                />
            )}

            {qualifiedTimestampValue && (
                <p className="text-xs text-gray-500">Time Quality Configuration management will be available in an upcoming release.</p>
            )}

            <Controller
                name="defaultPolicyId"
                control={control}
                render={({ field, fieldState }) => (
                    <TextInput
                        {...field}
                        id="defaultPolicyId"
                        type="text"
                        label="Default TSA Policy ID (OID format)"
                        placeholder="e.g. 1.2.3.4.5"
                        invalid={fieldState.error && fieldState.isTouched}
                        error={getFieldErrorMessage(fieldState)}
                    />
                )}
            />

            <div>
                <label htmlFor="policyIdInput" className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed TSA Policy IDs
                </label>
                <div className="flex gap-x-2 mb-2">
                    <input
                        id="policyIdInput"
                        type="text"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter an OID and press Add"
                        value={policyIdInput}
                        onChange={(e) => setPolicyIdInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addPolicyId();
                            }
                        }}
                    />
                    <Button type="button" variant="outline" onClick={addPolicyId} disabled={!policyIdInput.trim()}>
                        Add
                    </Button>
                </div>
                {allowedPolicyIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {allowedPolicyIds.map((entry) => (
                            <span
                                key={entry.id}
                                className="inline-flex items-center gap-x-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                                {entry.value}
                                <button
                                    type="button"
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                    onClick={() => removePolicyId(entry.id)}
                                    aria-label={`Remove ${entry.value}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {allowedPolicyIds.length === 0 && (
                    <p className="text-xs text-gray-400">No policies added. All policy IDs will be accepted.</p>
                )}
            </div>

            <Controller
                name="allowedDigestAlgorithms"
                control={control}
                render={({ field }) => (
                    <Select
                        id="allowedDigestAlgorithms"
                        label="Allowed Digest Algorithms"
                        value={field.value}
                        onChange={field.onChange}
                        options={digestAlgorithmOptions}
                        placeholder="All digest algorithms accepted (leave empty)"
                        isMulti
                        placement="bottom"
                    />
                )}
            />
        </div>
    );

    // Tab 3 ── Signing Scheme
    const tab3Content = (
        <div className="space-y-4">
            {/* Level 1: Managed vs Delegated */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                    Signing Scheme <span className="text-red-500">*</span>
                </p>
                <div className="space-y-2">
                    {Object.values(SigningScheme).map((scheme) => {
                        const isSupported = scheme === SigningScheme.Managed;
                        return (
                            <label
                                key={scheme}
                                className={`flex items-center gap-x-3 p-3 border rounded-lg cursor-pointer ${
                                    isSupported
                                        ? signingScheme === scheme
                                            ? 'border-blue-500 bg-blue-50 text-gray-900'
                                            : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="signingScheme"
                                    value={scheme}
                                    checked={signingScheme === scheme}
                                    disabled={!isSupported}
                                    onChange={() => isSupported && setSigningScheme(scheme)}
                                    className="accent-blue-600"
                                />
                                <span className="text-sm font-medium">{signingSchemeLabels[scheme]}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Level 2: Managed signing type (only for Managed) */}
            {signingScheme === SigningScheme.Managed && (
                <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">
                        Managed Signing Type <span className="text-red-500">*</span>
                    </p>
                    <div className="space-y-2">
                        {Object.values(ManagedSigningType).map((mst) => {
                            const isSupported = mst === ManagedSigningType.StaticKey;
                            return (
                                <label
                                    key={mst}
                                    className={`flex items-center gap-x-3 p-3 border rounded-lg cursor-pointer ${
                                        isSupported
                                            ? managedSigningType === mst
                                                ? 'border-blue-500 bg-blue-50 text-gray-900'
                                                : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="managedSigningType"
                                        value={mst}
                                        checked={managedSigningType === mst}
                                        disabled={!isSupported}
                                        onChange={() => isSupported && setManagedSigningType(mst)}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm font-medium">{managedSigningTypeLabels[mst]}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Certificate select – Static Key + Managed */}
            {signingScheme === SigningScheme.Managed && managedSigningType === ManagedSigningType.StaticKey && (
                <>
                    <Controller
                        name="certificateUuid"
                        control={control}
                        rules={buildValidationRules([validateRequired()])}
                        render={({ field, fieldState }) => (
                            <Select
                                id="certificateUuid"
                                label="Certificate"
                                value={field.value || ''}
                                onChange={field.onChange}
                                options={certificateOptions}
                                placeholder="Select a certificate"
                                isLoading={isFetchingSigningCertificates}
                                placement="bottom"
                                required
                                invalid={fieldState.error && fieldState.isTouched}
                                error={getFieldErrorMessage(fieldState)}
                            />
                        )}
                    />

                    {certificateUuidValue && (
                        <Widget title="Signing Operation Attributes" noBorder busy={isFetchingSignatureAttributes}>
                            {signingOperationAttributeDescriptors.length > 0 ? (
                                <AttributeEditor
                                    id="signingOperationAttrs"
                                    attributeDescriptors={signingOperationAttributeDescriptors as any}
                                    attributes={
                                        editMode
                                            ? ((signingProfile?.signingScheme as StaticKeyManagedSigningRequestDto | undefined)
                                                  ?.signingOperationAttributes ?? undefined)
                                            : undefined
                                    }
                                />
                            ) : (
                                !isFetchingSignatureAttributes && (
                                    <p className="text-xs text-gray-500">
                                        No signing operation attributes are available for the selected certificate's key algorithm.
                                    </p>
                                )
                            )}
                        </Widget>
                    )}
                </>
            )}
        </div>
    );

    // Tab 4 ── Custom Attributes
    const tab4Content = (
        <Widget title="Custom Attributes" noBorder busy={isFetchingResourceCustomAttributes}>
            <AttributeEditor
                id="customSigningProfile"
                attributeDescriptors={multipleResourceCustomAttributes[Resource.SigningProfiles] || []}
                attributes={editMode ? signingProfile?.customAttributes : undefined}
            />
        </Widget>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <Container>
            <Breadcrumb
                items={[
                    {
                        label: `${getEnumLabel(resourceEnum, Resource.SigningProfiles)} Inventory`,
                        href: `/${Resource.SigningProfiles.toLowerCase()}`,
                    },
                    {
                        label: editMode ? signingProfile?.name || 'Edit Signing Profile' : 'Create Signing Profile',
                        href: '',
                    },
                ]}
            />

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Widget title={editMode ? 'Edit Signing Profile' : 'Create Signing Profile'} busy={isBusy} titleSize="large">
                        <TabLayout
                            selectedTab={activeTab}
                            onTabChange={setActiveTab}
                            tabs={[
                                {
                                    title: '1 · General',
                                    content: tab1Content,
                                },
                                {
                                    title: '2 · Workflow Properties',
                                    content: tab2Content,
                                },
                                {
                                    title: '3 · Signing Scheme',
                                    content: tab3Content,
                                },
                                {
                                    title: '4 · Custom Attributes',
                                    content: tab4Content,
                                },
                            ]}
                        />

                        <Container className="flex-row justify-end mt-4" gap={4}>
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
                    </Widget>
                </form>
            </FormProvider>
        </Container>
    );
}
