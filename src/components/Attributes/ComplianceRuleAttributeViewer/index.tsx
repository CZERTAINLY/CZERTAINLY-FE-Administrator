import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { AttributeModel } from "models/attributes/AttributeModel";
import { useCallback, useMemo } from "react";


export interface Props {
   attributes: AttributeModel[] | undefined;
   hasHeader?: boolean
}


export default function AttributeViewer({
   attributes = [],
   hasHeader = true
}: Props) {

   const getAttributeContent = useCallback(

      (attribute: AttributeModel) => {

         if (!attribute.type || !attribute.content) return "Not set";

         const typeMap = {

            "BOOLEAN":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value !== undefined ? content.value ? "true" : "false" : "Not set").join(", ")
                  :
                  attribute.content.value ? "True" : "False",

            "INTEGER":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? parseInt(attribute.content.value as string, 10).toString() : "Not set",

            "FLOAT":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? parseFloat(attribute.content.value as string).toString() : "Not set",

            "STRING":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",

            "TEXT":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",

            "DATE":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",

            "TIME":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",


            "DATETIME":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",


            "FILE":
               Array.isArray(attribute.content) ?
                  attribute.content.map(
                     content =>
                        content.value ?
                           content.value.toString().length > 40 ? content.value.toString().substring(0, 40) + "..." : content.value.toString()
                           :
                           "Not set"
                  ).join(", ")
                  :
                  attribute.content.value ?
                     attribute.content.value.toString().length > 40 ? attribute.content.value.toString().substring(0, 40) + "..." : attribute.content.value.toString()
                     :
                     "Not set",

            "SECRET": "*****",

            "CREDENTIAL":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",

            "JSON":
               Array.isArray(attribute.content) ?
                  attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
                  :
                  attribute.content.value ? attribute.content.value as string : "Not set",

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
               id: attribute.uuid || "",
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
         hasHeader={hasHeader}
      />
   )

}

