import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actions } from "ducks/certificates";
import { selectors as raProfileSelectors, actions as raProfileActions } from "ducks/ra-profiles";

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

   const raProfiles = useSelector(raProfileSelectors.raProfiles);

   const isFetchingRaProffiles = useSelector(raProfileSelectors.isFetchingList);

   const [selectedRaProfile, setSelectedRaProfile] = useState<SingleValue<{ value: string, label: string }>>();


   useEffect(
      () => {
         dispatch(raProfileActions.listRaProfiles());
      },
      [dispatch]
   );


   const updateRaProfile = useCallback(

      () => {
         if (!selectedRaProfile) return;
         dispatch(actions.bulkUpdateRaProfile({ uuids, raProfileUuid: selectedRaProfile.value.split(":#")[0], authorityUuid: selectedRaProfile.value.split(":#")[1], inFilter: [], allSelect: false }));
         onUpdate();
      },
      [dispatch, onUpdate, selectedRaProfile, uuids]
   )


   return (

      <>

         <FormGroup>

            <Label for="raProfile">RA Profile</Label>

            <Select
               id="raProfile"
               options={raProfiles.map(raProfile => ({ value: raProfile.uuid + ":#" + raProfile.authorityInstanceUuid, label: raProfile.name }))}
               value={selectedRaProfile}
               onChange={(e) => setSelectedRaProfile(e)}

            />

         </FormGroup>

         <div className="d-flex justify-content-end">

            <ButtonGroup>

               <Button
                  color="primary"
                  onClick={updateRaProfile}
                  disabled={!selectedRaProfile}
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

         <Spinner active={isFetchingRaProffiles} />

      </>

   )
}
