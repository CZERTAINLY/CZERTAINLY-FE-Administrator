import { Epic } from 'redux-observable';

import { mergeMap, take } from 'rxjs/operators';
import { Action as AuthAction, actions as authActions } from './auth';

const startup: Epic<AuthAction, AuthAction> = action$ => action$.pipe(
  take(1),
  mergeMap(() => [
    authActions.requestProfile(),
  ]),
);

const epics = [
  startup,
];

export default epics;
