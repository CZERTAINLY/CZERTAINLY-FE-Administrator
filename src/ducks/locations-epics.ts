import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';

import { store } from 'index';
import { LockWidgetNameEnum } from 'types/user-interface';
import { actions as appRedirectActions } from './app-redirect';
import { slice as certsSlice } from './certificates';
import { EntityType } from './filters';
import { slice } from './locations';
import { actions as pagingActions } from './paging';
import { transformAttributeDescriptorDtoToModel } from './transform/attributes';
import { transformSearchRequestModelToDto } from './transform/certificates';
import {
    transformLocationAddRequestModelToDto,
    transformLocationIssueRequestModelToDto,
    transformLocationPushRequestModelToDto,
    transformLocationResponseDtoToModel,
} from './transform/locations';
import { actions as userInterfaceActions } from './user-interface';

const listLocations: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listLocations.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.LOCATION));
            return deps.apiClients.locations.listLocations({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((locationResponse) =>
                    of(
                        slice.actions.listLocationsSuccess(locationResponse.locations.map(transformLocationResponseDtoToModel)),
                        pagingActions.listSuccess({ entity: EntityType.LOCATION, totalItems: locationResponse.totalItems }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.LocationsStore),
                    ),
                ),

                catchError((error) =>
                    of(
                        pagingActions.listFailure(EntityType.LOCATION),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.LocationsStore),
                    ),
                ),
            );
        }),
    );
};

const getLocationDetail: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getLocationDetail.match),
        switchMap((action) =>
            deps.apiClients.locations.getLocation({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid }).pipe(
                switchMap((location) =>
                    of(
                        slice.actions.getLocationDetailSuccess({ location: transformLocationResponseDtoToModel(location) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.LocationDetails),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getLocationDetailFailure({ error: extractError(error, 'Failed to get Location detail') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.LocationDetails),
                    ),
                ),
            ),
        ),
    );
};

const addLocation: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.addLocation.match),
        switchMap((action) =>
            deps.apiClients.locations
                .addLocation({
                    entityUuid: action.payload.entityUuid,
                    addLocationRequestDto: transformLocationAddRequestModelToDto(action.payload.addLocationRequest),
                })
                .pipe(
                    switchMap((obj) =>
                        deps.apiClients.locations.getLocation({ entityUuid: action.payload.entityUuid, locationUuid: obj.uuid }).pipe(
                            mergeMap((location) =>
                                of(
                                    slice.actions.addLocationSuccess({
                                        location: transformLocationResponseDtoToModel(location),
                                        entityUuid: action.payload.entityUuid,
                                    }),
                                    appRedirectActions.redirect({
                                        url: `../locations/detail/${action.payload.entityUuid}/${location.uuid}`,
                                    }),
                                ),
                            ),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.addLocationFailure({ error: extractError(error, 'Failed to add Location') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to add Location' }),
                        ),
                    ),
                ),
        ),
    );
};

const editLocation: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.editLocation.match),
        switchMap((action) =>
            deps.apiClients.locations
                .editLocation({
                    locationUuid: action.payload.uuid,
                    entityUuid: action.payload.entityUuid,
                    editLocationRequestDto: action.payload.editLocationRequest,
                })
                .pipe(
                    mergeMap((location) =>
                        of(
                            slice.actions.editLocationSuccess({ location: transformLocationResponseDtoToModel(location) }),
                            appRedirectActions.redirect({ url: `../../../locations/detail/${action.payload.entityUuid}/${location.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.editLocationFailure({ error: extractError(error, 'Failed to edit Location') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to edit Location' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteLocation: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteLocation.match),
        mergeMap((action) =>
            deps.apiClients.locations.deleteLocation({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    iif(
                        () => !!action.payload.redirect,
                        of(
                            slice.actions.deleteLocationSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                            appRedirectActions.redirect({ url: action.payload.redirect! }),
                        ),
                        of(slice.actions.deleteLocationSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect })),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.deleteLocationFailure({ error: extractError(error, 'Failed to delete Location') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Location' }),
                    ),
                ),
            ),
        ),
    );
};

const enableLocation: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.enableLocation.match),
        mergeMap((action) =>
            deps.apiClients.locations.enableLocation({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableLocationSuccess({ uuid: action.payload.uuid })),

                catchError((error) =>
                    of(
                        slice.actions.enableLocationFailure({ error: extractError(error, 'Failed to enable Location') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable Location' }),
                    ),
                ),
            ),
        ),
    );
};

const disableLocation: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.disableLocation.match),
        mergeMap((action) =>
            deps.apiClients.locations.disableLocation({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableLocationSuccess({ uuid: action.payload.uuid })),

                catchError((error) =>
                    of(
                        slice.actions.disableLocationFailure({ error: extractError(error, 'Failed to disable Location') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable Location' }),
                    ),
                ),
            ),
        ),
    );
};

const getPushAttributes: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getPushAttributes.match),
        switchMap((action) =>
            deps.apiClients.locations.listPushAttributes({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid }).pipe(
                map((attributes) =>
                    slice.actions.getPushAttributesSuccess({ attributes: attributes.map(transformAttributeDescriptorDtoToModel) }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getPushAttributesFailure({ error: extractError(error, 'Failed to get Push Attributes') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get Push Attributes' }),
                    ),
                ),
            ),
        ),
    );
};

const getCSRAttributes: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getCSRAttributes.match),
        switchMap((action) =>
            deps.apiClients.locations.listCsrAttributes({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid }).pipe(
                map((attributes) =>
                    slice.actions.getCSRAttributesSuccess({ attributes: attributes.map(transformAttributeDescriptorDtoToModel) }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getCSRAttributesFailure({ error: extractError(error, 'Failed to get CSR Attributes') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get CSR Attributes' }),
                    ),
                ),
            ),
        ),
    );
};

const pushCertificate: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.pushCertificate.match),
        mergeMap((action) =>
            deps.apiClients.locations
                .pushCertificate({
                    entityUuid: action.payload.entityUuid,
                    locationUuid: action.payload.locationUuid,
                    certificateUuid: action.payload.certificateUuid,
                    pushToLocationRequestDto: transformLocationPushRequestModelToDto(action.payload.pushRequest),
                })
                .pipe(
                    mergeMap((location) =>
                        of(
                            slice.actions.pushCertificateSuccess({
                                location: transformLocationResponseDtoToModel(location),
                                certificateUuid: action.payload.certificateUuid,
                            }),
                            certsSlice.actions.getCertificateHistory({ uuid: action.payload.certificateUuid }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.pushCertificateFailure({ error: extractError(error, 'Failed to push Certificate') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to push Certificate' }),
                        ),
                    ),
                ),
        ),
    );
};

const issueCertificate: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.issueCertificate.match),
        switchMap((action) =>
            deps.apiClients.locations
                .issueCertificateToLocation({
                    locationUuid: action.payload.locationUuid,
                    entityUuid: action.payload.entityUuid,
                    issueToLocationRequestDto: transformLocationIssueRequestModelToDto(action.payload.issueRequest),
                })
                .pipe(
                    map((location) => slice.actions.issueCertificateSuccess({ location: transformLocationResponseDtoToModel(location) })),

                    catchError((error) =>
                        of(
                            slice.actions.issueCertificateFailure({ error: extractError(error, 'Failed to issue Certificate') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to issue Certificate' }),
                        ),
                    ),
                ),
        ),
    );
};

const autoRenewCertificate: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.autoRenewCertificate.match),
        mergeMap((action) =>
            deps.apiClients.locations
                .renewCertificateInLocation({
                    entityUuid: action.payload.entityUuid,
                    locationUuid: action.payload.locationUuid,
                    certificateUuid: action.payload.certificateUuid,
                })
                .pipe(
                    mergeMap((location) =>
                        of(
                            slice.actions.autoRenewCertificateSuccess({
                                location: transformLocationResponseDtoToModel(location),
                                certificateUuid: action.payload.certificateUuid,
                            }),
                            certsSlice.actions.getCertificateHistory({ uuid: action.payload.certificateUuid }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.autoRenewCertificateFailure({ error: extractError(error, 'Failed to auto-renew Certificate') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to auto-renew Certificate' }),
                        ),
                    ),
                ),
        ),
    );
};

const removeCertificate: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.removeCertificate.match),
        mergeMap((action) =>
            deps.apiClients.locations
                .removeCertificate({
                    entityUuid: action.payload.entityUuid,
                    locationUuid: action.payload.locationUuid,
                    certificateUuid: action.payload.certificateUuid,
                })
                .pipe(
                    mergeMap((location) =>
                        of(
                            slice.actions.removeCertificateSuccess({
                                location: transformLocationResponseDtoToModel(location),
                                certificateUuid: action.payload.certificateUuid,
                            }),
                            certsSlice.actions.getCertificateHistory({ uuid: action.payload.certificateUuid }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.removeCertificateFailure({ error: extractError(error, 'Failed to remove Certificate') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to remove Certificate' }),
                        ),
                    ),
                ),
        ),
    );
};

const syncLocation: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.syncLocation.match),
        switchMap((action) =>
            deps.apiClients.locations
                .updateLocationContent({ entityUuid: action.payload.entityUuid, locationUuid: action.payload.uuid })
                .pipe(
                    map((location) => slice.actions.syncLocationSuccess({ location: transformLocationResponseDtoToModel(location) })),

                    catchError((error) =>
                        of(
                            slice.actions.syncLocationFailure({ error: extractError(error, 'Failed to sync Location') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to sync Location' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    listLocations,
    getLocationDetail,
    addLocation,
    editLocation,
    deleteLocation,
    enableLocation,
    disableLocation,
    getPushAttributes,
    getCSRAttributes,
    pushCertificate,
    issueCertificate,
    autoRenewCertificate,
    removeCertificate,
    syncLocation,
];

export default epics;
