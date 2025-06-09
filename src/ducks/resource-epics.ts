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
                map((resources) => slice.actions.listResourcesSuccess({ resourcesList: resources })),
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

const listAllResourceEvents: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listAllResourceEvents.match),
        switchMap(() =>
            deps.apiClients.resources.listAllResourceEvents().pipe(
                switchMap((mappedEvents) => of(slice.actions.listAllResourceEventsSuccess({ mappedEvents }))),
                catchError((err) =>
                    of(slice.actions.listAllResourceEventsFailure({ error: extractError(err, 'Failed to get resource events') })),
                ),
            ),
        ),
    );
};

const epics = [listResources, listResourceEvents, listAllResourceEvents];

export default epics;
