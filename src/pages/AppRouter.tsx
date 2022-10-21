import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./home";
import Layout from "components/Layout";

export const AppRouter = () => {
    return (
        <BrowserRouter basename={(window as any).__ENV__.BASE_URL}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/app/home" />} />
                    <Route path="/app" element={<Navigate to="/app/home" />} />
                    <Route path="/app/home" element={<Home />} />

                    {/*<Route path="/app/users" component={Users} />*/}
                    {/*<Route path="/app/roles" component={Roles} />*/}
                    {/*<Route path="/app/audit" component={AuditLogs} />*/}
                    {/*<Route path="/app/about" component={About} />*/}
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

                </Route>

                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
};
