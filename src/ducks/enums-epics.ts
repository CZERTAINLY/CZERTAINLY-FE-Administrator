import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { actions as appRedirectActions } from './app-redirect';

import { slice } from './enums';

const getPlatformEnums: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getPlatformEnums.match),
        switchMap(() =>
            deps.apiClients.enums.getPlatformEnums().pipe(
                map((platformEnums) => slice.actions.getPlatformEnumsSuccess(platformEnums)),
                catchError((err) => of(appRedirectActions.fetchError({ error: err, message: 'Failed to get platform enums' }))),
            ),
        ),
    );
};
const epics = [getPlatformEnums];

export default epics;
