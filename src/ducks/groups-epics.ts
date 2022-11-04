import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";
import { AppEpic } from "ducks";

import { slice } from "./groups";
import { actions as appRedirectActions } from "./app-redirect";

import { transformGroupDtoToModel } from "./transform/groups";


const listGroups: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listGroups.match
      ),
      switchMap(

         () => deps.apiClients.groups.getGroupsList().pipe(

            map(
               list => slice.actions.listGroupsSuccess({
                  groups: list.map(transformGroupDtoToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.listGroupsFailure({ error: extractError(err, "Failed to get Group list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Group list" })
               )
            )
         )
      )
   );

}


const getGroupDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getGroupDetail.match
      ),
      switchMap(

         action => deps.apiClients.groups.getGroupDetail(action.payload.uuid).pipe(

            map(
               groupDto => slice.actions.getGroupDetailSuccess({
                  group: transformGroupDtoToModel(groupDto)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getGroupDetailFailure({ error: extractError(err, "Failed to get Group detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get Group detail" })
               )
            )

         )
      )

   );

}


const createGroup: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createGroup.match
      ),

      switchMap(

         action => deps.apiClients.groups.createNewGroup(
            action.payload.name,
            action.payload.description
         ).pipe(

            mergeMap(

               obj => of(
                  slice.actions.createGroupSuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `./detail/${obj.uuid}` })
               )

            ),

            catchError(

               err => of(
                  slice.actions.createGroupFailure({ error: extractError(err, "Failed to create group") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create group" })
               )

            )
         )
      )

   );

}



const updateGroup: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateGroup.match
      ),
      switchMap(

         action => deps.apiClients.groups.updateGroup(
            action.payload.groupUuid,
            action.payload.name,
            action.payload.description || ""
         ).pipe(

            mergeMap(

               groupDTO => of(
                  slice.actions.updateGroupSuccess({ group: transformGroupDtoToModel(groupDTO) }),
                  appRedirectActions.redirect({ url: `../../detail/${groupDTO.uuid}` })
               )

            ),

            catchError(

               err => of(
                  slice.actions.updateGroupFailure({ error: extractError(err, "Failed to update group") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update group" })
               )

            )

         )

      )

   );

}


const deleteGroup: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteGroup.match
      ),
      switchMap(

         action => deps.apiClients.groups.deleteGroup(action.payload.uuid).pipe(

            mergeMap(

               () => of(
                  slice.actions.deleteGroupSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../" })
               )

            ),

            catchError(

               err => of(
                  slice.actions.deleteGroupFailure({ error: extractError(err, "Failed to delete group") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete group" })
               )

            )

         )

      )

   );

}


const bulkDeleteProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteGroups.match
      ),
      switchMap(

         action => deps.apiClients.groups.bulkDeleteGroup(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteGroupsSuccess({ uuids: action.payload.uuids })
            ),

            catchError(

               err => of(
                  slice.actions.bulkDeleteGroupsFailure({ error: extractError(err, "Failed to delete groups") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete groups" })
               )

            )

         )
      )

   );

}


const epics = [
   listGroups,
   getGroupDetail,
   createGroup,
   updateGroup,
   deleteGroup,
   bulkDeleteProfiles,
];


export default epics;