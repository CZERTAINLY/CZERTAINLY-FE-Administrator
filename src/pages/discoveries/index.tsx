import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";
import DiscoveryAdd from "./add";
import DiscoveryDetail from "./detail";
import DiscoveryList from "./list";

function Discovery() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} component={DiscoveryList} exact />
      <Route path={`${path}/list`} component={DiscoveryList} exact />
      <Route path={`${path}/detail/:id`} component={DiscoveryDetail} exact />
      <Route path={`${path}/add`} component={DiscoveryAdd} exact />
    </Switch>
  );
}

export default Discovery;
