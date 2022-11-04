import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import { slice } from "./connectors";
import { actions as appRedirectActions } from "./app-redirect";

import { transformDeleteObjectErrorDtoToModel } from "./transform/_common";
import { transformConnectorDTOToModel, transformFunctionGroupDTOtoModel } from "./transform/connectors";

import {
   transformAttributeCallbackDataModelToDto,
   transformAttributeDescriptorDTOToModel,
   transformAttributeModelToDTO,
   transformConnectorHealthDTOToModel,
   transfromAttributeDescriptorCollectionDTOToModel
} from "./transform/attributes";


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
            ),

            catchError(
               error => of(
                  slice.actions.listConnectorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to get connector list" })
               )
            )

         )

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
               error => of(
                  slice.actions.getConnectorDetailFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to get connector detail" })
               )
            )

         )

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
               error => of(
                  slice.actions.getConnectorAttributesDescriptorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to get connector attributes" })
               )
            )

         )

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
               error => of(
                  slice.actions.getAllConnectorAllAttributesDescriptorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to get all connector attributes" })
               )
            )
         )

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
               error => of(
                  slice.actions.getConnectorHealthFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to get connector health" })
               )
            )

         )

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

               obj => deps.apiClients.connectors.getConnectorDetail(obj.uuid).pipe(

                  mergeMap(
                     connector => of(
                        slice.actions.createConnectorSuccess({
                           connector: transformConnectorDTOToModel(connector)
                        }),
                        appRedirectActions.redirect({ url: `./detail/${connector.uuid}` })
                     )
                  ),

                  catchError(
                     error => of(
                        slice.actions.createConnectorFailure(),
                        appRedirectActions.fetchError({ error, message: "Failed to get created connector" })
                     )
                  )

               )

            ),

            catchError(
               error => of(
                  slice.actions.createConnectorFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to create connector" })
               )
            )

         )

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

            mergeMap(
               connector => of(
                  slice.actions.updateConnectorSuccess({ connector: transformConnectorDTOToModel(connector) }),
                  appRedirectActions.redirect({ url: `../../detail/${connector.uuid}` })
               )
            ),

            catchError(
               error => of(
                  slice.actions.updateConnectorFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to update connector" })
               )
            )

         )

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

            mergeMap(
               () => of(slice.actions.deleteConnectorSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" }))
            ),

            catchError(
               error => of(
                  slice.actions.deleteConnectorFailure({ error: extractError(error, "Failed to delete connector") }),
                  appRedirectActions.fetchError({ error, message: "Failed to delete connector" })
               )
            )

         )

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
               error => of(
                  slice.actions.bulkDeleteConnectorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to delete connector" })
               )
            )

         )

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
            action.payload.authAttributes?.map(transformAttributeModelToDTO),
            action.payload.uuid
         ).pipe(

            map(
               connection => slice.actions.connectConnectorSuccess({
                  connectionDetails: connection.map(connection => transformFunctionGroupDTOtoModel(connection.functionGroup))
               })
            ),

            catchError(
               error => of(
                  slice.actions.connectConnectorFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to connect to connector" })
               )
            )

         )

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

            mergeMap(
               connection => of(
                  slice.actions.reconnectConnectorSuccess({
                     uuid: action.payload.uuid,
                     functionGroups: connection.map(connection => transformFunctionGroupDTOtoModel(connection.functionGroup))
                  }),
                  slice.actions.getConnectorHealth({ uuid: action.payload.uuid })
               )
            ),

            catchError(
               error => of(
                  slice.actions.reconnectConnectorFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to reconnect to connector" })
               )
            )

         )

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
               error => of(
                  slice.actions.bulkReconnectConnectorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to bulk reconnect to connectors" })
               )
            )

         )

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

            mergeMap(
               () => of(
                  slice.actions.authorizeConnectorSuccess({ uuid: action.payload.uuid }),
                  slice.actions.getConnectorDetail({ uuid: action.payload.uuid }),
                  slice.actions.getConnectorHealth({ uuid: action.payload.uuid })
               )
            ),

            catchError(
               error => of(
                  slice.actions.authorizeConnectorFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to authorize connector" })
               )
            )

         )

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

            mergeMap(
               () => of(slice.actions.bulkAuthorizeConnectorsSuccess({ uuids: action.payload.uuids }),
                  slice.actions.listConnectors())
            ),

            catchError(
               error => of(
                  slice.actions.bulkAuthorizeConnectorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to bulk authorize connectors" })
               )
            )

         )

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

            mergeMap(

               () => iif(

                  () => !!action.payload.successRedirect,
                  of(
                     slice.actions.bulkForceDeleteConnectorsSuccess({ uuids: action.payload.uuids, successRedirect: action.payload.successRedirect }),
                     appRedirectActions.redirect({ url: action.payload.successRedirect! })
                  ),
                  of(
                     slice.actions.bulkForceDeleteConnectorsSuccess({ uuids: action.payload.uuids, successRedirect: action.payload.successRedirect })
                  )

               ),

            ),

            catchError(
               error => of(
                  slice.actions.bulkForceDeleteConnectorsFailure(),
                  appRedirectActions.fetchError({ error, message: "Failed to force delete connectors" })
               )
            )

   )

      )

   )

}


const callback: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.callback.match
      ),
      mergeMap(

         action => deps.apiClients.connectors.callback(

            action.payload.url,
            transformAttributeCallbackDataModelToDto(action.payload.callbackData)

         ).pipe(

            map(
               data => {
                  return slice.actions.callbackSuccess({ callbackId: action.payload.callbackId, data })
               }
            ),

            catchError(
               error => of(
                  slice.actions.callbackFailure({ callbackId: action.payload.callbackId }),
                  appRedirectActions.fetchError({ error, message: "Connector callback failure" })
               )
            )

         )

      ),

      catchError(
         error => of(
            slice.actions.callbackFailure({ callbackId: "" }),
            appRedirectActions.fetchError({ error, message: "Failed to perform connector callback" })
         )
      )

   )

}

const epics = [
   listConnectors,
   getConnectorDetail,
   getConnectorAttributesDescriptors,
   getConnectorAllAttributesDescriptors,
   getConnectorHealth,
   createConnector,
   updateConnector,
   deleteConnector,
   bulkDeleteConnectors,
   connectConnector,
   reconnectConnector,
   bulkReconnectConnectors,
   authorizeConnector,
   bulkAuthorizeConnectors,
   bulkForceDeleteConnectors,
   callback,
];


export default epics;