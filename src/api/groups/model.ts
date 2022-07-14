import { Observable } from "rxjs";


export interface GroupDTO {
  uuid: string;
  name: string;
  description?: string;
}

export interface GroupManagementApi {
  createNewGroup(name: string, description: any): Observable<string>;
  getGroupsList(): Observable<GroupDTO[]>;
  getGroupDetail(uuid: string): Observable<GroupDTO>;
  deleteGroup(uuid: string): Observable<void>;
  bulkDeleteGroup(uuid: string[]): Observable<void>;
  updateGroup(
    uuid: string,
    name: string,
    description: string
  ): Observable<GroupDTO>;
}
