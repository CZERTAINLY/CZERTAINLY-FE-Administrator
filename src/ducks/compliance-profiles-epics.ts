import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { RaProfileSimplifiedModel } from 'types/certificate';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './compliance-profiles';
import {
    transformComplianceProfileGroupListResponseDtoToModel,
    transformComplianceProfileGroupRequestModelToDto,
    transformComplianceProfileListModelToDto,
    transformComplianceProfileRequestModelToDto,
    transformComplianceProfileResponseDtoToModel,
    transformComplianceProfileRuleAddRequestModelToDto,
    transformComplianceProfileRuleAddResponseDtoToModel,
    transformComplianceProfileRuleDeleteRequestModelToDto,
    transformComplianceProfileRuleListResponseDtoToModel,
} from './transform/compliance-profiles';

const listComplianceProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listComplianceProfiles.match),
        switchMap(() =>
            deps.apiClients.complianceProfile.listComplianceProfiles().pipe(
                switchMap((complianceProfiles) =>
                    of(
                        slice.actions.listComplianceProfilesSuccess({
                            complianceProfileList: complianceProfiles.map(transformComplianceProfileListModelToDto),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfComplianceProfiles),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listComplianceProfilesFailed({
                            error: extractError(error, 'Failed to get Compliance Profiles list'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfComplianceProfiles),
                    ),
                ),
            ),
        ),
    );
};

const getComplianceProfileDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getComplianceProfile.match),

        switchMap((action) =>
            deps.apiClients.complianceProfile.getComplianceProfile({ uuid: action.payload.uuid }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getComplianceProfileSuccess({
                            complianceProfile: transformComplianceProfileResponseDtoToModel(detail),
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
            deps.apiClients.complianceProfile
                .createComplianceProfile({ complianceProfileRequestDto: transformComplianceProfileRequestModelToDto(action.payload) })
                .pipe(
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
            deps.apiClients.complianceProfile.deleteComplianceProfile({ uuid: action.payload.uuid }).pipe(
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
            deps.apiClients.complianceProfile.bulkDeleteComplianceProfiles({ requestBody: action.payload.uuids }).pipe(
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
            deps.apiClients.complianceProfile.forceDeleteComplianceProfiles({ requestBody: action.payload.uuids }).pipe(
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

const addRule: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.addRule.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .addRule({
                    uuid: action.payload.uuid,
                    complianceRuleAdditionRequestDto: transformComplianceProfileRuleAddRequestModelToDto(action.payload.addRequest),
                })
                .pipe(
                    map((rule) => {
                        const ruleModel = transformComplianceProfileRuleAddResponseDtoToModel(rule);
                        return slice.actions.addRuleSuccess({
                            connectorUuid: action.payload.addRequest.connectorUuid,
                            connectorName: ruleModel.connectorName,
                            kind: action.payload.addRequest.kind,
                            rule: ruleModel,
                        });
                    }),

                    catchError((error) =>
                        of(
                            slice.actions.addRuleFailed({ error: extractError(error, 'Failed to add rule to Compliance Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to add rule to Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const addGroup: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.addGroup.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .addGroup({
                    uuid: action.payload.uuid,
                    complianceGroupRequestDto: transformComplianceProfileGroupRequestModelToDto(action.payload.addRequest),
                })
                .pipe(
                    map(() =>
                        slice.actions.addGroupSuccess({
                            uuid: action.payload.uuid,
                            connectorUuid: action.payload.connectorUuid,
                            kind: action.payload.kind,
                            groupUuid: action.payload.groupUuid,
                            connectorName: action.payload.connectorName,
                            groupName: action.payload.groupName,
                            description: action.payload.description,
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.addGroupFailed({ error: extractError(error, 'Failed to add group to Compliance Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to add group to Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteRule: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteRule.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .removeRule({
                    uuid: action.payload.uuid,
                    complianceRuleDeletionRequestDto: transformComplianceProfileRuleDeleteRequestModelToDto(action.payload.deleteRequest),
                })
                .pipe(
                    map(() =>
                        slice.actions.deleteRuleSuccess({
                            connectorUuid: action.payload.deleteRequest.connectorUuid,
                            kind: action.payload.deleteRequest.kind,
                            ruleUuid: action.payload.deleteRequest.ruleUuid,
                        }),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.deleteRuleFailed({ error: extractError(error, 'Failed to delete rule from Compliance Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to delete rule from Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteGroup: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteGroup.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .removeGroup({
                    uuid: action.payload.uuid,
                    complianceGroupRequestDto: transformComplianceProfileGroupRequestModelToDto(action.payload.deleteRequest),
                })
                .pipe(
                    map(() =>
                        slice.actions.deleteGroupSuccess({
                            connectorUuid: action.payload.deleteRequest.connectorUuid,
                            kind: action.payload.deleteRequest.kind,
                            groupUuid: action.payload.deleteRequest.groupUuid,
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.deleteGroupFailed({
                                error: extractError(error, 'Failed to delete group from Compliance Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to delete group from Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const associateRaProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.associateRaProfile.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .associateProfiles({
                    uuid: action.payload.uuid,
                    raProfileAssociationRequestDto: {
                        raProfileUuids: action.payload.raProfileUuids.map((raProfile: RaProfileSimplifiedModel) => raProfile.uuid),
                    },
                })
                .pipe(
                    map(() =>
                        slice.actions.associateRaProfileSuccess({
                            uuid: action.payload.uuid,
                            raProfileUuids: action.payload.raProfileUuids,
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.associateRaProfileFailed({
                                error: extractError(error, 'Failed to associate RA Profile to Compliance Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to associate RA Profile to Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const dissociateRaProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.dissociateRaProfile.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile
                .disassociateProfiles({
                    uuid: action.payload.uuid,
                    raProfileAssociationRequestDto: { raProfileUuids: action.payload.raProfileUuids },
                })
                .pipe(
                    map(() =>
                        slice.actions.dissociateRaProfileSuccess({
                            uuid: action.payload.uuid,
                            raProfileUuids: action.payload.raProfileUuids,
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.dissociateRaProfileFailed({
                                error: extractError(error, 'Failed to dissociate RA Profile from Compliance Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to dissociate RA Profile from Compliance Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const getAssociatedRaProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAssociatedRaProfiles.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.getAssociatedRAProfiles({ uuid: action.payload.uuid }).pipe(
                map((raProfiles) => slice.actions.getAssociatedRaProfilesSuccess({ raProfiles: raProfiles })),

                catchError((error) =>
                    of(
                        slice.actions.getAssociatedRaProfilesFailed({ error: extractError(error, 'Failed to get associated RA Profiles') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get associated RA Profiles' }),
                    ),
                ),
            ),
        ),
    );
};

const getRules: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listComplianceRules.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.getComplianceRules({}).pipe(
                map((rules) => slice.actions.listComplianceRulesSuccess(rules.map(transformComplianceProfileRuleListResponseDtoToModel))),

                catchError((error) =>
                    of(
                        slice.actions.listComplianceRulesFailed({ error: extractError(error, 'Failed to get compliance rules') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ComplianceProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const getGroups: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listComplianceGroups.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.getComplianceGroups({}).pipe(
                map((groups) =>
                    slice.actions.listComplianceGroupsSuccess(groups.map(transformComplianceProfileGroupListResponseDtoToModel)),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listComplianceGroupsFailed({ error: extractError(error, 'Failed to get compliance groups') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ComplianceProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const checkCompliance: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.checkCompliance.match),
        switchMap((action) =>
            deps.apiClients.complianceProfile.checkCompliance({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(slice.actions.checkComplianceSuccess(), alertActions.success('Compliance Check for the certificates initiated')),
                ),

                catchError((error) =>
                    of(
                        slice.actions.checkComplianceFailed({ error: extractError(error, 'Failed to check compliance') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to check compliance' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listComplianceProfiles,
    getComplianceProfileDetail,
    createComplianceProfile,
    deleteComplianceProfile,
    bulkDeleteComplianceProfiles,
    bulkForceDeleteComplianceProfiles,
    addRule,
    deleteRule,
    addGroup,
    deleteGroup,
    associateRaProfile,
    dissociateRaProfile,
    getAssociatedRaProfiles,
    getRules,
    getGroups,
    checkCompliance,
];

export default epics;
