import { AttributeDescriptorDTO } from "api/.common/AttributeDTO";
import { AuthorityDTO } from "api/authority";


export interface DbAuthority extends AuthorityDTO {
   issueAttributes: AttributeDescriptorDTO[];
   revokeAttributes: AttributeDescriptorDTO[];
}


interface DbAuthoritiesList {
   [key: string]: DbAuthority;
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
      ],

      issueAttributes: [
         {
            "uuid": "0b378474-ebe9-4a17-9d3d-0577eb16aa34",
            "name": "email",
            "label": "Email",
            "type": "STRING",
            "required": false,
            "readOnly": false,
            "editable": true,
            "visible": true,
            "multiValue": false,
            "description": "End Entity email address"
         },
         {
            "uuid": "2cfd8c1a-e867-42f1-ab6c-67fb1964e163",
            "name": "san",
            "label": "Subject Alternative Name",
            "type": "STRING",
            "required": false,
            "readOnly": false,
            "editable": true,
            "visible": true,
            "multiValue": false,
            "description": "Comma separated Subject Alternative Names"
         },
         {
            "uuid": "72324d22-12cb-47ee-a02e-0b1da2013eee",
            "name": "extension",
            "label": "Extension Data",
            "type": "STRING",
            "required": false,
            "readOnly": false,
            "editable": true,
            "visible": true,
            "multiValue": false,
            "description": "Comma separated Extension Data"
         }
      ],

      revokeAttributes: [
      ]

   }

}
