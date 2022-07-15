import { DiscoveryDTO } from "api/discovery";
import { DiscoveryModel } from "models/discoveries";

export function transformDiscoveryDTOToModel(discovery: DiscoveryDTO): DiscoveryModel {
  return {
    uuid: discovery.uuid,
    name: discovery.name,
    connectorUuid: discovery.connectorUuid,
    connectorName: discovery.connectorName,
    status: discovery.status,
    totalCertificatesDiscovered: discovery.totalCertificatesDiscovered,
    startTime: discovery.startTime,
    endTime: discovery.endTime,
    attributes: discovery.attributes,
    certificate: discovery.certificate,
    meta: discovery.meta,
    kind: discovery.kind,
    message: discovery.message,
  };
}