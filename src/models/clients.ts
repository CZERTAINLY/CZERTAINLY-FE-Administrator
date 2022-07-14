import { CertificateModel } from "models";


export interface ClientModel {
  uuid: string;
  name: string;
  certificate: CertificateModel;
  enabled: boolean;
  description: string;
  serialNumber: string;
}


export interface ClientAuthorizedRaProfileModel {
   uuid: string;
   name: string;
   description: string;
   enabled: boolean;
}
