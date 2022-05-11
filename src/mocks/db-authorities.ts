import { AuthorityDTO } from "api/authorities";

export interface DbAuthoritiesList {
   [key: string]: AuthorityDTO;
}

export const dbAuthorities: DbAuthoritiesList = {

   "ejbca-ca-instance1": {

      uuid: "HelloUUid1Test",
      name: "ejbca-ca-instance1",
      connectorUuid: "2",
      connectorName: "Name1",
      kind: "default",
      status: "Enabled",
      attributes: [
         {
            uuid: "hashgdh",
            name: "url",
            value: "https://lab01.3key.company/ejbca/ejbcaws/ejbcaws?wsdl",
         },
      ]

   }

}
