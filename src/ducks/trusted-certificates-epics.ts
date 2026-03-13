import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';
import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './trusted-certificates';
import {
    transformTrustedCertificateRequestModelToDto,
    transformTrustedCertificateResponseDtoToModel,
} from './transform/trusted-certificates';
import { actions as userInterfaceActions } from './user-interface';

const listTrustedCertificates: AppEpic = (action$, _state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listTrustedCertificates.match),
        switchMap(() =>
            deps.apiClients.trustedCertificates.listTrustedCertificates().pipe(
                mergeMap((trustedCertificates) =>
                    of(
                        slice.actions.listTrustedCertificatesSuccess({
                            trustedCertificates: trustedCertificates.map(transformTrustedCertificateResponseDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfTrustedCertificates),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listTrustedCertificatesFailure({
                            error: extractError(error, 'Failed to get Trusted Certificate list'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfTrustedCertificates),
                        appRedirectActions.fetchError({ error, message: 'Failed to get Trusted Certificate list' }),
                    ),
                ),
            ),
        ),
    );
};

const getTrustedCertificate: AppEpic = (action$, _state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getTrustedCertificate.match),
        switchMap((action: ReturnType<typeof slice.actions.getTrustedCertificate>) =>
            deps.apiClients.trustedCertificates.getTrustedCertificate({ uuid: action.payload.uuid }).pipe(
                mergeMap((trustedCertificate) =>
                    of(
                        slice.actions.getTrustedCertificateSuccess({
                            trustedCertificate: transformTrustedCertificateResponseDtoToModel(trustedCertificate),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.TrustedCertificateDetails),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getTrustedCertificateFailure({
                            error: extractError(error, 'Failed to get Trusted Certificate details'),
                        }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.TrustedCertificateDetails),
                        appRedirectActions.fetchError({ error, message: 'Failed to get Trusted Certificate details' }),
                    ),
                ),
            ),
        ),
    );
};

const createTrustedCertificate: AppEpic = (action$, _state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createTrustedCertificate.match),
        switchMap((action: ReturnType<typeof slice.actions.createTrustedCertificate>) =>
            deps.apiClients.trustedCertificates
                .createTrustedCertificate({
                    trustedCertificateRequestDto: transformTrustedCertificateRequestModelToDto(action.payload.trustedCertificate),
                })
                .pipe(
                    switchMap((createdTrustedCertificate) =>
                        deps.apiClients.trustedCertificates.getTrustedCertificate({ uuid: createdTrustedCertificate.uuid }).pipe(
                            mergeMap((trustedCertificate) =>
                                of(
                                    slice.actions.createTrustedCertificateSuccess({
                                        trustedCertificate: transformTrustedCertificateResponseDtoToModel(trustedCertificate),
                                    }),
                                    slice.actions.listTrustedCertificates(),
                                ),
                            ),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.createTrustedCertificateFailure({
                                error: extractError(error, 'Failed to create Trusted Certificate'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create Trusted Certificate' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteTrustedCertificate: AppEpic = (action$, _state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteTrustedCertificate.match),
        switchMap((action: ReturnType<typeof slice.actions.deleteTrustedCertificate>) =>
            deps.apiClients.trustedCertificates.deleteTrustedCertificate({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteTrustedCertificateSuccess({ uuid: action.payload.uuid }),
                        slice.actions.listTrustedCertificates(),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.deleteTrustedCertificateFailure({
                            error: extractError(error, 'Failed to delete Trusted Certificate'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Trusted Certificate' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [listTrustedCertificates, getTrustedCertificate, createTrustedCertificate, deleteTrustedCertificate];

export default epics;
