import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, FormGroup, Input, Label } from "reactstrap";
import { transformParseRequestResponseDtoToCertificateResponseDetailModel } from "../../../../ducks/transform/utilsCertificateRequest";
import { actions as utilsCertificateRequestActions, selectors as utilsCertificateRequestSelectors } from "../../../../ducks/utilsCertificateRequest";
import { CertificateDetailResponseModel } from "../../../../types/certificate";
import CertificateAttributes from "../../../CertificateAttributes";

interface Props {
   onCancel: () => void,
   allowWithoutFile: boolean,
   onRenew: (data: { fileContent?: string, fileName?: string, contentType?: string }) => void
}

export default function CertificateRenewDialog({
   onCancel,
   allowWithoutFile,
   onRenew,

}: Props) {
    const dispatch = useDispatch();

   const [fileName, setFileName] = useState("");
   const [contentType, setContentType] = useState("");
   const [file, setFile] = useState<string>("");

   const [uploadCsr, setUploadCsr] = useState(false);

    const [certificate, setCertificate] = useState<CertificateDetailResponseModel | undefined>();
    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);

    useEffect(() => {
        dispatch(utilsCertificateRequestActions.reset());
    }, [dispatch]);

    useEffect(() => {
        setCertificate(parsedCertificateRequest ? transformParseRequestResponseDtoToCertificateResponseDetailModel(parsedCertificateRequest) : undefined);
    }, [parsedCertificateRequest])

    const onFileLoaded = useCallback(
        (data: ProgressEvent<FileReader>, fileName: string) => {
            const fileInfo = data.target!.result as string;
            const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
            const fileContent = fileInfo.split(",")[1];
            dispatch(utilsCertificateRequestActions.parseCertificateRequest(fileContent))

            setFileName(fileName);
            setContentType(contentType);
            setFile(fileContent);
        }, [dispatch],
    );


   const onFileChanged = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>) => {

         if (!e.target.files || e.target.files.length === 0) return;

         const fileName = e.target.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = (data) => onFileLoaded(data, fileName);

      },
      [onFileLoaded]

   )


   const onFileDrop = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();

         if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

         const fileName = e.dataTransfer.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.dataTransfer.files[0]);
         reader.onload = (data) => { onFileLoaded(data, fileName); }

      },
      [onFileLoaded]

   )


   const onFileDragOver = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();
      },
      []

   )

   return (

      <div>

         <div className="border border-light rounded mb-0" style={{ padding: "1em", borderStyle: "dashed", borderWidth: "2px" }} onDrop={onFileDrop} onDragOver={onFileDragOver}>
         <FormGroup>

               { allowWithoutFile ? (
               <>
                  <Label for="uploadCsr">Upload new CSR ?</Label>
                     &nbsp;&nbsp;
                     <input
                        id="uploadCsr"
                        type="checkbox"
                        placeholder="Select Option"
                        onChange={e => { setUploadCsr(e.target.checked) }}
                  />
               </>
               )
               : <></>
            }

            </FormGroup>

            { !allowWithoutFile || uploadCsr ? (
            <>
            <FormGroup>

               <Label for="fileName">File name</Label>

               <Input
                  id="fileName"
                  type="text"
                  placeholder="File not selected"
                  disabled={true}
                  style={{ textAlign: "center" }}
                  value={fileName}
               />

            </FormGroup>

            

            <FormGroup style={{ textAlign: "right" }}>

               <Label className="btn btn-default" for="file" style={{ margin: 0 }}>Select file...</Label>

               <Input id="file" type="file" style={{ display: "none" }} onChange={onFileChanged} />

            </FormGroup>

            <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
               Select or Drag &amp; Drop file to Drop Zone.
            </div>

            {certificate && <><br /><CertificateAttributes csr={true} certificate={certificate} /></>}
            </>
            ) : <></>
         }

         </div>

         <br />

         <div className="d-flex justify-content-end">

            <ButtonGroup>

               <Button
                  color="primary"
                  onClick={() => onRenew({ fileContent: file, fileName, contentType })}
               >
                  Renew
               </Button>

               <Button
                  color="default"
                  onClick={onCancel}
               >
                  Cancel
               </Button>

            </ButtonGroup>

         </div>


      </div>

   );

}