import Widget from 'components/Widget';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'components/Select';
import { Fragment } from 'react/jsx-runtime';
import Button from 'components/Button';
import Label from 'components/Label';
import Badge from 'components/Badge';
import { selectors as notificationProfileSelectors, actions as notificationProfileActions } from 'ducks/notification-profiles';

interface SelectChangeValue {
    value: string;
    label: string;
}

type Props = {
    mode: 'form' | 'detail';
    isUpdating?: boolean;
    notificationProfileItems?: SelectChangeValue[];
    onNotificationProfileItemsChange: (items: SelectChangeValue[]) => void;
};

export function SendNotificationExecutionItems({ mode, isUpdating, notificationProfileItems, onNotificationProfileItemsChange }: Props) {
    const dispatch = useDispatch();

    const notificationProfiles = useSelector(notificationProfileSelectors.notificationProfiles);
    const isFetchingList = useSelector(notificationProfileSelectors.isFetchingList);

    const [selectedProfile, setSelectedProfile] = useState<SelectChangeValue | null>(null);
    const [selectedProfiles, setSelectedProfiles] = useState<SelectChangeValue[]>(notificationProfileItems ?? []);

    useEffect(() => {
        dispatch(notificationProfileActions.listNotificationProfiles({ itemsPerPage: 100 }));
    }, [dispatch]);

    const onAddProfileClick = useCallback(() => {
        if (!selectedProfile) return;
        setSelectedProfiles((state) => [...state, selectedProfile]);
        setSelectedProfile(null);
        onNotificationProfileItemsChange([...(notificationProfileItems ?? []), selectedProfile]);
    }, [selectedProfile, notificationProfileItems, onNotificationProfileItemsChange]);

    const onRemoveProfileClick = useCallback(
        (uuid: string) => {
            setSelectedProfiles((state) => state.filter((el) => el.value !== uuid));
            onNotificationProfileItemsChange(notificationProfileItems?.filter((el) => el.value !== uuid) ?? []);
        },
        [notificationProfileItems, onNotificationProfileItemsChange],
    );

    const profileSelectOptions = useMemo(
        () =>
            notificationProfiles
                .map((profile) => ({
                    label: profile.name,
                    value: profile.uuid,
                }))
                .filter((el) => !selectedProfiles.map(({ value }) => value).includes(el.value)),
        [notificationProfiles, selectedProfiles],
    );

    const getBadgeContent = useCallback(
        (itemNumber: number, label: string, value: string, disableBadgeRemove: boolean) => {
            if (isFetchingList) return <></>;

            return (
                <Fragment key={itemNumber}>
                    <span>Send notifications to:&nbsp;</span>
                    <b>{label}&nbsp;</b>
                    {!disableBadgeRemove && <button onClick={() => onRemoveProfileClick(value)}>&times;</button>}
                </Fragment>
            );
        },
        [isFetchingList, onRemoveProfileClick],
    );

    return (
        <Widget title="Execution Items" busy={isFetchingList || isUpdating} titleSize="larger">
            <div style={{ width: '99%', borderBottom: 'solid 1px silver', marginBottom: '1rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                        <Label htmlFor="fieldSelectInput">Notification Profile</Label>
                        <Select
                            id="field"
                            placeholder="Select Notification Profile"
                            options={profileSelectOptions}
                            onChange={(value) => {
                                setSelectedProfile(
                                    value
                                        ? {
                                              value: value as string,
                                              label: profileSelectOptions.find((opt) => opt.value === value)?.label || '',
                                          }
                                        : null,
                                );
                            }}
                            value={selectedProfile?.value || ''}
                        />
                    </div>

                    <div className="flex items-end">
                        <Button
                            className="w-full"
                            color="primary"
                            disabled={isFetchingList || !selectedProfile}
                            onClick={onAddProfileClick}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            {selectedProfiles.map((profile, i) => (
                <Badge key={profile.value + i}>
                    {getBadgeContent(i, profile.label, profile.value, selectedProfiles.length <= 1 && mode === 'detail')}
                </Badge>
            ))}
        </Widget>
    );
}
