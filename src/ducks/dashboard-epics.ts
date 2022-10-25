import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { transformDashbaordDTOToModel } from './transform/dashboard';
import { extractError } from 'utils/net';

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
               err => of(slice.actions.getDashboardFailed({ error: extractError(err, "Failed to get dashboard data") }))
            )

         )

      )

   )

}


export const epics = [
   getDashboard
];


export default epics;
