import React from "react";
import { useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { selectors } from "ducks/auth";

import LinksGroup from "./LinksGroup";
import style from "./Sidebar.module.scss";
import logo from "images/czertainly_white_H.svg";
import { inIframe } from "utils/commons";

function Sidebar() {
  const isSuperAdmin = useSelector(selectors.isSuperAdmin);
  const inFrame = inIframe();
  return (
    <nav className={style.root}>
      <header className={style.logo}>
        <Link to="/app/home">
          <img src={logo} alt="CZERTAINLY Logo" />
        </Link>
      </header>
      <ul className={style.nav}>
        {!inFrame ? <LinksGroup header="Home" headerLink="/app/home" /> : null}

        <LinksGroup header="RA Profiles" headerLink="/app/raprofiles" />
        {isSuperAdmin ? (
          <LinksGroup
            header="Administrators"
            headerLink="/app/administrators"
          />
        ) : null}
        <LinksGroup header="Clients" headerLink="/app/clients" />
        <LinksGroup header="Connectors" headerLink="/app/connectors" />
        <LinksGroup header="Credentials" headerLink="/app/credentials" />
        <LinksGroup header="Authorities" headerLink="/app/authorities" />

        <LinksGroup header="Audit Logs" headerLink="/app/audit" />
        {!inFrame ? (
          <LinksGroup header="About" headerLink="/app/about" />
        ) : null}
      </ul>
    </nav>
  );
}

export default withRouter(Sidebar);
