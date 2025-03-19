import TextField from 'components/Input/TextField';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/auth-settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { isObjectSame } from 'utils/common-utils';
import { composeValidators, validateAlphaNumericWithSpecialChars, validatePositiveInteger, validateRequired } from 'utils/validators';
import CustomSelect from '../../../Input/CustomSelect';
import { OAuth2ProviderSettingsUpdateDto } from 'types/auth-settings';

interface OptionType {
    value: string;
    label: string;
}
interface FormValues {
    name: string;
    issuerUrl?: string;
    clientId?: string;
    clientSecret?: string;
    authorizationUrl?: string;
    tokenUrl?: string;
    jwkSetUrl?: string;
    jwkSet?: string;
    scope?: OptionType[];
    logoutUrl?: string;
    postLogoutUrl?: string;
    userInfoUrl?: string;
    audiences?: OptionType[];
    skew?: number;
    sessionMaxInactiveInterval?: number;
}

export default function OAuth2ProviderForm() {
    const { providerName } = useParams();
    const editMode = providerName !== undefined;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const oauth2Provider = useSelector(selectors.oauth2Provider);
    const isFetchingProvider = useSelector(selectors.isFetchingProvider);
    const isUpdatingProvider = useSelector(selectors.isUpdatingProvider);
    const isCreatingProvider = useSelector(selectors.isCreatingProvider);

    const [audienceOptions, setAudienceOptions] = useState<OptionType[]>([]);
    const [scopeOptions, setScopeOptions] = useState<OptionType[]>([]);

    const isBusy = useMemo(
        () => isFetchingProvider || isUpdatingProvider || isCreatingProvider,
        [isFetchingProvider, isUpdatingProvider, isCreatingProvider],
    );

    useEffect(() => {
        dispatch(actions.resetState());
        if (!providerName) return;
        dispatch(actions.getOAuth2ProviderSettings({ providerName }));
    }, [dispatch, providerName]);

    useEffect(() => {
        setAudienceOptions(oauth2Provider?.audiences?.map((el) => ({ label: el, value: el })) || []);
        setScopeOptions(oauth2Provider?.scope?.map((el) => ({ label: el, value: el })) || []);
    }, [oauth2Provider]);

    const defaultValues: FormValues = useMemo(() => {
        if (editMode && oauth2Provider) {
            return {
                ...oauth2Provider,
                scope: oauth2Provider.scope?.map((el) => ({ label: el, value: el })) || [],
                audiences: oauth2Provider.audiences?.map((el) => ({ label: el, value: el })) || [],
            };
        } else {
            return {
                name: '',
                issuerUrl: undefined,
                clientId: undefined,
                clientSecret: undefined,
                authorizationUrl: undefined,
                tokenUrl: undefined,
                jwkSetUrl: undefined,
                jwkSet: undefined,
                scope: [],
                logoutUrl: undefined,
                postLogoutUrl: undefined,
                userInfoUrl: undefined,
                audiences: [],
                skew: undefined,
                sessionMaxInactiveInterval: undefined,
            };
        }
    }, [editMode, oauth2Provider]);

    const onCancel = useCallback(() => {
        navigate('../authenticationsettings');
    }, [navigate]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const updateModel: OAuth2ProviderSettingsUpdateDto = {
                issuerUrl: values.issuerUrl,
                clientId: values.clientId,
                authorizationUrl: values.authorizationUrl,
                tokenUrl: values.tokenUrl,
                jwkSetUrl: values.jwkSetUrl,
                jwkSet: values.jwkSet,
                scope: values.scope?.map((el) => el.value),
                logoutUrl: values.logoutUrl,
                postLogoutUrl: values.postLogoutUrl,
                userInfoUrl: values.userInfoUrl,
                audiences: values.audiences?.map((el) => el.value),
                skew: values.skew,
                sessionMaxInactiveInterval: values.sessionMaxInactiveInterval,
            };

            Object.assign(updateModel, { clientSecret: values.clientSecret });

            if (editMode) {
                dispatch(
                    actions.updateOAuth2Provider({
                        providerName,
                        oauth2ProviderSettingsUpdateModel: updateModel,
                    }),
                );
            } else {
                dispatch(
                    actions.createOAuth2Provider({
                        providerName: values.name,
                        oauth2ProviderSettingsUpdateModel: updateModel,
                    }),
                );
            }
        },
        [dispatch, providerName, editMode],
    );

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [defaultValues],
    );

    return (
        <Widget title={editMode ? 'Edit OAuth2 Provider' : 'Create OAuth2 Provider'} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <TextField
                            label={'Provider Name'}
                            id={'name'}
                            validators={[composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())]}
                            disabled={editMode}
                        />

                        <TextField id="clientId" label="Client Id" validators={[]} />
                        <TextField
                            id="clientSecret"
                            label="Client Secret"
                            validators={!editMode ? [validateRequired()] : []}
                            inputType="password"
                        />

                        <CustomSelect
                            id="scope"
                            inputId="scope"
                            label="Scope"
                            options={scopeOptions}
                            value={values.scope}
                            onChange={(e) => form.change('scope', e as OptionType[])}
                            isMulti
                            isClearable
                            allowTextInput
                            validators={[]}
                        />
                        <CustomSelect
                            id="audiences"
                            inputId="audiences"
                            label="Audiences"
                            options={audienceOptions}
                            value={values.audiences}
                            onChange={(e) => form.change('audiences', e as OptionType[])}
                            isMulti
                            isClearable
                            allowTextInput
                            validators={[]}
                        />

                        <TextField
                            id="jwkSetUrl"
                            label="JWK Set Url"
                            validators={[
                                (value, allValues) => {
                                    if (!allValues.jwkSet) {
                                        return value ? undefined : 'JWK Set URL is required if JWK Set is not provided';
                                    }
                                    return undefined;
                                },
                            ]}
                            disabled={!!values.jwkSet}
                        />
                        <TextField
                            id="jwkSet"
                            label="JWK Set"
                            validators={[]}
                            disabled={!!values.jwkSetUrl}
                            placeholder="Enter JWK Set encoded in Base64"
                        />
                        <TextField id="issuerUrl" label="Issuer Url" validators={[]} />
                        <TextField id="authorizationUrl" label="Authorization Url" validators={[]} />
                        <TextField id="tokenUrl" label="Token Url" validators={[]} />
                        <TextField id="logoutUrl" label="Logout Url" validators={[]} />
                        <TextField id="postLogoutUrl" label="Post Logout Url" validators={[]} />
                        <TextField id="userInfoUrl" label="User Info Url" validators={[]} />

                        <Field name="skew" validate={composeValidators(validatePositiveInteger())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="skew">Skew Time</Label>

                                    <Input
                                        {...input}
                                        id="skew"
                                        type="number"
                                        placeholder="Enter Time in Seconds"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="sessionMaxInactiveInterval" validate={composeValidators(validatePositiveInteger())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="sessionMaxInactiveInterval">Session Max Inactive Interval</Label>

                                    <Input
                                        {...input}
                                        id="sessionMaxInactiveInterval"
                                        type="number"
                                        placeholder="Enter Time in Seconds"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={editMode ? 'Save' : 'Create'}
                                    inProgressTitle={editMode ? 'Saving...' : 'Creating...'}
                                    inProgress={submitting}
                                    disabled={areDefaultValuesSame(values) || isBusy}
                                />

                                <Button color="default" onClick={onCancel} disabled={submitting}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
}
