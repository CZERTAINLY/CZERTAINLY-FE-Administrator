import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { actions as appRedirectActions } from "./app-redirect";

import { transformDashbaordDTOToModel } from './transform/dashboard';

import { slice } from "./dashboard";


const getDashboard: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDashboard.match
      ),

      switchMap(

         () => deps.apiClients.dashboard.getDashboardData().pipe(

            map(
               dashboard => slice.actions.getDashboardSuccess({ dashboard: transformDashbaordDTOToModel(dashboard) })
            ),

            catchError(

                error => {
                    return of(
                        slice.actions.getDashboardFailed(),
                        appRedirectActions.fetchError({ error, message: "Failed to get dashboard data" })
                    )
                }

            )

         )

      )

   )

}


export const epics = [
   getDashboard
];


export default epics;
