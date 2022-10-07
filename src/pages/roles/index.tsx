import React from 'react';
import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import RoleAdd from './add';
import RoleEdit from './edit';
import RolesList from './list';
import RoleDetail from './detail';

function Roles() {

   const { path } = useRouteMatch();

   return (

      <Switch>

         <Route path={path} component={RolesList} exact />
         <Route path={`${path}/list`} component={RolesList} exact />
         <Route path={`${path}/detail/:id`} component={RoleDetail} exact />
         <Route path={`${path}/edit/:id`} component={RoleEdit} exact />
         <Route path={`${path}/add`} component={RoleAdd} exact />

      </Switch>

   );

}

export default Roles;
