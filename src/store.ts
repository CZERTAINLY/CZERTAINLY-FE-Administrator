import { configureStore } from "@reduxjs/toolkit";
import { AnyAction, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { backendClient } from "./api";
import { AppState, epics, initialState, reducers } from "./ducks";

export default function configure() {
    const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, AppState>({
        dependencies: {
            apiClients: backendClient,
        },
    });

    const composeEnhancers = compose();
    const enhancer = composeEnhancers(applyMiddleware(epicMiddleware));

    const store = configureStore({
        reducer: reducers,
        enhancers: [enhancer],
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false, // disable immutability checks because of date => should be refactored and date should not be stored in state
            }),
        preloadedState: initialState,
    });

    epicMiddleware.run(epics);

    store.dispatch({ type: "@@app/INIT" });

    return store;
}
