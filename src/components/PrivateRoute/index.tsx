import React from 'react';
import { Redirect, Route } from 'react-router';
import { useSelector } from 'react-redux';

import { selectors } from 'ducks/auth';

interface Props {
   component: React.FunctionComponent<any> | React.ComponentClass;
}

function PrivateRoute({ component, ...rest }: Props) {

   // const isAuthenticated = useSelector(selectors.profile);

   // if (!isAuthenticated) { return <Redirect to="/login" />; }

   return <Route {...rest} render={props => React.createElement(component, props)} />;

}

export default PrivateRoute;
