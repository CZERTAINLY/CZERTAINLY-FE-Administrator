import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";

import { EMPTY, Observable, of } from "rxjs";
import { SearchFieldListModel } from "types/certificate";
import { extractError } from "utils/net";
import { actions as appRedirectActions } from "./app-redirect";
import { FilterEntity, slice } from "./filters";
import { transformSearchFieldListDtoToModel } from "./transform/certificates";

const getAvailableFilters: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getAvailableFilters.match),
        switchMap((action) => {
            let availableFilters: Observable<Array<SearchFieldListModel>> | undefined = undefined;
            if (action.payload === FilterEntity.ENTITY) {
                availableFilters = deps.apiClients.entities.getSearchableFieldInformation2();
            }
            if (action.payload === FilterEntity.LOCATION) {
                availableFilters = deps.apiClients.locations.getSearchableFieldInformation();
            }
            if (action.payload === FilterEntity.CERTIFICATE) {
                availableFilters = deps.apiClients.certificates.getSearchableFieldInformation4();
            }
            if (action.payload === FilterEntity.KEY) {
                availableFilters = deps.apiClients.cryptographicKeys.getSearchableFieldInformation1();
            }
            if (action.payload === FilterEntity.DISCOVERY) {
                availableFilters = deps.apiClients.locations.getSearchableFieldInformation();
            }

            if (availableFilters) {
                return availableFilters.pipe(
                    map((filters) =>
                        slice.actions.getAvailableFiltersSuccess({
                            entity: action.payload,
                            availableFilters: filters.map((filter) => transformSearchFieldListDtoToModel(filter)),
                        }),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.getAvailableFiltersFailure({
                                entity: action.payload,
                                error: extractError(err, "Failed to get available filters"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get available filters" }),
                        ),
                    ),
                );
            } else {
                return EMPTY;
            }
        }),
    );
};

const epics = [getAvailableFilters];

export default epics;
