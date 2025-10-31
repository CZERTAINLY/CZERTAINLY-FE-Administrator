import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { actions } from 'ducks/certificates';

import Select from 'react-select';
import { FormGroup } from 'reactstrap';
import Button from 'components/Button';
import { UserResponseModel } from 'types/users';

interface Props {
    uuids: string[];
    users: UserResponseModel[];
    onCancel: () => void;
    onUpdate: () => void;
}

export default function CertificateOwnerDialog({ uuids, onCancel, onUpdate, users }: Props) {
    const dispatch = useDispatch();

    const [ownerUuid, setOwnerUuid] = useState<string>();
    const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        setUserOptions(
            users.map((user) => ({
                value: user.uuid,
                label: `${user.firstName ? user.firstName + ' ' : ''}${user.lastName ? user.lastName + ' ' : ''}(${user.username})`,
            })),
        );
    }, [dispatch, users]);

    const updateOwner = useCallback(() => {
        if (!ownerUuid || !users) {
            return;
        }
        const user = users.find((u) => u.uuid === ownerUuid);
        if (!user) {
            return;
        }
        dispatch(actions.bulkUpdateOwner({ request: { certificateUuids: uuids, ownerUuid, filters: [] }, user }));
        onUpdate();
    }, [dispatch, onUpdate, ownerUuid, users, uuids]);

    const removeOwner = useCallback(() => {
        dispatch(actions.bulkDeleteOwner({ certificateUuids: uuids }));
        onUpdate();
    }, [dispatch, onUpdate, uuids]);

    return (
        <>
            <FormGroup>
                <Select
                    maxMenuHeight={140}
                    menuPlacement="auto"
                    options={userOptions}
                    placeholder={`Select Owner`}
                    onChange={(event) => setOwnerUuid(event?.value)}
                />
            </FormGroup>

            <div className="flex gap-4">
                <Button color="danger" onClick={removeOwner}>
                    Remove
                </Button>

                <Button color="primary" onClick={updateOwner} disabled={!ownerUuid}>
                    Update
                </Button>
                <Button color="secondary" variant="outline" onClick={onCancel} className="ml-auto">
                    Cancel
                </Button>
            </div>
        </>
    );
}
