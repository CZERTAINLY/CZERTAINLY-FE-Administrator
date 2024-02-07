import { AppEpic } from 'ducks';

import { actions as settingsActions } from 'ducks/settings';
import { debounceTime, filter, map, mergeMap, take } from 'rxjs/operators';
import { actions as authActions } from './auth';
import { actions as enumActions } from './enums';
import { actions as notificationsActions } from './notifications';

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

const repeated: AppEpic = (action$, state) =>
    action$.pipe(
        debounceTime(30000),
        filter(() => !!state?.value?.auth?.profile?.uuid),
        map(() => notificationsActions.listOverviewNotifications()),
    );

const epics = [startup, repeated];

export default epics;
