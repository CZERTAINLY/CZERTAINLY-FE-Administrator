import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { actions as appRedirectActions } from './app-redirect';

import * as slice from './auth';
import { transformResourceDtoToModel, transformUserUpdateRequestModelToDto } from './transform/auth';

const getProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getProfile.match),
        switchMap(() =>
            deps.apiClients.auth.profile().pipe(
                map((profile) => slice.actions.getProfileSuccess({ profile })),

                catchError((error) => {
                    return of(
                        slice.actions.getProfileFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to get user profile' }),
                    );
                }),
            ),
        ),
    );
};

const updateProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateProfile.match),
        switchMap((action) =>
            deps.apiClients.auth
                .updateUserProfile({ updateUserRequestDto: transformUserUpdateRequestModelToDto(action.payload.profile) })
                .pipe(
                    map((profile) => slice.actions.updateProfileSuccess({ profile, redirect: action.payload.redirect })),

                    catchError((error) =>
                        of(
                            slice.actions.updateProfileFailure(),
                            appRedirectActions.fetchError({ error, message: 'Failed to update user profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateProfileSuccess: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateProfileSuccess.match),
        map((action) =>
            action.payload.redirect ? appRedirectActions.redirect({ url: action.payload.redirect }) : appRedirectActions.goBack(),
        ),
    );
};

const getAuthResources: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthResources.match),
        switchMap(() =>
            deps.apiClients.auth.getAuthResources().pipe(
                map((resources) =>
                    slice.actions.getAuthResourcesSuccess({
                        resources: resources.map((resource) => transformResourceDtoToModel(resource)),
                    }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getAuthResourcesFailure(),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get user resources' }),
                    ),
                ),
            ),
        ),
    );
};

const getObjectsForResource: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getObjectsForResource.match),
        switchMap((action) =>
            deps.apiClients.auth.getObjectsForResource({ resourceName: action.payload.resource }).pipe(
                map((objects) => slice.actions.getObjectsForResourceSuccess({ objects })),

                catchError((err) =>
                    of(
                        slice.actions.getObjectsForResourceFailure(),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get objects list' }),
                    ),
                ),
            ),
        ),
    );
};

export const epics = [getProfile, getAuthResources, updateProfile, updateProfileSuccess, getObjectsForResource];

export default epics;
