import { AuthApi, AuthBackend, AuthMock } from "./auth";
import { UserManagementApi, UserManagementBackend, UserManagementMock } from "./users";
import { RolesManagementApi, RolesManagementBackend, RolesManagementMock } from "./roles";
import { FetchHttpServiceImpl } from "utils/FetchHttpService";


const fetchService = new FetchHttpServiceImpl((window as any).__ENV__.API_URL);


export interface ApiClients {
    auth: AuthApi;
    users: UserManagementApi;
    roles: RolesManagementApi;
}


export const backendClient: ApiClients = {
    auth: new AuthBackend(fetchService),
    users: new UserManagementBackend(fetchService),
    roles: new RolesManagementBackend(fetchService),
};


export const mockClient: ApiClients = {
    auth: new AuthMock(),
    users: new UserManagementMock(),
    roles: new RolesManagementMock(),
};
