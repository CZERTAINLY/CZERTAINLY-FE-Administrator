import { AppEpic } from "ducks";

import { mergeMap, take } from "rxjs/operators";
import { actions as authActions } from "./auth";
import { actions as enumActions } from "./enums";
import { actions as settingsActions } from "./settings";

const startup: AppEpic = (action$) =>
    action$.pipe(
        take(1),
        mergeMap(() => [authActions.getProfile(), settingsActions.getPlatformSettings(), enumActions.getPlatformEnums()]),
    );

const epics = [startup];

export default epics;
