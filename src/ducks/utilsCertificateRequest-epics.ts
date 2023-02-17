import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";
import { ParseRequestRequestDtoParseTypeEnum, ParseRequestRequestTypeEnum } from "../types/openapi/utils";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./utilsCertificateRequest";

const parseCertificateRequest: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.parseCertificateRequest.match,
        ),
        switchMap(
            action => deps.apiClients.utilsCertificateRequest.parseRequest({
                requestType: ParseRequestRequestTypeEnum.Pkcs10,
                parseRequestRequestDto: {
                    request: action.payload,
                    parseType: ParseRequestRequestDtoParseTypeEnum.Basic,
                },
            }).pipe(
                map(
                    request => slice.actions.parseCertificateRequestSuccess(request),
                ),
                catchError(
                    err => of(
                        slice.actions.parseCertificateRequestFailure({error: extractError(err, "Failed to get certificate request.")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to get certificate request."}),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    parseCertificateRequest,
];

export default epics;