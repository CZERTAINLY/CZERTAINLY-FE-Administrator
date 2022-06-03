import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./credentials";
import history from "browser-history";
import { transformRaProfileDtoToModel } from "./transform/ra-profiles";
import { transformCredentialDtoToModel } from "./transform/credentials";

const listCredentials: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCredentials.match),
        switchMap(() =>
            deps.apiClients.credentials.getCredentialsList().pipe(
                map((profiles) =>
                    Array.isArray(profiles)
                        ? slice.actions.listCredentialsSuccess(profiles.map(profileDto => transformCredentialDtoToModel(profileDto)))
                        : slice.actions.listCredentialsFailure("Failed to get Credential list")
                ),
                catchError((err) =>
                    of(
                        slice.actions.listCredentialProvidersFailure(
                            extractError(err, "Failed to get Credential list")
                        )
                    )
                )
            )
        )
    );
}


const listCredentialsFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCredentialsFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const listCredentialProviders: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCredentialProviders.match),
        switchMap(() =>
            deps.apiClients.credentials.getCredentialProvidersList().pipe(
                map((profiles) =>
                    Array.isArray(profiles)
                        ? slice.actions.listCredentialProvidersSuccess(profiles.map(profileDto => transformRaProfileDtoToModel(profileDto)))
                        : slice.actions.listCredentialProvidersFailure("Failed to get Credential Provider list")
                ),
                catchError((err) =>
                    of(
                        slice.actions.listCredentialProvidersFailure(
                            extractError(err, "Failed to get Credential Provider list")
                        )
                    )
                )
            )
        )
    );
}

const listCredentialProvidersFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCredentialProvidersFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const listCredentialProviderAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCredentialProviderAttributes.match),
        switchMap((payload) =>
            deps.apiClients.credentials.getCredentialProviderAttributesList(payload).pipe(
                map((attributes) =>
                    Array.isArray(attributes)
                        ? slice.actions.listCredentialProviderAttributesSuccess(attributes)
                        : slice.actions.listCredentialProviderAttributesFailure("Failed to get Credential Provider Attributes list")
                ),
                catchError((err) =>
                    of(
                        slice.actions.listCredentialProviderAttributesFailure(
                            extractError(err, "Failed to get Credential Provider Attributes list")
                        )
                    )
                )
            )
        )
    );
}


const listCredentialProviderAttributesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCredentialProviderAttributesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const createCredential: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createCredential.match),
        switchMap((payload) =>
            deps.apiClients.credentials.createNewCredential(payload.payload.name, payload.payload.kind, payload.payload.connectorUuid, payload.payload.attributes).pipe(
                map((credential) =>
                    slice.actions.createCredentialSuccess(credential)
                ),
                catchError((err) =>
                    of(
                        slice.actions.createCredentialFailure(
                            extractError(err, "Failed to create Credential")
                        )
                    )
                )
            )
        )
    );
}


const createCredentialFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createCredentialFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const createCredentialSuccess: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(
            slice.actions.createCredentialSuccess.match
        ),
        switchMap(
            action => {
                history.push(`./detail/${action.payload}`);
                return EMPTY;
            }
        )
    )
}

const deleteCredential: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteCredential.match),
        switchMap(({ payload }) =>
            deps.apiClients.credentials.deleteCredential(payload).pipe(
                map(() =>
                    slice.actions.deleteCredentialSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteCredentialFailure(
                            extractError(err, "Failed to delete Credential")
                        )
                    )
                )
            )
        )
    );
}


const deleteCredentialFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteCredentialFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const updateCredential: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions..match),
        switchMap(({ payload }) =>
            deps.apiClients.credentials.updateCredential(payload.uuid, payload.attributes).pipe(
                map(() =>
                    slice.actions.editCredentialSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.editCredentialFailure(
                            extractError(err, "Failed to update Credential")
                        )
                    )
                )
            )
        )
    );
}


const updateCredentialFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editCredentialFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const bulkDeleteCredential: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteCredentials.match),
        switchMap(({ payload }) =>
            deps.apiClients.credentials.bulkDeleteCredential(payload).pipe(
                map((response) =>
                    slice.actions.bulkDeleteCredentialsSuccess({ uuid: payload, error: response })
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteCredentialsFailure(extractError(err, "Failed to update Credential")
                        )
                    )
                )
            )
        )
    );
}


const bulkDeleteCredentialFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteCredentialsFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const bulkForceDeleteCredentials: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteCredentials.match),
        switchMap(({ payload }) =>
            deps.apiClients.credentials.bulkForceDeleteCredential(payload).pipe(
                map(() =>
                    slice.actions.bulkForceDeleteCredentialsSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkForceDeleteCredentialsFailure(extractError(err, "Failed to update Credential")
                        )
                    )
                )
            )
        )
    );
}


const bulkForceDeleteCredentialsFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteCredentialsFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}



const epics = [
    listCredentials,
    listCredentialsFailure,
    listCredentialProviderAttributes,
    listCredentialProviderAttributesFailure,
    createCredential,
    createCredentialFailure,
    createCredentialSuccess,
    deleteCredential,
    deleteCredentialFailure,
    updateCredential,
    updateCredentialFailure,
    bulkDeleteCredential,
    bulkDeleteCredentialFailure,
    bulkForceDeleteCredentials,
    bulkForceDeleteCredentialsFailure,
    listCredentialProviders,
    listCredentialProvidersFailure,
];
export default epics;
