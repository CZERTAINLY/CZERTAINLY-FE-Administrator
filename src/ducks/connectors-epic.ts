import { EMPTY, of } from "rxjs";
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

            catchError(err => of(slice.actions.getAllConnectorAttributesFailure(extractError(err, "Failed to get all connector attributes"))))
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

            catchError(err => of(slice.actions.getConnectorHealthFailure(extractError(err, "Failed to get connector health"))))

         )

      )
   )

}


const getConnectorHealthFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorHealthFailure.match
      ),
      switchMap(
         action => EMPTY //alertActions.error(action.payload || "Unexpected error occured")
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


const createConnectorSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createConnectorSuccess.match
      ),
      switchMap(
         action => {
            history.push(`./detail/${action.payload.uuid}`);
            return EMPTY;
         }
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

            catchError(err => of(slice.actions.deleteConnectorFailure(extractError(err, "Failed to delete connector"))))

         )

      )
   )

}


const deleteConnectorSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteConnectorSuccess.match
      ),
      switchMap(
         () => {
            history.push("../");
            return EMPTY
         }
      )
   )

}


const deleteConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteConnectorFailure.match
      ),
      switchMap(
         () => EMPTY // alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const bulkDeleteConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkDeleteConnectors(action.payload).pipe(

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
            action.payload.authAttributes?.map(attribute => transformAttributeModelToDTO(attribute))
         ).pipe(

            map(connection => slice.actions.connectConnectorSuccess(
               connection.map(connection => transformFunctionGroupDTOtoModel(connection.functionGroup))
            )),

            catchError(err => of(slice.actions.connectConnectorFailure(extractError(err, "Failed to connect to connector"))))

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

            map(
               connection => slice.actions.reconnectConnectorSuccess({
                  uuid: action.payload,
                  functionGroups: connection.map(connection => transformFunctionGroupDTOtoModel(connection.functionGroup))
               })
            ),

            catchError(err => of(slice.actions.reconnectConnectorFailure(extractError(err, "Failed to reconnect to connector"))))

         )

      )
   )

}


const reconnectConnectorSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.reconnectConnectorSuccess.match
      ),
      map(
         action => slice.actions.getConnectorHealth(action.payload.uuid)
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

         action => deps.apiClients.connectors.bulkReconnectConnectors(action.payload).pipe(

            map(() => slice.actions.bulkReconnectConnectorsSuccess()),

            catchError(err => of(slice.actions.bulkReconnectConnectorsFailure(extractError(err, "Failed to bulk reconnect to connectors"))))

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

         action => deps.apiClients.connectors.bulkAuthorizeConnectors(action.payload).pipe(

            map(() => slice.actions.bulkAuthorizeConnectorsSuccess()),

            catchError(err => of(slice.actions.bulkAuthorizeConnectorsFailure(extractError(err, "Failed to bulk authorize connectors"))))

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


const bulkForceDeleteConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkForceDeleteConnectors(action.payload.uuids).pipe(

            map(() => slice.actions.bulkForceDeleteConnectorsSuccess(action.payload)),

            catchError(err => of(slice.actions.bulkForceDeleteConnectorsFailure(extractError(err, "Failed to force delete connectors"))))

         )

      )

   )

}


const bulkForceDeleteConnectorsSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteConnectorsSuccess.match
      ),
      switchMap(

         action => {
            if (action.payload.successRedirect) history.push(action.payload.successRedirect);
            return EMPTY;
         }

      )
   )
}


const bulkForceDeleteConnectorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteConnectorsFailure.match
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
   createConnectorSuccess,
   createConnectorFailure,
   updateConnector,
   updateConnectorFailure,
   deleteConnector,
   deleteConnectorSuccess,
   deleteConnectorFailure,
   bulkDeleteConnectors,
   bulkDeleteConnectorsFailed,
   connectConnector,
   connectConnectorFailure,
   reconnectConnector,
   reconnectConnectorSuccess,
   reconnectConnectorFailure,
   bulkReconnectConnectors,
   bulkReconnectConnectorsFailure,
   authorizeConnector,
   authorizeConnectorFailure,
   bulkAuthorizeConnectors,
   bulkAuthorizeConnectorsFailure,
   bulkAuthorizeConnectorsFailure,
   bulkForceDeleteConnectors,
   bulkForceDeleteConnectorsSuccess,
   bulkForceDeleteConnectorsFailure,
];


export default epics;