import { ApiClients } from "api";

import {
  initialState as initialAdministratorsState,
  State as AdministratorsState,
  statePath as administratorsStatePath,
} from "./administrators";
import {
  initialState as initialAlertsState,
  State as AlertsState,
  statePath as alertsStatePath,
} from "./alerts";
import {
  initialState as initialAuthState,
  State as AuthState,
  statePath as authStatePath,
} from "./auth";
import {
  initialState as initialClientsState,
  State as ClientsState,
  statePath as clientsStatePath,
} from "./clients";
import {
  initialState as initialCredentialsState,
  State as CredentialsState,
  statePath as credentialStatePath,
} from "./credentials";
import {
  initialState as initialConnectorsState,
  State as ConnectorsState,
  statePath as connectorStatePath,
} from "./connectors";
import {
  initialState as initialAuthoritiesState,
  State as AuthoritiesState,
  statePath as authorityStatePath,
} from "./ca-authorities";
import {
  initialState as initialProfilesState,
  State as ProfilesState,
  statePath as profileStatePath,
} from "./ra-profiles";
import {
  initialState as initialCertificatesState,
  State as CertificatesState,
  statePath as certificatesStatePath,
} from "./certificates";

export interface State {
  [certificatesStatePath]: CertificatesState;
  [administratorsStatePath]: AdministratorsState;
  [alertsStatePath]: AlertsState;
  [authStatePath]: AuthState;
  [clientsStatePath]: ClientsState;
  [profileStatePath]: ProfilesState;
  [credentialStatePath]: CredentialsState;
  [connectorStatePath]: ConnectorsState;
  [authorityStatePath]: AuthoritiesState;
}

export const initialState: State = {
  [certificatesStatePath]: initialCertificatesState,
  [administratorsStatePath]: initialAdministratorsState,
  [alertsStatePath]: initialAlertsState,
  [authStatePath]: initialAuthState,
  [clientsStatePath]: initialClientsState,
  [profileStatePath]: initialProfilesState,
  [credentialStatePath]: initialCredentialsState,
  [connectorStatePath]: initialConnectorsState,
  [authorityStatePath]: initialAuthoritiesState,
};

export interface EpicDependencies {
  apiClients: ApiClients;
}
