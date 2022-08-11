import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { Container, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from "reactstrap";

import { actions, selectors } from "ducks/certificates";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import MDBColumnName from "components/MDBColumnName";
import CertificateStatusIcon from "components/pages/connectors/CertificateStatusIcon";
import { dateFormatter } from "utils/dateUtil";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import ToolTip from "components/ToolTip";
import CertificateInventoryFilter from "components/pages/certificates/CertificateInventoryFilter";
import { CertificateListQueryFilterModel } from "models";
import Dialog from "components/Dialog";
import CertificateUploadDialog from "components/pages/certificates/CertificateUploadDialog";
import CertificateGroupDialog from "components/pages/certificates/CertificateGroupDialog";
import CertificateOwnerDialog from "components/pages/certificates/CertificateOwnerDialog";
import CertificateRAProfileDialog from "components/pages/certificates/CertificateRAProfileDialog";
import { downloadFileZip } from "utils/download";
import CertificateComplianceStatusIcon from "components/pages/certificates/CertificateComplianceStatusIcon";


interface Props {
   selectCertsOnly?: boolean;
   multiSelect?: boolean;
   onCheckedRowsChanged?: (checkedRows: (string | number)[]) => void;
}

export default function CertificateList({
   selectCertsOnly = false,
   multiSelect = true,
   onCheckedRowsChanged
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);

   const certificates = useSelector(selectors.certificates);

   const totalItems = useSelector(selectors.totalItems);

   const isFetchingAvailablFilters = useSelector(selectors.isFetchingAvailablFilters);
   const isFetchingList = useSelector(selectors.isFetchingList);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingHistory = useSelector(selectors.isFetchingHistory);
   const isIssuing = useSelector(selectors.isIssuing);
   const isRevoking = useSelector(selectors.isRevoking);
   const isRenewing = useSelector(selectors.isRenewing);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
   const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
   const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
   const isBulkUpdatingGroup = useSelector(selectors.isBulkUpdatingGroup);
   const isBulkUpdatingRaProfile = useSelector(selectors.isBulkUpdatingRaProfile);
   const isBulkUpdatingOwner = useSelector(selectors.isBulkUpdatingOwner);
   const isUploading = useSelector(selectors.isUploading);
   const isFetchingIssuanceAttributes = useSelector(selectors.isFetchingIssuanceAttributes);
   const isFetchingRevocationAttributes = useSelector(selectors.isFetchingRevocationAttributes);

   const [pageSize, setPageSize] = useState(10);
   const [pageNumber, setPageNumber] = useState(1);

   const [filters, setFilters] = useState<CertificateListQueryFilterModel[]>();

   const [upload, setUpload] = useState<boolean>(false);
   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [updateGroup, setUpdateGroup] = useState<boolean>(false);
   const [updateOwner, setUpdateOwner] = useState<boolean>(false);
   const [updateEntity, setUpdateEntity] = useState<boolean>(false);
   const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);

   const isBusy = isFetchingAvailablFilters || isFetchingList || isFetchingDetail || isFetchingHistory || isIssuing || isRevoking || isRenewing || isDeleting || isBulkDeleting || isUpdatingGroup || isUpdatingRaProfile || isUpdatingOwner || isBulkUpdatingGroup || isBulkUpdatingRaProfile || isBulkUpdatingOwner || isUploading || isFetchingIssuanceAttributes || isFetchingRevocationAttributes;

   useEffect(

      () => {
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.setCheckedRows({ checkedRows: [] }));
      },
      [dispatch]

   );


   useEffect(

      () => {
         if (!filters) return;
         dispatch(actions.listCertificates({ query: { filters, itemsPerPage: pageSize, pageNumber } }));
         dispatch(actions.setForceRefreshList({ forceRefreshList: false }));
         dispatch(actions.setCheckedRows({checkedRows: []}));
      },
      [dispatch, filters, pageSize, pageNumber]

   );


   const setCheckedRows = useCallback(
      (rows: (string | number)[]) => {
         if (onCheckedRowsChanged) onCheckedRowsChanged(rows);
         dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
      },
      [dispatch, onCheckedRowsChanged]
   );


   const onFiltersChanged = useCallback(

      fltrs => { if (fltrs !== filters) setFilters(fltrs); setPageNumber(1); },
      [filters]

   );


   const onPageSizeChanged = useCallback(

      (pageSize: number) => {
         setPageSize(pageSize);
         setPageNumber(1);
      },
      [setPageSize, setPageNumber]

   );


   const onAddClick = useCallback(

      () => {
         history.push(`${path}/add`);
      },
      [history, path]

   );


   const onUploadClick = useCallback(

      (data: { fileName: string, contentType: string, fileContent: string }) => {

         if (data.fileContent) {

            try {
               dispatch(actions.uploadCertificate({ certificate: data.fileContent }));
            } catch (error) {
            }
         }

         setUpload(false);

      },
      [dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (checkedRows.length === 0) return;

         dispatch(actions.bulkDelete({ uuids: checkedRows, allSelect: false, inFilter: filters }));
         setConfirmDelete(false);

      },
      [checkedRows, dispatch, filters]

   );



   const downloadDropDown = useMemo(
         () => (

            <UncontrolledButtonDropdown>

               <DropdownToggle
                  color="light"
                  caret
                  className="btn btn-link"
                  data-for="download"
                  data-tip
                  disabled={checkedRows.length === 0}
               >
                  <i className="fa fa-download" aria-hidden="true" />
                  <ToolTip id="download" message="Download" />
               </DropdownToggle>

               <DropdownMenu>

                  <DropdownItem key="pem" onClick={() => {downloadFileZip(checkedRows, certificates, "pem")} }>
                     PEM (.pem)
                  </DropdownItem>

                  <DropdownItem key="der" onClick={() => {downloadFileZip(checkedRows, certificates, "cer")} }>
                     DER (.cer)
                  </DropdownItem>

               </DropdownMenu>

            </UncontrolledButtonDropdown>

         ),
         [certificates, checkedRows]

      );


   const buttons: WidgetButtonProps[] = useMemo(
      () => selectCertsOnly ? [] : [
         { icon: "plus", disabled: false, tooltip: "Create Certificate", onClick: () => { onAddClick(); } },
         { icon: "upload", disabled: false, tooltip: "Upload Certificate", onClick: () => { setUpload(true); } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete Certificate", onClick: () => { setConfirmDelete(true) } },
         { icon: "group", disabled: checkedRows.length === 0, tooltip: "Update Group", onClick: () => { setUpdateGroup(true) } },
         { icon: "user", disabled: checkedRows.length === 0, tooltip: "Update Owner", onClick: () => { setUpdateOwner(true) } },
         // { icon: "cubes", disabled: true, tooltip: "Update Entity", onClick: () => { setUpdateEntity(true) } },
         { icon: "plug", disabled: checkedRows.length === 0, tooltip: "Update RA Profile", onClick: () => { setUpdateRaProfile(true) } },
         { icon: "download", disabled: checkedRows.length === 0, tooltip: "Download", custom: downloadDropDown, onClick: () => { } }
      ],
      [checkedRows.length, downloadDropDown, onAddClick, selectCertsOnly]
   );


   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />

            </div>

            <h5 className="mt-0">
               <span className="fw-semi-bold">List of certificates</span>
            </h5>

         </div>

      ),
      [buttons]

   );

   const certificatesRowHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: <MDBColumnName columnName="Status" />,
            //sortable: true,
            align: "center",
            id: "status",
            width: "5%"
         },
         {
            content: <MDBColumnName columnName="Compliance" />,
            //sortable: true,
            align: "center",
            id: "status",
            width: "5%"
         },
         {
            content: <MDBColumnName columnName="Common Name" />,
            //sortable: true,
            id: "commonName",
            width: "10%"
         },
         {
            content: <MDBColumnName columnName="Valid From" />,
            //sortable: true,
            //sortType: "date",
            id: "validFrom",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Expires At" />,
            //sortable: true,
            //sortType: "date",
            id: "expiresAt",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Entity" />,
            //sortable: true,
            id: "entity",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Group" />,
            //sortable: true,
            id: "group",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="RA Profile" />,
            //sortable: true,
            id: "raProfile",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Owner" />,
            //sortable: true,
            id: "owner",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Serial number" />,
            //sortable: true,
            id: "serialNumber",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Public Key Algorithm" />,
            //sortable: true,
            id: "publicKeyAlgorithm",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Issuer Common Name" />,
            //sortable: true,
            id: "issuerCommonName",
            width: "15%"
         },
         {
            content: <MDBColumnName columnName="Certificate Type" />,
            //sortable: true,
            id: "certificateType",
            width: "15%"
         },
      ],
      []

   );

   const certificateList: TableDataRow[] = useMemo(

      () => certificates.map(

         certificate => {

            return {

               id: certificate.uuid,
               columns: [

                  <CertificateStatusIcon status={certificate.status} id={certificate.fingerprint || certificate.serialNumber} />,

                  <CertificateComplianceStatusIcon status={certificate.complianceStatus || "na"} id={`compliance-${certificate.fingerprint || certificate.serialNumber}`} />,

                  selectCertsOnly ? certificate.commonName || "(empty)" : <Link to={`${path}/detail/${certificate.uuid}`}>{certificate.commonName || "(empty)"}</Link>,

                  dateFormatter(certificate.notBefore),

                  dateFormatter(certificate.notAfter),

                  certificate.entity?.name || "Unassigned",

                  certificate.group?.name || "Unassigned",

                  certificate.raProfile?.name || "Unassigned",

                  certificate.owner || "Unassigned",

                  certificate.serialNumber,

                  certificate.signatureAlgorithm,

                  certificate.issuerCommonName,

                  certificate.certificateType,

               ]

            }

         }

      ),
      [certificates, path]

   );


   const paginationData = useMemo(

      () => ({
         page: pageNumber,
         totalItems: totalItems,
         pageSize: pageSize,
         totalPages: Math.ceil(totalItems / pageSize),
         itemsPerPageOptions: selectCertsOnly ? [10, 20] : [10, 20, 50, 100, 200, 500, 1000],
      }),
      [pageNumber, totalItems, pageSize, selectCertsOnly]

   );



   return (


      <Container className="themed-container" fluid>

         <br />

         <CertificateInventoryFilter
            onFiltersChanged={onFiltersChanged}
         />

         <Widget title={title} busy={isBusy}>

            <CustomTable
               multiSelect={multiSelect}
               headers={certificatesRowHeaders}
               data={certificateList}
               onCheckedRowsChanged={setCheckedRows}
               hasCheckboxes={true}
               hasPagination={true}
               canSearch={false}
               paginationData={paginationData}
               onPageChanged={setPageNumber}
               onPageSizeChanged={onPageSizeChanged}
            />

         </Widget>


         <Dialog
            isOpen={upload}
            caption={`Upload Certificate`}
            body={<CertificateUploadDialog onCancel={() => setUpload(false)} onUpload={(data) => onUploadClick(data)} />}
            toggle={() => setUpload(false)}
            buttons={[]}
         />


         <Dialog
            isOpen={confirmDelete}
            caption={checkedRows.length === 1 ? `Delete certificate` : `Delete certificates`}
            body={`You are about to delete ${checkedRows.length} certificate${checkedRows.length === 1 ? "" : "s"}. Are you sure?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={updateGroup}
            caption={`Update Group`}
            body={<CertificateGroupDialog uuids={checkedRows} onCancel={() => setUpdateGroup(false)} onUpdate={() => setUpdateGroup(false) } />}
            toggle={() => setUpdateGroup(false)}
            buttons={[]}
         />


         <Dialog
            isOpen={updateOwner}
            caption={`Update Owner`}
            body={<CertificateOwnerDialog uuids={checkedRows} onCancel={() => setUpdateOwner(false)} onUpdate={() => setUpdateOwner(false) } />}
            toggle={() => setUpdateOwner(false)}
            buttons={[]}
         />


         <Dialog
            isOpen={updateEntity}
            caption={`Update Entity`}
            body={`Update Entity`}
            toggle={() => setUpdateEntity(false)}
            buttons={[
               { color: "primary", onClick: () => { }, body: "Update" },
               { color: "secondary", onClick: () => setUpdateEntity(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={updateRaProfile}
            caption={`Update RA Profile`}
            body={<CertificateRAProfileDialog uuids={checkedRows} onCancel={() => setUpdateRaProfile(false)} onUpdate={() => setUpdateRaProfile(false) } />}
            toggle={() => setUpdateRaProfile(false)}
            buttons={[]}
         />


      </Container>

   )

}
