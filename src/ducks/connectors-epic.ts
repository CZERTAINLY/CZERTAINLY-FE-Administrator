import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import history from "browser-history";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./connectors";
import { actions as alertActions } from "./alerts";
import { transformConnectorDTOToModel, transformFunctionGroupDTOtoModel } from "./transform/connectors";
import { transformAttributeCallbackDataModelToDto, transformAttributeDescriptorDTOToModel, transformAttributeModelToDTO, transformConnectorHealthDTOToModel, transfromAttributeDescriptorCollectionDTOToModel } from "./transform/attributes";
import { transformDeleteObjectErrorDtoToModel } from "./transform/_common";


const listConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listConnectors.match
      ),
      switchMap(

         () => deps.apiClients.connectors.getConnectorsList().pipe(

            map(
               list => slice.actions.listConnectorsSuccess({
                  connectorList: list.map(transformConnectorDTOToModel)
               }),

               catchError(
                  err => of(slice.actions.listConnectorsFailure({ error: extractError(err, "Failed to get connector list") }))
               )
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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const getConnectorDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorDetail.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorDetail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getConnectorDetailSuccess({ connector: transformConnectorDTOToModel(detail) })
            ),
            catchError(
               err => of(slice.actions.getConnectorDetailFailure({ error: extractError(err, "Failed to get connector detail") }))
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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const getConnectorAttributesDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAttributes(
            action.payload.uuid,
            action.payload.functionGroup,
            action.payload.kind
         ).pipe(

            map(
               attrs => slice.actions.getConnectorAttributeDescriptorsSuccess({
                  functionGroup: action.payload.functionGroup,
                  kind: action.payload.kind,
                  attributes: attrs.map(transformAttributeDescriptorDTOToModel)
               })
            ),

            catchError(
               err => of(slice.actions.getConnectorAttributesDescriptorsFailure({ error: extractError(err, "Failed to get connector attributes") }))
            )

         )

      )
   )

}


const getConnectorAttributesDescriptorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorAttributesDescriptorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const getConnectorAllAttributesDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorAllAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorAllAttributes(action.payload.uuid).pipe(

            map(
               descColl => slice.actions.getConnectorAllAttributesDescriptorsSuccess({
                  attributeDescriptorCollection: transfromAttributeDescriptorCollectionDTOToModel(descColl)
               })
            ),

            catchError(
               err => of(slice.actions.getAllConnectorAllAttributesDescriptorsFailure({ error: extractError(err, "Failed to get all connector attributes") }))
            )
         )

      )
   )

}


const getAllConnectorAllAttributesDescriptorsFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAllConnectorAllAttributesDescriptorsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const getConnectorHealth: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getConnectorHealth.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getConnectorHealth(action.payload.uuid).pipe(

            map(
               health => slice.actions.getConnectorHealthSuccess({ health: transformConnectorHealthDTOToModel(health) })
            ),

            catchError(
               err => of(slice.actions.getConnectorHealthFailure({ error: extractError(err, "Failed to get connector health") }))
            )

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
            action.payload.authAttributes?.map(transformAttributeModelToDTO)
         ).pipe(

            switchMap(

               uuid => deps.apiClients.connectors.getConnectorDetail(uuid).pipe(

                  map(
                     connector => slice.actions.createConnectorSuccess({
                        connector: transformConnectorDTOToModel(connector)
                     })
                  ),

                  catchError(
                     err => of(slice.actions.createConnectorFailure({ error: extractError(err, "Failed to get created connector") }))
                  )

               )

            ),

            catchError(err => of(slice.actions.createConnectorFailure({ error: extractError(err, "Failed to create connector") })))

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
            history.push(`./detail/${action.payload.connector.uuid}`);
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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
            action.payload.authAttributes?.map(transformAttributeModelToDTO)
         ).pipe(

            map(
               connector => slice.actions.updateConnectorSuccess({ connector: transformConnectorDTOToModel(connector) })
            ),

            catchError(
               err => of(slice.actions.updateConnectorFailure({ error: extractError(err, "Failed to update connector") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const deleteConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.deleteConnector(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteConnectorSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteConnectorFailure({ error: extractError(err, "Failed to delete connector") }))
            )

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

         action => deps.apiClients.connectors.bulkDeleteConnectors(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteConnectorsSuccess({
                  uuids: action.payload.uuids,
                  errors: errors.map(transformDeleteObjectErrorDtoToModel)
               })
            ),

            catchError(
               err => of(slice.actions.bulkDeleteConnectorsFailure({ error: extractError(err, "Failed to bulk delete connectors") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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
            action.payload.authAttributes?.map(transformAttributeModelToDTO)
         ).pipe(

            map(
               connection => slice.actions.connectConnectorSuccess({
                  connectionDetails: connection.map(connection => transformFunctionGroupDTOtoModel(connection.functionGroup))
               })
            ),

            catchError(
               err => of(slice.actions.connectConnectorFailure({ error: extractError(err, "Failed to connect to connector") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const reconnectConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.reconnectConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.reconnectConnector(action.payload.uuid).pipe(

            map(
               connection => slice.actions.reconnectConnectorSuccess({
                  uuid: action.payload.uuid,
                  functionGroups: connection.map(connection => transformFunctionGroupDTOtoModel(connection.functionGroup))
               })
            ),

            catchError(
               err => of(slice.actions.reconnectConnectorFailure({ error: extractError(err, "Failed to reconnect to connector") }))
            )

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
         action => slice.actions.getConnectorHealth({ uuid: action.payload.uuid })
      )

   )

}


const reconnectConnectorFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.reconnectConnectorFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const bulkReconnectConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkReconnectConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkReconnectConnectors(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkReconnectConnectorsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(slice.actions.bulkReconnectConnectorsFailure({ error: extractError(err, "Failed to bulk reconnect to connectors") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const authorizeConnector: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.authorizeConnector.match
      ),
      switchMap(

         action => deps.apiClients.connectors.authorizeConnector(action.payload.uuid).pipe(

            map(
               () => slice.actions.authorizeConnectorAuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.authorizeConnectorFailure({ error: extractError(err, "Failed to authorize connector") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const bulkAuthorizeConnectors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkAuthorizeConnectors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.bulkAuthorizeConnectors(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkAuthorizeConnectorsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(slice.actions.bulkAuthorizeConnectorsFailure({ error: extractError(err, "Failed to bulk authorize connectors") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
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

            map(
               () => slice.actions.bulkForceDeleteConnectorsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(
               err => of(slice.actions.bulkForceDeleteConnectorsFailure({ error: extractError(err, "Failed to force delete connectors") }))
            )

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
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const callback: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.callback.match
      ),
      switchMap(

         action => {

            return (

               deps.apiClients.connectors.callback(
                  action.payload.url,
                  transformAttributeCallbackDataModelToDto(action.payload.callbackData)
               )

            ).pipe(

               map(
                  data => slice.actions.callbackSuccess({ callbackId: action.payload.callbackId, data })
               ),

               catchError(err => of(slice.actions.callbackFailure({ callbackId: action.payload.callbackId, error: extractError(err, "Connector callback failure") })))

            )

         }

      ),

      catchError(err => of(slice.actions.callbackFailure({ callbackId: "", error: extractError(err, "Failed to perform connector callback") })))

   )

}


const callbackFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.callbackFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occured")
      )

   )

}


const epics = [
   listConnectors,
   listConnectorsFailure,
   getConnectorDetail,
   getConnectorDetailFailure,
   getConnectorAttributesDescriptors,
   getConnectorAttributesDescriptorsFailure,
   getConnectorAllAttributesDescriptors,
   getAllConnectorAllAttributesDescriptorsFailure,
   getConnectorHealth,
   getConnectorHealthFailure,
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
   callback,
   callbackFailure
];


export default epics;