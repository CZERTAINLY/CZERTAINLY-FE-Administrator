import TextField from 'components/Input/TextField';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions, selectors } from 'ducks/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form as BootstrapForm, Button, ButtonGroup } from 'reactstrap';
import { SettingsPlatformModel } from 'types/settings';

export default function PlatformSettingsForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const platformSettings = useSelector(selectors.platformSettings);
    const isFetchingPlatform = useSelector(selectors.isFetchingPlatform);
    const isUpdatingPlatform = useSelector(selectors.isUpdatingPlatform);

    const isBusy = useMemo(() => isFetchingPlatform || isUpdatingPlatform, [isFetchingPlatform, isUpdatingPlatform]);

    const emptySettings = useMemo(() => ({ utils: {} }), []);

    const onSubmit = useCallback(
        (values: SettingsPlatformModel) => {
            const requestSettings = values.utils ? values : emptySettings;
            dispatch(actions.updatePlatformSettings(requestSettings));
        },
        [dispatch, emptySettings],
    );

    useEffect(() => {
        if (!platformSettings) {
            dispatch(actions.getPlatformSettings());
        }
    }, [dispatch, platformSettings]);

    const validateUrl = (url?: string): string | undefined => {
        if (!url || /^https?:\/\/[a-zA-Z0-9\-.]+(:[0-9]+?)?(\/[a-zA-Z0-9\-.]*)*/g.test(url)) {
            return undefined;
        }
        return 'Please enter valid URL.';
    };

    const validateHealthUrl = async (url?: string): Promise<string | undefined> => {
        if (!url) {
            return undefined;
        }
        const error = 'Please enter reachable and valid Utils Service URL (with /health endpoint).';
        try {
            const result = await fetch(url + '/health');
            const json = await result.json();
            return result.status === 200 && json.status === 'UP' ? undefined : error;
        } catch {
            return error;
        }
    };

    class DebouncingHealthValidation {
        clearTimeout = () => {};
        validateHealth = (url?: string) => {
            return new Promise<string | undefined>((resolve) => {
                this.clearTimeout();

                const timerId = setTimeout(() => {
                    resolve(validateHealthUrl(url));
                }, 600);

                this.clearTimeout = () => {
                    clearTimeout(timerId);
                    resolve(undefined);
                };
            });
        };
    }

    const debouncingHealthValidation = new DebouncingHealthValidation();

    return (
        <Widget title="Platform Settings" busy={isBusy}>
            <TabLayout
                tabs={[
                    {
                        title: 'Utils',
                        content: (
                            <div style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
                                <Form<SettingsPlatformModel> initialValues={platformSettings ?? emptySettings} onSubmit={onSubmit}>
                                    {({ handleSubmit, pristine, submitting, valid }) => {
                                        return (
                                            <BootstrapForm onSubmit={handleSubmit}>
                                                <TextField
                                                    label={'Utils Service URL'}
                                                    id={'utils.utilsServiceUrl'}
                                                    validators={[validateUrl, debouncingHealthValidation.validateHealth]}
                                                />

                                                <div className="d-flex justify-content-end">
                                                    <ButtonGroup>
                                                        <ProgressButton
                                                            title={'Save'}
                                                            inProgressTitle={'Saving...'}
                                                            inProgress={submitting}
                                                            disabled={pristine || submitting || !valid}
                                                        />
                                                        <Button color="default" onClick={() => navigate(-1)} disabled={submitting}>
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </div>
                                            </BootstrapForm>
                                        );
                                    }}
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
        </Widget>
    );
}
