import React from "react";
import { Link } from "react-router-dom";

import LinksGroup from "./LinksGroup";
import style from "./Sidebar.module.scss";
import logo from "resources/images/czertainly_white_H.svg";

export default function Sidebar() {

   return (

      <nav className={style.root}>

         <header className={style.logo}>
            <Link to="/app/home">
               <img src={logo} alt="CZERTAINLY Logo" />
            </Link>
         </header>

         <div className={style.nav}>

            <ul>

               <LinksGroup _key="/app/home" header="Home" headerLink="/app/home" />
               <LinksGroup _key="/app/dashboard" header="Dashboard" headerLink="/app/dashboard" />
               <LinksGroup _key="/app/certificates" header="Certificates" headerLink="/app/certificates" />
               <LinksGroup _key="/app/discovery" header="Discovery" headerLink="/app/discovery" />
               <LinksGroup _key="/app/connectors" header="Connectors" headerLink="/app/connectors" />

               <LinksGroup
                  _key="accessControl"
                  header="Access Control"
                  childrenLinks={[
                     { _key: "/app/users", name: "Users", link: "/app/users" },
                     { _key: "/app/roles", name: "Roles", link: "/app/roles" }
                  ]}
               />

               <LinksGroup
                  _key="profiles"
                  header="Profiles"
                  childrenLinks={[
                     { _key: "/app/raprofiles", name: "RA Profiles", link: "/app/raprofiles" },
                     { _key: "/app/complianceprofiles", name: "Compliance Profiles", link: "/app/complianceprofiles" },
                  ]}
               />

               <LinksGroup
                  _key="inventory"
                  header="Inventory"
                  childrenLinks={[
                     { _key: "/app/credentials", name: "Credentials", link: "/app/credentials" },
                     { _key: "/app/authorities", name: "Authorities", link: "/app/authorities" },
                     { _key: "/app/groups", name: "Certificate Groups", link: "/app/groups" },
                     { _key: "/app/entities", name: "Entities", link: "/app/entities" },
                     { _key: "/app/locations", name: "Locations", link: "/app/locations" },
                  ]}
               />

               <LinksGroup
                  _key="acm1"
                  header="ACME"
                  childrenLinks={[
                     { _key: "/app/acmeaccounts", name: "ACME Accounts", link: "/app/acmeaccounts" },
                     { _key: "/app/acmeprofiles", name: "ACME Profiles", link: "/app/acmeprofiles" },
                  ]}
               />


               <LinksGroup _key="/app/audit" header="Audit Logs" headerLink="/app/audit" />
               <LinksGroup _key="/app/about" header="About" headerLink="/app/about" />

            </ul>

         </div>

      </nav>
   );

}