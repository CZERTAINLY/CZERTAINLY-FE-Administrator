import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';

import { of } from 'rxjs';
import { extractError } from 'utils/net';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './filters';
import { transformSearchFieldListDtoToModel } from './transform/certificates';

const getAvailableFilters: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getAvailableFilters.match),
        switchMap((action) =>
            action.payload.getAvailableFiltersApi(deps.apiClients).pipe(
                map((filters) =>
                    slice.actions.getAvailableFiltersSuccess({
                        entity: action.payload.entity,
                        availableFilters: filters.map((filter) => transformSearchFieldListDtoToModel(filter)),
                    }),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getAvailableFiltersFailure({
                            entity: action.payload.entity,
                            error: extractError(err, 'Failed to get available filters'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get available filters' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [getAvailableFilters];

export default epics;
