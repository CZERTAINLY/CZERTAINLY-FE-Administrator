import Select from 'components/Select';
import Label from 'components/Label';
import { actions as keyActions } from 'ducks/cryptographic-keys';
import { selectors as tokenProfileSelectors } from 'ducks/token-profiles';
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { actions as userInterfaceActions } from '../../../../ducks/user-interface';
import TokenProfileForm from 'components/_pages/token-profiles/form';

type Props = {
    type: 'alt' | 'normal';
    name: string;
};

const RenderTokenProfile = ({ type, name }: Props) => {
    const dispatch = useDispatch();
    const { control } = useFormContext();
    const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

    const tokenProfileOptions = useMemo(
        () => [
            ...tokenProfiles.map((tokenProfile) => ({
                label: tokenProfile.name,
                value: tokenProfile.uuid,
            })),
            {
                label: '+',
                value: '__add_new__',
                disabled: false,
            },
        ],
        [tokenProfiles],
    );

    const handleTokenProfileChange = useCallback(
        (tokenProfileUuid: string | number | undefined) => {
            if (!tokenProfileUuid || typeof tokenProfileUuid !== 'string') return;
            dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid, store: type }));
        },
        [dispatch, type],
    );

    const handleAddNew = useCallback(() => {
        dispatch(
            userInterfaceActions.showGlobalModal({
                content: <TokenProfileForm usesGlobalModal />,
                isOpen: true,
                size: 'lg',
                title: 'Add New Token Profile',
            }),
        );
    }, [dispatch]);

    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: true }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div>
                    <Label htmlFor={`${name}Select`}>{type === 'alt' ? 'Alternative Token Profile' : 'Token Profile'}</Label>
                    <Select
                        id={name}
                        options={tokenProfileOptions}
                        value={value ?? ''}
                        onChange={(selected) => {
                            if (selected === '__add_new__') {
                                handleAddNew();
                                return;
                            }
                            handleTokenProfileChange(selected as string);
                            onChange(selected);
                        }}
                        placeholder={type === 'alt' ? 'Select Alternative Token Profile' : 'Select Token Profile'}
                    />
                    {error && <div className="text-red-500 mt-1">{error.message ?? 'Token profile is required.'}</div>}
                </div>
            )}
        />
    );
};

export default RenderTokenProfile;
