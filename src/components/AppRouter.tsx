import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useMemo } from "react";

import { selectors } from "ducks/auth";

import Layout from "./Layout";
import Spinner from "./Spinner";

import AppRedirect from "./AppRedirect";
import AppLogin from "./AppLogin/AppLogin";

import Home from "./_pages/home";
import About from "./_pages/about";
import Dashboard from "./_pages/dashboard";

import GroupList from "./_pages/group/list";
import GroupDetail from "./_pages/group/detail";
import GroupEdit from "./_pages/group/form";

import UserProfileDetail from "./_pages/user-profile/detail";
import UserProfileEdit from "./_pages/user-profile/form";
import ConnectorList from "./_pages/connectors/list";
import ConnectorDetail from "./_pages/connectors/detail";
import ConnectorEdit from "./_pages/connectors/form";


export default function AppRouter() {

   const profile = useSelector(selectors.profile);

   const appRoutes = useMemo(

      () => (

         <>
            <Route element={< Layout />}>

               <Route path="/" element={<Navigate to="/app/home" />} />
               <Route path="/app" element={<Navigate to="/app/home" />} />
               <Route path="/app/home" element={<Home />} />
               <Route path="/app/about" element={<About />} />
               <Route path="/app/dashboard" element={<Dashboard />} />

               <Route path="/app/connectors" element={<ConnectorList />} />
               <Route path="/app/connectors/list" element={<Navigate to="/app/connectors" />} />
               <Route path="/app/connectors/detail/:id" element={<ConnectorDetail />} />
               <Route path="/app/connectors/edit/:id" element={<ConnectorEdit />} />
               <Route path="/app/connectors/add" element={<ConnectorEdit />} />

               {/*<Route path="/app/users" component={Users} />*/}
               {/*<Route path="/app/roles" component={Roles} />*/}
               {/*<Route path="/app/audit" component={AuditLogs} />*/}
               {/*<Route path="/app/raprofiles" component={RaProfiles} />*/}
               {/*<Route path="/app/credentials" component={Credentials} />*/}
               {/*<Route path="/app/authorities" component={Authorities} />*/}
               {/*<Route path="/app/entities" component={Entities} />*/}
               {/*<Route path="/app/locations" component={Locations} />*/}
               {/*<Route path="/app/acmeaccounts" component={AcmeAccounts} />*/}
               {/*<Route path="/app/acmeprofiles" component={AcmeProfiles} />*/}

               <Route path="/app/groups" element={<GroupList />} />
               <Route path="/app/groups/list" element={<Navigate to="/app/groups" />} />
               <Route path="/app/groups/detail/:id" element={<GroupDetail />} />
               <Route path="/app/groups/add" element={<GroupEdit />} />
               <Route path="/app/groups/edit/:id" element={<GroupEdit />} />

               {/*<Route path="/app/discovery" component={Discovery} />*/}
               {/*<Route path="/app/certificates" component={Certificates} />*/}
               {/*<Route path="/app/complianceprofiles" component={ComplianceProfiles} />*/}

               <Route path="/app/userprofile" element={<UserProfileDetail />} />
               <Route path="/app/userprofile/edit" element={<UserProfileEdit />} />

            </Route >

            {
               /*
               Please keep this remarked until migration is finished
               <Route path="*" element={<Navigate to="/app/home"/>}/>
               */
            }
            <Route path="*" element={<h1>404</h1>} />

         </>

      ),
      []

   )

   return (

      <BrowserRouter basename={(window as any).__ENV__.BASE_URL}>

         <AppRedirect />

         <Routes>

            <Route path="/login" element={<AppLogin />} />

            {
               profile ? appRoutes : <Route path="*" element={<Spinner active={true} />} />
            }

         </Routes>

      </BrowserRouter >

   );

}
