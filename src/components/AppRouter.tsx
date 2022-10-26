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

               <Route path="" element={<Navigate to="/home" />} />
               <Route path="/" element={<Navigate to="/home" />} />

               <Route path="/home" element={<Home />} />
               <Route path="/about" element={<About />} />
               <Route path="/dashboard" element={<Dashboard />} />

               <Route path="/connectors" element={<ConnectorList />} />
               <Route path="/connectors/list" element={<Navigate to="/connectors" />} />
               <Route path="/connectors/detail/:id" element={<ConnectorDetail />} />
               <Route path="/connectors/edit/:id" element={<ConnectorEdit />} />
               <Route path="/connectors/add" element={<ConnectorEdit />} />

               {/*<Route path="/users" component={Users} />*/}
               {/*<Route path="/roles" component={Roles} />*/}
               {/*<Route path="/audit" component={AuditLogs} />*/}
               {/*<Route path="/raprofiles" component={RaProfiles} />*/}
               {/*<Route path="/credentials" component={Credentials} />*/}
               {/*<Route path="/authorities" component={Authorities} />*/}
               {/*<Route path="/entities" component={Entities} />*/}
               {/*<Route path="/locations" component={Locations} />*/}
               {/*<Route path="/acmeaccounts" component={AcmeAccounts} />*/}
               {/*<Route path="/acmeprofiles" component={AcmeProfiles} />*/}

               <Route path="/groups" element={<GroupList />} />
               <Route path="/groups/list" element={<Navigate to="/groups" />} />
               <Route path="/groups/detail/:id" element={<GroupDetail />} />
               <Route path="/groups/add" element={<GroupEdit />} />
               <Route path="/groups/edit/:id" element={<GroupEdit />} />

               {/*<Route path="/discovery" component={Discovery} />*/}
               {/*<Route path="/certificates" component={Certificates} />*/}
               {/*<Route path="/complianceprofiles" component={ComplianceProfiles} />*/}

               <Route path="/userprofile" element={<UserProfileDetail />} />
               <Route path="/userprofile/edit" element={<UserProfileEdit />} />

            </Route >

            {
               /*
               Please keep this remarked until migration is finished
               <Route path="*" element={<Navigate to="/home"/>}/>
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
