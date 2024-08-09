import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './cmp-profiles';
import { transformCertificateListResponseDtoToModel } from './transform/certificates';
import {
    transformCmpProfileDetailDtoToModel,
    transformCmpProfileDtoToModel,
    transformCmpProfileEditRequestModelToDto,
    transformCmpProfileRequestModelToDto,
} from './transform/cmp-profiles';

const listCmpProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCmpProfiles.match),
        switchMap(() =>
            deps.apiClients.cmpProfiles.listCmpProfiles().pipe(
                switchMap((cmpProfiles) =>
                    of(
                        slice.actions.listCmpProfilesSuccess({
                            cmpProfileList: cmpProfiles.map(transformCmpProfileDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfCMPProfiles),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listCmpProfilesFailure({ error: extractError(error, 'Failed to get CMP Profiles list') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfCMPProfiles),
                    ),
                ),
            ),
        ),
    );
};

const listCmpSigningCertificates: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCmpSigningCertificates.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.listCmpSigningCertificates().pipe(
                map((cmpProfiles) =>
                    slice.actions.listCmpSigningCertificatesSuccess({
                        certificates: cmpProfiles.map(transformCertificateListResponseDtoToModel),
                    }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listCmpSigningCertificatesFailure({
                            error: extractError(error, 'Failed to get CMP Signing Certificates list'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get CMP Signing Certificates list' }),
                        // alertActions.error(extractError(error, 'Failed to get CMP Signing Certificates list')),
                    ),
                ),
            ),
        ),
    );
};

const getCmpProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getCmpProfile.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.getCmpProfile({ cmpProfileUuid: action.payload.uuid }).pipe(
                map((cmpProfile) => slice.actions.getCmpProfileSuccess({ cmpProfile: transformCmpProfileDetailDtoToModel(cmpProfile) })),

                catchError((error) =>
                    of(
                        slice.actions.getCmpProfileFailure({ error: extractError(error, 'Failed to get CMP Profile details') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get CMP Profile details' }),
                        // alertActions.error(extractError(error, 'Failed to get CMP Profile details')),
                    ),
                ),
            ),
        ),
    );
};

const createCmpProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createCmpProfile.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles
                .createCmpProfile({ cmpProfileRequestDto: transformCmpProfileRequestModelToDto(action.payload) })
                .pipe(
                    switchMap((cmpProfile) =>
                        of(
                            slice.actions.createCmpProfileSuccess(),
                            appRedirectActions.redirect({ url: `../cmpprofiles/detail/${cmpProfile.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.createCmpProfileFailure({ error: extractError(error, 'Failed to create CMP Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create CMP Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateCmpProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateCmpProfile.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles
                .editCmpProfile({
                    cmpProfileUuid: action.payload.uuid,
                    cmpProfileEditRequestDto: transformCmpProfileEditRequestModelToDto(action.payload.updateCmpRequest),
                })
                .pipe(
                    mergeMap((cmpProfile) =>
                        of(
                            slice.actions.updateCmpProfileSuccess({ cmpProfile: transformCmpProfileDetailDtoToModel(cmpProfile) }),
                            appRedirectActions.redirect({ url: `../../cmpprofiles/detail/${cmpProfile.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.updateCmpProfileFailure({ error: extractError(error, 'Failed to update CMP Profile') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update CMP Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteCmpProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteCmpProfile.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.deleteCmpProfile({ cmpProfileUuid: action.payload.uuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteCmpProfileSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../cmpprofiles' }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.deleteCmpProfileFailure({ error: extractError(error, 'Failed to delete CMP Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete CMP Profile' }),
                        // alertActions.error(extractError(error, 'Failed to delete CMP Profile')),
                    ),
                ),
            ),
        ),
    );
};

const enableCmpProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableCmpProfile.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.enableCmpProfile({ cmpProfileUuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableCmpProfileSuccess({ uuid: action.payload.uuid })),

                catchError((error) =>
                    of(
                        slice.actions.enableCmpProfileFailure({ error: extractError(error, 'Failed to enable CMP Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable CMP Profile' }),
                        // alertActions.error(extractError(error, 'Failed to enable CMP Profile')),
                    ),
                ),
            ),
        ),
    );
};

const disableCmpProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableCmpProfile.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.disableCmpProfile({ cmpProfileUuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableCmpProfileSuccess({ uuid: action.payload.uuid })),

                catchError((error) =>
                    of(
                        slice.actions.disableCmpProfileFailure({ error: extractError(error, 'Failed to disable CMP Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable CMP Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteCmpProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteCmpProfiles.match),

        switchMap((action) =>
            deps.apiClients.cmpProfiles.bulkDeleteCmpProfile({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) => of(slice.actions.bulkDeleteCmpProfilesSuccess({ uuids: action.payload.uuids, errors }))),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteCmpProfilesFailure({ error: extractError(err, 'Failed to delete CMP Profile') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete Cmp Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkForceDeleteCmpProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteCmpProfiles.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.forceDeleteCmpProfiles({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkForceDeleteCmpProfilesSuccess({
                            uuids: action.payload.uuids,
                            redirect: action.payload.redirect,
                        }),
                        appRedirectActions.redirect({ url: action.payload.redirect! }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkForceDeleteCmpProfilesFailure({ error: extractError(error, 'Failed to delete CMP Profiles') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete CMP Profiles' }),
                        // alertActions.error(extractError(error, 'Failed to delete CMP Profiles')),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableCmpProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableCmpProfiles.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.bulkEnableCmpProfile({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableCmpProfilesSuccess({ uuids: action.payload.uuids })),

                catchError((error) =>
                    of(
                        slice.actions.bulkEnableCmpProfilesFailure({ error: extractError(error, 'Failed to enable CMP Profile') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable CMP Profile' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableCmpProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableCmpProfiles.match),
        switchMap((action) =>
            deps.apiClients.cmpProfiles.bulkDisableCmpProfile({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableCmpProfilesSuccess({ uuids: action.payload.uuids })),

                catchError((error) =>
                    of(
                        slice.actions.bulkDisableCmpProfilesFailure({ error: extractError(error, 'Failed to disable CMP Profiles') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable CMP Profiles' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listCmpProfiles,
    createCmpProfile,
    listCmpSigningCertificates,
    getCmpProfile,
    updateCmpProfile,
    deleteCmpProfile,
    enableCmpProfile,
    disableCmpProfile,
    bulkDeleteCmpProfiles,
    bulkForceDeleteCmpProfiles,
    bulkEnableCmpProfiles,
    bulkDisableCmpProfiles,
];

export default epics;
