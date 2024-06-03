import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './acme-profiles';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import {
    transformAcmeProfileAddRequestModelToDto,
    transformAcmeProfileEditRequestModelToDto,
    transformAcmeProfileListResponseDtoToModel,
    transformAcmeProfileResponseDtoToModel,
} from './transform/acme-profiles';
import { actions as userInterfaceActions } from './user-interface';

const listAcmeProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAcmeProfiles.match),
        switchMap(() =>
            deps.apiClients.acmeProfiles.listAcmeProfiles().pipe(
                switchMap((acmeProfiles) =>
                    of(
                        slice.actions.listAcmeProfilesSuccess({
                            acmeProfileList: acmeProfiles.map(transformAcmeProfileListResponseDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfACMEProfiles),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listAcmeProfilesFailure({ error: extractError(error, 'Failed to get ACME Profiles list') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfACMEProfiles),
                    ),
                ),
            ),
        ),
    );
};

const getAcmeProfileDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAcmeProfile.match),

        switchMap((action) =>
            deps.apiClients.acmeProfiles.getAcmeProfile({ uuid: action.payload.uuid }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getAcmeProfileSuccess({ acmeProfile: transformAcmeProfileResponseDtoToModel(detail) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ACMEProfileDetails),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getAcmeProfileFailure({ error: extractError(error, 'Failed to get ACME Profile details') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get ACME Profile details' }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ACMEProfileDetails),
                    ),
                ),
            ),
        ),
    );
};

const createAcmeProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createAcmeProfile.match),

        switchMap((action) =>
            deps.apiClients.acmeProfiles
                .createAcmeProfile({ acmeProfileRequestDto: transformAcmeProfileAddRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((acmeProfile) =>
                        of(
                            slice.actions.createAcmeProfileSuccess({ uuid: acmeProfile.uuid }),
                            appRedirectActions.redirect({ url: `../acmeprofiles/detail/${acmeProfile.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.createAcmeProfileFailure({ error: extractError(error, 'Failed to create ACME Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create ACME Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateAcmeProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateAcmeProfile.match),

        switchMap((action) =>
            deps.apiClients.acmeProfiles
                .editAcmeProfile({
                    uuid: action.payload.uuid,
                    acmeProfileEditRequestDto: transformAcmeProfileEditRequestModelToDto(action.payload.updateAcmeRequest),
                })
                .pipe(
                    mergeMap((acmeProfile) =>
                        of(
                            slice.actions.updateAcmeProfileSuccess({ acmeProfile: transformAcmeProfileResponseDtoToModel(acmeProfile) }),
                            appRedirectActions.redirect({ url: `../../acmeprofiles/detail/${acmeProfile.uuid}` }),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.updateAcmeProfileFailure({ error: extractError(err, 'Failed to update ACME Profile') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update ACME Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteAcmeProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteAcmeProfile.match),
        switchMap((action) =>
            deps.apiClients.acmeProfiles.deleteAcmeProfile({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteAcmeProfileSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../acmeprofiles' }),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteAcmeProfileFailure({ error: extractError(err, 'Failed to delete ACME Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete ACME Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const enableAcmeProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableAcmeProfile.match),
        switchMap((action) =>
            deps.apiClients.acmeProfiles.enableAcmeProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableAcmeProfileSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.enableAcmeProfileFailure({ error: extractError(err, 'Failed to enable ACME Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable ACME Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const disableAcmeProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableAcmeProfile.match),
        switchMap((action) =>
            deps.apiClients.acmeProfiles.disableAcmeProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableAcmeProfileSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        slice.actions.disableAcmeProfileFailure({ error: extractError(err, 'Failed to disable ACME Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable ACME Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteAcmeProfiles.match),

        switchMap((action) =>
            deps.apiClients.acmeProfiles.bulkDeleteAcmeProfile({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) =>
                    of(
                        slice.actions.bulkDeleteAcmeProfilesSuccess({ uuids: action.payload.uuids, errors }),
                        alertActions.success('Selected ACME profiles successfully deleted.'),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteAcmeProfilesFailure({ error: extractError(err, 'Failed to delete ACME Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkForceDeleteAcmeProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteAcmeProfiles.match),
        switchMap((action) =>
            deps.apiClients.acmeProfiles.forceDeleteACMEProfiles({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    iif(
                        () => !!action.payload.redirect,

                        of(
                            slice.actions.bulkForceDeleteAcmeProfilesSuccess({
                                uuids: action.payload.uuids,
                                redirect: action.payload.redirect,
                            }),
                            appRedirectActions.redirect({ url: action.payload.redirect! }),
                        ),
                        of(
                            slice.actions.bulkForceDeleteAcmeProfilesSuccess({
                                uuids: action.payload.uuids,
                                redirect: action.payload.redirect,
                            }),
                        ),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkForceDeleteAcmeProfilesFailure({ error: extractError(err, 'Failed to delete ACME Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableAcmeProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableAcmeProfiles.match),
        switchMap((action) =>
            deps.apiClients.acmeProfiles.bulkEnableAcmeProfile({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableAcmeProfilesSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkEnableAcmeProfilesFailure({ error: extractError(err, 'Failed to enable ACME Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableAcmeProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableAcmeProfiles.match),
        switchMap((action) =>
            deps.apiClients.acmeProfiles.bulkDisableAcmeProfile({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableAcmeProfilesSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkDisableAcmeProfilesFailure({ error: extractError(err, 'Failed to disable ACME Accounts') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable ACME Accounts' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listAcmeProfiles,
    getAcmeProfileDetail,
    updateAcmeProfile,
    createAcmeProfile,
    deleteAcmeProfile,
    enableAcmeProfile,
    disableAcmeProfile,
    bulkDeleteAcmeProfiles,
    bulkForceDeleteAcmeProfiles,
    bulkEnableAcmeProfiles,
    bulkDisableAcmeProfiles,
];

export default epics;
