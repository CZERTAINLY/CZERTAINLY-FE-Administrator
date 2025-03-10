import ItemSelector from 'components/_pages/logging-settings/ItemSelector';
import CheckboxField from 'components/Input/CheckboxField';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/settings';
import { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Form as BootstrapForm, ButtonGroup, FormGroup, Label, Row } from 'reactstrap';
import { AuditLoggingSettingsDtoOutputEnum, Module, PlatformEnum, Resource } from 'types/openapi';
import { isObjectSame } from 'utils/common-utils';

type FormValues = {
    logAllModules: boolean;
    logAllResources: boolean;
    loggedModules?: Module[];
    ignoredModules?: Module[];
    loggedResources?: Resource[];
    ignoredResources?: Resource[];
    output: {
        label: string;
        value: AuditLoggingSettingsDtoOutputEnum;
    };
};

const AuditLogsSettingForm = () => {
    const dispatch = useDispatch();

    const loggingSettings = useSelector(selectors.loggingSettings);
    const isFetching = useSelector(selectors.isFetchingLoggingSetting);
    const isUpdating = useSelector(selectors.isUpdatingLoggingSetting);

    const moduleEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Module));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const isBusy = useMemo(() => isFetching || isUpdating, [isFetching, isUpdating]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values || !loggingSettings) return;

            dispatch(
                actions.updateLoggingSettings({
                    eventLogs: loggingSettings.eventLogs,
                    auditLogs: {
                        logAllModules: values.logAllModules,
                        logAllResources: values.logAllResources,
                        ignoredModules: values.ignoredModules,
                        ignoredResources: values.ignoredResources,
                        loggedModules: values.loggedModules,
                        loggedResources: values.loggedResources,
                        output: values.output.value,
                    },
                }),
            );
        },
        [dispatch, loggingSettings],
    );

    const initialValues = useMemo(() => {
        if (!loggingSettings) return {};
        return {
            ...loggingSettings.auditLogs,
            output: {
                label: loggingSettings.auditLogs.output,
                value: loggingSettings.auditLogs.output,
            },
        } as FormValues;
    }, [loggingSettings]);

    const hasValuesChanged = useCallback(
        (values: FormValues) =>
            !isObjectSame(values as unknown as Record<string, unknown>, initialValues as unknown as Record<string, unknown>),
        [initialValues],
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
        [moduleEnum],
    );

    return (
        <Form initialValues={initialValues} onSubmit={onSubmit}>
            {({ handleSubmit, values, submitting, form }) => (
                <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                    <Widget title="Module Logging">
                        <br />
                        <CheckboxField id="logAllModules" label="Collect logs for all modules" />
                        {!values.logAllModules ? (
                            <ItemSelector
                                value={values.loggedModules || []}
                                items={moduleSelectorItems}
                                onChange={(e) => form.change('loggedModules', e as Module[])}
                                content={{
                                    selectedLabel: 'Logged Modules',
                                    label: 'Select Modules to Log',
                                }}
                                selectedItemStyleVariant="green"
                            />
                        ) : (
                            <ItemSelector
                                value={values.ignoredModules || []}
                                items={moduleSelectorItems}
                                onChange={(e) => form.change('ignoredModules', e as Module[])}
                                content={{
                                    selectedLabel: 'Ignored Modules',
                                    label: 'Select Modules to Ignore',
                                }}
                                selectedItemStyleVariant="red"
                            />
                        )}
                    </Widget>
                    <Widget title="Resource Logging">
                        <br />
                        <CheckboxField id="logAllResources" label="Collect logs for all resources" />
                        {!values.logAllResources ? (
                            <ItemSelector
                                value={values.loggedResources || []}
                                items={resourceSelectorItems}
                                onChange={(e) => form.change('loggedResources', e as Resource[])}
                                content={{
                                    selectedLabel: 'Logged Resources',
                                    label: 'Select Resources to Log',
                                    filterPlaceholder: 'Search for Resources',
                                }}
                                selectedItemStyleVariant="green"
                                showFilter
                            />
                        ) : (
                            <ItemSelector
                                value={values.ignoredResources || []}
                                items={resourceSelectorItems}
                                onChange={(e) => form.change('ignoredResources', e as Resource[])}
                                content={{
                                    selectedLabel: 'Ignored Resources',
                                    label: 'Select Resources to Ignore',
                                    filterPlaceholder: 'Search for Resources',
                                }}
                                selectedItemStyleVariant="red"
                                showFilter
                            />
                        )}
                    </Widget>

                    <FormGroup>
                        <Label for="output">Audit Logs Output Destination</Label>
                        <Select
                            options={auditLogsOutputOptions}
                            placeholder={`Select Output`}
                            value={values.output}
                            onChange={(e) => form.change('output', e ?? undefined)}
                        />
                    </FormGroup>
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
};

export default AuditLogsSettingForm;
