import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

import { selectors } from "ducks/auth";

import Home from "./pages/home";
import Layout from "./Layout";
import About from "./pages/about";
import Spinner from "./Spinner";

import AppRedirect from "./AppRedirect";
import AppLogin from "./AppLogin/AppLogin";


export default function AppRouter() {

   const profile = useSelector(selectors.profile);

   const appRoutes = useMemo(

      () => (

         <Route element={< Layout />}>

            <Route path="/" element={<Navigate to="/app/home" />} />
            <Route path="/app" element={<Navigate to="/app/home" />} />
            <Route path="/app/home" element={<Home />} />
            <Route path="/app/about" element={<About />} />

            {/*<Route path="/app/users" component={Users} />*/}
            {/*<Route path="/app/roles" component={Roles} />*/}
            {/*<Route path="/app/audit" component={AuditLogs} />*/}
            {/*<Route path="/app/connectors" component={Connectors} />*/}
            {/*<Route path="/app/dashboard" component={Dashboard} />*/}
            {/*<Route path="/app/raprofiles" component={RaProfiles} />*/}
            {/*<Route path="/app/credentials" component={Credentials} />*/}
            {/*<Route path="/app/authorities" component={Authorities} />*/}
            {/*<Route path="/app/entities" component={Entities} />*/}
            {/*<Route path="/app/locations" component={Locations} />*/}
            {/*<Route path="/app/acmeaccounts" component={AcmeAccounts} />*/}
            {/*<Route path="/app/acmeprofiles" component={AcmeProfiles} />*/}
            {/*<Route path="/app/groups" component={Groups} />*/}
            {/*<Route path="/app/discovery" component={Discovery} />*/}
            {/*<Route path="/app/certificates" component={Certificates} />*/}
            {/*<Route path="/app/complianceprofiles" component={ComplianceProfiles} />*/}
            {/*<Route path="/app/userprofile" component={UserProfile} />*/}

         </Route >

      ),
      []

   )

   return (

      <BrowserRouter basename={(window as any).__ENV__.BASE_URL}>

         <AppRedirect />

         <Routes>

            <Route path="/login" element={<AppLogin />} />

            {

               profile
                  ?
                  appRoutes
                  :
                  <Route path="*" element={<Spinner active={true} />} />

            }

            <Route path="*" element={<h1>404</h1>} />

         </Routes>

      </BrowserRouter >

   );

};
