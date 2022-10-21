import { AnyAction, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { backendClient, mockClient } from "./api";
import { AppState, epics, initialState, reducers } from "./ducks";
import { configureStore } from "@reduxjs/toolkit";

export default function configure() {

   const useMockSwitch = process.env.REACT_APP_USE_MOCK_API;

   const useMock = useMockSwitch ? +useMockSwitch !== 0 : false;

   const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, AppState>({
      dependencies: {
         apiClients: useMock ? mockClient : backendClient,
      },
   });

   const composeEnhancers = compose();
   const enhancer = composeEnhancers(applyMiddleware(epicMiddleware));

   const store = configureStore({
      reducer: reducers,
      enhancers: [enhancer],
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
         serializableCheck: false // disable immutability checks because of date => should be refactored and date should not be stored in state
      }),
      preloadedState: initialState
   });


   epicMiddleware.run(epics);

   store.dispatch({ type: "@@app/INIT" });

   return store;

}
