import { AcmeAccountDTO, AcmeAccountListItemDTO } from "api/acme-account";
import { AcmeAccountListModel, AcmeAccountModel } from "models/acme-accounts";

export function transformAcmeAccountListDtoToModel(acmeAccountDto: AcmeAccountListItemDTO): AcmeAccountListModel {

   return {
      accountId: acmeAccountDto.accountId,
      uuid: acmeAccountDto.uuid,
      enabled: acmeAccountDto.enabled,
      totalOrders: acmeAccountDto.totalOrders,
      status: acmeAccountDto.status,
      raProfileName: acmeAccountDto.raProfileName,
      acmeProfileName: acmeAccountDto.acmeProfileName
   }

}

export function transformAcmeAccountDtoToModel(acmeAccountDto: AcmeAccountDTO): AcmeAccountModel {

   return {
      accountId: acmeAccountDto.accountId,
      uuid: acmeAccountDto.uuid,
      enabled: acmeAccountDto.enabled,
      totalOrders: acmeAccountDto.totalOrders,
      successfulOrders: acmeAccountDto.successfulOrders,
      failedOrders: acmeAccountDto.failedOrders,
      pendingOrders: acmeAccountDto.pendingOrders,
      validOrders: acmeAccountDto.validOrders,
      processingOrders: acmeAccountDto.processingOrders,
      status: acmeAccountDto.status,
      contact: acmeAccountDto.contact,
      termsOfServiceAgreed: acmeAccountDto.termsOfServiceAgreed,
      raProfileName: acmeAccountDto.raProfileName,
      raProfileUuid: acmeAccountDto.raProfileUuid,
      acmeProfileName: acmeAccountDto.acmeProfileName,
      acmeProfileUuid: acmeAccountDto.acmeProfileUuid
   }

}