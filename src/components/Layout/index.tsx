import { useState, useCallback } from "react";
import { Switch, Route } from "react-router";
import cx from "classnames";

import style from "./Layout.module.scss";
import Alerts from "components/Alerts";
import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import Sidebar from "components/Layout/Sidebar";

import Home from "pages/home";
import About from "pages/about";
import AuditLogs from "pages/auditLogs";
import Users from "pages/users";
import Roles from "pages/roles";
import Connectors from "pages/connectors";
import RaProfiles from "pages/ra-profiles";
import Credentials from "pages/credentials";
import Authorities from "pages/authorities";
import Entities from "pages/entities";
import Locations from "pages/locations";
import AcmeAccounts from "pages/acme-accounts";
import AcmeProfiles from "pages/acme-profiles";
import Groups from "pages/group";
import Discovery from "pages/discoveries";
import Dashboard from "pages/dashboard";
import Certificates from "pages/certificates";
import ComplianceProfiles from "pages/compliance-profiles";
import UserProfile from "pages/user-profile";

function Layout() {

   const [sidebarOpen, setSidebarOpen] = useState(false);

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
                  <Route path="/app/users" component={Users} />
                  <Route path="/app/roles" component={Roles} />
                  <Route path="/app/audit" component={AuditLogs} />
                  <Route path="/app/about" component={About} />
                  <Route path="/app/connectors" component={Connectors} />
                  <Route path="/app/dashboard" component={Dashboard} />
                  <Route path="/app/raprofiles" component={RaProfiles} />
                  <Route path="/app/credentials" component={Credentials} />
                  <Route path="/app/authorities" component={Authorities} />
                  <Route path="/app/entities" component={Entities} />
                  <Route path="/app/locations" component={Locations} />
                  <Route path="/app/acmeaccounts" component={AcmeAccounts} />
                  <Route path="/app/acmeprofiles" component={AcmeProfiles} />
                  <Route path="/app/groups" component={Groups} />
                  <Route path="/app/discovery" component={Discovery} />
                  <Route path="/app/certificates" component={Certificates} />
                  <Route path="/app/complianceprofiles" component={ComplianceProfiles} />
                  <Route path="/app/userprofile" component={UserProfile} />

               </Switch>

            </main>

            <Alerts />
            <Footer />

         </div>

      </div>

   );

}

export default Layout;
