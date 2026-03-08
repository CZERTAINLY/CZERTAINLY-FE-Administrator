import { EMPTY, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AppEpic } from 'ducks';
import { extractError } from 'utils/net';
import * as slice from './login';
import { loginRedirect } from 'utils/login-redirect';

const getLoginMethods: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getLoginMethods.match),
        switchMap((action) => {
            const redirectParam = action.payload.redirect || 'dashboard';
            return deps.apiClients.login.getOAuth2Providers({}).pipe(
                switchMap((loginMethods) => {
                    if (loginMethods.length === 1) {
                        loginRedirect(loginMethods[0].loginUrl, redirectParam);
                        return EMPTY;
                    }
                    return of(slice.actions.getLoginMethodsSuccess({ loginMethods }));
                }),
                catchError((err) => {
                    return of(slice.actions.getLoginMethodsFailure({ error: extractError(err, 'Failed to load login methods') }));
                }),
            );
        }),
    );
};

export const epics = [getLoginMethods];

export default epics;
