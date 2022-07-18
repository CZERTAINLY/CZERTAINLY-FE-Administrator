import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import GroupAdd from "./add";
import GroupDetail from "./detail";
import GroupEdit from "./edit";
import GroupsList from "./list";

function Groups() {

  const { path } = useRouteMatch();

  return (

    <Switch>

      <Route path={path} component={GroupsList} exact />
      <Route path={`${path}/list`} component={GroupsList} exact />
      <Route path={`${path}/detail/:id`} component={GroupDetail} exact />
      <Route path={`${path}/edit/:id`} component={GroupEdit} exact />
      <Route path={`${path}/add`} component={GroupAdd} exact />

    </Switch>

  );

}

export default Groups;
