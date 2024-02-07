import { AppEpic } from 'ducks';
import { EMPTY, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';
import { actions as appRedirectActions } from './app-redirect';

import { slice } from './utilsOid';

const getOidInfo: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getOidInfo.match),
        switchMap(
            (action) =>
                deps.apiClients.utilsOid?.getOidInfo({ identifier: action.payload }).pipe(
                    map((oidInfo) => slice.actions.getOidInfoSuccess(oidInfo)),
                    catchError((err) =>
                        of(
                            slice.actions.getOidInfoFailure({ error: extractError(err, 'Failed to get OID.') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to get OID.' }),
                        ),
                    ),
                ) ?? EMPTY,
        ),
    );
};

const epics = [getOidInfo];

export default epics;
