import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './notification-profiles';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import {
    transformNotificationProfileDetailDtoToModel,
    transformNotificationProfileDtoToModel,
    transformNotificationProfileRequestModelToDto,
    transformNotificationProfileUpdateRequestDtoToModel,
} from 'ducks/transform/notification-profiles';

const listNotificationProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listNotificationProfiles.match),
        switchMap(() =>
            deps.apiClients.notificationProfiles.listNotificationProfiles({}).pipe(
                switchMap((list) =>
                    of(
                        slice.actions.listNotificationProfilesSuccess({
                            notificationProfiles: list.notificationProfiles?.map(transformNotificationProfileDtoToModel) ?? [],
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfNotificationProfiles),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listNotificationProfilesFailure({
                            error: extractError(error, 'Failed to get Notification Profiles list'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfNotificationProfiles),
                    ),
                ),
            ),
        ),
    );
};

const getNotificationProfileDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getNotificationProfileDetail.match),
        switchMap((action) =>
            deps.apiClients.notificationProfiles
                .getNotificationProfile({ uuid: action.payload.uuid, version: action.payload.version })
                .pipe(
                    switchMap((profileDto) =>
                        of(
                            slice.actions.getNotificationProfileDetailSuccess({
                                notificationProfile: transformNotificationProfileDetailDtoToModel(profileDto),
                            }),
                            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.RaProfileDetails),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.getNotificationProfileDetailFailure({
                                error: extractError(err, 'Failed to get Notification Profile detail'),
                            }),
                            userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.RaProfileDetails),
                        ),
                    ),
                ),
        ),
    );
};

const createNotificationProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createNotificationProfile.match),

        switchMap((action) =>
            deps.apiClients.notificationProfiles
                .createNotificationProfile({
                    notificationProfileRequestDto: transformNotificationProfileRequestModelToDto(
                        action.payload.notificationProfileAddRequest,
                    ),
                })
                .pipe(
                    mergeMap((profileDto) =>
                        of(
                            slice.actions.createNotificationProfileSuccess({
                                uuid: profileDto.uuid,
                            }),
                            appRedirectActions.redirect({
                                url: `../notificationprofiles/detail/${profileDto.uuid}/${profileDto.version}`,
                            }),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.createNotificationProfileFailure({
                                error: extractError(err, 'Failed to create Notification Profile'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to create Notification Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateNotificationProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateNotificationProfile.match),
        switchMap((action) =>
            deps.apiClients.notificationProfiles
                .editNotificationProfile({
                    uuid: action.payload.uuid,
                    notificationProfileUpdateRequestDto: transformNotificationProfileUpdateRequestDtoToModel(
                        action.payload.notificationProfileEditRequest,
                    ),
                })
                .pipe(
                    mergeMap((profileDto) =>
                        iif(
                            () => !!action.payload.redirect,
                            of(
                                slice.actions.updateNotificationProfileSuccess({
                                    notificationProfile: transformNotificationProfileDetailDtoToModel(profileDto),
                                    redirect: action.payload.redirect,
                                }),

                                appRedirectActions.redirect({ url: action.payload.redirect! }),
                            ),
                            of(
                                slice.actions.updateNotificationProfileSuccess({
                                    notificationProfile: transformNotificationProfileDetailDtoToModel(profileDto),
                                    redirect: action.payload.redirect,
                                }),
                                appRedirectActions.redirect({
                                    url: `../notificationprofiles/detail/${profileDto.uuid}/${profileDto.version}`,
                                }),
                            ),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.updateNotificationProfileFailure({
                                error: extractError(err, 'Failed to update Notification Profile'),
                            }),
                            alertActions.error(extractError(err, 'Failed to update Notification Profile')),
                        ),
                    ),
                ),
        ),
    );
};

const deleteNotificationProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteNotificationProfile.match),
        switchMap((action) =>
            deps.apiClients.notificationProfiles.deleteNotificationProfile({ uuid: action.payload.uuid }).pipe(
                switchMap(() =>
                    iif(
                        () => !!action.payload.redirect,
                        of(
                            slice.actions.deleteNotificationProfileSuccess({
                                uuid: action.payload.uuid,
                                redirect: action.payload.redirect,
                            }),
                            appRedirectActions.redirect({ url: action.payload.redirect! }),
                        ),
                        of(
                            slice.actions.deleteNotificationProfileSuccess({
                                uuid: action.payload.uuid,
                            }),
                        ),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteNotificationProfileFailure({
                            error: extractError(err, 'Failed to delete Notification Profile'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listNotificationProfiles,
    getNotificationProfileDetail,
    createNotificationProfile,
    updateNotificationProfile,
    deleteNotificationProfile,
];

export default epics;
