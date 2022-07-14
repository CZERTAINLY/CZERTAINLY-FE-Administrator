import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import CredentialDetail from "./detail";
import CredentialAdd from "./add";
import CredentialEdit from "./edit";
import CredentialsList from "./list";

function Credentials() {

  const { path } = useRouteMatch();

  return (

    <Switch>

      <Route path={path} component={CredentialsList} exact />
      <Route path={`${path}/list`} component={CredentialsList} exact />
      <Route path={`${path}/detail/:id`} component={CredentialDetail} exact />
      <Route path={`${path}/edit/:id`} component={CredentialEdit} exact />
      <Route path={`${path}/add`} component={CredentialAdd} exact />

    </Switch>

  );

}

export default Credentials;
