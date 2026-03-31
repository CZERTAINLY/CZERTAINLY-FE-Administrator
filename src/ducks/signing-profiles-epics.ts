import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { SearchRequestDto } from 'types/openapi';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './signing-profiles';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as userInterfaceActions } from './user-interface';

const listSigningProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSigningProfiles.match),
        switchMap(() => {
            const searchRequest: SearchRequestDto = { filters: [] };
            return deps.apiClients.signingProfiles.listSigningProfiles({ searchRequestDto: searchRequest }).pipe(
                switchMap((response) =>
                    of(
                        slice.actions.listSigningProfilesSuccess({
                            signingProfiles: response.items ?? [],
                            totalItems: response.totalItems ?? 0,
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSigningProfiles),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listSigningProfilesFailure({ error: extractError(error, 'Failed to get Signing Profiles list') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfSigningProfiles),
                    ),
                ),
            );
        }),
    );
};

const getSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getSigningProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.getSigningProfile({ uuid: action.payload.uuid, version: action.payload.version }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getSigningProfileSuccess({ signingProfile: detail }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.SigningProfileDetails),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getSigningProfileFailure({ error: extractError(error, 'Failed to get Signing Profile details') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get Signing Profile details' }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.SigningProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const listSigningProfileSearchableFields: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSigningProfileSearchableFields.match),
        switchMap(() =>
            deps.apiClients.signingProfiles.listSigningProfileSearchableFields().pipe(
                map((fields) => slice.actions.listSigningProfileSearchableFieldsSuccess({ searchableFields: fields })),
                catchError((error) =>
                    of(
                        slice.actions.listSigningProfileSearchableFieldsFailure({
                            error: extractError(error, 'Failed to get Signing Profile searchable fields'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const createSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createSigningProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles
                .createSigningProfile({ signingProfileRequestDto: action.payload.signingProfileRequestDto })
                .pipe(
                    mergeMap((created) =>
                        of(
                            slice.actions.createSigningProfileSuccess({ signingProfile: created }),
                            appRedirectActions.redirect({ url: `../signingprofiles/detail/${created.uuid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.createSigningProfileFailure({ error: extractError(error, 'Failed to create Signing Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create Signing Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateSigningProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles
                .updateSigningProfile({
                    uuid: action.payload.uuid,
                    signingProfileRequestDto: action.payload.signingProfileRequestDto,
                })
                .pipe(
                    mergeMap((updated) =>
                        of(
                            slice.actions.updateSigningProfileSuccess({ signingProfile: updated }),
                            appRedirectActions.redirect({ url: `../../signingprofiles/detail/${updated.uuid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.updateSigningProfileFailure({ error: extractError(error, 'Failed to update Signing Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update Signing Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteSigningProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.deleteSigningProfile({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteSigningProfileSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../signingprofiles' }),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.deleteSigningProfileFailure({ error: extractError(error, 'Failed to delete Signing Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Signing Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const enableSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableSigningProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.enableSigningProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableSigningProfileSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.enableSigningProfileFailure({ error: extractError(error, 'Failed to enable Signing Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable Signing Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const disableSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableSigningProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.disableSigningProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableSigningProfileSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.disableSigningProfileFailure({ error: extractError(error, 'Failed to disable Signing Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable Signing Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteSigningProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteSigningProfiles.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.bulkDeleteSigningProfiles({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) =>
                    of(
                        slice.actions.bulkDeleteSigningProfilesSuccess({ uuids: action.payload.uuids, errors }),
                        alertActions.success('Selected Signing Profiles successfully deleted.'),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.bulkDeleteSigningProfilesFailure({ error: extractError(error, 'Failed to delete Signing Profiles') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Signing Profiles' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableSigningProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableSigningProfiles.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.bulkEnableSigningProfiles({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableSigningProfilesSuccess({ uuids: action.payload.uuids })),
                catchError((error) =>
                    of(
                        slice.actions.bulkEnableSigningProfilesFailure({ error: extractError(error, 'Failed to enable Signing Profiles') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable Signing Profiles' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableSigningProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableSigningProfiles.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.bulkDisableSigningProfiles({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableSigningProfilesSuccess({ uuids: action.payload.uuids })),
                catchError((error) =>
                    of(
                        slice.actions.bulkDisableSigningProfilesFailure({
                            error: extractError(error, 'Failed to disable Signing Profiles'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable Signing Profiles' }),
                    ),
                ),
            ),
        ),
    );
};

const activateIlmSigningProtocol: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.activateIlmSigningProtocol.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles
                .activateIlmSigningProtocol({
                    signingProfileUuid: action.payload.signingProfileUuid,
                    ilmSigningProtocolConfigurationUuid: action.payload.ilmSigningProtocolConfigurationUuid,
                })
                .pipe(
                    map((details) => slice.actions.activateIlmSigningProtocolSuccess({ ilmActivationDetails: details })),
                    catchError((error) =>
                        of(
                            slice.actions.activateIlmSigningProtocolFailure({
                                error: extractError(error, 'Failed to activate ILM Signing Protocol'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to activate ILM Signing Protocol' }),
                        ),
                    ),
                ),
        ),
    );
};

const deactivateIlmSigningProtocol: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deactivateIlmSigningProtocol.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.deactivateIlmSigningProtocol({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.deactivateIlmSigningProtocolSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.deactivateIlmSigningProtocolFailure({
                            error: extractError(error, 'Failed to deactivate ILM Signing Protocol'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to deactivate ILM Signing Protocol' }),
                    ),
                ),
            ),
        ),
    );
};

const getIlmSigningProtocolActivationDetails: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getIlmSigningProtocolActivationDetails.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.getIlmSigningProtocolActivationDetails({ uuid: action.payload.uuid }).pipe(
                map((details) => slice.actions.getIlmSigningProtocolActivationDetailsSuccess({ ilmActivationDetails: details })),
                catchError((error) =>
                    of(
                        slice.actions.getIlmSigningProtocolActivationDetailsFailure({
                            error: extractError(error, 'Failed to get ILM Signing Protocol activation details'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const activateTsp: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.activateTsp.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles
                .activateTsp({
                    signingProfileUuid: action.payload.signingProfileUuid,
                    tspConfigurationUuid: action.payload.tspConfigurationUuid,
                })
                .pipe(
                    map((details) => slice.actions.activateTspSuccess({ tspActivationDetails: details })),
                    catchError((error) =>
                        of(
                            slice.actions.activateTspFailure({ error: extractError(error, 'Failed to activate TSP') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to activate TSP' }),
                        ),
                    ),
                ),
        ),
    );
};

const deactivateTsp: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deactivateTsp.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.deactivateTsp({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.deactivateTspSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.deactivateTspFailure({ error: extractError(error, 'Failed to deactivate TSP') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to deactivate TSP' }),
                    ),
                ),
            ),
        ),
    );
};

const getTspActivationDetails: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getTspActivationDetails.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.getTspActivationDetails({ uuid: action.payload.uuid }).pipe(
                map((details) => slice.actions.getTspActivationDetailsSuccess({ tspActivationDetails: details })),
                catchError((error) =>
                    of(
                        slice.actions.getTspActivationDetailsFailure({
                            error: extractError(error, 'Failed to get TSP activation details'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const getAssociatedApprovalProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAssociatedApprovalProfiles.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.getAssociatedApprovalProfiles({ uuid: action.payload.uuid }).pipe(
                map((approvalProfiles) => slice.actions.getAssociatedApprovalProfilesSuccess({ approvalProfiles })),
                catchError((error) =>
                    of(
                        slice.actions.getAssociatedApprovalProfilesFailure({
                            error: extractError(error, 'Failed to get associated Approval Profiles'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const associateWithApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.associateWithApprovalProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles
                .associateWithApprovalProfile({
                    signingProfileUuid: action.payload.signingProfileUuid,
                    approvalProfileUuid: action.payload.approvalProfileUuid,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.associateWithApprovalProfileSuccess({
                                signingProfileUuid: action.payload.signingProfileUuid,
                                approvalProfileUuid: action.payload.approvalProfileUuid,
                            }),
                            alertActions.success('Approval Profile associated successfully.'),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.associateWithApprovalProfileFailure({
                                error: extractError(error, 'Failed to associate Approval Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to associate Approval Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const disassociateFromApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disassociateFromApprovalProfile.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles
                .disassociateFromApprovalProfile({
                    signingProfileUuid: action.payload.signingProfileUuid,
                    approvalProfileUuid: action.payload.approvalProfileUuid,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.disassociateFromApprovalProfileSuccess({
                                signingProfileUuid: action.payload.signingProfileUuid,
                                approvalProfileUuid: action.payload.approvalProfileUuid,
                            }),
                            alertActions.success('Approval Profile disassociated successfully.'),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.disassociateFromApprovalProfileFailure({
                                error: extractError(error, 'Failed to disassociate Approval Profile'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to disassociate Approval Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const listSupportedProtocols: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSupportedProtocols.match),
        switchMap((action) =>
            deps.apiClients.signingProfiles.listSupportedProtocols({ workflowType: action.payload.workflowType }).pipe(
                map((protocols) => slice.actions.listSupportedProtocolsSuccess({ supportedProtocols: protocols })),
                catchError((error) =>
                    of(
                        slice.actions.listSupportedProtocolsFailure({
                            error: extractError(error, 'Failed to get supported protocols'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const listDigitalSignaturesForSigningProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listDigitalSignaturesForSigningProfile.match),
        switchMap((action) => {
            const searchRequest = { filters: [] };
            return deps.apiClients.signingProfiles
                .listDigitalSignaturesForSigningProfile({ uuid: action.payload.uuid, searchRequestDto: searchRequest })
                .pipe(
                    map((response) => slice.actions.listDigitalSignaturesForSigningProfileSuccess({ digitalSignatures: response })),
                    catchError((error) =>
                        of(
                            slice.actions.listDigitalSignaturesForSigningProfileFailure({
                                error: extractError(error, 'Failed to get digital signatures for Signing Profile'),
                            }),
                        ),
                    ),
                );
        }),
    );
};

const epics = [
    listSigningProfiles,
    getSigningProfile,
    listSigningProfileSearchableFields,
    createSigningProfile,
    updateSigningProfile,
    deleteSigningProfile,
    enableSigningProfile,
    disableSigningProfile,
    bulkDeleteSigningProfiles,
    bulkEnableSigningProfiles,
    bulkDisableSigningProfiles,
    activateIlmSigningProtocol,
    deactivateIlmSigningProtocol,
    getIlmSigningProtocolActivationDetails,
    activateTsp,
    deactivateTsp,
    getTspActivationDetails,
    getAssociatedApprovalProfiles,
    associateWithApprovalProfile,
    disassociateFromApprovalProfile,
    listSupportedProtocols,
    listDigitalSignaturesForSigningProfile,
];

export default epics;
