import { AppEpic } from "ducks";
import { iif, of } from "rxjs";
import { catchError, concatMap, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { extractError } from "utils/net";
import { actions as alertActions } from "./alerts";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./cryptographic-keys";
import { transformAttributeDescriptorDtoToModel } from "./transform/attributes";
import { transformSearchFieldListDtoToModel, transformSearchRequestModelToDto } from "./transform/certificates";

import {
    transformCryptographicKeyAddRequestModelToDto,
    transformCryptographicKeyBulkCompromiseModelToDto,
    transformCryptographicKeyCompromiseModelToDto,
    transformCryptographicKeyDetailResponseDtoToModel,
    transformCryptographicKeyEditRequestModelToDto,
    transformCryptographicKeyItemBulkCompromiseModelToDto,
    transformCryptographicKeyPairResponseDtoToModel,
    transformCryptographicKeyResponseDtoToModel,
    transformKeyHistoryDtoToModel,
} from "./transform/cryptographic-keys";

const listCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCryptographicKeys.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .listCryptographicKeys({ searchRequestDto: transformSearchRequestModelToDto(action.payload) })
                .pipe(
                    map((list) =>
                        slice.actions.listCryptographicKeysSuccess({
                            cryptographicKeys: list.cryptographicKeys.map(transformCryptographicKeyResponseDtoToModel),
                            totalItems: list.totalItems,
                            totalPages: list.totalPages,
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.listCryptographicKeysFailure({ error: extractError(error, "Failed to get key list") }),
                            appRedirectActions.fetchError({ error, message: "Failed to get key list" }),
                        ),
                    ),
                ),
        ),
    );
};

const listCryptographicKeyPairs: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCryptographicKeyPairs.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.listKeyPairs({ tokenProfileUuid: action.payload.tokenProfileUuid }).pipe(
                map((list) =>
                    slice.actions.listCryptographicKeyPairSuccess({
                        cryptographicKeys: list.map(transformCryptographicKeyPairResponseDtoToModel),
                    }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listCryptographicKeyPairFailure({ error: extractError(error, "Failed to get key list") }),
                        appRedirectActions.fetchError({ error, message: "Failed to get key list" }),
                    ),
                ),
            ),
        ),
    );
};

const getCryptographicKeyDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getCryptographicKeyDetail.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .getKey({ tokenInstanceUuid: action.payload.tokenInstanceUuid, uuid: action.payload.uuid })
                .pipe(
                    map((profileDto) =>
                        slice.actions.getCryptographicKeyDetailSuccess({
                            cryptographicKey: transformCryptographicKeyDetailResponseDtoToModel(profileDto),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.getCryptographicKeyDetailFailure({ error: extractError(err, "Failed to get Key detail") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get key detail" }),
                        ),
                    ),
                ),
        ),
    );
};

const getAttributesDescriptors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listAttributeDescriptors.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .listCreateKeyAttributes({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    tokenProfileUuid: action.payload.tokenProfileUuid,
                    type: action.payload.keyRequestType,
                })
                .pipe(
                    map((descriptors) =>
                        slice.actions.listAttributeDescriptorsSuccess({
                            uuid: action.payload.tokenProfileUuid,
                            attributeDescriptors: descriptors.map(transformAttributeDescriptorDtoToModel),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.listAttributeDescriptorsFailure({
                                error: extractError(err, "Failed to get Attribute to create key"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get Attributes to create key" }),
                        ),
                    ),
                ),
        ),
    );
};

const createCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createCryptographicKey.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .createKey({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    tokenProfileUuid: action.payload.tokenProfileUuid,
                    type: action.payload.type,
                    keyRequestDto: transformCryptographicKeyAddRequestModelToDto(action.payload.cryptographicKeyAddRequest),
                })
                .pipe(
                    mergeMap((obj) =>
                        of(
                            slice.actions.createCryptographicKeySuccess({
                                uuid: obj.uuid,
                                tokenInstanceUuid: action.payload.tokenInstanceUuid,
                            }),
                            appRedirectActions.redirect({ url: `../detail/${action.payload.tokenInstanceUuid}/${obj.uuid}` }),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.createCryptographicKeyFailure({ error: extractError(err, "Failed to create Key") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to create Key" }),
                        ),
                    ),
                ),
        ),
    );
};

const updateCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateCryptographicKey.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .editKey({
                    uuid: action.payload.profileUuid,
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    editKeyRequestDto: transformCryptographicKeyEditRequestModelToDto(action.payload.cryptographicKeyEditRequest),
                })
                .pipe(
                    mergeMap((cryptographicKeyDto) =>
                        iif(
                            () => !!action.payload.redirect,
                            of(
                                slice.actions.updateCryptographicKeySuccess({
                                    cryptographicKey: transformCryptographicKeyDetailResponseDtoToModel(cryptographicKeyDto),
                                    redirect: action.payload.redirect,
                                }),

                                appRedirectActions.redirect({ url: action.payload.redirect! }),
                            ),
                            of(
                                slice.actions.updateCryptographicKeySuccess({
                                    cryptographicKey: transformCryptographicKeyDetailResponseDtoToModel(cryptographicKeyDto),
                                    redirect: action.payload.redirect,
                                }),
                            ),
                        ),
                    ),

                    catchError((err) =>
                        of(slice.actions.updateCryptographicKeyFailure({ error: extractError(err, "Failed to update Key") })),
                    ),
                ),
        ),
    );
};

const syncCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.syncKeys.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys.syncKeys({ tokenInstanceUuid: action.payload.tokenInstanceUuid }).pipe(
                map(() => slice.actions.syncKeysSuccess()),

                catchError((err) =>
                    of(
                        slice.actions.syncKeysFailure({ error: extractError(err, "Failed to sync Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to sync Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const enableCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableCryptographicKey.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .enableKey({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.uuid,
                    requestBody: action.payload.keyItemUuid,
                })
                .pipe(
                    map(() =>
                        slice.actions.enableCryptographicKeySuccess({ uuid: action.payload.uuid, keyItemUuid: action.payload.keyItemUuid }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.enableCryptographicKeyFailure({ error: extractError(err, "Failed to enable Keys") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to enable Keys" }),
                        ),
                    ),
                ),
        ),
    );
};

const disableCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableCryptographicKey.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .disableKey({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.uuid,
                    requestBody: action.payload.keyItemUuid,
                })
                .pipe(
                    map(() =>
                        slice.actions.disableCryptographicKeySuccess({
                            uuid: action.payload.uuid,
                            keyItemUuid: action.payload.keyItemUuid,
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.enableCryptographicKeyFailure({ error: extractError(err, "Failed to disable Keys") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to disable Keys" }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteCryptographicKey.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .deleteKey({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.uuid,
                    requestBody: action.payload.keyItemUuid,
                })
                .pipe(
                    mergeMap(() =>
                        iif(
                            () => !!action.payload.redirect,
                            of(
                                slice.actions.deleteCryptographicKeySuccess({
                                    uuid: action.payload.uuid,
                                    keyItemUuid: action.payload.keyItemUuid,
                                }),
                                appRedirectActions.redirect({ url: action.payload.redirect! }),
                            ),
                            of(
                                slice.actions.deleteCryptographicKeySuccess({
                                    uuid: action.payload.uuid,
                                    keyItemUuid: action.payload.keyItemUuid,
                                }),
                            ),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.deleteCryptographicKeyFailure({ error: extractError(err, "Failed to delete Keys") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to delete Keys" }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkEnableCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableCryptographicKeys.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.enableKeys({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableCryptographicKeysSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkEnableCryptographicKeysFailure({ error: extractError(err, "Failed to enable Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to enable Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableCryptographicKeys.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys.disableKeys({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableCryptographicKeysSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkDisableCryptographicKeysFailure({ error: extractError(err, "Failed to disable Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to disable Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteCryptographicKeys.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.deleteKeys({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteCryptographicKeysSuccess({ uuids: action.payload.uuids }),
                        alertActions.success("Selected keys successfully deleted."),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteCryptographicKeysFailure({ error: extractError(err, "Failed to delete Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableCryptographicKeyItems: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableCryptographicKeyItems.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.enableKeyItems({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableCryptographicKeyItemsSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkEnableCryptographicKeyItemsFailure({ error: extractError(err, "Failed to enable Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to enable Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableCryptographicKeyItems: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableCryptographicKeyItems.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys.disableKeyItems({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableCryptographicKeyItemsSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkDisableCryptographicKeyItemsFailure({ error: extractError(err, "Failed to disable Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to disable Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteCryptographicKeyItems: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteCryptographicKeyItems.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.deleteKeyItems({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteCryptographicKeyItemsSuccess({ uuids: action.payload.uuids }),
                        alertActions.success("Selected key items successfully deleted."),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteCryptographicKeyItemsFailure({ error: extractError(err, "Failed to delete Keys") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete Keys" }),
                    ),
                ),
            ),
        ),
    );
};

const updateKeyUsage: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateKeyUsage.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .updateKeyUsages1({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.uuid,
                    updateKeyUsageRequestDto: action.payload.usage,
                })
                .pipe(
                    map(() =>
                        slice.actions.updateKeyUsageSuccess({
                            uuid: action.payload.uuid,
                            usage: action.payload.usage.usage,
                            keyItemsUuid: action.payload.usage.uuids || [],
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.updateKeyUsageFailure({ error: extractError(err, "Failed to Update Key Usages") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to Update Key Usages" }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkUpdateKeyUsage: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkUpdateKeyUsage.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.updateKeysUsages1({ bulkKeyUsageRequestDto: action.payload.usage }).pipe(
                map(() => slice.actions.bulkUpdateKeyUsageSuccess({})),

                catchError((err) =>
                    of(
                        slice.actions.bulkUpdateKeyUsageFailure({ error: extractError(err, "Failed to Update Key Usages") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to Update Key Usages" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkUpdateKeyItemsUsage: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkUpdateKeyItemUsage.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.updateKeyItemUsages({ bulkKeyItemUsageRequestDto: action.payload.usage }).pipe(
                map(() =>
                    slice.actions.bulkUpdateKeyItemUsageSuccess({ usages: action.payload.usage.usage, uuids: action.payload.usage.uuids }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkUpdateKeyItemUsageFailure({ error: extractError(err, "Failed to Update Key Usages") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to Update Key Usages" }),
                    ),
                ),
            ),
        ),
    );
};

const compromiseCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.compromiseCryptographicKey.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .compromiseKey({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.uuid,
                    compromiseKeyRequestDto: transformCryptographicKeyCompromiseModelToDto(action.payload.request),
                })
                .pipe(
                    map(() =>
                        slice.actions.compromiseCryptographicKeySuccess({
                            uuid: action.payload.uuid,
                            request: transformCryptographicKeyCompromiseModelToDto(action.payload.request),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.compromiseCryptographicKeyFailure({
                                error: extractError(err, "Failed to mark the Key as Compromised"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to Mark the Key as Compromised" }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkCompromiseCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkCompromiseCryptographicKeys.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .compromiseKeys({ bulkCompromiseKeyRequestDto: transformCryptographicKeyBulkCompromiseModelToDto(action.payload.request) })
                .pipe(
                    map((errors) =>
                        slice.actions.bulkCompromiseCryptographicKeysSuccess({
                            request: transformCryptographicKeyBulkCompromiseModelToDto(action.payload.request),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.bulkCompromiseCryptographicKeysFailure({
                                error: extractError(err, "Failed to mark the Keys as Compromised"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to mark the Keys as Compromised" }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkCompromiseCryptographicKeyItems: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkCompromiseCryptographicKeyItems.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .compromiseKeyItems({
                    bulkCompromiseKeyItemRequestDto: transformCryptographicKeyItemBulkCompromiseModelToDto(action.payload.request),
                })
                .pipe(
                    map((errors) =>
                        slice.actions.bulkCompromiseCryptographicKeyItemsSuccess({
                            request: transformCryptographicKeyItemBulkCompromiseModelToDto(action.payload.request),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.bulkCompromiseCryptographicKeyItemsFailure({
                                error: extractError(err, "Failed to mark the Keys as Compromised"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to mark the Keys as Compromised" }),
                        ),
                    ),
                ),
        ),
    );
};

const destroyCryptographicKey: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.destroyCryptographicKey.match),

        switchMap((action) =>
            deps.apiClients.cryptographicKeys
                .destroyKey({
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.uuid,
                    requestBody: action.payload.keyItemUuid,
                })
                .pipe(
                    map(() =>
                        slice.actions.destroyCryptographicKeySuccess({
                            uuid: action.payload.uuid,
                            keyItemUuid: action.payload.keyItemUuid,
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.destroyCryptographicKeyFailure({ error: extractError(err, "Failed to destroy the key") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to destroy the key" }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkDestroyCryptographicKeys: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDestroyCryptographicKeys.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.destroyKeys({ requestBody: action.payload.uuids }).pipe(
                map((errors) => slice.actions.bulkDestroyCryptographicKeys({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkDestroyCryptographicKeysFailure({ error: extractError(err, "Failed to destroy the key") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to destroy the key" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDestroyCryptographicKeyItems: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDestroyCryptographicKeyItems.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.destroyKeyItems({ requestBody: action.payload.uuids }).pipe(
                map((errors) => slice.actions.bulkDestroyCryptographicKeyItemsSuccess({ uuids: action.payload.uuids })),

                catchError((err) =>
                    of(
                        slice.actions.bulkDestroyCryptographicKeyItemsFailure({ error: extractError(err, "Failed to destroy the key") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to destroy the key" }),
                    ),
                ),
            ),
        ),
    );
};

const getAvailableKeyFilters: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getAvailableKeyFilters.match),
        switchMap((action) =>
            deps.apiClients.cryptographicKeys.getSearchableFieldInformation1().pipe(
                map((filters) =>
                    slice.actions.getAvailableKeyFiltersSuccess({
                        availableKeyFilters: filters.map((filter) => transformSearchFieldListDtoToModel(filter)),
                    }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getAvailableKeyFiltersFailure({ error: extractError(err, "Failed to get available key filters") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get available key filters" }),
                    ),
                ),
            ),
        ),
    );
};

const getKeyHistory: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getHistory.match),
        concatMap((action) =>
            deps.apiClients.cryptographicKeys
                .getEventHistory({
                    keyItemUuid: action.payload.keyItemUuid,
                    tokenInstanceUuid: action.payload.tokenInstanceUuid,
                    uuid: action.payload.keyUuid,
                })
                .pipe(
                    map((records) =>
                        slice.actions.getHistorySuccess({
                            keyHistory: records.map((record) => transformKeyHistoryDtoToModel(record)),
                            keyItemUuid: action.payload.keyItemUuid,
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.getHistoryFailure({ error: extractError(err, "Failed to get history") }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get history" }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    listCryptographicKeys,
    listCryptographicKeyPairs,
    getCryptographicKeyDetail,
    getAttributesDescriptors,
    createCryptographicKey,
    updateCryptographicKey,
    enableCryptographicKey,
    disableCryptographicKey,
    deleteCryptographicKey,
    syncCryptographicKeys,
    bulkEnableCryptographicKeys,
    bulkDisableCryptographicKeys,
    bulkDeleteCryptographicKeys,
    bulkEnableCryptographicKeyItems,
    bulkDisableCryptographicKeyItems,
    bulkDeleteCryptographicKeyItems,
    updateKeyUsage,
    bulkUpdateKeyUsage,
    bulkUpdateKeyItemsUsage,
    compromiseCryptographicKey,
    bulkCompromiseCryptographicKeys,
    bulkCompromiseCryptographicKeyItems,
    destroyCryptographicKey,
    bulkDestroyCryptographicKeys,
    bulkDestroyCryptographicKeyItems,
    getAvailableKeyFilters,
    getKeyHistory,
];

export default epics;
