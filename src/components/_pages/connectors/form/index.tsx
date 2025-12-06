import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import cn from 'classnames';

import { actions as connectorActions, selectors as connectorSelectors } from 'ducks/connectors';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Select from 'components/Select';
import Button from 'components/Button';
import Container from 'components/Container';
import Badge from 'components/Badge';
import TextInput from 'components/TextInput';
import { ConnectorResponseModel, EndpointModel } from 'types/connectors';
import { AuthType, ConnectorStatus, PlatformEnum, Resource } from 'types/openapi';

import { attributeFieldNameTransform, collectFormAttributes } from 'utils/attributes/attributes';

import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired, validateRoutelessUrl } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import AttributeEditor from '../../../Attributes/AttributeEditor';
import TabLayout from '../../../Layout/TabLayout';
import InventoryStatusBadge from '../ConnectorStatus';
import Label from 'components/Label';

interface ConnectorFormProps {
    connectorId?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

interface FormValues {
    uuid: string;
    name: string;
    url: string;
    authenticationType: string;
    username?: string;
    password?: string;
    clientCert?: FileList;
}

export default function ConnectorForm({ connectorId, onCancel, onSuccess }: ConnectorFormProps) {
    const dispatch = useDispatch();

    const authTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AuthType));
    const { id: routeId } = useParams();
    const id = connectorId || routeId;

    const editMode = useMemo(() => !!id, [id]);

    const optionsForAuth: { label: string; value: AuthType }[] = useMemo(
        () => [
            {
                label: getEnumLabel(authTypeEnum, AuthType.None),
                value: AuthType.None,
            },
            {
                label: getEnumLabel(authTypeEnum, AuthType.Basic),
                value: AuthType.Basic,
            },
            {
                label: getEnumLabel(authTypeEnum, AuthType.Certificate),
                value: AuthType.Certificate,
            },
        ],
        [authTypeEnum],
    );

    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const isFetching = useSelector(connectorSelectors.isFetchingDetail);
    const isCreating = useSelector(connectorSelectors.isCreating);
    const isUpdating = useSelector(connectorSelectors.isUpdating);
    const isConnecting = useSelector(connectorSelectors.isConnecting);
    const isReconnecting = useSelector(connectorSelectors.isReconnecting);

    const connectorSelector = useSelector(connectorSelectors.connector);
    const connectionDetails = useSelector(connectorSelectors.connectorConnectionDetails);

    const [connector, setConnector] = useState<ConnectorResponseModel>();

    const connectorUuid = useMemo(() => connectorSelector?.uuid, [connectorSelector?.uuid]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);
    const connectTitle = useMemo(() => (editMode ? 'Reconnect' : 'Connect'), [editMode]);
    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);
    const connectProgressTitle = useMemo(() => (editMode ? 'Reconnecting...' : 'Connecting...'), [editMode]);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Connectors));
    }, [dispatch]);

    useEffect(() => {
        if (id && (!connectorUuid || connectorUuid !== id) && !isFetching) {
            dispatch(connectorActions.getConnectorDetail({ uuid: id }));
        }
    }, [id, connectorUuid, isFetching, dispatch]);

    useEffect(() => {
        if (id && connectorUuid === id && !isFetching) {
            dispatch(connectorActions.reconnectConnector({ uuid: id }));
        }
    }, [id, connectorUuid, isFetching, dispatch]);

    useEffect(() => {
        if (id && connectorUuid === id && connectorSelector) {
            setConnector(connectorSelector);
        } else if (!id) {
            dispatch(connectorActions.clearConnectionDetails());
            dispatch(connectorActions.clearCallbackData());

            setConnector({
                uuid: '',
                name: '',
                url: '',
                authType: AuthType.None,
                status: ConnectorStatus.Offline,
                functionGroups: [],
            });
        }
    }, [id, connectorUuid, connectorSelector, dispatch]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (editMode) {
                if (!connector) return;

                dispatch(
                    connectorActions.updateConnector({
                        uuid: connector?.uuid,
                        connectorUpdateRequest: {
                            url: values.url,
                            authType: values.authenticationType as AuthType,
                            customAttributes: collectFormAttributes('customConnector', resourceCustomAttributes, values),
                        },
                    } as any),
                );
            } else {
                dispatch(
                    connectorActions.createConnector({
                        name: values.name,
                        url: values.url,
                        authType: values.authenticationType as AuthType,
                        customAttributes: collectFormAttributes('customConnector', resourceCustomAttributes, values),
                    } as any),
                );
            }
        },
        [editMode, connector, dispatch, resourceCustomAttributes],
    );

    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const onConnectClick = useCallback(
        (values: FormValues) => {
            if (editMode) {
                dispatch(
                    connectorActions.connectConnector({
                        uuid: connector!.uuid,
                        url: values.url,
                        authType: values.authenticationType as AuthType,
                    }),
                );
            } else {
                dispatch(connectorActions.connectConnector({ url: values.url, authType: values.authenticationType as AuthType }));
            }
        },
        [connector, dispatch, editMode],
    );

    const getEndPointInfo = useCallback((endpoints: EndpointModel[]): TableDataRow[] => {
        return endpoints.map((endpoint: EndpointModel) => ({
            id: endpoint.name,
            columns: [endpoint.name, endpoint.context, endpoint.method],
        }));
    }, []);

    const connectionDetailsHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const endPointsHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                sortable: true,
                sort: 'asc',
                content: 'Name',
            },
            {
                id: 'context',
                sortable: true,
                content: 'Context',
            },
            {
                id: 'method',
                sortable: true,
                content: 'Method',
            },
        ],
        [],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            uuid: connector?.uuid || '',
            name: editMode ? connector?.name || '' : '',
            url: editMode ? connector?.url || '' : '',
            authenticationType: editMode ? connector?.authType || AuthType.None : AuthType.None,
        }),
        [editMode, connector],
    );

    const methods = useForm<FormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, isValid },
        getValues,
        reset,
    } = methods;

    const watchedAuthType = useWatch({
        control,
        name: 'authenticationType',
    });

    const watchedUrl = useWatch({
        control,
        name: 'url',
    });

    // Reset form values when connector is loaded in edit mode
    useEffect(() => {
        if (editMode && connector && connector.uuid === id) {
            const newDefaultValues: FormValues = {
                uuid: connector.uuid || '',
                name: connector.name || '',
                url: connector.url || '',
                authenticationType: connector.authType || AuthType.None,
            };
            reset(newDefaultValues);
        }
    }, [editMode, connector, id, reset]);

    const connectionDetailsData: TableDataRow[] = useMemo(
        () => [
            {
                id: 'url',
                columns: ['URL', watchedUrl],
            },
            {
                id: 'status',
                columns: [
                    'Connector Status',
                    <InventoryStatusBadge
                        key="status"
                        status={connectionDetails && connectionDetails.length > 0 ? ConnectorStatus.Connected : ConnectorStatus.Failed}
                    />,
                ],
            },
            {
                id: 'functionGroups',
                columns: [
                    'Function Group(s)',
                    <div key="functionGroups" className="flex flex-wrap gap-2">
                        {connectionDetails?.map((functionGroup, index) => (
                            <Badge key={index} color="primary">
                                {attributeFieldNameTransform[functionGroup?.name || ''] || functionGroup?.name}
                            </Badge>
                        ))}
                    </div>,
                ],
            },
        ],
        [watchedUrl, connectionDetails],
    );

    // Helper function to convert validators for react-hook-form
    const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
        return {
            validate: (value: any) => {
                const composed = composeValidators(...validators);
                return composed(value);
            },
        };
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="url"
                    control={control}
                    rules={buildValidationRules([validateRequired(), validateRoutelessUrl()])}
                    render={({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            id="url"
                            type="text"
                            label="URL"
                            required
                            placeholder="URL of the connector service"
                            invalid={fieldState.error && fieldState.isTouched}
                            error={
                                fieldState.error && fieldState.isTouched
                                    ? typeof fieldState.error === 'string'
                                        ? fieldState.error
                                        : fieldState.error?.message || 'Invalid value'
                                    : undefined
                            }
                        />
                    )}
                />

                <div>
                    <Controller
                        name="authenticationType"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <Select
                                    id="authenticationTypeSelect"
                                    label="Authentication Type"
                                    value={field.value || AuthType.None}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    options={optionsForAuth.map((opt) => ({ value: opt.value, label: opt.label }))}
                                    placeholder="Select Auth Type"
                                    placement="bottom"
                                />
                                {fieldState.error && fieldState.isTouched && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {typeof fieldState.error === 'string'
                                            ? fieldState.error
                                            : fieldState.error?.message || 'Invalid value'}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                {watchedAuthType === AuthType.Basic && (
                    <>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    id="username"
                                    type="text"
                                    label="Username"
                                    placeholder="Username"
                                    invalid={fieldState.error && fieldState.isTouched}
                                    error={
                                        fieldState.error && fieldState.isTouched
                                            ? typeof fieldState.error === 'string'
                                                ? fieldState.error
                                                : fieldState.error?.message || 'Invalid value'
                                            : undefined
                                    }
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    id="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Password"
                                    invalid={fieldState.error && fieldState.isTouched}
                                    error={
                                        fieldState.error && fieldState.isTouched
                                            ? typeof fieldState.error === 'string'
                                                ? fieldState.error
                                                : fieldState.error?.message || 'Invalid value'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </>
                )}

                {watchedAuthType === AuthType.Certificate && (
                    <div>
                        <Label htmlFor="clientCert">Client Certificate</Label>
                        <Controller
                            name="clientCert"
                            control={control}
                            render={({ field: { onChange, value, ...field }, fieldState }) => (
                                <>
                                    <input
                                        {...field}
                                        id="clientCert"
                                        type="file"
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                        }}
                                        className={cn(
                                            'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                            {
                                                'border-red-500 focus:border-red-500 focus:ring-red-500':
                                                    fieldState.error && fieldState.isTouched,
                                            },
                                        )}
                                    />
                                    {fieldState.error && fieldState.isTouched && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {typeof fieldState.error === 'string'
                                                ? fieldState.error
                                                : fieldState.error?.message || 'Invalid value'}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                )}

                <TabLayout
                    noBorder
                    tabs={[
                        {
                            title: 'Custom Attributes',
                            content: (
                                <AttributeEditor
                                    id="customConnector"
                                    attributeDescriptors={resourceCustomAttributes}
                                    attributes={connector?.customAttributes}
                                />
                            ),
                        },
                    ]}
                />

                <Container className="flex-row justify-end modal-footer !rounded-none" gap={4}>
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={() => onConnectClick(getValues())}
                        disabled={isSubmitting || isConnecting || isReconnecting}
                        type="button"
                    >
                        {isConnecting || isReconnecting ? connectProgressTitle : connectTitle}
                    </Button>
                </Container>

                {connectionDetails && (
                    <Widget busy={isConnecting} noBorder>
                        <CustomTable headers={connectionDetailsHeaders} data={connectionDetailsData} />

                        {connectionDetails && connectionDetails.length > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Connector Functionality Description
                                    </h3>
                                    <hr className="my-4 border-gray-200 dark:border-neutral-700" />
                                    {connectionDetails.map((functionGroup) => (
                                        <Widget
                                            key={functionGroup.name}
                                            title={attributeFieldNameTransform[functionGroup?.name || ''] || functionGroup?.name}
                                            titleSize="large"
                                            widgetExtraTopNode={
                                                <div className="flex flex-wrap gap-2 ml-auto">
                                                    {functionGroup.kinds.map((kinds, index) => (
                                                        <Badge key={index} color="secondary">
                                                            {kinds}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            }
                                        >
                                            <CustomTable headers={endPointsHeaders} data={getEndPointInfo(functionGroup?.endPoints)} />
                                        </Widget>
                                    ))}
                                </div>

                                <div>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={buildValidationRules([validateRequired(), validateAlphaNumericWithSpecialChars()])}
                                        render={({ field, fieldState }) => (
                                            <TextInput
                                                {...field}
                                                id="name"
                                                type="text"
                                                label="Connector Name"
                                                required
                                                placeholder="Connector Name"
                                                disabled={editMode}
                                                invalid={fieldState.error && fieldState.isTouched}
                                                error={
                                                    fieldState.error && fieldState.isTouched
                                                        ? typeof fieldState.error === 'string'
                                                            ? fieldState.error
                                                            : fieldState.error?.message || 'Invalid value'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </div>
                                <Container className="flex-row justify-end modal-footer" gap={4}>
                                    <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} type="button">
                                        Cancel
                                    </Button>

                                    <ProgressButton
                                        title={submitTitle}
                                        inProgressTitle={inProgressTitle}
                                        inProgress={isUpdating || isCreating}
                                        disabled={!isDirty}
                                        type="submit"
                                    />
                                </Container>
                            </div>
                        )}
                    </Widget>
                )}
            </form>
        </FormProvider>
    );
}
