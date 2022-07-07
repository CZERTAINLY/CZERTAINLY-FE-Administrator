import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { Badge, Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Table } from "reactstrap";

import ProgressButton from "components/ProgressButton";

import { validateRequired, composeValidators, validateAlphaNumeric, validateUrl } from "utils/validators";

import InventoryStatusBadge from "components/ConnectorStatus";
import Widget from "components/Widget";
import Select from "react-select";

import { ConnectorModel, EndpointModel } from "models/connectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";

import { actions as conenctorActions, selectors as connectorSelectors } from "ducks/connectors";
import { AuthType } from "types/connectors";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { MDBBadge } from "mdbreact";
import {attributeFieldNameTransform} from "../../../utils/attributes";


interface FormValues {
   uuid: string;
   name: string;
   url: string;
   authenticationType: { value: AuthType };
}

interface Props {
   title: JSX.Element;
}

function ConnectorForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );

   const optionsForAuth: { label: string, value: AuthType }[] = useMemo(
      () => [
         {
            label: "No Auth",
            value: "none",
         },
         {
            label: "Basic Auth",
            value: "basic",
         },
         {
            label: "Client Cert",
            value: "certificate",
         },
      ],
      []
   );


   const isFetching = useSelector(connectorSelectors.isFetchingDetail);
   // const isCreating = useSelector(connectorSelectors.isCreating);
   // const isUpdating = useSelector(connectorSelectors.isUpdating);
   const isConnecting = useSelector(connectorSelectors.isConnecting);
   const isReconnecting = useSelector(connectorSelectors.isReconnecting);

   const connectorSelector = useSelector(connectorSelectors.connector);
   const connectionDetails = useSelector(connectorSelectors.connectorConnectionDetails);

   const [connector, setConnector] = useState<ConnectorModel>();

   const [selectedAuthType, setSelectedAuthType] = useState<{ label: string, value: AuthType }>(
      editMode ? optionsForAuth.find(opt => opt.value === connector?.authType) || optionsForAuth[0] : optionsForAuth[0]
   );

   const submitTitle = editMode ? "Save" : "Create";
   const connectTitle = editMode ? "Reconnect" : "Connect";
   const inProgressTitle = editMode ? "Saving..." : "Creating...";
   const connectProgressTitle = editMode ? "Reconnecting..." : "Connecting...";


   useEffect(

      () => {

         if (params.id && (!connectorSelector || connectorSelector.uuid !== params.id) && !isFetching) {
            dispatch(conenctorActions.getConnectorDetail({ uuid: params.id }));
         }

         if (params.id && (connectorSelector && connectorSelector.uuid === params.id && !isFetching)) {
            dispatch(conenctorActions.reconnectConnector({ uuid: params.id }));
         }

         if (params.id && connectorSelector?.uuid === params.id) {

            setConnector(connectorSelector);

         } else {

            dispatch(conenctorActions.clearConnectionDetails());

            setConnector({
               uuid: "",
               name: "",
               url: "",
               authType: "none",
               status: "unavailable",
               functionGroups: [],
            });

         }

      },

      [editMode, params.id, connectorSelector, isFetching, dispatch]
   )



   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            if (!connector) return;

            dispatch(conenctorActions.updateConnector({
               uuid: connector?.uuid,
               url: values.url,
               authType: selectedAuthType.value,
               // authAttributes: []
            }))

         } else {

            dispatch(conenctorActions.createConnector({
               name: values.name,
               url: values.url,
               authType: selectedAuthType.value,
               // authAttributes: []
            }))

         }

      },
      [editMode, connector, selectedAuthType.value, dispatch]
   );


   const onCancel = useCallback(

      () => {
         history.goBack();
      },
      [history]

   )


   const onConnectClick = (values: FormValues) => {
      if (editMode) {
         dispatch(conenctorActions.reconnectConnector({ uuid: connector!.uuid }));
      } else {
         dispatch(conenctorActions.connectConnector({ url: values.url, authType: values.authenticationType.value }));
      }
   };


   const endPointsHeaders: TableHeader[] = useMemo(
      () => [
         {
            id: "name",
            sortable: true,
            sort: "asc",
            content: "Name"
         },
         {
            id: "context",
            sortable: true,
            content: "Context"
         },
         {
            id: "method",
            sortable: true,
            content: "Method"
         }
      ],
      []
   )


   const getEndPointInfo = useCallback(

      (endpoints: EndpointModel[]): TableDataRow[] => {
         return endpoints.map(
            (endpoint: EndpointModel) => ({
               id: endpoint.name,
               columns: [
                  endpoint.name,
                  endpoint.context,
                  endpoint.method
               ]
            })

         )
      },
      []
   );


   const defaultValues = useMemo(
      () => ({
         name: editMode ? connector?.name : "",
         url: editMode ? connector?.url || "" : "",
         authenticationType: editMode ? optionsForAuth.find(opt => opt.value === connector?.authType) || optionsForAuth[0] : optionsForAuth[0],
      }),
      [editMode, optionsForAuth, connector]
   );


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

                        {({ input, meta, }) => (

                           <FormGroup>

                              <Label for="authenticationType">Authentication Type</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForAuth}
                                 placeholder="Select Auth Type"
                                 onChange={(e) => { input.onChange(e); setSelectedAuthType(e); }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                           </FormGroup>

                        )}

                     </Field>

                     {
                        values.authenticationType.value === "basic" ? (

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
                                       //disabled={editMode}
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
                                       // disabled={editMode}
                                       />

                                       <FormFeedback>{meta.error}</FormFeedback>

                                    </FormGroup>

                                 )}

                              </Field>

                           </div>

                        ) : null
                     }

                     {
                        values.authenticationType.value === "certificate" ? (

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
                                    // disabled={editMode}
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
                              onClick={() => onConnectClick(values)}
                              disabled={submitting || isConnecting || isReconnecting}
                           >
                              {isConnecting || isReconnecting ? connectProgressTitle : connectTitle}
                           </Button>

                        </ButtonGroup>

                     </div>

                  </Widget>

                  {
                     connectionDetails ? (

                        <Widget title="Connection Details" busy={isConnecting}>

                           <Table className="table-hover" size="sm">

                              <tbody>

                                 <tr>
                                    <td>URL</td>
                                    <td>{values.url}</td>
                                 </tr>

                                 <tr>

                                    <td>Connector Status</td>
                                    <td>
                                       <InventoryStatusBadge status={connectionDetails.length > 0 ? "connected" : "failed"} />
                                    </td>

                                 </tr>

                                 <tr>

                                    <td>Function Group(s)</td>
                                    <td>
                                       {connectionDetails.map(
                                          functionGroup => (
                                             <div>
                                                <MDBBadge color="primary" searchvalue={attributeFieldNameTransform[functionGroup?.name || ""] || functionGroup?.name}>
                                                    {attributeFieldNameTransform[functionGroup?.name || ""] || functionGroup?.name}
                                                </MDBBadge>
                                                &nbsp;
                                             </div>
                                          )
                                       )}
                                    </td>

                                 </tr>

                              </tbody>

                           </Table>


                           {

                              connectionDetails && connectionDetails.length > 0 ? (

                                 <div>

                                    <b>Connector Functionality Description</b>

                                    <hr />{" "}

                                    {connectionDetails.map(

                                       functionGroup => (

                                          <Widget key={functionGroup.name} title={

                                             <>

                                                 {attributeFieldNameTransform[functionGroup?.name || ""] || functionGroup?.name}

                                                <div className="pull-right mt-n-xs">
                                                   {
                                                      functionGroup.kinds.map(kinds =>
                                                         <>
                                                            &nbsp;
                                                            <MDBBadge color="secondary" searchvalue={kinds}>
                                                               {kinds}
                                                            </MDBBadge>
                                                         </>
                                                      )
                                                   }
                                                </div>

                                             </>

                                          }>

                                             <CustomTable
                                                headers={endPointsHeaders}
                                                data={getEndPointInfo(functionGroup?.endPoints)}
                                             />

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

                     ) : null

                  }

               </BootstrapForm>

            )}
         </Form>

      </div>

   );
}

export default ConnectorForm;
