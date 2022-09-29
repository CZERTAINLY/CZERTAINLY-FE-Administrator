import React from 'react';
import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import UserAdd from './add';
import UserEdit from './edit';
import UsersList from './list';
import UserDetail from './detail';

function Administrators() {

   const { path } = useRouteMatch();

   return (

      <Switch>

         <Route path={path} component={UsersList} exact />
         <Route path={`${path}/list`} component={UsersList} exact />
         <Route path={`${path}/detail/:id`} component={UserDetail} exact />
         <Route path={`${path}/edit/:id`} component={UserEdit} exact />
         <Route path={`${path}/add`} component={UserAdd} exact />

      </Switch>

   );

}

export default Administrators;
