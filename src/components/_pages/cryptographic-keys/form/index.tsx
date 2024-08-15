import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';
import { selectors as authSelectors } from 'ducks/auth';
import { actions as groupActions, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as userActions, selectors as userSelectors } from 'ducks/users';

import { actions as cryptographicKeysActions, selectors as cryptographicKeysSelectors } from 'ducks/cryptographic-keys';
import { actions as tokenProfilesActions, selectors as tokenProfilesSelectors } from 'ducks/token-profiles';
import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { TokenProfileResponseModel } from 'types/token-profiles';
import { actions as userInterfaceActions } from '../../../../ducks/user-interface';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateLength, validateRequired } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { KeyRequestType, PlatformEnum, Resource } from '../../../../types/openapi';

interface CryptographicKeyFormProps {
    usesGlobalModal?: boolean;
}

interface SelectChangeValue {
    value: string;
    label: string;
}
interface FormValues {
    name: string;
    description: string;
    tokenProfile: { value: TokenProfileResponseModel; label: string } | undefined;
    type?: { value: KeyRequestType; label: string } | undefined;
    selectedGroups: SelectChangeValue[];
    owner?: { value: string; label: string } | undefined;
}

export default function CryptographicKeyForm({ usesGlobalModal = false }: CryptographicKeyFormProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id, tokenId } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const keyDetail = useSelector(cryptographicKeysSelectors.cryptographicKey);

    const groups = useSelector(groupSelectors.certificateGroups);
    const users = useSelector(userSelectors.users);
    const auth = useSelector(authSelectors.profile);
    const keyRequestTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyRequestType));

    const tokenProfiles = useSelector(tokenProfilesSelectors.tokenProfiles);
    const cryptographicKeyAttributeDescriptors = useSelector(cryptographicKeysSelectors.keyAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    const isFetchingCryptographicKeyAttributes = useSelector(tokenProfilesSelectors.isFetchingAttributes);

    const isFetchingDetail = useSelector(cryptographicKeysSelectors.isFetchingDetail);
    const isCreating = useSelector(cryptographicKeysSelectors.isCreating);
    const isUpdating = useSelector(cryptographicKeysSelectors.isUpdating);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [tokenProfile, setTokenProfile] = useState<TokenProfileResponseModel>();

    const isBusy = useMemo(
        () => isFetchingDetail || isCreating || isUpdating || isFetchingCryptographicKeyAttributes || isFetchingResourceCustomAttributes,
        [isCreating, isFetchingDetail, isUpdating, isFetchingCryptographicKeyAttributes, isFetchingResourceCustomAttributes],
    );

    useEffect(() => {
        dispatch(cryptographicKeysActions.clearKeyAttributeDescriptors());
        setGroupAttributesCallbackAttributes([]);
        dispatch(tokenProfilesActions.listTokenProfiles({}));
        dispatch(connectorActions.clearCallbackData());
        dispatch(groupActions.listGroups());
        if (editMode) {
            dispatch(userActions.list());
            dispatch(cryptographicKeysActions.getCryptographicKeyDetail({ tokenInstanceUuid: tokenId!, uuid: id! }));
        }
    }, [dispatch, editMode, id, tokenId]);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Keys));
    }, [dispatch]);

    const onTokenProfileChange = useCallback(
        (
            event: SingleValue<{
                label: string | undefined;
                value: TokenProfileResponseModel | undefined;
            }>,
        ) => {
            if (!event) return;
            dispatch(cryptographicKeysActions.clearKeyAttributeDescriptors());
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);

            if (!event.value || !tokenProfiles) return;
            const provider = tokenProfiles.find((p) => p.uuid === event.value?.uuid);

            if (!provider) return;
            setTokenProfile(provider);
        },
        [dispatch, tokenProfiles],
    );

    const onKeyTypeChange = useCallback(
        (type: KeyRequestType, form: FormApi<FormValues>) => {
            if (editMode) return;
            if (!tokenProfile) return;
            if (!type) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            form.mutators.clearAttributes('cryptographicKey');
            dispatch(cryptographicKeysActions.clearKeyAttributeDescriptors());
            dispatch(
                cryptographicKeysActions.listAttributeDescriptors({
                    tokenInstanceUuid: tokenProfile.tokenInstanceUuid,
                    tokenProfileUuid: tokenProfile.uuid,
                    keyRequestType: type,
                }),
            );
        },
        [dispatch, editMode, tokenProfile],
    );

    const onCancelClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (editMode) {
                dispatch(
                    cryptographicKeysActions.updateCryptographicKey({
                        profileUuid: id!,
                        tokenInstanceUuid: values.tokenProfile!.value.tokenInstanceUuid,
                        redirect: `../../../keys/detail/${values.tokenProfile!.value.tokenInstanceUuid}/${id}`,
                        cryptographicKeyEditRequest: {
                            description: values.description,
                            tokenProfileUuid: values.tokenProfile!.value.uuid,
                            ownerUuid: values.owner ? values.owner.value : undefined,
                            groupUuids: values?.selectedGroups?.length ? values?.selectedGroups?.map((group) => group.value) : [],
                            name: values.name,
                        },
                    }),
                );
            } else {
                dispatch(
                    cryptographicKeysActions.createCryptographicKey({
                        tokenInstanceUuid: values.tokenProfile!.value.tokenInstanceUuid,
                        tokenProfileUuid: values.tokenProfile!.value.uuid,
                        type: values.type!.value,
                        cryptographicKeyAddRequest: {
                            groupUuids: values?.selectedGroups?.length ? values?.selectedGroups?.map((group) => group.value) : [],
                            name: values.name,
                            description: values.description,
                            attributes: collectFormAttributes(
                                'cryptographicKey',
                                [...(cryptographicKeyAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                                values,
                            ),
                            customAttributes: collectFormAttributes('customCryptographicKey', resourceCustomAttributes, values),
                            enabled: usesGlobalModal,
                        },
                        usesGlobalModal,
                    }),
                );
            }
        },
        [
            dispatch,
            editMode,
            id,
            cryptographicKeyAttributeDescriptors,
            groupAttributesCallbackAttributes,
            resourceCustomAttributes,
            usesGlobalModal,
        ],
    );

    const optionsForKeys = useMemo(
        () =>
            tokenProfiles.map((token) => ({
                value: token,
                label: token.name,
            })),
        [tokenProfiles],
    );

    const optionsForUsers = useMemo(
        () =>
            users.map((user) => ({
                value: user.uuid,
                label: user.username,
            })),
        [users],
    );

    const optionsForGroups = useMemo(
        () =>
            groups.map((group) => ({
                value: group.uuid,
                label: group.name,
            })),
        [groups],
    );

    const optionsForType = () => {
        let options: { value: KeyRequestType; label: string }[] = [];
        for (let key in KeyRequestType) {
            options.push({
                value: KeyRequestType[key as keyof typeof KeyRequestType],
                label: getEnumLabel(keyRequestTypeEnum, KeyRequestType[key as keyof typeof KeyRequestType]),
            });
        }
        return options;
    };

    const attributeTabs = (form: FormApi<FormValues>) => {
        if (!editMode) {
            return [
                {
                    title: 'Connector Attributes',
                    content: !cryptographicKeyAttributeDescriptors ? (
                        <></>
                    ) : (
                        <AttributeEditor
                            id="cryptographicKey"
                            callbackParentUuid={keyDetail?.tokenProfileUuid || form.getFieldState('tokenProfile')?.value?.value.uuid || ''}
                            callbackResource={Resource.Keys}
                            attributeDescriptors={cryptographicKeyAttributeDescriptors || []}
                            groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                            setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                        />
                    ),
                },
                {
                    title: 'Custom Attributes',
                    content: (
                        <AttributeEditor
                            id="customCryptographicKey"
                            attributeDescriptors={resourceCustomAttributes}
                            attributes={keyDetail?.customAttributes}
                        />
                    ),
                },
            ];
        } else {
            return [
                {
                    title: 'Custom Attributes',
                    content: (
                        <AttributeEditor
                            id="customCryptographicKey"
                            attributeDescriptors={resourceCustomAttributes}
                            attributes={keyDetail?.customAttributes}
                        />
                    ),
                },
            ];
        }
    };

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? keyDetail?.name || '' : '',
            description: editMode ? keyDetail?.description || '' : '',
            tokenProfile: editMode
                ? keyDetail
                    ? optionsForKeys.find((option) => option.value.uuid === (keyDetail.tokenProfileUuid || ''))
                    : undefined
                : undefined,
            selectedGroups: editMode
                ? keyDetail && keyDetail.groups?.length
                    ? keyDetail.groups?.map((group) => ({ value: group.uuid, label: group.name }))
                    : []
                : [],
            owner: editMode
                ? keyDetail && keyDetail.ownerUuid && keyDetail.owner
                    ? { value: keyDetail.ownerUuid, label: keyDetail.owner }
                    : undefined
                : undefined,
            type: undefined,
        }),
        [editMode, optionsForKeys, keyDetail],
    );

    const title = useMemo(() => (editMode ? 'Edit Key' : 'Create Key'), [editMode]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Key Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        type="text"
                                        placeholder="Enter Key Name"
                                        valid={!meta.touched || !meta.error}
                                        invalid={meta.touched && meta.error}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Description</Label>

                                    <Input
                                        {...input}
                                        id="description"
                                        type="textarea"
                                        className="form-control"
                                        placeholder="Enter Description / Comment"
                                        valid={!meta.touched || !meta.error}
                                        invalid={meta.touched && meta.error}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        {editMode ? (
                            <Field name="owner" validate={composeValidators(validateAlphaNumericWithSpecialChars())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="ownerSelect">Owner</Label>

                                        <Select
                                            inputId="ownerSelect"
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForUsers}
                                            placeholder="Select Owner"
                                            onChange={(event) => {
                                                input.onChange(event);
                                            }}
                                            styles={{
                                                control: (provided) =>
                                                    meta.touched && meta.invalid
                                                        ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                        : { ...provided },
                                            }}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>
                        ) : (
                            <Field name="owner">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="owner">Owner</Label>

                                        <Input
                                            {...input}
                                            id="owner"
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Key Owner"
                                            disabled={!editMode}
                                            value={auth?.username || ''}
                                            valid={!meta.touched || !meta.error}
                                            invalid={meta.touched && meta.error}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>
                        )}

                        <Field name="selectedGroups">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="selectedGroupsSelect">Groups</Label>

                                    <Select
                                        {...input}
                                        inputId="selectedGroupsSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForGroups}
                                        placeholder="Select Groups"
                                        onChange={(event) => {
                                            input.onChange(event);
                                        }}
                                        isMulti
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

                        <Field name="tokenProfile" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="tokenProfileSelect">Token Profile</Label>

                                    <Select
                                        {...input}
                                        inputId="tokenProfileSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForKeys}
                                        placeholder="Select Token Profile"
                                        onChange={(event) => {
                                            onTokenProfileChange(event);
                                            form.mutators.clearAttributes('cryptographicKey');
                                            form.mutators.setAttribute('type', undefined);
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

                        {tokenProfile && !editMode ? (
                            <Field name="type" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="typeSelect">Select Key Type</Label>

                                        <Select
                                            {...input}
                                            id="type"
                                            inputId="typeSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForType()}
                                            placeholder="Select to change Key Type"
                                            onChange={(event: any) => {
                                                onKeyTypeChange(event.value, form);
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
                        ) : (
                            <></>
                        )}

                        <br />

                        <TabLayout tabs={attributeTabs(form)} />

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={editMode ? 'Update' : 'Create'}
                                    inProgressTitle={editMode ? 'Updating...' : 'Creating...'}
                                    inProgress={submitting}
                                    disabled={pristine || submitting || !valid}
                                />

                                <Button
                                    color="default"
                                    onClick={() => (usesGlobalModal ? dispatch(userInterfaceActions.hideGlobalModal()) : onCancelClick())}
                                    disabled={submitting}
                                >
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
