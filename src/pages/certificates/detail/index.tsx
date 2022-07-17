import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";

import { Badge, Button, Col, Container, Input, Label, Row } from "reactstrap";

import { actions, selectors } from "ducks/certificates";
import { actions as groupAction, selectors as groupSelectors } from "ducks/groups";
import { actions as raProfileAction, selectors as raProfileSelectors } from "ducks/ra-profiles";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { dateFormatter } from "utils/dateUtil";
import CertificateValidationStatus from "components/pages/certificates/CertificateValidationStatus";
import CertificateStatus from "components/pages/certificates/CertificateStatus";
import ToolTip from "components/ToolTip";
import Select from "react-select";
import { CertificateRevocationReason } from "types/certificate";
import CertificateRenewDialog from "components/pages/certificates/CertificateRenewDialog";


export default function CertificateDetail() {

  const dispatch = useDispatch();

  const { params } = useRouteMatch<{ id: string }>();

  const certificate = useSelector(selectors.certificateDetail);

  const groups = useSelector(groupSelectors.groups);
  const raProfiles = useSelector(raProfileSelectors.raProfiles);

  const [groupOptions, setGroupOptions] = useState<{ label: string, value: string }[]>([]);
  const [raProfileOptions, setRaProfileOptions] = useState<{ label: string, value: string }[]>([]);

  const isFetching = useSelector(selectors.isFetchingDetail);
  const isDeleting = useSelector(selectors.isDeleting);
  const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
  const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
  const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
  const isFetchingHistory = useSelector(selectors.isFetchingHistory);
  const isRevoking = useSelector(selectors.isRevoking);
  const isRenewing = useSelector(selectors.isRenewing);

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [renew, setRenew] = useState<boolean>(false);
  const [revoke, setRevoke] = useState<boolean>(false);
  const [updateGroup, setUpdateGroup] = useState<boolean>(false);
  const [updateOwner, setUpdateOwner] = useState<boolean>(false);
  const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);

  const [group, setGroup] = useState<string>();
  const [owner, setOwner] = useState<string>();
  const [raProfile, setRaProfile] = useState<string>();
  const [revokeReason, setRevokeReason] = useState<CertificateRevocationReason>();

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

  useEffect(

    () => {

       if (!params.id || !updateGroup) return;
       dispatch(groupAction.listGroups());
    },
    [dispatch, updateGroup]
 )

 useEffect(

  () => {

     setGroupOptions(groups.map(group => ({ value: group.uuid, label: group.name })));
  },
  [dispatch, groups]
)

useEffect(

  () => {

     setRaProfileOptions(raProfiles.map(group => ({ value: group.uuid, label: group.name })));
  },
  [dispatch, raProfiles]
)

 

 useEffect(

  () => {

     if (!params.id || !updateGroup) return;
     dispatch(groupAction.listGroups());
  },
  [dispatch, updateGroup]
)


useEffect(

  () => {

     if (!params.id || !revoke) return;
     dispatch(actions.getRevocationAttributes({ raProfileUuid: certificate?.raProfile?.uuid || "" }));
  },
  [dispatch, revoke]
)



 useEffect(

  () => {

     if (!params.id || !updateRaProfile) return;
     dispatch(raProfileAction.listRaProfiles());
  },
  [dispatch, updateRaProfile]
)


  const onDeleteConfirmed = useCallback(

     () => {

        if (!certificate) return;

        dispatch(actions.deleteCertificate({ uuid: certificate.uuid }));
        setConfirmDelete(false);

     },
     [certificate, dispatch]

  );

  const onCancelGroupUpdate = useCallback(

    () => {
      setUpdateGroup(false);
      setGroup(undefined);

    },
    [setUpdateGroup, setGroup]
 );

 const onCancelOwnerUpdate = useCallback(

  () => {
    setUpdateOwner(false);
    setOwner(undefined);

  },
  [setUpdateOwner, setOwner]
);

const onCancelRaProfileUpdate = useCallback(

  () => {
    setUpdateRaProfile(false);
    setRaProfile(undefined);

  },
  [setUpdateRaProfile, setRaProfile]
);


  const onUpdateGroup = useCallback(

    () => {

       if (!certificate || !group) return;

       dispatch(actions.updateGroup({ uuid: certificate.uuid, groupUuid: group }));
       setUpdateGroup(false);

    },
    [certificate, dispatch, group]

  );

 const onUpdateOwner = useCallback(

  () => {

     if (!certificate || !owner) return;

     dispatch(actions.updateOwner({ uuid: certificate.uuid,  owner: owner }));
     setUpdateOwner(false);

  },
  [certificate, dispatch, owner]

  );

const onUpdateRaProfile = useCallback(

  () => {

     if (!certificate || !raProfile) return;

     dispatch(actions.updateRaProfile({ uuid: certificate.uuid,  raProfileUuid: raProfile }));
     setUpdateRaProfile(false);

  },
  [certificate, dispatch, raProfile]

  
  );

  const onRevoke = useCallback(

    () => {
  
       if (!certificate) return;
  
       dispatch(actions.revokeCertificate({ uuid: certificate.uuid,  reason: revokeReason || 'UNSPECIFIED', attributes: [], raProfileUuid: certificate.raProfile?.uuid || "" }));
       setRevoke(false);
  
    },
    [certificate, dispatch, revokeReason, ]
  
    
    );

    const onRenew = useCallback(

      (data: { fileName: string, contentType: string, fileContent: string }) => {

         if (data.fileContent) {

            try {
               dispatch(actions.renewCertificate({uuid: certificate?.uuid || "", pkcs10: data.fileContent, raProfileUuid: certificate?.raProfile?.uuid || ""}));
            } catch (error) {
            }
         }

         setRenew(false);

      },
      [dispatch, certificate]

   );

  const buttons: WidgetButtonProps[] = useMemo(

     () => [
        { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
        { icon: "retweet", disabled: certificate?.raProfile === undefined, tooltip: "Renew", onClick: () => { setRenew(true); } },
        { icon: "minus-square", disabled: certificate?.status === 'revoked', tooltip: "Revoke", onClick: () => { setRevoke(true); } },
     ],
     [certificate]
  );


  const updateOwnerBody = useMemo(

    () => (

       <div>
        <Label for="Owner Name">Owner</Label>
          <Input
            type="text"
            placeholder="Enter the owner name / Email"
            onChange={(event) => setOwner(event.target.value)}
          ></Input>
       </div>

    ),
    [setOwner]

 );

 const updateGroupBody = useMemo(

  () => {
     return (<div>
      <Select
          maxMenuHeight={140}
          menuPlacement="auto"
          options={groupOptions}
          placeholder={`Select Group`}
          onChange = {(event) => setGroup(event?.value)}
      />
     </div>
  )
     },
  [setGroup, groupOptions]

);


const updateRaProfileBody = useMemo(

  () => {
     return (<div>
      <Select
          maxMenuHeight={140}
          menuPlacement="auto"
          options={raProfileOptions}
          placeholder={`Select RA Profile`}
          onChange = {(event) => setRaProfile(event?.value)}
      />
     </div>
  )
     },
  [setRaProfile, raProfileOptions]

);


const revokeBody = useMemo(

  () => {
    let options = [
      {
         "label":"UNSPECIFIED",
         "value":'UNSPECIFIED'
      },
      {
         "label":"KEY_COMPROMISE",
         "value":'KEY_COMPROMISE'
      },
      {
         "label":"CA_COMPROMISE",
         "value":'CA_COMPROMISE'
      },
      {
         "label":"AFFILIATION_CHANGED",
         "value":'AFFILIATION_CHANGED'
      },
      {
         "label":"SUPERSEDED",
         "value":'SUPERSEDED'
      },
      {
         "label":"CESSATION_OF_OPERATION",
         "value":'CESSATION_OF_OPERATION'
      },
      {
         "label":"CERTIFICATE_HOLD",
         "value":'CERTIFICATE_HOLD'
      },
      {
         "label":"PRIVILEGE_WITHDRAWN",
         "value":'PRIVILEGE_WITHDRAWN'
      },
      {
         "label":"A_A_COMPROMISE",
         "value":'A_A_COMPROMISE'
      },
      {
         "label":"REMOVE_FROM_CRL",
         "value":'REMOVE_FROM_CRL'
      }
   ]

     return (<div>
      <Select
          maxMenuHeight={140}
          menuPlacement="auto"
          options={options}
          placeholder={`Select Revocation Reason`}
          onChange = {(event: any) => setRevokeReason(event?.value as CertificateRevocationReason)}
      />

     </div>
  )
     },
  [setRevokeReason]

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

  const historyTitle = (
    <h5>
      <span className="fw-semi-bold">Certificate Event History</span>
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
            columns: ["Owner", certificate.owner || "Unassigned",
                              <Button
                                className="btn btn-link"
                                size="sm"
                                color="secondary"
                                data-for="updateOwner"
                                data-tip
                                onClick={() => setUpdateOwner(true)}
                              >
                                <i className="fa fa-refresh" />
                                <ToolTip id="updateOwner" message="Update Owner" />
                              </Button>
                              ],
         },
         {
          id: "group",
          columns: ["Group", certificate?.group?.name ? (
                            <Link to={`../../groups/detail/${certificate?.group.uuid}`}>
                              {certificate?.group.name}
                            </Link>
                          ) :"Unassigned",
                        <Button
                          className="btn btn-link"
                          size="sm"
                          color="secondary"
                          data-for="updateGroup"
                          data-tip
                          onClick={() => setUpdateGroup(true)}
                        >
                          <i className="fa fa-refresh" />
                          <ToolTip id="updateGroup" message="Update Group" />
                        </Button>
          ],
       },
       {
        id: "raProfile",
        columns: ["RA Profile", certificate?.raProfile?.name ? (
                          <Link to={`../../raProfiles/detail/${certificate?.raProfile.uuid}`}>
                            {certificate?.raProfile.name}
                          </Link>
                        ) : "Unassigned",
                        <Button
                          className="btn btn-link"
                          size="sm"
                          color="secondary"
                          data-for="updateRaProfile"
                          data-tip
                          onClick={() => setUpdateRaProfile(true)}
                        >
                          <i className="fa fa-refresh" />
                          <ToolTip id="updateRaProfile" message="Update RA Profile" />
                        </Button>
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

          <Dialog
            isOpen={updateGroup}
            caption={`Update Group`}
            body={updateGroupBody}
            toggle={() => onCancelGroupUpdate()}
            buttons={[
               { color: "primary", onClick: () => onUpdateGroup(), body: "Update", disabled: true ? group === undefined : false},
               { color: "secondary", onClick: () => onCancelGroupUpdate(), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={updateOwner}
            caption={`Update Owner`}
            body={updateOwnerBody}
            toggle={() => onCancelOwnerUpdate()}
            buttons={[
               { color: "primary", onClick: onUpdateOwner, body: "Update" ,disabled: true ? owner === undefined : false},
               { color: "secondary", onClick: () => onCancelOwnerUpdate(), body: "Cancel"},
            ]}
         />

         <Dialog
            isOpen={updateRaProfile}
            caption={`Update RA Profile`}
            body={updateRaProfileBody}
            toggle={() => onCancelRaProfileUpdate()}
            buttons={[
               { color: "primary", onClick: onUpdateRaProfile, body: "Update", disabled: true ? raProfile === undefined : false },
               { color: "secondary", onClick: () => onCancelRaProfileUpdate(), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={renew}
            caption={`Renew Certificate`}
            body={<CertificateRenewDialog onCancel={() => setRenew(false)} onRenew={onRenew}/>}
            toggle={() => setRenew(false)}
            buttons={[]}
         />

         <Dialog
            isOpen={revoke}
            caption={`revoke Certificate`}
            body={revokeBody}
            toggle={() => setRevoke(false)}
            buttons={[
               { color: "primary", onClick: onRevoke, body: "Revoke" },
               { color: "secondary", onClick: () => setRevoke(false), body: "Cancel" },
            ]}
         />
     </Container>

  )

}