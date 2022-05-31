import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./connectors";
import { actions as alertActions } from "./alerts";
import { transformConnectorDTOToModel, transformFunctionGroupDTOtoModel } from "./transform/connectors";
import { transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO, transformConnectorHealthDTOToModel, transfromAttributeDescriptorCollectionDTOToModel } from "./transform/attributes";
import { transformDeleteObjectErrorDTOToModel } from "./transform/_common";


const listConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listConnectors.match
      ),
      switchMap(

         () => deps.apiClients.connectors.getConnectorsList().pipe(

            map(list => slice.actions.listConnectorsSuccess(list.map(connectorDto => transformConnectorDTOToModel(connectorDto))),

               catchError(err => of(slice.actions.listConnectorsFailure(extractError(err, "Failed to get connector list"))))
            )

         )

      )

   )

}


const listConnectorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listConnectorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const getConnectorDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorDetail.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorDetail(action.payload).pipe(

            map(detail => slice.actions.getConnectorDetailSuccess(transformConnectorDTOToModel(detail)),

               catchError(err => of(slice.actions.getConnectorDetailFailure(extractError(err, "Failed to get connector detail"))))

            )

         )
      )

   )

}


const getConnectorDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const getConnectorAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorAttributes.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAttributes(
            action.payload.uuid,
            action.payload.functionGroup,
            action.payload.kind
         ).pipe(

            map(
               attrs => slice.actions.getConnectorAttributesSuccess({
                  functionGroup: action.payload.functionGroup,
                  kind: action.payload.kind,
                  attributes: attrs.map(attr => transformAttributeDescriptorDTOToModel(attr))
               })
            ),

            catchError(err => of(slice.actions.getConnectorAttributesFailure(extractError(err, "Failed to get connector attributes"))))

         )

      )
   )

}


const getConnectorAttributesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorAttributesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const getAllConnectorAttributes: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAllConnectorAttributes.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAllAttributes(action.payload).pipe(

            map(descColl => slice.actions.getAllConnectorAttributesSuccess(transfromAttributeDescriptorCollectionDTOToModel(descColl))),

            catchError(err => of(slice.actions.getAllConnectorAttributesFailure(extractError(err, "Failed to "))))
         )

      )
   )

}


const getAllConnectorAttributesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAllConnectorAttributesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const getConnectorHealth: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorHealth.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorHealth(action.payload).pipe(

            map(health => slice.actions.getConnectorHealthSuccess(transformConnectorHealthDTOToModel(health))),

            catchError(err => of(slice.actions.getConnectorHealthFailure(extractError(err, "Failed to "))))

         )

      )
   )

}


const getConnectorHealthFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorHealthFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


/*const connectorCallback: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.connectorCallback.match
      ),
      switchMap(

         action => deps.apiClients.connectors..pipe(

            catchError(err => of(slice.actions.connectorCallbackFailure(extractError(err, "Failed to "))))

         )

      )
   )

}


const connectorCallbackFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.connectorCallbackFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}
*/


const createConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.createNewConnector(
            action.payload.name,
            action.payload.url,
            action.payload.authType,
            action.payload.authAttributes?.map(attribute => transformAttributeModelToDTO(attribute))
         ).pipe(

            switchMap(

               uuid => deps.apiClients.connectors.getConnectorDetail(uuid).pipe(

                  map(connector => slice.actions.createConnectorSuccess(transformConnectorDTOToModel(connector))),

                  catchError(err => of(slice.actions.createConnectorFailure(extractError(err, "Failed to get created connector"))))

               )

            ),

            catchError(err => of(slice.actions.createConnectorFailure(extractError(err, "Failed to create connector"))))

         )

      )
   )

}


const createConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const updateConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.updateConnector(
            action.payload.uuid,
            action.payload.url,
            action.payload.authType,
            action.payload.authAttributes?.map(attribute => transformAttributeModelToDTO(attribute))
         ).pipe(

            map(connector => slice.actions.updateConnectorSuccess(transformConnectorDTOToModel(connector))),

            catchError(err => of(slice.actions.updateConnectorFailure(extractError(err, "Failed to update connector"))))

         )

      )
   )

}


const updateConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const deleteConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.deleteConnector(action.payload).pipe(

            map(() => slice.actions.deleteConnectorSuccess(action.payload)),

            catchError(err => of(slice.actions.deleteConnector(extractError(err, "Failed to delete connector"))))

         )

      )
   )

}


const deleteConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkDeleteConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkDeleteConnector(action.payload).pipe(

            map(errors => slice.actions.bulkDeleteConnectorsSuccess({
               uuids: action.payload,
               errors: errors.map(error => transformDeleteObjectErrorDTOToModel(error))
            })),

            catchError(err => of(slice.actions.bulkDeleteConnectorsFailure(extractError(err, "Failed to bulk delete connectors"))))

         )

      )
   )

}


const bulkDeleteConnectorsFailed: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteConnectorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const connectConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.connectConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.connectToConnector(
            action.payload.url,
            action.payload.authType,
            action.payload.authAttributes
         ).pipe(

            map(functionGroups => slice.actions.connectConnectorSuccess(
               functionGroups.map(functionGroup => transformFunctionGroupDTOtoModel(functionGroup))
            )),

            catchError(err => of(slice.actions.connectConnectorFailure(extractError(err, "Failed to "))))

         )

      )
   )

}


const connectConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.connectConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const reconnectConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.reconnectConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.reconnectConnector(action.payload).pipe(

            map(() => slice.actions.reconnectConnectorSuccess()),

            catchError(err => of(slice.actions.reconnectConnectorFailure(extractError(err, "Failed to reconnect connector"))))

         )

      )
   )

}


const reconnectConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.reconnectConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkReconnectConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkReconnectConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkReconnectConnector(action.payload).pipe(

            map(() => slice.actions.bulkReconnectConnectorsSuccess()),

            catchError(err => of(slice.actions.bulkReconnectConnectorsFailure(extractError(err, "Failed to bulk reconnect connectors"))))

         )

      )
   )

}


const bulkReconnectConnectorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkReconnectConnectorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const authorizeConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.authorizeConnector(action.payload).pipe(

            map(() => slice.actions.authorizeConnectorAuccess()),

            catchError(err => of(slice.actions.authorizeConnectorFailure(extractError(err, "Failed to authorize connector"))))

         )

      )
   )

}


const authorizeConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkAuthorizeConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkAuthorizeConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkAuthorizeConnector(action.payload).pipe(

            map(() => slice.actions.bulkAuthorizeConnectorsSuccess()),

            catchError(err => of(slice.actions.bulkAuthorizeConnectorsFailure(extractError(err, "Failed to "))))

         )

      )
   )

}


const bulkAuthorizeConnectorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkAuthorizeConnectorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const epics = [
   listConnectors,
   listConnectorsFailure,
   getConnectorDetail,
   getConnectorDetailFailure,
   getConnectorAttributes,
   getConnectorAttributesFailure,
   getAllConnectorAttributes,
   getAllConnectorAttributesFailure,
   getConnectorHealth,
   getConnectorHealthFailure,
   //connectorCallback,
   //connectorCallbackFailure,
   createConnector,
   createConnectorFailure,
   updateConnector,
   updateConnectorFailure,
   deleteConnector,
   deleteConnectorFailure,
   bulkDeleteConnectors,
   bulkDeleteConnectorsFailed,
   connectConnector,
   connectConnectorFailure,
   reconnectConnector,
   reconnectConnectorFailure,
   bulkReconnectConnectors,
   bulkReconnectConnectorsFailure,
   authorizeConnector,
   authorizeConnectorFailure,
   bulkAuthorizeConnectors,
   bulkAuthorizeConnectorsFailure
];


export default epics;