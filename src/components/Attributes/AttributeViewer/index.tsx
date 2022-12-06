import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { useCallback, useMemo } from "react";
import { AttributeResponseModel } from "types/attributes";
import {
    AttributeContentType,
    BaseAttributeContent,
} from "types/openapi";


export interface Props {
   attributes: AttributeResponseModel[] | undefined;
   hasHeader?: boolean
}


export default function AttributeViewer({
   attributes = [],
   hasHeader = true
}: Props) {

   const getAttributeContent = useCallback(

      (attribute: AttributeResponseModel) => {

         if (!attribute.content) return "Not set";

          const mapping = function (content: BaseAttributeContent): string | undefined {
              switch (attribute.contentType) {
                  case AttributeContentType.Boolean:
                      return content.data ? "true" : "false"
                  case AttributeContentType.Credential:
                  case AttributeContentType.Object:
                  case AttributeContentType.File:
                      return content.reference;
                  case AttributeContentType.Time:
                  case AttributeContentType.Date:
                  case AttributeContentType.Datetime:
                  case AttributeContentType.Float:
                  case AttributeContentType.Integer:
                  case AttributeContentType.String:
                  case AttributeContentType.Text:
                      return content.data.toString();
                  case AttributeContentType.Secret:
                      return "*****";
              }
              return undefined;
          };

         return attribute.content.map(content => mapping(content) ?? "Unknown data type").join(", ");
      },
      []

   );


   const tableHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name",
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
