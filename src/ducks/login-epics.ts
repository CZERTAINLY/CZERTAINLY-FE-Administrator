import { EMPTY, from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { AppEpic } from 'ducks';
import * as slice from './login';

function fetchLoginMethods(
    apiUrl: string,
    redirectParam: string,
): Promise<{ loginMethods?: Array<{ name: string; loginUrl: string }>; redirectUrl?: string }> {
    const url = `${apiUrl}/login?redirect=${encodeURIComponent(redirectParam)}`;
    return fetch(url, { method: 'GET', redirect: 'manual', credentials: 'same-origin' }).then((response) => {
        if (response.status === 302) {
            const location = response.headers.get('Location');
            if (!location) throw new Error('302 without Location');
            let redirectUrl: string;
            if (location.startsWith('http')) {
                redirectUrl = location;
            } else if (location.startsWith('/')) {
                redirectUrl = `${window.location.origin}${location}`;
            } else {
                const base = apiUrl.startsWith('http')
                    ? apiUrl.replace(/\/$/, '')
                    : `${window.location.origin}${apiUrl.startsWith('/') ? apiUrl : `/${apiUrl}`}`.replace(/\/$/, '');
                redirectUrl = `${base}/${location}`;
            }
            return { redirectUrl };
        }
        if (response.ok) {
            return response.json().then((data) => ({
                loginMethods: Array.isArray(data) ? data : (data?.loginMethods ?? []),
            }));
        }
        throw new Error(response.statusText || 'Failed to load login methods');
    });
}

const getLoginMethods: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getLoginMethods.match),
        switchMap((action) => {
            const apiUrl = (window as any).__ENV__?.API_URL || '/api';
            const redirectParam = action.payload.redirect || 'dashboard';
            return from(fetchLoginMethods(apiUrl, redirectParam)).pipe(
                switchMap((result) => {
                    if (result.redirectUrl) {
                        window.location.assign(result.redirectUrl);
                        return EMPTY;
                    }
                    return of(slice.actions.getLoginMethodsSuccess({ loginMethods: result.loginMethods ?? [] }));
                }),
                catchError((err) => {
                    const errorMessage = err?.response?.message || err?.message || 'Failed to load login methods';
                    return of(slice.actions.getLoginMethodsFailure({ error: errorMessage }));
                }),
            );
        }),
    );
};

export const epics = [getLoginMethods];

export default epics;
