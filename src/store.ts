import { Action, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createEpicMiddleware } from "redux-observable";

import { backendClient, mockClient } from "api";
import { epics, reducers } from "ducks";
import { initialState, State } from "ducks/app-state";

export default function configureStore() {
  const useMockSwitch = process.env.REACT_APP_USE_MOCK_API;
  const useMock = useMockSwitch ? +useMockSwitch !== 0 : false;

  const epicMiddleware = createEpicMiddleware<Action, Action, State>({
    dependencies: {
      apiClients: useMock ? mockClient : backendClient,
    },
  });
  const middlewares = [epicMiddleware];
  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(reducers, initialState, enhancer);

  epicMiddleware.run(epics);
  store.dispatch({ type: "@@app/INIT" });

  return store;
}
