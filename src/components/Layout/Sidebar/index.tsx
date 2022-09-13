import React from "react";
import { useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { selectors } from "ducks/auth";

import LinksGroup from "./LinksGroup";
import style from "./Sidebar.module.scss";
import logo from "images/czertainly_white_H.svg";
import { inIFrame } from "utils/inIFrame";

function Sidebar() {
   const isSuperAdmin = useSelector(selectors.isSuperAdmin);
   const inFrame = inIFrame();
   return (

      <nav className={style.root}>

         <header className={style.logo}>
            <Link to="/app/home">
               <img src={logo} alt="CZERTAINLY Logo" />
            </Link>
         </header>

         <div className={style.nav}>

            <ul>

               {!inFrame ? <LinksGroup _key="/app/home" header="Home" headerLink="/app/home" /> : null}

               <LinksGroup _key="/app/dashboard" header="Dashboard" headerLink="/app/dashboard" />

               <LinksGroup
                  _key="inventory"
                  header="Inventory"
                  childrenLinks={[
                     { _key: "/app/certificates", name: "Certificates", link: "/app/certificates" },
                     { _key: "/app/authorities", name: "Authorities", link: "/app/authorities" },
                     { _key: "/app/raprofiles", name: "RA Profiles", link: "/app/raprofiles" },
                     { _key: "/app/groups", name: "Certificate Groups", link: "/app/groups" },
                     { _key: "/app/complianceprofiles", name: "Compliance Profiles", link: "/app/complianceprofiles" },
                  ]}
               />

               <LinksGroup _key="/app/connectors" header="Connectors" headerLink="/app/connectors" />
               <LinksGroup _key="/app/credentials" header="Credentials" headerLink="/app/credentials" />
               <LinksGroup _key="/app/discovery" header="Discovery" headerLink="/app/discovery" />

               <LinksGroup
                  _key="acm1"
                  header="ACME"
                  childrenLinks={[
                     { _key: "/app/acmeaccounts", name: "ACME Accounts", link: "/app/acmeaccounts" },
                     { _key: "/app/acmeprofiles", name: "ACME Profiles", link: "/app/acmeprofiles" },
                  ]}
               />

               <LinksGroup
                  _key="devices"
                  header="Entity Management"
                  childrenLinks={[
                     { _key: "/app/entities", name: "Entities", link: "/app/entities" },
                     { _key: "/app/locations", name: "Locations", link: "/app/locations" },
                  ]}
               />

               <LinksGroup
                  _key="users"
                  header="User Management"
                  childrenLinks={[
                     { _key: "/app/administrators", name: "Administrators", link: "/app/administrators" },
                     { _key: "/app/clients", name: "Clients", link: "/app/clients" }
                  ]}
               />
               <LinksGroup _key="/app/audit" header="Audit Logs" headerLink="/app/audit" />
               {!inFrame ? (<LinksGroup _key="/app/about" header="About" headerLink="/app/about" />) : null}

            </ul>

         </div>

      </nav>
   );
}

export default withRouter(Sidebar);
