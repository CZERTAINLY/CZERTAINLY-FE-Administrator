import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import logo from 'resources/images/czertainly_logo.svg';
import style from './style.module.scss';

export default function AppLogin() {
    const [searchParams] = useSearchParams();

    const redirect = useCallback(() => {
        const redirect = encodeURIComponent(searchParams.get('redirect') || '');
        window.location.href = `${__ENV__.LOGIN_URL}?redirect=${redirect}`;
    }, [searchParams]);

    return (
        <div className={style.container}>
            <img src={logo} alt="Czertainly" />
            <h3>You are not authorized to view this page</h3>
            <p>If you believe you should have access, check your client certificate or try another login method.</p>
            <button onClick={() => redirect()}>Login</button>
        </div>
    );
}
