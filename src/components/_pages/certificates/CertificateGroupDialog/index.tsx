import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as groupsActions, selectors as groupsSelectors } from 'ducks/certificateGroups';
import { actions } from 'ducks/certificates';

import Select from 'react-select';

import Spinner from 'components/Spinner';
import { Button, ButtonGroup, FormGroup, Label } from 'reactstrap';

interface Props {
    uuids: string[];
    onCancel: () => void;
    onUpdate: () => void;
}

interface SelectChangeValue {
    value: string;
    label: string;
}

export default function CertificateGroupDialog({ uuids, onCancel, onUpdate }: Props) {
    const dispatch = useDispatch();

    const groups = useSelector(groupsSelectors.certificateGroups);

    const isFetchingGroups = useSelector(groupsSelectors.isFetchingList);

    const [selectedGroups, setSelectedGroups] = useState<SelectChangeValue[]>();

    useEffect(() => {
        dispatch(groupsActions.listGroups());
    }, [dispatch]);

    const updateGroup = useCallback(() => {
        if (!selectedGroups?.length) return;
        dispatch(actions.bulkUpdateGroup({ certificateUuids: uuids, groupUuids: selectedGroups.map((group) => group.value), filters: [] }));
        onUpdate();
    }, [dispatch, onUpdate, selectedGroups, uuids]);

    const removeGroup = useCallback(() => {
        dispatch(actions.bulkDeleteGroup({ certificateUuids: uuids }));
        onUpdate();
    }, [dispatch, onUpdate, uuids]);

    const groupOptions = useMemo(() => {
        return groups.map((group) => ({ value: group.uuid, label: group.name }));
    }, [groups]);

    return (
        <>
            <FormGroup>
                <Label for="groupSelect">Groups</Label>

                <Select
                    id="group"
                    inputId="groupSelect"
                    options={groupOptions}
                    value={selectedGroups}
                    placeholder="Select groups"
                    isMulti
                    onChange={(event) => {
                        const newGroups = event.length ? [...event] : [];
                        setSelectedGroups(newGroups);
                    }}
                />
            </FormGroup>

            <div className="d-flex justify-content-end">
                <ButtonGroup>
                    <Button color="danger" onClick={removeGroup} title="Remove groups from selected certificates">
                        <span className="text-white">Remove</span>
                    </Button>
                    <Button
                        color="primary"
                        onClick={updateGroup}
                        disabled={!selectedGroups?.length}
                        title="Update groups for selected certificates"
                    >
                        Update
                    </Button>

                    <Button color="default" onClick={onCancel}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>

            <Spinner active={isFetchingGroups} />
        </>
    );
}
