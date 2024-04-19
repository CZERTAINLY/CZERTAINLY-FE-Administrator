import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';

import { LockWidgetNameEnum } from 'types/user-interface';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './scep-profiles';
import { transformCertificateListResponseDtoToModel } from './transform/certificates';
import {
    transformScepProfileAddRequestModelToDto,
    transformScepProfileEditRequestModelToDto,
    transformScepProfileListResponseDtoToModel,
    transformScepProfileResponseDtoToModel,
} from './transform/scep-profiles';
import { actions as userInterfaceActions } from './user-interface';

const listScepProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listScepProfiles.match),
        switchMap(() =>
            deps.apiClients.scepProfiles.listScepProfiles().pipe(
                switchMap((scepProfiles) =>
                    of(
                        slice.actions.listScepProfilesSuccess({
                            scepProfileList: scepProfiles.map(transformScepProfileListResponseDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSCEPProfiles),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listScepProfilesFailure({ error: extractError(error, 'Failed to get SCEP Profiles list') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfSCEPProfiles),
                    ),
                ),
            ),
        ),
    );
};

const listScepCaCertificates: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listScepCaCertificates.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.listScepCaCertificates({ intuneEnabled: action.payload }).pipe(
                map((scepProfiles) =>
                    slice.actions.listScepCaCertificatesSuccess({
                        certificates: scepProfiles.map(transformCertificateListResponseDtoToModel),
                    }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listScepCaCertificatesFailure({
                            error: extractError(error, 'Failed to get SCEP CA Certificates list'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get SCEP CA Certificates list' }),
                    ),
                ),
            ),
        ),
    );
};

const getScepProfileDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getScepProfile.match),

        switchMap((action) =>
            deps.apiClients.scepProfiles.getScepProfile({ uuid: action.payload.uuid }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getScepProfileSuccess({ scepProfile: transformScepProfileResponseDtoToModel(detail) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.SCEPProfileDetails),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getScepProfileFailure({ error: extractError(error, 'Failed to get SCEP Profile details') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.SCEPProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const createScepProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createScepProfile.match),

        switchMap((action) =>
            deps.apiClients.scepProfiles
                .createScepProfile({ scepProfileRequestDto: transformScepProfileAddRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((scepProfile) =>
                        of(
                            slice.actions.createScepProfileSuccess({ uuid: scepProfile.uuid }),
                            appRedirectActions.redirect({ url: `../scepprofiles/detail/${scepProfile.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.createScepProfileFailure({ error: extractError(error, 'Failed to create SCEP Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create SCEP Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateScepProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateScepProfile.match),

        switchMap((action) =>
            deps.apiClients.scepProfiles
                .editScepProfile({
                    uuid: action.payload.uuid,
                    scepProfileEditRequestDto: transformScepProfileEditRequestModelToDto(action.payload.updateScepRequest),
                })
                .pipe(
                    mergeMap((scepProfile) =>
                        of(
                            slice.actions.updateScepProfileSuccess({ scepProfile: transformScepProfileResponseDtoToModel(scepProfile) }),
                            appRedirectActions.redirect({ url: `../../scepprofiles/detail/${scepProfile.uuid}` }),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.updateScepProfileFailure({ error: extractError(err, 'Failed to update SCEP Profile') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update SCEP Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteScepProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteScepProfile.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.deleteScepProfile({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteScepProfileSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../scepprofiles' }),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteScepProfileFailure({ error: extractError(err, 'Failed to delete SCEP Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete SCEP Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const enableScepProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableScepProfile.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.enableScepProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableScepProfileSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.enableScepProfileFailure({ error: extractError(err, 'Failed to enable SCEP Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable SCEP Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const disableScepProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableScepProfile.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.disableScepProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableScepProfileSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.disableScepProfileFailure({ error: extractError(err, 'Failed to disable SCEP Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable SCEP Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteScepProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteScepProfiles.match),

        switchMap((action) =>
            deps.apiClients.scepProfiles.bulkDeleteScepProfile({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) =>
                    of(
                        slice.actions.bulkDeleteScepProfilesSuccess({ uuids: action.payload.uuids, errors }),
                        alertActions.success('Selected SCEP profiles successfully deleted.'),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteScepProfilesFailure({ error: extractError(err, 'Failed to delete SCEP Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete SCEP Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkForceDeleteScepProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteScepProfiles.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.forceDeleteScepProfiles({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    iif(
                        () => !!action.payload.redirect,

                        of(
                            slice.actions.bulkForceDeleteScepProfilesSuccess({
                                uuids: action.payload.uuids,
                                redirect: action.payload.redirect,
                            }),
                            appRedirectActions.redirect({ url: action.payload.redirect! }),
                        ),
                        of(
                            slice.actions.bulkForceDeleteScepProfilesSuccess({
                                uuids: action.payload.uuids,
                                redirect: action.payload.redirect,
                            }),
                        ),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkForceDeleteScepProfilesFailure({ error: extractError(err, 'Failed to delete SCEP Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete SCEP Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableScepProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableScepProfiles.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.bulkEnableScepProfile({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableScepProfilesSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkEnableScepProfilesFailure({ error: extractError(err, 'Failed to enable SCEP Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable SCEP Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableScepProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableScepProfiles.match),
        switchMap((action) =>
            deps.apiClients.scepProfiles.bulkDisableScepProfile({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableScepProfilesSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkDisableScepProfilesFailure({ error: extractError(err, 'Failed to disable SCEP Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable SCEP Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listScepProfiles,
    listScepCaCertificates,
    getScepProfileDetail,
    updateScepProfile,
    createScepProfile,
    deleteScepProfile,
    enableScepProfile,
    disableScepProfile,
    bulkDeleteScepProfiles,
    bulkForceDeleteScepProfiles,
    bulkEnableScepProfiles,
    bulkDisableScepProfiles,
];

export default epics;
