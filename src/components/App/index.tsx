import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "styles/theme.scss";

import Layout from "components/Layout";
import PrivateRoute from "components/PrivateRoute";
import Login from "pages/login";
import { inIframe } from "utils/commons";

function App() {
  const isInFrame = inIframe();
  return (
    <div>
      <ToastContainer autoClose={5000} hideProgressBar />
      <HashRouter>
        <Switch>
          <Route
            path="/"
            render={() =>
              !isInFrame ? (
                <Redirect to="/app/home" />
              ) : (
                <Redirect to="/app/raprofiles" />
              )
            }
            exact
          />
          <Route
            path="/app"
            render={() =>
              !isInFrame ? (
                <Redirect to="/app/home" />
              ) : (
                <Redirect to="/app/raprofiles" />
              )
            }
            exact
          />
          <Route path="/login" component={Login} exact />
          <PrivateRoute component={Layout} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
