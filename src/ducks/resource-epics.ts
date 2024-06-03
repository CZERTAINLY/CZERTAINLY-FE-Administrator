import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { slice } from './resource';

const listResources: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listResources.match),
        switchMap(() =>
            deps.apiClients.resources.listResources().pipe(
                map((resources) => slice.actions.listResourcesSuccess({ resourceslist: resources })),
                catchError((err) => of(slice.actions.listResourcesFailure({ error: extractError(err, 'Failed to get resources list') }))),
            ),
        ),
    );
};

const listResourceEvents: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listResourceEvents.match),
        switchMap((action) =>
            deps.apiClients.resources.listResourceEvents({ resource: action.payload.resource }).pipe(
                switchMap((events) => of(slice.actions.listResourceEventsSuccess({ events }))),
                catchError((err) =>
                    of(slice.actions.listResourceEventsFailure({ error: extractError(err, 'Failed to get resource events') })),
                ),
            ),
        ),
    );
};

const epics = [listResources, listResourceEvents];

export default epics;
