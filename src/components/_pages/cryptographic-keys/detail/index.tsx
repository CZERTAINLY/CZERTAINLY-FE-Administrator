import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import TabLayout from "components/Layout/TabLayout";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/cryptographic-keys";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";

import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";
import { Col, Container, Label, Row } from "reactstrap";
import { KeyCompromiseReason, KeyState, KeyUsage, Resource } from "types/openapi";
import CryptographicKeyItem from "./CryptographicKeyItem";

export default function CryptographicKeyDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id, tokenId } = useParams();

   const cryptographicKey = useSelector(selectors.cryptographicKey);

   const isFetchingProfile = useSelector(selectors.isFetchingDetail);
   const isUpdatingKeyUsage = useSelector(selectors.isUpdatingKeyUsage);

   const isDeleting = useSelector(selectors.isDeleting);
   const isEnabling = useSelector(selectors.isEnabling);
   const isDisabling = useSelector(selectors.isDisabling);
   const isCompromising = useSelector(selectors.isBulkCompromising);
   const isDestroying = useSelector(selectors.isBulkDestroying);
   const isFetchingHistory = useSelector(selectors.isFetchingHistory);
   
   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [confirmCompromise, setConfirmCompromise] = useState<boolean>(false);

   const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);

   const [keyUsageUpdate, setKeyUsageUpdate] = useState<boolean>(false);

   const [keyUsages, setKeyUsages] = useState<KeyUsage[]>([]);

   const [compromiseReason, setCompromiseReason] = useState<KeyCompromiseReason>();

   const isBusy = useMemo(
      () => isFetchingProfile || isDeleting || isEnabling || isDisabling || isUpdatingKeyUsage || isCompromising || isDestroying,
      [isFetchingProfile, isDeleting, isEnabling, isDisabling, isUpdatingKeyUsage, isCompromising, isDestroying]
   );


   useEffect(

      () => {

         if (!id || !tokenId) return;

         dispatch(actions.getCryptographicKeyDetail({ tokenInstanceUuid: tokenId, uuid: id }));

      },
      [id, dispatch, tokenId]

   )


   const onEditClick = useCallback(

      () => {
         if (!cryptographicKey) return;
         navigate(`../../../edit/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey?.uuid}`, { relative: "path" });
      },
      [navigate, cryptographicKey]

   );


   const onEnableClick = useCallback(

      () => {

         if (!cryptographicKey) return;
         dispatch(actions.enableCryptographicKey({
            keyItemUuid: [],
            tokenInstanceUuid: cryptographicKey.tokenInstanceUuid, 
            uuid: cryptographicKey.uuid 
         }));
      },
      [dispatch, cryptographicKey]

   );


   const onDisableClick = useCallback(

      () => {
         if (!cryptographicKey) return;
         dispatch(actions.disableCryptographicKey({ 
            keyItemUuid: [],
            tokenInstanceUuid: cryptographicKey.tokenInstanceUuid, 
            uuid: cryptographicKey.uuid 
         }));
      },
      [dispatch, cryptographicKey]

   );


   const onDeleteConfirmed = useCallback(

      () => {
         if (!cryptographicKey) return;
         dispatch(actions.deleteCryptographicKey({
            keyItemUuid: [],
            tokenInstanceUuid: cryptographicKey.tokenInstanceUuid || "unknown",
            uuid: cryptographicKey.uuid,
            redirect: cryptographicKey.items.length > 1 ? "../../../": undefined
         }));
         setConfirmDelete(false);
      },
      [dispatch, cryptographicKey]

   )

   const onCompromise = useCallback(

      () => {
         if (!cryptographicKey) return;
         if (!compromiseReason) return;
         dispatch(actions.compromiseCryptographicKey({ 
            request: { reason: compromiseReason },
            tokenInstanceUuid: cryptographicKey.tokenInstanceUuid, 
            uuid: cryptographicKey.uuid }));
         setConfirmCompromise(false);
      },
      [dispatch, cryptographicKey, compromiseReason]

   );

   const onDestroy = useCallback(

      () => {
         if (!cryptographicKey) return;
         dispatch(actions.destroyCryptographicKey({ 
            keyItemUuid: [],
            tokenInstanceUuid: cryptographicKey.tokenInstanceUuid, 
            uuid: cryptographicKey.uuid }));
         setConfirmDestroy(false);
      },
      [dispatch, cryptographicKey]

   );

   const keyUsageOptions = [
      { value: KeyUsage.Sign, label: "Signing" },
      { value: KeyUsage.Verify, label: "Verifying" },
      { value: KeyUsage.Encrypt, label: "Encrypting" },
      { value: KeyUsage.Decrypt, label: "Decrypting" },
      { value: KeyUsage.Wrap, label: "Wrapping Key" },
      { value: KeyUsage.Unwrap, label: "Unwrapping Key" },
   ]

   const optionForCompromise = () => {
      var options = [];
      for (const reason in KeyCompromiseReason) {
         const myReason: KeyCompromiseReason = KeyCompromiseReason[reason as keyof typeof KeyCompromiseReason];
         options.push({ value: myReason, label: myReason });
      }
      return options;
     }


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: cryptographicKey?.items.every(item => item.enabled) || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !cryptographicKey?.items.every(item => item.enabled) || false, tooltip: "Disable", onClick: () => { onDisableClick() } },
         { icon: "key", disabled: !cryptographicKey?.items.some(item => item.state === KeyState.Active) || false, tooltip: "Update Key Usages", onClick: () => { setKeyUsageUpdate(true); } },
         { icon: "handshake", disabled: cryptographicKey?.items.every(item => item.state === KeyState.Compromised) || false, tooltip: "Compromised", onClick: () => { setConfirmCompromise(true) } },
         { icon: "bomb", disabled: cryptographicKey?.items.every(item => item.state === KeyState.Destroyed) || false, tooltip: "Destroy", onClick: () => { setConfirmDestroy(true) } },
      ],
      [cryptographicKey, onEditClick, onDisableClick, onEnableClick, setKeyUsageUpdate, setConfirmCompromise, setConfirmDestroy]

   );


   const cryptographicKeyTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Key <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

   );


   const associationTitle = useMemo(

      () => (

         <div>

            <h5>
               Key <span className="fw-semi-bold">Associations</span>
            </h5>

         </div>

      ), []

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


   const associationHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name",
         },
         {
            id: "uuid",
            content: "UUID",
         },
         {
            id: "resource",
            content: "Resource",
         },
      ],
      []

   );


   const associationBody = useMemo(

      () => !cryptographicKey || !cryptographicKey.associations ? [] : cryptographicKey.associations.map((item) => (
         {
            id: item.uuid,
            columns: [
                        item.resource !== Resource.Certificates ? item.name : <Link to={`../../../certificates/detail/${item.uuid}`}>{item.name}</Link>, 
                        
                        item.uuid, 
                        
                        item.resource
                     
                     ],
         }
      )),
      [cryptographicKey]

   );


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
                              isClearable={true}
                           />
            </div>
         </div>


   const detailData: TableDataRow[] = useMemo(

      () => !cryptographicKey ? [] : [

         {
            id: "uuid",
            columns: ["UUID", cryptographicKey.uuid]
         },
         {
            id: "name",
            columns: ["Name", cryptographicKey.name]
         },
         {
            id: "description",
            columns: ["Description", cryptographicKey.description || ""]
         },
         {
            id: "creationTime",
            columns: ["Creation Time", cryptographicKey.creationTime || ""]
         },
         {
            id: "tokenName",
            columns: ["Token Instance Name", cryptographicKey.tokenInstanceUuid ? <Link to={`../../../tokens/detail/${cryptographicKey.tokenInstanceUuid}`}>{cryptographicKey.tokenInstanceName}</Link> : ""]
         },
         {
            id: "tokenUuid",
            columns: ["Token Instance UUID", cryptographicKey.tokenInstanceUuid]
         },
         {
            id: "tokenProfileName",
            columns: ["Token Profile Name", cryptographicKey.tokenInstanceUuid && cryptographicKey.tokenProfileUuid ? <Link to={`../../../tokenprofiles/detail/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey.tokenProfileUuid}`}>{cryptographicKey.tokenProfileName}</Link> : ""]
         },
         {
            id: "tokenProfileUuid",
            columns: ["Token Profile UUID", cryptographicKey.tokenProfileUuid || ""]
         },
         {
            id: "owner",
            columns: ["Owner", cryptographicKey.owner || ""]
         },
         {
            id: "groupName",
            columns: ["Group Name", cryptographicKey.group ? <Link to={`../../groups/detail/${cryptographicKey.group.uuid}`}>{cryptographicKey.group.name}</Link> : ""]
         }
      ],
      [cryptographicKey]

   )


   const onUpdateKeyUsageConfirmed = useCallback(

      () => {

         dispatch(actions.updateKeyUsage({ 

            tokenInstanceUuid: cryptographicKey?.tokenInstanceUuid || "unknown", 

            uuid: cryptographicKey?.uuid || "unknown", 

            usage: {usage: keyUsages} 
         }));
         
         setKeyUsageUpdate(false);
      },
      [dispatch, cryptographicKey, keyUsages]

   );

   const itemTabs = () => {
      return !cryptographicKey? [] : cryptographicKey?.items.map((item, index) => {

         return ({"title": item.type, 
         "content": (
            <Widget busy={isBusy || isFetchingHistory}>
                     <CryptographicKeyItem 
                        key={item.uuid}
                        keyItem={item} 
                        keyUuid={cryptographicKey.uuid} 
                        tokenInstanceUuid={cryptographicKey.tokenInstanceUuid} 
                        tokenProfileUuid={cryptographicKey.tokenProfileUuid}
                        totalKeyItems={cryptographicKey.items.length}
                     />
                  </Widget>
         )
         })
      })
   }


   return (

      <Container className="themed-container" fluid>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>

               <Widget title={cryptographicKeyTitle} busy={isBusy}>

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
                  <Label>Key Attributes</Label>
                  <AttributeViewer attributes={cryptographicKey?.attributes} />
               </Widget>

                {cryptographicKey && <CustomAttributeWidget resource={Resource.Keys} resourceUuid={cryptographicKey.uuid} attributes={cryptographicKey.customAttributes} />}

            </Col>

         </Row>

         <TabLayout tabs={itemTabs()} />

         <Widget title={associationTitle} busy={isBusy}>

               <br />

               <CustomTable
                  headers={associationHeaders}
                  data={associationBody}
               />

            </Widget>


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

         <Dialog
            isOpen={confirmCompromise}
            caption={`Key Compromised?`}
            body={
               <div>
                  <p>You are about to mark the Key as compromised. Is this what you want to do?</p>
                  <p><b>Warning:</b> This action cannot be undone.</p>
                  <Select
                     name="compromiseReason"
                     id="compromiseReason"
                     options={optionForCompromise()}
                     onChange={(e) => setCompromiseReason(e?.value)}
                  />
               </div>
            }
            toggle={() => setConfirmCompromise(false)}
            buttons={[
               { color: "danger", onClick: onCompromise, body: "Yes" },
               { color: "secondary", onClick: () => setConfirmCompromise(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={confirmDestroy}
            caption={`Destroy Key"}`}
            body={`You are about to destroy the Key. Is this what you want to do?`}
            toggle={() => setConfirmDestroy(false)}
            buttons={[
               { color: "danger", onClick: onDestroy, body: "Yes, Destroy" },
               { color: "secondary", onClick: () => setConfirmDestroy(false), body: "Cancel" },
            ]}
         />

      </Container >

   )

}
