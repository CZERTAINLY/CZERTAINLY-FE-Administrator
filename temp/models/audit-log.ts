export interface AuditLog {
  id: number;
  author: string;
  created: Date;
  operationStatus: number;
  origination: string;
  affected: string;
  objectIdentifier: string;
  operation: number;
  additionalData: any;
}
