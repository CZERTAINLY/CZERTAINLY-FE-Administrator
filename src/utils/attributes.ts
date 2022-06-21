export const attributeFieldNameTransform: { [name: string]: string } = {
   name: "Name",
   credentialProvider: "Credential Provider",
   authorityProvider: "Authority Provider",
   discoveryProvider: "Discovery Provider",
   legacyAuthorityProvider: "Legacy Authority Provider",
};


export const attributeFieldTypeTransform: { [name: string]: string } = {
   BOOLEAN: "checkbox",
   INTEGER: "number",
   FLOAT: "number",
   STRING: "string",
   TEXT: "textarea",
   DATE: "date",
   TIME: "time",
   DATETIME: "datetime",
   FILE: "file",
   SECRET: "password",
   CREDENTIAL: "select",
   JSON: "select"
};
