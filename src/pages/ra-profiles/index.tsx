import React from 'react';
import { Switch, Route } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

import ProfileAdd from './add';
import ProfilesList from './list';
import ProfileDetail from './detail';
import ProfileEdit from './edit';

function RaProfiles() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} component={ProfilesList} exact />
      <Route path={`${path}/detail/:id`} component={ProfileDetail} exact />
      <Route path={`${path}/edit/:id`} component={ProfileEdit} exact />
      <Route path={`${path}/add`} component={ProfileAdd} exact />
    </Switch>
  );
}

export default RaProfiles;
