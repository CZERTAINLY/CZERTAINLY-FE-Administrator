import { Observable } from "rxjs";
import { combineEpics, Epic } from "redux-observable";
import { AnyAction, combineReducers } from "redux";

import { ApiClients } from "api";

import statupEpics from "./startup-epics";

import { initialState as initialAlertsState, slice as alertsSlice } from "./alerts";

import { initialState as initialAuthState, slice as authSlice } from "./auth";
import authEpics from "./auth-epics";

import { initialState as initialAuditLogsState, slice as auditLogsSlice } from "./audit";
import auditLogsEpics from "./audit-epics";

import { initialState as initialAdministratorsState, slice as administratorsSlice } from "./administrators";
import administratorsEpics from "./administrators-epics";

import { initialState as initialCertificatesState, slice as certificatesSlice } from "./certificates";
import certificatesEpics from "./certificates-epic";

import { initialState as initialClientsState, slice as clientsSlice } from "./clients";
import clientsEpics from "./clients-epics";

import { initialState as initialConnectorsState, slice as connectorsSlice } from "./connectors";
import connectorsEpics from "./connectors-epic";

import { initialState as initialRaProfilesState, slice as raProfilesSlice } from "./ra-profiles";
import raProfilesEpics from "./ra-profiles-epics";

import { initialState as initialCredentialsState, slice as credentialsSlice} from "./credentials";
import credentialsEpics from "./credentials-epics";


/*
import { initialState as initialAuthoritiesState, State as AuthoritiesState, statePath as authorityStatePath } from "./ca-authorities";
import { initialState as initialAcmeAccountState, State as AcmeAccountState, statePath as acmeAccountStatePath } from "./acme-accounts";
import { initialState as initialAcmeProfilesState, State as AcmeProfilesState, statePath as acmeProfileStatePath } from "./acme-profiles";
*/

/*
import authoritiesEpic from "./ca-authorities-epics";
import acmeAccountEpics from "./acme-accounts-epics";
import acmeProfileEpics from "./acme-profiles-epics";
*/

export interface EpicDependencies {
   apiClients: ApiClients;
}

export type AppState = Observable<ReturnType<typeof reducers>>;

export type AppEpic = Epic<AnyAction, AnyAction, AppState, EpicDependencies>;

export const initialState = {
   [alertsSlice.name]: initialAlertsState,
   [auditLogsSlice.name]: initialAuditLogsState,
   [authSlice.name]: initialAuthState,
   [administratorsSlice.name]: initialAdministratorsState,
   [certificatesSlice.name]: initialCertificatesState,
   [clientsSlice.name]: initialClientsState,
   [connectorsSlice.name]: initialConnectorsState,
   [raProfilesSlice.name]: initialRaProfilesState,
   [credentialsSlice.name]: initialCredentialsState

   /*
      [authorityStatePath]: initialAuthoritiesState,
      [acmeAccountStatePath]: initialAcmeAccountState,
      [acmeProfileStatePath]: initialAcmeProfilesState,
   */
};

export const reducers = combineReducers<typeof initialState, any>({
   [alertsSlice.name]: alertsSlice.reducer,
   [auditLogsSlice.name]: auditLogsSlice.reducer,
   [authSlice.name]: authSlice.reducer,
   [certificatesSlice.name]: certificatesSlice.reducer,
   [administratorsSlice.name]: administratorsSlice.reducer,
   [clientsSlice.name]: clientsSlice.reducer,
   [connectorsSlice.name]: connectorsSlice.reducer,
   [raProfilesSlice.name]: raProfilesSlice.reducer,
   [credentialsSlice.name]: credentialsSlice.reducer

   /*
   [authoritiesStatePath]: authoritiesReducer,
   [acmeAccountStatePath]: acmeAccountReducer,
   [acmeProfilesStatePath]: acmeProfilesReducer,
   */
});


export const epics = combineEpics(
   ...statupEpics,
   ...authEpics,
   ...auditLogsEpics,
   ...certificatesEpics,
   ...administratorsEpics,
   ...clientsEpics,
   ...connectorsEpics,
   ...raProfilesEpics,
   ...credentialsEpics

   /*
  ...authoritiesEpic,
  ...acmeAccountEpics,
  ...acmeProfileEpics*/
);
