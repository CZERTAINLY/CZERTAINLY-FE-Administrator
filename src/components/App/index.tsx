import React from "react";
import { Switch, Route, Redirect, Router } from "react-router";
import { ToastContainer } from "react-toastify";
import history from "browser-history";

import "styles/theme.scss";

import Layout from "components/Layout";
import PrivateRoute from "components/PrivateRoute";

import Login from "pages/login";

import { inIFrame } from "utils/inIFrame";

function App() {

   const isInFrame = inIFrame();
   const redirect = () => !isInFrame ? <Redirect to="/app/home" /> : <Redirect to="/app/raprofiles" />

   return (
      <div>

         <ToastContainer autoClose={5000} hideProgressBar />

         <Router history={history}>

            <Switch>

               <Route path="/" render={redirect} exact/>
               <Route path="/app" render={redirect} exact/>
               <Route path="/login" component={Login} exact />
               <PrivateRoute component={Layout} />

            </Switch>

         </Router>

      </div>
   );

}

export default App;
