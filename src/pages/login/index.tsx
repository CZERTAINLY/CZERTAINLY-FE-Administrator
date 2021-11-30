import React from 'react';

import styles from './login.module.scss';

function Login() {
  return (
    <div className={styles.loginRoot}>
      <h2 className={styles.heading}>
        <i className="fa fa-lock fa-2x" />
        &nbsp;
        You are not authorized to use this application
      </h2>
      <p className="lead">
        If you believe you should have access, check your client certificate or ask your administrator to grant you access.
      </p>
    </div>
  );
}

export default Login;
