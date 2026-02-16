import { useLocation } from 'react-router';

export default function TestRouteDisplay() {
    const location = useLocation();
    return <span data-testid="route">{location.pathname}</span>;
}
