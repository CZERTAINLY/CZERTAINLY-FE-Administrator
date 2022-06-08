import { AttributeDescriptorModel } from "models/attributes"
import { attributeFieldNameTransform } from "models/attributes";
import { useCallback, useMemo } from "react";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

interface Props {
   attributeDescriptors: AttributeDescriptorModel[];
}

export default function AttributeDescriptorViewer({
   attributeDescriptors,
}: Props) {


   const getAttributeValues = useCallback(

      (attributeDescriptor: AttributeDescriptorModel) => {

         if (!attributeDescriptor.value) return "";

         if (
            typeof attributeDescriptor.value !== "string" &&
            ["LIST", "list", "array", "ARRAY", "BOOLEAN", "CREDENTIAL"].includes(
               attributeDescriptor.type
            )
         ) {
            return (attributeDescriptor.value as Array<any>)[0]
         } else {
            return attributeDescriptor.value;
         }

      },
      []

   );


   const headers: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name"
         },
         {
            id: "required",
            content: "Required"
         },
         {
            id: "defaultValue",
            content: "Default Value"
         }
      ],
      []

   );

   const data: TableDataRow[] = useMemo(

      () => attributeDescriptors.map(

         attributeDescriptor => ({

            id: attributeDescriptor.uuid,
            columns: [
               attributeDescriptor.label || attributeFieldNameTransform[attributeDescriptor.name] || attributeDescriptor.name,
               attributeDescriptor.required ? "Yes" : "No",
               getAttributeValues(attributeDescriptor),
               //getAttributeDetail(attributeDescriptor)
            ],
            detailColumns: [
               (
                  <>

                     <p>
                        <b>Name</b>: {attributeDescriptor.name}
                     </p>

                     <p>
                        <b>Type</b>: {attributeDescriptor.type}
                     </p>


                  </>
               ),
               (
                  <>
                     <p>
                        <b>Read Only</b>:{" "}
                        {attributeDescriptor.readOnly ? "Yes" : "No"}
                     </p>

                     <p>
                        <b>Editable</b>: {attributeDescriptor.editable ? "Yes" : "No"}
                     </p>
                  </>
               ),
               (
                  <>
                     <p>
                        <b>Visible</b>: {attributeDescriptor.visible ? "No" : "Yes"}
                     </p>

                     <p>
                        <b>Multiple Value</b>:{" "}
                        {attributeDescriptor.multiValue ? "Yes" : "No"}
                     </p>

                  </>
               ),
               (
                  <>
                     <p>
                        <b>Description</b>: {attributeDescriptor.description}
                     </p>

                     <p>
                        <b>Validation Regex</b>: {attributeDescriptor.validationRegex}
                     </p>

                  </>
               )

            ]

         })

      ),
      [attributeDescriptors, getAttributeValues]
   );



   return (

      <CustomTable
         headers={headers}
         data={data}
         hasDetails={true}
      />

   )

}