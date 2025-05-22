import AttributeEditor from 'components/Attributes/AttributeEditor';
import SwitchField from 'components/Input/SwitchField';
import TextField from 'components/Input/TextField';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';

import { actions as discoveryActions, selectors as discoverySelectors } from 'ducks/discoveries';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { actions as userInterfaceActions } from '../../../../ducks/user-interface';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode, Resource } from 'types/openapi';

import Cron from 'react-cron-generator';
import { PlatformEnum } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { collectFormAttributes } from 'utils/attributes/attributes';
import { getStrongFromCronExpression } from 'utils/dateUtil';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateQuartzCronExpression, validateRequired } from 'utils/validators';
import TriggerEditorWidget from 'components/TriggerEditorWidget';
import { TriggerDto } from 'types/rules';

interface SelectChangeValue {
    value: string;
    label: string;
}

interface FormValues {
    name: string | undefined;
    triggers: string[] | undefined;
    discoveryProvider: { value: string; label: string } | undefined;
    storeKind: { value: string; label: string } | undefined;
    jobName: string | undefined;
    cronExpression: string | undefined;
    scheduled: boolean;
    oneTime: boolean;
}

export default function DiscoveryForm() {
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
            dispatch(rulesActions.listTriggers({ resource: Resource.Discoveries }));
        }
    }, [dispatch, init]);

    const onDiscoveryProviderChange = useCallback(
        (event: { value: string }) => {
            dispatch(discoveryActions.clearDiscoveryProviderAttributeDescriptors());
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);

            if (!event.value || !discoveryProviders) return;
            const provider = discoveryProviders.find((p) => p.uuid === event.value);

            if (!provider) return;
            setDiscoveryProvider(provider);
        },
        [dispatch, discoveryProviders],
    );

    const onKindChange = useCallback(
        (event: { value: string }) => {
            if (!event.value || !discoveryProvider) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(discoveryActions.getDiscoveryProviderAttributesDescriptors({ uuid: discoveryProvider.uuid, kind: event.value }));
        },
        [dispatch, discoveryProvider],
    );

    const onSubmit = useCallback(
        (values: FormValues, form: any) => {
            dispatch(
                discoveryActions.createDiscovery({
                    request: {
                        name: values.name!,
                        triggers: selectedTriggers.length ? selectedTriggers : undefined,
                        connectorUuid: values.discoveryProvider!.value,
                        kind: values.storeKind?.value!,
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

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

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

    return (
        <Form onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
            {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                <BootstrapForm onSubmit={handleSubmit}>
                    <Widget
                        title="Schedule"
                        widgetExtraTopNode={
                            <div className="ms-2">
                                <SwitchField id="scheduled" label="" />
                            </div>
                        }
                    >
                        {values.scheduled && (
                            <>
                                <TextField
                                    id="jobName"
                                    label="Job Name"
                                    validators={[validateRequired(), validateAlphaNumericWithSpecialChars()]}
                                />

                                <TextField
                                    id="cronExpression"
                                    label="Cron Expression"
                                    validators={[validateRequired(), validateQuartzCronExpression(values.cronExpression)]}
                                    description={getStrongFromCronExpression(values.cronExpression)}
                                    inputGroupIcon={{
                                        icon: 'fa fa-stopwatch',
                                        onClick: () => {
                                            dispatch(
                                                userInterfaceActions.showGlobalModal({
                                                    content: (
                                                        <div>
                                                            <div className="d-flex justify-content-center">
                                                                <Cron
                                                                    value={values.cronExpression}
                                                                    onChange={(e) => {
                                                                        dispatch(
                                                                            userInterfaceActions.setOkButtonCallback(() => {
                                                                                dispatch(userInterfaceActions.hideGlobalModal());
                                                                                form.mutators.setAttribute('cronExpression', e);
                                                                            }),
                                                                        );
                                                                    }}
                                                                    showResultText={true}
                                                                    showResultCron={true}
                                                                />
                                                            </div>
                                                        </div>
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
                                        },
                                    }}
                                />

                                <SwitchField id="oneTime" label="One Time Only" />
                            </>
                        )}
                    </Widget>

                    <TriggerEditorWidget
                        resource={Resource.Discoveries}
                        selectedTriggers={selectedTriggers}
                        onSelectedTriggersChange={setSelectedTriggers}
                        noteText="Triggers will be executed on newly discovered certificate in displayed order"
                    />

                    <Widget title="Add discovery" busy={isBusy}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Discovery Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Discovery Name"
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="discoveryProvider" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="discoveryProviderSelect">Discovery Provider</Label>

                                    <Select
                                        {...input}
                                        inputId="discoveryProviderSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForDiscoveryProviders}
                                        placeholder="Select Discovery Provider"
                                        onChange={(event) => {
                                            onDiscoveryProviderChange(event);
                                            form.mutators.clearAttributes('discovery');
                                            form.mutators.setAttribute('storeKind', undefined);
                                            form.mutators.setAttribute('triggers', undefined);
                                            input.onChange(event);
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

                        {discoveryProvider ? (
                            <Field name="storeKind" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="storeKindSelect">Kind</Label>

                                        <Select
                                            inputId="storeKindSelect"
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForKinds}
                                            placeholder="Select Kind"
                                            onChange={(event) => {
                                                onKindChange(event);
                                                input.onChange(event);
                                            }}
                                            styles={{
                                                control: (provided) =>
                                                    meta.touched && meta.invalid
                                                        ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                        : { ...provided },
                                            }}
                                        />

                                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                            Required Field
                                        </div>
                                    </FormGroup>
                                )}
                            </Field>
                        ) : undefined}

                        <>
                            <br />
                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Connector Attributes',
                                        content:
                                            discoveryProvider &&
                                            values.storeKind &&
                                            discoveryProviderAttributeDescriptors &&
                                            discoveryProviderAttributeDescriptors.length > 0 ? (
                                                <AttributeEditor
                                                    id="discovery"
                                                    attributeDescriptors={discoveryProviderAttributeDescriptors}
                                                    connectorUuid={discoveryProvider.uuid}
                                                    functionGroupCode={FunctionGroupCode.DiscoveryProvider}
                                                    kind={values.storeKind.value}
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
                        </>

                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title="Create"
                                        inProgressTitle="Creating..."
                                        inProgress={submitting}
                                        disabled={pristine || !valid}
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        }
                    </Widget>
                </BootstrapForm>
            )}
        </Form>
    );
}
