import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";

import { Badge, Col, Container, Label, Row } from "reactstrap";

import { actions, selectors } from "ducks/certificates";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { dateFormatter } from "utils/dateUtil";
import CertificateValidationStatus from "components/pages/certificates/CertificateValidationStatus";
import CertificateStatus from "components/pages/certificates/CertificateStatus";


export default function CertificateDetail() {

  const dispatch = useDispatch();

  const { params } = useRouteMatch<{ id: string }>();

  const certificate = useSelector(selectors.certificateDetail);

  const isFetching = useSelector(selectors.isFetchingDetail);
  const isDeleting = useSelector(selectors.isDeleting);
  const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
  const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
  const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
  const isFetchingHistory = useSelector(selectors.isFetchingHistory);
  const isRevoking = useSelector(selectors.isRevoking);
  const isRenewing = useSelector(selectors.isRenewing);

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const isBusy = useMemo(
     () => isFetching || isDeleting || isUpdatingGroup || isUpdatingRaProfile || isUpdatingOwner || isRevoking || isRenewing,
     [isFetching, isDeleting, isUpdatingGroup, isUpdatingRaProfile, isUpdatingOwner, isRevoking, isRenewing]
  );


  useEffect(

     () => {

        if (!params.id) return;
        dispatch(actions.resetState())
        dispatch(actions.getCertificateDetail({ uuid: params.id }));
        dispatch(actions.getCertificateHistory({ uuid: params.id }));

     },
     [dispatch, params.id]

  )


  const onDeleteConfirmed = useCallback(

     () => {

        if (!certificate) return;

        dispatch(actions.deleteCertificate({ uuid: certificate.uuid }));
        setConfirmDelete(false);

     },
     [certificate, dispatch]

  );


  const buttons: WidgetButtonProps[] = useMemo(

     () => [
        { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
     ],
     []

  );


  const certificateTitle = useMemo(

     () => (

        <div>

           <div className="pull-right mt-n-xs">
              <WidgetButtons buttons={buttons} />
           </div>

           <h5>
              Certificate <span className="fw-semi-bold">Details</span>
           </h5>

        </div>

     ),
     [buttons]

  );

   const metaTitle = (
     <h5>
       <span className="fw-semi-bold">Meta Data</span>
     </h5>
   );

   const validationTitle = (
     <h5>
       <span className="fw-semi-bold">Validation Results</span>
     </h5>
   );
   const sanTitle = (
    <h5>
      <span className="fw-semi-bold">Subject Alternative Names</span>
    </h5>
  );

  const attributesTitle = (
    <h5>
      Certificate <span className="fw-semi-bold">Attributes</span>
    </h5>
  );


  const detailHeaders: TableHeader[] = useMemo(

     () => [
        {
           id: "property",
           content: "Property",
        },
        {
           id: "value",
           content: "Value",
        },
     ],
     []

  );


  const attributeHeaders: TableHeader[] = useMemo(

    () => [
       {
          id: "attribute",
          content: "Attribute",
       },
       {
          id: "value",
          content: "Value",
       },
       {
          id: "action",
          content: "Action",
       }
    ],
    []
 );



  const validationHeaders: TableHeader[] = useMemo(

     () => [
        {
           id: "validationType",
           content: "Validation Type",
        },
        {
           id: "status",
           content: "Status",
        },
        {
           id: "message",
           content: "Message",
        }
     ],
     []

  );

  const metaData: TableDataRow[] = useMemo(

     () => !certificate ? [] : Object.entries(certificate.meta || {}).map(function([key, value]) {
      console.log(key, value);  
      return (
           {
              id: key,
              columns: [key, value?.toString()],
           }
        )
     }
     ),
     [certificate]
  )

  const attributeData: TableDataRow[] = useMemo(

    () => !certificate ? [] :[
          {
             id: "uuid",
             columns: ["UUID", certificate.uuid],
          },
          {
            id: "owner",
            columns: ["owner", certificate.owner || "Unassigned"],
         },
         {
          id: "group",
          columns: ["Group", certificate?.group?.name ? (
                            <Link to={`../../groups/detail/${certificate?.group.uuid}`}>
                              {certificate?.group.name}
                            </Link>
                          ) : (
                            "Unassigned"
                          )
          ],
       },
       {
        id: "raProfile",
        columns: ["RA Profile", certificate?.raProfile?.name ? (
                          <Link to={`../../groups/raProfile/${certificate?.raProfile.uuid}`}>
                            {certificate?.raProfile.name}
                          </Link>
                        ) : (
                          "Unassigned"
                        )
        ],
     },
     {
      id: "type",
      columns: ["Type", certificate.certificateType || ""],
    },
   ],
    [certificate]
 )

  const sanData: TableDataRow[] = useMemo(

    () => {
      let sanList:TableDataRow[] = [];
      for(let [key, value] of Object.entries(certificate?.subjectAlternativeNames || {})){
        console.log(value)
        if(value && value.length > 0){
          sanList.push({
            id: key,
            columns: [key, value.join(", ")],
          })
        }
      }
      return sanList
    },
    [certificate]
 )


  const validationData: TableDataRow[] = useMemo(

    () => !certificate ? [] : Object.entries(certificate.certificateValidationResult || {}).map(function([key, value]) {
      return (
         {
            id: key,
            columns: [
              key, 
              <CertificateValidationStatus status={value.status} />, 
              <div style={{ wordBreak: "break-all" }}>
                {value.message.split("\n").map((str: string) => (
                  <div>
                    {str}
                    <br />
                  </div>
                ))}
              </div>
            ],
         }
      )
   }
   ),
   [certificate]
  )


  const detailData: TableDataRow[] = useMemo(

     () => !certificate ? [] : [

        {
           id: "commonName",
           columns: ["Common Name", certificate.commonName],

        },
        {
            id: "serialNumber",
            columns: ["Serial Number", certificate.serialNumber]
        },
        {
          id: "issuerCommonName",
          columns: ["Issuer Common Name", certificate.issuerCommonName]
        },
        {
            id: "issuerDN",
            columns: ["Issuer DN", certificate.issuerDn]
        },
        {
          id: "subjectDN",
          columns: ["Subject DN", certificate.subjectDn]
        },
        {
          id: "expiresAt",
          columns: ["Expires At", dateFormatter(certificate.notAfter)]
        },
        {
          id: "validFrom",
          columns: ["Valid From", dateFormatter(certificate.notBefore)]
        },
        {
          id: "publicKeyAlgorithm",
          columns: ["Public Key Algorithm", certificate.publicKeyAlgorithm]
        },
        {
          id: "signatureAlgorithm",
          columns: ["Signature Algorithm", certificate.signatureAlgorithm]
        },
        {
          id: "certStatus",
          columns: ["Status", <CertificateStatus status={certificate.status}/>]
        },
        {
          id: "fingerprint",
          columns: ["Fingerprint", certificate.fingerprint]
        },
        {
           id: "fingerprintAlgorithm",
           columns: ["Fingerprint Algorithm", "SHA256"],
        },
        {
          id: "keySize",
          columns: ["Key Size", certificate.keySize]
        },
        {
           id: "keyUsage",
           columns: ["Key Usage", 
           certificate?.keyUsage?.map(function (name) {
            return (
              <div key={name}>
                <Badge style={{ backgroundColor: "Metalic Blue" }}>
                  {name}
                </Badge>
                &nbsp;
              </div>
            );
          })]
        },
        {
          id: "extendedKeyUsage",
          columns: ["Extended Key Usage", 
          certificate?.extendedKeyUsage?.map(function (name) {
           return (
             <div key={name}>
               <Badge style={{ backgroundColor: "Metalic Blue" }}>
                 {name}
               </Badge>
               &nbsp;
             </div>
           );
         })]
       },
       {
        id: "basicConstraint",
        columns: ["Basic Constraint", certificate.basicConstraints]
      }
     ],
     [certificate]
  );


  return (

     <Container className="themed-container" fluid>
      <Row xs="1" sm="1" md="2" lg="2" xl="2">
        <Col>
          <Widget title={certificateTitle} busy={isBusy}>
            <br />
            <CustomTable
              hasPagination={false}
                headers={detailHeaders}
                data={detailData}
            />
          </Widget>
        </Col>
        <Col>
          <Widget title={sanTitle} busy={isBusy}>
            <br />
            <CustomTable
                headers={detailHeaders}
                data={sanData}
            />
          </Widget>
        </Col>
      </Row>

      <Widget title={validationTitle} busy={isBusy}>
        <br />
        <CustomTable
            headers={validationHeaders}
            data={validationData}
        />
      </Widget>

      <Row xs="1" sm="1" md="2" lg="2" xl="2">
        <Col>
          <Widget title={attributesTitle}>
              <br />
              <CustomTable
                    headers={attributeHeaders}
                    data={attributeData}
                 />
          </Widget>
        </Col>
           <Col>
              <Widget title={metaTitle}>
                 <br />
                 <Label>Metadata</Label>
                 <CustomTable
                    headers={detailHeaders}
                    data={metaData}
                 />
              </Widget>
           </Col>
        </Row>


        <Dialog
           isOpen={confirmDelete}
           caption="Delete Certificate"
           body="You are about to delete a Certificate. Is this what you want to do?"
           toggle={() => setConfirmDelete(false)}
           buttons={[
              { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
              { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
           ]}
        />
     </Container>

  )

}