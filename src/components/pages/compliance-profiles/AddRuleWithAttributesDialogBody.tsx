import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Form as BootstrapForm, FormGroup, Button, Label, ButtonGroup } from 'reactstrap';
import { Field, Form } from "react-final-form";

import { mutators } from "utils/attributeEditorMutators";


import AttributeEditor from 'components/Attributes/AttributeEditor';

import { actions} from "ducks/compliance-profiles";
import { collectFormAttributes } from 'utils/attributes';
import { AttributeModel } from 'models/attributes/AttributeModel';
import { AttributeDescriptorModel } from 'models/attributes/AttributeDescriptorModel';


interface Props {
   complianceProfileUuid?: string;
   connectorUuid: string;
   connectorName: string;
   kind: string;
   ruleUuid: string;
   ruleName: string;
   ruleDescription: string;
   groupUuid: string;
   attributes: AttributeDescriptorModel[];

   onClose: () => void;
}


export default function AddRuleWithAttributesDialogBody({
   complianceProfileUuid,
   connectorUuid,
   connectorName,
   kind,
   ruleUuid,
   ruleName,
   ruleDescription,
   groupUuid,
   attributes,
   onClose
}: Props) {

   const dispatch = useDispatch();

   const onSubmit = useCallback(

      (values: any) => {

         if (!complianceProfileUuid) return;
         if (!connectorUuid) return;

         const attribs: AttributeModel[] = attributes && attributes.length > 0
            ?
            collectFormAttributes("attributes", attributes, values) || []
            :
            []
            ;
         
         dispatch(actions.addRule({ uuid: complianceProfileUuid, connectorName: connectorName, connectorUuid: connectorUuid, kind: kind, ruleUuid: ruleUuid, description: ruleDescription, ruleName: ruleName, groupUuid: groupUuid, attributes: attribs }));

         onClose();

      },
      [dispatch, complianceProfileUuid, connectorUuid, connectorName, kind, ruleUuid, ruleName, ruleDescription, groupUuid, attributes, onClose]

   )


   if (!complianceProfileUuid) return <></>;

   return (
      <>
         <Form onSubmit={onSubmit} mutators={{ ...mutators() }} >

            {({ handleSubmit, pristine, submitting, valid }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  {!attributes || attributes.length === 0 ? <></> : (

                     <Field name="attributes">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="attributes">Issuance attributes</Label>

                              <AttributeEditor
                                 id="attributes"
                                 attributeDescriptors={attributes}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  )}


                  <div style={{ textAlign: "right" }}>
                     <ButtonGroup>

                        <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                           Add
                        </Button>

                        <Button type="button" color="secondary" disabled={submitting} onClick={onClose}>
                           Cancel
                        </Button>

                     </ButtonGroup>
                  </div>

               </BootstrapForm>

            )}

         </Form>
      </>

   )

}