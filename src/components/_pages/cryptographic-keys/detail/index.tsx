import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/cryptographic-keys";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import Select from "react-select";

import { Col, Container, Label, Row } from "reactstrap";
import { KeyState, KeyUsage } from "types/openapi";
import CryptographicKeyItem from "./CryptographicKeyItem";
import RandomDataGeneration from "./RandomDataGeneration";


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
   
   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [confirmCompromise, setConfirmCompromise] = useState<boolean>(false);

   const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);

   const [keyUsageUpdate, setKeyUsageUpdate] = useState<boolean>(false);

   const [randomDataGeneration, setRandomDataGeneration] = useState<boolean>(false);

   const [keyUsages, setKeyUsages] = useState<KeyUsage[]>([]);

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
         dispatch(actions.compromiseCryptographicKey({ 
            keyItemUuid: [],
            tokenInstanceUuid: cryptographicKey.tokenInstanceUuid, 
            uuid: cryptographicKey.uuid }));
         setConfirmCompromise(false);
      },
      [dispatch, cryptographicKey]

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


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: cryptographicKey?.items.every(item => item.enabled) || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !cryptographicKey?.items.every(item => item.enabled) || false, tooltip: "Disable", onClick: () => { onDisableClick() } },
         { icon: "key", disabled: !cryptographicKey?.items.some(item => item.state === KeyState.Active) || false, tooltip: "Update Key Usages", onClick: () => { setKeyUsageUpdate(true); } },
         { icon: "handshake", disabled: cryptographicKey?.items.every(item => item.state === KeyState.Compromised) || false, tooltip: "Compromised", onClick: () => { setConfirmCompromise(true) } },
         { icon: "bomb", disabled: cryptographicKey?.items.every(item => item.state === KeyState.Destroyed) || false, tooltip: "Destroy", onClick: () => { setConfirmDestroy(true) } },
         { icon: "random", disabled: !cryptographicKey?.items.some(item => item.state === KeyState.Active) || false, tooltip: "Generate Random", onClick: () => { setRandomDataGeneration(true) } },
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
            columns: ["Token Instance Name", cryptographicKey.tokenInstanceName]
         },
         {
            id: "tokenUuid",
            columns: ["Token Instance UUID", cryptographicKey.tokenInstanceUuid]
         },
         {
            id: "tokenProfileName",
            columns: ["Token Profile Name", cryptographicKey.tokenProfileName || ""]
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
            columns: ["Group Name", cryptographicKey.group?.name || ""]
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

                   <br />
                   <Label>Custom Attributes</Label>
                   <AttributeViewer attributes={cryptographicKey?.customAttributes} />
               </Widget>

            </Col>

         </Row>

         <>
         {
            cryptographicKey?.items.map((item, index) => {

               return (
               <Widget busy={isBusy}>
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
         }
         </>

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
            body={`If the Key is compromised, proceed to make the platform stop using it for any operations.`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onCompromise, body: "Yes" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={confirmDestroy}
            caption={`Destroy Key"}`}
            body={`You are about to destroy the Key. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDestroy, body: "Yes, Destroy" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={randomDataGeneration}
            caption="Random Data Generation"
            body={RandomDataGeneration({ visible: randomDataGeneration, onClose: () => setRandomDataGeneration(false), tokenUuid: cryptographicKey?.tokenInstanceUuid})}
            toggle={() => setRandomDataGeneration(false)}
            buttons={[]}
         />

      </Container >

   )

}
