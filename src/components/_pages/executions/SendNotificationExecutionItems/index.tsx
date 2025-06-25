import Widget from 'components/Widget';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Fragment } from 'react/jsx-runtime';
import { Row, Col, FormGroup, Label, Button, Badge } from 'reactstrap';
import { selectors as notificationProfileSelectors, actions as notificationProfileActions } from 'ducks/notification-profiles';
import styles from './styles.module.scss';

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
                    {!disableBadgeRemove && (
                        <button className={styles.filterBadgeButton} onClick={() => onRemoveProfileClick(value)}>
                            &times;
                        </button>
                    )}
                </Fragment>
            );
        },
        [isFetchingList, onRemoveProfileClick],
    );

    return (
        <Widget title="Execution Items" busy={isFetchingList || isUpdating} titleSize="larger">
            <div style={{ width: '99%', borderBottom: 'solid 1px silver', marginBottom: '1rem' }}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="fieldSelectInput">Notification Profile</Label>
                            <Select
                                id="field"
                                inputId="fieldSelectInput"
                                placeholder="Select Notification Profile"
                                options={profileSelectOptions}
                                onChange={(e) => {
                                    setSelectedProfile(e);
                                }}
                                value={selectedProfile}
                            />
                        </FormGroup>
                    </Col>

                    <Col md="auto">
                        <Button
                            style={{ width: '7em', marginTop: '2em' }}
                            color="primary"
                            disabled={isFetchingList || !selectedProfile}
                            onClick={onAddProfileClick}
                        >
                            Add
                        </Button>
                    </Col>
                </Row>
            </div>

            {selectedProfiles.map((profile, i) => (
                <Badge className={styles.filterBadge} key={profile.value + i}>
                    {getBadgeContent(i, profile.label, profile.value, selectedProfiles.length <= 1 && mode === 'detail')}
                </Badge>
            ))}
        </Widget>
    );
}
