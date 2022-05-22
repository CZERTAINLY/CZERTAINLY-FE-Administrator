import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Table, Row, Col, Button } from "reactstrap";

import StatusCircle from "components/StatusCircle";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/administrators";
import CertificateAttributes from "components/CertificateAttributes";
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

function AdministratorDetail() {

   const dispatch = useDispatch();

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const administrator = useSelector(selectors.admininistrator);
   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isEnabling);
   const isEnabling = useSelector(selectors.isDisabing);

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();


   useEffect(() => {
      dispatch(actions.getAdminDetail(params.id));
   }, [params.id, dispatch]);


   const onAddClick = () => {
      history.push(`../../administrators/edit/${administrator?.uuid}`);
   }


   const onDeleteClick = () => {
      if (!administrator) return;
      dispatch(actions.deleteAdmin(administrator.uuid));
      setConfirmDelete(false);
   };


   const onEnableClick = () => {
      if (!administrator) return;
      dispatch(actions.enableAdmin(administrator.uuid));
   };


   const onDisableClick = () => {
      if (!administrator) return;
      dispatch(actions.disableAdmin(administrator.uuid));
   };


   const buttons: WidgetButtonProps[] = [
      { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onAddClick(); } },
      { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      { icon: "check", disabled: administrator?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
      { icon: "times", disabled: !(administrator?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
   ]


   const attributesTitle = (
      <div>
         <div className="pull-right mt-n-xs">
            <WidgetButtons buttons={buttons} />
         </div>
         <h5>
            Administrator <span className="fw-semi-bold">Attributes</span>
         </h5>
      </div>
   );


   const certificateTitle = (
      <h5>
         Administrator Certificate <span className="fw-semi-bold">Attributes</span>
      </h5>
   );


   return (
      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>
               <Widget title={attributesTitle} busy={isFetching || isEnabling || isDisabling}>
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
                           <td>{administrator?.uuid}</td>
                        </tr>
                        <tr>
                           <td>Administrator Name</td>
                           <td>{administrator?.name}</td>
                        </tr>
                        <tr>
                           <td>Administrator Surname</td>
                           <td>{administrator?.surname}</td>
                        </tr>
                        <tr>
                           <td>Administrator Username</td>
                           <td>{administrator?.username}</td>
                        </tr>
                        <tr>
                           <td>Email</td>
                           <td>{administrator?.email}</td>
                        </tr>
                        <tr>
                           <td>Description</td>
                           <td>{administrator?.description}</td>
                        </tr>
                        <tr>
                           <td>Superadmin</td>
                           <td>
                              <StatusCircle status={administrator?.role === "superAdministrator"} />
                           </td>
                        </tr>
                        <tr>
                           <td>Status</td>
                           <td>
                              <StatusBadge enabled={administrator?.enabled} />
                           </td>
                        </tr>
                     </tbody>
                  </Table>
               </Widget>
            </Col>

            <Col>
               <Widget title={certificateTitle} busy={isFetching}>
                  <CertificateAttributes certificate={administrator?.certificate} />
               </Widget>
            </Col>
         </Row>

         <MDBModal overflowScroll={false} isOpen={confirmDelete} toggle={() => setConfirmDelete(false)}>

            <MDBModalHeader toggle={() => setConfirmDelete(false)}>
               Delete Credential
            </MDBModalHeader>

            <MDBModalBody>
               You are about to delete an Administrator. Is this what you want to do?
            </MDBModalBody>

            <MDBModalFooter>
               <Button color="danger" onClick={onDeleteClick}>
                  Yes, delete
               </Button>
               <Button color="secondary" onClick={() => setConfirmDelete(false)}>
                  Cancel
               </Button>
            </MDBModalFooter>

         </MDBModal>

      </Container>
   );
}

export default AdministratorDetail;
