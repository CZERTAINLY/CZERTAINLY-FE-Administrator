import { actions, selectors } from "ducks/discoveries";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchFilterModel } from "types/certificate";
import FilterWidget from "../../../FilterWidget";

export default function DiscoveriesFilter() {
    const dispatch = useDispatch();
    const availableFilters = useSelector(selectors.availableFilters);
    const currentFilters = useSelector(selectors.currentFilters);
    const isFetchingAvailableFilters = useSelector(selectors.isFetchingFilters);

    useEffect(() => {
        dispatch(actions.getAvailableFilters());
    }, [dispatch]);

    const onFiltersChanged = useCallback(
        (filters: SearchFilterModel[]) => {
            dispatch(actions.setCurrentFilters(filters));
        },
        [dispatch],
    );

    return (
        <FilterWidget
            title="Discoveries Filter"
            onFiltersChanged={onFiltersChanged}
            availableFilters={availableFilters}
            currentFilters={currentFilters}
            isFetchingAvailableFilters={isFetchingAvailableFilters}
        />
    );
}
