import AttributeEditor from "components/Attributes/AttributeEditor";
import Spinner from "components/Spinner";

import { actions as acmeProfilesActions, selectors as acmeProfilesSelectors } from "ducks/acme-profiles";
import { actions as raProfilesActions, selectors as raProfilesSelectors } from "ducks/ra-profiles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from "reactstrap";
import { AttributeDescriptorModel, AttributeRequestModel } from "types/attributes";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { validateRequired } from "utils/validators";
import TabLayout from "../../Layout/TabLayout";

interface Props {
   raProfileUuid?: string;
   authorityInstanceUuid?: string;
   visible: boolean;
   onClose: () => void;
}


export default function AcmeProtocolActivationDialogBody({
   raProfileUuid,
   authorityInstanceUuid,
   visible,
   onClose
}: Props) {

   const dispatch = useDispatch();

   const acmeProfiles = useSelector(acmeProfilesSelectors.acmeProfiles);

   const issuanceAttributes = useSelector(raProfilesSelectors.issuanceAttributes);
   const revocationAttributes = useSelector(raProfilesSelectors.revocationAttributes);

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [revokeGroupAttributesCallbackAttributes, setRevokeGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const isFetchingAcmeProfiles = useSelector(acmeProfilesSelectors.isFetchingList);
   const isFetchingIssuanceAttributes = useSelector(raProfilesSelectors.isFetchingIssuanceAttributes);
   const isFetchingRevocationAttributes = useSelector(raProfilesSelectors.isFetchingRevocationAttributes);

   const isBusy = useMemo(
      () => isFetchingAcmeProfiles || isFetchingIssuanceAttributes || isFetchingRevocationAttributes,
      [isFetchingAcmeProfiles, isFetchingIssuanceAttributes, isFetchingRevocationAttributes]
   );


   useEffect(

      () => {
         if (!visible) return;

         dispatch(acmeProfilesActions.listAcmeProfiles());
         if (!raProfileUuid) return;
         dispatch(raProfilesActions.listIssuanceAttributeDescriptors({ authorityUuid: authorityInstanceUuid || "", uuid: raProfileUuid }));
         dispatch(raProfilesActions.listRevocationAttributeDescriptors({ authorityUuid: authorityInstanceUuid || "", uuid: raProfileUuid }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [visible]

   )


   const optionsForAcmeProfiles = useMemo(

      () => acmeProfiles.map(

         acmeProfile => ({
            value: acmeProfile.uuid,
            label: acmeProfile.name
         })

      ),
      [acmeProfiles]

   );


   const onActivateAcmeSubmit = useCallback(

      (values: any) => {

         if (!raProfileUuid) return;

         const issuanceAttribs: AttributeRequestModel[] = issuanceAttributes && issuanceAttributes.length > 0
            ?
            collectFormAttributes("issuanceAttributes", [...(issuanceAttributes ?? []), ...issueGroupAttributesCallbackAttributes], values) || []
            :
            []
            ;

         const revocationAttribs: AttributeRequestModel[] = revocationAttributes && revocationAttributes.length > 0
            ?
            collectFormAttributes("revocationAttributes", [...(revocationAttributes ?? []), ...revokeGroupAttributesCallbackAttributes], values) || []
            : []
            ;

         dispatch(raProfilesActions.activateAcme({
             authorityUuid: authorityInstanceUuid || "",
             uuid: raProfileUuid,
             acmeProfileUuid: values.acmeProfiles.value,
             raProfileActivateAcmeRequest: {
                 issueCertificateAttributes: issuanceAttribs,
                 revokeCertificateAttributes: revocationAttribs
             }
         }));

         onClose();

      },
      [dispatch, issuanceAttributes, onClose, raProfileUuid, revocationAttributes, authorityInstanceUuid, issueGroupAttributesCallbackAttributes, revokeGroupAttributesCallbackAttributes]

   )


   if (!raProfileUuid) return <></>;

   return (
      <>
         <Form onSubmit={onActivateAcmeSubmit} mutators={{ ...mutators() }} >

            {({ handleSubmit, pristine, submitting, valid }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="acmeProfiles" validate={validateRequired()}>

                     {({ input, meta }) =>

                        <FormGroup>

                           <Label for="acmeProfiles">Select ACME profile</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForAcmeProfiles}
                              placeholder="Select ACME profile to be activated"
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

                        </FormGroup>


                     }

                  </Field>
                   <br />

                   <TabLayout tabs={[
                       {
                           title: "Issuance attributes",
                           content: !issuanceAttributes || issuanceAttributes.length === 0 ? <></> : (<Field name="IssuanceAttributes">
                               {({input, meta}) => (
                                   <FormGroup>
                                       <AttributeEditor
                                           id="issuanceAttributes"
                                           attributeDescriptors={issuanceAttributes}
                                           groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                                           setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                                       />
                                   </FormGroup>
                               )}
                           </Field>)
                       },
                       {
                           title: "Revocation attributes",
                           content: !revocationAttributes || revocationAttributes.length === 0 ? <></> : (<Field name="RevocationAttributes">
                               {({input, meta}) => (
                                   <FormGroup>
                                       <AttributeEditor
                                           id="revocationAttributes"
                                           attributeDescriptors={revocationAttributes}
                                           groupAttributesCallbackAttributes={revokeGroupAttributesCallbackAttributes}
                                           setGroupAttributesCallbackAttributes={setRevokeGroupAttributesCallbackAttributes}
                                       />
                                   </FormGroup>
                               )}
                           </Field>)
                       }
                   ]} />

                  <div style={{ textAlign: "right" }}>
                     <ButtonGroup>

                        <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                           Activate
                        </Button>

                        <Button type="button" color="secondary" onClick={onClose}>
                           Cancel
                        </Button>

                     </ButtonGroup>
                  </div>




               </BootstrapForm>

            )}

         </Form>

         <Spinner active={isBusy} />
      </>

   )

}