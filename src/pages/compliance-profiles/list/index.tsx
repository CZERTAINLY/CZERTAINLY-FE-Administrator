import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container, Table } from "reactstrap";

import { actions, selectors } from "ducks/compliance-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import { ComplianceListItemRuleDTO } from "api/compliance-profile";
import { MDBBadge } from "mdbreact";

export default function AdministratorsList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const complianceProfiles = useSelector(selectors.complianceProfiles);

   const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isBulkForceDeleting = useSelector(selectors.isBulkForceDeleting);

   const isBusy = isFetching || isDeleting || isBulkDeleting || isBulkForceDeleting;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);

   const [complianceCheck, setComplianceCheck] = useState<boolean>(false);

   useEffect(

      () => {

         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.listComplianceProfiles());

      },
      [dispatch]

   );

   useEffect(

      () => {

         setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);

      },
      [bulkDeleteErrorMessages]

   );


   const onAddClick = useCallback(

      () => {

         history.push(`${path}/add`);

      },
      [history, path]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         dispatch(actions.bulkDeleteComplianceProfiles({ uuids: checkedRows }));
         setConfirmDelete(false);

      },
      [checkedRows, dispatch]

   );


   const onComplianceCheckConfirmed = useCallback(

      () => {

         dispatch(actions.checkCompliance({ uuids: checkedRows }));
         setComplianceCheck(false);

      },
      [checkedRows, dispatch]

   );


   const setCheckedRows = useCallback(

      (rows: (string | number)[]) => {

         dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));

      },
      [dispatch]

   );

   const onForceDeleteConfirmed = useCallback(

      () => {

         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkForceDeleteComplianceProfiles({ uuids: checkedRows }));

      },
      [dispatch, checkedRows]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "gavel", disabled: checkedRows.length === 0, tooltip: "Check Compliance", onClick: () => { setComplianceCheck(true) } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } }
      ],
      [checkedRows, onAddClick]

   );

   const getComplianceItems = useCallback(

      (complianceItems: ComplianceListItemRuleDTO[], lookingFor: string) => {
         if (lookingFor === "groups") {
            let sum = complianceItems.map(item => item.numberOfGroups || 0).reduce((a, b) => a + b, 0)
            return (
               <div>

                  <MDBBadge color="secondary" searchvalue={sum}>
                     
                     {sum || 0}

                  </MDBBadge>

               </div>

            )

         } else {
            let sum = complianceItems.map(item => item.numberOfRules || 0).reduce((a, b) => a + b, 0)
            return (
               <div>

                  <MDBBadge color="secondary" searchvalue={sum}>
                     
                     {sum || 0}

                  </MDBBadge>

               </div>

            )

         }


      },
      []

   );

   const forceDeleteBody = useMemo(

      () => (

         <div>

            <div>Failed to delete {checkedRows.length > 1 ? "Compliance Profiles" : "an Compliance Profile"}. Please find the details below:</div>

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

                  {bulkDeleteErrorMessages?.map(
                     message => (
                        <tr>
                           <td>{message.name}</td>
                           <td>{message.message}</td>
                        </tr>
                     )
                  )}

               </tbody>

            </Table >

         </div>

      ),
      [bulkDeleteErrorMessages, checkedRows.length]

   );



   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               List of <span className="fw-semi-bold">Compliance Profiles</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const complianceProfilesTableHeader: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc"
         },
         {
            id: "description",
            content: <MDBColumnName columnName="Description" />,
         },
         {
            id: "totalRules",
            content: <MDBColumnName columnName="Total Rules" />,
         },
         {
            id: "totalGroups",
            content: <MDBColumnName columnName="Total Groups" />,
         }
      ],
      []

   );


   const complianceProfilesTableData: TableDataRow[] = useMemo(

      () => complianceProfiles.map(

         complianceProfile => ({

            id: complianceProfile.uuid,

            columns: [

               <Link to={`${path}/detail/${complianceProfile.uuid}`}>{complianceProfile.name}</Link>,
               complianceProfile.description || "",
               <>{getComplianceItems(complianceProfile.rules, "rules")}</>,
               <>{getComplianceItems(complianceProfile.rules, "groups")}</>
            ]
         })
      ),
      [complianceProfiles, path, getComplianceItems]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={complianceProfilesTableHeader}
               data={complianceProfilesTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
               hasPagination={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Compliance Profiles" : "a Compliance Profile"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Compliance Profiles" : "a Compliance Profile"} which may have associated Compliance
                   Account(s). When deleted the Compliance Account(s) will be revoked. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={confirmForceDelete}
            caption={`Force Delete ${checkedRows.length > 1 ? "Compliance Profiles" : "a Compliance Profile"}`}
            body={forceDeleteBody}
            toggle={() => setConfirmForceDelete(false)}
            buttons={[
               { color: "danger", onClick: onForceDeleteConfirmed, body: "Force delete" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={complianceCheck}
            caption={`Initiate Compliance Check`}
            body={"Initiate the compliance check for the selected Compliance Profile(s)?"}
            toggle={() => setComplianceCheck(false)}
            buttons={[
               { color: "primary", onClick: onComplianceCheckConfirmed, body: "Yes" },
               { color: "secondary", onClick: () => setComplianceCheck(false), body: "Cancel" },
            ]}
         />

      </Container>
   );

}
