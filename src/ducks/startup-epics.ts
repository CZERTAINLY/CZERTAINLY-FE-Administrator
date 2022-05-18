import { AppEpic } from "ducks";

import { mergeMap, take } from "rxjs/operators";
import { actions as authActions } from "./auth";

const startup: AppEpic = action$ => action$.pipe(
  take(1),
  mergeMap(() => [
    authActions.getProfile(),
  ]),
);

const epics = [
  startup,
];

export default epics;
