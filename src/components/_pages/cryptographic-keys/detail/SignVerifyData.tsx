import AttributeEditor from "components/Attributes/AttributeEditor";
import Spinner from "components/Spinner";

import { actions, selectors } from "ducks/cryptographic-operations";
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Input, Label } from "reactstrap";
import { AttributeDescriptorModel, AttributeRequestModel } from "types/attributes";
import { CryptographicAlgorithm } from "types/openapi";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";
import TabLayout from "../../../Layout/TabLayout";

interface Props {
   tokenUuid?: string;
   tokenProfileUuid?: string;
   keyUuid?: string;
   keyItemUuid?: string;
   algorithm?: CryptographicAlgorithm;
   visible: boolean;
   action: "sign" | "verify";
   onClose: () => void;
}


export default function SignVerifyData({
   tokenUuid,
   tokenProfileUuid,
   keyUuid,
   keyItemUuid,
   algorithm,
   visible,
   action,
   onClose
}: Props) {

   const dispatch = useDispatch();

   const isFetchingAttributes = useSelector(selectors.isFetchingSignatureAttributes);

   const attributes = useSelector(selectors.signatureAttributeDescriptors);

   const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

   const [fileContent, setFileContent] = useState<string>("");

   const [fileName, setFileName] = useState("");

   const [signatureContent, setSignatureContent] = useState<string>("");

   const [signatureFileName, setSignatureFileName] = useState("");


   useEffect(

      () => {
         if (!visible) return;
         if (!tokenUuid) return;
         if(!tokenProfileUuid) return;
         if(!keyUuid) return;
         if(!keyItemUuid) return;
         if(!algorithm) return;
         dispatch(actions.listSignatureAttributeDescriptors({ 
            tokenInstanceUuid: tokenUuid,
            tokenProfileUuid: tokenProfileUuid,
            uuid: keyUuid,
            keyItemUuid: keyItemUuid,
            algorithm: algorithm
          }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [visible, tokenUuid, dispatch]

   )


   const onSubmit = useCallback(

      (values: any) => {

         if (!tokenUuid) return;

         const attribs: AttributeRequestModel[] = attributes && attributes.length > 0
            ?
            collectFormAttributes("attributes", [...(attributes ?? []), ...groupAttributesCallbackAttributes], values) || []
            :
            []
            ;
         if(action === "sign") {
            dispatch(actions.signData({
               tokenInstanceUuid: tokenUuid,
               keyItemUuid: keyItemUuid || "",
               uuid: keyUuid || "",
               tokenProfileUuid: tokenProfileUuid || "",
               request: {
                  signatureAttributes: attribs,
                  data: [{data: btoa(fileContent)}],
               }
            }));
         } else {
            dispatch(actions.verifyData({
               tokenInstanceUuid: tokenUuid,
               keyItemUuid: keyItemUuid || "",
               uuid: keyUuid || "",
               tokenProfileUuid: tokenProfileUuid || "",
               request: {
                  signatureAttributes: attribs,
                  signatures: [{data: btoa(signatureContent)}],
                  data: [{data: btoa(fileContent)}],
               }
            }));
         }

         onClose();

      },
      [dispatch, attributes, onClose, tokenUuid, groupAttributesCallbackAttributes, action, keyUuid, keyItemUuid, tokenProfileUuid, fileContent, signatureContent]

   )

   const onFileLoaded = useCallback(

      (data: ProgressEvent<FileReader>, fileName: string, verify: boolean) => {

         const fileInfo = data.target!.result as string;

         const fileContent = fileInfo.split(",")[1];

         if(verify) {

            setSignatureContent(fileContent);
            
            setSignatureFileName(fileName);
         
         } else {

               setFileName(fileName);

               setFileContent(fileContent);

         }

      }
      ,
      [setFileContent]

   )

   const onFileDrop = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();

         if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

         const fileName = e.dataTransfer.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.dataTransfer.files[0]);
         reader.onload = (data) => { onFileLoaded(data, fileName, false); }

      },
      [onFileLoaded]

   )


   const onSignatureDrop = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();

         if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

         const fileName = e.dataTransfer.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.dataTransfer.files[0]);
         reader.onload = (data) => { onFileLoaded(data, fileName, true); }

      },
      [onFileLoaded]

   )


   const onFileDragOver = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();
      },
      []

   )


   const onFileChanged = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>, verify: boolean) => {

         if (!e.target.files || e.target.files.length === 0) return;

         const fileName = e.target.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = (data) => onFileLoaded(data, fileName, verify);

      },
      [onFileLoaded]

   )



   if (!tokenUuid) return <></>;

   return (
      <>
         <Form onSubmit={onSubmit} mutators={{ ...mutators() }} >

            {({ handleSubmit, pristine, submitting, valid }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="data">

                  {({ input, meta }) => (

                     <FormGroup>
                        <div className="border border-light rounded mb-0" style={{ padding: "1em", borderStyle: "dashed", borderWidth: "2px" }} onDrop={onFileDrop} onDragOver={onFileDragOver}>

                        <Label for="data">Data</Label>

                        <Input
                              id="fileName"
                              type="text"
                              placeholder="File not selected"
                              disabled={true}
                              style={{ textAlign: "center" }}
                              value={fileName}
                           />

                        <FormGroup style={{ textAlign: "right" }}>

                        <Label className="btn btn-default" for="file" style={{ margin: 0 }}>Select file...</Label>

                        <Input id="file" type="file" style={{ display: "none" }} onChange={e => onFileChanged(e, false)} />

                        </FormGroup>

                        <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
                        Select or Drag &amp; Drop file to Drop Zone.
                        </div>

                        </div>

                     </FormGroup>

                  )}

                  </Field>

                  {action === "verify" ? (

                        <Field name="signature">

                        {({ input, meta }) => (

                           <FormGroup>

                                 <div className="border border-light rounded mb-0" style={{ padding: "1em", borderStyle: "dashed", borderWidth: "2px" }} onDrop={onSignatureDrop} onDragOver={onFileDragOver}>

                                 <Label for="signatureFileName">Signature</Label>

                                 <Input
                                       id="signatureFileName"
                                       type="text"
                                       placeholder="File not selected"
                                       disabled={true}
                                       style={{ textAlign: "center" }}
                                       value={signatureFileName}
                                    />

                                 <FormGroup style={{ textAlign: "right" }}>

                                 <Label className="btn btn-default" for="file" style={{ margin: 0 }}>Select file...</Label>

                                 <Input id="file" type="file" style={{ display: "none" }} onChange={e => onFileChanged(e, true)} />

                                 </FormGroup>

                                 <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
                                 Select or Drag &amp; Drop file to Drop Zone.
                                 </div>

                              </div>

                           </FormGroup>

                        )}

                        </Field>

                  ) : <></>}  

                  {!attributes || attributes.length === 0 ? <></> : (

                     <Field name="Attributes">

                        {({ input, meta }) => (

                           <FormGroup>

                               <br />

                               <TabLayout tabs={[
                                   {
                                       title: "Connector Attributes",
                                       content: (<AttributeEditor
                                           id="attributes"
                                           attributeDescriptors={attributes}
                                           groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                           setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                       />)
                                   }
                               ]} />

                           </FormGroup>

                        )}

                     </Field>

                  )}

                  <div style={{ textAlign: "right" }}>
                     <ButtonGroup>

                        <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                           {action === "sign" ? "Sign" : "Verify"}
                        </Button>

                        <Button type="button" color="secondary" onClick={onClose}>
                           Cancel
                        </Button>

                     </ButtonGroup>
                  </div>

               </BootstrapForm>

            )}

         </Form>

         <Spinner active={isFetchingAttributes} />
      </>

   )

}
