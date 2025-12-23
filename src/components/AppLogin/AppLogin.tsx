import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';

export default function AppLogin() {
    const [searchParams] = useSearchParams();

    const redirect = useCallback(() => {
        const redirect = encodeURIComponent(searchParams.get('redirect') || '');
        window.location.href = `${__ENV__.LOGIN_URL}?redirect=${redirect}`;
    }, [searchParams]);

    useEffect(() => {
        redirect();
    }, [redirect]);

    return null;
}
