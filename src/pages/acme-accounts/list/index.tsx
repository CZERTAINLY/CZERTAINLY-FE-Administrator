import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/acme-accounts";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import StatusBadge from "components/StatusBadge";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import { MDBBadge } from "mdbreact";
import { acmeAccountStatus } from "utils/acmeAccount";

function AcmeAccountList() {

   const dispatch = useDispatch();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const acmeAccounts = useSelector(selectors.accounts);

   const isFetching = useSelector(selectors.isFetchingList);
   const isRevoking = useSelector(selectors.isRevoking);
   const isBulkDeleting = useSelector(selectors.isBulkRevoking);
   const isBulkEnabling = useSelector(selectors.isBulkEnabling);
   const isBulkDisabling = useSelector(selectors.isBulkDisabling);

   const isBusy = isFetching || isRevoking || isBulkDeleting || isBulkEnabling || isBulkDisabling;

   const [confirmRevoke, setConfirmRevoke] = useState<boolean>(false);


   useEffect(

      () => {

         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.listAcmeAccounts());

      },
      [dispatch]

   );


   const onEnableClick = useCallback(

      () => {

         dispatch(actions.bulkEnableAcmeAccounts({ uuids: checkedRows }));

      },
      [checkedRows, dispatch]

   );


   const onDisableClick = useCallback(

      () => {

         dispatch(actions.bulkDisableAcmeAccounts({ uuids: checkedRows }));

      },
      [checkedRows, dispatch]

   );


   const onRevokeConfirmed = useCallback(

      () => {

         dispatch(actions.bulkRevokeAcmeAccounts({ uuids: checkedRows }));
         setConfirmRevoke(false);

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
         { icon: "cross-circle", disabled: checkedRows.length === 0, tooltip: "Revoke", onClick: () => { setConfirmRevoke(true); } },
         { icon: "check", disabled: checkedRows.length === 0, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: checkedRows.length === 0, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [checkedRows, onEnableClick, onDisableClick]

   );


   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               List of <span className="fw-semi-bold">ACME Accounts</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const acmeAccountsTableHeader: TableHeader[] = useMemo(

      () => [

         {
            id: "accountId",
            content: <MDBColumnName columnName="Account Id" />,
            width: "auto"
         },
         {
            id: "ACME Profile Name",
            content: <MDBColumnName columnName="ACME Profile Name" />,
            sortable: true,
            sort: "asc",
            width: "20%",
            align: "center"
         },
         {
            id: "RA Profile Name",
            content: <MDBColumnName columnName="RA Profile Name" />,
            align: "center",
            sortable: true,
            width: "20%",
         },
         {
            id: "internalState",
            content: <MDBColumnName columnName="Internal State" />,
            sortable: true,
            width: "10%",
            align: "center"
         },
         {
            id: "accountStatus",
            content: <MDBColumnName columnName="Account Status" />,
            sortable: true,
            width: "10%",
            align: "center"
         },
         {
            id: "totalOrders",
            content: <MDBColumnName columnName="Total Orders" />,
            sortable: true,
            sortType: "numeric",
            width: "10%",
            align: "center"
         }
      ],
      []

   );


   const acmeAccountsTableData: TableDataRow[] = useMemo(

      () => acmeAccounts.map(

         acmeAccount => {

            const accountStatus = acmeAccountStatus(acmeAccount.status);

            return {

               id: acmeAccount.uuid,

               columns: [

                  <Link to={`${path}/detail/${acmeAccount.acmeProfileUuid}/${acmeAccount.uuid}`}>{acmeAccount.accountId}</Link>,

                  <MDBBadge color="info">{acmeAccount.acmeProfileName}</MDBBadge>,

                  <MDBBadge color="info">{acmeAccount.raProfileName}</MDBBadge>,

                  <StatusBadge enabled={acmeAccount.enabled} />,

                  <MDBBadge color={accountStatus[1]}>{accountStatus[0]}</MDBBadge>,

                  acmeAccount.totalOrders.toString(),

               ]

            }
         }

      ),
      [acmeAccounts, path]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={acmeAccountsTableHeader}
               data={acmeAccountsTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
               hasPagination={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmRevoke}
            caption={`Revoke ${checkedRows.length > 1 ? "an ACME Account" : "an ACME Account"}`}
            body={`You are about to revoke ${checkedRows.length > 1 ? "an ACME Account" : "an ACME Account"}. Is this what you want to do?`}
            toggle={() => setConfirmRevoke(false)}
            buttons={[
               { color: "danger", onClick: onRevokeConfirmed, body: "Yes, revoke" },
               { color: "secondary", onClick: () => setConfirmRevoke(false), body: "Cancel" },
            ]}
         />

      </Container>

   );


}

export default AcmeAccountList;
