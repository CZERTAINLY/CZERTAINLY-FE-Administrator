import React from 'react';

import styles from './login.module.scss';

function Login() {

   const params = new URLSearchParams(window.location.search);
   const redir = params.get('redirect');

   const redirect = redir ? "?redirect=" + redir : "";

   return (

      <div className={styles.loginRoot}>

         <h2 className={styles.heading}>
            <i className="fa fa-lock fa-2x" />
            &nbsp;
            You are not authorized to use this application
         </h2>

         <p className="lead">
            If you believe you should have access, check your client certificate or try another <strong><a href={`${(window as any).__ENV__.LOGIN_URL}${redirect}`}>login</a> method.</strong>
         </p>

      </div>

   );

}

export default Login;
