import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import AuthorityDetail from "./detail";
import AuthorityAdd from "./add";
import AuthorityEdit from "./edit";

import AuthoritiesList from "./list";

function Authorities() {
   const { path } = useRouteMatch();

   return (
      <Switch>
         <Route path={path} component={AuthoritiesList} exact />
         <Route path={`${path}/list`} component={AuthoritiesList} exact />
         <Route path={`${path}/detail/:id`} component={AuthorityDetail} exact />
         <Route path={`${path}/edit/:id`} component={AuthorityEdit} exact />
         <Route path={`${path}/add`} component={AuthorityAdd} exact />
      </Switch>
   );
}

export default Authorities;
