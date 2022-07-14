import React from "react";
import ReactDOM from "react-dom";
import { Provider as StoreProvider } from "react-redux";

import App from "components/App";
import configureStore from "store";
import * as serviceWorker from "./serviceWorker";

export const store = configureStore();

ReactDOM.render(

   <StoreProvider store={store}>

      <React.StrictMode>
         <App />

      </React.StrictMode>

   </StoreProvider>,

   document.getElementById("rootAdmin")

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
