import { AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";
import { RaProfileDTO } from "api/profiles";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";


export interface AcmeProfileListItemDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   raProfileName?: string;
   raProfileUuid?: string;
   directoryUrl?: string;
}


export interface AcmeProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   termsOfServiceUrl?: string;
   websiteUrl?: string;
   dnsResolverIp?: string;
   dnsResolverPort?: string;
   raProfile?: RaProfileDTO;
   retryInterval?: number;
   termsOfServiceChangeDisable?: boolean;
   validity?: number;
   directoryUrl?: string;
   termsOfServiceChangeUrl?: string;
   requireContact?: boolean;
   requireTermsOfService?: boolean;
   issueCertificateAttributes?: AttributeDTO[];
   revokeCertificateAttributes?: AttributeDTO[];
}

