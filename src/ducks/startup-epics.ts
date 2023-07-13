import { AppEpic } from "ducks";

import { debounceTime, map, mergeMap, take } from "rxjs/operators";
import { actions as authActions } from "./auth";
import { actions as enumActions } from "./enums";
import { actions as notificationsActions } from "./notifications";
import { actions as settingsActions } from "./settings";

const startup: AppEpic = (action$) =>
    action$.pipe(
        take(1),
        mergeMap(() => [
            authActions.getProfile(),
            settingsActions.getPlatformSettings(),
            enumActions.getPlatformEnums(),
            notificationsActions.listOverviewNotifications(),
        ]),
    );

const repeated: AppEpic = (action$) =>
    action$.pipe(
        debounceTime(30000),
        map(() => notificationsActions.listOverviewNotifications()),
    );

const epics = [startup, repeated];

export default epics;
