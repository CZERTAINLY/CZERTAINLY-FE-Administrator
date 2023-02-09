import { actions, selectors } from "ducks/certificates";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchFilterModel } from "types/certificate";
import FilterWidget from "../../../FilterWidget";

export default function CertificateInventoryFilter() {
    const dispatch = useDispatch();
    const availableFilters = useSelector(selectors.availableCertificateFilters);
    const currentFilters = useSelector(selectors.currentCertificateFilters);
    const isFetchingAvailableFilters = useSelector(selectors.isFetchingAvailableFilters);

    useEffect(() => {
        dispatch(actions.getAvailableCertificateFilters());
    }, [dispatch]);

    const onFiltersChanged = useCallback((filters: SearchFilterModel[]) => {
        dispatch(actions.setCurrentFilters(filters));
    }, [dispatch]);

    return <FilterWidget title="Certificate Inventory Filter"
                         onFiltersChanged={onFiltersChanged}
                         availableFilters={availableFilters}
                         currentFilters={currentFilters}
                         isFetchingAvailableFilters={isFetchingAvailableFilters}/>;
}
