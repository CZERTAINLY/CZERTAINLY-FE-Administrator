import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";
import { actions as alertActions } from "./alerts";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./certificateGroups";

import { transformCertificateGroupRequestModelToDto, transformCertificateGroupResponseDtoToModel } from "./transform/certificateGroups";

const listGroups: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listGroups.match
      ),
      switchMap(

         () => deps.apiClients.certificateGroups.listGroups().pipe(

            map(
               list => slice.actions.listGroupsSuccess({
                  groups: list.map(transformCertificateGroupResponseDtoToModel)
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

         action => deps.apiClients.certificateGroups.getGroup({ uuid: action.payload.uuid }).pipe(

            map(
               groupDto => slice.actions.getGroupDetailSuccess({
                  group: transformCertificateGroupResponseDtoToModel(groupDto)
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

         action => deps.apiClients.certificateGroups.createGroup({ groupRequestDto: transformCertificateGroupRequestModelToDto(action.payload) }
         ).pipe(

            mergeMap(

               obj => of(
                  slice.actions.createGroupSuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${obj.uuid}` })
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

         action => deps.apiClients.certificateGroups.editGroup({ uuid: action.payload.groupUuid, groupRequestDto: transformCertificateGroupRequestModelToDto(action.payload.editGroupRequest) }
         ).pipe(

            mergeMap(

               groupDTO => of(
                  slice.actions.updateGroupSuccess({ group: transformCertificateGroupResponseDtoToModel(groupDTO) }),
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

         action => deps.apiClients.certificateGroups.deleteGroup({ uuid: action.payload.uuid }).pipe(

            mergeMap(

               () => of(
                  slice.actions.deleteGroupSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
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

         action => deps.apiClients.certificateGroups.bulkDeleteGroup({ requestBody: action.payload.uuids }).pipe(

             mergeMap(
                 () => of(
                    slice.actions.bulkDeleteGroupsSuccess({ uuids: action.payload.uuids }),
                     alertActions.success("Selected groups successfully deleted.")
                 )
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