import { AttributeDescriptorDTO } from "api/.common/AttributeDTO";
import { AcmeAccountDTO } from "api/acme-account";
import { AcmeProfileDTO } from "api/acme-profile";
import { AdministratorDTO } from "api/administrators";
import { AuditLogDTO } from "api/auditLogs";
import { AuthorityDTO } from "api/authorities";

import { CertificateDTO } from "api/certificates";
import { ClientDTO } from "api/clients";
import { CredentialDetailDTO } from "api/credentials";
import { RaProfileDTO } from "api/profiles";
import { DBClient } from "./db-clients";

interface CredentialProviderFunctionGroupEndpoint {
   id: number;
   name: string;
   context: string;
   method: string;
   required: boolean;
}


interface CredentialProviderFunctionGroup {
   id: number;
   name: string;
   code: string;
   kinds: string[];
   endPoints: CredentialProviderFunctionGroupEndpoint[]
}


interface CredentialProvider {
   uuid: string;
   name: string;
   functionGroups: CredentialProviderFunctionGroup[];
   url: string;
   status: string;
}



interface EndEntityProfile {
   id: number;
   name: string;
}


interface CertificateProfile {
   id: number
   endEntityProfileId: number
   name: string
}


interface CertificationAuthority {
   id: number
   endEntityProfileId: number
   name: string
}


interface ConnectorFunctionGroupEndpoint {
   id: number
   name: string
   context: string
   method: string
   required: boolean
}


interface ConnectorFunctionGroup {
   id: number
   name: string
   code: string
   kinds: Array<string>
   endPoints: ConnectorFunctionGroupEndpoint[];
}


interface Connector {
   uuid: string
   name: string
   status: string
   authType: string
   authAttributes: Array<any>
   functionGroups: ConnectorFunctionGroup[];
   url: string
}




export interface DBData {

   acmeAccounts: AcmeAccountDTO[];

   acmeProfiles: AcmeProfileDTO[];

   administrators: AdministratorDTO[];

   auditLogs: AuditLogDTO[];
   auditLogsOperations: string[],
   auditLogsStatuses: string[],
   auditLogsOrigins: string[],

   authorities: AuthorityDTO[];

   certificates: CertificateDTO[];

   clients: DBClient[];

   connectors: Connector[];
   connectorAttributes: AttributeDescriptorDTO[];

   credentials: CredentialDetailDTO[];
   credentialProviders: CredentialProvider[];
   credentialProviderAttributes: AttributeDescriptorDTO[];

   raProfiles: RaProfileDTO[];
   raProfilesAttributes: AttributeDescriptorDTO[];

   endEntityProfiles: EndEntityProfile[];

   certificateProfiles: CertificateProfile[];
   certificationAuthorities: CertificationAuthority[];


   allAttributeResponse: {
      authorityProvider: {
        ADCS: Array<{
          uuid: string
          name: string
          label: string
          type: string
          required: boolean
          readOnly: boolean
          editable: boolean
          visible: boolean
          multiValue: boolean
          description: string
          value: any
          validationRegex?: string
          attributeCallback?: {
            callbackMethod: string
            mappings: Array<{
              from: string
              to: string
              attributeType: string
              targets: Array<string>
              value: string
            }>
          }
        }>
      }
      discoveryProvider: {
        ADCS: Array<{
          uuid: string
          name: string
          label: string
          type: string
          required: boolean
          readOnly: boolean
          editable: boolean
          visible: boolean
          multiValue: boolean
          value: Array<string>
        }>
      }
    }

}