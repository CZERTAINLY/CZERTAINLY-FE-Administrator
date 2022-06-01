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




/*
import { initialState as initialCredentialsState, State as CredentialsState, statePath as credentialStatePath } from "./credentials";
import { initialState as initialAuthoritiesState, State as AuthoritiesState, statePath as authorityStatePath } from "./ca-authorities";
import { initialState as initialProfilesState, State as ProfilesState, statePath as profileStatePath } from "./ra-profiles";
import { initialState as initialCertificatesState, State as CertificatesState, statePath as certificatesStatePath } from "./certificates";

import { initialState as initialAcmeAccountState, State as AcmeAccountState, statePath as acmeAccountStatePath } from "./acme-accounts";
import { initialState as initialAcmeProfilesState, State as AcmeProfilesState, statePath as acmeProfileStatePath } from "./acme-profiles";
*/



/*
import adminEpics from "./administrators-epics";
import profileEpics from "./ra-profiles-epics";
import credentialsEpic from "./credentials-epics";
import connectorsEpic from "./connectors-epic";
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
   /*
      [profileStatePath]: initialProfilesState,
      [credentialStatePath]: initialCredentialsState,
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
   /*
   [profilesStatePath]: profilesReducer,
   [credentialsStatePath]: credentialsReducer,
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
   /*...adminEpics,
  ...profileEpics,
  ...credentialsEpic,
  ...authoritiesEpic,
  ...acmeAccountEpics,
  ...acmeProfileEpics*/
);
