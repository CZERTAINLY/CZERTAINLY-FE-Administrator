import { EMPTY, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { slice } from "./app-redirect";
import { actions as alertActions } from "./alerts";
import { extractError } from 'utils/net';


const fetchError: AppEpic = (action$, state$, deps) => {

   return action$.pipe(

      filter(
         slice.actions.fetchError.match
      ),
      switchMap(

         action =>

            action.payload.error.status === 401 ?
               EMPTY
               :
               of(alertActions.error(extractError(action.payload.error, action.payload.message)))

      )

   );

};


export const epics = [
   fetchError
];


export default epics;