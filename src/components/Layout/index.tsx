import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router";
import cx from "classnames";

import style from "./Layout.module.scss";
import Alerts from "components/Alerts";
import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import Sidebar from "components/Layout/Sidebar";

import { selectors } from "ducks/auth";

import Home from "pages/home";
import About from "pages/about";
import AuditLogs from "pages/auditLogs";
import Administrators from "pages/administrators";
import Connectors from "pages/connectors";
import Clients from "pages/clients";
import RaProfiles from "pages/ra-profiles";
import Credentials from "pages/credentials";
import Authorities from "pages/authorities";
import AcmeAccounts from "pages/acme-accounts";
import AcmeProfiles from "pages/acme-profiles";
import Profile from "pages/profile";
import Groups from "pages/group";

function Layout() {

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
                  <Route path="/app/audit" component={AuditLogs} />
                  {isSuperAdmin ? ( <Route path="/app/administrators" component={Administrators} /> ) : null}
                  <Route path="/app/about" component={About} />
                  <Route path="/app/clients" component={Clients} />
                  <Route path="/app/connectors" component={Connectors} />
                  <Route path="/app/raprofiles" component={RaProfiles} />
                  <Route path="/app/credentials" component={Credentials} />
                  <Route path="/app/authorities" component={Authorities} />
                  <Route path="/app/acmeaccounts" component={AcmeAccounts} />
                  <Route path="/app/acmeprofiles" component={AcmeProfiles} />
                  <Route path="/app/profile" component={Profile} />
                  <Route path="/app/groups" component={Groups} />

               </Switch>

            </main>

            <Alerts />
            <Footer />

         </div>

      </div>

   );

}

export default Layout;
