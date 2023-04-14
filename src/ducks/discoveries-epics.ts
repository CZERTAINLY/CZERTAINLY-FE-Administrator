import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { extractError } from "utils/net";
import { FunctionGroupCode } from "../types/openapi";
import { actions as alertActions } from "./alerts";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./discoveries";
import { transformAttributeDescriptorDtoToModel } from "./transform/attributes";
import { transformSearchFieldListDtoToModel, transformSearchRequestModelToDto } from "./transform/certificates";
import { transformConnectorResponseDtoToModel } from "./transform/connectors";
import {
    transformDiscoveryCertificateListDtoToModel,
    transformDiscoveryRequestModelToDto,
    transformDiscoveryResponseDetailDtoToModel,
    transformDiscoveryResponseDtoToModel,
} from "./transform/discoveries";

const listDiscoveries: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listDiscoveries.match),
        switchMap((action) =>
            deps.apiClients.discoveries.listDiscoveries({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }).pipe(
                map((discoveryResponse) =>
                    slice.actions.listDiscoveriesSuccess({
                        discoveryList: discoveryResponse.discoveries.map(transformDiscoveryResponseDtoToModel),
                        totalItems: discoveryResponse.totalItems,
                        totalPages: discoveryResponse.totalPages,
                    }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.listDiscoveriesFailure({ error: extractError(err, "Failed to get Discovery list") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery list" }),
                    ),
                ),
            ),
        ),
    );
};

const getAvailableFilters: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getAvailableFilters.match),
        switchMap((action) =>
            deps.apiClients.discoveries.getSearchableFieldInformation3().pipe(
                map((filters) =>
                    slice.actions.getAvailableFiltersSuccess({
                        availableFilters: filters.map((filter) => transformSearchFieldListDtoToModel(filter)),
                    }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getAvailableFiltersFailure({
                            error: extractError(err, "Failed to get available filters"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get available filters" }),
                    ),
                ),
            ),
        ),
    );
};

const getDiscoveryDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getDiscoveryDetail.match),

        switchMap((action) =>
            deps.apiClients.discoveries.getDiscovery({ uuid: action.payload.uuid }).pipe(
                map((discoveryDto) =>
                    slice.actions.getDiscoveryDetailSuccess({ discovery: transformDiscoveryResponseDetailDtoToModel(discoveryDto) }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getDiscoveryDetailFailure({ error: extractError(err, "Failed to get Discovery detail") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery detail" }),
                    ),
                ),
            ),
        ),
    );
};

const listDiscoveryProviders: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listDiscoveryProviders.match),
        switchMap(() =>
            deps.apiClients.connectors.listConnectors({ functionGroup: FunctionGroupCode.DiscoveryProvider }).pipe(
                map((providers) =>
                    slice.actions.listDiscoveryProvidersSuccess({
                        connectors: providers.map(transformConnectorResponseDtoToModel),
                    }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.listDiscoveryProvidersFailure({ error: extractError(err, "Failed to get Discovery Provider list") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery Provider list" }),
                    ),
                ),
            ),
        ),
    );
};

const getDiscoveryProviderAttributesDescriptors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getDiscoveryProviderAttributesDescriptors.match),
        switchMap((action) =>
            deps.apiClients.connectors
                .getAttributes({
                    uuid: action.payload.uuid,
                    functionGroup: FunctionGroupCode.DiscoveryProvider,
                    kind: action.payload.kind,
                })
                .pipe(
                    map((attributeDescriptors) =>
                        slice.actions.getDiscoveryProviderAttributesDescriptorsSuccess({
                            attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.getDiscoveryProviderAttributeDescriptorsFailure({
                                error: extractError(err, "Failed to get Discovery Provider Attribute list"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery Provider Attribute list" }),
                        ),
                    ),
                ),
        ),
    );
};

const getDiscoveryCertificates: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getDiscoveryCertificates.match),
        switchMap((action) =>
            deps.apiClients.discoveries.getDiscoveryCertificates(action.payload).pipe(
                map((certificates) =>
                    slice.actions.getDiscoveryCertificatesSuccess(transformDiscoveryCertificateListDtoToModel(certificates)),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getDiscoveryCertificatesFailure({
                            error: extractError(err, "Failed to get Discovery Certificates list"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get Discovery Certificates list" }),
                    ),
                ),
            ),
        ),
    );
};

const createDiscovery: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createDiscovery.match),
        switchMap((action) =>
            deps.apiClients.discoveries.createDiscovery({ discoveryDto: transformDiscoveryRequestModelToDto(action.payload) }).pipe(
                mergeMap((obj) =>
                    of(
                        slice.actions.createDiscoverySuccess({ uuid: obj.uuid }),
                        appRedirectActions.redirect({ url: `../detail/${obj.uuid}` }),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.createDiscoveryFailure({ error: extractError(err, "Failed to create discovery") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to create discovery" }),
                    ),
                ),
            ),
        ),
    );
};

const deleteDiscovery: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteDiscovery.match),
        switchMap((action) =>
            deps.apiClients.discoveries.deleteDiscovery({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(slice.actions.deleteDiscoverySuccess({ uuid: action.payload.uuid }), appRedirectActions.redirect({ url: "../../" })),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteDiscoveryFailure({ error: extractError(err, "Failed to delete discovery") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete discovery" }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteDiscovery: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteDiscovery.match),
        switchMap((action) =>
            deps.apiClients.discoveries.bulkDeleteDiscovery({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteDiscoverySuccess({ uuids: action.payload.uuids }),
                        alertActions.success("Selected discoveries successfully deleted."),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteDiscoveryFailure({ error: extractError(err, "Failed to bulk delete Discoveries") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to bulk delete Discoveries" }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listDiscoveries,
    getDiscoveryDetail,
    listDiscoveryProviders,
    getDiscoveryProviderAttributesDescriptors,
    getDiscoveryCertificates,
    getAvailableFilters,
    createDiscovery,
    deleteDiscovery,
    bulkDeleteDiscovery,
];

export default epics;
