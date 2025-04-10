import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { actions as appRedirectActions } from './app-redirect';

import { slice } from './info';

const getPlatformInfo: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getPlatformInfo.match),
        switchMap(() =>
            deps.apiClients.info.getInfo().pipe(
                map((platformEnums) => slice.actions.getPlatformInfoSuccess(platformEnums)),
                catchError((err) => of(appRedirectActions.fetchError({ error: err, message: 'Failed to get platform info' }))),
            ),
        ),
    );
};
const epics = [getPlatformInfo];

export default epics;
