import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actions as groupsActions, selectors as groupsSelectors } from "ducks/certificateGroups";
import { actions } from "ducks/certificates";

import Select, { SingleValue } from "react-select";

import Spinner from "components/Spinner";
import { Button, ButtonGroup, FormGroup, Label } from "reactstrap";

interface Props {
    uuids: string[];
    onCancel: () => void;
    onUpdate: () => void;
}

export default function CertificateGroupDialog({ uuids, onCancel, onUpdate }: Props) {
    const dispatch = useDispatch();

    const groups = useSelector(groupsSelectors.certificateGroups);

    const isFetchingGroups = useSelector(groupsSelectors.isFetchingList);

    const [selectedGroup, setSelectedGroup] = useState<SingleValue<{ value: string; label: string }>>();

    useEffect(() => {
        dispatch(groupsActions.listGroups());
    }, [dispatch]);

    const updateGroup = useCallback(() => {
        if (!selectedGroup) return;
        dispatch(actions.bulkUpdateGroup({ certificateUuids: uuids, groupUuid: selectedGroup.value, filters: [] }));
        onUpdate();
    }, [dispatch, onUpdate, selectedGroup, uuids]);

    return (
        <>
            <FormGroup>
                <Label for="group">Group</Label>

                <Select
                    id="group"
                    options={groups.map((group) => ({ value: group.uuid, label: group.name }))}
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e)}
                />
            </FormGroup>

            <div className="d-flex justify-content-end">
                <ButtonGroup>
                    <Button color="primary" onClick={updateGroup} disabled={!selectedGroup}>
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
