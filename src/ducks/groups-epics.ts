import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./groups";
import history from "browser-history";
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
               err => of(slice.actions.listGroupsFailure({ error: extractError(err, "Failed to get Group list") }))
            )
         )
      )
   );

}


const listGroupsFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listGroupsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.getGroupDetailFailure({ error: extractError(err, "Failed to get Group detail") }))
            )

         )
      )

   );

}


const getGroupDetailFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getGroupDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               obj => slice.actions.createGroupSuccess({ uuid: obj.uuid })
            ),

            catchError(
               err => of(slice.actions.createGroupFailure({ error: extractError(err, "Failed to create group") }))
            )
         )
      )

   );

}


const createGroupSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createGroupSuccess.match
      ),

      switchMap(

         action => {
            history.push(`./detail/${action.payload.uuid}`);
            return EMPTY;
         }

      )

   )

}


const createGroupFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createGroupFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               groupDTO => slice.actions.updateGroupSuccess({ group: transformGroupDtoToModel(groupDTO) })
            ),

            catchError(
               err => of(slice.actions.updateGroupFailure({ error: extractError(err, "Failed to update group") }))
            )

         )

      )

   );

}


const updateGroupSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateGroupSuccess.match
      ),

      switchMap(

         action => {
            history.push(`../detail/${action.payload.group.uuid}`);
            return EMPTY;
         }

      )

   )

}


const updateGroupFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateGroupFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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

            map(
               () => slice.actions.deleteGroupSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteGroupFailure({ error: extractError(err, "Failed to delete group") }))
            )

         )

      )

   );

}


const deleteGroupSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteGroupSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}


const deleteGroupFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteGroupFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
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
               err => of(slice.actions.bulkDeleteGroupsFailure({ error: extractError(err, "Failed to delete groups") }))
            )

         )
      )

   );

}


const bulkDeleteProfilesFailure: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteGroupsFailure.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const epics = [
   listGroups,
   listGroupsFailure,
   getGroupDetail,
   getGroupDetailFailure,
   createGroup,
   createGroupFailure,
   createGroupSuccess,
   updateGroup,
   updateGroupSuccess,
   updateGroupFailure,
   deleteGroup,
   deleteGroupSuccess,
   deleteGroupFailure,
   bulkDeleteProfiles,
   bulkDeleteProfilesFailure
];


export default epics;