import CustomSelectComponent from 'components/CustomSelectComponent';
import { actions as keyActions } from 'ducks/cryptographic-keys';
import { selectors as tokenProfileSelectors } from 'ducks/token-profiles';
import { useCallback, useMemo } from 'react';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select, { GroupBase, MenuProps, SingleValue } from 'react-select';
import { FormFeedback, FormGroup, Label } from 'reactstrap';
import { validateRequired } from 'utils/validators';
import { actions as userInterfaceActions } from '../../../../ducks/user-interface';
import { TokenProfileResponseModel } from 'types/token-profiles';
import TokenProfileForm from 'components/_pages/token-profiles/form';

const RenderTokenProfile = ({ type }: { type: 'alt' | 'normal' }) => {
    const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);
    const isAltToken = type === 'alt';
    const dispatch = useDispatch();

    const onTokenProfileChange = useCallback(
        (event: SingleValue<{ label: string; value: TokenProfileResponseModel }>, type: 'alt' | 'normal') => {
            if (!event) return;
            dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: event.value.uuid, store: type }));
        },
        [dispatch],
    );

    const tokenProfileOptions = useMemo(
        () =>
            tokenProfiles.map((tokenProfile) => ({
                label: tokenProfile.name,
                value: tokenProfile,
            })),
        [tokenProfiles],
    );

    const renderTokenSelectMenu = useCallback(
        (props: MenuProps<any, false, GroupBase<any>>) => (
            <CustomSelectComponent
                onAddNew={() => {
                    dispatch(
                        userInterfaceActions.showGlobalModal({
                            content: <TokenProfileForm usesGlobalModal />,
                            isOpen: true,
                            size: 'lg',
                            title: 'Add New Token Profile',
                        }),
                    );
                }}
                {...props}
            />
        ),
        [dispatch],
    );

    return (
        <Field name={isAltToken ? 'altTokenProfile' : 'tokenProfile'} validate={validateRequired()}>
            {({ input, meta, onChange }) => (
                <FormGroup>
                    <Label for={isAltToken ? 'altTokenProfileSelect' : 'tokenProfileSelect'}>
                        {isAltToken ? 'Alternative Token Profile' : 'Token Profile'}
                    </Label>

                    <Select
                        {...input}
                        id={isAltToken ? 'altTokenProfile' : 'tokenProfile'}
                        inputId={isAltToken ? 'altTokenProfileSelect' : 'tokenProfileSelect'}
                        maxMenuHeight={140}
                        menuPlacement="auto"
                        options={tokenProfileOptions}
                        placeholder={isAltToken ? 'Select Alternative Token Profile' : 'Select Token Profile'}
                        onChange={(e) => {
                            onTokenProfileChange(e, type);
                            input.onChange(e);
                        }}
                        components={{
                            Menu: renderTokenSelectMenu,
                        }}
                    />

                    <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
            )}
        </Field>
    );
};

export default RenderTokenProfile;
