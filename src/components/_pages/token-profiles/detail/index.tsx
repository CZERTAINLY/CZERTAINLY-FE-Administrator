import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import TokenStatusBadge from "components/TokenStatusBadge";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions as tokenProfilesActions, selectors as tokenProfilesSelectors } from "ducks/token-profiles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import Select from "react-select";

import { Badge, Col, Container, Label, Row } from "reactstrap";
import { KeyUsage } from "types/openapi";


export default function TokenProfileDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id, tokenId } = useParams();

   const tokenProfile = useSelector(tokenProfilesSelectors.tokenProfile);

   const isFetchingProfile = useSelector(tokenProfilesSelectors.isFetchingDetail);
   const isUpdatingKeyUsage = useSelector(tokenProfilesSelectors.isUpdatingKeyUsage);

   const isDeleting = useSelector(tokenProfilesSelectors.isDeleting);
   const isEnabling = useSelector(tokenProfilesSelectors.isEnabling);
   const isDisabling = useSelector(tokenProfilesSelectors.isDisabling);
   
   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [keyUsageUpdate, setKeyUsageUpdate] = useState<boolean>(false);

   const [keyUsages, setKeyUsages] = useState<KeyUsage[]>([]);

   const KeyUsageMap = {
      [KeyUsage.Sign]: "Signing",
      [KeyUsage.Verify]: "Verifying",
      [KeyUsage.Encrypt]: "Encrypting",
      [KeyUsage.Decrypt]: "Decrypting",
      [KeyUsage.Wrap]: "Wrapping Key",
      [KeyUsage.Unwrap]: "Unwrapping Key",
   }


   const isBusy = useMemo(
      () => isFetchingProfile || isDeleting || isEnabling || isDisabling || isUpdatingKeyUsage,
      [isFetchingProfile, isDeleting, isEnabling, isDisabling, isUpdatingKeyUsage]
   )


   useEffect(

      () => {

         if (!id || !tokenId) return;

         dispatch(tokenProfilesActions.getTokenProfileDetail({ tokenInstanceUuid: tokenId, uuid: id }));

      },
      [id, dispatch, tokenId]

   )


   const onEditClick = useCallback(

      () => {
         if (!tokenProfile) return;
         navigate(`../../../edit/${tokenProfile.tokenInstanceUuid}/${tokenProfile?.uuid}`, { relative: "path" });
      },
      [navigate, tokenProfile]

   );


   const onEnableClick = useCallback(

      () => {

         if (!tokenProfile) return;
         dispatch(tokenProfilesActions.enableTokenProfile({ tokenInstanceUuid: tokenProfile.tokenInstanceUuid, uuid: tokenProfile.uuid }));
      },
      [dispatch, tokenProfile]

   );


   const onDisableClick = useCallback(

      () => {
         if (!tokenProfile) return;
         dispatch(tokenProfilesActions.disableTokenProfile({ tokenInstanceUuid: tokenProfile.tokenInstanceUuid, uuid: tokenProfile.uuid }));
      },
      [dispatch, tokenProfile]

   );


   const onDeleteConfirmed = useCallback(

      () => {
         if (!tokenProfile) return;
         dispatch(tokenProfilesActions.deleteTokenProfile({
            tokenInstanceUuid: tokenProfile.tokenInstanceUuid || "unknown",
            uuid: tokenProfile.uuid,
            redirect: "../../../"
         }));
         setConfirmDelete(false);
      },
      [dispatch, tokenProfile]

   )

   const keyUsageOptions = [
      { value: KeyUsage.Sign, label: "Signing" },
      { value: KeyUsage.Verify, label: "Verifying" },
      { value: KeyUsage.Encrypt, label: "Encrypting" },
      { value: KeyUsage.Decrypt, label: "Decrypting" },
      { value: KeyUsage.Wrap, label: "Wrapping Key" },
      { value: KeyUsage.Unwrap, label: "Unwrapping Key" },
   ]

   const existingUsages = () => {
      if (!tokenProfile) return [];
      return tokenProfile?.usages.map((usage) => {
         return { value: usage, label: KeyUsageMap[usage] }
      })
   }


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: !tokenProfile?.tokenInstanceUuid || tokenProfile?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !tokenProfile?.tokenInstanceUuid || !(tokenProfile?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } },
         { icon: "gavel", disabled: !tokenProfile?.tokenInstanceUuid || false, tooltip: "Update Key Usages", onClick: () => { setKeyUsageUpdate(true); } },
      ],
      [tokenProfile, onEditClick, onDisableClick, onEnableClick]

   );


   const tokenProfileTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Token Profile <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

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


   const detailData: TableDataRow[] = useMemo(

      () => !tokenProfile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", tokenProfile.uuid]
         },
         {
            id: "name",
            columns: ["Name", tokenProfile.name]
         },
         {
            id: "description",
            columns: ["Description", tokenProfile.description || ""]
         },
         {
            id: "enabled",
            columns: ["Enabled", <StatusBadge enabled={tokenProfile!.enabled} />,
            ]
         },
         {
            id: "tokenUuid",
            columns: ["Token Instance UUID", tokenProfile.tokenInstanceUuid]
         },
         {
            id: "tokenName",
            columns: ["Token Instance Name", tokenProfile.tokenInstanceName]
         },
         {
            id: "tokenStatus",
            columns: ["Token Instance Status", <TokenStatusBadge status={tokenProfile.tokenInstanceStatus} />]
         },
         {
            id: "Key Usages",
            columns: ["Key Usages", tokenProfile.usages.map((usage) => <Badge key={usage} color="secondary" className="mr-xs">{KeyUsageMap[usage]}</Badge>)]
         }

      ],
      [tokenProfile]

   )

   const keyUsageBody = 
         <div>
            
            <div className="form-group">
               <label className="form-label">Key Usage</label>
               <Select
                              isMulti = {true}
                              id="field"
                              options={keyUsageOptions}
                              onChange={(e) => {
                                 setKeyUsages(e.map((item) => item.value));
                              }}
                              defaultValue={existingUsages()}
                              isClearable={true}
                           />
            </div>

         </div>
         

   const onUpdateKeyUsageConfirmed = useCallback(

      () => {

         dispatch(tokenProfilesActions.updateKeyUsage({ 

            tokenInstanceUuid: tokenProfile?.tokenInstanceUuid || "unknown", 

            uuid: tokenProfile?.uuid || "unknown", 

            usage: {usage: keyUsages} 
         }));
         
         setKeyUsageUpdate(false);
      },
      [dispatch, tokenProfile, keyUsages]

   );



   return (

      <Container className="themed-container" fluid>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>

               <Widget title={tokenProfileTitle} busy={isBusy}>

                  <br />

                  <CustomTable
                     headers={detailHeaders}
                     data={detailData}
                  />

               </Widget>


            </Col>

            <Col>

               <Widget title="Attributes" busy={isBusy}>
                  <br />
                  <Label>Token Profile Attributes</Label>
                  <AttributeViewer attributes={tokenProfile?.attributes} />

                   <br />
                   <Label>Custom Attributes</Label>
                   <AttributeViewer attributes={tokenProfile?.customAttributes} />
               </Widget>

            </Col>

         </Row>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>
            </Col>

         </Row>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Token Profile"
            body="You are about to delete Token Profile. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={keyUsageUpdate}
            caption={`Update Key Usage`}
            body={keyUsageBody}
            toggle={() => setKeyUsageUpdate(false)}
            buttons={[
               { color: "primary", onClick: onUpdateKeyUsageConfirmed, body: "Update" },
               { color: "secondary", onClick: () => setKeyUsageUpdate(false), body: "Cancel" },
            ]}
         />

      </Container >

   )

}
