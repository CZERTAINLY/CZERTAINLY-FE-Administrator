import React from 'react';
import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import AdministratorAdd from './add';
import AdministratorEdit from './edit';
import AdministratorsList from './list';
import AdministratorDetail from './detail';

function Administrators() {

   const { path } = useRouteMatch();

   return (

      <Switch>

         <Route path={path} component={AdministratorsList} exact />
         <Route path={`${path}/list`} component={AdministratorsList} exact />
         <Route path={`${path}/detail/:id`} component={AdministratorDetail} exact />
         <Route path={`${path}/edit/:id`} component={AdministratorEdit} exact />
         <Route path={`${path}/add`} component={AdministratorAdd} exact />

      </Switch>

   );

}

export default Administrators;
