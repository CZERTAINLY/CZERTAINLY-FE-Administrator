import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./compliance-profiles";
import history from "browser-history";
import { transformComplianceConnectorGroupDTOToModel, transformComplianceConnectorRuleDTOToModel, transformComplianceProfileDtoToModel, transformComplianceProfileListDtoToModel, transformComplianceRuleDTOToModel } from "./transform/compliance-profiles";


const listComplianceProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listComplianceProfiles.match
      ),
      switchMap(

         () => deps.apiClients.complianceProfile.getComplianceProfileList().pipe(

            map(
               complianceProfiles => slice.actions.listComplianceProfilesSuccess(
                  { complianceProfileList: complianceProfiles.map(transformComplianceProfileListDtoToModel) }
               )
            ),

            catchError(
               err => of(slice.actions.listComplianceProfilesFailed({ error: extractError(err, "Failed to get Compliance Profiles list") }))

            )

         )

      )

   );

}


const listComplianceProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listComplianceProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const getComplianceProfileDetail: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getComplianceProfile.match
      ),

      switchMap(

         action => deps.apiClients.complianceProfile.getComplianceProfileDetail(action.payload.uuid).pipe(

            map(
               detail => slice.actions.getComplianceProfileSuccess({ complianceProfile: transformComplianceProfileDtoToModel(detail) })
            ),

            catchError(
               err => of(slice.actions.getComplianceProfileFailed({ error: extractError(err, "Failed to get Compliance Profile details") }))
            )

         )

      )

   );

}


const getComplianceProfileDetailFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getComplianceProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const createComplianceProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createComplianceProfile.match
      ),

      switchMap(

         action => deps.apiClients.complianceProfile.createComplianceProfile(
            action.payload.name,
            action.payload.description
         ).pipe(

            map(
               obj => slice.actions.createComplianceProfileSuccess({ uuid: obj.uuid }),
            ),

            catchError(
               err => of(slice.actions.createComplianceProfileFailed({ error: extractError(err, "Failed to create Compliance Profile") }))
            )


         )

      )

   )

}


const createComplianceProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createComplianceProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )
   );
}


const createComplianceProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createComplianceProfileSuccess.match
      ),
      switchMap(

         action => {
            history.push(`./detail/${action.payload.uuid}`);
            return EMPTY;
         }

      )

   )

}


const deleteComplianceProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteComplianceProfile.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.deleteComplianceProfile(action.payload.uuid).pipe(

            map(
               () => slice.actions.deleteComplianceProfileSuccess({ uuid: action.payload.uuid })
            ),

            catchError(
               err => of(slice.actions.deleteComplianceProfileFailed({ error: extractError(err, "Failed to delete Compliance Profile") }))
            )

         )

      )

   );

}


const deleteComplianceProfileSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteComplianceProfileSuccess.match
      ),
      switchMap(

         () => {
            history.push(`../`);
            return EMPTY;
         }

      )

   )

}

const deleteComplianceProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteComplianceProfileFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const bulkDeleteComplianceProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteComplianceProfiles.match
      ),

      switchMap(

         action => deps.apiClients.complianceProfile.bulkDeleteComplianceProfiles(action.payload.uuids).pipe(

            map(
               errors => slice.actions.bulkDeleteComplianceProfilesSuccess({ uuids: action.payload.uuids, errors })
            ),

            catchError(
               err => of(slice.actions.bulkDeleteComplianceProfilesFailed({ error: extractError(err, "Failed to delete Compliance Accounts") }))
            )

         )

      )

   )

}


const bulkDeleteComplianceProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteComplianceProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const bulkForceDeleteComplianceProfiles: AppEpic = (action$, state$, deps) => {


   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteComplianceProfiles.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.bulkForceDeleteComplianceProfiles(action.payload.uuids).pipe(

            map(
               () => slice.actions.bulkForceDeleteComplianceProfilesSuccess({ uuids: action.payload.uuids, redirect: action.payload.redirect })
            ),

            catchError(
               err => of(slice.actions.bulkForceDeleteComplianceProfilesFailed({ error: extractError(err, "Failed to delete Compliance Accounts") }))
            )

         )

      )

   );

}


const bulkForceDeleteComplianceProfilesSuccess: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteComplianceProfilesSuccess.match
      ),
      switchMap(
         action => {
            if (action.payload.redirect) history.push(action.payload.redirect);
            return EMPTY;
         }

      )

   )

}

const bulkForceDeleteComplianceProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkForceDeleteComplianceProfilesFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );

}


const addRule: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addRule.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.addRuleToComplianceProfile(
            action.payload.uuid,
            action.payload.connectorUuid,
            action.payload.kind,
            action.payload.ruleUuid,
            action.payload.attributes
         ).pipe(

            map(
               rule => slice.actions.addRuleSuccess({
                  connectorUuid: action.payload.connectorUuid,
                  connectorName: action.payload.connectorName,
                  kind: action.payload.kind,
                  rule: transformComplianceRuleDTOToModel(rule)
               })
            ),

            catchError(
               err => of(slice.actions.addRuleFailed({ error: extractError(err, "Failed to add rule to Compliance Profile") }))
            )

         )

      )

   )
}


const addRuleFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addRuleFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const addGroup: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.addGroup.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.addGroupToComplianceProfile(
            action.payload.uuid,
            action.payload.connectorUuid,
            action.payload.kind,
            action.payload.groupUuid,
         ).pipe(

            map(
               () => slice.actions.addGroupSuccess({
                  uuid: action.payload.uuid,
                  connectorUuid: action.payload.connectorUuid,
                  kind: action.payload.kind,
                  groupUuid: action.payload.groupUuid,
                  connectorName: action.payload.connectorName,
                  groupName: action.payload.groupName,
                  description: action.payload.description
               })
            ),

            catchError(
               err => of(slice.actions.addGroupFailed({ error: extractError(err, "Failed to add group to Compliance Profile") }))
            )

         )

      )

   )
}


const addGroupFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(
      filter(
         slice.actions.addGroupFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const deleteRule: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteRule.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.deleteRuleFromComplianceProfile(
            action.payload.uuid,
            action.payload.connectorUuid,
            action.payload.kind,
            action.payload.ruleUuid
         ).pipe(

            map(
               () => slice.actions.deleteRuleSuccess({ connectorUuid: action.payload.connectorUuid, kind: action.payload.kind, ruleUuid: action.payload.ruleUuid })
            ),
            catchError(
               err => of(slice.actions.deleteRuleFailed({ error: extractError(err, "Failed to delete rule from Compliance Profile") }))
            )

         )

      )

   )
}


const deleteRuleFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteRuleFailed.match
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

         action => deps.apiClients.complianceProfile.deleteGroupFromComplianceProfile(
            action.payload.uuid,
            action.payload.connectorUuid,
            action.payload.kind,
            action.payload.groupUuid
         ).pipe(

            map(
               () => slice.actions.deleteGroupSuccess({ connectorUuid: action.payload.connectorUuid, kind: action.payload.kind, groupUuid: action.payload.groupUuid })
            ),

            catchError(
               err => of(slice.actions.deleteGroupFailed({ error: extractError(err, "Failed to delete group from Compliance Profile") }))
            )

         )

      )

   )
}


const deleteGroupFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteGroupFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const associateRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.associateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.associateComplianceProfileToRaProfile(
            action.payload.uuid,
            action.payload.raProfileUuids.map((raProfile) => (raProfile.uuid))
         ).pipe(

            map(
               () => slice.actions.associateRaProfileSuccess({ uuid: action.payload.uuid, raProfileUuids: action.payload.raProfileUuids })
            ),

            catchError(
               err => of(slice.actions.associateRaProfileFailed({ error: extractError(err, "Failed to associate RA Profile to Compliance Profile") }))
            )

         )

      )

   )
}


const associateRaProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.associateRaProfileFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const dissociateRaProfile: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.dissociateRaProfile.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.dissociateComplianceProfileFromRaProfile(
            action.payload.uuid,
            action.payload.raProfileUuids
         ).pipe(

            map(
               () => slice.actions.dissociateRaProfileSuccess({ uuid: action.payload.uuid, raProfileUuids: action.payload.raProfileUuids })
            ),

            catchError(
               err => of(slice.actions.dissociateRaProfileFailed({ error: extractError(err, "Failed to dissociate RA Profile from Compliance Profile") }))
            )

         )

      )

   )
}


const dissociateRaProfileFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.dissociateRaProfileFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const getAssociatedRaProfiles: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAssociatedRaProfiles.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.getAssociatedRaProfiles(
            action.payload.uuid
         ).pipe(

            map(
               (raProfiles) => slice.actions.getAssociatedRaProfilesSuccess({ raProfiles: raProfiles })
            ),

            catchError(
               err => of(slice.actions.getAssociatedRaProfilesFailed({ error: extractError(err, "Failed to get associated RA Profiles") }))
            )

         )

      )

   )
}


const getAssociatedRaProfilesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getAssociatedRaProfilesFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const getRules: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listComplianceRules.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.getComplianceProfileRules()
            .pipe(

               map(
                  (rules) => slice.actions.listComplianceRulesSuccess(rules.map(transformComplianceConnectorRuleDTOToModel))
               ),

               catchError(
                  err => of(slice.actions.listComplianceRulesFailed({ error: extractError(err, "Failed to get compliance rules") }))
               )

            )

      )

   )
}


const getRulesFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listComplianceRulesFailed.match
      ),
      map(

         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const getGroups: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listComplianceGroups.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.getComplianceProfileGroups()
            .pipe(

               map(
                  (groups) => slice.actions.listComplianceGroupsSuccess(groups.map(transformComplianceConnectorGroupDTOToModel))
               ),

               catchError(
                  err => of(slice.actions.listComplianceGroupsFailed({ error: extractError(err, "Failed to get compliance groups") }))
               )

            )

      )

   )
}


const getGroupsFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listComplianceGroupsFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const checkCompliance: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkCompliance.match
      ),
      switchMap(

         action => deps.apiClients.complianceProfile.checkCompliance(
            action.payload.uuids
         ).pipe(

            map(
               () => slice.actions.checkComplianceSuccess()
            ),

            catchError(
               err => of(slice.actions.checkComplianceFailed({ error: extractError(err, "Failed to check compliance") }))

            )

         )

      )

   )
}


const checkComplianceFailed: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkComplianceFailed.match
      ),
      map(
         action => alertActions.error(action.payload.error || "Unexpected error occurred")
      )

   );
}


const checkComplianceSuccess: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.checkComplianceSuccess.match
      ),
      map(
         action => alertActions.success("Compliance Check for the certificates initiated")
      )

   );
}


const epics = [
   listComplianceProfiles,
   listComplianceProfilesFailed,
   getComplianceProfileDetail,
   getComplianceProfileDetailFailed,
   createComplianceProfile,
   createComplianceProfileFailed,
   createComplianceProfileSuccess,
   deleteComplianceProfile,
   deleteComplianceProfileSuccess,
   deleteComplianceProfileFailed,
   bulkDeleteComplianceProfiles,
   bulkDeleteComplianceProfilesFailed,
   bulkForceDeleteComplianceProfiles,
   bulkForceDeleteComplianceProfilesSuccess,
   bulkForceDeleteComplianceProfilesFailed,
   addRule,
   addRuleFailed,
   deleteRule,
   deleteRuleFailed,
   addGroup,
   addGroupFailed,
   deleteGroup,
   deleteGroupFailed,
   associateRaProfile,
   associateRaProfileFailed,
   dissociateRaProfile,
   dissociateRaProfileFailed,
   getAssociatedRaProfiles,
   getAssociatedRaProfilesFailed,
   getRules,
   getRulesFailed,
   getGroups,
   getGroupsFailed,
   checkCompliance,
   checkComplianceSuccess,
   checkComplianceFailed

];


export default epics;
