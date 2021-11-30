import { Observable } from 'rxjs';

import { AuditLog, PagedData } from 'models';

export type AuditLogResponse = PagedData<AuditLog>;

export interface AuditLogsApi {
  getLogs(page: number, size: number, sort?: string, filters?: { [key: string]: string }): Observable<AuditLogResponse>;

  getObjects(): Observable<string[]>;

  getOperations(): Observable<string[]>;

  getStatuses(): Observable<string[]>;
}
