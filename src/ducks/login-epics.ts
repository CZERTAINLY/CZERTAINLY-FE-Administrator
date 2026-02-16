import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { BaseAPI, Configuration } from 'types/openapi/runtime';
import { AppEpic } from 'ducks';
import * as slice from './login';

class LoginApi extends BaseAPI {
    getLoginMethods(redirect?: string): Observable<Array<{ name: string; loginUrl: string }>> {
        const query: Record<string, string> = {};
        query.redirect = redirect || 'dashboard';
        return this.request<Array<{ name: string; loginUrl: string }>>({
            url: '/login',
            method: 'GET',
            query,
        });
    }
}

const getLoginMethods: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getLoginMethods.match),
        switchMap((action) => {
            const apiUrl = (window as any).__ENV__?.API_URL || '/api';
            const config = new Configuration({ basePath: apiUrl });
            const loginApi = new LoginApi(config);
            return loginApi.getLoginMethods(action.payload.redirect).pipe(
                map((loginMethods) => slice.actions.getLoginMethodsSuccess({ loginMethods })),

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
