import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { AttributeModel } from "models/attributes";
import { useCallback, useMemo } from "react";


export interface Props {
   attributes: AttributeModel[] | undefined;
}


export default function AttributeViewer({
   attributes = []
}: Props) {

   const getAttributeContent = useCallback(

      (attribute: AttributeModel) => {

         if (!attribute.type || !attribute.content || !attribute.content.value) return "Not set";

         const typeMap = {

            "BOOLEAN":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value ? "true" : "false").join(", ")
                  :
                  attribute.content.value ? "True" : "False",

            "INTEGER":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  parseInt(attribute.content.value as string, 10).toString(),

            "FLOAT":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  parseFloat(attribute.content.value as string).toString(),

            "STRING":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,

            "TEXT":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,

            "DATE":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,

            "TIME":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,


            "DATETIME":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,


            "FILE":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value =>
                     value.toString().length > 40 ? value.toString().substring(0, 40) + "..." : value.toString()).join(", ")
                  :
                  attribute.content.value.toString().length > 40 ? attribute.content.value.toString().substring(0, 40) + "..." : attribute.content.value.toString(),

            "SECRET": "*****",

            "CREDENTIAL":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,

            "JSON":
               attribute.content.value instanceof Array ?
                  attribute.content.value.map(value => value.toString()).join(", ")
                  :
                  attribute.content.value as string,

         }

         return typeMap[attribute.type] || "Unknown data type"

      },
      []

   );


   const tableHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "name",
            sortable: true,
            width: "20%",
         },
         {
            id: "type",
            content: "Type",
            sortable: true,
            width: "20%",
         },
         {
            id: "settings",
            content: "Settings",
            sortable: true,
            width: "80%",
         }
      ],
      []

   );

   const tableData: TableDataRow[] = useMemo(

      () => attributes.map(

         attribute => {
            return ({
               id: attribute.uuid,
               columns: [
                  attribute.label || "",
                  attribute.type || "",
                  getAttributeContent(attribute)
               ]
            })
         }

      ),
      [attributes, getAttributeContent]
   );


   return (
      <CustomTable
         headers={tableHeaders}
         data={tableData}
      />
   )

}

