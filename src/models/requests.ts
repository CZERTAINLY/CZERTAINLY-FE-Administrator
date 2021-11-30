export interface Request {
  id: string;
  name: string;
  type: string;
  required: boolean;
  value: any;
  readonly: boolean;
  visible: boolean;
  validationRegex: string;
  description: string;
  action: string;
}
