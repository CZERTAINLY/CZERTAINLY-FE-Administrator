import { EMPTY, from, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AppEpic } from 'ducks';
import * as slice from './login';

async function fetchLoginMethods(
    apiUrl: string,
    redirectParam: string,
): Promise<{ loginMethods?: Array<{ name: string; loginUrl: string }>; redirectUrl?: string }> {
    const url = `${apiUrl}/login?redirect=${encodeURIComponent(redirectParam)}`;

    const response = await fetch(url, { method: 'GET', credentials: 'same-origin' });
    if (response.ok) {
        return response.text().then((text) => {
            try {
                return parseLoginMethods(text, apiUrl, redirectParam);
            } catch {
                throw new Error('Failed to parse login methods');
            }
        });
    }
    throw new Error(response.statusText || 'Failed to load login methods');
}

const parseLoginMethods = (text: string, apiUrl: string, redirectParam: string) => {
    const loginMethods = JSON.parse(text);

    if (loginMethods.length === 1) {
        const loginUrl = loginMethods[0].loginUrl;
        let redirectUrl;
        if (loginUrl.startsWith('http')) {
            redirectUrl = loginUrl;
        } else if (loginUrl.startsWith('/')) {
            redirectUrl = `${window.location.origin}${loginUrl}`;
        } else {
            const base = apiUrl.startsWith('http')
                ? apiUrl.replace(/\/$/, '')
                : `${window.location.origin}${apiUrl.startsWith('/') ? apiUrl : `/${apiUrl}`}`.replace(/\/$/, '');
            redirectUrl = `${base}/${loginUrl}`;
        }

        return { redirectUrl: `${redirectUrl}?redirect=${encodeURIComponent(redirectParam)}` };
    }

    return { loginMethods };
};

const getLoginMethods: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getLoginMethods.match),
        switchMap((action) => {
            const apiUrl = window.__ENV__?.API_URL || '/api';
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
