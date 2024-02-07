import { EMPTY, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { AjaxError } from 'rxjs/ajax';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { slice } from './app-redirect';

const fetchError: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.fetchError.match),
        switchMap((action) =>
            action.payload.error instanceof AjaxError && action.payload.error.status === 401
                ? EMPTY
                : of(alertActions.error(extractError(action.payload.error, action.payload.message))),
        ),
    );
};

export const epics = [fetchError];

export default epics;
