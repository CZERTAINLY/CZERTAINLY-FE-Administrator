import { AppEpic } from 'ducks';
import { EMPTY, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';

import { slice } from './utilsActuator';

const health: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.health.match),
        switchMap(
            () =>
                deps.apiClients.utilsActuator?.health().pipe(
                    map((result) => {
                        if (result.hasOwnProperty('status') && (result as { status: string }).status === 'UP') {
                            return slice.actions.healthSuccess(result);
                        } else {
                            return slice.actions.healthFailure({ error: 'Failed to get utils service health status.' });
                        }
                    }),
                    catchError((err) =>
                        of(slice.actions.healthFailure({ error: extractError(err, 'Failed to get utils service health.') })),
                    ),
                ) ?? EMPTY,
        ),
    );
};

const epics = [health];

export default epics;
