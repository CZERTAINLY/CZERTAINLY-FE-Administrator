import React from "react";
import { Switch, Route, Router } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import history from "browser-history";

import "styles/theme.scss";

import Layout from "components/Layout";
import PrivateRoute from "components/PrivateRoute";

import Login from "pages/login";

import { selectors } from "ducks/auth";
import Spinner from "components/Spinner";

let onLocationChanged: () => void = () => {};

history.listen((location, action) => {
   onLocationChanged();
});


function App() {

   const [, setForceRender] = React.useState(Math.random());

   onLocationChanged = () => {
      if (history.location.pathname === "/app/login") setForceRender(Math.random());
   };

   const profile = useSelector(selectors.profile);

   return (


      <BrowserRouter basename={(window as any).__ENV__.BASE_URL}>

         <Router history={history} >

            {

               profile === undefined && (history.location.pathname !== ("/app/login") || !history.location) ? (

                  <>

                     <div style={{ width: "100wv", height: "100wv" }}>
                        <Spinner active={true} />
                     </div>

                  </>

               ) : (

                  <Switch>

                     <Route path="/app/login" component={Login} exact />
                     <PrivateRoute component={Layout} />

                  </Switch>

               )

            }

         </Router>

      </BrowserRouter>

   );

}

export default App;
