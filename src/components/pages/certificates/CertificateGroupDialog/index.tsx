import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actions } from "ducks/certificates";
import { selectors as groupsSelectors, actions as groupsActions } from "ducks/groups";

import Select, { SingleValue } from "react-select";

import { Button, ButtonGroup, FormGroup, Label } from "reactstrap";
import Spinner from "components/Spinner";


interface Props {
   uuids: string[],
   onCancel: () => void,
   onUpdate: () => void
}


export default function CertificateGroupDialog({
   uuids,
   onCancel,
   onUpdate,
}: Props) {

   const dispatch = useDispatch();

   const groups = useSelector(groupsSelectors.groups);

   const isFetchingGroups = useSelector(groupsSelectors.isFetchingList);

   const [selectedGroup, setSelectedGroup] = useState<SingleValue<{ value: string, label: string }>>();


   useEffect(
      () => {
         dispatch(groupsActions.listGroups());
      },
      [dispatch]
   );


   const updateGroup = useCallback(

      () => {
         if (!selectedGroup) return;
         dispatch(actions.bulkUpdateGroup({ uuids, groupUuid: selectedGroup.value, inFilter: [], allSelect: false }));
         onUpdate();
      },
      [dispatch, onUpdate, selectedGroup, uuids]
   )


   return (

      <>

         <FormGroup>

            <Label for="group">Group</Label>

            <Select
               id="group"
               options={groups.map(group => ({ value: group.uuid, label: group.name }))}
               value={selectedGroup}
               onChange={(e) => setSelectedGroup(e)}

            />

         </FormGroup>

         <div className="d-flex justify-content-end">

            <ButtonGroup>

               <Button
                  color="primary"
                  onClick={updateGroup}
                  disabled={!selectedGroup}
               >
                  Update
               </Button>

               <Button
                  color="default"
                  onClick={onCancel}
               >
                  Cancel
               </Button>



            </ButtonGroup>

         </div>

         <Spinner active={isFetchingGroups} />

      </>

   )
}
