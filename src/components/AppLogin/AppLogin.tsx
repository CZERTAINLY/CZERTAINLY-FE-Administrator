import React from "react";

import logo from "resources/images/czertainly_logo.svg";
import style from "./style.module.scss";

export default function AppLogin() {

   return (

      <div className={style.container}>

         <h3>You are not authorized to view this page</h3>
         <img src={logo} alt="Czertainly" />
         <button onClick={() => { window.location.href = __ENV__.LOGIN_URL; }}>Login</button>

      </div>

   )

}