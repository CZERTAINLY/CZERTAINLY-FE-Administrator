import { AppEpic } from 'ducks';
import { slice } from 'ducks/oids';
import { catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { store } from '../App';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { transformSearchRequestModelToDto } from 'ducks/transform/certificates';
import { actions as appRedirectActions } from './app-redirect';
import { extractError } from 'utils/net';

const listOIDs: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listOIDs.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.OID));
            return deps.apiClients.oids.listCustomOidEntries({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((oidResponse) =>
                    of(
                        slice.actions.listOIDsSuccess({ oids: oidResponse.oidEntries || [] }),
                        pagingActions.listSuccess({ entity: EntityType.OID, totalItems: oidResponse.totalItems || 0 }),
                    ),
                ),

                catchError((error) =>
                    of(slice.actions.listOIDsFailure({ error: error.message }), pagingActions.listFailure(EntityType.OID)),
                ),
            );
        }),
    );
};

const getOID: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getOID.match),
        switchMap((action) =>
            deps.apiClients.oids.getCustomOidEntry({ oid: action.payload.oid }).pipe(
                mergeMap((oid) => of(slice.actions.getOIDSuccess({ oid: oid }))),
                catchError((error) => of(slice.actions.getOIDFailure({ error: error.message }))),
            ),
        ),
    );
};

const createOID: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createOID.match),
        switchMap((action) =>
            deps.apiClients.oids.createCustomOidEntry({ customOidEntryRequestDto: action.payload.oid }).pipe(
                mergeMap((oid) =>
                    of(
                        slice.actions.createOIDSuccess({ oid: oid }),
                        appRedirectActions.redirect({ url: `../custom-oids/detail/${oid.oid}` }),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.createOIDFailure({ error: extractError(error, 'Failed to add Custom OID') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to add Custom OID' }),
                    ),
                ),
            ),
        ),
    );
};

const updateOID: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateOID.match),
        switchMap((action) => {
            return deps.apiClients.oids
                .editCustomOidEntry({ oid: action.payload.oid, customOidEntryUpdateRequestDto: action.payload.data })
                .pipe(
                    mergeMap((oid) =>
                        of(
                            slice.actions.updateOIDSuccess({ oid: oid }),
                            appRedirectActions.redirect({ url: `../custom-oids/detail/${oid.oid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.updateOIDFailure({ error: extractError(error, 'Failed to update Custom OID') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update Custom OID' }),
                        ),
                    ),
                );
        }),
    );
};

const deleteOID: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteOID.match),
        switchMap((action) =>
            deps.apiClients.oids.deleteCustomOidEntry({ oid: action.payload.oid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteOIDSuccess({ oid: action.payload.oid }),
                        appRedirectActions.redirect({ url: `../../custom-oids` }),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.deleteOIDFailure({ error: extractError(error, 'Failed to delete Custom OID') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Custom OID' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteOIDs: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteOIDs.match),
        switchMap((action) =>
            deps.apiClients.oids.bulkDeleteCustomOidEntry({ requestBody: action.payload.oids }).pipe(
                mergeMap(() => of(slice.actions.bulkDeleteOIDsSuccess({ oids: action.payload.oids }))),
                catchError((error) => of(slice.actions.bulkDeleteOIDsFailure({ error: error.message }))),
            ),
        ),
    );
};

const epics = [listOIDs, createOID, updateOID, deleteOID, getOID, bulkDeleteOIDs];

export default epics;
