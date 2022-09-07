import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import EntityList from "./list";
import EntityDetail from "./detail";
import EntityAdd from "./add";
import EntityEdit from "./edit";

function Entities() {

   const { path } = useRouteMatch();

   return (

      <Switch>

         <Route path={path} component={EntityList} exact />
         <Route path={`${path}/list`} component={EntityList} exact />
         <Route path={`${path}/detail/:id`} component={EntityDetail} exact />
         <Route path={`${path}/edit/:id`} component={EntityEdit} exact />
         <Route path={`${path}/add`} component={EntityAdd} exact />

      </Switch>

   );

}

export default Entities;
