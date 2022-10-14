import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import LocationList from "./list";
import LocationDetail from "./detail";
import LocationAdd from "./add";
import LocationEdit from "./edit";

function Entities() {

   const { path } = useRouteMatch();

   return (

      <Switch>

         <Route path={path} component={LocationList} exact />
         <Route path={`${path}/list`} component={LocationList} exact />
         <Route path={`${path}/detail/:entityUuid/:id`} component={LocationDetail} exact />
         <Route path={`${path}/edit/:entityUuid/:id`} component={LocationEdit} exact />
         <Route path={`${path}/add`} component={LocationAdd} exact />

      </Switch>

   );

}

export default Entities;
