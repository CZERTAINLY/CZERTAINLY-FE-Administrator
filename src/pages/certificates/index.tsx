import React from "react";
import { Switch, Route } from "react-router";
import { useRouteMatch } from "react-router-dom";

import CreateCertificate from "./add";
import CertificateDetail from "./detail";
import CertificateList from "./list";

function Certificates() {

  const { path } = useRouteMatch();

  return (

    <Switch>

      <Route path={path} component={CertificateList} exact />
      <Route path={`${path}/list`} component={CertificateList} exact />
      <Route path={`${path}/detail/:id`} component={CertificateDetail} exact />
      <Route path={`${path}/create`} component={CreateCertificate} exact />

    </Switch>

  );

}

export default Certificates;
