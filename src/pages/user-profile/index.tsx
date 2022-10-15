import React from 'react';

import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import ProfileEdit from './edit';
import ProfileDetail from './detail';


function Users() {

   const { path } = useRouteMatch();

   return (

      <Switch>
         <Route path={`${path}/detail`} component={ProfileDetail} exact />
         <Route path={`${path}/edit`} component={ProfileEdit} exact />
      </Switch>

   );

}

export default Users;
