import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";

import { Container, Label } from "reactstrap";

import { actions, selectors } from "ducks/authorities";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";

export default function AuthorityDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();
   const history = useHistory();

   const authority = useSelector(selectors.authority);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);

   const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);


   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   const isBusy = useMemo(
      () => isFetching || isDeleting,
      [isFetching, isDeleting]
   );


   useEffect(
      () => {
         if (!params.id) return;
         dispatch(actions.getAuthorityDetail({ uuid: params.id }));
      },
      [dispatch, params.id]
   )


   const onEditClick = useCallback(

      () => {
         if (!authority) return;
         history.push(`/authorities/edit/${authority.uuid}`);
      },
      [authority, history]
   );


   const onDeleteConfirmed = useCallback(

      () => {
         if (!authority) return;
         dispatch(actions.deleteAuthority({ uuid: authority.uuid }));
         setConfirmDelete(false);
      },
      [authority, dispatch]

   );


   const onForceDeleteAuthority = useCallback(

      () => {
         if (!authority) return;
         dispatch(actions.bulkForceDeleteAuthority({ uuids: [ authority.uuid ] }));
      },
      [authority, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [onEditClick]
   );


   const authorityTitle = useMemo(
      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Certification Authority <span className="fw-semi-bold">Details</span>
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

      () => !authority ? [] : [

         {
            id: "uuid",
            columns: ["UUID", authority.uuid],

         },
         {
            id: "name",
            columns: ["Name", authority.name],
         },
         {
            id: "kind",
            columns: ["Kind", authority.kind],
         },
         {
            id: "authorityProviderUUID",
            columns: ["Authority Provider UUID", authority.connectorUuid],
         },
         {
            id: "authorityProviderName",
            columns: ["Authority Provider Name", authority.connectorName],
         }

      ],
      [authority]

   );




   return (

      <Container className="themed-container" fluid>

         <Widget title={authorityTitle} busy={isBusy}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Attributes">

            <br />

            <Label>Certification Authority Attributes</Label>
            <AttributeViewer attributes={authority?.attributes} />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Certification Authority"
            body="You are about to delete Authority. If you continue, connectors
                  related to the authority will fail. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={deleteErrorMessage !== ""}
            caption="Delete Connector"
            body={
               <>
                  Failed to delete the connector as the connector has dependent objects.
                  Please find the details below:
                  <br />
                  <br />
                  {deleteErrorMessage}
               </>
            }
            toggle={() => dispatch(actions.clearDeleteErrorMessages())}
            buttons={[
               { color: "danger", onClick: onForceDeleteAuthority, body: "Force" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />


      </Container>

   )

}



/*
import { actions, selectors } from "ducks/ca-authorities";
import { FieldNameTransform } from "utils/attributes/fieldNameTransform";
*/

/*
function AuthorityDetail() {
  const dispatch = useDispatch();
  const authorityDetails = useSelector(selectors.selectAuthorityDetails);
  const isFetchingAuthority = useSelector(selectors.isFetching);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteAuthorityId);
  const deleteErrorMessages = useSelector(selectors.selectDeleteAuthorityError);

  const { params } = useRouteMatch();
  const history = useHistory();
  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const uuid = (params as any).id as string;
  const allowedAttributeTypeForDetail = [
    "STRING",
    "NUMBER",
    "DROPDOWN",
    "LIST",
    "BOOLEAN",
    "CREDENTIAL",
  ];

  useEffect(() => {
    dispatch(actions.requestAuthorityDetail(uuid));
  }, [uuid, dispatch]);

  useEffect(() => {
    if (deleteErrorMessages?.length > 0) {
      setDeleteErrorModalOpen(true);
    } else {
      setDeleteErrorModalOpen(false);
    }
  }, [deleteErrorMessages]);

  const onConfirmDelete = useCallback(() => {
    dispatch(
      actions.confirmDeleteAuthority(authorityDetails?.uuid || "", history)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps,
  }, [dispatch, authorityDetails]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelBulkDeleteAuthority()),
    [dispatch]
  );

  const onForceDeleteCancel = useCallback(() => {
    dispatch(actions.cancelForceDeleteAuthority());
    setDeleteErrorModalOpen(false);
  }, [dispatch]);

  const onForceDeleteAuthority = () => {
    dispatch(
      actions.requestForceDeleteAuthority(authorityDetails?.uuid || "", history)
    );
    setDeleteErrorModalOpen(false);
  };

  const onDeleteAuthority = () => {
    dispatch(
      actions.confirmDeleteAuthorityRequest(authorityDetails?.uuid || "")
    );
  };

  const attributesTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../authorities/edit/${authorityDetails?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit Authority" />
        </Link>

        <Button
          className="btn btn-link"
          color="white"
          onClick={() => onDeleteAuthority()}
          data-for="delete"
          data-tip
        >
          <i className="fa fa-trash" style={{ color: "red" }} />
          <ToolTip id="delete" message="Delete" />
        </Button>
      </div>
      <h5>
        Authority <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  const attributeTitle = (
    <h5>
      <span className="fw-semi-bold">Attributes</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={attributesTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UUID</td>
              <td>{authorityDetails?.uuid}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{authorityDetails?.name}</td>
            </tr>
            <tr>
              <td>Kind</td>
              <td>{authorityDetails?.kind}</td>
            </tr>
            <tr>
              <td>Authority Provider UUID</td>
              <td>
                {authorityDetails?.connectorUuid || "Connector Not Found"}
              </td>
            </tr>
            <tr>
              <td>Authority Provider Name</td>
              <td>
                {authorityDetails?.connectorUuid ? (
                  <Link
                    to={`../../connectors/detail/${authorityDetails?.connectorUuid}`}
                  >
                    {authorityDetails?.connectorName}
                  </Link>
                ) : (
                  authorityDetails?.connectorName
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Widget>

      <Widget title={attributeTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {authorityDetails?.attributes?.map(function (attribute) {
              if (attribute.name === "credentialId") {
                return (
                  <tr>
                    <td>Credential</td>
                    {}
                    <td>
                      <Link to={`../../credentials/detail/${attribute.value}`}>
                        {attribute.value}
                      </Link>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr>
                    <td>
                      {attribute.label ||
                        FieldNameTransform[attribute.name] ||
                        attribute.name}
                    </td>
                    {}
                    <td>
                      {allowedAttributeTypeForDetail.includes(
                        attribute.type || "STRING"
                      )
                        ? attribute?.value?.name || attribute.value.toString()
                        : "<" + attribute.type + ">"}
                    </td>
                  </tr>
                );
              }
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
          Delete Authority
        </MDBModalHeader>
        <MDBModalBody>
          You are about deleting a authority. If you continue, these connectors
          with the authorities will fail. Is this what you want to do?
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="danger" onClick={onConfirmDelete}>
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
          Delete Authority
        </MDBModalHeader>
        <MDBModalBody>
          <b>
            Failed to delete authority as the authority has some dependent
            profiles. Please find the details below &nbsp;
          </b>
          <br />
          <br />
          {deleteErrorMessages?.map(function (message) {
            return message.message;
          })}
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="danger" onClick={onForceDeleteAuthority}>
            Force
          </Button>
          <Button color="secondary" onClick={onForceDeleteCancel}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <Spinner active={isFetchingAuthority} />
    </Container>
  );
}

export default AuthorityDetail;
*/