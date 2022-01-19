import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

import { State } from "./app-state";

import {
  reducer as administratorsReducer,
  statePath as administratorsStatePath,
} from "./administrators";
import {
  reducer as alertsReducer,
  statePath as alertsStatePath,
} from "./alerts";
import { reducer as authReducer, statePath as authStatePath } from "./auth";
import {
  reducer as clientsReducer,
  statePath as clientsStatePath,
} from "./clients";

import {
  reducer as credentialsReducer,
  statePath as credentialsStatePath,
} from "./credentials";

import {
  reducer as authoritiesReducer,
  statePath as authoritiesStatePath,
} from "./ca-authorities";

import {
  reducer as connectorsReducer,
  statePath as connectorsStatePath,
} from "./connectors";

import {
  reducer as profilesReducer,
  statePath as profilesStatePath,
} from "./ra-profiles";
import {
  reducer as certificatesReducer,
  statePath as certificatesStatePath,
} from "./certificates";

import {
  reducer as acmeAccountReducer,
  statePath as acmeAccountStatePath,
} from "./acme-accounts";

import {
  reducer as acmeProfilesReducer,
  statePath as acmeProfilesStatePath,
} from "./acme-profiles";

import adminEpics from "./administrators-epics";
import authEpics from "./auth-epics";
import clientsEpics from "./clients-epics";
import profileEpics from "./ra-profiles-epics";
import statupEpics from "./startup-epics";
import credentialsEpic from "./credentials-epics";
import connectorsEpic from "./connectors-epic";
import authoritiesEpic from "./ca-authorities-epics";
import certificateEpics from "./certificates-epic";
import acmeAccountEpics from "./acme-accounts-epics";
import acmeProfileEpics from "./acme-profiles-epics";

export const reducers = combineReducers<State, any>({
  [certificatesStatePath]: certificatesReducer,
  [administratorsStatePath]: administratorsReducer,
  [alertsStatePath]: alertsReducer,
  [authStatePath]: authReducer,
  [clientsStatePath]: clientsReducer,
  [profilesStatePath]: profilesReducer,
  [credentialsStatePath]: credentialsReducer,
  [connectorsStatePath]: connectorsReducer,
  [authoritiesStatePath]: authoritiesReducer,
  [acmeAccountStatePath]: acmeAccountReducer,
  [acmeProfilesStatePath]: acmeProfilesReducer,
});

export const epics = combineEpics(
  ...adminEpics,
  ...authEpics,
  ...clientsEpics,
  ...profileEpics,
  ...statupEpics,
  ...credentialsEpic,
  ...connectorsEpic,
  ...authoritiesEpic,
  ...certificateEpics,
  ...acmeAccountEpics,
  ...acmeProfileEpics
);
