import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from 'ducks/certificates';
import { actions as raProfileActions, selectors as raProfileSelectors } from 'ducks/ra-profiles';

import Select, { SingleValue } from 'react-select';

import Spinner from 'components/Spinner';
import { Button, ButtonGroup, FormGroup, Label } from 'reactstrap';

interface Props {
    uuids: string[];
    onCancel: () => void;
    onUpdate: () => void;
}

export default function CertificateGroupDialog({ uuids, onCancel, onUpdate }: Props) {
    const dispatch = useDispatch();

    const raProfiles = useSelector(raProfileSelectors.raProfiles);

    const isFetchingRaProffiles = useSelector(raProfileSelectors.isFetchingList);

    const [selectedRaProfile, setSelectedRaProfile] = useState<SingleValue<{ value: string; label: string }>>();

    useEffect(() => {
        dispatch(raProfileActions.listRaProfiles());
    }, [dispatch]);

    const removeRaprofile = useCallback(() => {
        dispatch(actions.bulkDeleteRaProfile({ certificateUuids: uuids }));
        onUpdate();
    }, [dispatch, onUpdate, uuids]);

    const updateRaProfile = useCallback(() => {
        if (!selectedRaProfile) return;
        dispatch(
            actions.bulkUpdateRaProfile({
                raProfileRequest: { certificateUuids: uuids, raProfileUuid: selectedRaProfile.value.split(':#')[0], filters: [] },
                authorityUuid: selectedRaProfile.value.split(':#')[1],
            }),
        );
        onUpdate();
    }, [dispatch, onUpdate, selectedRaProfile, uuids]);

    return (
        <>
            <FormGroup>
                <Label for="raProfileSelect">RA Profile</Label>

                <Select
                    id="raProfile"
                    inputId="raProfileSelect"
                    options={raProfiles.map((raProfile) => ({
                        value: raProfile.uuid + ':#' + raProfile.authorityInstanceUuid,
                        label: raProfile.name,
                    }))}
                    value={selectedRaProfile}
                    onChange={(e) => setSelectedRaProfile(e)}
                />
            </FormGroup>

            <div className="d-flex justify-content-end">
                <ButtonGroup>
                    <Button color="danger" onClick={removeRaprofile}>
                        <span className="text-white">Remove</span>
                    </Button>

                    <Button color="primary" onClick={updateRaProfile} disabled={!selectedRaProfile}>
                        Update
                    </Button>

                    <Button color="default" onClick={onCancel}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>

            <Spinner active={isFetchingRaProffiles} />
        </>
    );
}
