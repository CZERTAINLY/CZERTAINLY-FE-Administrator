import { AttributeModel } from "./attributes/AttributeModel";
import { RaProfileModel } from "./ra-profiles";

export interface AcmeProfileListItemModel {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   raProfileName?: string;
   raProfileUuid?: string;
   directoryUrl?: string;
}


export interface AcmeProfileModel {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   termsOfServiceUrl?: string;
   websiteUrl?: string;
   dnsResolverIp?: string;
   dnsResolverPort?: string;
   raProfile?: RaProfileModel;
   retryInterval?: number;
   termsOfServiceChangeDisable?: boolean;
   validity?: number;
   directoryUrl?: string;
   termsOfServiceChangeUrl?: string;
   requireContact?: boolean;
   requireTermsOfService?: boolean;
   issueCertificateAttributes?: AttributeModel[];
   revokeCertificateAttributes?: AttributeModel[];
}