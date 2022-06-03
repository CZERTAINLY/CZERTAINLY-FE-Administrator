import { EMPTY, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { actions as alertActions } from "./alerts";
import { extractError } from "utils/net";
import { AppEpic } from "ducks";
import { slice } from "./ra-profiles";
import history from "browser-history";
import { transformRaAuthorizedClientDtoToModel, transformRaProfileDtoToModel } from "./transform/ra-profiles";
import { transformAttributeDescriptorDTOToModel, transformAttributeDTOToModel } from "./transform/attributes";


const listProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listProfiles.match),
        switchMap(() =>
            deps.apiClients.profiles.getRaProfilesList().pipe(
                map((profiles) =>
                    Array.isArray(profiles)
                        ? slice.actions.listProfilesSuccess(profiles.map(profileDto => transformRaProfileDtoToModel(profileDto)))
                        : slice.actions.listProfilesFailure("Failed to get Authorities list")
                ),
                catchError((err) =>
                    of(
                        slice.actions.listProfilesFailure(
                            extractError(err, "Failed to get Authorities list")
                        )
                    )
                )
            )
        )
    );
}


const listProfilesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listProfilesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const getProfileDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getProfileDetail.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.getRaProfileDetail(payload).pipe(
                map((profileDto) =>
                    slice.actions.getProfileDetailSuccess(transformRaProfileDtoToModel(profileDto))
                ),
                catchError((err) =>
                    of(
                        slice.actions.getProfileDetailFailure(
                            extractError(err, "Failed to get Authorities list")
                        )
                    )
                )
            )
        )
    );
}


const getProfileDetailFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getProfileDetailFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const listAuthorizedClients: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAuthorizedClients.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.getAuthorizedClients(payload).pipe(
                map((clients) =>
                    Array.isArray(clients)
                        ? slice.actions.listAuthorizedClientsSuccess(clients.map(client => transformRaAuthorizedClientDtoToModel(client))
                        : slice.actions.listAuthorizedClientsFailure("Failed to get Authorities list")
                ),
                catchError((err) =>
                    of(
                        slice.actions.listAuthorizedClientsFailure(
                            extractError(err, "Failed to get Authorities list")
                        )
                    )
                )
            )
        )
    );
}


const listAuthorizedClientsFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listAuthorizedClientsFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const createProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createProfile.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.createRaProfile(payload.authorityInstanceUuid, payload.name, payload.attributes, payload.description).pipe(
                map((payload) =>
                    slice.actions.createProfileSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.createProfileFailure(
                            extractError(err, "Failed to create profile")
                        )
                    )
                )
            )
        )
    );
}

const createProfileSuccess: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(
            slice.actions.createProfileSuccess.match
        ),
        switchMap(
            action => {
                history.push(`./detail/${action.payload}`);
                return EMPTY;
            }
        )
    )
}


const createProfileFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createProfileFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}



const updateProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editProfile.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.updateRaProfile(payload.profileUuid, payload.authorityInstanceUuid, payload.attributes, payload.enabled, payload.description).pipe(
                map((payload) =>
                    slice.actions.editProfileSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.editProfileFailure(
                            extractError(err, "Failed to update profile")
                        )
                    )
                )
            )
        )
    );
}

const updateProfileFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editProfileFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const enableProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableProfile.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.enableRaProfile(payload).pipe(
                map(() =>
                    slice.actions.enableProfileSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.enableProfileFailure(
                            extractError(err, "Failed to enable profile")
                        )
                    )
                )
            )
        )
    );
}

const enableProfileFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableProfileFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const disableProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableProfile.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.disableRaProfile(payload).pipe(
                map(() =>
                    slice.actions.disableProfileSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.disableProfileFailure(
                            extractError(err, "Failed to disable profile")
                        )
                    )
                )
            )
        )
    );
}

const disableProfileFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableProfileFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const deleteProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteProfile.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.deleteRaProfile(payload).pipe(
                map(() =>
                    slice.actions.deleteProfileSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteProfileFailure(
                            extractError(err, "Failed to delete profile")
                        )
                    )
                )
            )
        )
    );
}

const deleteProfileFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteProfileFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const activateAcme: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.activateAcme.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.activateAcme(payload.uuid, payload.acmeProfileUuid, payload.issueCertificateAttributes, payload.revokeCertificateAttributes).pipe(
                map((response) =>
                    slice.actions.activateAcmeSuccess(response)
                ),
                catchError((err) =>
                    of(
                        slice.actions.activateAcmeFailure(
                            extractError(err, "Failed to activate ACME")
                        )
                    )
                )
            )
        )
    );
}

const activateAcmeFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.activateAcmeFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const deactivateAcme: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deactivateAcme.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.deactivateAcme(payload).pipe(
                map(() =>
                    slice.actions.deactivateAcmeSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.deactivateAcmeFailure(
                            extractError(err, "Failed to deactivate ACME")
                        )
                    )
                )
            )
        )
    );
}


const deactivateAcmeFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deactivateAcmeFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const listIssuanceAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listIssuanceAttributes.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.getIssueAttributes(payload).pipe(
                map((response) =>
                    slice.actions.listIssuanceAttributesSuccess(response.map(attr => transformAttributeDescriptorDTOToModel(attr)))
                ),
                catchError((err) =>
                    of(
                        slice.actions.listIssuanceAttributesFailure(
                            extractError(err, "Failed to list issuance attributes")
                        )
                    )
                )
            )
        )
    );
}

const listIssuanceAttributesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listIssuanceAttributesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const listRevocationAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listRevocationAttributes.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.getRevocationAttributes(payload).pipe(
                map((response) =>
                    slice.actions.listRevocationAttributesSuccess(response.map(attr => transformAttributeDescriptorDTOToModel(attr)))
                ),
                catchError((err) =>
                    of(
                        slice.actions.listRevocationAttributesFailure(
                            extractError(err, "Failed to list revocation attributes")
                        )
                    )
                )
            )
        )
    );
}

const listRevocationAttributesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listRevocationAttributesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const bulkEnableProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableProfiles.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.bulkEnableRaProfile(payload).pipe(
                map(() =>
                    slice.actions.bulkEnableProfilesSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkEnableProfilesFailure(
                            extractError(err, "Failed to enable profiles")
                        )
                    )
                )
            )
        )
    );
}


const bulkEnableProfilesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableProfilesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const bulkDisableProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableProfiles.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.bulkDisableRaProfile(payload).pipe(
                map(() =>
                    slice.actions.bulkDisableProfilesSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkDisableProfilesFailure(
                            extractError(err, "Failed to disable profiles")
                        )
                    )
                )
            )
        )
    );
}

const bulkDisableProfilesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableProfilesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}

const bulkDeleteProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteProfiles.match),
        switchMap(({ payload }) =>
            deps.apiClients.profiles.bulkDeleteRaProfile(payload).pipe(
                map(() =>
                    slice.actions.bulkDeleteProfilesSuccess(payload)
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteProfilesFailure(
                            extractError(err, "Failed to delete profiles")
                        )
                    )
                )
            )
        )
    );
}

const bulkDeleteProfilesFailure: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteProfilesFailure.match),
        map(
            action => alertActions.error(action.payload || "Unexpected error occurred")
        )
    );
}


const epics = [
    listProfiles,
    listProfilesFailure,
    getProfileDetail,
    getProfileDetailFailure,
    createProfile,
    createProfileFailure,
    createProfileSuccess,
    updateProfile,
    updateProfileFailure,
    enableProfile,
    enableProfileFailure,
    disableProfile,
    disableProfileFailure,
    deleteProfile,
    deleteProfileFailure,
    activateAcme,
    activateAcmeFailure,
    deactivateAcme,
    deactivateAcmeFailure,
    listIssuanceAttributes,
    listIssuanceAttributesFailure,
    listRevocationAttributes,
    listRevocationAttributesFailure,
    bulkEnableProfiles,
    bulkEnableProfilesFailure,
    bulkDisableProfiles,
    bulkDisableProfilesFailure,
    bulkDeleteProfiles,
    bulkDeleteProfilesFailure
];

export default epics;