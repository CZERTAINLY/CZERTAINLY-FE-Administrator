import { AppEpic } from 'ducks';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { slice } from './cbomActuator';
import { extractError } from 'utils/net';

const normalizeUrl = (url: string): string => {
    let endIndex = url.length;
    while (endIndex > 0 && url.charCodeAt(endIndex - 1) === 47) {
        endIndex -= 1;
    }
    return endIndex === url.length ? url : url.slice(0, endIndex);
};

const buildCbomHealthUrl = (url: string): string => {
    const baseUrl = normalizeUrl(url);
    return baseUrl.endsWith('/api') ? `${baseUrl}/v1/health` : `${baseUrl}/api/v1/health`;
};

const health: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.health.match),
        switchMap((action) => {
            const url = action.payload;
            if (!url) {
                return of(slice.actions.healthFailure({ error: 'CBOM URL not provided.' }));
            }
            try {
                const fullUrl = buildCbomHealthUrl(url);
                return from(fetch(fullUrl, { credentials: 'same-origin' })).pipe(
                    switchMap((response) =>
                        from(response.json()).pipe(
                            map((json) => {
                                if (response.status === 200 && json?.status === 'UP') {
                                    return slice.actions.healthSuccess(json as object);
                                }
                                return slice.actions.healthFailure({ error: 'Failed to get CBOM health status.' });
                            }),
                        ),
                    ),
                    catchError((err) => of(slice.actions.healthFailure({ error: extractError(err, 'Failed to get CBOM health.') }))),
                );
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to get CBOM health.');
                return of(slice.actions.healthFailure({ error: extractError(error, 'Failed to get CBOM health.') }));
            }
        }),
    );
};

export default [health];
