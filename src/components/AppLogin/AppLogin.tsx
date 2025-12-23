import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export default function AppLogin() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const redirectParam = encodeURIComponent(searchParams.get('redirect') || '');
        window.location.href = `${__ENV__.LOGIN_URL}?redirect=${redirectParam}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
