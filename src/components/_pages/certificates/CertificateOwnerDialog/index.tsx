import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { actions } from "ducks/certificates";

import { Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { validateAlphaNumeric } from "utils/validators";


interface Props {
   uuids: string[],
   onCancel: () => void,
   onUpdate: () => void
}


export default function CertificateOwnerDialog({
   uuids,
   onCancel,
   onUpdate,
}: Props) {

   const dispatch = useDispatch();

   const [owner, setOwner] = useState<string>("");
   const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);


   useEffect(
      () => {
         if (!owner) return;
         setValidationMessage(validateAlphaNumeric()(owner));
      },
      [owner]
   )


   const updateOwner = useCallback(

      () => {
         if (!owner) return;
         dispatch(actions.bulkUpdateOwner({ certificateUuids: uuids, owner, filters: [] }));
         onUpdate();
      },
      [dispatch, onUpdate, owner, uuids]
   )


   return (

      <>

         <FormGroup>

            <Label for="owner">Owner</Label>

            <Input
               id="owner"
               type="text"
               value={owner}
               onChange={(e) => setOwner(e.target.value)}
               valid={validationMessage === undefined && owner !== ""}
               invalid={validationMessage !== undefined && owner !== ""}
            />

            <FormFeedback color="warn">{validationMessage}</FormFeedback>

         </FormGroup>

         <div className="d-flex justify-content-end">

            <ButtonGroup>

               <Button
                  color="primary"
                  onClick={updateOwner}
                  disabled={!owner || validationMessage !== undefined}
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

      </>

   )
}
