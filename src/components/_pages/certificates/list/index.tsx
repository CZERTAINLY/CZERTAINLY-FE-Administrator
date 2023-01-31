import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

import Dialog from "components/Dialog";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/certificates";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Container, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from "reactstrap";
import { CertificateSearchFilterModel } from "types/certificate";

import { dateFormatter } from "utils/dateUtil";
import { downloadFileZip } from "utils/download";
import { AttributeRequestModel } from "../../../../types/attributes";
import CertificateComplianceStatusIcon from "../CertificateComplianceStatusIcon";
import CertificateGroupDialog from "../CertificateGroupDialog";
import CertificateInventoryFilter from "../CertificateInventoryFilter";
import CertificateOwnerDialog from "../CertificateOwnerDialog";
import CertificateRAProfileDialog from "../CertificateRAProfileDialog";
import CertificateStatus from "../CertificateStatus";
import CertificateUploadDialog from "../CertificateUploadDialog";

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
   const navigate = useNavigate();

   const checkedRows = useSelector(selectors.checkedRows);

   const certificates = useSelector(selectors.certificates);

   const totalItems = useSelector(selectors.totalItems);

   const isFetchingAvailableFilters = useSelector(selectors.isFetchingAvailableFilters);
   const currentFilters = useSelector(selectors.currentCertificateFilters);
   const isFetchingList = useSelector(selectors.isFetchingList);
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

   const [pageSize, setPageSize] = useState(10);
   const [pageNumber, setPageNumber] = useState(1);

   const [filters, setFilters] = useState<CertificateSearchFilterModel[]>();

   const [upload, setUpload] = useState<boolean>(false);
   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [updateGroup, setUpdateGroup] = useState<boolean>(false);
   const [updateOwner, setUpdateOwner] = useState<boolean>(false);
   const [updateEntity, setUpdateEntity] = useState<boolean>(false);
   const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);

   const isBusy = isFetchingAvailableFilters || isFetchingList || isIssuing || isRevoking || isRenewing || isDeleting || isBulkDeleting || isUpdatingGroup || isUpdatingRaProfile || isUpdatingOwner || isBulkUpdatingGroup || isBulkUpdatingRaProfile || isBulkUpdatingOwner || isUploading;

   useEffect(

      () => {
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         setFilters(currentFilters);
      },
      [currentFilters, dispatch]

   );


   useEffect(

      () => {
         if (!filters) return;
         dispatch(actions.setCurrentFilters({currentFilters: filters}));
      },
      [dispatch, filters]
   );


   useEffect(

      () => {
         if (!filters) return;
         dispatch(actions.listCertificates({ itemsPerPage: pageSize, pageNumber, filters }));
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

      (fltrs: CertificateSearchFilterModel[]) => { if (fltrs !== filters) setFilters(fltrs); setPageNumber(1); },
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
         navigate(`./add`);
      },
      [navigate]

   );


   const onUploadClick = useCallback(

      (data: { fileName: string, contentType: string, fileContent: string, customAttributes?: Array<AttributeRequestModel> }) => {

         if (data.fileContent) {

            try {
               dispatch(actions.uploadCertificate({ certificate: data.fileContent, customAttributes: data.customAttributes ?? [] }));
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

         dispatch(actions.bulkDelete({ uuids: checkedRows, filters }));
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
                  disabled={checkedRows.length === 0}
                  title="Download"
               >
                  <i className="fa fa-download" aria-hidden="true" />
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

            <div className="fa-pull-right mt-n-xs">
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
            content: "Status",
            //sortable: true,
            align: "center",
            id: "status",
            width: "5%"
         },
         {
            content: "Compliance",
            //sortable: true,
            align: "center",
            id: "compliance",
            width: "5%"
         },
         {
            content: "Common Name",
            //sortable: true,
            id: "commonName",
            width: "10%"
         },
         {
            content: "Valid From",
            //sortable: true,
            //sortType: "date",
            id: "validFrom",
            width: "15%"
         },
         {
            content: "Expires At",
            //sortable: true,
            //sortType: "date",
            id: "expiresAt",
            width: "15%"
         },
         {
            content: "Group",
            //sortable: true,
            id: "group",
            width: "15%"
         },
         {
            content: "RA Profile",
            //sortable: true,
            id: "raProfile",
            width: "15%"
         },
         {
            content: "Owner",
            //sortable: true,
            id: "owner",
            width: "15%"
         },
         {
            content: "Serial number",
            //sortable: true,
            id: "serialNumber",
            width: "15%"
         },
         {
            content: "Signature Algorithm",
            //sortable: true,
            id: "signatureAlgorithm",
            width: "15%"
         },
         {
            content: "Public Key Algorithm",
            //sortable: true,
            id: "publicKeyAlgorithm",
            width: "15%"
         },
         {
            content: "Issuer Common Name",
            //sortable: true,
            id: "issuerCommonName",
            width: "15%"
         },
         {
            content: "Certificate Type",
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

                  <CertificateStatus status={certificate.status} asIcon={true} />,

                  <CertificateComplianceStatusIcon status={certificate.complianceStatus} id={`compliance-${certificate.fingerprint || certificate.serialNumber}`} />,

                  selectCertsOnly ? certificate.commonName || "(empty)" : <Link to={`./detail/${certificate.uuid}`}>{certificate.commonName || "(empty)"}</Link>,

                  <span style={{whiteSpace: "nowrap"}}>{dateFormatter(certificate.notBefore)}</span>,

                  <span style={{whiteSpace: "nowrap"}}>{dateFormatter(certificate.notAfter)}</span>,

                  certificate.group?.name || "Unassigned",

                  <span style={{ whiteSpace: "nowrap" }}>{certificate.raProfile?.name || "Unassigned"}</span>,

                  certificate.owner || "Unassigned",

                  certificate.serialNumber,

                  certificate.signatureAlgorithm,

                  certificate.publicKeyAlgorithm,

                  certificate.issuerCommonName,

                  certificate.certificateType || "Unknown",

               ]

            }

         }

      ),
      [certificates, selectCertsOnly]

   );


   const paginationData = useMemo(

      () => ({
         page: pageNumber,
         totalItems: totalItems,
         pageSize: pageSize,
         loadedPageSize: pageSize,
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
