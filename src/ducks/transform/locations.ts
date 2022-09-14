import { LocationCertificateDTO, LocationDTO } from "api/location";

import { LocationCertificateModel, LocationModel } from "models/locations";
import { transformAttributeDTOToModel } from "./attributes";


export function transformLocationCertificateDtoToModel(locationCertificate: LocationCertificateDTO): LocationCertificateModel {

   return {
      certificateUuid: locationCertificate.certificateUuid,
      commonName: locationCertificate.commonName,
      serialNumber: locationCertificate.serialNumber,
      metadata: locationCertificate.metadata,
      pushAttributes: locationCertificate.pushAttributes ? locationCertificate.pushAttributes.map(transformAttributeDTOToModel) : [],
      csrAttributes: locationCertificate.csrAttributes ? locationCertificate.csrAttributes.map(transformAttributeDTOToModel) : [],
      withKey: locationCertificate.withKey
   };

}


export function transformLocationDtoToModel(location: LocationDTO): LocationModel {

   return {
      uuid: location.uuid,
      name: location.name,
      description: location.description,
      entityInstanceUuid: location.entityInstanceUuid,
      entityInstanceName: location.entityInstanceName,
      attributes: location.attributes ? location.attributes.map(transformAttributeDTOToModel) : [],
      enabled: location.enabled,
      supportMultipleEntries: location.supportMultipleEntries,
      supportKeyManagement: location.supportKeyManagement,
      certificates: location.certificates ? location.certificates.map(transformLocationCertificateDtoToModel) : [],
      metadata: location.metadata
   };

}