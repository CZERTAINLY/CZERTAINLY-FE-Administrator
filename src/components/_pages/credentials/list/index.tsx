import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container } from "reactstrap";

import { actions, selectors } from "ducks/credentials";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

function CredentialList() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const checkedRows = useSelector(selectors.checkedRows);
   const credentials = useSelector(selectors.credentials);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);

   const isBusy = isFetching || isDeleting || isBulkDeleting;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {
         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.listCredentials());
      },
      [dispatch]

   );


   const onAddClick = useCallback(

      () => {
         navigate(`./add`);
      },
      [navigate]

   );


   const onDeleteConfirmed = useCallback(

      () => {
         setConfirmDelete(false);
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkDeleteCredentials({ uuids: checkedRows }));
      },
      [dispatch, checkedRows]

   );


   const setCheckedRows = useCallback(

      (rows: (string | number)[]) => {
         dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
      },
      [dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [checkedRows, onAddClick]

   );


   const title = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               <span className="fw-semi-bold">Credential Store</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const credentialRowHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: "Name",
            sortable: true,
            sort: "asc",
            id: "adminName",
            width: "15%",
         },
         {
            content: "Kind",
            sortable: true,
            id: "kind",
            width: "20%",
            align: "center"
         },
         {
            content: "Credential Provider",
            sortable: true,
            id: "credentialProviderName",
            width: "25%",
            align: "center"
         },
      ],
      []

   );


   const credentialsData: TableDataRow[] = useMemo(

      () => credentials.map(

         credential => ({

            id: credential.uuid,
            columns: [

               <Link to={`./detail/${credential.uuid}`}>{credential.name}</Link>,

               <Badge color="primary">{credential.kind}</Badge>,

               <Badge color="info">{credential.connectorName}</Badge>

            ]

         })

      ),

      [credentials]

   );


   return (
      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />

            <CustomTable
               headers={credentialRowHeaders}
               data={credentialsData}
               onCheckedRowsChanged={setCheckedRows}
               hasCheckboxes={true}
               hasPagination={true}
               canSearch={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Credentials" : "a Connector"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Credentials" : "a Credential"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );
}

export default CredentialList;
