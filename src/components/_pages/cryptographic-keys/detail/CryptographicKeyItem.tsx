import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";

import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/cryptographic-keys";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import { Badge, Button, Col, Label, Row } from "reactstrap";
import { CryptographicKeyHistoryModel, CryptographicKeyItemResponseModel } from "types/cryptographic-keys";
import { KeyCompromiseReason, KeyState } from "types/openapi";
import { dateFormatter } from "utils/dateUtil";
import KeyStateBadge from "../KeyStateBadge";
import KeyStatus from "../KeyStatus";
import SignVerifyData from "./SignVerifyData";

interface Props {
   keyUuid: string;
   tokenInstanceUuid: string;
   tokenProfileUuid?: string;
   keyItem: CryptographicKeyItemResponseModel;
   totalKeyItems: number;
}

export default function CryptographicKeyItem({
      keyUuid,
      tokenInstanceUuid,
      tokenProfileUuid,
      keyItem,
      totalKeyItems,
   }: Props) {

   const dispatch = useDispatch();
   
   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [confirmCompromise, setConfirmCompromise] = useState<boolean>(false);

   const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);

   const [signData, setSignData] = useState<boolean>(false);

   const [verifyData, setVerifyData] = useState<boolean>(false);

   const history = useSelector(selectors.keyHistory);

   const isFetchingHistory = useSelector(selectors.isFetchingHistory);

   const [keyHistory, setKeyHistory] = useState<CryptographicKeyHistoryModel[]>([]);

   const [currentInfoId, setCurrentInfoId] = useState("");

   const [compromiseReason, setCompromiseReason] = useState<KeyCompromiseReason>();

   useEffect(

      () => {
         if (!keyItem) return;
         dispatch(actions.getHistory({ keyItemUuid: keyItem.uuid, tokenInstanceUuid: tokenInstanceUuid, keyUuid: keyUuid }));
      },
      [dispatch, keyItem.uuid, tokenInstanceUuid, keyUuid, keyItem]

   );


   useEffect(

      () => {
         if (history) {
            setKeyHistory(history.filter((item) => item.uuid === keyItem.uuid)?.[0]?.history || []);
         }
      },
      [history, keyItem.uuid]

   );

   const onEnableClick = useCallback(

      () => {

         if (!keyItem) return;
         dispatch(actions.enableCryptographicKey({
            keyItemUuid: [keyItem.uuid],
            tokenInstanceUuid: tokenInstanceUuid, 
            uuid: keyUuid 
         }));
      },
      [dispatch, keyItem, tokenInstanceUuid, keyUuid]

   );


   const onDisableClick = useCallback(

      () => {
         dispatch(actions.disableCryptographicKey({ 
            keyItemUuid: [keyItem.uuid],
            tokenInstanceUuid: tokenInstanceUuid, 
            uuid: keyUuid
         }));
      },
      [dispatch, keyItem, tokenInstanceUuid, keyUuid]

   );


   const onDeleteConfirmed = useCallback(

      () => {
         dispatch(actions.deleteCryptographicKey({
            keyItemUuid: [keyItem.uuid],
            tokenInstanceUuid: tokenInstanceUuid,
            uuid: keyUuid,
            redirect: totalKeyItems === 1 ? "../../../" : undefined
         }));
         setConfirmDelete(false);
      },
      [dispatch, keyItem, tokenInstanceUuid, keyUuid, totalKeyItems]

   )

   const onCompromise = useCallback(

      () => {
         if(!keyItem) return;
         if(!compromiseReason) return;
         dispatch(actions.compromiseCryptographicKey({ 
            request: {
               uuids: [keyItem.uuid],
               reason: compromiseReason
            },
            tokenInstanceUuid: tokenInstanceUuid, 
            uuid: keyUuid }));
         setConfirmCompromise(false);
      },
      [dispatch, keyItem, tokenInstanceUuid, keyUuid, compromiseReason]

   );

   const onDestroy = useCallback(

      () => {
         dispatch(actions.destroyCryptographicKey({ 
            keyItemUuid: [keyItem.uuid],
            tokenInstanceUuid: tokenInstanceUuid, 
            uuid: keyUuid }));
         setConfirmDestroy(false);
      },
      [dispatch, keyItem, tokenInstanceUuid, keyUuid]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: keyItem.state !== KeyState.Active || keyItem.enabled, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: keyItem.state !== KeyState.Active || !keyItem.enabled, tooltip: "Disable", onClick: () => { onDisableClick() } },
         { icon: "handshake", disabled: keyItem.state === KeyState.Compromised || keyItem.state === KeyState.Destroyed, tooltip: "Compromised", onClick: () => { setConfirmCompromise(true) } },
         { icon: "bomb", disabled: keyItem.state === KeyState.Destroyed, tooltip: "Destroy", onClick: () => { setConfirmDestroy(true) } },
         { icon: "sign", disabled: keyItem.state !== KeyState.Active || !keyItem.enabled, tooltip: "Sign", onClick: () => { setSignData(true) } },
         { icon: "verify", disabled: keyItem.state !== KeyState.Active || !keyItem.enabled, tooltip: "Verify", onClick: () => { setVerifyData(true) } },

      ],
      [onDisableClick, onEnableClick, setConfirmCompromise, setConfirmDestroy, keyItem.enabled, keyItem.state]

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


   const detailDataSlice1: TableDataRow[] = useMemo(

      () => !keyItem ? [] : [

         {
            id: "uuid",
            columns: ["UUID", keyItem.uuid]
         },
         {
            id: "name",
            columns: ["Name", keyItem.name]
         },
         {
            id: "Type",
            columns: ["Type", keyItem.type]
         },
         {
            id: "cryptographicAlgorithm",
            columns: ["Cryptographic Algorithm", keyItem.cryptographicAlgorithm]
         },
      ],
      [keyItem]

   )


   const detailDataSlice2: TableDataRow[] = useMemo(

      () => !keyItem ? [] : [
         {
            id: "format",
            columns: ["Key Format", keyItem.format || ""]
         },
         {
            id: "Usages",
            columns: ["Key Usages", keyItem.usage.map((usage) => <Badge key={usage} color="secondary" className="mr-xs">{usage}</Badge>)]
         },
         {
            id: "enabled",
            columns: ["Enabled", <StatusBadge enabled={keyItem!.enabled} />,
            ]
         },
         {
            id: "state",
            columns: ["State", keyItem.reason ? <><KeyStateBadge state={keyItem.state}/>&nbsp;({keyItem.reason})</> : <KeyStateBadge state={keyItem.state}/>]
         }
      ],
      [keyItem]

   )

   const historyHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "time",
            content: "Time",
         },
         {
            id: "user",
            content: "User",
         },
         {
            id: "event",
            content: "Event",
         },
         {
            id: "status",
            content: "Status",
         },
         {
            id: "message",
            content: "Message",
         },
         {
            id: "additionalMessage",
            content: "Additional Message",
         },
      ],
      []

   );

   const optionForCompromise = () => {
      var options = [];
      for (const reason in KeyCompromiseReason) {
         const myReason: KeyCompromiseReason = KeyCompromiseReason[reason as keyof typeof KeyCompromiseReason];
         options.push({ value: myReason, label: myReason });
      }
      return options;
     }


   const historyEntry: TableDataRow[] = useMemo(

      () => !keyHistory ? [] : keyHistory.map(function (history) {

         return (

            {
               "id": history.uuid,
               "columns": [<span style={{ whiteSpace: "nowrap" }}>{dateFormatter(history.created)}</span>,

               history.createdBy,

               history.event,

               <KeyStatus status={history.status} />,

               <div style={{ wordBreak: "break-all" }}>{history.message}</div>,

               history.additionalInformation ? (
                  <Button
                     color="white"
                     onClick={() => setCurrentInfoId(history.uuid)}
                     title="Show Additional Information"
                  >
                     <i className="fa fa-info-circle" aria-hidden="true"></i>
                  </Button>
               ) : ""
               ]
            }

         )

      }), [keyHistory]

   );

   const additionalInfoEntry = (): any => {

      let returnList = [];

      if (!currentInfoId) return;

      const currentHistory = keyHistory?.filter(
         (history) => history.uuid === currentInfoId
      );

      for (let [key, value] of Object.entries(currentHistory![0]?.additionalInformation ?? {})) {

         returnList.push(
            <tr>
               <td style={{ padding: "0.25em" }}>{key}</td>
               <td style={{ padding: "0.25em" }}>
                  <p
                     style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                     }}
                  >
                     {JSON.stringify(value)}
                  </p>
               </td>
            </tr>
         );

      }

      return returnList;

   };



   return (
      <div className="key-details">
         <div>
            <h6 className="d-inline-block">
               <Badge key={keyItem.uuid} color="dark" className="mr-xs">{keyItem.cryptographicAlgorithm}</Badge>
            </h6>
            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

          </div>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>
                  <CustomTable
                     headers={detailHeaders}
                     data={detailDataSlice1}
                  />

            </Col>

            <Col>
                  <CustomTable
                     headers={detailHeaders}
                     data={detailDataSlice2}
                  />

            </Col>

            {
               keyItem.metadata && keyItem.metadata.length > 0 ? <Col>
                     
                     <Label>Meta Data</Label>
                     
                     <AttributeViewer metadata={keyItem.metadata} />
               
               </Col>
               
               : null
            }
         </Row>

         <br />
         <CustomTable
            headers={historyHeaders}
            data={historyEntry}
            hasPagination={true}
         />

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Key"
            body="You are about to delete Key. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
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

         <Dialog
            isOpen={signData}
            caption="Sign Data"
            body={SignVerifyData({ action: "sign", visible: signData, onClose: () => setSignData(false), tokenUuid: tokenInstanceUuid, keyUuid: keyUuid, keyItemUuid: keyItem.uuid, algorithm: keyItem.cryptographicAlgorithm, tokenProfileUuid: tokenProfileUuid })}
            toggle={() => setSignData(false)}
            buttons={[]}
         />

         <Dialog
            isOpen={verifyData}
            caption="Verify Signature"
            body={SignVerifyData({action:"verify", visible: verifyData, onClose: () => setVerifyData(false), tokenUuid: tokenInstanceUuid, keyUuid: keyUuid, keyItemUuid: keyItem.uuid, algorithm: keyItem.cryptographicAlgorithm, tokenProfileUuid: tokenProfileUuid })}
            toggle={() => setVerifyData(false)}
            buttons={[]}
         />

         <Dialog
            isOpen={currentInfoId !== ""}
            caption={`Additional Information`}
            body={additionalInfoEntry()}
            toggle={() => setCurrentInfoId("")}
            buttons={[]}
            size="lg"
         />

      </div >

   )

}
