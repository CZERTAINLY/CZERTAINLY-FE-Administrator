import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form as BootstrapForm, FormGroup, Label, ButtonGroup } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { Form } from 'react-final-form';
import { AuditLoggingSettingsDtoOutputEnum, Module, PlatformEnum, Resource } from 'types/openapi';

import Select, { Props as SelectProps } from 'react-select';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { isObjectSame } from 'utils/common-utils';
import ProgressButton from 'components/ProgressButton';
import SwitchField from 'components/Input/SwitchField';

type ModuleOptionType = { value: Module; label: string };
type ResourceOptionType = { value: Resource; label: string };

type CommonFormValues = {
    logAllModules: boolean;
    logAllResources: boolean;
    loggedModules?: ModuleOptionType[];
    ignoredModules?: ModuleOptionType[];
    loggedResources?: ResourceOptionType[];
    ignoredResources?: ResourceOptionType[];
    output?: {
        label: string;
        value: AuditLoggingSettingsDtoOutputEnum;
    };
    verbose?: boolean;
};
type AuditFormValues = Omit<CommonFormValues, 'output'> & {
    output: {
        label: string;
        value: AuditLoggingSettingsDtoOutputEnum;
    };
};
type EventFormValues = Omit<CommonFormValues, 'output'>;

const LoggingSetting = () => {
    const dispatch = useDispatch();

    const loggingSettings = useSelector(selectors.loggingSettings);
    const isFetching = useSelector(selectors.isFetchingLoggingSetting);
    const isUpdating = useSelector(selectors.isUpdatingLoggingSetting);

    const moduleEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Module));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const getFreshLoggingSettings = useCallback(() => {
        dispatch(actions.getLoggingSettings());
    }, [dispatch]);

    useEffect(() => {
        getFreshLoggingSettings();
    }, [getFreshLoggingSettings]);

    const isBusy = useMemo(() => isFetching || isUpdating, [isFetching, isUpdating]);

    const moduleSelectorItems = useMemo(
        () =>
            Object.values(Module)
                .map((el) => ({
                    label: getEnumLabel(moduleEnum, el),
                    value: el,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [moduleEnum],
    );

    const resourceSelectorItems = useMemo(
        () =>
            Object.values(Resource)
                .map((el) => ({
                    label: getEnumLabel(resourceEnum, el),
                    value: el,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [resourceEnum],
    );

    const auditLogsOutputOptions = useMemo(
        () => [
            {
                value: AuditLoggingSettingsDtoOutputEnum.All,
                label: AuditLoggingSettingsDtoOutputEnum.All,
            },
            {
                value: AuditLoggingSettingsDtoOutputEnum.Console,
                label: AuditLoggingSettingsDtoOutputEnum.Console,
            },
            {
                value: AuditLoggingSettingsDtoOutputEnum.Database,
                label: AuditLoggingSettingsDtoOutputEnum.Database,
            },
            {
                value: AuditLoggingSettingsDtoOutputEnum.None,
                label: AuditLoggingSettingsDtoOutputEnum.None,
            },
        ],
        [],
    );

    const onAuditFormSubmit = useCallback(
        (values: AuditFormValues) => {
            if (!values || !loggingSettings) return;

            dispatch(
                actions.updateLoggingSettings({
                    eventLogs: loggingSettings.eventLogs,
                    auditLogs: {
                        logAllModules: values.logAllModules,
                        logAllResources: values.logAllResources,
                        ignoredModules: values.ignoredModules?.map((el) => el.value),
                        ignoredResources: values.ignoredResources?.map((el) => el.value),
                        loggedModules: values.loggedModules?.map((el) => el.value),
                        loggedResources: values.loggedResources?.map((el) => el.value),
                        output: values.output.value,
                        verbose: values.verbose,
                    },
                }),
            );
        },
        [dispatch, loggingSettings],
    );

    const auditFormInitialValues = useMemo(() => {
        if (!loggingSettings) return {};
        const auditLogs = loggingSettings.auditLogs;
        return {
            ...auditLogs,
            ignoredModules: auditLogs?.ignoredModules?.map((el) => ({
                value: el,
                label: getEnumLabel(moduleEnum, el),
            })),
            ignoredResources: auditLogs?.ignoredResources?.map((el) => ({
                value: el,
                label: getEnumLabel(resourceEnum, el),
            })),
            loggedModules: auditLogs?.loggedModules?.map((el) => ({
                value: el,
                label: getEnumLabel(moduleEnum, el),
            })),
            loggedResources: auditLogs?.loggedResources?.map((el) => ({
                value: el,
                label: getEnumLabel(resourceEnum, el),
            })),
            output: {
                label: loggingSettings.auditLogs.output,
                value: loggingSettings.auditLogs.output,
            },
        } as AuditFormValues;
    }, [loggingSettings, moduleEnum, resourceEnum]);

    const hasAuditFormValuesChanged = useCallback(
        (values: AuditFormValues) =>
            !isObjectSame(values as unknown as Record<string, unknown>, auditFormInitialValues as unknown as Record<string, unknown>),
        [auditFormInitialValues],
    );

    const onEventFormSubmit = useCallback(
        (values: EventFormValues) => {
            if (!values || !loggingSettings) return;

            dispatch(
                actions.updateLoggingSettings({
                    auditLogs: loggingSettings.auditLogs,
                    eventLogs: {
                        logAllModules: values.logAllModules,
                        logAllResources: values.logAllResources,
                        ignoredModules: values.ignoredModules?.map((el) => el.value),
                        ignoredResources: values.ignoredResources?.map((el) => el.value),
                        loggedModules: values.loggedModules?.map((el) => el.value),
                        loggedResources: values.loggedResources?.map((el) => el.value),
                    },
                }),
            );
        },
        [dispatch, loggingSettings],
    );

    const eventFormInitialValues = useMemo(() => {
        if (!loggingSettings) return {};
        const eventLogs = loggingSettings.eventLogs;
        return {
            ...eventLogs,
            ignoredModules: eventLogs?.ignoredModules?.map((el) => ({
                value: el,
                label: getEnumLabel(moduleEnum, el),
            })),
            ignoredResources: eventLogs?.ignoredResources?.map((el) => ({
                value: el,
                label: getEnumLabel(resourceEnum, el),
            })),
            loggedModules: eventLogs?.loggedModules?.map((el) => ({
                value: el,
                label: getEnumLabel(moduleEnum, el),
            })),
            loggedResources: eventLogs?.loggedResources?.map((el) => ({
                value: el,
                label: getEnumLabel(resourceEnum, el),
            })),
        };
    }, [loggingSettings, moduleEnum, resourceEnum]);

    const hasEventFormValuesChanged = useCallback(
        (values: EventFormValues) =>
            !isObjectSame(values as unknown as Record<string, unknown>, eventFormInitialValues as unknown as Record<string, unknown>),
        [eventFormInitialValues],
    );

    const createForm = useCallback(
        <T extends CommonFormValues>(
            initialValues: T,
            onSubmit: (values: T) => void,
            hasValuesChanged: (values: T) => boolean,
            formType: 'audit' | 'event',
        ) => {
            const commonSelectProps: SelectProps = { minMenuHeight: 200, closeMenuOnSelect: false, isMulti: true };
            const loggedSelectProps: SelectProps = {
                styles: {
                    multiValue: (provided) => ({
                        ...provided,
                        border: '1px solid var(--bs-green)',
                        background: 'var(--bs-success-bg-subtle)',
                    }),
                },
            };
            const ignoredSelectProps: SelectProps = {
                styles: {
                    multiValue: (provided) => ({
                        ...provided,
                        border: '1px solid var(--bs-red)',
                        background: 'var(--bs-danger-bg-subtle)',
                    }),
                },
            };

            return (
                <Form initialValues={initialValues} onSubmit={onSubmit}>
                    {({ handleSubmit, values, submitting, form }) => (
                        <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                            <Widget title="Module Logging">
                                <SwitchField id="logAllModules" label="Collect logs for all modules" />
                                {!values.logAllModules ? (
                                    <FormGroup>
                                        <Label for="loggedModules">Select Modules to Log</Label>
                                        <Select
                                            {...commonSelectProps}
                                            {...loggedSelectProps}
                                            value={values.loggedModules || []}
                                            options={moduleSelectorItems}
                                            onChange={(e) => form.change('loggedModules', e as ModuleOptionType[])}
                                        />
                                    </FormGroup>
                                ) : (
                                    <FormGroup>
                                        <Label for="ignoredModules">Select Modules to Ignore</Label>
                                        <Select
                                            {...commonSelectProps}
                                            {...ignoredSelectProps}
                                            value={values.ignoredModules || []}
                                            options={moduleSelectorItems}
                                            onChange={(e) => form.change('ignoredModules', e as ModuleOptionType[])}
                                        />
                                    </FormGroup>
                                )}
                            </Widget>
                            <Widget title="Resource Logging">
                                <SwitchField id="logAllResources" label="Collect logs for all resources" />
                                {!values.logAllResources ? (
                                    <FormGroup>
                                        <Label for="loggedResources">Select Resources to Log</Label>
                                        <Select
                                            {...commonSelectProps}
                                            {...loggedSelectProps}
                                            value={values.loggedResources || []}
                                            options={resourceSelectorItems}
                                            onChange={(e) => form.change('loggedResources', e as ResourceOptionType[])}
                                        />
                                    </FormGroup>
                                ) : (
                                    <FormGroup>
                                        <Label for="ignoredResources">Select Resources to Ignore</Label>
                                        <Select
                                            {...commonSelectProps}
                                            {...ignoredSelectProps}
                                            value={values.ignoredResources || []}
                                            options={resourceSelectorItems}
                                            onChange={(e) => form.change('ignoredResources', e as ResourceOptionType[])}
                                        />
                                    </FormGroup>
                                )}
                            </Widget>

                            {formType === 'audit' && (
                                <FormGroup>
                                    <Label for="output">Audit Logs Output Destination</Label>
                                    <Select
                                        options={auditLogsOutputOptions}
                                        placeholder={`Select Output`}
                                        value={values.output}
                                        onChange={(e) => form.change('output', e ?? undefined)}
                                    />
                                </FormGroup>
                            )}
                            <SwitchField id="verbose" label="Verbose" />
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={'Apply'}
                                        inProgressTitle={'Applying..'}
                                        disabled={submitting || isBusy || !hasValuesChanged(values)}
                                        inProgress={isUpdating}
                                        type="submit"
                                    />
                                </ButtonGroup>
                            </div>
                        </BootstrapForm>
                    )}
                </Form>
            );
        },
        [auditLogsOutputOptions, isBusy, isUpdating, moduleSelectorItems, resourceSelectorItems],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Logging Settings"
                titleSize="larger"
                busy={isBusy}
                refreshAction={getFreshLoggingSettings}
                widgetLockName={LockWidgetNameEnum.LoggingSettings}
            >
                <TabLayout
                    tabs={[
                        {
                            title: 'Audit logs',
                            content: createForm(
                                auditFormInitialValues as AuditFormValues,
                                onAuditFormSubmit,
                                hasAuditFormValuesChanged,
                                'audit',
                            ),
                        },
                        {
                            title: 'Event logs',
                            content: createForm(
                                eventFormInitialValues as EventFormValues,
                                onEventFormSubmit,
                                hasEventFormValuesChanged,
                                'event',
                            ),
                        },
                    ]}
                />
            </Widget>
        </Container>
    );
};

export default LoggingSetting;
