import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import AccountsList from "./list";
import AccountDetail from "./detail";

function AcmeAccounts() {

   const { path } = useRouteMatch();

   return (

      <Switch>

         <Route path={path} component={AccountsList} exact />
         <Route path={`${path}/detail/:acmeProfileUuid/:id`} component={AccountDetail} exact />

      </Switch>

   );

}

export default AcmeAccounts;
