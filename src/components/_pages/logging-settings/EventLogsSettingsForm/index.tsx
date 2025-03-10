import CheckboxField from 'components/Input/CheckboxField';
import ItemSelector from 'components/ItemSelector';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/settings';
import { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Form as BootstrapForm, ButtonGroup } from 'reactstrap';
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

const EventLogsSettingForm = () => {
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
                    auditLogs: loggingSettings.auditLogs,
                    eventLogs: {
                        logAllModules: values.logAllModules,
                        logAllResources: values.logAllResources,
                        ignoredModules: values.ignoredModules,
                        ignoredResources: values.ignoredResources,
                        loggedModules: values.loggedModules,
                        loggedResources: values.loggedResources,
                    },
                }),
            );
        },
        [dispatch, loggingSettings],
    );

    const initialValues = useMemo(() => {
        if (!loggingSettings) return {};
        return loggingSettings.eventLogs;
    }, [loggingSettings]);

    const hasValuesChanged = useCallback(
        (values: FormValues) =>
            !isObjectSame(values as unknown as Record<string, unknown>, initialValues as unknown as Record<string, unknown>),
        [initialValues],
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
        [resourceEnum],
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

export default EventLogsSettingForm;
