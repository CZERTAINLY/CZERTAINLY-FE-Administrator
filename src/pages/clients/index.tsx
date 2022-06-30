import React from 'react';
import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import ClientAdd from './add';
import ClientDetail from './detail';
import Edit from './edit';
import ClientsList from './list';

export default function Clients() {
   const { path } = useRouteMatch();

   return (
      <Switch>
         <Route path={path} component={ClientsList} exact />
         <Route path={`${path}/list`} component={ClientsList} exact />
         <Route path={`${path}/detail/:id`} component={ClientDetail} exact />
         <Route path={`${path}/edit/:id`} component={Edit} exact />
         <Route path={`${path}/add`} component={ClientAdd} exact />
      </Switch>
   );
}

