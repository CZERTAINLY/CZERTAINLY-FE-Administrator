import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { actions as appRedirectActions } from './app-redirect';

import { slice } from './statisticsDashboard';
import { transformStatisticsDashboardDtoToModel } from './transform/statisticsDashboard';

const getDashboard: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getDashboard.match),

        switchMap(() =>
            deps.apiClients.statisticsDashboard.getStatistics().pipe(
                map((dashboard) =>
                    slice.actions.getDashboardSuccess({ statisticsDashboard: transformStatisticsDashboardDtoToModel(dashboard) }),
                ),

                catchError((error) => {
                    return of(
                        slice.actions.getDashboardFailed(),
                        appRedirectActions.fetchError({ error, message: 'Failed to get dashboard data' }),
                    );
                }),
            ),
        ),
    );
};

export const epics = [getDashboard];

export default epics;
