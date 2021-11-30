import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router";
import cx from "classnames";

import style from "./Layout.module.scss";
import Alerts from "components/Alerts";
import Footer from "components/Footer";
import Header from "components/Header";
import Sidebar from "components/Sidebar";

import { selectors } from "ducks/auth";

import Home from "pages/home";
import About from "pages/about";
import Administrators from "pages/administrators";
import AuditLogs from "pages/auditLogs";
import Clients from "pages/clients";
import RaProfiles from "pages/ra-profiles";
import Profile from "pages/profile";
import Credentials from "pages/credentials";
import Connectors from "pages/connectors";
import Authorities from "pages/authorities";

function Layout() {
  // eslint-disable-next-line
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSuperAdmin = useSelector(selectors.isSuperAdmin);
  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  return (
    <div className={style.root}>
      <Sidebar />
      <div className={cx(style.wrap, { [style.sidebarOpen]: sidebarOpen })}>
        <Header sidebarToggle={toggleSidebar} />
        <main className={style.content}>
          <Switch>
            <Route path="/app/home" component={Home} />
            <Route path="/app/clients" component={Clients} />
            <Route path="/app/raprofiles" component={RaProfiles} />
            <Route path="/app/connectors" component={Connectors} />
            <Route path="/app/credentials" component={Credentials} />
            <Route path="/app/authorities" component={Authorities} />
            {isSuperAdmin ? (
              <Route path="/app/administrators" component={Administrators} />
            ) : null}
            <Route path="/app/about" component={About} />
            <Route path="/app/audit" component={AuditLogs} />
            <Route path="/app/profile" component={Profile} />
          </Switch>
        </main>
        <Alerts />
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
