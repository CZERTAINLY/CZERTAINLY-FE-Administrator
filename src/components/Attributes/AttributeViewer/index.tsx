import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { AttributeModel } from "models/attributes/AttributeModel";
import { useCallback, useMemo } from "react";


export interface Props {
   attributes: AttributeModel[] | undefined;
   hasHeader?: boolean
}


export default function ComplianceRuleAttributeViewer({
   attributes = [],
   hasHeader = true
}: Props) {

   const getAttributeContent = useCallback(

      (attribute: AttributeModel) => {


         return Array.isArray(attribute.content) ?
            attribute.content.map(content => content.value ? content.value.toString() : "Not set").join(", ")
            :
            attribute?.content?.value ? attribute?.content?.value as string : "Not set";

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
            id: "value",
            content: "Value",
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
                  attribute.name || "",
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

