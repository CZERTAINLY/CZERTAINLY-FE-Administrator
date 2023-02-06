import { actions, selectors } from "ducks/cryptographic-keys";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchFilterModel } from "types/certificate";
import FilterWidget from "../../../FilterWidget";

export default function KeyFilter() {
    const dispatch = useDispatch();
    const availableFilters = useSelector(selectors.availableKeyFilters);
    const currentFilters = useSelector(selectors.currentKeyFilters);
    const isFetchingAvailableFilters = useSelector(selectors.isFetchingAvailableFilters);

    useEffect(() => {
        dispatch(actions.getAvailableKeyFilters());
    }, [dispatch]);

    const onFiltersChanged = useCallback((filters: SearchFilterModel[]) => {
        dispatch(actions.setCurrentFilters(filters));
    }, [dispatch]);

    return <FilterWidget title="Key Inventory Filter"
                         onFiltersChanged={onFiltersChanged}
                         availableFilters={availableFilters}
                         currentFilters={currentFilters}
                         isFetchingAvailableFilters={isFetchingAvailableFilters}/>;
}
