import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./authorities";
import history from "browser-history";
import { transformAuthorityDtoToModel } from "./transform/authorities";


const listAuthorities: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAuthorities.match),
        switchMap(() =>
            deps.apiClients.authorities.getAuthoritiesList().pipe(
                map((profiles) =>
                    Array.isArray(profiles)
                        ? slice.actions.listAuthoritiesSuccess(profiles.map(profileDto => transformCredentialDtoToModel(profileDto)))
                        : slice.actions.listAuthoritiesFailure("Failed to get Authorities list")
                ),
                catchError((err) =>
                    of(
                        slice.actions.listAuthoritiesFailure(
                            extractError(err, "Failed to get Authorities list")
                        )
                    )
                )
            )
        )
    );
}


const listAuthoritiesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAuthoritiesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const getAuthorityDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthorityDetail.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.getAuthorityDetail(payload).pipe(
                map((profileDto) =>
                    slice.actions.getAuthorityDetailSuccess(transformAuthorityDtoToModel(profileDto))
                ),
                catchError((err) =>
                    of(
                        slice.actions.getAuthorityDetailFailure(
                            extractError(err, "Failed to get Authority detail")
                        )
                    )
                )
            )
        )
    );
}


const getAuthorityDetailFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthorityDetailFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const createAuthority: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createAuthority.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.createNewAuthority(payload.name, payload.attributes, payload.connectorUuid, payload.kind).pipe(
                map((uuid) =>
                    slice.actions.createAuthoritySuccess(uuid)
                ),
                catchError((err) =>
                    of(
                        slice.actions.createAuthorityFailure(
                            extractError(err, "Failed to create Authority")
                        )
                    )
                )
            )
        )
    );
}


const createAuthoritySuccess: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createAuthoritySuccess.match),
        switchMap(
            action => {
                history.push(`./detail/${action.payload}`);
                return EMPTY;
            }
        )
    );
}


const createAuthorityFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createAuthorityFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const updateAuthority: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editAuthority.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.updateAuthority(payload.uuid, payload.attributes || []).pipe(
                map(() =>
                    slice.actions.editAuthoritySuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.editAuthorityFailure(
                            extractError(err, "Failed to update Authority")
                        )
                    )
                )
            )
        )
    );
}


const updateAuthorityFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editAuthorityFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const deleteAuthority: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteAuthority.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.deleteAuthority(payload).pipe(
                map(() =>
                    slice.actions.deleteAuthoritySuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteAuthorityFailure(
                            extractError(err, "Failed to delete Authority")
                        )
                    )
                )
            )
        )
    );
}


const deleteAuthorityFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteAuthorityFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const getAuthorityProviders: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthorityProviders.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.getAuthorityProviders(payload).pipe(
                map((providers) =>
                    slice.actions.getAuthorityProvidersSuccess(providers)
                ),
                catchError((err) =>
                    of(
                        slice.actions.getAuthorityProvidersFailure(
                            extractError(err, "Failed to get Authority providers")
                        )
                    )
                )
            )
        )
    );
}


const getAuthorityProvidersFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthorityProvidersFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const getAuthorityAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthorityAttributes.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.getAuthorityAttributes(payload).pipe(
                map((attributes) =>
                    slice.actions.getAuthorityAttributesSuccess(attributes)
                ),
                catchError((err) =>
                    of(
                        slice.actions.getAuthorityAttributesFailure(
                            extractError(err, "Failed to get Authority attributes")
                        )
                    )
                )
            )
        )
    );
}

const getAuthorityAttributesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthorityAttributesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const forceDeleteAuthority: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.forceDeleteAuthority.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.bulkForceDeleteAuthority([payload]).pipe(
                map(() =>
                    slice.actions.forceDeleteAuthoritySuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.forceDeleteAuthorityFailure(
                            extractError(err, "Failed to force delete Authority")
                        )
                    )
                )
            )
        )
    );
}


const forceDeleteAuthorityFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.forceDeleteAuthorityFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const bulkDeleteAuthority: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteAuthority.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.bulkDeleteAuthority(payload).pipe(
                map((response) =>
                    slice.actions.bulkDeleteAuthoritySuccess({ uuid: payload, error: response })
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteAuthorityFailure(
                            extractError(err, "Failed to bulk delete Authorities")
                        )
                    )
                )
            )
        )
    );
}


const bulkDeleteAuthorityFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteAuthorityFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const bulkForceDeleteAuthority: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteAuthority.match),
        switchMap(({ payload }) =>
            deps.apiClients.authorities.bulkForceDeleteAuthority(payload).pipe(
                map(() =>
                    slice.actions.bulkForceDeleteAuthoritySuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkForceDeleteAuthorityFailure(
                            extractError(err, "Failed to bulk force delete Authorities")
                        )
                    )
                )
            )
        )
    );
}


const bulkForceDeleteAuthorityFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteAuthorityFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const epics = [
    listAuthorities,
    listAuthoritiesFailure,
    getAuthorityDetail,
    getAuthorityDetailFailure,
    createAuthority,
    createAuthorityFailure,
    createAuthoritySuccess,
    updateAuthority,
    updateAuthorityFailure,
    deleteAuthority,
    deleteAuthorityFailure,
    getAuthorityProviders,
    getAuthorityProvidersFailure,
    getAuthorityAttributes,
    getAuthorityAttributesFailure,
    forceDeleteAuthority,
    forceDeleteAuthorityFailure,
    bulkDeleteAuthority,
    bulkDeleteAuthorityFailure,
    bulkForceDeleteAuthority,
    bulkForceDeleteAuthorityFailure
];

export default epics;