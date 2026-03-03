import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { actions as cbomActuatorActions, selectors as cbomActuatorSelectors } from 'ducks/cbomActuator';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsPlatformModel } from 'types/settings';
import { AlertCircle } from 'lucide-react';

const normalizeUrl = (url: string): string => url.replace(/\/+$/g, '');

const buildCbomHealthUrl = (url: string): string => {
    const baseUrl = normalizeUrl(url);
    return baseUrl.endsWith('/api') ? `${baseUrl}/v1/health` : `${baseUrl}/api/v1/health`;
};

const StatusIcon = ({ ok }: { ok?: boolean }) =>
    ok ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path
                d="M9.99996 18.3333C14.6025 18.3333 18.3333 14.6025 18.3333 9.99999C18.3333 5.39749 14.6025 1.66666 9.99996 1.66666C5.39746 1.66666 1.66663 5.39749 1.66663 9.99999C1.66663 14.6025 5.39746 18.3333 9.99996 18.3333Z"
                fill="#15803D"
            />
            <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ) : (
        <AlertCircle size={16} style={{ color: 'red' }} aria-hidden="true" />
    );

type Props = {
    platformSettings?: SettingsPlatformModel;
};

const UtilsSettings = ({ platformSettings }: Props) => {
    const dispatch = useDispatch();

    const health = useSelector(utilsActuatorSelectors.health);
    const cbomHealth = useSelector(cbomActuatorSelectors.health);
    console.log({ platformSettings });

    useEffect(() => {
        const utilsUrl = platformSettings?.utils?.utilsServiceUrl;
        if (utilsUrl) {
            console.log('Utils health check URL:', utilsUrl.replace(/\/+$/g, '') + '/health');
        } else {
            console.log('Utils health check: utilsServiceUrl not set');
        }
        dispatch(utilsActuatorActions.health());
    }, [dispatch, platformSettings]);

    useEffect(() => {
        const cbomRepositoryUrl = platformSettings?.utils?.cbomRepositoryUrl;

        if (!cbomRepositoryUrl) {
            dispatch(cbomActuatorActions.reset());
            return;
        }

        console.log('CBOM health check URL:', buildCbomHealthUrl(cbomRepositoryUrl));
        dispatch(cbomActuatorActions.health(cbomRepositoryUrl));
    }, [platformSettings?.utils?.cbomRepositoryUrl, dispatch]);

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'setting',
                content: 'Setting',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const data: TableDataRow[] = useMemo(
        () =>
            !platformSettings
                ? []
                : [
                      {
                          id: 'utilsUrl',
                          columns: [
                              'Utils Service URL',
                              platformSettings.utils?.utilsServiceUrl ? (
                                  <div className="flex items-center gap-1">
                                      {platformSettings.utils.utilsServiceUrl}&nbsp;
                                      <StatusIcon ok={!!health} />
                                  </div>
                              ) : (
                                  'n/a'
                              ),
                          ],
                      },
                      {
                          id: 'cbomRepositoryUrl',
                          columns: [
                              'CBOM Repository URL',
                              platformSettings.utils?.cbomRepositoryUrl ? (
                                  <div className="flex items-center gap-1">
                                      {platformSettings.utils.cbomRepositoryUrl}&nbsp;
                                      <StatusIcon ok={!!cbomHealth} />
                                  </div>
                              ) : (
                                  'n/a'
                              ),
                          ],
                      },
                  ],
        [platformSettings, health, cbomHealth],
    );

    return (
        <div style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
            <CustomTable headers={headers} data={data} />
        </div>
    );
};

export default UtilsSettings;

/* import TextInput from 'components/TextInput';
import ProgressButton from 'components/ProgressButton';
import Button from 'components/Button';
import Container from 'components/Container';
import { actions, selectors } from 'ducks/settings';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { getFieldErrorMessage } from 'utils/validators-helper';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsPlatformModel } from 'types/settings';
import { useNavigate } from 'react-router';



const normalizeUrl = (url: string): string => url.replace(/\/+$/, '');

const buildCbomHealthPath = (url: string): string => {
    const baseUrl = normalizeUrl(url);
    return baseUrl.endsWith('/api') ? '/v1/health' : '/api/v1/health';
};

const validateHealthUrl = async (url: string | undefined, path: string, error: string): Promise<string | undefined> => {
    if (!url) {
        return undefined;
    }
    try {
        const healthUrl = `${normalizeUrl(url)}${path}`;
        console.log('form validation - fetching health:', healthUrl);
        const result = await fetch(healthUrl);
        const json = await result.json();
        return result.status === 200 && json.status === 'UP' ? undefined : error;
    } catch {
        return error;
    }
};

class DebouncingHealthValidation {
    clearTimeout = () => {};
    validateHealth = (url: string | undefined, path: string, error: string) => {
        return new Promise<string | undefined>((resolve) => {
            this.clearTimeout();

            const timerId = setTimeout(() => {
                resolve(validateHealthUrl(url, path, error));
            }, 600);

            this.clearTimeout = () => {
                clearTimeout(timerId);
                resolve(undefined);
            };
        });
    };
}

type FormValues = {
    utilsServiceUrl?: string;
    cbomRepositoryUrl?: string;
};

interface UtilsSettingsFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

const UtilsSettingsForm = ({ onCancel, onSuccess }: UtilsSettingsFormProps = {}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const platformSettings = useSelector(selectors.platformSettings);
    const isFetchingPlatform = useSelector(selectors.isFetchingPlatform);
    const isUpdatingPlatform = useSelector(selectors.isUpdatingPlatform);

    const isBusy = useMemo(() => isFetchingPlatform || isUpdatingPlatform, [isFetchingPlatform, isUpdatingPlatform]);

    const emptySettings = useMemo(() => ({ utils: {} }), []);

    const defaultValues = useMemo(() => {
        return {
            utilsServiceUrl: platformSettings?.utils?.utilsServiceUrl || '',
            cbomRepositoryUrl: platformSettings?.utils?.cbomRepositoryUrl || '',
        };
    }, [platformSettings?.utils?.utilsServiceUrl, platformSettings?.utils?.cbomRepositoryUrl]);

    const methods = useForm<FormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, isValid },
        reset,
    } = methods;

    // Reset form when platformSettings change
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    useEffect(() => {
        if (!platformSettings) {
            dispatch(actions.getPlatformSettings());
        }
    }, [dispatch, platformSettings]);

    const debouncingUtilsHealthValidation = useMemo(() => new DebouncingHealthValidation(), []);
    const debouncingCbomHealthValidation = useMemo(() => new DebouncingHealthValidation(), []);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const requestSettings: SettingsPlatformModel =
                values.utilsServiceUrl || values.cbomRepositoryUrl
                    ? {
                          utils: {
                              utilsServiceUrl: values.utilsServiceUrl,
                              cbomRepositoryUrl: values.cbomRepositoryUrl,
                          },
                      }
                    : emptySettings;
            dispatch(actions.updatePlatformSettings(requestSettings));
        },
        [dispatch, emptySettings],
    );

    const wasUpdating = useRef(isUpdatingPlatform);

    useEffect(() => {
        if (wasUpdating.current && !isUpdatingPlatform) {
            if (onSuccess) {
                onSuccess();
            }
        }
        wasUpdating.current = isUpdatingPlatform;
    }, [isUpdatingPlatform, onSuccess]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="utilsServiceUrl"
                    control={control}
                    rules={{
                        validate: async (value) => {
                            const urlError = validateUrl(value);
                            if (urlError) return urlError;
                            if (value) {
                                return await debouncingUtilsHealthValidation.validateHealth(
                                    value,
                                    '/health',
                                    'Please enter reachable and valid Utils Service URL (with /health endpoint).',
                                );
                            }
                            return undefined;
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            id="utilsServiceUrl"
                            type="text"
                            label="Utils Service URL"
                            placeholder="Utils Service URL"
                            invalid={fieldState.error && fieldState.isTouched}
                            error={getFieldErrorMessage(fieldState)}
                        />
                    )}
                />

                <Controller
                    name="cbomRepositoryUrl"
                    control={control}
                    rules={{
                        validate: async (value) => {
                            const urlError = validateUrl(value);
                            if (urlError) return urlError;
                            if (value) {
                                const cbomHealthPath = buildCbomHealthPath(value);
                                return await debouncingCbomHealthValidation.validateHealth(
                                    value,
                                    cbomHealthPath,
                                    'Please enter reachable and valid CBOM Repository URL (with /api/v1/health endpoint).',
                                );
                            }
                            return undefined;
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            id="cbomRepositoryUrl"
                            type="text"
                            label="CBOM Repository URL"
                            placeholder="CBOM Repository URL"
                            invalid={fieldState.error && fieldState.isTouched}
                            error={getFieldErrorMessage(fieldState)}
                        />
                    )}
                />

                <Container className="flex-row justify-end modal-footer" gap={4}>
                    <Button variant="outline" onClick={onCancel} disabled={isSubmitting || isBusy} type="button">
                        Cancel
                    </Button>
                    <ProgressButton
                        title={'Save'}
                        inProgressTitle={'Saving...'}
                        inProgress={isSubmitting || isBusy}
                        disabled={!isDirty || isSubmitting || !isValid || isBusy}
                        type="submit"
                    />
                </Container>
            </form>
        </FormProvider>
    );
};

export default UtilsSettingsForm;
 */
