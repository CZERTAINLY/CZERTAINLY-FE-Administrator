import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import { actions, selectors } from "ducks/groups";

import { Container } from "reactstrap";
import Widget from "components/Widget";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import Dialog from "components/Dialog";

function GroupList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const groups = useSelector(selectors.groups);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isUpdating = useSelector(selectors.isUpdating);

   const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(() => {
      dispatch(actions.setCheckedRows({ checkedRows: [] }));
      dispatch(actions.listGroups());
   }, [dispatch]);


   const onAddClick = useCallback(() => {
      history.push(`${path}/add`);
   }, [history, path]);



   const onDeleteConfirmed = useCallback(
      () => {
         dispatch(actions.bulkDeleteGroups({ uuids: checkedRows }));
         setConfirmDelete(false);
      },
      [checkedRows, dispatch]
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

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               List of <span className="fw-semi-bold">Groups</span>
            </h5>

         </div>
      ),
      [buttons]
   );


   const groupsTableHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            width: "15%",
         },
         {
            id: "description",
            content: <MDBColumnName columnName="Description" />,
            sortable: true,
         }
      ],
      []

   );




   const groupsTableData: TableDataRow[] = useMemo(

      () => groups.map(

         group => ({

            id: group.uuid,

            columns: [

               <Link to={`${path}/detail/${group.uuid}`}>{group.name}</Link>,

               group.description || ""

            ]

         })
      ),
      [path, groups]

   )


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={groupsTableHeaders}
               data={groupsTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
               hasPagination={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Groups" : "Profile"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "a Group" : "Groups"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );
}

export default GroupList;
