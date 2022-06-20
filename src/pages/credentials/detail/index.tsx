import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { Container } from "reactstrap";

import Widget from "components/Widget";

import { actions, selectors } from "ducks/credentials";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";

function CredentialDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();
   const history = useHistory();

   const credential = useSelector(selectors.credential);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);
   const isForceBulkDeleting = useSelector(selectors.isForceBulkDeleting);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);


   const allowedAttributeTypeForDetail = [
      "STRING",
      "NUMBER",
      "DROPDOWN",
      "LIST",
      "CREDENTIAL",
   ];


   useEffect(

      () => {
         dispatch(actions.getCredentialDetail(params.id));
      },
      [params.id, dispatch]

   );


   const onEditClick = useCallback(
      () => {
         if (!credential) return
         history.push(`../../credentials/edit/${credential.uuid}`);
      },
      [history, credential]
   );


   const onDeleteConfirmed = useCallback(

      () => {
         if (!credential) return;
         dispatch(actions.deleteCredential(credential.uuid));
         setConfirmDelete(false);
      },
      [dispatch, credential]

   );


   const onForceDeleteConfirmed = useCallback(

      () => {
         if (!credential) return;
         dispatch(actions.deleteCredential(credential.uuid));
         setConfirmForceDelete(false);
      },
      [dispatch, credential]

   );


   const widgetButtons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [onEditClick, setConfirmDelete]
   );

   const detailsTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={widgetButtons} />
            </div>

            <h5>
               Credential <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [widgetButtons]

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

      () => !credential ? [] : [

         {
            id: "uuid",
            columns: ["UUID", credential.uuid]
         },
         {
            id: "name",
            columns: ["Name", credential.name]
         },
         {
            id: "kind",
            columns: ["Kind", credential.kind]
         },
         {
            id: "credentialProviderName",
            columns: ["Credential Provider Name", credential.connectorName]
         },
         {
            id: "credentialProviderUuid",
            columns: ["Credential Provider UUID", credential.connectorUuid]
         }

      ],
      [credential]

   )


   return (

      <Container className="themed-container" fluid>

         <Widget title={detailsTitle} busy={isFetching || isDeleting || isForceBulkDeleting}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />


         </Widget>

         {

            credential && credential.attributes && credential.attributes.length > 0 && (

               <Widget title="Credential Attributes">

                  <br />

                  <AttributeViewer attributes={credential?.attributes} />

               </Widget>
            )

         }

         {/*

         <Widget title={attributeTitle}>
            <Table className="table-hover" size="sm">
               <thead>
                  <tr>
                     <th>Attribute</th>
                     <th>Value</th>
                  </tr>
               </thead>
               <tbody>
                  {credential?.attributes.map(function (attribute) {
                     return (
                        <tr>
                           <td>
                              {attribute.label ||
                                 FieldNameTransform[attribute.name] ||
                                 attribute.name}
                           </td>
                           { }
                           <td>
                              {allowedAttributeTypeForDetail.includes(attribute.type)
                                 ? attribute.value
                                 : "<" + attribute.type + ">"}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </Table>
         </Widget>

         <MDBModal
            overflowScroll={false}
            isOpen={confirmDeleteId !== ""}
            toggle={onCancelDelete}
         >
            <MDBModalHeader toggle={onCancelDelete}>
               Delete Credential
            </MDBModalHeader>
            <MDBModalBody>
               You are about deleting a credential. If you continue, these connectors
               with the credentials will fail. Is this what you want to do?
            </MDBModalBody>
            <MDBModalFooter>
               <Button color="danger" onClick={onDeleteConfirmed}>
                  Yes, delete
               </Button>
               <Button color="secondary" onClick={onCancelDelete}>
                  Cancel
               </Button>
            </MDBModalFooter>
         </MDBModal>

         <MDBModal
            overflowScroll={false}
            isOpen={deleteErrorModalOpen}
            toggle={onForceDeleteCancel}
         >
            <MDBModalHeader toggle={onForceDeleteCancel}>
               Delete Credential
            </MDBModalHeader>
            <MDBModalBody>
               Failed to delete some of the credentials. Please find the details
               below &nbsp;
               <Table className="table-hover" size="sm">
                  <thead>
                     <tr>
                        <th>
                           <b>Name</b>
                        </th>
                        <th>
                           <b>Dependencies</b>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {deleteErrorMessages?.map(function (message) {
                        return (
                           <tr>
                              <td>{message.name}</td>
                              <td>{message.message}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </Table>
            </MDBModalBody>
            <MDBModalFooter>
               <Button color="danger" onClick={onForceDeleteCredential}>
                  Force
               </Button>
               <Button color="secondary" onClick={onForceDeleteCancel}>
                  Cancel
               </Button>
            </MDBModalFooter>
         </MDBModal>

         <Spinner active={isFetchingCredential} />

                  */}

      </Container>
   );
}

export default CredentialDetail;
