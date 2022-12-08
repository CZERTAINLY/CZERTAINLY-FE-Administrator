import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { useCallback, useMemo } from "react";
import { AttributeResponseModel } from "types/attributes";
import { getAttributeContent } from "utils/attributes/attributes";


export interface Props {
   attributes: AttributeResponseModel[] | undefined;
   hasHeader?: boolean
}


export default function AttributeViewer({
   attributes = [],
   hasHeader = true
}: Props) {

   const getContent = useCallback(getAttributeContent,[]);


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
                  attribute.contentType || "",
                   getContent(attribute.contentType, attribute.content)
               ]
            })
         }

      ),
      [attributes, getContent]
   );


   return (
      <CustomTable
         headers={tableHeaders}
         data={tableData}
         hasHeader={hasHeader}
      />
   )

}
