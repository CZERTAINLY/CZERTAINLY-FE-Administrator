import React from 'react';
import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import ClientAdd from './add';
import ClientDetail from './detail';
import ClientEdit from './edit';
import ClientsList from './list';

function Clients() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} component={ClientsList} exact />
      <Route path={`${path}/list`} component={ClientsList} exact />
      <Route path={`${path}/detail/:id`} component={ClientDetail} exact />
      <Route path={`${path}/edit/:id`} component={ClientEdit} exact />
      <Route path={`${path}/add`} component={ClientAdd} exact />
    </Switch>
  );
}

export default Clients;
