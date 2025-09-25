import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './compliance-profiles';

const getComplianceProfileDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getComplianceProfile.match),

        switchMap((action) =>
            deps.apiClients.complianceProfile.getComplianceProfileV2({ uuid: action.payload.uuid }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getComplianceProfileSuccess({
                            complianceProfile: detail,
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ComplianceProfileDetails),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getComplianceProfileFailed({
                            error: extractError(error, 'Failed to get Compliance Profile details'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ComplianceProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const createComplianceProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createComplianceProfile.match),

        switchMap((action) =>
            deps.apiClients.complianceProfile.createComplianceProfileV2({ complianceProfileRequestDtoV2: action.payload }).pipe(
                mergeMap((obj) =>
                    of(
                        slice.actions.createComplianceProfileSuccess({ uuid: obj.uuid }),
                        appRedirectActions.redirect({ url: `../complianceprofiles/detail/${obj.uuid}` }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.createComplianceProfileFailed({
                            error: extractError(error, 'Failed to create Compliance Profile'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to create Compliance Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const deleteComplianceProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteComplianceProfile.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.deleteComplianceProfileV2({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteComplianceProfileSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../complianceprofiles' }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.deleteComplianceProfileFailed({ error: extractError(error, 'Failed to delete Compliance Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Compliance Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteComplianceProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteComplianceProfiles.match),

        switchMap((action) =>
            deps.apiClients.complianceProfile.bulkDeleteComplianceProfilesV2({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) =>
                    of(
                        slice.actions.bulkDeleteComplianceProfilesSuccess({ uuids: action.payload.uuids, errors }),
                        alertActions.success('Selected compliance profiles successfully deleted.'),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkDeleteComplianceProfilesFailed({
                            error: extractError(error, 'Failed to delete Compliance Accounts'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Compliance Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkForceDeleteComplianceProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteComplianceProfiles.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.forceDeleteComplianceProfilesV2({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    iif(
                        () => !!action.payload.redirect,
                        of(
                            slice.actions.bulkForceDeleteComplianceProfilesSuccess({
                                uuids: action.payload.uuids,
                                redirect: action.payload.redirect,
                            }),
                            appRedirectActions.redirect({ url: action.payload.redirect! }),
                        ),
                        of(
                            slice.actions.bulkForceDeleteComplianceProfilesSuccess({
                                uuids: action.payload.uuids,
                                redirect: action.payload.redirect,
                            }),
                        ),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkForceDeleteComplianceProfilesFailed({
                            error: extractError(error, 'Failed to delete Compliance Accounts'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Compliance Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const getListComplianceProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getListComplianceProfiles.match),
        switchMap(() =>
            deps.apiClients.complianceProfile.listComplianceProfilesV2().pipe(
                switchMap((complianceProfiles) =>
                    of(
                        slice.actions.getListComplianceProfilesSuccess({
                            complianceProfileList: complianceProfiles,
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfComplianceProfiles),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getListComplianceProfilesFailed({
                            error: extractError(error, 'Failed to get Compliance Profiles list'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfComplianceProfiles),
                    ),
                ),
            ),
        ),
    );
};

const associateComplianceProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.associateComplianceProfile.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .associateComplianceProfileV2({
                    uuid: action.payload.uuid,
                    resource: action.payload.resource,
                    associationObjectUuid: action.payload.associationObjectUuid,
                })
                .pipe(
                    map(() =>
                        slice.actions.associateComplianceProfileSuccess({
                            uuid: action.payload.uuid,
                            resource: action.payload.resource,
                            associationObjectUuid: action.payload.associationObjectUuid,
                            associationObjectName: action.payload.associationObjectName,
                        }),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.associateComplianceProfileFailed({
                                error: extractError(error, 'Failed to associate Compliance Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to associate Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const dissociateComplianceProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.dissociateComplianceProfile.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .disassociateComplianceProfileV2({
                    uuid: action.payload.uuid,
                    resource: action.payload.resource,
                    associationObjectUuid: action.payload.associationObjectUuid,
                })
                .pipe(
                    map(() =>
                        slice.actions.dissociateComplianceProfileSuccess({
                            uuid: action.payload.uuid,
                            resource: action.payload.resource,
                            associationObjectUuid: action.payload.associationObjectUuid,
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.dissociateComplianceProfileFailed({
                                error: extractError(error, 'Failed to dissociate Compliance Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to dissociate Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const getAssociatedComplianceProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAssociatedComplianceProfiles.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .getAssociatedComplianceProfilesV2({
                    resource: action.payload.resource,
                    associationObjectUuid: action.payload.associationObjectUuid,
                })
                .pipe(
                    map((complianceProfiles) => slice.actions.getAssociatedComplianceProfilesSuccess({ complianceProfiles })),

                    catchError((error) =>
                        of(
                            slice.actions.getAssociatedComplianceProfilesFailed({
                                error: extractError(error, 'Failed to get associated Compliance Profiles'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to get associated Compliance Profiles' }),
                            userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ComplianceProfileAssociations),
                        ),
                    ),
                ),
        ),
    );
};

const getComplianceRules: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getListComplianceRules.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .getComplianceRulesV2({
                    resource: action.payload.resource,
                    connectorUuid: action.payload.connectorUuid,
                    kind: action.payload.kind,
                    type: action.payload.type,
                    format: action.payload.format,
                })
                .pipe(
                    map((rules) => slice.actions.getListComplianceRulesSuccess({ rules })),

                    catchError((error) =>
                        of(
                            slice.actions.getListComplianceRulesFailed({
                                error: extractError(error, 'Failed to get compliance rules'),
                            }),
                            userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfAvailableRulesAndGroups),
                        ),
                    ),
                ),
        ),
    );
};

const getComplianceGroups: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getListComplianceGroups.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .getComplianceGroupsV2({
                    connectorUuid: action.payload.connectorUuid,
                    kind: action.payload.kind,
                    resource: action.payload.resource,
                })
                .pipe(
                    map((groups) => slice.actions.getListComplianceGroupsSuccess({ groups })),
                    catchError((error) =>
                        of(
                            slice.actions.getListComplianceGroupsFailed({
                                error: extractError(error, 'Failed to get compliance groups'),
                            }),
                            userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfAvailableRulesAndGroups),
                        ),
                    ),
                ),
        ),
    );
};

const getComplianceGroupRules: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getListComplianceGroupRules.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .getComplianceGroupRulesV2({
                    groupUuid: action.payload.groupUuid,
                    connectorUuid: action.payload.connectorUuid,
                    kind: action.payload.kind,
                })
                .pipe(
                    map((rules) => slice.actions.getListComplianceGroupRulesSuccess({ rules })),
                    catchError((error) =>
                        of(
                            slice.actions.getListComplianceGroupRulesFailed({
                                error: extractError(error, 'Failed to get compliance group rules'),
                            }),
                        ),
                    ),
                ),
        ),
    );
};

const getAssociationsOfComplianceProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAssociationsOfComplianceProfile.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.getAssociationsV2({ uuid: action.payload.uuid }).pipe(
                map((associations) => slice.actions.getAssociationsOfComplianceProfileSuccess({ associations })),
                catchError((error) =>
                    of(
                        slice.actions.getAssociationsOfComplianceProfileFailed({
                            error: extractError(error, 'Failed to get associations of Compliance Profile'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ComplianceProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const checkComplianceForProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.checkComplianceForProfiles.match),
        switchMap((action) =>
            deps.apiClients.complianceManagement
                .checkComplianceV2({
                    requestBody: action.payload.requestBody,
                    resource: action.payload.resource,
                    type: action.payload.type,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.checkComplianceForProfilesSuccess(),
                            alertActions.success('Compliance Check for the certificates initiated'),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.checkComplianceForProfilesFailed({ error: extractError(error, 'Failed to check compliance') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to check compliance' }),
                        ),
                    ),
                ),
        ),
    );
};

const checkComplianceForResourceObjects: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.checkComplianceForResourceObjects.match),
        switchMap((action) =>
            deps.apiClients.complianceManagement
                .checkResourceObjectsComplianceV2({ resource: action.payload.resource, requestBody: action.payload.requestBody })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.checkComplianceForResourceObjectsSuccess(),
                            alertActions.success('Compliance Check for the certificates initiated'),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.checkComplianceForResourceObjectsFailed({
                                error: extractError(error, 'Failed to check compliance'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to check compliance' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateRule: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateRule.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .patchComplianceProfileRulesV2({
                    uuid: action.payload.uuid,
                    complianceProfileRulesPatchRequestDto: action.payload.complianceProfileRulesPatchRequestDto,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.updateRuleSuccess({ uuid: action.payload.uuid }),
                            slice.actions.getComplianceProfile({ uuid: action.payload.uuid }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.updateRuleFailed({
                                error: extractError(error, 'Failed to update rule in Compliance Profile'),
                            }),
                            appRedirectActions.fetchError({
                                error,
                                message: 'Failed to update rule in Compliance Profile',
                            }),
                        ),
                    ),
                ),
        ),
    );
};

const updateGroup: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateGroup.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .patchComplianceProfileGroupsV2({
                    uuid: action.payload.uuid,
                    complianceProfileGroupsPatchRequestDto: action.payload.complianceProfileGroupsPatchRequestDto,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.updateGroupSuccess({ uuid: action.payload.uuid }),
                            slice.actions.getComplianceProfile({ uuid: action.payload.uuid }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.updateGroupFailed({ error: extractError(error, 'Failed to update group in Compliance Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update group in Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const createComplianceInternalRule: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createComplianceInternalRule.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .createComplianceInternalRuleV2({
                    complianceInternalRuleRequestDto: action.payload.complianceInternalRuleRequestDto,
                })
                .pipe(
                    mergeMap(() => of(slice.actions.createComplianceInternalRuleSuccess(), slice.actions.getListComplianceRules({}))),
                    catchError((error) =>
                        of(
                            slice.actions.createComplianceInternalRuleFailed({
                                error: extractError(error, 'Failed to create compliance internal rule'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create compliance internal rule' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateComplienceInternalRule: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateComplienceInternalRule.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .updateComplianceInternalRuleV2({
                    internalRuleUuid: action.payload.internalRuleUuid,
                    complianceInternalRuleRequestDto: action.payload.complianceInternalRuleRequestDto,
                })
                .pipe(
                    mergeMap(() => of(slice.actions.updateComplienceInternalRuleSuccess(), slice.actions.getListComplianceRules({}))),
                    catchError((error) =>
                        of(
                            slice.actions.updateComplienceInternalRuleFailed({
                                error: extractError(error, 'Failed to update compliance internal rule'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update compliance internal rule' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteComplienceInternalRule: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteComplienceInternalRule.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.deleteComplianceInternalRuleV2({ internalRuleUuid: action.payload.internalRuleUuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteComplienceInternalRuleSuccess({
                            uuid: action.payload.internalRuleUuid,
                        }),
                        slice.actions.getListComplianceRules({}),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.deleteComplienceInternalRuleFailed({
                            error: extractError(error, 'Failed to delete compliance internal rule'),
                        }),
                        appRedirectActions.fetchError({
                            error,
                            message: 'Failed to delete compliance internal rule',
                        }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    getComplianceProfileDetail,
    getListComplianceProfiles,

    createComplianceProfile,
    deleteComplianceProfile,
    bulkDeleteComplianceProfiles,
    bulkForceDeleteComplianceProfiles,
    updateRule,
    updateGroup,
    associateComplianceProfile,
    dissociateComplianceProfile,
    getAssociatedComplianceProfiles,
    getComplianceRules,
    getComplianceGroups,
    getComplianceGroupRules,
    getAssociationsOfComplianceProfile,
    checkComplianceForProfiles,
    checkComplianceForResourceObjects,
    createComplianceInternalRule,
    updateComplienceInternalRule,
    deleteComplienceInternalRule,
];

export default epics;
