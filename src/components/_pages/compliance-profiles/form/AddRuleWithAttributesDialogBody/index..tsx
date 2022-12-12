import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from 'reactstrap';
import { Field, Form } from "react-final-form";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from 'utils/attributes/attributes';

import AttributeEditor from 'components/Attributes/AttributeEditor';

import { actions } from "ducks/compliance-profiles";
import { AttributeDescriptorModel } from "types/attributes";


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

         const attribs = attributes && attributes.length > 0
            ?
            collectFormAttributes("attributes", attributes, values) || []
            :
            []
            ;

         dispatch(actions.addRule({ uuid: complianceProfileUuid, addRequest: {
               connectorUuid: connectorUuid,
               kind: kind,
               ruleUuid: ruleUuid,
               attributes: attribs
            }
         }));

         onClose();

      },
      [dispatch, complianceProfileUuid, connectorUuid, kind, ruleUuid, attributes, onClose]

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

                              <Label for="attributes">Attributes</Label>

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