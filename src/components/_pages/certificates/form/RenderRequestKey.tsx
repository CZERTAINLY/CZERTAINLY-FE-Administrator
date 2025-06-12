import CustomSelectComponent from 'components/CustomSelectComponent';
import CryptographicKeyForm from 'components/_pages/cryptographic-keys/form';
import { selectors as keySelectors } from 'ducks/cryptographic-keys';
import { actions as cryptographyOperationActions } from 'ducks/cryptographic-operations';
import { useCallback, useEffect, useMemo } from 'react';
import { Field, useForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import { FormFeedback, FormGroup, Label } from 'reactstrap';
import { CryptographicKeyPairResponseModel } from 'types/cryptographic-keys';
import { validateRequired } from 'utils/validators';
import { FormValues } from '.';
import { actions as userInterfaceActions, selectors as userInterfaceSelectors } from '../../../../ducks/user-interface';
import { KeyType } from '../../../../types/openapi';

const RenderRequestKey = ({ type, values }: { type: 'alt' | 'normal'; values: FormValues }) => {
    const form = useForm();
    const initiateFormCallback = useSelector(userInterfaceSelectors.selectInitiateFormCallback);
    const formCallbackValue = useSelector(userInterfaceSelectors.selectCallbackValue);
    const keys = useSelector(keySelectors.cryptographicKeyPairs);
    const altKeys = useSelector(keySelectors.altCryptographicKeyPairs);

    const dispatch = useDispatch();
    const isAltKey = type === 'alt';

    const keyOptions = useMemo(
        () =>
            (isAltKey ? altKeys : keys).map((key) => ({
                label: key.name,
                value: key,
            })),
        [keys, altKeys, isAltKey],
    );

    const onKeyChange = useCallback(
        (event: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }>) => {
            if (!event) return;
            if (!event.value.tokenProfileUuid) return;
            if (!event.value.tokenInstanceUuid) return;
            if (event.value.items.filter((e) => e.type === KeyType.Private).length === 0) return;
            dispatch(cryptographyOperationActions.clearSignatureAttributeDescriptors(type));
            dispatch(
                cryptographyOperationActions.listSignatureAttributeDescriptors({
                    uuid: event.value.uuid,
                    tokenProfileUuid: event.value.tokenInstanceUuid,
                    tokenInstanceUuid: event.value.tokenInstanceUuid,
                    keyItemUuid: event.value.items.filter((e) => e.type === KeyType.Private)[0].uuid,
                    algorithm: event.value.items.filter((e) => e.type === KeyType.Private)[0].keyAlgorithm,
                    store: type,
                }),
            );
        },
        [dispatch, type],
    );

    useEffect(() => {
        if (initiateFormCallback && formCallbackValue) {
            const newOption = keyOptions.find((option) => option.label === formCallbackValue);
            if (newOption) {
                form.change(isAltKey ? 'altKey' : 'key', newOption);
                dispatch(userInterfaceActions.clearFormCallbackValue());
                dispatch(userInterfaceActions.setInitiateFormCallback(false));
                onKeyChange(newOption);
            }
        }
    }, [initiateFormCallback, onKeyChange, formCallbackValue, dispatch, keyOptions, form, isAltKey]);

    return (values.tokenProfile && !isAltKey) || (values.altTokenProfile && isAltKey) ? (
        <Field name={isAltKey ? 'altKey' : 'key'} validate={validateRequired()}>
            {({ input, meta }) => (
                <FormGroup>
                    <Label for={isAltKey ? 'renderRequestAltKeySelect' : 'renderRequestKeySelect'}>
                        {isAltKey ? 'Alternative Key' : 'Key'}
                    </Label>

                    <Select
                        {...input}
                        id={isAltKey ? 'altKey' : 'key'}
                        inputId={isAltKey ? 'renderRequestAltKeySelect' : 'renderRequestKeySelect'}
                        maxMenuHeight={140}
                        menuPlacement="auto"
                        options={keyOptions}
                        placeholder={isAltKey ? 'Select Alternative Key' : 'Select Key'}
                        onChange={(e) => {
                            onKeyChange(e);
                            input.onChange(e);
                        }}
                        components={{
                            Menu: (props) => (
                                <CustomSelectComponent
                                    onAddNew={() => {
                                        dispatch(
                                            userInterfaceActions.showGlobalModal({
                                                content: <CryptographicKeyForm usesGlobalModal />,
                                                isOpen: true,
                                                size: 'lg',
                                                title: 'Add New Key',
                                            }),
                                        );
                                    }}
                                    {...props}
                                />
                            ),
                        }}
                    />

                    <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
            )}
        </Field>
    ) : (
        <></>
    );
};

export default RenderRequestKey;
