import type { Observable } from 'rxjs';
import type { AjaxResponse } from 'rxjs/ajax';

import { TokenProfileManagementApi as GeneratedTokenProfileManagementApi } from './openapi/apis/TokenProfileManagementApi';
import type { KeyUsage } from './openapi';
import { encodeURI as encodePathSegment, throwIfNullOrUndefined } from './openapi/runtime';
import type { HttpHeaders, OperationOpts } from './openapi/runtime';

export interface ListSupportedTokenProfileKeyUsagesRequest {
    tokenInstanceUuid: string;
}

/**
 * Extends the generated client with the endpoint missing from the current OpenAPI document.
 */
export class TokenProfileManagementApi extends GeneratedTokenProfileManagementApi {
    listSupportedTokenProfileKeyUsages({ tokenInstanceUuid }: ListSupportedTokenProfileKeyUsagesRequest): Observable<Array<KeyUsage>>;
    listSupportedTokenProfileKeyUsages(
        { tokenInstanceUuid }: ListSupportedTokenProfileKeyUsagesRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<KeyUsage>>>;
    listSupportedTokenProfileKeyUsages(
        { tokenInstanceUuid }: ListSupportedTokenProfileKeyUsagesRequest,
        opts?: OperationOpts,
    ): Observable<Array<KeyUsage> | AjaxResponse<Array<KeyUsage>>> {
        throwIfNullOrUndefined(tokenInstanceUuid, 'tokenInstanceUuid', 'listSupportedTokenProfileKeyUsages');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<Array<KeyUsage>>(
            {
                url: '/v1/tokens/{tokenInstanceUuid}/tokenProfile/keyUsages'.replace(
                    '{tokenInstanceUuid}',
                    encodePathSegment(tokenInstanceUuid),
                ),
                method: 'POST',
                headers,
            },
            opts?.responseOpts,
        );
    }
}
