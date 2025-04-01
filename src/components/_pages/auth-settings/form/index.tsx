import TextField from 'components/Input/TextField';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/auth-settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Form as BootstrapForm, Button, ButtonGroup, Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { isObjectSame } from 'utils/common-utils';
import { validateAlphaNumericWithSpecialChars, validateCustomUrl, validatePositiveInteger } from 'utils/validators';
import CustomSelect from '../../../Input/CustomSelect';
import { OAuth2ProviderSettingsUpdateDto } from 'types/auth-settings';
import { isValidJWTBearerProvider, isValidOAuth2FlowProvider } from 'utils/oauth2Providers';

enum AuthenticationScheme {
    JwtBearer = 'JwtBearer',
    OAuth2Flow = 'OAuth2Flow',
}

const authenticationSchemeOptions: Record<AuthenticationScheme, OptionType> = {
    [AuthenticationScheme.JwtBearer]: {
        label: 'JWT Bearer',
        value: AuthenticationScheme.JwtBearer,
    },
    [AuthenticationScheme.OAuth2Flow]: {
        label: 'OAuth2 Flow',
        value: AuthenticationScheme.OAuth2Flow,
    },
};
interface OptionType {
    value: string;
    label: string;
}

interface FormValues {
    scheme?: OptionType;
    name?: string;
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

    const [selectedAuthScheme, setSelectedAuthScheme] = useState<AuthenticationScheme | null>(null);

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
            let scheme;
            if (isValidJWTBearerProvider(oauth2Provider)) {
                scheme = authenticationSchemeOptions[AuthenticationScheme.JwtBearer];
            }
            if (isValidOAuth2FlowProvider(oauth2Provider)) {
                scheme = authenticationSchemeOptions[AuthenticationScheme.OAuth2Flow];
            }
            return {
                ...oauth2Provider,
                scheme,
                scope: oauth2Provider.scope?.map((el) => ({ label: el, value: el })) || [],
                audiences: oauth2Provider.audiences?.map((el) => ({ label: el, value: el })) || [],
            };
        } else {
            return {
                name: undefined,
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
                        providerName: values.name ?? '',
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

    const schemeOptions: OptionType[] = [
        authenticationSchemeOptions[AuthenticationScheme.JwtBearer],
        authenticationSchemeOptions[AuthenticationScheme.OAuth2Flow],
    ];

    const renderFormFields = useCallback(
        ({ values, form }: Partial<FormRenderProps<FormValues, Partial<FormValues>>>) => {
            if (!values || !form) return;

            let requiredFields: Partial<Record<keyof FormValues, boolean>> = {};

            if (values.scheme?.value === AuthenticationScheme.JwtBearer) {
                requiredFields = {
                    issuerUrl: true,
                };
            }
            if (values.scheme?.value === AuthenticationScheme.OAuth2Flow) {
                requiredFields = {
                    clientId: true,
                    clientSecret: true,
                    authorizationUrl: true,
                    tokenUrl: true,
                    logoutUrl: true,
                    postLogoutUrl: true,
                };
            }
            return (
                <>
                    <TextField
                        label="Provider Name"
                        id="name"
                        validators={[validateAlphaNumericWithSpecialChars()]}
                        disabled={editMode}
                        required={true}
                    />

                    <TextField
                        id="jwkSetUrl"
                        label="JWK Set Url"
                        validators={[
                            (value, allValues) => {
                                if (!allValues.jwkSet) {
                                    return value ? undefined : 'JWK Set URL is required if JWK Set is not provided.';
                                }
                                return undefined;
                            },
                            validateCustomUrl,
                        ]}
                        disabled={!!values.jwkSet}
                        required={!values.jwkSet}
                        description="The URL where the JSON Web Key Set (JWKS) containing the public keys used to verify JWT tokens can be retrieved."
                    />
                    <TextField
                        id="jwkSet"
                        label="JWK Set"
                        validators={[]}
                        disabled={!!values.jwkSetUrl}
                        required={!values.jwkSetUrl}
                        placeholder="Enter JWK Set encoded in Base64"
                        description="Base64 encoded JWK Set, provided in case JWK Set URL is not available."
                    />

                    <TextField
                        id="clientId"
                        label="Client Id"
                        validators={[]}
                        required={requiredFields.clientId}
                        description="The client ID used to identify the client application during the authorization process."
                    />
                    <TextField
                        id="clientSecret"
                        label="Client Secret"
                        validators={[]}
                        required={requiredFields.clientSecret && !editMode}
                        inputType="password"
                        description="The client secret used by the client application to authenticate with the authorization server."
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
                        description="The list of scopes that define the access levels and permissions requested by the client application."
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
                        description="A list of expected audiences for validating the issued tokens, used to match the intended recipients of the tokens."
                    />

                    <TextField
                        id="tokenUrl"
                        label="Token Url"
                        validators={[]}
                        required={requiredFields.tokenUrl}
                        description="The URL used to exchange the authorization code or credentials for an access token."
                    />
                    <TextField
                        id="authorizationUrl"
                        label="Authorization Url"
                        validators={[validateCustomUrl]}
                        required={requiredFields.authorizationUrl}
                        description="The URL where the authorization server redirects the user for login and authorization."
                    />
                    <TextField
                        id="logoutUrl"
                        label="Logout Url"
                        validators={[validateCustomUrl]}
                        required={requiredFields.logoutUrl}
                        description="URL to end session on provider side."
                    />
                    <TextField
                        id="postLogoutUrl"
                        label="Post Logout Url"
                        validators={[validateCustomUrl]}
                        required={requiredFields.postLogoutUrl}
                        description="URL that user will be redirected after logout from application."
                    />
                    <TextField
                        id="issuerUrl"
                        label="Issuer Url"
                        validators={[validateCustomUrl]}
                        required={requiredFields.issuerUrl}
                        description="URL of issuer issuing authentication tokens. If provided, authentication via JWT token is enabled for this provider."
                    />
                    <TextField
                        id="userInfoUrl"
                        label="User Info Url"
                        validators={[validateCustomUrl]}
                        description="The URL containing information about user."
                    />
                    <Row xs="1" sm="1" md="2" lg="2" xl="2">
                        <Col>
                            <TextField
                                id="skew"
                                label="Skew Time"
                                validators={[validatePositiveInteger()]}
                                placeholder="Enter Time in Seconds"
                                inputType="number"
                                description="The allowed time skew, in seconds, for token validation. This accounts for clock differences between systems. Default value is 30 seconds."
                            />
                        </Col>

                        <Col>
                            <TextField
                                id="sessionMaxInactiveInterval"
                                label="Session Max Inactive Interval"
                                validators={[validatePositiveInteger()]}
                                placeholder="Enter Time in Seconds"
                                inputType="number"
                                description="Duration in seconds after which will inactive user's session be terminated. Default value is 15 minutes."
                            />
                        </Col>
                    </Row>
                </>
            );
        },
        [audienceOptions, scopeOptions, editMode],
    );

    return (
        <Widget title={editMode ? 'Edit OAuth2 Provider' : 'Create OAuth2 Provider'} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <CustomSelect
                            id="scheme"
                            inputId="scheme"
                            label="Authentication Scheme"
                            options={schemeOptions}
                            value={values.scheme}
                            onChange={(e) => form.change('scheme', e as OptionType)}
                            isClearable={false}
                            description="Select authentication scheme supported by the provider."
                        />

                        {values.scheme === undefined ? <></> : renderFormFields({ values, form })}

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
