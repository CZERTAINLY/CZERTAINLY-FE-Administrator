import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import ConnectorAdd from "./add";
import ConnectorDetail from "./detail";
import ConnectorEdit from "./edit";
import ConnectorsList from "./list";

function Connectors() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} component={ConnectorsList} exact />
      <Route path={`${path}/list`} component={ConnectorsList} exact />
      <Route path={`${path}/detail/:id`} component={ConnectorDetail} exact />
      <Route path={`${path}/edit/:id`} component={ConnectorEdit} exact />
      <Route path={`${path}/add`} component={ConnectorAdd} exact />
    </Switch>
  );
}

export default Connectors;
