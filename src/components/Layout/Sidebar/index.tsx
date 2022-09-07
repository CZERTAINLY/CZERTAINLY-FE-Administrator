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

         <ul className={style.nav}>

            {!inFrame ? <LinksGroup _key="/app/home" header="Home" headerLink="/app/home" /> : null}
            <LinksGroup _key="/app/dashboard" header="Dashboard" headerLink="/app/dashboard" />
            <LinksGroup _key="/app/raprofiles" header="RA Profiles" headerLink="/app/raprofiles" />
            {isSuperAdmin ? (<LinksGroup _key="/app/administrators" header="Administrators" headerLink="/app/administrators" />) : null}
            <LinksGroup _key="/app/clients" header="Clients" headerLink="/app/clients" />
            <LinksGroup _key="/app/connectors" header="Connectors" headerLink="/app/connectors" />
            <LinksGroup _key="/app/credentials" header="Credentials" headerLink="/app/credentials" />
            <LinksGroup _key="/app/authorities" header="Authorities" headerLink="/app/authorities" />
            <LinksGroup _key="/app/entities" header="Entities" headerLink="/app/entities" />
            <LinksGroup _key="/app/locations" header="Locations" headerLink="/app/locations" />

            <LinksGroup
               _key="acm1"
               header="ACME"
               childrenLinks={[
                  { _key: "/app/acmeaccounts", name: "ACME Accounts", link: "/app/acmeaccounts" },
                  { _key: "/app/acmeprofiles", name: "ACME Profiles", link: "/app/acmeprofiles" },
               ]}
            />
            <LinksGroup _key="/app/groups" header="Groups" headerLink="/app/groups" />
            <LinksGroup _key="/app/discovery" header="Discovery" headerLink="/app/discovery" />
            <LinksGroup _key="/app/complianceprofiles" header="Compliance Profiles" headerLink="/app/complianceprofiles" />
            <LinksGroup _key="/app/certificates" header="Certificates" headerLink="/app/certificates" />
            <LinksGroup _key="/app/audit" header="Audit Logs" headerLink="/app/audit" />

            {!inFrame ? (<LinksGroup _key="/app/about" header="About" headerLink="/app/about" />) : null}

         </ul>

      </nav>
   );
}

export default withRouter(Sidebar);
