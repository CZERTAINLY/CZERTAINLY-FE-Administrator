import { AppEpic } from 'ducks';
import { EMPTY, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';
import { ParseCertificateCertificateTypeEnum } from '../types/openapi/utils';
import { actions as appRedirectActions } from './app-redirect';

import { slice } from './utilsCertificate';

const parseCertificate: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.parseCertificate.match),
        switchMap(
            (action) =>
                deps.apiClients.utilsCertificate
                    ?.parseCertificate({
                        certificateType: ParseCertificateCertificateTypeEnum.X509,
                        parseCertificateRequestDto: {
                            certificate: action.payload.certificate,
                            parseType: action.payload.parseType,
                        },
                    })
                    .pipe(
                        map((certificate) => slice.actions.parseCertificateSuccess(certificate)),
                        catchError((err) =>
                            of(
                                slice.actions.parseCertificateFailure({ error: extractError(err, 'Failed to get certificate.') }),
                                appRedirectActions.fetchError({ error: err, message: 'Failed to get certificate.' }),
                            ),
                        ),
                    ) ?? EMPTY,
        ),
    );
};

const epics = [parseCertificate];

export default epics;
