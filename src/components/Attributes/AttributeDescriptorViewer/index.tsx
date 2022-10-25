import { AttributeContentModel } from "models/attributes/AttributeContentModel"
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { attributeFieldNameTransform } from "utils/attributes";
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

         if (!attributeDescriptor.content) return "";

         if (Array.isArray(attributeDescriptor.content)) {

            return attributeDescriptor.content.map(
               content => content.value
            ).join(", ");

         } else {
            return (attributeDescriptor.content as AttributeContentModel).value;
         }


      },
      []

   );


   const headers: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name",
            width: "20%"
         },
         {
            id: "required",
            content: "Required",
            width: "10%"
         },
         {
            id: "defaultValue",
            content: "Default Value",
            width: "10%"
         }
      ],
      []

   );

   const data: TableDataRow[] = useMemo(

      () => attributeDescriptors.map(

         attributeDescriptor => ({

            id: attributeDescriptor.name,
            columns: [
               attributeDescriptor.label || attributeFieldNameTransform[attributeDescriptor.name] || attributeDescriptor.name,
               attributeDescriptor.required ? "Yes" : "No",
               getAttributeValues(attributeDescriptor).toString(),
               //getAttributeDetail(attributeDescriptor)
            ],
            detailColumns: [
               <></>,
               <></>,
               <></>,
               <CustomTable
                  headers={[{ id: "name", content: "Name" }, { id: "value", content: "Value" }]}
                  data={[
                     { id: "name", columns: [<b>Name</b>, attributeDescriptor.name] },
                     { id: "desc", columns: [<b>Description</b>, attributeDescriptor.description || "Not set"] },
                     { id: "label", columns: [<b>Label</b>, attributeDescriptor.label] },
                     { id: "group", columns: [<b>Group</b>, attributeDescriptor.group || "Not set"] },
                     { id: "type", columns: [<b>Type</b>, attributeDescriptor.type] },
                     { id: "required", columns: [<b>Required</b>, attributeDescriptor.required ? "Yes" : "No"] },
                     { id: "readOnly", columns: [<b>Read Only</b>, attributeDescriptor.readOnly ? "Yes" : "No"] },
                     { id: "list", columns: [<b>List</b>, attributeDescriptor.list ? "Yes" : "No"] },
                     { id: "muliValue", columns: [<b>Multiple Values</b>, attributeDescriptor.multiSelect ? "Yes" : "No"] },
                     { id: "validationRegex", columns: [<b>Validation Regex</b>, attributeDescriptor.validationRegex ? attributeDescriptor.validationRegex.toString() : "Not set"] },
                     {
                        id: "defaults", columns: [<b>Defaults</b>, attributeDescriptor.content
                           ?
                           Array.isArray(attributeDescriptor.content)
                              ?
                              attributeDescriptor.content.map(content => content.value.toString()).join(", ")
                              :
                              attributeDescriptor.content.value.toString()
                           : "Not set"
                        ]
                     },
                  ]}
                  hasHeader={false}
               />
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