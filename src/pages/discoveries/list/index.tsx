import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/discoveries";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import DiscoveryStatusBadge from "components/DiscoveryStatus";

const { MDBBadge } = require("mdbreact");

function DiscoveryList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const discoveries = useSelector(selectors.discoveries);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);

   const [confirmDelete, setConfirmDelete] = useState(false);

   const isBusy = isFetching || isDeleting || isBulkDeleting;

   useEffect(

      () => {
         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.listDiscoveries());
      },
      [dispatch]

   );


   const onAddClick = useCallback(

      () => {

         history.push(`${path}/add`);

      },
      [history, path]

   );


   const setCheckedRows = useCallback(

      (rows: (string | number)[]) => {

         dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));

      },
      [dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         setConfirmDelete(false);
         dispatch(actions.bulkDeleteDiscovery({ uuids: checkedRows }));

      },
      [dispatch, checkedRows]

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

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               <span className="fw-semi-bold">Discovery Store</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const discoveriesRowHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            id: "discoveryName",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Discovery Provider" />,
            align: "center",
            sortable: true,
            id: "discoveryProvider",
            width: "15%",
         },
         {
            content: <MDBColumnName columnName="Kinds" />,
            align: "center",
            sortable: true,
            id: "kinds",
            width: "15%",
         },
         {
            content: <MDBColumnName columnName="Status" />,
            align: "center",
            sortable: true,
            id: "status",
            width: "15%",
         },
         {
            content: <MDBColumnName columnName="Total Certificates" />,
            align: "center",
            sortable: true,
            sortType: "numeric",
            id: "totalCertificates",
            width: "15%",
         },
      ],
      []

   );


   const discoveryList: TableDataRow[] = useMemo(

      () => discoveries.map(

         discovery => ({

            id: discovery.uuid,

            columns: [

               <Link to={`${path}/detail/${discovery.uuid}`}>{discovery.name}</Link>,

               <MDBBadge color="primary" >{discovery.connectorName}</MDBBadge>,

               <MDBBadge color="secondary" >{discovery.kind}</MDBBadge>,

               <DiscoveryStatusBadge status={discovery.status} />,

               discovery.totalCertificatesDiscovered?.toString() || "0"

            ]

         })

      ),
      [discoveries, path]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />

            <CustomTable
               headers={discoveriesRowHeaders}
               data={discoveryList}
               onCheckedRowsChanged={setCheckedRows}
               hasCheckboxes={true}
               hasPagination={true}
               canSearch={true}
            />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Discoveries" : "a Discovery"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Discoveries" : "a Discovery"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>

   );
}

export default DiscoveryList;
