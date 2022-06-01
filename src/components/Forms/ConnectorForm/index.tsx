import React, { useCallback } from "react";

import { Form, Field } from "react-final-form";
import { Badge, Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Table } from "reactstrap";

import ProgressButton from "components/ProgressButton";

import { validateRequired, composeValidators, validateAlphaNumeric, validateUrl } from "utils/validators";

import InventoryStatusBadge from "components/ConnectorStatus";
import Widget from "components/Widget";
import Select from "react-select";

import { FunctionGroupModel } from "models/connectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";

import { actions as conenctorActions, selectors as connectorSelectors } from "ducks/connectors";


interface FormValues {
   uuid: string;
   name: string;
   url: string;
   authenticationType: string;
}

interface Props {
   title: JSX.Element;
}

const optionsForAuth = [
   {
      label: "No Auth",
      value: "noAuth",
   },
   {
      label: "Basic Auth",
      value: "basic",
   },
   {
      label: "Client Cert",
      value: "clientCert",
   },
];

function ConnectorForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = params.id !== undefined;

   const isFetchingClient = useSelector(connectorSelectors.isFetchingDetail);
   const isCreatingClient = useSelector(connectorSelectors.isCreating);
   const isUpdatingClient = useSelector(connectorSelectors.isUpdating);
   const isConnecting = useSelector(connectorSelectors.isConnecting);
   const connectionDetails = useSelector(connectorSelectors.connectorConnectionDetails);

   const submitTitle = editMode ? "Save" : "Create";
   const connectTitle = editMode ? "Reconnect" : "Connect";
   const inProgressTitle = editMode ? "Saving..." : "Creating...";
   const connectProgressTitle = editMode ? "Reconnecting..." : "Connecting...";

   const defaultValues = {
   }


   const onSubmit = useCallback(
      (values: FormValues) => {
         //onSubmit(values.uuid, values.name, values.url, "none", []);
      },
      [/*onSubmit*/]
   );

   const onCancel = useCallback(
      () => {},
      []
   )


   const connectCallback = (values: FormValues) => {
      //onConnect(values.uuid, values.name, values.url, "none", []);
   };


   const getEndPointInfo = (endpoints: any, functionGroup: any) => {

      let returnData: any = [];

      for (let key of endpoints) {

         let searchKey = "";

         if (functionGroup?.functionGroupCode === "legacyAuthorityProvider") {
            if (
               key.context.includes("authorityProvider") ||
               key.context.includes(functionGroup.functionGroupCode)
            ) {
               returnData.push(
                  <tr>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.name}</div>
                     </td>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.context}</div>
                     </td>
                     <td>{key.method}</td>
                  </tr>
               );
            }

         } else {

            searchKey = functionGroup?.functionGroupCode || "undefined";

            if (key.context.includes(searchKey)) {

               returnData.push(
                  <tr>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.name}</div>
                     </td>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.context}</div>
                     </td>
                     <td>{key.method}</td>
                  </tr>
               );

            }

         }

      }

      return returnData;

   };


   return (

      <div>
         <Form onSubmit={onSubmit} initialValues={defaultValues}>

            {({ handleSubmit, pristine, submitting, values }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Widget title={title}>

                     <Field
                        name="url"
                        validate={composeValidators(validateRequired(), validateUrl())}
                     >

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="url">URL</Label>
                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="URL of the connector service"
                              />
                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                     <Field name="authenticationType">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="authenticationType">Authentication Type</Label>

                              <Select
                                 maxMenuHeight={140}
                                 options={optionsForAuth}
                                 placeholder="Select Auth Type"
                                 menuPlacement="auto"
                                 defaultValue={{
                                    label: "No Auth",
                                    value: "noAuth",
                                 }}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                     {
                        values.authenticationType === "basic" ? (

                           <div>

                              <Field name="username">

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <Label for="username">Username</Label>

                                       <Input
                                          {...input}
                                          valid={!meta.error && meta.touched}
                                          invalid={!!meta.error && meta.touched}
                                          type="text"
                                          placeholder="Username"
                                          disabled={editMode}
                                       />
                                       <FormFeedback>{meta.error}</FormFeedback>

                                    </FormGroup>
                                 )}

                              </Field>

                              <Field name="password">

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <Label for="password">Password</Label>

                                       <Input
                                          {...input}
                                          valid={!meta.error && meta.touched}
                                          invalid={!!meta.error && meta.touched}
                                          type="password"
                                          placeholder="Password"
                                          disabled={editMode}
                                       />

                                       <FormFeedback>{meta.error}</FormFeedback>

                                    </FormGroup>

                                 )}

                              </Field>

                           </div>

                        ) : null
                     }

                     {
                        values.authenticationType === "clientCert" ? (

                           <Field name="clientCert">

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="clientCert">Client Certificate</Label>

                                    <Input
                                       {...input}
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                       type="file"
                                       placeholder="clientCert"
                                       disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        ) : null
                     }

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>.

                           <Button

                              color="success"
                              onClick={() => connectCallback(values)}
                              disabled={submitting || isConnecting || pristine}
                           >

                              {isConnecting ? connectProgressTitle : connectTitle}
                           </Button>

                        </ButtonGroup>

                     </div>

                  </Widget>

                  <Widget title="Connection Details">

                     {
                        connectionDetails ? (

                           <Table className="table-hover" size="sm">

                              <tbody>

                                 <tr>
                                    <td>URL</td>
                                    <td>{values.url}</td>
                                 </tr>

                                 <tr>

                                    <td>Connector Status</td>
                                    <td>
                                       <InventoryStatusBadge
                                          status={
                                             connectionDetails.length > 0 ? "Success" : "Failed"
                                          }
                                       />
                                    </td>

                                 </tr>

                                 <tr>

                                    <td>Functional Group(s)</td>
                                    <td>
                                       {connectionDetails.map(
                                          functionGroup => (
                                             <div>
                                                <Badge style={{ backgroundColor: "Bronze" }} pill>
                                                   {functionGroup?.name}
                                                </Badge>
                                                &nbsp;
                                             </div>
                                          )
                                       )}
                                    </td>

                                 </tr>

                              </tbody>

                           </Table>

                        ) : ("Click Connect to initiate the connection")

                     }

                     {

                        connectionDetails && connectionDetails.length > 0 ? (

                           <div>

                              <b>Connector Functionality Description</b>

                              <hr />{" "}

                              {connectionDetails.map(

                                 functionGroup => (

                                    <Widget title={functionGroup.name}>

                                       <Table className="table-hover" size="sm">
                                          <thead>
                                             <tr>
                                                <th>
                                                   <b>Name</b>
                                                </th>
                                                <th>
                                                   <b>Context</b>
                                                </th>
                                                <th>
                                                   <b>Method</b>
                                                </th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {getEndPointInfo(functionGroup?.endPoints, functionGroup)}
                                          </tbody>

                                       </Table>

                                       <p>
                                          <b>Implemented Kinds</b>
                                       </p>

                                       {functionGroup.kinds.map(function (kinds) {

                                          return (
                                             <div>
                                                <Badge style={{ backgroundColor: "Bronze" }} pill>
                                                   {kinds}
                                                </Badge>
                                                &nbsp;
                                             </div>
                                          );

                                       })}

                                    </Widget>

                                 )

                              )}

                           </div>

                        ) : null}

                     {

                        connectionDetails && connectionDetails.length > 0 ? (

                           <div>

                              <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())} >

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <Label for="name">Connector Name</Label>

                                       <Input
                                          {...input}
                                          valid={!meta.error && meta.touched}
                                          invalid={!!meta.error && meta.touched}
                                          type="text"
                                          placeholder="Connector Name"
                                          disabled={editMode}
                                       />

                                       <FormFeedback>{meta.error}</FormFeedback>

                                    </FormGroup>

                                 )}

                              </Field>

                              <div className="d-flex justify-content-end">

                                 <ButtonGroup>

                                    <Button
                                       color="default"
                                       onClick={onCancel}
                                       disabled={submitting}
                                    >
                                       Cancel
                                    </Button>

                                    <ProgressButton
                                       title={submitTitle}
                                       inProgressTitle={inProgressTitle}
                                       inProgress={submitting}
                                       disabled={pristine}
                                    />

                                 </ButtonGroup>

                              </div>

                           </div>

                        ) : null

                     }

                  </Widget>

               </BootstrapForm>

            )}
         </Form>

      </div>

   );
}

export default ConnectorForm;
